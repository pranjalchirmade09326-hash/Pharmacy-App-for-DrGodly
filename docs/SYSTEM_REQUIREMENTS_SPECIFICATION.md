# DrGodly Pharmacy Assist — System Requirements Specification (SRS)
**Document ID:** DRG-SRS-2026-V2  
**Product:** DrGodly Pharmacy Assist  
**Ecosystem Integration:**  
* **Frontend:** **DrGodly HMS Frontend Hub** (Next.js 16, React 19, Prisma, Tailwind v4)
* **Backend:** **DrGodly FHIR R4 Interoperability Server** (FastAPI FHIR R4 Server + FastMCP Gateway at `:8002/mcp`)
* **Voice & Video:** Vapi (`@vapi-ai/web`) & LiveKit (`livekit-client`, `livekit-server-sdk`)
* **Auth & Storage:** BetterAuth (`drgodly-iam`) & FileNest (`drgodly-filenest`)
**Jurisdiction:** India  
**Applicable Regulations:** CDSCO Drugs Rules 2026, DPDP Act 2023, Telemedicine Practice Guidelines 2020, ABDM FHIR R4  
**Status:** Approved for Engineering Implementation  

---

## 1. Functional Requirements (FR)

### 1.1 Inbound Telephony & Voice Intake (Vapi & drgodly-agent)
* **FR-01.1 (Carrier Ingestion):** The system shall ingest inbound calls from Indian telecom carriers via Vapi or direct SIP/WebSocket gateways, linking the dialed telephone DID to a registered `pharmacy_id`.
* **FR-01.2 (Streaming STT/TTS):** The voice engine shall support streaming ASR and TTS with $<400\text{ ms}$ token turnaround for Indian English, Hindi, Tamil, and Telugu, with continuous automatic language and dialect identification.
* **FR-01.3 (Code-Switching Support):** The conversational intake agent shall natively process colloquial Indian code-switching (Hinglish/Tanglish, e.g. "Pet mein jalan hai do din se") without dropping audio or buffer context.
* **FR-01.4 (Barge-In):** When patient speech is detected during agent playback, the audio stream shall truncate playback within 100ms.

---

### 1.2 Clinical Intelligence & Safety Gatekeeper
* **FR-02.1 (Clinical Slot Extraction):** Conversational utterances shall be parsed into structured JSON conforming to `ClinicalState` (chief complaint, onset, severity, location, food triggers, relevant negatives, allergies, medications).
* **FR-02.2 (Deterministic Red-Flag Gatekeeper):** The engine shall deterministically match extracted clinical facts against the active protocol red-flag rules. If positive, the system shall assign `triage_level = 'RED'`, speak an emergency escalation warning, trigger a visual/audio alert on the Pharmacist Workspace, and terminate the routine call.
* **FR-02.3 (First-Class "Unable to Assess"):** If critical diagnostic data is missing, ambiguous, or contradictory, the system shall assign `triage_level = 'UNABLE_TO_ASSESS'` (mandating in-person doctor evaluation) rather than defaulting to reassurance.
* **FR-02.4 (Information-Gain Question Selection):** The engine shall dynamically select the next question by minimizing clinical entropy across differential conditions, capped at 8 conversational turns.

---

### 1.3 Centrally Managed CDSCO 2026 Medication Formulary Engine
* **FR-03.1 (Central Drug Registry):** The formulary service shall validate candidate medications against a versioned PostgreSQL registry containing CDSCO schedule classifications (OTC, Schedule G, Schedule H, Schedule H1, Schedule X).
* **FR-03.2 (Zero Autonomous AI Prescribing):** The system shall strictly prohibit the AI from issuing prescription drug recommendations directly to patients. Only `OTC` drugs may be presented as pharmacist-dispensing candidates.
* **FR-03.3 (Pediatric FDC Anti-Cold Ban):** The engine shall enforce the CDSCO 2026 gazette mandate: fixed-dose combinations of chlorpheniramine maleate + phenylephrine are strictly prohibited for children $<4$ years of age. Such presentations must set `triage_level = 'ORANGE'`.
* **FR-03.4 (Schedule H1 Register & Warnings):** Any prescription involving Schedule H1 antibiotics (e.g. 3rd/4th generation cephalosporins, fluoroquinolones) must trigger a regulatory warning requiring RMP registration logging and pharmacist dispensing register maintenance.

---

