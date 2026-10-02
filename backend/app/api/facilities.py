from fastapi import APIRouter, HTTPException

from app.data_loader import facilities_df, medicines_df

router = APIRouter()


@router.get("/facilities")
def list_facilities(facility_type: str | None = None, district: str | None = None):
    df = facilities_df()
    if facility_type:
        df = df[df.facility_type == facility_type]
    if district:
        df = df[df.district == district]
    return df.to_dict(orient="records")


@router.get("/facilities/{facility_id}")
def get_facility(facility_id: str):
    df = facilities_df()
    row = df[df.facility_id == facility_id]
    if row.empty:
        raise HTTPException(404, "facility not found")
    return row.iloc[0].to_dict()


@router.get("/medicines")
def list_medicines():
    return medicines_df().to_dict(orient="records")
