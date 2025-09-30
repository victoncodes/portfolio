import asyncio
import math
import time
from datetime import datetime, timezone
from typing import Any, Dict, Optional

import ccxt
import pandas as pd

from config import (
    API_KEY,
    API_SECRET,
    API_PASSPHRASE,
    EXCHANGE_ID,
    SYMBOL,
    TIMEFRAME,
    LEVERAGE,
    CAPITAL,
    RISK_PER_TRADE,
    STOP_LOSS,
    TAKE_PROFIT,
)
from strategy import rsi_strategy
from utils import notify_telegram, position_size_from_risk, setup_logging


logger = setup_logging()


def connect_exchange() -> ccxt.Exchange:
    exchange_class = getattr(ccxt, EXCHANGE_ID)
    exchange = exchange_class(
        {
            "apiKey": API_KEY,
            "secret": API_SECRET,
            "password": API_PASSPHRASE,
            "enableRateLimit": True,
            "options": {
                "defaultType": "swap",  # USDT-margined futures
            },
        }
    )
    return exchange


def set_leverage(exchange: ccxt.Exchange, symbol: str, leverage: int) -> None:
    try:
        # Bitget supports setLeverage in unified params
        exchange.set_leverage(leverage, symbol, params={"marginMode": "cross"})
        logger.info(f"Set leverage {leverage}x on {symbol}")
    except Exception as e:
        logger.warning(f"Failed to set leverage: {e}")


def fetch_candles(exchange: ccxt.Exchange, symbol: str, timeframe: str, limit: int = 300) -> pd.DataFrame:
    ohlcv = exchange.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
    df = pd.DataFrame(
        ohlcv, columns=["time", "open", "high", "low", "close", "volume"]
    )
    df["time"] = pd.to_datetime(df["time"], unit="ms", utc=True)
    df = df.astype({"open": float, "high": float, "low": float, "close": float, "volume": float})
    return df


def get_market_price(exchange: ccxt.Exchange, symbol: str) -> float:
    ticker = exchange.fetch_ticker(symbol)
    price = ticker.get("last") or ticker.get("ask") or ticker.get("bid")
    return float(price)


def get_positions_map(exchange: ccxt.Exchange, symbol: str) -> Dict[str, Any]:
    try:
        positions = exchange.fetch_positions([symbol])
    except Exception:
        positions = exchange.fetch_positions()
    by_symbol = {p.get("symbol"): p for p in positions if p.get("symbol") == symbol}
    return by_symbol


def close_position(exchange: ccxt.Exchange, symbol: str) -> None:
    positions = get_positions_map(exchange, symbol)
    pos = positions.get(symbol)
    if not pos:
        logger.info("No open position to close.")
        return

    contracts = float(pos.get("contracts") or pos.get("contractSize") or 0)
    side = pos.get("side")  # long/short
    amount = abs(float(pos.get("size") or pos.get("positionAmt") or 0))

    if amount <= 0:
        logger.info("Position size is zero; nothing to close.")
        return

    try:
        if side == "long":
            order = exchange.create_market_sell_order(symbol, amount)
        else:
            order = exchange.create_market_buy_order(symbol, amount)
        logger.info(f"Closed position {side} {amount} on {symbol} -> {order.get('id')}")
        notify_telegram(f"Closed {side} {amount} {symbol}")
    except Exception as e:
        logger.error(f"Error closing position: {e}")


def open_long(exchange: ccxt.Exchange, symbol: str, amount: float) -> Optional[Dict[str, Any]]:
    try:
        order = exchange.create_market_buy_order(symbol, amount)
        logger.info(f"Opened LONG {amount} on {symbol} -> {order.get('id')}")
        notify_telegram(f"Opened LONG {amount} {symbol}")
        return order
    except Exception as e:
        logger.error(f"Error opening long: {e}")
        return None


def open_short(exchange: ccxt.Exchange, symbol: str, amount: float) -> Optional[Dict[str, Any]]:
    try:
        order = exchange.create_market_sell_order(symbol, amount)
        logger.info(f"Opened SHORT {amount} on {symbol} -> {order.get('id')}")
        notify_telegram(f"Opened SHORT {amount} {symbol}")
        return order
    except Exception as e:
        logger.error(f"Error opening short: {e}")
        return None


