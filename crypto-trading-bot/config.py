"""
Configuration for Bitget futures trading bot.

DO NOT hardcode secrets in code. Prefer environment variables or a .env file
mounted on your server. These placeholders can be overridden by environment
variables with the same names.
"""

import os


# --- Bitget API credentials ---
API_KEY = os.getenv("BITGET_API_KEY", "your_api_key")
API_SECRET = os.getenv("BITGET_API_SECRET", "your_api_secret")
API_PASSPHRASE = os.getenv("BITGET_API_PASSPHRASE", "your_passphrase")


# --- Trading configuration ---
SYMBOL = os.getenv("SYMBOL", "AVAX/USDT:USDT")  # Backward-compat for single symbol
SYMBOLS = [s.strip() for s in os.getenv("SYMBOLS", SYMBOL).split(",") if s.strip()]
LEVERAGE = int(os.getenv("LEVERAGE", "25"))
TIMEFRAME = os.getenv("TIMEFRAME", "15m")
EXCHANGE_ID = os.getenv("EXCHANGE_ID", "bitget")


# --- Risk management ---
CAPITAL = float(os.getenv("CAPITAL", "100"))  # USDT allocated to bot
RISK_PER_TRADE = float(os.getenv("RISK_PER_TRADE", "0.05"))  # 5%
STOP_LOSS = float(os.getenv("STOP_LOSS", "0.02"))  # 2%
TAKE_PROFIT = float(os.getenv("TAKE_PROFIT", "0.04"))  # 4%


# --- Strategy params ---
RSI_PERIOD = int(os.getenv("RSI_PERIOD", "14"))
EMA_FAST = int(os.getenv("EMA_FAST", "21"))
EMA_SLOW = int(os.getenv("EMA_SLOW", "55"))
USE_EMA_CONFIRMATION = os.getenv("USE_EMA_CONFIRMATION", "false").lower() == "true"


# --- Bracket management ---
# If true, attempts to manage SL/TP in-bot (monitor price and close on triggers).
# Exchange-native conditional orders can be added later; in-bot is more portable.
USE_IN_BOT_BRACKETS = os.getenv("USE_IN_BOT_BRACKETS", "true").lower() == "true"
STATE_FILE = os.getenv("STATE_FILE", os.path.join(LOG_DIR, "state.json"))


# --- Logging ---
LOG_DIR = os.getenv("LOG_DIR", "logs")
LOG_FILE = os.getenv("LOG_FILE", os.path.join(LOG_DIR, "trading.log"))
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")


# --- Telegram (optional) ---
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")


# --- Backtesting ---
BACKTEST_START = os.getenv("BACKTEST_START", "")  # ISO date string or empty
BACKTEST_END = os.getenv("BACKTEST_END", "")

