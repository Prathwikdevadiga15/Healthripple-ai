"""
Risk computation service — the glue between the raw data loader and the
AI engine (ai/forecasting, ai/anomaly_detection). API routes call these
functions rather than touching the AI modules directly, so the routes
stay thin and the AI layer stays reusable/testable on its own.
"""
from __future__ import annotations

import sys
from pathlib import Path
from typing import Dict, List, Optional

# make the top-level `ai/` package importable regardless of where uvicorn is launched from
sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from ai.forecasting.demand_forecaster import forecast_demand
from ai.forecasting.stockout_predictor import predict_stockout, StockoutPrediction
from ai.ripple_engine.graph_model import build_graph
from ai.explainability.risk_explanation import generate_explanation, confidence_breakdown

from app.data_loader import facilities_df, medicines_df, routes_df, inventory_df, consumption_series

_LEAD_TIME_DAYS = 9  # synthetic default replenishment lead time used across the demo


def _facility_row(facility_id: str):
    return facilities_df().set_index("facility_id").loc[facility_id]


def _medicine_row(medicine_id: str):
    return medicines_df().set_index("medicine_id").loc[medicine_id]


def compute_risk_item(facility_id: str, medicine_id: str) -> dict:
    fac = _facility_row(facility_id)
    med = _medicine_row(medicine_id)
    inv = inventory_df()
    inv_row = inv[(inv.facility_id == facility_id) & (inv.medicine_id == medicine_id)]
    if inv_row.empty:
        raise ValueError(f"no inventory row for {facility_id}/{medicine_id}")
    inv_row = inv_row.iloc[0]

    series = consumption_series(facility_id, medicine_id)
    fc = forecast_demand(series)
    pred: StockoutPrediction = predict_stockout(
        current_stock=float(inv_row.current_stock),
        forecast=fc,
        lead_time_days=_LEAD_TIME_DAYS,
        safety_stock_days=float(fac.safety_stock_days),
        last_updated_days_ago=int(inv_row.last_updated_days_ago),
    )

    return {
        "facility_id": facility_id,
        "facility_name": fac["name"],
        "facility_type": fac.facility_type,
        "district": fac.district,
        "medicine_id": medicine_id,
        "medicine_name": med["name"],
        "current_stock": float(inv_row.current_stock),
        "predicted_daily_demand": fc.predicted_daily_demand,
        "demand_trend_pct": fc.trend_pct,
        "days_to_stockout_low": pred.days_to_stockout_low,
        "days_to_stockout_high": pred.days_to_stockout_high,
        "stockout_probability": pred.stockout_probability,
        "risk_band": pred.risk_band,
        "data_stale": pred.data_stale,
        "confidence": fc.confidence,
        "_factors": pred.factors,
    }


def risk_list(medicine_id: Optional[str] = None, facility_type: Optional[str] = None, limit: int = 500) -> List[dict]:
    inv = inventory_df()
    fac = facilities_df()
    if medicine_id:
        inv = inv[inv.medicine_id == medicine_id]
    if facility_type:
        ids = set(fac[fac.facility_type == facility_type].facility_id)
        inv = inv[inv.facility_id.isin(ids)]

    items = []
    for _, row in inv.head(limit).iterrows():
        try:
            item = compute_risk_item(row.facility_id, row.medicine_id)
            item.pop("_factors", None)
            items.append(item)
        except Exception:
            continue
    items.sort(key=lambda x: -x["stockout_probability"])
    return items


def explain(facility_id: str, medicine_id: str) -> dict:
    item = compute_risk_item(facility_id, medicine_id)
    fac = facilities_df()
    inv = inventory_df()
    inv_med = inv[inv.medicine_id == medicine_id].set_index("facility_id")

    surplus = []
    neighbors = fac[fac.district == item["district"]]
    for _, n in neighbors.iterrows():
        if n.facility_id == facility_id or n.facility_id not in inv_med.index:
            continue
        r = inv_med.loc[n.facility_id]
        safety_units = r.avg_daily_demand_30d * n.safety_stock_days
        if r.current_stock > safety_units * 1.4:
            surplus.append({"name": n["name"], "units": int(r.current_stock - safety_units)})
    surplus.sort(key=lambda s: -s["units"])

    explanation = generate_explanation(
        item["facility_name"], item["medicine_name"], item["stockout_probability"],
        item["risk_band"], item["_factors"], surplus,
    )
    conf = confidence_breakdown(item["confidence"], not item["data_stale"])
    return {
        "facility_id": facility_id, "medicine_id": medicine_id,
        "explanation": explanation, "factors": item["_factors"], "confidence": conf,
    }


