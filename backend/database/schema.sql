-- ============================================================================
-- DrGodly Pharmacy Assist: Production PostgreSQL Database Schema
-- Version: 1.0.0
-- Jurisdiction: India (Compliant with DPDP Act 2023, Drugs & Cosmetics Act 1940,
--               and Telemedicine Practice Guidelines 2020)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE triage_level_enum AS ENUM (
    'RED',      -- Emergency / Urgent care required immediately
    'ORANGE',   -- Same-day clinical assessment recommended; no self-care
    'YELLOW',   -- Pharmacist evaluation & review recommended
    'GREEN'     -- Low-risk, protocol-based symptomatic self-care appropriate
);

CREATE TYPE encounter_status_enum AS ENUM (
    'CALL_INITIATED',
    'INTAKE_IN_PROGRESS',
    'CLINICAL_PROCESSING',
    'AWAITING_PHARMACIST_REVIEW',
    'ESCALATED_TO_DOCTOR',
    'DISPENSED_BY_PHARMACIST',
    'REFERRED_TO_EMERGENCY',
    'COMPLETED',
    'ABANDONED',
    'CANCELLED'
);

CREATE TYPE drug_schedule_enum AS ENUM (
    'OTC',           -- Over The Counter / General Sale List
    'SCHEDULE_G',   -- Most require medical supervision warning
    'SCHEDULE_H',   -- Prescription only under Indian Drugs & Cosmetics Rules
    'SCHEDULE_H1',  -- 3rd/4th gen antibiotics, anti-TB, psychotropics (Strict register)
    'SCHEDULE_X'    -- Narcotics & severe psychotropics (Restricted distribution)
);

CREATE TYPE consultation_status_enum AS ENUM (
    'REQUESTED',
    'ACCEPTED',
    'IN_PROGRESS',
    'COMPLETED',
    'NO_SHOW',
    'REFERRED_OFFLINE'
);

CREATE TYPE consent_status_enum AS ENUM (
    'GIVEN',
    'REFUSED',
    'REVOKED'
);

CREATE TYPE lab_booking_status_enum AS ENUM (
    'RECOMMENDED',
    'INITIATED',
    'CONFIRMED',
    'SAMPLE_COLLECTED',
    'REPORT_READY',
    'CANCELLED'
);

-- ============================================================================
-- 1. ORGANIZATIONAL & PHARMACY INFRASTRUCTURE
-- ============================================================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    gstin VARCHAR(15),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pharmacies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'DRG-BLR-IND-001'
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) NOT NULL, -- State Drug Control Drug License (DL 20/21)
    license_valid_until DATE,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    locality VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    phone_number VARCHAR(20) NOT NULL,
    inbound_telephony_did VARCHAR(20), -- Dedicated or mapped virtual number for QR
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pharmacists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100) NOT NULL, -- State Pharmacy Council Registration No.
    registration_state VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STAFF_PHARMACIST', -- ADMIN, CHIEF_PHARMACIST, STAFF_PHARMACIST
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
    code_identifier VARCHAR(100) UNIQUE NOT NULL, -- e.g. QR-PH00128-COUNTER-1
    counter_label VARCHAR(100) DEFAULT 'Main Counter',
    tel_target_number VARCHAR(20) NOT NULL, -- e.g. +9180XXXXXXXX
    qr_image_url TEXT,
    scans_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. PATIENTS & DPDP-COMPLIANT CONSENT
-- ============================================================================

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) NOT NULL UNIQUE, -- Primary index in Indian mHealth
    full_name VARCHAR(255),
    date_of_birth DATE,
    age_years INT,
    gender VARCHAR(20), -- 'MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en', -- en, hi, ta, te, kn, ml, mr, bn
    abha_address VARCHAR(100) UNIQUE, -- ABDM ABHA Address (e.g. rajesh@abdm)
    abha_number VARCHAR(17), -- 14-digit ABHA ID formatted
    whatsapp_opt_in BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id UUID, -- Optional linkage to specific encounter
    consent_type VARCHAR(100) NOT NULL, -- 'VOICE_INTAKE', 'DATA_PROCESSING', 'WHATSAPP_REPORT', 'DOCTOR_SHARING'
    purpose_statement TEXT NOT NULL,
    legal_basis VARCHAR(100) NOT NULL DEFAULT 'DPDP_ACT_2023_EXPLICIT_AFFIRMATIVE',
    status consent_status_enum NOT NULL DEFAULT 'GIVEN',
    channel VARCHAR(50) NOT NULL DEFAULT 'VOICE_IVR', -- VOICE_IVR, WHATSAPP, WEB
    verbal_confirmation_audio_timestamp NUMERIC(8,2), -- Offset in recording where consent spoken
    ip_or_telephony_ref VARCHAR(100),
    consent_version VARCHAR(20) NOT NULL DEFAULT '1.0',
    given_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- ============================================================================
