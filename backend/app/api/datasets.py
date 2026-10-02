from collections.abc import Callable

import pandas as pd
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from app.config import DATA_DIR
from app.data_loader import (
    consumption_df,
    facilities_df,
    inventory_df,
    medicines_df,
    routes_df,
    treatment_signals_df,
)

router = APIRouter()

DATASETS: dict[str, tuple[str, Callable[[], pd.DataFrame]]] = {
    "consumption": ("Daily consumption", consumption_df),
    "facilities": ("Facilities", facilities_df),
    "inventory": ("Inventory", inventory_df),
    "medicines": ("Medicines", medicines_df),
    "routes": ("Supply routes", routes_df),
    "treatment_signals": ("Treatment signals", treatment_signals_df),
}

DATASET_FILES = {
    "consumption": "consumption.csv",
    "facilities": "facilities.csv",
    "inventory": "inventory.csv",
    "medicines": "medicines.csv",
    "routes": "routes.csv",
    "treatment_signals": "treatment_signals.csv",
}


@router.get("/datasets")
def list_datasets():
    return {
        "synthetic": True,
        "datasets": [
            {
                "id": dataset_id,
                "name": name,
                "total": len(load_frame()),
                "columns": list(load_frame().columns),
            }
            for dataset_id, (name, load_frame) in DATASETS.items()
        ],
    }


@router.get("/datasets/{dataset_id}")
def get_dataset_records(
    dataset_id: str,
    q: str = Query(default="", max_length=120),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
):
    dataset = DATASETS.get(dataset_id)
    if dataset is None:
        raise HTTPException(status_code=404, detail="dataset not found")

    frame = dataset[1]()
    if q:
        matches = frame.astype(str).apply(
            lambda column: column.str.contains(q, case=False, regex=False, na=False)
        ).any(axis=1)
        frame = frame[matches]

    total = len(frame)
    page = frame.iloc[offset : offset + limit].astype(object).where(pd.notna(frame), None)
    return {
        "dataset": dataset_id,
        "synthetic": True,
        "total": total,
        "offset": offset,
        "limit": limit,
        "records": page.to_dict(orient="records"),
    }


@router.get("/datasets/{dataset_id}/download")
def download_dataset(dataset_id: str):
    filename = DATASET_FILES.get(dataset_id)
    if filename is None:
        raise HTTPException(status_code=404, detail="dataset not found")
    return FileResponse(DATA_DIR / filename, media_type="text/csv", filename=filename)