def baseline_risk_map(medicine_id: str) -> Dict[str, float]:
    fac = facilities_df()
    inv = inventory_df()
    inv_med = inv[inv.medicine_id == medicine_id].set_index("facility_id")
    out: Dict[str, float] = {}
    for fid in fac.facility_id:
        if fid in inv_med.index:
            r = inv_med.loc[fid]
            days_cover = r.current_stock / max(1, r.avg_daily_demand_30d)
            out[fid] = float(min(90, max(8, 100 - days_cover * 4)))
        else:
            out[fid] = 12.0  # warehouses etc. with no direct facility-level inventory row
    return out


def surplus_map(medicine_id: str) -> Dict[str, float]:
    fac = facilities_df().set_index("facility_id")
    inv = inventory_df()
    inv_med = inv[inv.medicine_id == medicine_id]
    out: Dict[str, float] = {}
    for _, r in inv_med.iterrows():
        f = fac.loc[r.facility_id]
        safety_units = r.avg_daily_demand_30d * f.safety_stock_days
        if r.current_stock > safety_units * 1.5:
            out[r.facility_id] = round(r.current_stock - safety_units)
    return out


def get_graph():
    return build_graph(facilities_df(), routes_df())


def risk_factor_breakdown(facility_id: str, medicine_id: str) -> dict:
    """
    Decomposes the already-computed risk into five named factors for the
    radar visualization. This is a transparent re-derivation of real
    computed fields (stockout prediction, forecast trend, ripple exposure)
    into 0-100 sub-scores — never fabricated numbers. The formula for each
    factor is documented inline so it can be audited/challenged.
    """
    item = compute_risk_item(facility_id, medicine_id)
    fac = _facility_row(facility_id)

    # INVENTORY: how little runway current stock gives, relative to safety stock
    days_cover = item["current_stock"] / max(0.01, item["predicted_daily_demand"])
    inventory_score = max(0, min(100, 100 - (days_cover / max(1, fac.safety_stock_days)) * 40))

    # DEMAND: how far demand has accelerated vs. its own recent baseline
    demand_score = max(0, min(100, 50 + item["demand_trend_pct"] * 1.2))

    # SUPPLIER: how the fixed lead time compares to days of cover left (proxy
    # for "will replenishment arrive before stock runs out")
    supplier_score = max(0, min(100, (( _LEAD_TIME_DAYS - days_cover) / max(1, _LEAD_TIME_DAYS)) * 100 + 30))

    # NETWORK: how many same-district facilities are themselves elevated risk
    # for this medicine right now (ripple exposure proxy)
    inv = inventory_df()
    inv_med = inv[inv.medicine_id == medicine_id]
    fac_df = facilities_df()
    district_ids = set(fac_df[fac_df.district == item["district"]].facility_id) - {facility_id}
    neighbor_rows = inv_med[inv_med.facility_id.isin(district_ids)]
    if len(neighbor_rows):
        elevated = (neighbor_rows.current_stock / neighbor_rows.avg_daily_demand_30d.clip(lower=1) < fac.safety_stock_days).mean()
        network_score = round(float(elevated) * 100, 1)
    else:
        network_score = 20.0

    # FACILITY: data freshness + how close current stock is to facility capacity
    # (a facility running near-empty relative to its own capacity is more exposed)
    utilization = item["current_stock"] / max(1, fac.capacity)
    facility_score = max(0, min(100, (1 - utilization) * 60 + (25 if item["data_stale"] else 0)))

    factors = {
        "inventory": round(inventory_score, 1),
        "demand": round(demand_score, 1),
        "supplier": round(supplier_score, 1),
        "network": round(network_score, 1),
        "facility": round(facility_score, 1),
    }
    overall = round(sum(factors.values()) / len(factors), 1)
    return {"facility_id": facility_id, "medicine_id": medicine_id, "overall": overall, "factors": factors}