-- 3. TELEPHONY SESSIONS & AUDIO LOGS
-- ============================================================================

CREATE TABLE telephony_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL DEFAULT 'EXOTEL', -- EXOTEL, TWILIO, OZEKI, TATA_TELE
    provider_call_id VARCHAR(150) UNIQUE NOT NULL,
    caller_phone_number VARCHAR(20) NOT NULL,
    virtual_number_dialed VARCHAR(20) NOT NULL,
    qr_code_id UUID REFERENCES qr_codes(id) ON DELETE SET NULL,
    pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE SET NULL,
    call_start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    call_end_time TIMESTAMPTZ,
    duration_seconds INT,
    call_status VARCHAR(50) NOT NULL, -- IN_PROGRESS, COMPLETED, NO_ANSWER, FAILED, DROPPED
    recording_url TEXT,
    recording_retention_until TIMESTAMPTZ,
    audio_transcription_raw JSONB, -- Full time-aligned diarized transcript
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. CLINICAL ENCOUNTERS & INTAKE STATE
-- ============================================================================

CREATE TABLE encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'ENC-20261027-0091'
    patient_id UUID NOT NULL REFERENCES patients(id),
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id),
    telephony_session_id UUID REFERENCES telephony_sessions(id),
    qr_code_id UUID REFERENCES qr_codes(id),
    intake_language VARCHAR(10) NOT NULL DEFAULT 'en',
    chief_complaint TEXT,
    chief_complaint_category VARCHAR(100), -- 'RESPIRATORY', 'GASTROINTESTINAL', 'FEVER', etc.
    triage_level triage_level_enum,
    status encounter_status_enum NOT NULL DEFAULT 'CALL_INITIATED',
    red_flags_detected JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_pregnant BOOLEAN DEFAULT FALSE,
    is_lactating BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    intake_completed_at TIMESTAMPTZ,
    pharmacist_reviewed_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE encounter_dialogue_turns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    turn_index INT NOT NULL,
    speaker VARCHAR(20) NOT NULL, -- 'AI_AGENT', 'PATIENT', 'SYSTEM'
    language_code VARCHAR(10) NOT NULL,
    audio_chunk_offset_ms INT,
    text_spoken TEXT NOT NULL,
    translation_en TEXT,
    intent_detected VARCHAR(100),
    slot_fill_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE clinical_symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    symptom_name VARCHAR(150) NOT NULL, -- e.g., 'Epigastric burning pain'
    snomed_ct_code VARCHAR(50),
    body_site VARCHAR(100), -- 'Epigastrium', 'Throat', etc.
    onset_description VARCHAR(100), -- 'Sudden', 'Gradual'
    duration_days NUMERIC(6, 2),
    severity VARCHAR(20), -- 'MILD', 'MODERATE', 'SEVERE'
    character VARCHAR(100), -- 'Burning', 'Sharp', 'Throbbing', 'Dull'
    timing VARCHAR(100), -- 'Post-prandial', 'Nocturnal', 'Continuous'
    aggravating_factors TEXT,
    relieving_factors TEXT,
    is_primary_complaint BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE clinical_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'EXISTING_CONDITION', 'MEDICATION', 'ALLERGY', 'RED_FLAG_NEGATIVE'
    entity_name VARCHAR(255) NOT NULL, -- e.g., 'Type 2 Diabetes', 'Paracetamol allergy', 'Coughing blood (denied)'
    snomed_or_rxnorm VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'PRESENT', -- 'PRESENT', 'DENIED', 'UNKNOWN'
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. CLINICAL DECISION SUPPORT & GOVERNANCE RULES
-- ============================================================================

