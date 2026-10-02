"""
Stockout prediction.

Turns (current stock, forecast demand, replenishment schedule, data
freshness) into an estimated stockout window, a stockout probability,
and a risk band — deliberately not just `stock / daily_consumption`,
per the brief.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List

from ai.forecasting.demand_forecaster import DemandForecast


@dataclass
class StockoutPrediction:
    days_to_stockout_low: float
    days_to_stockout_high: float
    stockout_probability: float   # 0-1
    risk_band: str                # stable | watch | at_risk | critical
    data_stale: bool
    factors: List[str] = field(default_factory=list)


def predict_stockout(
    current_stock: float,
    forecast: DemandForecast,
    lead_time_days: float,
    safety_stock_days: float,
    last_updated_days_ago: int = 0,
) -> StockoutPrediction:
    demand = max(forecast.predicted_daily_demand, 0.01)
    days_cover = current_stock / demand

    # uncertainty widens the window: less confident forecast -> wider band
    spread = (1 - forecast.confidence) * 0.6 + 0.15
    low = max(0.0, days_cover * (1 - spread))
    high = days_cover * (1 + spread)

    factors: List[str] = []
    factors.append(f"Current inventory covers about {days_cover:.1f} days of projected demand")
    if forecast.trend_pct > 15:
        factors.append(f"Demand has increased {forecast.trend_pct:.0f}% versus the recent baseline")
    elif forecast.trend_pct < -15:
        factors.append(f"Demand has decreased {abs(forecast.trend_pct):.0f}% versus the recent baseline")
    factors.append(f"Next replenishment expected in {lead_time_days:.0f} day(s)")

    replenishment_gap = lead_time_days - days_cover
    # stockout probability: sigmoid-ish on how far replenishment lags coverage,
    # nudged by forecast confidence and safety-stock buffer
    x = (replenishment_gap / max(1.0, safety_stock_days)) * 2.2
    probability = 1 / (1 + pow(2.71828, -x))
    probability = max(0.02, min(0.98, probability))
    probability = round(probability * (0.7 + 0.3 * forecast.confidence), 2)

    data_stale = last_updated_days_ago >= 3
    if data_stale:
        factors.append(f"Inventory data is {last_updated_days_ago} day(s) old — estimate may be less reliable")
        probability = round(min(0.98, probability + 0.05), 2)

    if probability >= 0.75 or days_cover <= safety_stock_days * 0.4:
        band = "critical"
    elif probability >= 0.5 or days_cover <= safety_stock_days * 0.8:
        band = "at_risk"
    elif probability >= 0.3 or days_cover <= safety_stock_days * 1.3:
        band = "watch"
    else:
        band = "stable"

    return StockoutPrediction(
        days_to_stockout_low=round(low, 1),
        days_to_stockout_high=round(high, 1),
        stockout_probability=probability,
        risk_band=band,
        data_stale=data_stale,
        factors=factors,
    )
