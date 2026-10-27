# DrGodly Pharmacy Assist — Master Product, Business, System & Technical Specification
**Document ID:** DRG-PHARM-SPEC-2026-V3-FINAL  
**Product Name:** DrGodly Pharmacy Assist  
**Jurisdiction:** Republic of India  
**Applicable Regulations & Standards:**  
* **CDSCO Drugs Rules 2026:** Central Versioned Formulary, Schedule H/H1 Prescription Restrictions, Gazette Notification on Pediatric Fixed-Dose Combination (FDC) Anti-Cold Syrups (Strict Prohibition under 4 Years).
* **Telemedicine Practice Guidelines 2020 (NMC / MoHFW):** Registered Medical Practitioner (RMP) primacy; AI/ML platforms prohibited from autonomous counseling, diagnosis, or prescribing.
* **Digital Personal Data Protection (DPDP) Act 2023:** Affirmative bilingual consent, purpose limitation, right to erasure, fiduciary obligations.
* **Ayushman Bharat Digital Mission (ABDM):** FHIR R4 profile compatibility, ABHA ID linking, Health Facility Registry (HFR).
* **NABL (ISO 15189):** Diagnostic laboratory network quality compliance.

---

## 1. Executive Summary & Ecosystem Repositories

In India, approximately 65-70% of first-contact outpatient health queries occur at neighborhood retail pharmacies without a structured medical consultation. Patients verbally present acute symptoms to busy counter staff, leading to inappropriate empirical dispensing, frequent misuse of Schedule H/H1 antimicrobials, delayed hospital referrals for surgical emergencies, and zero persistent medical documentation.

**DrGodly Pharmacy Assist** transforms the unstructured verbal symptom description at Indian retail pharmacy counters into an intelligent, protocol-constrained digital clinical intake layer. By placing a physical QR poster at the pharmacy counter that triggers an app-free phone call (`tel:` protocol) or instant voice intake, DrGodly captures patient demographics, chief complaints, symptom trajectories, and red flags through a warm, localized voice AI assistant.

### Master Ecosystem Repositories & Reusable Microservices

DrGodly Pharmacy Assist is engineered to integrate natively with DrGodly’s existing production healthcare microservices:

1. **Frontend / Hospital Management System Hub:** **DrGodly HMS Frontend Hub**
   * Pharmacist Workspace Console mounted natively under `src/app/[locale]/(apps)/drgodly/pharmacy`.
   * Tech stack: Next.js 16 App Router, React 19, Tailwind CSS v4, Radix UI, shadcn, Lucide Icons.
   * Telemedicine escalations utilize `LiveKit` video rooms (`@livekit/components-react`).
   * Clinical intake PDFs and invoices persist in `FileNest` (`@filenest-fs/nextjs`).
2. **Backend / FHIR Interoperability Server:** **DrGodly FHIR R4 Interoperability Server**
   * FastAPI + SQLAlchemy 2.0 + PostgreSQL 15, exposing full FHIR R4 REST resources (`/api/fhir/v1/Encounter`, `Patient`, `Condition`, `Observation`, `MedicationRequest`).
   * Streamable FastMCP server (`fhir-mcp`) running at `:8002/mcp` for schema-validated clinical queries by AI agents.
3. **Voice AI Ingestion Engine:** **DrGodly Voice AI Agent** + Vapi / LiveKit Agents
   * Low-latency streaming voice processing Indian English, Hindi, Tamil, Telugu, Marathi, and colloquial code-switching (Hinglish/Tanglish).
4. **IAM / Authentication Service:** **DrGodly IAM Authentication Service**
   * BetterAuth server running at `:5001` handling RBAC for Pharmacists, RMPs, Lab Partners, and Pharmacy Admins.
5. **Document Storage:** **DrGodly FileNest Document Storage**
   * S3-compatible microservice running at `:8000` storing patient reports and audio recordings with AES-256 encryption.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              DRGODLY INTEGRATED WORKFLOW                                │
