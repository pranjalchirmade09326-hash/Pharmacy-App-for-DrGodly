import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.config import settings
from app.models.models import Pharmacy, ClinicalEncounter, EncounterStatus, PharmacyTriageLevel
from app.schemas.schemas import TelephonyInboundRequest, TelephonyInboundResponse

router = APIRouter(prefix="/telephony", tags=["Telephony"])

@router.post("/inbound", response_model=TelephonyInboundResponse)
async def handle_inbound_call(
    payload: TelephonyInboundRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Inbound telephony webhook from Exotel/Twilio.
    Triggered when patient scans counter QR code and dials the telephony gateway DID.
    """
    # Look up mapped pharmacy by inbound DID or default to first pharmacy
    result = await db.execute(select(Pharmacy).filter(Pharmacy.inbound_did == payload.To))
    pharmacy = result.scalars().first()

    if not pharmacy:
        # Fallback to demo default pharmacy
        result = await db.execute(select(Pharmacy).limit(1))
        pharmacy = result.scalars().first()
        if not pharmacy:
            # Create a bootstrap pharmacy record
            pharmacy = Pharmacy(
                code="PHARM-DEL-041",
                name="Apollo Pharmacy — Connaught Place, New Delhi",
                license_number="DL-20/21-88129",
                address="Block B, Connaught Place",
                city="New Delhi",
                state="Delhi",
                pincode="110001",
                phone_number="+911145678900",
                inbound_did=payload.To,
                is_active=True,
            )
            db.add(pharmacy)
            await db.commit()
            await db.refresh(pharmacy)

    # Initialize clinical encounter
    encounter_num = f"ENC-{uuid.uuid4().hex[:8].upper()}"
    encounter = ClinicalEncounter(
        encounter_number=encounter_num,
        pharmacy_id=pharmacy.id,
        status=EncounterStatus.CALL_INITIATED,
        triage_level=PharmacyTriageLevel.UNABLE_TO_ASSESS,
        chief_complaint="Incoming Telephony Voice Intake",
        severity=5,
    )
    db.add(encounter)
    await db.commit()
    await db.refresh(encounter)

    return TelephonyInboundResponse(
        action="connect_media_stream",
        stream_url=f"wss://api.drgodly.com/v1/voice/stream/{encounter.id}",
        encounter_id=encounter.id,
        pharmacy_name=pharmacy.name,
    )
