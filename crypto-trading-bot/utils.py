import logging
import os
import sys
from logging.handlers import RotatingFileHandler
from typing import Optional

import requests
from rich.console import Console
from rich.logging import RichHandler

from config import LOG_DIR, LOG_FILE, LOG_LEVEL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID


_console = Console()


def ensure_log_dir_exists() -> None:
    if not os.path.isdir(LOG_DIR):
        os.makedirs(LOG_DIR, exist_ok=True)


def setup_logging() -> logging.Logger:
    ensure_log_dir_exists()

    level = getattr(logging, LOG_LEVEL.upper(), logging.INFO)

    logger = logging.getLogger("trading_bot")
    logger.setLevel(level)
    logger.propagate = False

    # Avoid duplicate handlers in notebooks/reloads
    if logger.handlers:
        return logger

    # File handler with rotation
    file_handler = RotatingFileHandler(LOG_FILE, maxBytes=2_000_000, backupCount=5)
    file_formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)

    # Rich console handler
    console_handler = RichHandler(console=_console, rich_tracebacks=True, show_time=False, show_path=False)
    console_formatter = logging.Formatter("%(message)s")
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)

    logger.debug("Logging initialized.")
    return logger


def notify_telegram(message: str) -> None:
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        requests.post(url, json={"chat_id": TELEGRAM_CHAT_ID, "text": message}, timeout=10)
    except Exception:
        # Do not raise, avoid breaking the bot from notification errors
        pass


def safe_float(value: Optional[float], default: float = 0.0) -> float:
    try:
        return float(value) if value is not None else default
    except Exception:
        return default


def position_size_from_risk(capital_usdt: float, risk_fraction: float, stop_loss_fraction: float, entry_price: float) -> float:
    """
    Computes position size in quote currency (USDT) based on risk and stop.
    Returns base amount in asset units (e.g., AVAX contracts), assuming linear USDT-margined futures.
    risk_per_trade = capital * risk_fraction = price_move_to_stop * position_notional
    price_move_to_stop = entry_price * stop_loss_fraction
    position_notional = risk_per_trade / price_move_to_stop
    base_amount = position_notional / entry_price
    """
    risk_usdt = max(capital_usdt * risk_fraction, 0.0)
    price_move_to_stop = max(entry_price * stop_loss_fraction, 1e-9)
    position_notional = risk_usdt / price_move_to_stop
    base_amount = position_notional / max(entry_price, 1e-9)
    return max(base_amount, 0.0)