│                                                                                         │
│   [Pharmacy QR (tel:)] ──► [Vapi / drgodly-agent Voice AI] ──► [Decoupled 4-Prompt AI]     │
│                                                                    │                    │
│                                                                    ▼                    │
│   [Patient WhatsApp Report] ◄────── [drgodly-hms Pharmacist Console] ◄                    │
│                                                │                                        │
│                               ┌────────────────┴────────────────┐                       │
│                               ▼                                 ▼                       │
│                    [Dispense Approved OTC]           [LiveKit Doctor Telemed]           │
│                               │                                 │                       │
│                               └────────────────┬────────────────┘                       │
│                                                ▼                                        │
│                                    [FHIR R4 Server Server]                             │
│                                    (/api/fhir/v1/Encounter, Patient,                    │
│                                     Condition, Observation, MedicationRequest)          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Product Vision & Value Propositions

### 2.1 Product Vision
To empower every retail pharmacy in India to become an accredited, digitally connected primary triage and clinical care navigation center—improving diagnostic timeliness, preventing irrational antibiotic use, and safeguarding patient lives through protocolized triage.

### 2.2 Core Product Propositions by Stakeholder

| Stakeholder | Pain Point in Current Model | DrGodly Transformative Value Proposition |
| :--- | :--- | :--- |
| **Walk-in Patients** | Rushed verbal consultation; no record of symptoms; frequent inappropriate self-medication; fear of expensive clinics. | Zero-app, 1-tap phone dialer intake in native language; instant WhatsApp clinical summary; immediate access to doctor or NABL lab if red flags exist. |
| **Retail Pharmacists** | Legal liability under Drugs & Cosmetics Act; cognitive overload; commercial pressure to dispense without clinical history. | High-density 4-column clinical console; automated SBAR summary; clear CDSCO Schedule OTC vs Rx gating; actionable 4-button decision workflow. |
| **Telemedicine Doctors (RMPs)**| Teleconsultations without pre-visit triage are unstructured, time-consuming, and prone to diagnostic omission. | Pre-consultation SBAR note, differential diagnoses, vital sign indicators, audio snippet playback, and LiveKit 1-click video call handoff. |
| **Pharmacy Chains & Owners**| Disconnected counters; zero digital retention; walk-outs when pharmacist is busy; audit compliance risks. | Increased OTC revenue, structured teleconsultation revenue share, diagnostic lab referral commissions, and full CDSCO audit trail. |
| **Diagnostic Laboratories** | High customer acquisition cost (CAC); patients delay investigations until severe symptoms develop. | Real-time test indication matching, nearby distance-based laboratory discovery, transparent test pricing, and home collection booking. |

---

## 3. Product Principles

1. **AI-First Voice Intake:** Patients must not be required to download an app or type text. A universal QR triggering a standard telephony call or streaming web voice session ensures 100% digital inclusion regardless of literacy.
2. **Human Clinical Oversight (Zero Autonomous AI Prescribing):** The AI engine only collects symptoms, extracts clinical concepts, and screens against protocols. Only a licensed Pharmacist can dispense approved OTC items, and only an RMP can diagnose and prescribe Schedule H/H1 drugs.
3. **Safety-First & Deterministic Red-Flag Triage:** Conversational LLMs are decoupled from safety classification. Red flags are evaluated by deterministic, peer-reviewed clinical rules that immediately escalate to emergency services (108) when life threats appear.
4. **Protocol-Constrained AI:** The clinical intelligence layer operates strictly within 13 standardized clinical protocols approved by the Clinical Governance Board.
5. **India-First Localization:** Deep multilingual voice support for 10+ Indian languages and colloquial code-switching (Hinglish, Tanglish, Mintlish).
6. **Privacy by Design (DPDP Act 2023):** Affirmative bilingual consent before recording; encrypted audio snippets; data minimization; strict access controls.
7. **ABDM Interoperability:** FHIR R4 standard data modeling for seamless longitudinal integration into the Ayushman Bharat Digital Mission.

---

## 4. End-to-End Primary Patient Journey

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. Enter     │ ──► │ 2. Scan QR   │ ──► │ 3. Phone     │ ──► │ 4. Language  │
│    Pharmacy  │     │    Display   │     │    Dialer    │     │    & Consent │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                      │
                                                                      ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 8. WhatsApp  │ ◄── │ 7. Intake    │ ◄── │ 6. Red-Flag  │ ◄── │ 5. Clinical  │
