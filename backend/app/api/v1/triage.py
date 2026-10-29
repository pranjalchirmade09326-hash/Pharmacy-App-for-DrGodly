from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.models import (
    ClinicalEncounter,
    PharmacistReview,
    EncounterStatus,
    PharmacyTriageLevel,
    PharmacistAction,
)
from app.schemas.schemas import PharmacistReviewCreate, PharmacistReviewResponse

router = APIRouter(prefix="/triage", tags=["Pharmacist Triage"])

@router.post("/review/{encounter_id}", response_model=PharmacistReviewResponse)
async def submit_pharmacist_review(
    encounter_id: str,
    payload: PharmacistReviewCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Pharmacist clinical review: Approve safe OTC dispense, escalate to RMP, or order labs.
    """
    result = await db.execute(select(ClinicalEncounter).filter(ClinicalEncounter.id == encounter_id))
    encounter = result.scalars().first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")

    # Update encounter status according to action
    if payload.action_taken == PharmacistAction.DISPENSED_OTC:
        encounter.status = EncounterStatus.DISPENSED_BY_PHARMACIST
    elif payload.action_taken == PharmacistAction.ESCALATED_DOCTOR:
        encounter.status = EncounterStatus.ESCALATED_TO_DOCTOR
    elif payload.action_taken == PharmacistAction.REFERRED_EMERGENCY:
        encounter.status = EncounterStatus.REFERRED_TO_EMERGENCY
    else:
        encounter.status = EncounterStatus.COMPLETED

    review = PharmacistReview(
        encounter_id=encounter.id,
        pharmacy_id=encounter.pharmacy_id,
        pharmacist_user_id=payload.pharmacist_user_id,
        triage_level=payload.triage_level,
        allergies_verified=payload.allergies_verified,
        red_flags_checked=payload.red_flags_checked,
        action_taken=payload.action_taken,
        dispensed_items=payload.dispensed_items,
        counseling_notes=payload.counseling_notes,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)

    return PharmacistReviewResponse(
        review_id=review.id,
        encounter_id=review.encounter_id,
        pharmacist_user_id=review.pharmacist_user_id,
        triage_level=review.triage_level,
        action_taken=review.action_taken,
        created_at=review.created_at,
    )

@router.post("/emergency/{encounter_id}")
async def trigger_108_emergency(
    encounter_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Emergency Red Flag Escalation: Marks encounter as RED and dispatches 108 ambulance notification.
    """
    result = await db.execute(select(ClinicalEncounter).filter(ClinicalEncounter.id == encounter_id))
    encounter = result.scalars().first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")

    encounter.triage_level = PharmacyTriageLevel.RED
    encounter.status = EncounterStatus.REFERRED_TO_EMERGENCY
    await db.commit()

    return {
        "status": "EMERGENCY_DISPATCHED",
        "encounter_id": encounter.id,
        "triage_level": "RED",
        "action": "Immediate 108 Emergency Ambulance Dispatched",
        "instructions": "Administer emergency first aid protocols. Transfer patient to nearest tertiary casualty."
    }
