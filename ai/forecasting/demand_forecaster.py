"""
Demand forecasting.

Deliberately NOT an LLM call — per the project brief, numerical forecasting
should use a deterministic/statistical model, not a language model. This
uses a rolling-average baseline plus a simple linear trend over the most
recent window, which is enough to demonstrate "demand is accelerating"
without needing a heavyweight training pipeline for a hackathon prototype.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Sequence


@dataclass
class DemandForecast:
    predicted_daily_demand: float
    recent_avg: float
    baseline_avg: float
    trend_pct: float          # % change of recent window vs baseline window
    confidence: float         # 0-1, lower when data is sparse or very noisy


def forecast_demand(daily_consumption: Sequence[float], recent_window: int = 10, baseline_window: int = 30) -> DemandForecast:
    """
    daily_consumption: chronological list of daily consumption (oldest -> newest).
    """
    if not daily_consumption:
        return DemandForecast(0, 0, 0, 0.0, confidence=0.0)

    series = list(daily_consumption)
    recent = series[-recent_window:] if len(series) >= recent_window else series
    baseline_slice = series[-baseline_window:-recent_window] if len(series) > baseline_window else series[: max(1, len(series) - recent_window)]
    baseline_slice = baseline_slice or series

    recent_avg = sum(recent) / len(recent)
    baseline_avg = sum(baseline_slice) / len(baseline_slice)

    trend_pct = 0.0 if baseline_avg == 0 else ((recent_avg - baseline_avg) / baseline_avg) * 100

    # simple linear extrapolation: project recent trend forward a little
    predicted = recent_avg * (1 + max(-0.5, min(1.5, trend_pct / 100)) * 0.3)

    # confidence shrinks with short/noisy history
    n = len(series)
    data_confidence = min(1.0, n / baseline_window)
    variance = _variance(recent)
    noise_penalty = 0.0 if recent_avg == 0 else min(0.35, (variance ** 0.5) / (recent_avg + 1e-6) * 0.25)
    confidence = max(0.3, round(data_confidence - noise_penalty, 2))

    return DemandForecast(
        predicted_daily_demand=round(predicted, 1),
        recent_avg=round(recent_avg, 1),
        baseline_avg=round(baseline_avg, 1),
        trend_pct=round(trend_pct, 1),
        confidence=confidence,
    )


def _variance(xs: Sequence[float]) -> float:
    if not xs:
        return 0.0
    m = sum(xs) / len(xs)
    return sum((x - m) ** 2 for x in xs) / len(xs)