CREATE TABLE clinical_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_code VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'PROTO-DYSPEPSIA-001'
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- 'DRAFT', 'ACTIVE', 'DEPRECATED'
    protocol_json JSONB NOT NULL, -- Full decision graph, red flags, differentials
    authored_by VARCHAR(255) NOT NULL,
    reviewed_by VARCHAR(255) NOT NULL,
    medical_board_approval_date DATE NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE clinical_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    protocol_id UUID REFERENCES clinical_protocols(id),
    protocol_version VARCHAR(20),
    clinical_summary TEXT NOT NULL,
    triage_result triage_level_enum NOT NULL,
    triage_rationale TEXT NOT NULL,
    escalation_required BOOLEAN NOT NULL DEFAULT FALSE,
    escalation_reason TEXT,
    red_flags_identified JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE differential_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES clinical_assessments(id) ON DELETE CASCADE,
    rank_order INT NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    icd10_code VARCHAR(20),
    confidence_tier VARCHAR(20) NOT NULL, -- 'HIGH_LIKELIHOOD', 'MODERATE_LIKELIHOOD', 'RULE_OUT'
    supporting_findings TEXT[] NOT NULL DEFAULT '{}',
    contradicting_findings TEXT[] NOT NULL DEFAULT '{}',
    clinical_rationale TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE investigation_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES clinical_assessments(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL, -- e.g., 'Complete Blood Count (CBC)'
    loinc_code VARCHAR(50),
    urgency VARCHAR(50) NOT NULL DEFAULT 'ROUTINE', -- 'EMERGENCY', 'URGENT', 'ROUTINE', 'OPTIONAL'
    clinical_rationale TEXT NOT NULL,
    priority_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE medication_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES clinical_assessments(id) ON DELETE CASCADE,
    active_ingredient VARCHAR(255) NOT NULL, -- e.g. 'Aluminium Hydroxide + Magnesium Hydroxide'
    formulation VARCHAR(100) NOT NULL, -- 'Gel / Suspension', 'Chewable Tablet'
    typical_dosage VARCHAR(100), -- '10-20 ml after meals & bedtime'
    max_duration_days INT NOT NULL, -- e.g., 3 days for self-care
    schedule_classification drug_schedule_enum NOT NULL,
    requires_prescription BOOLEAN NOT NULL, -- True if Schedule H / H1 / X
    contraindications TEXT[] NOT NULL DEFAULT '{}',
    key_warnings TEXT NOT NULL,
    pharmacist_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. PHARMACIST WORKFLOW & AUDITABLE REVIEW
-- ============================================================================

CREATE TABLE pharmacist_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    pharmacist_id UUID NOT NULL REFERENCES pharmacists(id),
    patient_history_verified BOOLEAN NOT NULL DEFAULT FALSE,
    allergies_verified BOOLEAN NOT NULL DEFAULT FALSE,
    red_flags_checked BOOLEAN NOT NULL DEFAULT FALSE,
    action_taken VARCHAR(50) NOT NULL, -- 'DISPENSED_OTC', 'ESCALATED_DOCTOR', 'REFERRED_EMERGENCY', 'COUNSELED_ONLY'
    dispensed_medications JSONB DEFAULT '[]'::jsonb,
    pharmacist_notes TEXT,
    customer_counseled BOOLEAN NOT NULL DEFAULT TRUE,
    consultation_seconds INT,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. TELEMEDICINE & DOCTOR ESCALATIONS
-- ============================================================================

CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    nmc_registration_number VARCHAR(100) NOT NULL UNIQUE, -- National Medical Commission / State Medical Council
    state_medical_council VARCHAR(100) NOT NULL,
    specialization VARCHAR(150) NOT NULL DEFAULT 'General Physician / MBBS',
    qualification VARCHAR(255) NOT NULL, -- 'MBBS, MD (General Medicine)'
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    is_available_teleconsult BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE doctor_consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id),
    status consultation_status_enum NOT NULL DEFAULT 'REQUESTED',
    teleconsult_channel VARCHAR(50) NOT NULL DEFAULT 'WEBRTC_AUDIO_VIDEO',
    pre_consult_summary_viewed_at TIMESTAMPTZ,
    call_started_at TIMESTAMPTZ,
    call_ended_at TIMESTAMPTZ,
    doctor_soap_notes JSONB, -- { "subjective": "...", "objective": "...", "assessment": "...", "plan": "..." }
    doctor_final_diagnosis VARCHAR(255),
    doctor_prescription_pdf_url TEXT,
    doctor_digital_signature_hash VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. DIAGNOSTIC LABORATORY NETWORK & BOOKINGS
