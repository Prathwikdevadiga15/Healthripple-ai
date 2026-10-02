from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import APP_NAME, API_PREFIX, CORS_ORIGINS
from app.api import facilities, inventory, risks, forecasting, ripple, simulation, interventions, copilot, dosesignal, datasets

app = FastAPI(
    title=APP_NAME,
    description="Healthcare Disruption Intelligence & Response Network — prototype API. "
                "All data is synthetic; see /docs for the interactive schema.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

app.include_router(facilities.router, prefix=API_PREFIX, tags=["facilities"])
app.include_router(inventory.router, prefix=API_PREFIX, tags=["inventory"])
app.include_router(risks.router, prefix=API_PREFIX, tags=["risk"])
app.include_router(forecasting.router, prefix=API_PREFIX, tags=["forecasting"])
app.include_router(ripple.router, prefix=API_PREFIX, tags=["ripple"])
app.include_router(simulation.router, prefix=API_PREFIX, tags=["simulation"])
app.include_router(interventions.router, prefix=API_PREFIX, tags=["interventions"])
app.include_router(copilot.router, prefix=API_PREFIX, tags=["copilot"])
app.include_router(dosesignal.router, prefix=API_PREFIX, tags=["dosesignal"])
app.include_router(datasets.router, prefix=API_PREFIX, tags=["datasets"])


@app.get("/api")
def root():
    return {
        "name": APP_NAME,
        "tagline": "Detect the Signal. Predict the Ripple. Protect the Care.",
        "docs": "/docs",
        "note": "Prototype API running on synthetic data — no real hospital, patient, or supply systems are connected.",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
