from fastapi import APIRouter, HTTPException

from app.schemas.models import SimulationRequest
from app.services import risk_service

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from ai.digital_twin.what_if import run_scenario, SCENARIOS

router = APIRouter()


@router.get("/simulation/scenarios")
def list_scenarios():
    return [{"key": k, **v} for k, v in SCENARIOS.items()]


@router.post("/simulation")
def run_simulation(req: SimulationRequest):
    g = risk_service.get_graph()
    if req.origin_facility not in g.nodes:
        raise HTTPException(404, "unknown origin_facility")

    baseline = risk_service.baseline_risk_map(req.medicine_id)
    surplus = risk_service.surplus_map(req.medicine_id)

    result = run_scenario(
        g, req.scenario_key, req.origin_facility, req.medicine_id,
        baseline, surplus, horizon_days=req.horizon_days,
    )

    return {
        "scenario_key": req.scenario_key,
        "origin_facility": req.origin_facility,
        "medicine_id": req.medicine_id,
        "timeline": [t.__dict__ for t in result.ripple.timeline],
        "facilities_at_risk_do_nothing": result.facilities_at_risk_do_nothing,
        "facilities_at_risk_with_intervention": result.facilities_at_risk_with_intervention,
        "regional_risk_before": result.regional_risk_before,
        "regional_risk_after": result.regional_risk_after,
        "reduction_pct": result.reduction_pct,
        "recommended_transfers": [t.__dict__ for t in result.optimization.transfers],
        "unmet_facilities": result.optimization.unmet_facilities,
    }