-- ============================================================================

CREATE TABLE diagnostic_labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    network_brand VARCHAR(150), -- 'Apollo Diagnostics', 'Dr Lal PathLabs', 'Metropolis', 'Local Independent'
    nabl_accreditation_number VARCHAR(100),
    address_line1 TEXT NOT NULL,
    locality VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    operating_hours VARCHAR(100) DEFAULT '07:00 AM - 08:00 PM',
    offers_home_collection BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lab_test_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_id UUID NOT NULL REFERENCES diagnostic_labs(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    loinc_code VARCHAR(50),
    mrp_inr NUMERIC(10, 2) NOT NULL,
    drgodly_discounted_price_inr NUMERIC(10, 2),
    sample_type VARCHAR(100), -- 'Blood (EDTA)', 'Urine Routine', etc.
    turnaround_time_hours INT NOT NULL DEFAULT 12,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lab_referral_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id),
    lab_id UUID NOT NULL REFERENCES diagnostic_labs(id),
    test_catalog_id UUID NOT NULL REFERENCES lab_test_catalog(id),
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    collection_mode VARCHAR(50) NOT NULL DEFAULT 'WALK_IN', -- 'WALK_IN', 'HOME_COLLECTION'
    booking_status lab_booking_status_enum NOT NULL DEFAULT 'INITIATED',
    patient_address_if_home TEXT,
    slot_datetime TIMESTAMPTZ,
    report_uploaded_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. WHATSAPP ENGINE & PATIENT COMMUNICATIONS
-- ============================================================================

CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    recipient_phone VARCHAR(20) NOT NULL,
    meta_template_name VARCHAR(100) NOT NULL,
    meta_message_id VARCHAR(150) UNIQUE,
    report_pdf_url TEXT,
    quick_reply_payload JSONB,
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'QUEUED', -- QUEUED, SENT, DELIVERED, READ, FAILED
    error_message TEXT,
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ
);

-- ============================================================================
-- 10. IMMUTABLE CLINICAL & ACCESS AUDIT LOG
-- ============================================================================

CREATE TABLE audit_trail_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_id UUID, -- Pharmacist, Doctor, or System Service ID
    actor_role VARCHAR(50) NOT NULL, -- 'PHARMACIST', 'DOCTOR', 'SYSTEM_AI', 'PATIENT'
    event_type VARCHAR(100) NOT NULL, -- 'VOICE_INTAKE_STARTED', 'TRIAGE_EVALUATED', 'SCHEDULE_H_BLOCKED', 'RECORD_ACCESSED'
    resource_type VARCHAR(50) NOT NULL, -- 'ENCOUNTER', 'PRESCRIPTION', 'PATIENT_DATA'
    resource_id UUID NOT NULL,
    action_details JSONB NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT
);

-- ============================================================================
-- PERFORMANCE & OPERATIONAL INDEXES
-- ============================================================================

CREATE INDEX idx_encounters_pharmacy_status ON encounters(pharmacy_id, status);
CREATE INDEX idx_encounters_patient_id ON encounters(patient_id);
CREATE INDEX idx_encounters_triage_level ON encounters(triage_level);
CREATE INDEX idx_patients_phone ON patients(phone_number);
CREATE INDEX idx_telephony_provider_call ON telephony_sessions(provider_call_id);
CREATE INDEX idx_qr_codes_identifier ON qr_codes(code_identifier);
CREATE INDEX idx_audit_resource ON audit_trail_events(resource_type, resource_id);
CREATE INDEX idx_labs_location ON diagnostic_labs(city, pincode);

COMMENT ON TABLE clinical_assessments IS 'Stores AI-generated clinical differential and triage; strictly decoupled from autonomous prescribing';
COMMENT ON TABLE pharmacist_reviews IS 'Mandatory gatekeeper audit record for all medication dispensations and doctor escalations at the pharmacy';
