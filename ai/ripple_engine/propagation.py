"""
Ripple propagation engine.

Simulates how a shock at one facility (a supplier delay, a demand surge,
or a facility going fully unavailable) can raise risk at nearby facilities
over time, as demand pressure redistributes across the network. This is
the "what happens next" layer that turns a single low-stock alert into a
regional-shortage forecast.

The model is intentionally simple and explainable (linear decay by hop
distance and elapsed time) rather than a trained model — the brief asks
for reasoning that can be shown to judges, not a black box.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Literal

import networkx as nx

ShockType = Literal["supplier_delay", "demand_surge", "facility_unavailable"]


@dataclass
class DayState:
    day: int
    facility_id: str
    risk_score: float   # 0-100
    risk_band: str


@dataclass
class RippleResult:
    origin_facility: str
    shock_type: ShockType
    timeline: List[DayState] = field(default_factory=list)
    facilities_at_risk_final: int = 0
    peak_regional_risk: float = 0.0


def _band(score: float) -> str:
    if score >= 75:
        return "critical"
    if score >= 50:
        return "at_risk"
    if score >= 28:
        return "watch"
    return "stable"


def simulate_ripple(
    g: nx.DiGraph,
    origin_facility: str,
    baseline_risk: Dict[str, float],
    shock_type: ShockType = "supplier_delay",
    severity: float = 1.0,        # 0-1.5ish, how bad the shock is
    horizon_days: int = 15,
    max_hops: int = 3,
) -> RippleResult:
    """
    baseline_risk: {facility_id: risk_score 0-100} before the shock,
    typically derived from each facility's own stockout_probability * 100.
    """
    ug = g.to_undirected()
    hop_distance = nx.single_source_shortest_path_length(ug, origin_facility, cutoff=max_hops)

    result = RippleResult(origin_facility=origin_facility, shock_type=shock_type)
    scores = dict(baseline_risk)

    # shock shape: ramps up over the first ~40% of the horizon, then plateaus
    ramp_days = max(2, int(horizon_days * 0.4))

    for day in range(horizon_days + 1):
        ramp = min(1.0, day / ramp_days)
        origin_boost = 55 * severity * ramp
        scores[origin_facility] = min(100, baseline_risk.get(origin_facility, 20) + origin_boost)

        for fid, hops in hop_distance.items():
            if fid == origin_facility or hops == 0:
                continue
            # pressure decays with hop distance and takes a few days to arrive
            arrival_day = hops * 2
            if day < arrival_day:
                continue
            local_ramp = min(1.0, (day - arrival_day) / max(1, ramp_days))
            decay = 0.55 ** hops
            boost = origin_boost * decay * local_ramp * 0.65
            scores[fid] = min(100, baseline_risk.get(fid, 15) + boost)

        for fid, score in scores.items():
            if fid == origin_facility or fid in hop_distance:
                result.timeline.append(DayState(day=day, facility_id=fid, risk_score=round(score, 1), risk_band=_band(score)))

    final_day = horizon_days
    final_scores = {s.facility_id: s.risk_score for s in result.timeline if s.day == final_day}
    result.facilities_at_risk_final = sum(1 for v in final_scores.values() if v >= 50)
    result.peak_regional_risk = round(max(final_scores.values()), 1) if final_scores else 0.0
    return result


def regional_risk_summary(timeline: List[DayState], day: int) -> Dict[str, int]:
    counts = {"stable": 0, "watch": 0, "at_risk": 0, "critical": 0}
    for s in timeline:
        if s.day == day:
            counts[s.risk_band] += 1
    return counts
