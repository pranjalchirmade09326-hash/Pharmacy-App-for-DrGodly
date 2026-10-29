from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.models import Doctor
from app.schemas.schemas import DoctorResponse

router = APIRouter(prefix="/doctors", tags=["Doctors & Teleconsultations"])

BOOTSTRAP_DOCTORS = [
    {
        "nmc_reg_number": "MCI-48129-DL",
        "state_medical_council": "Delhi Medical Council",
        "full_name": "Dr. Rajeshwar Sharma",
        "specialization": "Consultant Physician & Diabetologist",
        "degrees": ["MBBS", "MD (Internal Medicine)", "FICM"],
        "experience_years": 16,
        "rating": 4.9,
        "consultation_fee_inr": 399,
        "hospital_affiliation": "Max Super Speciality Hospital, Saket",
        "languages": ["English", "Hindi", "Punjabi"],
        "avatar_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60",
        "is_online": True,
    },
    {
        "nmc_reg_number": "KMC-69420-KA",
        "state_medical_council": "Karnataka Medical Council",
        "full_name": "Dr. Priyamvada Rao",
        "specialization": "Gastroenterologist & Hepatologist",
        "degrees": ["MBBS", "DNB (Gen Med)", "DM (Gastroenterology)"],
        "experience_years": 12,
        "rating": 4.85,
        "consultation_fee_inr": 499,
        "hospital_affiliation": "Manipal Hospital, Old Airport Road, Bengaluru",
        "languages": ["English", "Hindi", "Kannada"],
        "avatar_url": "https://images.unsplash.com/photo-1594824813587-578d46101df4?w=500&auto=format&fit=crop&q=60",
        "is_online": True,
    },
    {
        "nmc_reg_number": "MMC-88412-MH",
        "state_medical_council": "Maharashtra Medical Council",
        "full_name": "Dr. Ananya Deshmukh",
        "specialization": "Consultant Pediatrician",
        "degrees": ["MBBS", "MD (Pediatrics)", "Fellowship Neonatology"],
        "experience_years": 14,
        "rating": 4.95,
        "consultation_fee_inr": 449,
        "hospital_affiliation": "Lilavati Hospital, Bandra, Mumbai",
        "languages": ["English", "Hindi", "Marathi"],
        "avatar_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60",
        "is_online": True,
    },
]

@router.get("", response_model=List[DoctorResponse])
async def list_doctors(
    db: AsyncSession = Depends(get_db)
):
    """
    List all NMC-verified registered medical practitioners (RMPs) available for teleconsultation.
    """
    result = await db.execute(select(Doctor))
    doctors = result.scalars().all()

    # Bootstrap if empty
    if not doctors:
        for doc_data in BOOTSTRAP_DOCTORS:
            d = Doctor(**doc_data)
            db.add(d)
        await db.commit()
        result = await db.execute(select(Doctor))
        doctors = result.scalars().all()

    return [
        DoctorResponse(
            id=d.id,
            nmc_reg_number=d.nmc_reg_number,
            state_medical_council=d.state_medical_council,
            full_name=d.full_name,
            specialization=d.specialization,
            degrees=d.degrees or [],
            experience_years=d.experience_years,
            rating=d.rating,
            consultation_fee_inr=d.consultation_fee_inr,
            hospital_affiliation=d.hospital_affiliation,
            languages=d.languages or [],
            avatar_url=d.avatar_url,
            is_online=d.is_online,
        )
        for d in doctors
    ]
