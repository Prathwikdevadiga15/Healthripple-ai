"""
Data loading layer.

The prototype reads the synthetic CSVs straight into pandas so the whole
stack runs with zero setup (no Postgres, no seed step). `database/schema.sql`
documents the real relational schema this would become in a production
deployment — swapping this module for real DB queries would not require
changing any API route, since routes only depend on the functions below.
"""
from __future__ import annotations

from functools import lru_cache

import pandas as pd

from app.config import DATA_DIR


@lru_cache(maxsize=1)
def load_all() -> dict[str, pd.DataFrame]:
    return {
        "facilities": pd.read_csv(DATA_DIR / "facilities.csv"),
        "medicines": pd.read_csv(DATA_DIR / "medicines.csv"),
        "routes": pd.read_csv(DATA_DIR / "routes.csv"),
        "inventory": pd.read_csv(DATA_DIR / "inventory.csv"),
        "consumption": pd.read_csv(DATA_DIR / "consumption.csv"),
        "treatment_signals": pd.read_csv(DATA_DIR / "treatment_signals.csv"),
    }


def facilities_df() -> pd.DataFrame:
    return load_all()["facilities"]


def medicines_df() -> pd.DataFrame:
    return load_all()["medicines"]


def routes_df() -> pd.DataFrame:
    return load_all()["routes"]


def inventory_df() -> pd.DataFrame:
    return load_all()["inventory"]


def consumption_df() -> pd.DataFrame:
    return load_all()["consumption"]


def treatment_signals_df() -> pd.DataFrame:
    return load_all()["treatment_signals"]


def consumption_series(facility_id: str, medicine_id: str) -> list[float]:
    df = consumption_df()
    sub = df[(df.facility_id == facility_id) & (df.medicine_id == medicine_id)].sort_values("day")
    return sub["consumption"].astype(float).tolist()
