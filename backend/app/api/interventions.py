from fastapi import APIRouter
from datetime import date

from app.services import risk_service

router = APIRouter()


@router.get("/interventions")
def get_interventions(medicine_id: str):
    """Redistribution recommendations based on *current* risk (no shock simulation) —
    'what should we do right now', as opposed to /simulation's 'what if X happens'."""
    g = risk_service.get_graph()
    baseline = risk_service.baseline_risk_map(medicine_id)
    surplus = risk_service.surplus_map(medicine_id)
    at_risk = {fid: score for fid, score in baseline.items() if score >= 50}
    need = {fid: max(50, round((score / 100 - 0.3) * 800)) for fid, score in at_risk.items()}

    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
    from ai.optimization.redistribution import recommend_redistribution

    result = recommend_redistribution(g, medicine_id, need, surplus)
    return {
        "medicine_id": medicine_id,
        "facilities_at_risk": len(at_risk),
        "transfers": [t.__dict__ for t in result.transfers],
        "unmet_facilities": result.unmet_facilities,
    }


@router.get("/reports/regional-risk")
def regional_risk_report(medicine_id: str | None = None):
    items = risk_service.risk_list(medicine_id=medicine_id, limit=2000)
    top_risk = items[:10]
    critical = [i for i in items if i["risk_band"] == "critical"]
    at_risk = [i for i in items if i["risk_band"] == "at_risk"]

    causes = set()
    for i in top_risk:
        if i["demand_trend_pct"] > 15:
            causes.add("Increased consumption")
        if i["data_stale"]:
            causes.add("Stale inventory data at one or more facilities")
    if any(i["stockout_probability"] > 0.6 for i in top_risk):
        causes.add("Replenishment delay relative to projected demand")
    if not causes:
        causes.add("Uneven inventory distribution across the region")

    return {
        "generated_on": str(date.today()),
        "summary": {
            "facilities_scanned": len(items),
            "critical_count": len(critical),
            "at_risk_count": len(at_risk),
        },
        "top_risk_medicines_facilities": top_risk,
        "primary_causes": sorted(causes),
        "disclaimer": "Generated from simulated prototype data. Verify against live systems before acting.",
    }
