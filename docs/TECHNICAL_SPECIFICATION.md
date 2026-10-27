# DrGodly Pharmacy Assist — Technical Specification
**Version:** 1.0.0 (Developer-Ready MVP)  
**Jurisdiction:** India (Compliant with DPDP Act 2023, CDSCO 2026 Drugs Rules, ABDM FHIR R4, and Telemedicine Practice Guidelines 2020)

---

## 1. System Architecture & Component Topology

DrGodly Pharmacy Assist is engineered as an event-driven, decoupled microservices platform with high availability, low voice-turn latency (<800ms), and strict regulatory guardrails.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   INBOUND CHANNELS                                     │
│   [Pharmacy QR (tel:)]            [WhatsApp Webhook]              [Web Console (HTTPS)]│
└────────────┬───────────────────────────────┬───────────────────────────────┬───────────┘
             │                               │                               │
             ▼                               ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌────────────────────────┐
│ Telephony Gateway       │     │ WhatsApp Engine         │     │ API Gateway & Reverse  │
│ (Exotel / Twilio / Tata)│     │ (Meta Cloud API / Gupshup│    │ Proxy (Kong / Envoy)   │
└────────────┬────────────┘     └────────────┬────────────┘     └────────────┬───────────┘
             │ Audio stream (WSS)            │                               │ JWT / RBAC
             ▼                               │                               ▼
┌─────────────────────────┐                  │                  ┌────────────────────────┐
│ Voice Orchestration     │                  │                  │ Pharmacist & Doctor    │
│ (STT + TTS + Dialogue)  │                  │                  │ Web Workspace API      │
└────────────┬────────────┘                  │                  └────────────┬───────────┘
             │                               │                               │
             ▼                               ▼                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                REDIS / KAFKA EVENT BUS                                 │
│ Topics: call.started, voice.turn, redflag.alert, intake.completed, rx.dispensed        │
└────────────┬───────────────────────────────┬───────────────────────────────┬───────────┘
             │                               │                               │
             ▼                               ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌────────────────────────┐
│ Clinical Engine         │     │ Centrally-Managed       │     │ Telemedicine Bridge &  │
│ (State Machine, CDS,    │◄───►│ Medication Formulary    │◄───►│ ABDM / FHIR Gateway    │
│ Red-Flag Deterministic) │     │ Engine (CDSCO 2026)     │     │ (ABHA & Health Locker) │
└────────────┬────────────┘     └─────────────────────────┘     └────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               POSTGRESQL PRIMARY CLUSTER                               │
│  (Multi-Tenant, Row-Level Security, Encrypted at Rest, Append-Only Immutable Audit)    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Monorepo Structure

```text
pharmacy-app/
├── apps/
│   ├── api-gateway/            # Unified routing, rate-limiting, and auth proxy
│   ├── voice-orchestrator/     # Audio stream handler, STT/TTS pipelines, conversation state
│   ├── clinical-service/       # Triage engine, protocol runner, differential generator
│   ├── formulary-service/      # CDSCO-compliant drug database & safety checker
│   ├── pharmacist-portal/      # Next.js 15, Tailwind, Radix UI clinical workspace
│   ├── doctor-portal/          # Telemedicine console, WebRTC, e-prescription engine
│   └── whatsapp-service/       # Meta Cloud API template dispatcher & interactive handler
├── packages/
│   ├── database/               # Prisma/Drizzle schema, PostgreSQL migrations, seed data
│   ├── protocols/              # Clinical protocol definitions (JSON/YAML) & JSON schemas
│   ├── shared-types/           # TypeScript interfaces for ClinicalState, Triage, Formulary
│   ├── abdm-fhir/              # FHIR R4 converters for ABHA, Encounter, Condition, Observation
│   └── logger/                 # OpenTelemetry and structured audit logger
├── database/
│   └── schema.sql              # Master PostgreSQL DDL script
├── docker/
│   ├── docker-compose.yml      # Local dev environment
│   └── mock-telephony/         # Audio loopback tester for voice dialogue testing
└── docs/                       # Specifications and regulatory documentation
```

---

## 3. Centrally Managed, Versioned Medication Formulary Engine (CDSCO 2026 Compliance)

### 3.1 Regulatory Requirement
Under India's Drugs and Cosmetics Act (1940) and Drugs Rules (1945), medicines are strictly classified into schedules:
* **Schedule H:** Prescription drugs; dispensing without an RMP prescription is illegal.
* **Schedule H1:** 3rd/4th generation cephalosporins, carbapenems, fluoroquinolones, and psychotropics. Requires maintaining a separate register recording patient name, doctor registration number, and batch details for 3 years.
* **CDSCO 2026 Pediatric Restrictions:** Strict contraindications against prescribing fixed-dose combinations (FDCs) of chlorpheniramine maleate + phenylephrine to children under 4 years of age.
* **OTC List:** Only drugs explicitly notified or non-scheduled items with low toxicity profiles may be considered for pharmacist self-care counseling.

### 3.2 Dynamic Formulary Architecture
The AI Clinical Engine is strictly decoupled from medication knowledge. The LLM **never** determines whether a drug is OTC or safe. Instead:
1. LLM identifies the clinical condition (e.g. `Dyspepsia`).
2. Clinical Protocol queries the **Medication Formulary Engine** with `(condition, age, pregnancy, comorbidities, allergies)`.
3. The Formulary Engine performs deterministic SQL filtering against the active CDSCO database snapshot:

```sql
-- Formulary Evaluation Query (Example)
SELECT 
    d.id,
    d.generic_name,
    d.schedule_classification,
    d.max_otc_duration_days,
    d.pediatric_contraindicated,
    f.typical_adult_dose,
    f.pharmacist_counseling_points
FROM drug_registry d
JOIN protocol_formulary_mappings f ON f.drug_id = d.id
WHERE f.protocol_id = 'GI_DYSPEPSIA_ADULT'
  AND d.is_active = TRUE
  AND d.effective_until >= NOW()
  AND d.schedule_classification = 'OTC'
  AND NOT (d.pregnancy_category IN ('D', 'X') AND :is_pregnant = TRUE)
  AND NOT (d.min_age_years > :patient_age);
```

### 3.3 Formulary Schema DDL

```sql
CREATE TABLE drug_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generic_name VARCHAR(255) NOT NULL,
    brand_names TEXT[] NOT NULL DEFAULT '{}',
    dosage_form VARCHAR(50) NOT NULL, -- TABLET, SYRUP, SUSPENSION, OINTMENT
    strength VARCHAR(100) NOT NULL,
    schedule_classification VARCHAR(20) NOT NULL, -- OTC, SCHEDULE_G, SCHEDULE_H, SCHEDULE_H1, SCHEDULE_X
    is_pediatric_banned BOOLEAN NOT NULL DEFAULT FALSE,
    min_age_years INT DEFAULT 0,
    max_otc_duration_days INT NOT NULL DEFAULT 3,
    cdsco_gazette_notification_ref VARCHAR(100), -- e.g., 'G.S.R. 2026-MED-44'
    effective_from DATE NOT NULL,
    effective_until DATE,
    version VARCHAR(20) NOT NULL DEFAULT '2026.1'
);

CREATE TABLE drug_contraindications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drug_id UUID REFERENCES drug_registry(id) ON DELETE CASCADE,
    contraindicated_condition_code VARCHAR(50) NOT NULL, -- SNOMED or ICD-10
    severity VARCHAR(20) NOT NULL -- ABSOLUTE, RELATIVE
);

CREATE TABLE drug_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drug_a_id UUID REFERENCES drug_registry(id),
    drug_b_id UUID REFERENCES drug_registry(id),
    interaction_level VARCHAR(20) NOT NULL, -- CONTRAINDICATED, MAJOR, MODERATE
    clinical_effect TEXT NOT NULL
);
```

---

## 4. Event Architecture & Message Topics

DrGodly utilizes Redis Streams for real-time pub/sub messaging across services:

| Topic Name | Producer | Consumer | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `telephony.call.inbound` | Telephony Gateway | Voice Orchestrator | `call_id`, `caller_number`, `did_dialed`, `timestamp` |
| `voice.audio.stream` | Telephony Gateway | STT Service | 16kHz linear PCM audio chunks (WebSocket) |
| `voice.turn.completed` | Voice Orchestrator | Clinical Engine | `encounter_id`, `speaker`, `transcript`, `confidence` |
| `clinical.red_flag.alert` | Clinical Engine | Pharmacist Portal | `encounter_id`, `red_flag_id`, `triage: "RED"`, `immediate_action` |
| `clinical.intake.done` | Clinical Engine | WhatsApp Service, Pharmacist | `encounter_id`, `triage`, `summary`, `differentials` |
| `pharmacist.action.taken` | Pharmacist Portal | Audit Service, WhatsApp | `encounter_id`, `action: "DISPENSED" / "DOCTOR"`, `pharmacist_id` |
| `doctor.telemed.status` | Doctor Portal | Pharmacist Portal | `consultation_id`, `status: "IN_PROGRESS" / "COMPLETED"`, `rx_url` |
| `audit.event.record` | All Services | Audit Service | Immutable JSON payload with actor, resource, action, and hash |

---

## 5. REST & WebSocket API Specification

### 5.1 Telephony Webhooks
* `POST /api/v1/telephony/inbound`: Receives webhook from Exotel/Twilio when customer dials the QR phone number. Responds with Call Control Markup Language (CCML/TwiML) to connect media stream to `wss://voice.drgodly.com/media`.
* `POST /api/v1/telephony/events`: Receives call lifecycle events (`ANSWERED`, `COMPLETED`, `BUSY`, `FAILED`).
* `POST /api/v1/telephony/recording`: Webhook containing signed URL of call recording; schedules archival with retention policies.

### 5.2 Clinical Intake API
* `POST /api/v1/encounters`:
  * **Payload:** `{ "pharmacy_code": "DRG-BLR-001", "phone_number": "+919876543210", "call_session_id": "EXO-10029" }`
  * **Response:** `{ "encounter_id": "uuid", "encounter_number": "ENC-20261027-0091", "status": "IN_PROGRESS" }`
* `POST /api/v1/encounters/{id}/dialogue-turn`:
  * **Payload:** `{ "turn_index": 4, "speaker": "PATIENT", "text": "Loose motions 3 times today", "language": "hi-IN" }`
  * **Response:** `{ "next_question": "Have you noticed any blood or high fever?", "slots_extracted": { "symptom": "diarrhea", "frequency": 3 } }`
* `POST /api/v1/encounters/{id}/evaluate-triage`:
  * **Payload:** Triggered automatically at completion of safety screening.
  * **Response:**
  ```json
  {
    "encounter_id": "b182e18e-5b5c-4d2b-936d-9721665a3190",
    "triage_level": "YELLOW",
    "red_flags": [],
    "differentials": [
      { "name": "Acute Gastroenteritis", "icd10": "A09", "confidence": "HIGH_LIKELIHOOD" },
      { "name": "Food Intolerance", "icd10": "K90.4", "confidence": "MODERATE_LIKELIHOOD" }
    ],
    "investigations": [
      { "test_name": "Stool Routine Examination", "urgency": "ROUTINE", "rationale": "Recommended if diarrhea persists >48h" }
    ],
    "protocol_ref": "GI_ACUTE_DIARRHEA_v2026.1"
  }
  ```

### 5.3 Pharmacist Workspace API
* `GET /api/v1/pharmacies/{id}/queue?status=AWAITING_PHARMACIST_REVIEW`: Retrieves sorted queue prioritized by triage (`RED` > `ORANGE` > `YELLOW` > `GREEN`).
* `POST /api/v1/encounters/{id}/pharmacist-action`:
  * **Payload:**
  ```json
  {
    "pharmacist_id": "uuid",
    "action": "DISPENSED_OTC",
    "verified_allergies": true,
    "verified_red_flags": true,
    "dispensed_items": [
      { "drug_id": "uuid", "brand_name": "Gelusil MPS", "quantity": "1 Bottle (200ml)", "directions": "10ml after meals" }
    ],
    "counseling_notes": "Advised to drink plenty of fluids and see a doctor if symptoms continue beyond 3 days."
  }
  ```

### 5.4 Doctor Telemedicine API
* `POST /api/v1/doctor/referrals`: Creates an on-demand teleconsultation ticket from an encounter.
* `POST /api/v1/doctor/consultations/{id}/prescription`: Submits digitally signed e-prescription with CDSCO validation.

---

## 6. ABDM & FHIR R4 Interoperability Architecture

DrGodly is architected for seamless Ayushman Bharat Digital Mission (ABDM) Milestone 1, 2, and 3 conformance:

```
[DrGodly Encounter State] 
         │
         ▼
[ABDM FHIR Transformer]
         │
         ├──► FHIR Patient (Linked with ABHA ID & Verification Token)
         ├──► FHIR Encounter (Class: AMB - Ambulatory / Pharmacy Intake)
         ├──► FHIR Condition (VerificationStatus: Provisional, Category: Encounter-Diagnosis)
         ├──► FHIR Observation (Clinical observations: Duration, BodySite, RedFlagClearance)
         └──► FHIR Composition (Clinical Document Architecture: Pharmacy Intake Summary)
         │
         ▼
[ABDM Health Information Provider (HIP) Gateway]
         │
         ▼
[National Health Data Grid (Citizen ABHA Health Locker)]
```

### 6.1 Sample FHIR Condition Mapping (Differential)
```json
{
  "resourceType": "Condition",
  "id": "drgodly-cond-001",
  "clinicalStatus": {
    "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/condition-clinical", "code": "active" }]
  },
  "verificationStatus": {
    "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status", "code": "provisional" }]
  },
  "category": [{
    "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/condition-category", "code": "encounter-diagnosis" }]
  }],
  "code": {
    "coding": [{
      "system": "http://hl7.org/fhir/sid/icd-10",
      "code": "K30",
      "display": "Dyspepsia"
    }],
    "text": "Dyspepsia (Non-ulcer stomach discomfort)"
  },
  "subject": { "reference": "Patient/pat-9812", "display": "Rajesh Kumar" }
}
```

---

## 7. Security, Privacy (DPDP Act 2023) & Data Protection

1. **Explicit Affirmative Consent:** In accordance with Section 6 of India's Digital Personal Data Protection (DPDP) Act 2023, consent is collected prior to clinical data processing with an auditable voice timestamp and affirmative utterance ("Yes" / "Haan").
2. **Right to Withdraw:** Patients can text "STOP" or "REVOKE" to the WhatsApp number at any time, triggering automated token revocation and masking of identifying demographic fields in accordance with statutory retention limits.
3. **Data Residency:** All databases, voice caches, and S3 audio buckets are hosted exclusively in AWS `ap-south-1` (Mumbai) or GCP `asia-south1` (Mumbai).
4. **Field-Level Encryption:** Patient phone numbers, full names, and ABHA identifiers are encrypted using AES-256-GCM before writing to disk. Encryption keys are managed via AWS KMS / Google Cloud KMS.
5. **Role-Based Access Control (RBAC):**
   * `PHARMACIST`: Access restricted strictly to encounters originating from their assigned `pharmacy_id`.
   * `DOCTOR`: Access granted temporarily to an encounter only upon active referral acceptance.
   * `SYSTEM_AUDITOR`: Read-only access to pseudonymized `audit_trail_events`.

---

## 8. Docker Compose Development Environment

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    container_name: drgodly-postgres
    environment:
      POSTGRES_USER: drgodly_admin
      POSTGRES_PASSWORD: dev_password_123
      POSTGRES_DB: drgodly_pharmacy
    ports:
      - "5432:5432"
    volumes:
      - ./database/schema.sql:/docker-entrypoint-initdb.d/init.sql
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: drgodly-redis
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

  clinical-engine:
    build:
      context: .
      dockerfile: ./apps/clinical-service/Dockerfile
    container_name: drgodly-clinical-engine
    environment:
      DATABASE_URL: postgres://drgodly_admin:dev_password_123@postgres:5432/drgodly_pharmacy
      REDIS_URL: redis://redis:6379
      PORT: 8001
    ports:
      - "8001:8001"
    depends_on:
      - postgres
      - redis

  mock-telephony:
    build:
      context: ./docker/mock-telephony
    container_name: drgodly-mock-telephony
    ports:
      - "8080:8080"
    environment:
      TARGET_VOICE_URL: http://voice-orchestrator:8002

volumes:
  pgdata:
  redisdata:
```
