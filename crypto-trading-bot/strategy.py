from dataclasses import dataclass
from typing import Literal, Optional

import numpy as np
import pandas as pd
from ta.momentum import RSIIndicator

from config import RSI_PERIOD, EMA_FAST, EMA_SLOW, USE_EMA_CONFIRMATION, ZONE_LOOKBACK, ZONE_PROXIMITY


Signal = Literal["long", "short", "hold"]


@dataclass
class StrategyOutput:
    signal: Signal
    rsi: float
    ema_fast: Optional[float]
    ema_slow: Optional[float]


def compute_indicators(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["rsi"] = RSIIndicator(close=df["close"], window=RSI_PERIOD).rsi()
    df["ema_fast"] = df["close"].ewm(span=EMA_FAST, adjust=False).mean()
    df["ema_slow"] = df["close"].ewm(span=EMA_SLOW, adjust=False).mean()
    return df


def rsi_strategy(df: pd.DataFrame) -> StrategyOutput:
    if df is None or df.empty or len(df) < max(RSI_PERIOD, EMA_SLOW) + 1:
        return StrategyOutput(signal="hold", rsi=float("nan"), ema_fast=None, ema_slow=None)

    df_ind = compute_indicators(df)
    last = df_ind.iloc[-1]

    rsi_value = float(last["rsi"])
    ema_fast_val = float(last["ema_fast"]) if not np.isnan(last["ema_fast"]) else None
    ema_slow_val = float(last["ema_slow"]) if not np.isnan(last["ema_slow"]) else None

    signal: Signal = "hold"
    if rsi_value < 30:
        signal = "long"
    elif rsi_value > 70:
        signal = "short"

    if USE_EMA_CONFIRMATION and ema_fast_val is not None and ema_slow_val is not None:
        if signal == "long" and not (ema_fast_val > ema_slow_val):
            signal = "hold"
        if signal == "short" and not (ema_fast_val < ema_slow_val):
            signal = "hold"

    return StrategyOutput(signal=signal, rsi=rsi_value, ema_fast=ema_fast_val, ema_slow=ema_slow_val)


# --- MTF helpers ---
def compute_bias_1h(df_1h: pd.DataFrame) -> str:
    if df_1h is None or df_1h.empty:
        return "neutral"
    ema_fast = df_1h["close"].ewm(span=EMA_FAST, adjust=False).mean().iloc[-1]
    ema_slow = df_1h["close"].ewm(span=EMA_SLOW, adjust=False).mean().iloc[-1]
    if ema_fast > ema_slow:
        return "bullish"
    if ema_fast < ema_slow:
        return "bearish"
    return "neutral"


def find_zones_15m(df_15m: pd.DataFrame) -> dict:
    df = df_15m.tail(max(ZONE_LOOKBACK, 5))
    swing_high = df["high"].max()
    swing_low = df["low"].min()
    return {"resistance": float(swing_high), "support": float(swing_low)}


def confirm_5m(df_5m: pd.DataFrame, bias: str, zones: dict, last_price: float) -> str:
    # proximity filter
    prox = ZONE_PROXIMITY
    res = zones["resistance"]
    sup = zones["support"]

    near_res = abs(last_price - res) / res <= prox
    near_sup = abs(last_price - sup) / sup <= prox

    rsi = RSIIndicator(close=df_5m["close"], window=RSI_PERIOD).rsi().iloc[-1]

    if bias == "bullish" and near_sup and rsi < 40:
        return "long"
    if bias == "bearish" and near_res and rsi > 60:
        return "short"
    return "hold"


