import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.models import ClinicalEncounter, Pharmacy, Patient, EncounterStatus, PharmacyTriageLevel
from app.schemas.schemas import EncounterCreate, EncounterResponse, WhatsAppDispatchResponse
from app.services.clinical_engine import ClinicalTriageEngine
from app.services.voice_service import VoiceOrchestratorService

router = APIRouter(prefix="/encounters", tags=["Clinical Encounters"])

@router.post("", response_model=EncounterResponse)
async def create_encounter(
    payload: EncounterCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new clinical intake encounter with automatic triage & SBAR generation.
    """
    # 1. Pharmacy Lookup
    result = await db.execute(select(Pharmacy).filter(Pharmacy.code == payload.pharmacy_code))
    pharmacy = result.scalars().first()
    if not pharmacy:
        # Create default if not found
        pharmacy = Pharmacy(
            code=payload.pharmacy_code,
            name="Apollo Pharmacy — Connaught Place",
            license_number="DL-20/21-88129",
            address="Connaught Place",
            city="New Delhi",
            state="Delhi",
            pincode="110001",
            phone_number="+911145678900",
            inbound_did="+918069000000",
        )
        db.add(pharmacy)
        await db.commit()
        await db.refresh(pharmacy)

    # 2. Patient Lookup or Creation
    result = await db.execute(select(Patient).filter(Patient.phone_number == payload.phone_number))
    patient = result.scalars().first()
    if not patient:
        patient = Patient(
            phone_number=payload.phone_number,
            name=payload.patient_name,
            age=payload.age,
            gender=payload.gender,
            is_pregnant=payload.is_pregnant or False,
        )
        db.add(patient)
        await db.commit()
        await db.refresh(patient)

    # 3. Clinical Triage & SBAR Evaluation
    triage_level, red_flags, sbar_dict = ClinicalTriageEngine.evaluate_triage(
        chief_complaint=payload.chief_complaint or "General Malaise",
        duration=payload.duration or "1 Day",
        severity=payload.severity or 5,
        age=payload.age or 30,
        gender=payload.gender or "Male",
        is_pregnant=payload.is_pregnant or False,
        reported_red_flags=payload.red_flags or [],
    )

    encounter_num = f"ENC-{uuid.uuid4().hex[:8].upper()}"
    encounter = ClinicalEncounter(
        encounter_number=encounter_num,
        pharmacy_id=pharmacy.id,
        patient_id=patient.id,
        status=EncounterStatus.AWAITING_PHARMACIST_REVIEW,
        triage_level=triage_level,
        chief_complaint=payload.chief_complaint,
        duration=payload.duration,
        severity=payload.severity or 5,
        red_flags=red_flags,
        sbar_summary=sbar_dict,
    )
    db.add(encounter)
    await db.commit()
    await db.refresh(encounter)

    return EncounterResponse(
        encounter_id=encounter.id,
        encounter_number=encounter.encounter_number,
        status=encounter.status,
        triage_level=encounter.triage_level,
        patient_name=patient.name,
        chief_complaint=encounter.chief_complaint,
        sbar_summary=encounter.sbar_summary,
        created_at=encounter.created_at,
    )

@router.get("", response_model=List[EncounterResponse])
async def list_encounters(
    status: str = Query(None, description="Filter by EncounterStatus"),
    db: AsyncSession = Depends(get_db)
):
    """
    List active counter intakes for the Pharmacist Triage Queue.
    """
    query = select(ClinicalEncounter)
    if status:
        query = query.filter(ClinicalEncounter.status == status)
    query = query.order_by(ClinicalEncounter.created_at.desc())
    
    result = await db.execute(query)
    encounters = result.scalars().all()

    response_list = []
    for enc in encounters:
        patient_name = "Counter Patient"
        if enc.patient_id:
            p_res = await db.execute(select(Patient).filter(Patient.id == enc.patient_id))
            p = p_res.scalars().first()
            if p and p.name:
                patient_name = p.name

        response_list.append(
            EncounterResponse(
                encounter_id=enc.id,
                encounter_number=enc.encounter_number,
                status=enc.status,
                triage_level=enc.triage_level,
                patient_name=patient_name,
                chief_complaint=enc.chief_complaint,
                sbar_summary=enc.sbar_summary,
                created_at=enc.created_at,
            )
        )
    return response_list

@router.get("/{id}", response_model=EncounterResponse)
async def get_encounter(
    id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get clinical details and SBAR summary of a specific encounter.
    """
    result = await db.execute(select(ClinicalEncounter).filter(ClinicalEncounter.id == id))
    encounter = result.scalars().first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")

    patient_name = "Counter Patient"
    if encounter.patient_id:
        p_res = await db.execute(select(Patient).filter(Patient.id == encounter.patient_id))
        p = p_res.scalars().first()
        if p and p.name:
            patient_name = p.name

    return EncounterResponse(
        encounter_id=encounter.id,
        encounter_number=encounter.encounter_number,
        status=encounter.status,
        triage_level=encounter.triage_level,
        patient_name=patient_name,
        chief_complaint=encounter.chief_complaint,
        sbar_summary=encounter.sbar_summary,
        created_at=encounter.created_at,
    )

@router.post("/{id}/dispatch-whatsapp", response_model=WhatsAppDispatchResponse)
async def dispatch_whatsapp(
    id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Simulate WhatsApp dispatch of structured SBAR clinical report to patient.
    """
    result = await db.execute(select(ClinicalEncounter).filter(ClinicalEncounter.id == id))
    encounter = result.scalars().first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")

    phone = "+919876543210"
    if encounter.patient_id:
        p_res = await db.execute(select(Patient).filter(Patient.id == encounter.patient_id))
        p = p_res.scalars().first()
        if p and p.phone_number:
            phone = p.phone_number

    dispatch_data = VoiceOrchestratorService.generate_whatsapp_dispatch(
        patient_phone=phone,
        encounter_number=encounter.encounter_number,
        sbar=encounter.sbar_summary or {},
        triage_level=encounter.triage_level.value,
    )

    return WhatsAppDispatchResponse(
        patient_phone=dispatch_data["patient_phone"],
        token_number=dispatch_data["token_number"],
        sbar_summary=dispatch_data["sbar_summary"],
        dispatch_status="DELIVERED",
    )