### 1.4 Pharmacist Workspace Console (`drgodly-hms`)
* **FR-04.1 (Next.js 16 Module Mounting):** The Pharmacist Console shall be mounted inside `drgodly-hms` under `src/app/[locale]/(apps)/drgodly/pharmacy`.
* **FR-04.2 (Live Prioritized Queue):** The queue shall update in real-time via WebSockets/SSE, ordering encounters by triage urgency: `RED` $\rightarrow$ `ORANGE` $\rightarrow$ `YELLOW` $\rightarrow$ `GREEN` $\rightarrow$ `UNABLE_TO_ASSESS`.
* **FR-04.3 (4-Column Clinical Workspace):**
  * Col 1: Patient Profile, Demographics, and Vapi/Telephony Audio Playback.
  * Col 2: Chief Complaint, Duration, Severity, and Relevant Negatives.
  * Col 3: AI Safety & Differentials (Screened red flags with green checkmarks, ICD-10 differentials, non-diagnostic disclaimers).
  * Col 4: Action Panel ([Dispense OTC], [Doctor Teleconsultation], [Recommend Lab], [Emergency Referral]).
* **FR-04.4 (Mandatory Allergy & Red-Flag Audit):** Pharmacists must check mandatory confirmation boxes ("Allergies verified", "Red flags cleared") before completing any dispensing action.

---

### 1.5 Doctor Telemedicine & E-Prescriptions (`drgodly-hms` + LiveKit)
* **FR-05.1 (One-Tap Telemed Escalation):** Pharmacists can escalate any encounter to on-call doctors, automatically creating a LiveKit video consultation room.
* **FR-05.2 (SBAR Pre-Consult Handoff):** The doctor portal shall render a structured pre-consult summary (Situation, Background, Assessment, Vitals) before video connection.
* **FR-05.3 (NMC-Compliant E-Prescription):** The system shall generate a cryptographically signed prescription PDF including Doctor Name, Qualifications, State Medical Council Registration No., Patient Demographics, Generic Drug Name, Strength, Form, Frequency, Duration, Route, and a SHA-256 digital signature hash.
* **FR-05.4 (FileNest Archival):** Finalized e-prescriptions and clinical reports must be automatically archived into FileNest (`@filenest-fs/nextjs`) and transmitted to the pharmacy dispensing terminal and patient WhatsApp.

---

### 1.6 FHIR R4 Integration (`FHIR R4 Server`)
* **FR-06.1 (REST API Synchronization):** All clinical encounters, patient profiles, observations, conditions, and medication requests shall synchronize with `FHIR R4 Server` (`/api/fhir/v1/`) using dual-format FHIR R4 JSON.
* **FR-06.2 (FastMCP AI Integration):** The `fhir-mcp` gateway at `:8002/mcp` shall allow AI agents to query patient history and prior clinical encounters securely using Bearer token authentication.

---

### 1.7 WhatsApp Messaging & Patient Web-Report
* **FR-07.1 (Instant Delivery):** Dispatches an interactive Meta WhatsApp template within 60 seconds of call termination.
* **FR-07.2 (Interactive Buttons):** Provides quick-action buttons: `[📄 View Full Report]`, `[👨‍⚕️ Consult Doctor]`, `[🧪 Find Labs]`.
* **FR-07.3 (Web-Report Viewer):** Renders a responsive web-report (`/r/{reportId}`) containing symptom timelines, cleared danger signs, potential clinical explanations, recommended next steps, and nearby NABL-accredited diagnostic labs.

---

## 2. Non-Functional Requirements (NFR)

* **NFR-01 (Voice Turnaround Latency):** Speech-to-Speech turnaround latency must be $<800\text{ ms}$ at $P_{95}$.
* **NFR-02 (System Availability):** Frontend (`drgodly-hms`) and FHIR Server (`FHIR R4 Server`) must maintain 99.9% uptime.
* **NFR-03 (Concurrency):** Voice gateway must scale to 2,500 concurrent voice sessions.
* **NFR-04 (Data Localization):** All databases, audio caches, and cloud infrastructure must reside in India (AWS/GCP Mumbai `ap-south-1`).
* **NFR-05 (Security & Cryptography):** TLS 1.3 in transit; AES-256-GCM field-level encryption on all patient PII/PHI.
* **NFR-06 (DPDP 30-Day Voice Purge):** Raw telephony audio recordings must be automatically purged after 30 days.
* **NFR-07 (Web UI Performance):** Next.js 16 frontend First Contentful Paint (FCP) $<1.0\text{ s}$ and zero Cumulative Layout Shift (CLS).
