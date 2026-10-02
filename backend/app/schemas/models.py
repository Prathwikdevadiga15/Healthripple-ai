from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel


class Facility(BaseModel):
    facility_id: str
    name: str
    facility_type: str
    district: str
    latitude: float
    longitude: float
    capacity: int
    safety_stock_days: int


class Medicine(BaseModel):
    medicine_id: str
    name: str
    criticality: str


class RiskItem(BaseModel):
    facility_id: str
    facility_name: str
    facility_type: str
    district: str
    medicine_id: str
    medicine_name: str
    current_stock: float
    predicted_daily_demand: float
    demand_trend_pct: float
    days_to_stockout_low: float
    days_to_stockout_high: float
    stockout_probability: float
    risk_band: str
    data_stale: bool
    confidence: float


class ExplainResponse(BaseModel):
    facility_id: str
    medicine_id: str
    explanation: str
    factors: List[str]
    confidence: dict


class SimulationRequest(BaseModel):
    scenario_key: str = "supplier_delay_10d"
    origin_facility: str
    medicine_id: str
    horizon_days: int = 15


class DayRiskPoint(BaseModel):
    day: int
    facility_id: str
    risk_score: float
    risk_band: str


class TransferOut(BaseModel):
    from_facility: str
    to_facility: str
    medicine_id: str
    quantity: int
    distance_km: float
    travel_time_hr: float


class SimulationResponse(BaseModel):
    scenario_key: str
    origin_facility: str
    medicine_id: str
    timeline: List[DayRiskPoint]
    facilities_at_risk_do_nothing: int
    facilities_at_risk_with_intervention: int
    regional_risk_before: float
    regional_risk_after: float
    reduction_pct: float
    recommended_transfers: List[TransferOut]
    unmet_facilities: List[str]


class CopilotQuery(BaseModel):
    question: str
    medicine_id: Optional[str] = None


class CopilotResponse(BaseModel):
    answer: str
    data: Optional[dict] = None
