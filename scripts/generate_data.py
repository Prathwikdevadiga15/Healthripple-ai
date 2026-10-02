"""
HealthRipple AI — synthetic data generator.

Generates a fully synthetic healthcare supply network so the prototype
can run end-to-end with zero external data or API keys. Nothing here is
real facility, patient, or supply data — every name and figure is
fabricated for demonstration.

Run: python scripts/generate_data.py
Writes CSVs to data/synthetic/.
"""
import csv
import math
import os
import random

random.seed(42)

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "synthetic")
os.makedirs(OUT_DIR, exist_ok=True)

DISTRICTS = [
    "Riverside", "Northgate", "Old Town", "Hillview", "Lakeside",
    "Eastfield", "Westbrook", "Greenpark", "Harborview", "Sunrise",
]

FACILITY_TYPES = ["warehouse", "hospital", "phc", "clinic"]

MEDICINES = [
    ("MED-01", "Insulin", "critical"),
    ("MED-02", "Amoxicillin", "high"),
    ("MED-03", "Paracetamol", "low"),
    ("MED-04", "ORS", "medium"),
    ("MED-05", "Metformin", "high"),
    ("MED-06", "Amlodipine", "medium"),
    ("MED-07", "Salbutamol Inhaler", "high"),
    ("MED-08", "Oxytocin", "critical"),
    ("MED-09", "Ceftriaxone", "critical"),
    ("MED-10", "Iron-Folic Acid", "low"),
    ("MED-11", "Diazepam", "medium"),
    ("MED-12", "ORS-Zinc Kit", "medium"),
    ("MED-13", "Azithromycin", "high"),
    ("MED-14", "Vitamin A", "low"),
    ("MED-15", "Tetanus Toxoid", "medium"),
    ("MED-16", "Adrenaline", "critical"),
    ("MED-17", "Hydrocortisone", "high"),
    ("MED-18", "Normal Saline (IV)", "high"),
    ("MED-19", "Rabies Vaccine", "critical"),
    ("MED-20", "Cough Syrup", "low"),
]


def gen_facilities(n_warehouses=5, n_hospitals=20, n_phc=55, n_clinic=20):
    facilities = []
    fid = 1
    # simple synthetic coordinate box (not a real place)
    base_lat, base_lng = 12.90, 74.85

    def add(ftype, district, capacity, safety_days):
        nonlocal fid
        lat = base_lat + random.uniform(-0.35, 0.35)
        lng = base_lng + random.uniform(-0.35, 0.35)
        facilities.append({
            "facility_id": f"F{fid:04d}",
            "name": f"{ftype.capitalize()} {fid:03d} ({district})",
            "facility_type": ftype,
            "district": district,
            "latitude": round(lat, 5),
            "longitude": round(lng, 5),
            "capacity": capacity,
            "safety_stock_days": safety_days,
        })
        fid += 1

    for _ in range(n_warehouses):
        add("warehouse", random.choice(DISTRICTS), capacity=50000, safety_days=14)
    for _ in range(n_hospitals):
        add("hospital", random.choice(DISTRICTS), capacity=8000, safety_days=10)
    for _ in range(n_phc):
        add("phc", random.choice(DISTRICTS), capacity=1500, safety_days=7)
    for _ in range(n_clinic):
        add("clinic", random.choice(DISTRICTS), capacity=600, safety_days=5)
    return facilities


def gen_routes(facilities):
    warehouses = [f for f in facilities if f["facility_type"] == "warehouse"]
    others = [f for f in facilities if f["facility_type"] != "warehouse"]
    routes = []
    rid = 1
    # every non-warehouse facility connects to its nearest 1-2 warehouses
    for f in others:
        dists = sorted(
            warehouses,
            key=lambda w: (w["latitude"] - f["latitude"]) ** 2 + (w["longitude"] - f["longitude"]) ** 2,
        )
        for w in dists[:2]:
            dist_km = round(haversine_km(f["latitude"], f["longitude"], w["latitude"], w["longitude"]), 1)
            routes.append({
                "route_id": f"R{rid:04d}",
                "from_facility": w["facility_id"],
                "to_facility": f["facility_id"],
                "distance_km": dist_km,
                "travel_time_hr": round(dist_km / 35, 2),  # ~35 km/h average
            })
            rid += 1
    # a few lateral hospital<->hospital / hospital<->phc redistribution routes
    hospitals = [f for f in facilities if f["facility_type"] == "hospital"]
    for _ in range(40):
        a, b = random.sample(hospitals + [f for f in facilities if f["facility_type"] == "phc"], 2)
        dist_km = round(haversine_km(a["latitude"], a["longitude"], b["latitude"], b["longitude"]), 1)
        routes.append({
            "route_id": f"R{rid:04d}",
            "from_facility": a["facility_id"],
            "to_facility": b["facility_id"],
            "distance_km": dist_km,
            "travel_time_hr": round(dist_km / 35, 2),
        })
        rid += 1
    return routes


