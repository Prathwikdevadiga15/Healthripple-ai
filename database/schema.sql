-- HealthRipple AI — relational schema for a real (non-prototype) deployment.
-- The hackathon prototype backend reads the synthetic CSVs directly via
-- pandas (see backend/app/data_loader.py) so it runs with zero setup; this
-- schema is what those CSVs would become in a production database.

CREATE TABLE districts (
    district_id     SERIAL PRIMARY KEY,
    name            TEXT NOT NULL UNIQUE
);

CREATE TABLE facilities (
    facility_id         TEXT PRIMARY KEY,
    name                TEXT NOT NULL,
    facility_type       TEXT NOT NULL CHECK (facility_type IN ('warehouse','hospital','phc','clinic')),
    district_id         INTEGER REFERENCES districts(district_id),
    latitude            DOUBLE PRECISION NOT NULL,
    longitude           DOUBLE PRECISION NOT NULL,
    capacity            INTEGER NOT NULL,
    safety_stock_days   INTEGER NOT NULL,
    status              TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE medicines (
    medicine_id     TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    criticality     TEXT NOT NULL CHECK (criticality IN ('low','medium','high','critical'))
);

CREATE TABLE routes (
    route_id        TEXT PRIMARY KEY,
    from_facility   TEXT REFERENCES facilities(facility_id),
    to_facility     TEXT REFERENCES facilities(facility_id),
    distance_km     DOUBLE PRECISION NOT NULL,
    travel_time_hr  DOUBLE PRECISION NOT NULL
);

CREATE TABLE inventory (
    facility_id             TEXT REFERENCES facilities(facility_id),
    medicine_id             TEXT REFERENCES medicines(medicine_id),
    current_stock           NUMERIC NOT NULL,
    avg_daily_demand_30d    NUMERIC NOT NULL,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (facility_id, medicine_id)
);

CREATE TABLE consumption (
    id              BIGSERIAL PRIMARY KEY,
    facility_id     TEXT REFERENCES facilities(facility_id),
    medicine_id     TEXT REFERENCES medicines(medicine_id),
    day             DATE NOT NULL,
    consumption     NUMERIC NOT NULL,
    incoming_supply NUMERIC NOT NULL DEFAULT 0
);
CREATE INDEX idx_consumption_fac_med_day ON consumption (facility_id, medicine_id, day);

CREATE TABLE suppliers (
    supplier_id     TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    lead_time_days  INTEGER NOT NULL
);

CREATE TABLE shipments (
    shipment_id     TEXT PRIMARY KEY,
    supplier_id     TEXT REFERENCES suppliers(supplier_id),
    facility_id     TEXT REFERENCES facilities(facility_id),
    medicine_id     TEXT REFERENCES medicines(medicine_id),
    expected_date   DATE NOT NULL,
    actual_date     DATE,
    quantity        NUMERIC NOT NULL
);

-- DoseSignal (treatment-pattern intelligence) tables
CREATE TABLE prescriptions (
    prescription_id         TEXT PRIMARY KEY,
    patient_id              TEXT NOT NULL,   -- synthetic/pseudonymous identifier only
    medicine_id             TEXT REFERENCES medicines(medicine_id),
    prescription_date       DATE NOT NULL,
    expected_refill_date    DATE NOT NULL
);

CREATE TABLE treatment_signals (
    id                      BIGSERIAL PRIMARY KEY,
    prescription_id         TEXT REFERENCES prescriptions(prescription_id),
    actual_refill_date      DATE,
    symptom_score           INTEGER,
    symptom_trend           TEXT CHECK (symptom_trend IN ('improving','stable','worsening')),
    treatment_change_logged BOOLEAN NOT NULL DEFAULT false,
    follow_up_date          DATE
);

-- Risk / forecast / simulation outputs (written by the AI layer, read by the API)
CREATE TABLE risk_scores (
    id                      BIGSERIAL PRIMARY KEY,
    facility_id             TEXT REFERENCES facilities(facility_id),
    medicine_id             TEXT REFERENCES medicines(medicine_id),
    computed_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
    stockout_probability    NUMERIC NOT NULL,
    risk_band               TEXT NOT NULL,
    days_to_stockout_low    NUMERIC,
    days_to_stockout_high   NUMERIC,
    confidence              NUMERIC
);

CREATE TABLE simulation_scenarios (
    scenario_key    TEXT PRIMARY KEY,
    label           TEXT NOT NULL,
    shock_type      TEXT NOT NULL,
    default_severity NUMERIC NOT NULL DEFAULT 1.0
);

CREATE TABLE simulation_results (
    id                  BIGSERIAL PRIMARY KEY,
    scenario_key        TEXT REFERENCES simulation_scenarios(scenario_key),
    origin_facility     TEXT REFERENCES facilities(facility_id),
    medicine_id         TEXT REFERENCES medicines(medicine_id),
    run_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    regional_risk_before NUMERIC,
    regional_risk_after  NUMERIC,
    reduction_pct        NUMERIC,
    result_json          JSONB NOT NULL
);

CREATE TABLE interventions (
    id                  BIGSERIAL PRIMARY KEY,
    simulation_id        BIGINT REFERENCES simulation_results(id),
    from_facility         TEXT REFERENCES facilities(facility_id),
    to_facility           TEXT REFERENCES facilities(facility_id),
    medicine_id           TEXT REFERENCES medicines(medicine_id),
    quantity               NUMERIC NOT NULL,
    status                 TEXT NOT NULL DEFAULT 'recommended' CHECK (status IN ('recommended','approved','rejected','completed')),
    approved_by             TEXT,
    approved_at              TIMESTAMPTZ
);

CREATE TABLE alerts (
    id                  BIGSERIAL PRIMARY KEY,
    facility_id         TEXT REFERENCES facilities(facility_id),
    medicine_id         TEXT REFERENCES medicines(medicine_id),
    severity            TEXT NOT NULL,
    message             TEXT NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    acknowledged         BOOLEAN NOT NULL DEFAULT false
);

-- Users / access (prototype does not implement auth — see README "Security" section)
CREATE TABLE users (
    user_id         TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('admin','health_authority','hospital','phc','analyst')),
    facility_id     TEXT REFERENCES facilities(facility_id)
);

CREATE TABLE audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    user_id         TEXT REFERENCES users(user_id),
    action          TEXT NOT NULL,
    entity          TEXT,
    entity_id       TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
