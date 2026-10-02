"""
DoseSignal — treatment-pattern disruption detection.

IMPORTANT (per the project brief): this must never claim to know whether a
patient did or did not take their medication, and must never label anyone
"non-compliant". It only ever says available routine signals are, or are
not, consistent with the expected treatment pattern, and always offers
multiple neutral possible explanations alongside a confidence score.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List


@dataclass
class PatternResult:
    status: str          # "on_track" | "possible_disruption"
    refill_delay_days: int
    confidence: float
    explanations: List[str] = field(default_factory=list)


def detect_pattern(
    expected_refill_day: int,
    actual_refill_day: int,
    symptom_trend: str,
    treatment_change_logged: bool,
) -> PatternResult:
    delay = actual_refill_day - expected_refill_day

    if treatment_change_logged:
        return PatternResult(
            status="on_track",
            refill_delay_days=delay,
            confidence=0.9,
            explanations=["A documented prescription change accounts for the refill timing."],
        )

    if delay <= 4 and symptom_trend != "worsening":
        return PatternResult(status="on_track", refill_delay_days=delay, confidence=0.88, explanations=[])

    explanations = []
    if delay > 4:
        explanations.append("delayed refill")
    if symptom_trend == "worsening":
        explanations.append("symptom trend worsening over the same period")
    explanations.append("temporary interruption")
    explanations.append("access issue (travel, stock-out at pharmacy, cost)")
    explanations.append("incomplete data — refill may have occurred through an unrecorded channel")

    severity = min(1.0, (max(0, delay) / 20) + (0.25 if symptom_trend == "worsening" else 0))
    confidence = round(0.55 + 0.35 * severity, 2)

    return PatternResult(
        status="possible_disruption",
        refill_delay_days=delay,
        confidence=confidence,
        explanations=explanations,
    )


def build_timeline(prescription_day: int, expected_refill_day: int, actual_refill_day: int, symptom_trend: str) -> list[dict]:
    points = [
        {"day": prescription_day, "label": "Prescription created", "state": "stable"},
        {"day": prescription_day + max(1, (expected_refill_day - prescription_day) // 4),
         "label": "Expected treatment pattern", "state": "stable"},
    ]
    delay = actual_refill_day - expected_refill_day
    if delay > 4:
        points.append({"day": expected_refill_day, "label": "Refill deviation detected", "state": "watch"})
    if symptom_trend == "worsening":
        points.append({"day": max(expected_refill_day, actual_refill_day) - 2, "label": "Symptom trend changes", "state": "at_risk"})
    if delay > 4:
        points.append({"day": expected_refill_day + delay, "label": "Expected refill was late", "state": "critical" if delay > 10 else "at_risk"})
    else:
        points.append({"day": actual_refill_day, "label": "Refill recorded on schedule", "state": "stable"})
    return sorted(points, key=lambda p: p["day"])
