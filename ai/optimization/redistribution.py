"""
Redistribution optimizer.

Given facilities with surplus and facilities at risk for the same
medicine, recommend transfers that reduce regional risk while respecting
each donor's safety stock. Uses a simple greedy allocation (largest
need first, nearest feasible surplus first) rather than a full MILP —
correct and explainable, and easy to swap for OR-Tools later without
changing the API shape.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List

import networkx as nx


@dataclass
class Transfer:
    from_facility: str
    to_facility: str
    medicine_id: str
    quantity: int
    distance_km: float
    travel_time_hr: float


@dataclass
class OptimizationResult:
    transfers: List[Transfer] = field(default_factory=list)
    unmet_facilities: List[str] = field(default_factory=list)


def recommend_redistribution(
    g: nx.DiGraph,
    medicine_id: str,
    at_risk: Dict[str, float],      # facility_id -> units needed to reach safety stock
    surplus: Dict[str, float],      # facility_id -> units available above its own safety stock
    max_distance_km: float = 120.0,
) -> OptimizationResult:
    result = OptimizationResult()
    remaining_need = dict(sorted(at_risk.items(), key=lambda kv: -kv[1]))
    remaining_surplus = dict(surplus)

    ug = g.to_undirected()

    for recipient, need in remaining_need.items():
        need_left = need
        if recipient not in ug:
            continue
        # candidate donors sorted by graph distance (hops) then edge distance
        try:
            lengths = nx.single_source_dijkstra_path_length(ug, recipient, weight="distance_km", cutoff=max_distance_km)
        except Exception:
            lengths = {}

        candidates = [
            (donor, dist) for donor, dist in lengths.items()
            if donor in remaining_surplus and remaining_surplus[donor] > 0 and donor != recipient
        ]
        candidates.sort(key=lambda c: c[1])

        for donor, dist_km in candidates:
            if need_left <= 0:
                break
            available = remaining_surplus[donor]
            qty = int(min(available, need_left))
            if qty <= 0:
                continue
            travel_hr = round(dist_km / 35, 2)
            result.transfers.append(Transfer(
                from_facility=donor, to_facility=recipient, medicine_id=medicine_id,
                quantity=qty, distance_km=round(dist_km, 1), travel_time_hr=travel_hr,
            ))
            remaining_surplus[donor] -= qty
            need_left -= qty

        if need_left > 0.5:
            result.unmet_facilities.append(recipient)

    return result


def simulate_intervention_impact(before_probs: Dict[str, float], transfers: List[Transfer], relief_per_unit: float = 0.0006) -> Dict[str, float]:
    """
    Rough, explainable estimate of post-intervention stockout probability:
    each unit transferred nudges the recipient's probability down, floored at 2%.
    Not a claim of real-world outcome — a simulated relief estimate for the demo.
    """
    after = dict(before_probs)
    received: Dict[str, int] = {}
    for t in transfers:
        received[t.to_facility] = received.get(t.to_facility, 0) + t.quantity
    for fid, qty in received.items():
        if fid in after:
            relief = min(0.9, qty * relief_per_unit)
            after[fid] = round(max(0.02, after[fid] - relief), 2)
    return after
