# HealthRipple AI

**Detect the Signal. Predict the Ripple. Protect the Care.**

An explainable AI platform for the Manipal Hackathon 2026 (M#26) Healthcare
track — *"From One Empty Shelf to a Regional Shortage."* It forecasts
medicine stockouts, simulates how a local shortage can ripple across a
healthcare supply network, and recommends explainable redistribution before
a shortage becomes regional.

> **Everything in this repository runs on synthetic data.** No real
> hospital, patient, or government system is connected. Every facility
> name, patient ID, and figure is fabricated for demonstration — see
> `scripts/generate_data.py`.

---

## What's actually implemented vs. what's documented for later

This scaffold follows the brief's own advice (`docs/architecture.md` §
"Development rule"): **build one excellent end-to-end scenario well**,
rather than thinly covering every feature in the full 40-section brief.

**Working end-to-end right now** (real code, tested, no mocked responses):
- Synthetic data generator (100 facilities, 20 medicines, 60 days of
  consumption/inventory/routes, 260 synthetic patient treatment signals)
- **MediRipple**: demand forecasting (trend-aware, not `stock ÷ demand`),
  stockout probability, data-freshness/uncertainty handling
- **CareFlow**: NetworkX supply-network graph + ripple propagation
  simulation across hops and time
- **What-If Simulator**: do-nothing vs. redistribution-intervention
  comparison with a real (greedy) optimizer, not canned numbers
- **DoseSignal**: treatment-pattern-deviation detection with neutral,
  non-accusatory language and multiple possible explanations
- **Explainability**: structured "why" breakdowns + confidence, for every
  risk score
- **Copilot**: answers supported questions from structured platform data;
  optional Groq phrasing never replaces the retrieved risk facts
- Full FastAPI backend (`backend/`) + React/TypeScript/Tailwind frontend
  (`apps/web/`), wired together and build-tested

**Documented but intentionally not built in this pass** (each has a clear
seam to slot into): a real Postgres-backed persistence layer (`database/schema.sql`
is the target schema; the prototype reads CSVs directly instead — see
`backend/app/data_loader.py`), authentication/RBAC/audit logging, OR-Tools-based optimization (the
current optimizer is a correct, explainable greedy allocator), Redis
caching, and CI/CD. None of these change the API shape if added later.

---

## Repository layout

```
apps/web/         React + TypeScript + Vite + Tailwind frontend
backend/          FastAPI backend (reads app/data_loader.py -> CSVs)
ai/               The actual "brain": forecasting, anomaly detection,
                   ripple engine, optimization, explainability, digital twin
data/synthetic/   Generated CSVs (run scripts/generate_data.py to rebuild)
database/         schema.sql — the target Postgres schema for a real deployment
scripts/          generate_data.py
docs/             architecture notes
docker-compose.yml, .env.example
```

## Running it

**Backend** (Python 3.11+):
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
# -> http://localhost:8000/docs for interactive API docs
```
To enable Groq phrasing, copy the root `.env.example` to `.env` and set
`GROQ_API_KEY` there. The key is read only by the backend; never put it in a
`VITE_*` variable or commit the `.env` file. Without a key, Copilot continues
to return deterministic structured-data answers. `GROQ_MODEL` can select a
different Groq-supported model.
The backend loads `data/synthetic/*.csv` on first request. If you want to
regenerate that data (different seed, more facilities, etc.):
```bash
python scripts/generate_data.py
```

**Frontend** (Node 18+):
```bash
cd apps/web
npm install
cp .env.example .env   # VITE_API_URL defaults to http://127.0.0.1:8000/api
npm run dev
# -> http://localhost:5173
```

**Or both via Docker:**
```bash
docker compose up --build
```
(`docker-compose.yml` also starts a Postgres container seeded with
`database/schema.sql` for exploring the target schema — the prototype API
itself doesn't require it. Docker Compose reads `GROQ_API_KEY` from the root
`.env` file when Groq is enabled.)

## Deploying on Vercel

The repository root is configured to build the Vite app and serve it with the
FastAPI API on one origin. Import the GitHub repository into Vercel with the
repository root as the project root; `main.py`, `pyproject.toml`, and
`requirements.txt` provide the FastAPI entrypoint, frontend build, and Python
dependencies. The Data Explorer uses `/api`, so no public API URL is needed.

`GROQ_API_KEY` is optional. Add it as a server-side Vercel environment variable
only if enabling Groq phrasing; never expose it through a `VITE_*` variable.
All bundled CSV records are synthetic demo data.

---

## The 5-minute demo script

This mirrors the brief's own recommended flow:

1. **Command Center** (`/app`) — regional overview: critical/at-risk counts,
   top priority risks.
2. **MediRipple** (`/app/mediripple`) — pick Insulin, see the ranked
   stockout-probability table. Click **WHY?** on the top row — the
   explanation names the exact contributing factors and confidence, not a
   black-box number.
3. **Ripple Simulator** (`/app/simulator`) — pick the same medicine,
   scenario "Supplier shipment delayed by 10 days," click **Simulate
   Ripple**. Watch the regional-risk timeline chart and the
   facilities-at-risk count climb over 15 simulated days.
4. Same page — scroll to **Recommended redistribution**: real transfers
   computed from actual surplus vs. actual need, with distance/ETA.
5. **CareFlow** (`/app/careflow`) — show the network graph colored by risk
   for the same medicine, so the propagation has a visual home.
6. **Reports** (`/app/reports`) — generate the regional risk report judges
   can skim in 30 seconds, with the "simulated data, verify before acting"
   disclaimer front and center.
7. **Copilot** (`/app/copilot`) — ask *"Which medicine has the highest
   shortage risk?"* live, to show the assistant is reading the same data
   judges just saw, not improvising.

## Ethical framing (see `docs/architecture.md` for the full list)

- DoseSignal never claims to know whether a dose was taken; it only ever
  says available signals are/aren't consistent with the expected pattern.
- All redistribution recommendations require human approval in a real
  deployment (`database/schema.sql`'s `interventions.status` models this).
- Every risk number ships with a confidence score and, where relevant, a
  data-freshness warning instead of silently treating stale data as zero.

## Team

- Team Name: _TBD_
- Track: Healthcare — "From One Empty Shelf to a Regional Shortage"
- Members: _TBD_
