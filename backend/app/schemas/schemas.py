from typing import Optional, List, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.models import PharmacyTriageLevel, PharmacistAction, EncounterStatus, DrugSchedule

# --- Telephony Schemas ---
class TelephonyInboundRequest(BaseModel):
    CallSid: str
    From: str
    To: str

class TelephonyInboundResponse(BaseModel):
    action: str = "connect_media_stream"
    stream_url: str
    encounter_id: str
    pharmacy_name: str

# --- SBAR Schemas ---
class SBARReport(BaseModel):
    situation: str = Field(..., description="Demographics, chief complaint, current status")
    background: str = Field(..., description="Duration, allergy history, comorbidities")
    assessment: str = Field(..., description="Differential diagnoses, red flag rule-outs, severity")
    recommendation: str = Field(..., description="CDSCO safe OTC regimen or RMP teleconsultation")

# --- Encounter Schemas ---
class EncounterCreate(BaseModel):
    pharmacy_code: str
    phone_number: str
    patient_name: Optional[str] = "Anonymous Counter Patient"
    age: Optional[int] = 30
    gender: Optional[str] = "Male"
    is_pregnant: Optional[bool] = False
    chief_complaint: Optional[str] = None
    duration: Optional[str] = None
    severity: Optional[int] = 5
    red_flags: Optional[List[str]] = []

class EncounterResponse(BaseModel):
    encounter_id: str
    encounter_number: str
    status: EncounterStatus
    triage_level: PharmacyTriageLevel
    patient_name: Optional[str]
    chief_complaint: Optional[str]
    sbar_summary: Optional[Dict[str, Any]]
    created_at: datetime

# --- Pharmacist Review Schemas ---
class PharmacistReviewCreate(BaseModel):
    pharmacist_user_id: str
    triage_level: PharmacyTriageLevel
    allergies_verified: bool = True
    red_flags_checked: bool = True
    action_taken: PharmacistAction
    dispensed_items: Optional[List[Dict[str, Any]]] = []
    counseling_notes: Optional[str] = None

class PharmacistReviewResponse(BaseModel):
    review_id: str
    encounter_id: str
    pharmacist_user_id: str
    triage_level: PharmacyTriageLevel
    action_taken: PharmacistAction
    created_at: datetime

# --- Doctor Schemas ---
class DoctorResponse(BaseModel):
    id: str
    nmc_reg_number: str
    state_medical_council: str
    full_name: str
    specialization: str
    degrees: List[str]
    experience_years: int
    rating: float
    consultation_fee_inr: int
    hospital_affiliation: str
    languages: List[str]
    avatar_url: Optional[str]
    is_online: bool

# --- Medication Schemas ---
class MedicationResponse(BaseModel):
    id: str
    brand_name: str
    generic_composition: str
    cdsco_category: str
    drug_schedule: DrugSchedule
    prescription_required: bool
    dosage_form: str
    pack_size: str
    mrp_inr: float
    selling_price_inr: float
    stock_quantity: int
    image_url: Optional[str]

# --- WhatsApp Dispatch Payload ---
class WhatsAppDispatchResponse(BaseModel):
    patient_phone: str
    token_number: str
    sbar_summary: Dict[str, Any]
    dispatch_status: str = "DELIVERED"
    sent_at: datetime = Field(default_factory=datetime.utcnow)
