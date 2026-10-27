# DrGodly Pharmacy Assist — User Stories & Acceptance Criteria
**Document ID:** DRG-US-2026-V2  
**Product:** DrGodly Pharmacy Assist  
**Ecosystem Integration:** [`Yazhnimalan/bezs-hms`](https://github.com/Yazhnimalan/bezs-hms) (Frontend), [`naveenraj-g/fhir`](https://github.com/naveenraj-g/fhir.git) (Backend), [`Yazhnimalan/bezs-agent`](https://github.com/Yazhnimalan/bezs-agent) (Voice AI)  
**Format:** Agile User Stories with Gherkin Acceptance Criteria (Given-When-Then)  
**Status:** Approved for Engineering Implementation  

---

## Persona Directory

1. **Patient (Rajesh, 42M):** Everyday pharmacy walk-in customer with acute episodic discomfort.
2. **Pharmacist (Ramesh, R.Ph):** Licensed retail chemist using `bezs-hms` Pharmacy Workspace.
3. **Doctor (Dr. Radhakrishnan, MBBS, MD):** Telemedicine doctor using `bezs-hms` + LiveKit.
4. **Lab Partner (Apollo Diagnostics Manager):** Operational manager receiving diagnostic pathology referrals.
5. **Chain Administrator (Regional Retail Head):** Oversees 50+ retail pharmacy branches.
6. **Clinical Governance Lead (Medical Director):** Authorizes and audits versioned clinical protocols.

---

## Epic 1: Patient Self-Service & Multilingual Voice Intake

### US-P01: Zero-Friction QR Scan to Phone Dialer
* **As a** pharmacy customer standing in front of a counter standee,
* **I want** to scan the QR code with my mobile phone camera and have it immediately open my dialer with DrGodly's phone number,
* **So that** I do not have to download an application, register an account, or enter payment details while waiting in line.
* **Acceptance Criteria:**
  ```gherkin
  Scenario: Customer scans physical counter QR code with modern smartphone
    Given the patient is standing at an active DrGodly pharmacy counter
    When the patient points their mobile phone camera at the QR standee
    Then the phone recognizes the universal "tel:+918047361899" URI scheme
    And automatically launches the native mobile dialer with the phone number pre-filled
    And displays a prompt for the user to tap "Call".
  ```

### US-P02: Statutory AI Disclosure & Multilingual Selection
* **As a** patient calling the DrGodly hotline,
* **I want** the voice agent (powered by Vapi / bezs-agent) to state clearly that it is an AI assistant and let me choose my language,
* **So that** I understand that I am not talking to a human physician and can converse in the language I am most comfortable with.
* **Acceptance Criteria:**
  ```gherkin
  Scenario: Inbound call initiates with mandatory statutory disclosure
    Given the telephony session connects successfully
    When the voice agent delivers its opening greeting
    Then it explicitly states: "Welcome to DrGodly. I am an AI health assistant, not a doctor."
    And it announces language selection options: "For English press 1, Hindi ke liye 2 dabayein, Tamizhukku 3..."
    And it allows the patient to select either via speech ("Hindi") or DTMF tone ("2").
  ```

### US-P03: DPDP Act 2023 Compliant Verbal Consent
* **As a** patient sharing health symptoms,
* **I want** to be told how my personal health data will be used and give explicit verbal agreement,
* **So that** my data privacy rights under India's Digital Personal Data Protection Act 2023 are protected.
* **Acceptance Criteria:**
  ```gherkin
  Scenario: Patient provides affirmative verbal consent
    Given the language has been established
    When the agent asks: "I will collect your symptoms to prepare your pharmacy intake report. Do you agree to continue?"
    And the patient responds with an affirmative utterance ("Yes", "Haan", "Aam", "Okay")
    Then the system logs an affirmative record in the "consents" table with timestamp and audio offset
    And transitions the dialogue state to DEMOGRAPHICS.
  ```

---

## Epic 2: WhatsApp Engagement & Patient Report

### US-P04: Instant WhatsApp Summary Notification
* **As a** patient who just hung up the phone,
* **I want** a WhatsApp message delivered within 60 seconds summarizing my intake,
* **So that** I have an immediate written reference before speaking with the pharmacist.
* **Acceptance Criteria:**
  ```gherkin
  Scenario: WhatsApp notification delivery upon call conclusion
    Given the voice intake completes successfully
    When the call terminates
    Then the WhatsApp Service dispatches an interactive Meta template to the caller's phone number within 60 seconds
    And includes interactive buttons: "[View Report]", "[Consult Doctor]", "[Find Labs]".
  ```

### US-P05: Mobile-Optimized Dynamic Web-Report Viewer
* **As a** patient tapping "[View Report]" in WhatsApp,
* **I want** to see an interactive, mobile-optimized breakdown of my clinical intake hosted on `bezs-hms`,
* **So that** I can read possible clinical explanations, red-flag clearance status, and recommended next steps.
* **Acceptance Criteria:**
  ```gherkin
  Scenario: Web report rendering
    Given a patient clicking the secure report link
    When the browser loads "https://rx.drgodly.com/r/{reportId}"
    Then the report renders in under 1.0 second on a 4G connection
    And displays cleared danger signs, potential clinical causes, and nearby accredited laboratories.
  ```

---

## Epic 3: Pharmacist Workspace & Clinical Oversight (`bezs-hms`)

### US-PH01: Real-Time Prioritized Intake Queue
* **As a** licensed retail pharmacist on duty,
* **I want** a live-updating web queue inside `bezs-hms` ordering patient intakes by clinical triage urgency,
* **So that** I can immediately attend to patients with potential complications before routine cases.
* **Acceptance Criteria:**
  ```gherkin
  Scenario: Prioritization of patient queue
    Given four finished encounters in the pharmacy queue (RED, ORANGE, YELLOW, GREEN)
    When the pharmacist opens "/[locale]/(apps)/bezs/pharmacy"
    Then the queue is sorted in strict descending order of urgency: RED, ORANGE, YELLOW, GREEN
    And emergency RED cases trigger an audible alert and pulsing red badge.
  ```

### US-PH02: 4-Column Clinical Review Workspace
* **As a** pharmacist opening a patient record,
* **I want** an organized 4-column screen displaying demographics, symptoms, AI safety/differentials, and action controls,
* **So that** I can evaluate the patient's entire medical situation in under 30 seconds.
* **Acceptance Criteria:**
  ```gherkin
  Scenario: Pharmacist views clinical workspace
    Given the pharmacist clicks on Rajesh Kumar's encounter row
    When the 4-column workspace renders
    Then Column 1 displays Demographics, Allergies, and Vapi audio playback
    And Column 2 displays Chief Complaint, Timeline, and Relevant Negatives
    And Column 3 displays Triage Level, Cleared Red Flags, and ICD-10 Differential Diagnoses
    And Column 4 displays Action Controls: [Dispense OTC], [Doctor Teleconsult], [Recommend Lab], [Emergency].
  ```

### US-PH03: CDSCO-Compliant OTC Dispensing & Allergy Gate
* **As a** pharmacist dispensing over-the-counter care,
* **I want** the system to validate candidate OTC medicines against the central CDSCO formulary and patient allergies,
* **So that** I never accidentally dispense a restricted Schedule H/H1 antibiotic or an allergenic compound.
* **Acceptance Criteria:**
  ```gherkin
  Scenario: Pharmacist dispenses protocol-approved medication
    Given a patient with a confirmed allergy to Paracetamol
    When the pharmacist opens the [Dispense Care] modal
    Then any compound containing Acetaminophen/Paracetamol is disabled and flagged with an allergy warning
    And the pharmacist CANNOT click "Confirm Dispense" until checking:
    "☑ I have verified allergies and counseled the patient on dosage and red flags."
    And the dispense event generates a FHIR MedicationRequest in naveenraj-g/fhir.
  ```

### US-PH04: One-Tap Telemedicine Doctor Escalation (LiveKit)
* **As a** pharmacist who determines a patient needs clinical evaluation beyond pharmacy care,
* **I want** to click "Doctor Consultation" to instantly transfer the patient's intake to an on-call tele-doctor,
* **So that** the customer receives immediate physician attention via LiveKit without leaving the pharmacy.
* **Acceptance Criteria:**
  ```gherkin
  Scenario: Escalation to DrGodly Telemedicine Doctor
    Given an encounter with triage level YELLOW or ORANGE
    When the pharmacist clicks [Doctor Consultation]
    Then an encounter referral is created in the doctor pool
    And provisions a LiveKit video consultation room
    And dispatches an SMS/WhatsApp notification to the patient with the video room link.
  ```

---

## Epic 4: Doctor Telemedicine & FHIR Synchronization (`naveenraj-g/fhir`)

### US-D01: SBAR Pre-Consultation Structured Handoff
* **As a** Registered Medical Practitioner (RMP) accepting a teleconsultation,
* **I want** to review a structured SBAR clinical summary before joining the video call,
* **So that** I do not waste consultation time asking repetitive demographic and onset questions.
* **Acceptance Criteria:**
  ```gherkin
  Scenario: Doctor reviews pre-consultation summary
    Given a doctor accepts a pending pharmacy referral
    When the doctor consultation screen opens in bezs-hms
    Then the left panel displays SBAR summary (Situation, Background, Assessment, Vitals)
    And the doctor can launch the LiveKit video stream with one tap.
  ```

### US-D02: Automatic FHIR R4 Synchronization
* **As a** clinical systems engineer,
* **I want** every completed pharmacy intake, diagnosis, and prescription to automatically synchronize with `naveenraj-g/fhir`,
* **So that** the patient has a unified, interoperable health record across the DrGodly ecosystem.
* **Acceptance Criteria:**
  ```gherkin
  Scenario: Complete intake synchronization to FHIR server
    Given a completed pharmacy intake session
    When the encounter closes
    Then FhirSyncService posts to naveenraj-g/fhir:
      * POST /api/fhir/v1/Patient (creates/finds patient)
      * POST /api/fhir/v1/Encounter (creates AMB encounter)
      * POST /api/fhir/v1/Observation (records symptoms)
      * POST /api/fhir/v1/Condition (records differential diagnoses)
    And logs an immutable AuditEvent verifying complete FHIR conformance.
  ```