def place_brackets(exchange: ccxt.Exchange, symbol: str, side: str, entry_price: float) -> None:
    try:
        # On many futures exchanges we can emulate TP/SL with conditional orders; here we keep it simple.
        tp_price = entry_price * (1 + TAKE_PROFIT) if side == "long" else entry_price * (1 - TAKE_PROFIT)
        sl_price = entry_price * (1 - STOP_LOSS) if side == "long" else entry_price * (1 + STOP_LOSS)
        logger.info(f"Bracket targets -> TP: {tp_price:.4f}, SL: {sl_price:.4f}")
        # Optionally, implement exchange-specific conditional orders here using exchange.create_order with params.
    except Exception as e:
        logger.warning(f"Failed to place bracket orders: {e}")


def run_once(exchange: ccxt.Exchange) -> None:
    df = fetch_candles(exchange, SYMBOL, TIMEFRAME)
    sig = rsi_strategy(df)
    logger.info(
        f"Signal: {sig.signal} | RSI: {sig.rsi:.2f} | EMAfast: {sig.ema_fast} | EMAslow: {sig.ema_slow}"
    )

    market_price = get_market_price(exchange, SYMBOL)
    amount = position_size_from_risk(CAPITAL, RISK_PER_TRADE, STOP_LOSS, market_price)

    # Round to exchange precision
    markets = exchange.load_markets()
    market = markets[SYMBOL]
    amount = exchange.amount_to_precision(SYMBOL, amount)

    # Close opposite positions before opening a new one
    positions = get_positions_map(exchange, SYMBOL)
    pos = positions.get(SYMBOL)
    current_side = pos.get("side") if pos else None

    if sig.signal == "long":
        if current_side == "short":
            close_position(exchange, SYMBOL)
        if float(amount) > 0:
            order = open_long(exchange, SYMBOL, float(amount))
            if order:
                place_brackets(exchange, SYMBOL, "long", market_price)
    elif sig.signal == "short":
        if current_side == "long":
            close_position(exchange, SYMBOL)
        if float(amount) > 0:
            order = open_short(exchange, SYMBOL, float(amount))
            if order:
                place_brackets(exchange, SYMBOL, "short", market_price)
    else:
        logger.info("Hold: no trade this interval.")


def main_loop() -> None:
    exchange = connect_exchange()
    try:
        exchange.load_markets()
        set_leverage(exchange, SYMBOL, LEVERAGE)
        logger.info(f"Connected to {exchange.id} | {SYMBOL} | tf={TIMEFRAME}")
        notify_telegram(f"Bot started on {SYMBOL} ({TIMEFRAME}) with {LEVERAGE}x")

        def timeframe_to_seconds(tf: str) -> int:
            tf = tf.strip().lower()
            if tf.endswith("m"):
                return int(tf[:-1]) * 60
            if tf.endswith("h"):
                return int(tf[:-1]) * 60 * 60
            if tf.endswith("d"):
                return int(tf[:-1]) * 24 * 60 * 60
            # default to 15m
            return 15 * 60

        def seconds_until_next_candle(tf: str) -> int:
            interval = timeframe_to_seconds(tf)
            now = time.time()
            # Sleep until the next boundary + small buffer
            return int(interval - (now % interval) + 1)

        # Run once immediately, then align to candle boundaries
        try:
            run_once(exchange)
        except Exception as e:
            logger.exception(f"Error on initial run: {e}")

        while True:
            try:
                sleep_s = seconds_until_next_candle(TIMEFRAME)
                logger.info(f"Sleeping {sleep_s}s until next {TIMEFRAME} candle...")
                time.sleep(max(sleep_s, 10))
                run_once(exchange)
            except ccxt.InsufficientFunds as e:
                logger.error(f"Insufficient funds: {e}")
                notify_telegram("Insufficient funds error")
            except ccxt.AuthenticationError as e:
                logger.error(f"Authentication error: {e}")
                notify_telegram("Authentication error")
            except Exception as e:
                logger.exception(f"Unhandled error: {e}")
                notify_telegram(f"Error: {e}")
    finally:
        try:
            exchange.close()
        except Exception:
            pass


if __name__ == "__main__":
    main_loop()

