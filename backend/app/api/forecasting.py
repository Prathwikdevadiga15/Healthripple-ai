from fastapi import APIRouter, HTTPException

from app.data_loader import consumption_series
from app.services import risk_service

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from ai.forecasting.demand_forecaster import forecast_demand
from ai.anomaly_detection.consumption_anomaly import detect_anomaly, possible_explanations

router = APIRouter()


@router.get("/forecast")
def get_forecast(facility_id: str, medicine_id: str):
    series = consumption_series(facility_id, medicine_id)
    if not series:
        raise HTTPException(404, "no consumption history for that facility/medicine")
    fc = forecast_demand(series)
    anomaly = detect_anomaly(series)
    return {
        "facility_id": facility_id,
        "medicine_id": medicine_id,
        "history": series,
        "forecast": fc.__dict__,
        "anomaly": {**anomaly.__dict__, "possible_explanations": possible_explanations(anomaly.label)},
    }


@router.get("/risk-full")
def get_risk_with_explanation(facility_id: str, medicine_id: str):
    """Convenience endpoint: risk numbers + explanation in one call, for a facility detail panel."""
    try:
        item = risk_service.compute_risk_item(facility_id, medicine_id)
        item.pop("_factors", None)
        expl = risk_service.explain(facility_id, medicine_id)
        return {**item, "explanation": expl["explanation"], "confidence_breakdown": expl["confidence"]}
    except ValueError as e:
        raise HTTPException(404, str(e))
