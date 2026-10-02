from fastapi import APIRouter, HTTPException

from app.services import risk_service

router = APIRouter()


@router.get("/risk")
def get_risk(medicine_id: str | None = None, facility_type: str | None = None, limit: int = 500):
    return risk_service.risk_list(medicine_id=medicine_id, facility_type=facility_type, limit=limit)


@router.get("/risk/explain")
def explain_risk(facility_id: str, medicine_id: str):
    try:
        return risk_service.explain(facility_id, medicine_id)
    except ValueError as e:
        raise HTTPException(404, str(e))


@router.get("/risk/radar")
def shortage_radar(limit: int = 20):
    """Top-N highest-risk (facility, medicine) pairs across the whole network."""
    items = risk_service.risk_list(limit=2000)
    return items[:limit]


@router.get("/risk/factors")
def risk_factors(facility_id: str, medicine_id: str):
    """Five-factor risk breakdown (inventory/demand/supplier/network/facility) for the radar chart —
    derived transparently from the same computed risk item, never fabricated."""
    try:
        return risk_service.risk_factor_breakdown(facility_id, medicine_id)
    except (ValueError, KeyError) as e:
        raise HTTPException(404, str(e))