def haversine_km(lat1, lon1, lat2, lon2):
    r = 6371
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def gen_inventory_and_consumption(facilities, medicines, days=60):
    inventory_rows = []
    consumption_rows = []
    non_warehouse = [f for f in facilities if f["facility_type"] != "warehouse"]

    # pick a handful of "scripted" facilities to carry the demo scenario
    scripted = random.sample(non_warehouse, min(6, len(non_warehouse)))
    scripted_ids = {f["facility_id"] for f in scripted}

    for f in non_warehouse:
        base_type_factor = {"hospital": 1.0, "phc": 0.3, "clinic": 0.15}[f["facility_type"]]
        for med_id, med_name, criticality in medicines:
            crit_factor = {"critical": 1.4, "high": 1.15, "medium": 1.0, "low": 0.8}[criticality]
            avg_daily = max(1, round(random.uniform(4, 40) * base_type_factor * crit_factor))
            stock = round(avg_daily * random.uniform(8, 30))

            for day in range(days):
                trend = 1.0
                # inject a demand surge in the last ~12 days for scripted facilities + insulin/critical meds
                if f["facility_id"] in scripted_ids and day > days - 14 and criticality in ("critical", "high"):
                    surge_progress = (day - (days - 14)) / 14
                    trend = 1.0 + 1.6 * surge_progress

                daily_demand = max(0, round(random.gauss(avg_daily * trend, avg_daily * 0.12)))
                incoming = 0
                # weekly-ish replenishment, sometimes delayed for scripted facilities near the end
                if day % 9 == 0:
                    delay = 0
                    if f["facility_id"] in scripted_ids and day > days - 14:
                        delay = random.choice([0, 0, 10])  # sometimes a 10-day supplier delay
                    if delay == 0:
                        incoming = round(avg_daily * random.uniform(7, 11))

                opening = stock
                closing = max(0, opening - daily_demand + incoming)
                stock = closing

                consumption_rows.append({
                    "facility_id": f["facility_id"], "medicine_id": med_id, "day": day,
                    "consumption": daily_demand, "incoming_supply": incoming,
                })
                if day == days - 1:  # only persist the latest snapshot to inventory.csv
                    inventory_rows.append({
                        "facility_id": f["facility_id"], "medicine_id": med_id,
                        "current_stock": closing, "avg_daily_demand_30d": avg_daily,
                        "last_updated_days_ago": 0 if f["facility_id"] in scripted_ids else random.choice([0, 0, 0, 1, 2, 5]),
                    })
    return inventory_rows, consumption_rows


def gen_treatment_signals(n_patients=260, days=60):
    """
    Synthetic prescription/refill/symptom signals for DoseSignal.
    Entirely fabricated patient IDs — no real health data.
    """
    rows = []
    for i in range(1, n_patients + 1):
        patient_id = f"P{i:04d}"
        med_id, med_name, _crit = random.choice(MEDICINES)
        cycle_length = random.choice([28, 30, 30, 30, 60])
        prescription_day = random.randint(0, max(1, days - cycle_length - 5))
        expected_refill_day = prescription_day + cycle_length

        # ~30% of patients show a meaningful refill deviation this cycle
        deviates = random.random() < 0.3
        if deviates:
            delay = random.randint(6, 16)
            symptom_trend = random.choice(["worsening", "worsening", "stable"])
            treatment_change_logged = random.random() < 0.25  # sometimes the delay IS explained
        else:
            delay = random.randint(-2, 3)
            symptom_trend = random.choice(["stable", "improving"])
            treatment_change_logged = False

        actual_refill_day = expected_refill_day + delay
        symptom_score = {"worsening": random.randint(6, 9), "stable": random.randint(3, 5), "improving": random.randint(1, 3)}[symptom_trend]

        rows.append({
            "patient_id": patient_id,
            "medicine_id": med_id,
            "medicine_name": med_name,
            "prescription_day": prescription_day,
            "expected_refill_day": expected_refill_day,
            "actual_refill_day": actual_refill_day,
            "symptom_score": symptom_score,
            "symptom_trend": symptom_trend,
            "treatment_change_logged": treatment_change_logged,
        })
    return rows


def write_csv(path, rows, fieldnames):
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)


def main():
    facilities = gen_facilities()
    routes = gen_routes(facilities)
    inventory, consumption = gen_inventory_and_consumption(facilities, MEDICINES)
    treatment_signals = gen_treatment_signals()

    write_csv(os.path.join(OUT_DIR, "facilities.csv"), facilities,
              ["facility_id", "name", "facility_type", "district", "latitude", "longitude", "capacity", "safety_stock_days"])
    write_csv(os.path.join(OUT_DIR, "medicines.csv"),
              [{"medicine_id": m[0], "name": m[1], "criticality": m[2]} for m in MEDICINES],
              ["medicine_id", "name", "criticality"])
    write_csv(os.path.join(OUT_DIR, "routes.csv"), routes,
              ["route_id", "from_facility", "to_facility", "distance_km", "travel_time_hr"])
    write_csv(os.path.join(OUT_DIR, "inventory.csv"), inventory,
              ["facility_id", "medicine_id", "current_stock", "avg_daily_demand_30d", "last_updated_days_ago"])
    write_csv(os.path.join(OUT_DIR, "consumption.csv"), consumption,
              ["facility_id", "medicine_id", "day", "consumption", "incoming_supply"])
    write_csv(os.path.join(OUT_DIR, "treatment_signals.csv"), treatment_signals,
              ["patient_id", "medicine_id", "medicine_name", "prescription_day", "expected_refill_day",
               "actual_refill_day", "symptom_score", "symptom_trend", "treatment_change_logged"])

    print(f"facilities: {len(facilities)}")
    print(f"routes: {len(routes)}")
    print(f"inventory rows: {len(inventory)}")
    print(f"consumption rows: {len(consumption)}")
    print(f"treatment signal rows: {len(treatment_signals)}")
    print(f"written to {os.path.abspath(OUT_DIR)}")


if __name__ == "__main__":
    main()
