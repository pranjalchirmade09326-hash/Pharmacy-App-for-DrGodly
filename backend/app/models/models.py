import enum
import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Text,
    JSON,
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class PharmacyTriageLevel(str, enum.Enum):
    RED = "RED"
    ORANGE = "ORANGE"
    YELLOW = "YELLOW"
    GREEN = "GREEN"
    UNABLE_TO_ASSESS = "UNABLE_TO_ASSESS"

class PharmacistAction(str, enum.Enum):
    DISPENSED_OTC = "DISPENSED_OTC"
    ESCALATED_DOCTOR = "ESCALATED_DOCTOR"
    REFERRED_EMERGENCY = "REFERRED_EMERGENCY"
    COUNSELED_ONLY = "COUNSELED_ONLY"

class EncounterStatus(str, enum.Enum):
    CALL_INITIATED = "CALL_INITIATED"
    INTAKE_IN_PROGRESS = "INTAKE_IN_PROGRESS"
    CLINICAL_PROCESSING = "CLINICAL_PROCESSING"
    AWAITING_PHARMACIST_REVIEW = "AWAITING_PHARMACIST_REVIEW"
    ESCALATED_TO_DOCTOR = "ESCALATED_TO_DOCTOR"
    DISPENSED_BY_PHARMACIST = "DISPENSED_BY_PHARMACIST"
    REFERRED_TO_EMERGENCY = "REFERRED_TO_EMERGENCY"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class DrugSchedule(str, enum.Enum):
    OTC = "OTC"
    SCHEDULE_G = "SCHEDULE_G"
    SCHEDULE_H = "SCHEDULE_H"
    SCHEDULE_H1 = "SCHEDULE_H1"
    AYUSH = "AYUSH"

# --- Tables ---

class Pharmacy(Base):
    __tablename__ = "pharmacies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    license_number = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    phone_number = Column(String(20), nullable=False)
    inbound_did = Column(String(20), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    qr_codes = relationship("PharmacyQRCode", back_populates="pharmacy", cascade="all, delete-orphan")
    reviews = relationship("PharmacistReview", back_populates="pharmacy")

class PharmacyQRCode(Base):
    __tablename__ = "pharmacy_qr_codes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    pharmacy_id = Column(String(36), ForeignKey("pharmacies.id", ondelete="CASCADE"), nullable=False, index=True)
    code_identifier = Column(String(100), unique=True, nullable=False)
    counter_label = Column(String(100), default="Main Counter")
    tel_number = Column(String(20), nullable=False)
    scans_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    pharmacy = relationship("Pharmacy", back_populates="qr_codes")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone_number = Column(String(20), index=True, nullable=False)
    name = Column(String(150), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    abha_id = Column(String(50), nullable=True)
    is_pregnant = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    encounters = relationship("ClinicalEncounter", back_populates="patient")

class ClinicalEncounter(Base):
    __tablename__ = "clinical_encounters"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    encounter_number = Column(String(50), unique=True, index=True, nullable=False)
    pharmacy_id = Column(String(36), ForeignKey("pharmacies.id"), nullable=False, index=True)
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=True, index=True)
    status = Column(Enum(EncounterStatus), default=EncounterStatus.CALL_INITIATED, nullable=False)
    triage_level = Column(Enum(PharmacyTriageLevel), default=PharmacyTriageLevel.UNABLE_TO_ASSESS)
    chief_complaint = Column(String(255), nullable=True)
    duration = Column(String(50), nullable=True)
    severity = Column(Integer, default=5)
    red_flags = Column(JSON, default=list)
    sbar_summary = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("Patient", back_populates="encounters")
    review = relationship("PharmacistReview", back_populates="encounter", uselist=False)

class PharmacistReview(Base):
    __tablename__ = "pharmacist_reviews"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    encounter_id = Column(String(36), ForeignKey("clinical_encounters.id"), unique=True, nullable=False)
    pharmacy_id = Column(String(36), ForeignKey("pharmacies.id"), nullable=False, index=True)
    pharmacist_user_id = Column(String(100), nullable=False)
    triage_level = Column(Enum(PharmacyTriageLevel), nullable=False)
    allergies_verified = Column(Boolean, default=False)
    red_flags_checked = Column(Boolean, default=False)
    action_taken = Column(Enum(PharmacistAction), nullable=False)
    dispensed_items = Column(JSON, nullable=True)
    counseling_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    pharmacy = relationship("Pharmacy", back_populates="reviews")
    encounter = relationship("ClinicalEncounter", back_populates="review")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nmc_reg_number = Column(String(50), unique=True, nullable=False)
    state_medical_council = Column(String(100), default="Delhi Medical Council")
    full_name = Column(String(150), nullable=False)
    specialization = Column(String(100), nullable=False)
    degrees = Column(JSON, default=list)
    experience_years = Column(Integer, default=10)
    rating = Column(Float, default=4.9)
    consultation_fee_inr = Column(Integer, default=399)
    hospital_affiliation = Column(String(200), nullable=False)
    languages = Column(JSON, default=list)
    avatar_url = Column(String(500), nullable=True)
    is_online = Column(Boolean, default=True)

class Medication(Base):
    __tablename__ = "medications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    brand_name = Column(String(200), nullable=False, index=True)
    generic_composition = Column(String(300), nullable=False)
    cdsco_category = Column(String(50), default="OTC")
    drug_schedule = Column(Enum(DrugSchedule), default=DrugSchedule.OTC)
    prescription_required = Column(Boolean, default=False)
    dosage_form = Column(String(50), default="Tablet")
    pack_size = Column(String(50), default="10 Tablets")
    mrp_inr = Column(Float, nullable=False)
    selling_price_inr = Column(Float, nullable=False)
    stock_quantity = Column(Integer, default=100)
    image_url = Column(String(500), nullable=True)
