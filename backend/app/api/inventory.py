from fastapi import APIRouter

from app.data_loader import inventory_df

router = APIRouter()


@router.get("/inventory")
def list_inventory(facility_id: str | None = None, medicine_id: str | None = None, limit: int = 200):
    df = inventory_df()
    if facility_id:
        df = df[df.facility_id == facility_id]
    if medicine_id:
        df = df[df.medicine_id == medicine_id]
    return df.head(limit).to_dict(orient="records")
