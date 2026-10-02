"""
Digital twin / what-if orchestrator.

Ties forecasting, anomaly detection, the ripple engine, and the
redistribution optimizer together into named scenarios judges can trigger
from the UI — this is the "one killer demo" module the brief calls out.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List

import networkx as nx

from ai.ripple_engine.propagation import simulate_ripple, RippleResult
from ai.optimization.redistribution import recommend_redistribution, simulate_intervention_impact, OptimizationResult

SCENARIOS = {
    "supplier_delay_10d": {"shock_type": "supplier_delay", "severity": 1.0, "label": "Supplier shipment delayed by 10 days"},
    "demand_surge_30pct": {"shock_type": "demand_surge", "severity": 0.75, "label": "Medicine demand increases by 30%"},
    "facility_unavailable": {"shock_type": "facility_unavailable", "severity": 1.3, "label": "A facility becomes temporarily unavailable"},
}


@dataclass
class ScenarioComparison:
    ripple: RippleResult
    facilities_at_risk_do_nothing: int
    facilities_at_risk_with_intervention: int
    regional_risk_before: float
    regional_risk_after: float
    optimization: OptimizationResult
    reduction_pct: float = 0.0


def run_scenario(
    g: nx.DiGraph,
    scenario_key: str,
    origin_facility: str,
    medicine_id: str,
    baseline_risk: Dict[str, float],
    surplus_by_facility: Dict[str, float],
    horizon_days: int = 15,
) -> ScenarioComparison:
    cfg = SCENARIOS.get(scenario_key, SCENARIOS["supplier_delay_10d"])
    ripple = simulate_ripple(
        g, origin_facility, baseline_risk,
        shock_type=cfg["shock_type"], severity=cfg["severity"], horizon_days=horizon_days,
    )

    final_day = horizon_days
    final_probs = {
        s.facility_id: s.risk_score / 100 for s in ripple.timeline if s.day == final_day
    }
    at_risk_ids = {fid for fid, p in final_probs.items() if p >= 0.5}
    # "need" in units: a rough proxy — scale need by how far over the 0.5 risk threshold they are
    need = {fid: max(50, round((final_probs[fid] - 0.3) * 800)) for fid in at_risk_ids}

    opt = recommend_redistribution(g, medicine_id, need, surplus_by_facility)
    after_probs = simulate_intervention_impact(final_probs, opt.transfers)

    at_risk_after = sum(1 for p in after_probs.values() if p >= 0.5)
    regional_before = round(max(final_probs.values()) * 100, 1) if final_probs else 0.0
    regional_after = round(max(after_probs.values()) * 100, 1) if after_probs else 0.0
    reduction = 0.0 if regional_before == 0 else round((1 - regional_after / regional_before) * 100, 1)

    return ScenarioComparison(
        ripple=ripple,
        facilities_at_risk_do_nothing=len(at_risk_ids),
        facilities_at_risk_with_intervention=at_risk_after,
        regional_risk_before=regional_before,
        regional_risk_after=regional_after,
        optimization=opt,
        reduction_pct=reduction,
    )