│    Report    │     │    Completion│     │    Screening │     │    Interview │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

1. **Step 1 — Counter QR Scan:** The physical pharmacy counter features a prominent acrylic display:
   > **Not feeling well? Talk to DrGodly.**  
   > *Scan → Call → Explain your symptoms*  
   > *Get your personalized pharmacy health report on WhatsApp*  
   > *(DrGodly is an AI health assistant. It does not replace a doctor.)*
2. **Step 2 — Telephony Dialer Trigger:** Scanning the QR opens the native mobile phone dialer with a pre-filled toll-free or localized virtual DID number (e.g. `tel:+918069000000;ext=PHARM_102`) or launches the WebRTC streaming voice room.
3. **Step 3 — AI Voice Agent Greeting:** Warm conversational greeting in Indian English, Hindi, Tamil, Telugu, or regional dialect.
4. **Step 4 — Language Selection & DPDP Consent:** Affirmative spoken consent obtained: *"To help the pharmacist and doctor understand your symptoms, DrGodly will record and summarize this call. Do you agree?"*
5. **Step 5 — Demographic Intake:** Age, gender, and pregnant/lactating status (vital for CDSCO medication gating).
6. **Step 6 — Dynamic Clinical Interview:** Single-question-at-a-time conversational elicitation of chief complaint, duration, severity scale (1-10), and character.
7. **Step 7 — Safety Screening & Red-Flag Triage:** Deterministic checks for emergency symptoms (chest pain, severe breathlessness, stiff neck, altered sensorium, intestinal obstruction).
8. **Step 8 — Dual-Message WhatsApp Delivery:** Immediate delivery of clinical summary, interactive action buttons, and digital health report with statutory CDSCO disclaimer.

---

## 5. Decoupled 4-Prompt AI Voice Architecture

To guarantee clinical safety and eliminate LLM hallucinations, DrGodly implements Section 37 of the specification: **The 4-Prompt Decoupled Voice Pipeline**:

```
[Raw Spoken Audio]
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ PROMPT 1: CONVERSATION CONTROLLER                           │
│ - Warm Indian empathy; asks ONE question at a time          │
│ - Verifies DPDP consent; controls intake turn flow          │
│ - STRICT BOUNDARY: Never offers clinical diagnosis          │
└─────────────────────────────────────────────────────────────┘
       │ Spoken Transcript
       ▼
┌─────────────────────────────────────────────────────────────┐
│ PROMPT 2: CLINICAL CONCEPT EXTRACTOR                        │
│ - Transforms transcript into structured SBAR JSON           │
│ - Maps chief complaint, duration, severity, body site       │
│ - Extracts relevant negatives, chronic history, allergies   │
└─────────────────────────────────────────────────────────────┘
       │ Structured Clinical Concepts
       ▼
┌─────────────────────────────────────────────────────────────┐
│ PROMPT 3: SAFETY CLASSIFIER (DETERMINISTIC GUARDRAILS)      │
│ - Evaluates concepts against 13 versioned protocol schemas  │
│ - Assigns Triage Category: RED / ORANGE / YELLOW / GREEN    │
│ - Enforces CDSCO 2026 Under-4 Pediatric Anti-Cold FDC Ban   │
└─────────────────────────────────────────────────────────────┘
       │ Triage Level & Safety Flags
       ▼
┌─────────────────────────────────────────────────────────────┐
│ PROMPT 4: CLINICAL REPORT GENERATOR                         │
│ - Produces SBAR note for Pharmacist / Doctor                │
│ - Formats 2-message WhatsApp delivery payload for Patient   │
│ - Injects statutory CDSCO & Telemedicine Practice disclaimer│
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Standardized Suite of 13 Clinical Protocols

DrGodly Pharmacy Assist implements 13 peer-reviewed, deterministic clinical protocols located in `protocols/` conforming to `protocol.schema.json`:

| # | Protocol ID | Domain | Title | Key Red Flags Screened | Primary Differentials | Candidate Safe OTC / Actions |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `PROTO_FEVER_001` | `FEVER` | Acute Fever & Pyrexia (Adult & Pediatric) | Temp > 104°F, Infant < 3m, Meningism, Hemorrhage / Dengue shock | Acute Viral Fever, Dengue (non-severe), Malaria | Paracetamol (Dolo/Calpol), ORS; **CDSCO ban: No Chlorpheniramine+Phenylephrine < 4 yrs** |
| **2** | `RESP_COUGH_COLD_001` | `RESPIRATORY` | Acute Upper Respiratory Infection & Cough | Resting dyspnea, Stridor, Hemoptysis, Under-4 FDC guardrail | Common Cold (Viral URI), Allergic Rhinitis, Acute Bronchitis | Steam inhalation, Saline nasal spray, Dextromethorphan (dry), Ambroxol (wet) |
| **3** | `PROTO_SORE_THROAT_001`| `SORE_THROAT` | Acute Sore Throat & Pharyngitis | Inability to swallow saliva, Stridor, Trismus / Quinsy | Viral Pharyngitis, Group A Strep (GAS) Tonsillitis | Warm saline gargles, Lozenges, Paracetamol; Strep test referral |
| **4** | `PROTO_DIARRHEA_001` | `DIARRHEA` | Acute Diarrhea & Dehydration | Severe dehydration, Lethargy, Gross bloody dysentery, Anuria | Viral Gastroenteritis, Food Poisoning, Amoebiasis | WHO ORS (Electral), Zinc supplement, Racecadotril (adult); Electrolytes test |
| **5** | `PROTO_CONSTIPATION_001`| `CONSTIPATION`| Acute Constipation & Bowel Irregularity| Complete obstruction, Feculent vomiting, Gross rectal bleeding | Functional constipation, Acute anal fissure | Dietary fiber (Isabgol), Lactulose, Hydration; Stool softeners |
| **6** | `PROTO_VOMITING_001` | `NAUSEA_VOMITING`| Acute Nausea & Vomiting | Hematemesis (coffee-ground), Intractable vomiting > 12h, Projectile head trauma | Acute Gastritis, Motion sickness, Enterotoxin | Small sips ORS, Domperidone OTC, Ginger lozenges; Electrolytes check |
| **7** | `GI_DYSPEPSIA_ADULT_001`| `ACIDITY_GERD` | Adult Dyspepsia & Epigastric Discomfort | Cardiac radiation (arm/jaw pain), Melena/hematemesis, Rigid abdomen | GERD / Reflux, Non-Ulcer Dyspepsia, Peptic Ulcer | Antacid gels (Gelusil/Digene), Famotidine 20mg OTC, PPI short course |
| **8** | `PROTO_HEADACHE_001` | `HEADACHE` | Acute Headache & Migraine Screening | Thunderclap onset, Focal neurological deficit / Stroke mimic, Stiff neck | Tension-type headache, Migraine without aura | Paracetamol, Hydration, Rest; BP measurement, Doctor teleconsult |
| **9** | `PROTO_MSK_PAIN_001` | `MUSCULOSKELETAL`| Acute Musculoskeletal & Low Back Pain | Cauda equina (urinary incontinence, groin numbness), Foot drop | Mechanical lumbar strain, Sciatica / Radiculopathy | Topical Diclofenac gel, Paracetamol, Heat/Cold pack; Spine X-ray |
| **10**| `PROTO_SKIN_RASH_001` | `SKIN_RASH` | Minor Skin Rashes & Contact Dermatitis | SJS/TEN mucosal peeling, Non-blanching petechial purpura | Contact dermatitis, Acute urticaria, Insect bite | Calamine lotion, Cetirizine 10mg, Emollients; CBC with AEC |
| **11**| `PROTO_ALLERGY_001` | `ALLERGY` | Allergic Rhinitis & Seasonal Flare | Anaphylaxis / Angioedema / Lip swelling, Acute bronchospasm | Allergic rhinitis, Vasomotor rhinitis | Levocetirizine, Saline nasal spray; Total IgE blood test |
| **12**| `PROTO_URINARY_001` | `URINARY` | Dysuria & Lower Urinary Tract Symptoms | Flank pain with rigors (Pyelonephritis), Frank hematuria, Pregnancy UTI | Acute cystitis, Urethral crystalluria | Urinary alkalizer (Disodium hydrogen citrate), Hydration; Urine R/M test |
| **13**| `PROTO_GENERAL_FATIGUE_001`| `GENERAL` | General Fatigue & Weakness | Exertional syncope, Cardiac arrhythmia, Unexplained weight loss + night sweats | Nutritional anemia, Post-viral asthenia | Multivitamin / Iron-Folic supplement, Hydration; CBC, HbA1c, TSH tests |

---

## 7. Deterministic Red-Flag Triage Engine

DrGodly maps every intake into one of 5 standardized triage tiers:

* **RED (Immediate Emergency):** Acute life threats (e.g. chest pain with jaw radiation, sudden thunderclap headache, respiratory stridor, infant < 3 months with high fever).
  * *Immediate Action:* Spoken voice alert to inform pharmacist immediately; on-screen red banner; direct prompt to dial **108 (National Ambulance)**; automated alert to pharmacist.
* **ORANGE (Same-Day Clinician Assessment):** High-risk conditions requiring formal RMP medical evaluation (e.g. acute dysentery with high fever, suspected dengue with severe pain, urinary burning in pregnancy, pediatric anti-cold symptom < 4 years).
  * *Immediate Action:* 1-click LiveKit telemedicine doctor handoff; laboratory order recommendation.
* **YELLOW (Pharmacist Evaluation & Review):** Moderate symptoms within common pharmacist care scope (e.g. acute uncomplicated dyspepsia, tension headache, mild diarrhea without dehydration).
  * *Immediate Action:* Pharmacist reviews SBAR summary; dispenses approved CDSCO OTC items; provides lifestyle counseling.
* **GREEN (Low-Risk / Self-Care Pathway):** Mild self-limiting symptoms (e.g. mild allergic sneezing, superficial muscle soreness).
  * *Immediate Action:* Non-pharmacological advice, hydration, rest, standard OTC comfort care.
* **UNABLE_TO_ASSESS:** Unclear speech, conflicting symptoms, or non-cooperative intake.
  * *Immediate Action:* Mandatory in-person physical consultation recommendation.

---

## 8. CDSCO 2026 Central Formulary & Regulatory Guardrails

The Indian regulatory framework strictly limits what retail pharmacies can dispense without an active RMP prescription:

1. **Central Versioned Formulary Service:** Implemented in [`src/modules/server/core/formulary/cdscoFormulary.service.ts`](file:///d:/Pharmacy%20app/src/modules/server/core/formulary/cdscoFormulary.service.ts). All medications are centrally indexed with CDSCO classification (`OTC`, `SCHEDULE_H`, `SCHEDULE_H1`, `SCHEDULE_X`, `SUPPLEMENT`).
2. **Strict Prescription Gating:** Schedule H and H1 antimicrobials (e.g. Amoxicillin, Cefixime, Azithromycin, Ofloxacin) are strictly disabled for OTC dispensing. They require an active teleconsultation with a registered medical practitioner.
3. **Pediatric Anti-Cold Combination Ban (CDSCO 2026):** Fixed-dose combinations of Chlorpheniramine Maleate + Phenylephrine HCl are strictly prohibited for children under 4 years of age. Single paracetamol formulation only, with mandatory weight-based dosing.
4. **Telemedicine Practice Guidelines 2020 Compliance:** The AI engine never generates a prescription. When an RMP consults via LiveKit, the system generates an e-Prescription containing the RMP's Name, NMC Registration Number, Qualification, Clinic Address, Patient Details, and cryptographic digital signature.

---

## 9. Pharmacist Workspace Console & Action Workflow

The Pharmacist Console (mounted at `/pharmacy/workspace` and mobile `/triage`) is designed for 10-second high-density triage:

### 9.1 Top Bar & Real-Time KPI Cards
* **Today's Intakes:** `124` (Real-time count of walk-ins who completed voice intake)
* **Doctor Referrals:** `14` (Escalated to on-demand teleconsultation)
* **Completed / Dispensed:** `98` (Care completed by pharmacist)
* **Needs Review:** `12` (Unreviewed queue items awaiting decision)

### 9.2 4-Column Clinical Layout
1. **Column 1 — Queue & Patient Identity:** Filterable by triage color (Red, Orange, Yellow, Green), search by patient name/phone, intake timestamp.
2. **Column 2 — AI Clinical SBAR Summary:** Structured Situation, Background, Assessment, and Recommendation with 1-click audio recording playback.
3. **Column 3 — Differentials, Red Flags & Regulatory Rules:** ICD-10 differentials, red flags screened (green checks for negatives, red badges for alerts), CDSCO formulary alerts.
4. **Column 4 — Pharmacist Action Center:** 4 primary action buttons:
   * `[Provide Care / Dispense OTC]`: Opens formulary drawer with approved OTC products.
   * `[Doctor Consultation]`: Triggers 1-click LiveKit telemedicine video bridge with available RMP.
   * `[Recommend Investigation]`: Dispatches nearby laboratory test booking via WhatsApp.
   * `[Add Pharmacist Notes]`: Adds professional audit remarks to the permanent ABDM encounter record.

---

## 10. Patient WhatsApp Delivery & Interactive Experience

Upon intake completion, the patient receives a dual-message sequence on WhatsApp from DrGodly's verified business account:

### Message 1: Clinical Notification & Triage Status
```text
Namaste Rahul Sharma ji,

