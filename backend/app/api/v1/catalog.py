from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.models import Medication, DrugSchedule
from app.schemas.schemas import MedicationResponse
from app.services.formulary_service import CDSCOFormularyService

router = APIRouter(prefix="/catalog", tags=["Medication Catalog"])

BOOTSTRAP_MEDICATIONS = [
    {
        "brand_name": "Gelusil MPS Mint Syrup",
        "generic_composition": "Aluminium Hydroxide 250mg + Magnesium Hydroxide 250mg + Simethicone 50mg",
        "cdsco_category": "OTC",
        "drug_schedule": DrugSchedule.OTC,
        "prescription_required": False,
        "dosage_form": "Suspension",
        "pack_size": "200 ml Bottle",
        "mrp_inr": 142.0,
        "selling_price_inr": 128.0,
        "stock_quantity": 48,
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    },
    {
        "brand_name": "Dolo 650 Tablets",
        "generic_composition": "Paracetamol IP 650mg",
        "cdsco_category": "OTC",
        "drug_schedule": DrugSchedule.OTC,
        "prescription_required": False,
        "dosage_form": "Tablet",
        "pack_size": "15 Tablets / Strip",
        "mrp_inr": 34.0,
        "selling_price_inr": 31.0,
        "stock_quantity": 120,
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60",
    },
    {
        "brand_name": "Pan-D Capsules",
        "generic_composition": "Pantoprazole Sodium 40mg + Domperidone 30mg SR",
        "cdsco_category": "Prescription Only",
        "drug_schedule": DrugSchedule.SCHEDULE_H,
        "prescription_required": True,
        "dosage_form": "Capsule",
        "pack_size": "15 Capsules / Strip",
        "mrp_inr": 235.0,
        "selling_price_inr": 215.0,
        "stock_quantity": 30,
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60",
    },
    {
        "brand_name": "Patanjali Divya Gasahar Churna",
        "generic_composition": "Ajwain + Sonth + Kala Namak + Hing",
        "cdsco_category": "AYUSH",
        "drug_schedule": DrugSchedule.AYUSH,
        "prescription_required": False,
        "dosage_form": "Powder",
        "pack_size": "100 g Jar",
        "mrp_inr": 90.0,
        "selling_price_inr": 85.0,
        "stock_quantity": 65,
        "image_url": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60",
    },
]

@router.get("", response_model=List[MedicationResponse])
async def list_medications(
    schedule: str = Query(None, description="Filter by DrugSchedule: OTC, SCHEDULE_H, AYUSH"),
    db: AsyncSession = Depends(get_db)
):
    """
    List medications with CDSCO 2026 scheduling and pricing.
    """
    result = await db.execute(select(Medication))
    meds = result.scalars().all()

    # Bootstrap if empty
    if not meds:
        for item in BOOTSTRAP_MEDICATIONS:
            m = Medication(**item)
            db.add(m)
        await db.commit()
        result = await db.execute(select(Medication))
        meds = result.scalars().all()

    if schedule:
        meds = [m for m in meds if m.drug_schedule.value == schedule.upper()]

    return [
        MedicationResponse(
            id=m.id,
            brand_name=m.brand_name,
            generic_composition=m.generic_composition,
            cdsco_category=m.cdsco_category,
            drug_schedule=m.drug_schedule,
            prescription_required=m.prescription_required,
            dosage_form=m.dosage_form,
            pack_size=m.pack_size,
            mrp_inr=m.mrp_inr,
            selling_price_inr=m.selling_price_inr,
            stock_quantity=m.stock_quantity,
            image_url=m.image_url,
        )
        for m in meds
    ]

@router.post("/verify-dispense")
async def verify_dispense(
    generic_composition: str,
    patient_age: int = 30,
    is_pregnant: bool = False,
):
    """
    Verify whether a requested medication can be safely dispensed over the counter.
    """
    return CDSCOFormularyService.verify_medication_dispense(
        generic_composition=generic_composition,
        patient_age=patient_age,
        is_pregnant=is_pregnant,
    )
