import sys
from pathlib import Path

from fastapi import APIRouter, HTTPException
from functools import lru_cache
import pandas as pd

from app.config import DATA_DIR

sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from ai.anomaly_detection.dosesignal_detector import detect_pattern, build_timeline

router = APIRouter()


@lru_cache(maxsize=1)
def _signals_df() -> pd.DataFrame:
    return pd.read_csv(DATA_DIR / "treatment_signals.csv")


@router.get("/dosesignal")
def list_dosesignal(status: str | None = None, limit: int = 100):
    df = _signals_df()
    out = []
    for _, r in df.iterrows():
        result = detect_pattern(int(r.expected_refill_day), int(r.actual_refill_day), str(r.symptom_trend), bool(r.treatment_change_logged))
        if status and result.status != status:
            continue
        out.append({
            "patient_id": r.patient_id,
            "medicine_name": r.medicine_name,
            "status": result.status,
            "refill_delay_days": result.refill_delay_days,
            "confidence": result.confidence,
        })
    out.sort(key=lambda x: (x["status"] != "possible_disruption", -x["confidence"]))
    return out[:limit]


@router.get("/dosesignal/{patient_id}")
def get_dosesignal_detail(patient_id: str):
    df = _signals_df()
    row = df[df.patient_id == patient_id]
    if row.empty:
        raise HTTPException(404, "patient not found")
    r = row.iloc[0]
    prescription_day = int(r.prescription_day)
    expected_refill_day = int(r.expected_refill_day)
    actual_refill_day = int(r.actual_refill_day)
    symptom_trend = str(r.symptom_trend)

    result = detect_pattern(expected_refill_day, actual_refill_day, symptom_trend, bool(r.treatment_change_logged))
    timeline = build_timeline(prescription_day, expected_refill_day, actual_refill_day, symptom_trend)

    summary = (
        f"Available signals are inconsistent with the expected treatment pattern for {patient_id}."
        if result.status == "possible_disruption"
        else f"Available signals are consistent with the expected treatment pattern for {patient_id}."
    )

    return {
        "patient_id": patient_id,
        "medicine_name": r.medicine_name,
        "status": result.status,
        "summary": summary,
        "refill_delay_days": result.refill_delay_days,
        "confidence": result.confidence,
        "possible_explanations": result.explanations,
        "timeline": timeline,
    }