Thank you for speaking with DrGodly at Apollo Pharmacy Indiranagar.
Your clinical intake summary has been securely transmitted to the counter pharmacist.

📋 Intake ID: #INTAKE-2026-8812
⏱️ Triage Status: YELLOW (Pharmacist Care Pathway)
🩺 Chief Complaint: Acidity and burning in chest (2 days)

Your pharmacist is reviewing your details now.
```

### Message 2: Interactive Care Action Buttons
Four interactive WhatsApp CTA buttons:
1. `[📄 View My Health Report]`: Opens web clinical report viewer (`/report/[id]`).
2. `[👨‍⚕️ Consult Doctor Now]`: Connects to immediate video teleconsultation.
3. `[🧪 Find Labs Nearby]`: Opens nearby NABL-accredited diagnostic laboratory network.
4. `[📤 Share Report]`: Allows forwarding the structured SBAR note to personal family physician.

### Statutory Disclaimer (Mandatory on All Reports)
> *"DrGodly is an AI clinical intake assistant and does NOT provide medical advice, diagnosis, or prescription. This health summary is prepared solely for licensed registered medical practitioners and pharmacists in compliance with the NMC Telemedicine Practice Guidelines 2020 and CDSCO Drugs Rules 2026."*

---

## 11. Diagnostic Laboratory Network & Integration

Integrated diagnostic partner network providing automated test suggestions based on clinical protocol indications:

| Lab Partner | Distance | NABL Accr. | Turnaround | Popular Tests & Transparent Pricing |
| :--- | :---: | :---: | :---: | :--- |
| **Dr Lal PathLabs (Indiranagar Hub)** | 1.2 km | Yes (ISO 15189) | 4-6 hours | CBC: ₹350 • Lipid Profile: ₹650 • HbA1c: ₹450 • Dengue NS1: ₹800 |
| **Metropolis Healthcare (MG Road)** | 2.5 km | Yes (ISO 15189) | 6-8 hours | Thyroid TSH: ₹500 • Liver Function: ₹750 • Kidney Function: ₹700 |
| **Agilus Diagnostics (Koramangala)** | 3.1 km | Yes (ISO 15189) | Same day | Stool R/M: ₹300 • Urine Culture: ₹650 • Full Health Checkup: ₹1,499 |
| **Suburban Diagnostics (Domlur)** | 1.8 km | Yes (ISO 15189) | 4 hours | Serum Electrolytes: ₹450 • Fasting Blood Sugar: ₹120 • Vitamin D: ₹850 |

---

## 12. Mobile React Native Architecture (`mobile/`)

DrGodly provides a production-grade React Native mobile application for smartphones and pharmacy handheld POS tablets:

* **Framework:** React Native 0.76.5, TypeScript 5.8, React Navigation 7.
* **Component Architecture:**
  * [`mobile/src/screens/HomeScreen.tsx`](file:///d:/Pharmacy%20app/mobile/src/screens/HomeScreen.tsx): Counter QR poster display, 1-tap phone dialer trigger (`Linking.openURL('tel:+918069000000')`), 4-step intake walkthrough, and interactive Speech-to-SBAR simulator.
  * [`mobile/src/screens/DoctorSearchScreen.tsx`](file:///d:/Pharmacy%20app/mobile/src/screens/DoctorSearchScreen.tsx): Search bar, specialty pills, fee filters, and NMC verified doctor cards.
  * [`mobile/src/screens/DoctorDetailScreen.tsx`](file:///d:/Pharmacy%20app/mobile/src/screens/DoctorDetailScreen.tsx): Qualifications, multi-day calendar tabs, interactive slot chips with teal highlight toggle, and booking confirmation modal (`#TELE-2026-904`).
  * [`mobile/src/screens/ProductCatalogScreen.tsx`](file:///d:/Pharmacy%20app/mobile/src/screens/ProductCatalogScreen.tsx): CDSCO OTC vs Schedule H badges, category pills, quantity steppers, and floating cart bar.
  * [`mobile/src/screens/CheckoutScreen.tsx`](file:///d:/Pharmacy%20app/mobile/src/screens/CheckoutScreen.tsx): Itemized cart, Schedule H prescription gate, patient form, and transparent GST 12% calculation.
  * [`mobile/src/screens/PharmacistTriageScreen.tsx`](file:///d:/Pharmacy%20app/mobile/src/screens/PharmacistTriageScreen.tsx): Real-time KPI counters (`124` Intakes, `14` Referrals, `98` Completed, `12` Review), queue switcher, SBAR clinical summary, red flag screening, and 4 pharmacist decision actions.
  * [`mobile/src/screens/LabsScreen.tsx`](file:///d:/Pharmacy%20app/mobile/src/screens/LabsScreen.tsx): Nearby diagnostic partner labs with distance, NABL accreditation, test pricing, and booking modal.
* **Web Interactive Simulator:** Accessible directly in the Next.js web application at [`/mobile`](file:///d:/Pharmacy%20app/src/app/mobile/page.tsx) with an interactive iPhone 16 Pro mockup enabling live testing of all mobile screens.

---

## 13. Data Privacy, Encryption & Consent (DPDP Act 2023)

1. **Consent Protocol:** Explicit affirmative voice consent captured during call initiation. Consent token stored with timestamp and audio recording hash.
2. **Encryption:** All clinical records, audio files, and SBAR notes encrypted at rest using AES-256-GCM. All HTTP and SIP/WebRTC communications secured via TLS 1.3 and SRTP.
3. **Data Minimization:** No biometric data or unnecessary personal information collected. Intakes expire from browser memory after review.
4. **Audit Logging:** Every pharmacist decision, doctor escalation, and medication dispense logged to an immutable PostgreSQL audit log with user ID, timestamp, and IP address.

---

## 14. 7-Step Development & Implementation Flow

```
Step 0: Workspace & Git Setup (Modern boilerplate, feature branches, daily commits)
Step 1: Requirements Locking & Data Fields Blueprint (Lock mandatory doctor, drug, lab fields)
Step 2: Technical Design Document (TDD) & API Data Contracts (Mock JSON Schemas)
Step 3: Component Architecture (Separation of UI atoms, molecules, and organisms)
Step 4: Clean Mock Integration (Realistic Indian medical datasets)
Step 5: Interactive UX Details & Visual Polish (Toasts, loading skeletons, modal dialogs)
Step 6: Testing, Code Cleanup & Git Push (TypeScript strict type-check, build verification, remote push)
```

---

## 15. Repository Branching & Remote Deployment Status

* **Remote Git Repository:** `DrGodly Pharmacy Assist Monorepo`
* **Core Branches:**
  * `main`: Production release branch.
  * `development`: Active integration branch.
  * `feature/react-native-mobile-screens`: Mobile UI and cross-platform architecture branch.
* **Package Manager Support:** Standard `npm` commands supported across the entire workspace (`npm install`, `npm run dev`, `npm run build`, `npm run type-check`).
