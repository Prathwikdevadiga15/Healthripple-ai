# Architecture

## Pipeline

```
RAW DATA (synthetic CSVs)
      |
  DATA LOADER (backend/app/data_loader.py)
      |
  +---+--------------------+
  |                        |
FORECASTING            ANOMALY DETECTION
(ai/forecasting)        (ai/anomaly_detection)
  |                        |
  +-----------+------------+
              |
        STOCKOUT / RISK ENGINE
     (ai/forecasting/stockout_predictor.py)
              |
        RIPPLE ENGINE
     (ai/ripple_engine/graph_model.py, propagation.py)
              |
        DIGITAL TWIN / WHAT-IF
     (ai/digital_twin/what_if.py)
              |
        OPTIMIZATION
     (ai/optimization/redistribution.py)
              |
        EXPLAINABILITY
     (ai/explainability/risk_explanation.py)
              |
        FASTAPI ROUTES (backend/app/api/*)
              |
        REACT FRONTEND (apps/web/src/pages/*)
              |
        HUMAN DECISION MAKER
```

## Development rule (why this scaffold is scoped the way it is)

The brief itself says: *"Build the MVP around the strongest core: MediRipple
+ CareFlow + Ripple Engine... The final prototype must have one excellent
end-to-end scenario... Do not sacrifice the core shortage prediction and
ripple simulation to build too many features."* This repository follows
that instruction literally — MediRipple, CareFlow, and the Ripple/What-If
engines are fully implemented and tested; DoseSignal is implemented as a
genuine secondary module (real detection logic, smaller dataset); nothing
production-sensitive (auth, real LLM calls, a live database) was stubbed
in to look complete without actually working.

## Ethical design

- **DoseSignal never claims certainty about medication adherence.** It
  reports whether available signals (refill timing, symptom trend) are or
  aren't consistent with the expected pattern, always alongside multiple
  neutral possible explanations and a confidence score.
- **Numerical forecasting is deterministic/statistical, not an LLM call**
  (`ai/forecasting/demand_forecaster.py` — rolling average + trend). The
  brief is explicit that an LLM should only be used for phrasing
  explanations from structured numbers, never for generating the numbers
  themselves.
- **Redistribution recommendations are advisory.** `database/schema.sql`'s
  `interventions` table models an approval workflow
  (`recommended -> approved/rejected -> completed`) rather than an
  auto-executing action.
- **Uncertainty is shown, not hidden.** Every stockout prediction returns a
  low/high day range and a confidence score
  (`ai/forecasting/stockout_predictor.py`); stale inventory data (3+ days
  old) is flagged rather than treated as zero.
- **All demo data is synthetic and labeled as such** throughout the UI and
  API responses (`disclaimer` fields, `README.md`'s banner).

## What a real deployment would change

1. Swap `backend/app/data_loader.py`'s CSV reads for SQLAlchemy queries
   against `database/schema.sql`.
2. Replace the greedy `ai/optimization/redistribution.py` allocator with an
   OR-Tools MILP for genuinely optimal, multi-constraint allocation.
3. Add the LLM seam noted in `ai/explainability/risk_explanation.py`
   (`generate_explanation`) to produce richer natural-language explanations
   from the same structured inputs.
4. Add authentication/RBAC (`database/schema.sql`'s `users` table already
   models roles: admin, health_authority, hospital, phc, analyst) and
   audit logging (`audit_logs` table).
5. Replace `ai/forecasting/demand_forecaster.py`'s trend model with a
   trained XGBoost/Prophet model once enough real historical data exists.
