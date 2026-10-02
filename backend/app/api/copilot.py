"""
HealthRipple Copilot.

Answers a handful of the brief's example questions by querying the
platform's own structured risk data — never a generic open-ended LLM
call. This is a small rule-based intent matcher; the one seam marked
below is where a real LLM would be dropped in later purely to phrase
the answer, with the underlying numbers still coming from here.
"""
from __future__ import annotations

import json
import logging
import re
from functools import lru_cache

from fastapi import APIRouter
from groq import Groq
from pydantic import BaseModel, Field

from app.config import GROQ_API_KEY, GROQ_MODEL
from app.data_loader import facilities_df
from app.services import risk_service

router = APIRouter()
logger = logging.getLogger(__name__)


class CopilotRequest(BaseModel):
    question: str = Field(min_length=1, max_length=1000)
    medicine_id: str | None = None


@lru_cache(maxsize=1)
def _groq_client() -> Groq | None:
    if not GROQ_API_KEY:
        return None
    return Groq(api_key=GROQ_API_KEY, timeout=15.0, max_retries=0)


def _answer_from_data(payload: dict) -> dict:
    question = (payload.get("question") or "").strip()
    q = question.lower()

    if "highest" in q and ("risk" in q or "shortage" in q):
        items = risk_service.risk_list(limit=2000)
        if not items:
            return {"answer": "No risk data is available yet.", "data": None}
        top = items[0]
        return {
            "answer": f"{top['medicine_name']} at {top['facility_name']} currently has the highest shortage "
                      f"risk in the network — a {round(top['stockout_probability']*100)}% estimated stockout "
                      f"probability, classified {top['risk_band'].replace('_',' ')}.",
            "data": top,
        }

    if "surplus" in q:
        med_id = payload.get("medicine_id") or "MED-01"
        surplus = risk_service.surplus_map(med_id)
        if not surplus:
            return {"answer": f"No confirmed surplus facilities found for {med_id} right now.", "data": None}
        fac = facilities_df().set_index("facility_id")
        top = sorted(surplus.items(), key=lambda kv: -kv[1])[:5]
        named = [f"{fac.loc[fid]['name']} ({int(qty)} units)" for fid, qty in top]
        return {"answer": "Facilities with surplus: " + ", ".join(named) + ".", "data": dict(top)}

    if "within" in q and ("day" in q or "days" in q):
        m = re.search(r"(\d+)\s*day", q)
        window = int(m.group(1)) if m else 10
        items = risk_service.risk_list(limit=2000)
        soon = [i for i in items if i["days_to_stockout_high"] <= window]
        soon.sort(key=lambda i: i["days_to_stockout_low"])
        names = [f"{i['facility_name']} ({i['medicine_name']})" for i in soon[:8]]
        answer = (
            f"{len(soon)} facility/medicine pairs may face a stockout within {window} days"
            + (": " + ", ".join(names) + ("…" if len(soon) > 8 else "") if names else ".")
        )
        return {"answer": answer, "data": {"count": len(soon), "window_days": window}}

    if "regional" in q and ("shortage" in q or "risk" in q):
        items = risk_service.risk_list(limit=2000)
        critical = [i for i in items if i["risk_band"] == "critical"]
        at_risk = [i for i in items if i["risk_band"] == "at_risk"]
        return {
            "answer": f"Across the network: {len(critical)} facility/medicine pairs are critical and "
                      f"{len(at_risk)} are at risk. The highest-priority item is "
                      f"{items[0]['medicine_name']} at {items[0]['facility_name']}." if items else "No data available.",
            "data": {"critical": len(critical), "at_risk": len(at_risk)},
        }

    if "report" in q:
        return {
            "answer": "Use the Reports page (GET /api/reports/regional-risk) to generate the full "
                      "regional risk report with top-risk items, primary causes, and a disclaimer "
                      "that this is simulated prototype data.",
            "data": None,
        }

    if "why" in q:
        return {
            "answer": "Ask 'why' from a specific facility's risk panel (GET /api/risk/explain?facility_id=..."
                      "&medicine_id=...) and I'll break down the exact contributing factors and confidence "
                      "for that facility/medicine pair.",
            "data": None,
        }

    return {
        "answer": "I can answer questions about highest shortage risk, surplus facilities, facilities at risk "
                  "within N days, the current regional shortage picture, or point you to the full report. "
                  "Try asking one of those, or use the What-If Simulator for 'what happens if…' questions.",
        "data": None,
    }


@router.get("/copilot/status")
def copilot_status():
    return {"provider": "groq" if GROQ_API_KEY else "structured", "groq_configured": bool(GROQ_API_KEY)}


@router.post("/copilot")
def ask_copilot(payload: CopilotRequest):
    question = payload.question.strip()
    if not question:
        return {"answer": "Please enter a question.", "data": None, "provider": "structured"}

    response = _answer_from_data({"question": question, "medicine_id": payload.medicine_id})
    client = _groq_client()
    if client is None or response.get("data") is None:
        response["provider"] = "structured"
        return response

    try:
        completion = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are HealthRipple Copilot, a healthcare supply-risk assistant. "
                        "Rewrite the supplied answer clearly and concisely using only the supplied evidence. "
                        "Preserve every number, name, and risk classification exactly. Never invent facts, "
                        "diagnose patients, or provide treatment instructions. The data is synthetic and "
                        "all real-world actions require human verification. If evidence is insufficient, say so."
                    ),
                },
                {
                    "role": "user",
                    "content": json.dumps(
                        {"question": question, "current_answer": response["answer"], "evidence": response["data"]},
                        ensure_ascii=True,
                    ),
                },
            ],
            temperature=0.1,
            max_tokens=240,
        )
        answer = completion.choices[0].message.content
        if answer and answer.strip():
            response["answer"] = answer.strip()
            response["provider"] = "groq"
            return response
    except Exception:
        logger.warning("Groq Copilot request failed; returning the structured answer.", exc_info=True)

    response["provider"] = "structured"
    return response
