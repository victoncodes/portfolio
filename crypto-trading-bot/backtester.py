import argparse
from dataclasses import dataclass
from typing import List

import ccxt
import pandas as pd

from config import EXCHANGE_ID, SYMBOL, TIMEFRAME
from strategy import rsi_strategy


@dataclass
class Trade:
    side: str
    entry_price: float
    exit_price: float
    entry_time: pd.Timestamp
    exit_time: pd.Timestamp


def fetch_history(limit: int = 1000) -> pd.DataFrame:
    exchange_class = getattr(ccxt, EXCHANGE_ID)
    exchange = exchange_class({"enableRateLimit": True, "options": {"defaultType": "swap"}})
    ohlcv = exchange.fetch_ohlcv(SYMBOL, timeframe=TIMEFRAME, limit=limit)
    df = pd.DataFrame(ohlcv, columns=["time", "open", "high", "low", "close", "volume"])
    df["time"] = pd.to_datetime(df["time"], unit="ms", utc=True)
    return df


def backtest(df: pd.DataFrame):
    trades: List[Trade] = []
    position_side = None
    entry_price = None
    entry_time = None

    for i in range(len(df)):
        window = df.iloc[: i + 1]
        sig = rsi_strategy(window)
        price = float(window.iloc[-1]["close"])
        now = window.iloc[-1]["time"]

        if sig.signal == "long":
            if position_side == "short":
                trades.append(Trade("short", entry_price, price, entry_time, now))
                position_side = None
            if position_side is None:
                position_side = "long"
                entry_price = price
                entry_time = now
        elif sig.signal == "short":
            if position_side == "long":
                trades.append(Trade("long", entry_price, price, entry_time, now))
                position_side = None
            if position_side is None:
                position_side = "short"
                entry_price = price
                entry_time = now

    # Close last open trade at final close
    if position_side is not None:
        last_price = float(df.iloc[-1]["close"])
        last_time = df.iloc[-1]["time"]
        trades.append(Trade(position_side, entry_price, last_price, entry_time, last_time))

    # Stats
    pnls = []
    for t in trades:
        if t.side == "long":
            pnls.append((t.exit_price - t.entry_price) / t.entry_price)
        else:
            pnls.append((t.entry_price - t.exit_price) / t.entry_price)

    total_pnl = sum(pnls)
    wins = sum(1 for p in pnls if p > 0)
    losses = sum(1 for p in pnls if p <= 0)
    win_rate = wins / len(pnls) * 100 if pnls else 0

    print(f"Trades: {len(trades)} | Win rate: {win_rate:.2f}% | PnL: {total_pnl*100:.2f}%")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=1000)
    args = parser.parse_args()

    df = fetch_history(limit=args.limit)
    backtest(df)


if __name__ == "__main__":
    main()

