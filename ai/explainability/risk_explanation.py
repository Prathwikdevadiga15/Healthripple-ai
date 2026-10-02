"""
Explainability layer.

Turns structured risk-engine output into a plain-language "why" — this is
what a real LLM call would typically be used for in the full architecture
(structured facts in, natural-language explanation out). The prototype
uses a template-based generator so it runs with zero API keys; the
`generate_explanation` function is the single seam where a real LLM call
would slot in later without changing any caller.
"""
from __future__ import annotations

from typing import Dict, List


def generate_explanation(
    facility_name: str,
    medicine_name: str,
    stockout_probability: float,
    risk_band: str,
    factors: List[str],
    nearby_surplus: List[Dict] | None = None,
) -> str:
    pct = round(stockout_probability * 100)
    lines = [
        f"{facility_name} is classified {risk_band.replace('_', ' ')} for {medicine_name} "
        f"with an estimated stockout probability of {pct}%."
    ]
    if factors:
        lines.append("Contributing factors: " + "; ".join(factors) + ".")
    if nearby_surplus:
        parts = [f"{s['name']} ({s['units']} units)" for s in nearby_surplus[:3]]
        lines.append("Nearby surplus available at: " + ", ".join(parts) + ".")
    else:
        lines.append("No confirmed nearby surplus was found for this medicine in the current scan.")
    return " ".join(lines)


def confidence_breakdown(demand_confidence: float, data_freshness_ok: bool, network_confidence: float = 0.85) -> Dict[str, float]:
    return {
        "demand_forecast_confidence": round(demand_confidence, 2),
        "data_freshness_confidence": 0.95 if data_freshness_ok else 0.55,
        "regional_propagation_confidence": round(network_confidence, 2),
        "overall_confidence": round(
            (demand_confidence + (0.95 if data_freshness_ok else 0.55) + network_confidence) / 3, 2
        ),
    }
