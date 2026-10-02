from fastapi import APIRouter

from app.data_loader import facilities_df, routes_df
from app.services import risk_service

router = APIRouter()


@router.get("/ripple/network")
def get_network(medicine_id: str | None = None):
    """Nodes + edges for the supply-network graph visualization, with an optional
    per-node risk score (used to color the map/graph for a chosen medicine)."""
    fac = facilities_df()
    routes = routes_df()

    risk_by_facility = risk_service.baseline_risk_map(medicine_id) if medicine_id else {}

    nodes = [
        {
            "facility_id": r.facility_id,
            "name": r["name"],
            "facility_type": r.facility_type,
            "district": r.district,
            "lat": r.latitude,
            "lng": r.longitude,
            "risk_score": round(risk_by_facility.get(r.facility_id, 0), 1) if medicine_id else None,
        }
        for _, r in fac.iterrows()
    ]
    edges = [
        {
            "route_id": r.route_id, "from": r.from_facility, "to": r.to_facility,
            "distance_km": r.distance_km, "travel_time_hr": r.travel_time_hr,
        }
        for _, r in routes.iterrows()
    ]
    return {"nodes": nodes, "edges": edges}
