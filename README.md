# DrGodly Pharmacy Assist — Master Engineering & Product Guide

> **AI-Powered Clinical Intake, Triage & Care Navigation for Indian Retail Pharmacies**  
> *Mobile-first healthcare platform with CDSCO 2026 formulary compliance, NMC 2020 Telemedicine guidelines, and DPDP Act 2023 privacy guardrails.*

---

## 📌 Table of Contents
1. [Project Overview & Vision](#-project-overview--vision)
2. [Ecosystem & Monorepo Architecture](#-ecosystem--monorepo-architecture)
3. [Technology Stack](#-technology-stack)
4. [4-Persona User Roles & Mobile UI Workflows](#-4-persona-user-roles--mobile-ui-workflows)
5. [Clinical Safety & Indian Regulatory Guardrails](#-clinical-safety--indian-regulatory-guardrails)
6. [Prerequisites & Environment Setup](#-prerequisites--environment-setup)
7. [Step-by-Step Installation & Running Guide](#-step-by-step-installation--running-guide)
8. [Available Scripts & Verification Commands](#-available-scripts--verification-commands)
9. [Documentation Suite](#-documentation-suite)

---

## 🏥 1. Project Overview & Vision

**DrGodly Pharmacy Assist** transforms the retail pharmacy counter across India from a simple medicine sales shop into an intelligent, protocol-guided first point of clinical contact:

* **The Problem:** In India, millions of patients visit retail chemists daily as their first point of care for fever, cough, digestive complaints, and body pain. Due to time constraints and lack of structured intake tools, serious red flags (e.g., myocardial infarction, pneumonia, appendicitis) are often missed, and inappropriate prescription medicines (Schedule H/H1 antibiotics and banned pediatric syrups) are sometimes dispensed without a valid doctor's prescription.
* **The Solution:** A multilingual, mobile-first intake system. Patients scan a counter QR standee or tap a 1-click call button, speak their symptoms in their native mother tongue (Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, English), and our decoupled Voice AI converts unstructured speech into a structured **SBAR** (Situation, Background, Assessment, Recommendation) clinical note.
* **The Clinical Principle:** **AI NEVER autonomously diagnoses or prescribes.** Instead, it organizes clinical data, screens for 8 critical red flags, and surfaces deterministic **CDSCO 2026**-compliant guidance to a licensed **Registered Pharmacist (R.Ph)** or routes the patient via 1-click teleconsultation to a **Registered Medical Practitioner (RMP / Doctor)**.

---

## 🏛️ 2. Ecosystem & Monorepo Architecture

The repository is organized as a clean, production-grade monorepo cleanly partitioned into **`frontend/`**, **`backend/`**, and **`docs/`**:

```text
d:/Pharmacy app/
├── frontend/                          # Pure React Native Mobile Codebase (iOS & Android)
│   ├── src/
│   │   ├── components/                # Reusable UI Atoms (Button, Badge, DoctorCard, SlotChip, EmergencyBanner, Modal)
│   │   ├── context/                   # Global Cart and Session state (CartContext)
│   │   ├── data/                      # Validated mock clinical datasets (doctors, intakes, products)
│   │   ├── navigation/                # Multi-role routing & stack navigation (AppNavigator, types)
│   │   ├── screens/                   # 22 Production Mobile Screens across all 4 personas
│   │   ├── theme/                     # Master design system tokens (colors, spacing, typography)
│   │   └── utils/                     # Indian currency (INR) formatting & date helpers
│   ├── App.tsx                        # Root application entrypoint wrapping context providers
│   ├── package.json                   # Mobile workspace dependencies
│   └── tsconfig.json                  # React Native TypeScript compiler configuration
│
├── backend/                           # Clinical Decision Support Engine & Backend Services
│   ├── api/                           # OpenAPI 3.0.3 specification for healthcare REST endpoints
│   ├── database/                      # PostgreSQL DDL with multi-tenancy, Row-Level Security (RLS) & audit logs
│   ├── prisma/                        # Prisma ORM schemas & migrations
│   ├── protocols/                     # 13 CDSCO-compliant clinical protocol JSON schemas (Draft-07 validated)
│   ├── src/
│   │   └── modules/core/
│   │       ├── fhir/                  # ABDM FHIR R4 REST API integration adapter
│   │       ├── formulary/             # CDSCO 2026 rule engine & pediatric FDC anti-cold syrup ban filter
│   │       ├── pharmacy/              # Pharmacy intake business logic & queue management
│   │       └── voice/                 # Decoupled 4-prompt Voice AI Orchestration Engine
│   ├── package.json                   # Backend workspace dependencies
│   └── tsconfig.json                  # Backend TypeScript compiler configuration
│
├── docs/                              # Comprehensive Master Specification Suite
│   ├── MASTER_DOCUMENT.md             # Master 15-section technical & clinical specification
│   ├── TECHNICAL_DESIGN_DOCUMENT.md   # Architectural design, schema layout & security posture
│   ├── API_DATA_CONTRACTS.md          # Mock JSON schemas for doctor, intake, lab, and inventory APIs
│   ├── MOBILE_ARCHITECTURE_REACT_NATIVE.md # Mobile UI architecture, touch targets & navigation
│   ├── REQUIREMENTS_LOCKING.md        # Core page blueprints, data fields & user action maps
│   └── ...                            # BRD, SRS, UX Specs, and Clinical Engine Specs
│
├── docker-compose.yml                 # Local development infrastructure (PostgreSQL 16 + Redis 7)
└── package.json                       # Monorepo root workspace orchestrator
```

---

## 💻 3. Technology Stack

### Frontend (Mobile Application)
* **Framework:** React Native `0.76.5` (Pure native mobile codebase; no web layers)
* **Language:** TypeScript `5.7+`
* **Navigation:** React Navigation `7.x` (Bottom Tabs + Dynamic Hierarchical Stack Navigator with full navigation history)
* **Design System:** Custom DrGodly Tokens:
  * Primary: `#185ADB` (Deep Medical Blue)
  * Secondary: `#16B8B0` (Mint Teal Accent)
  * Surfaces: `#FFFFFF` (Pure Card White) & `#F8FAFC` (Canvas Slate)
  * Text: `#172B4D` (Deep Navy Slate)
  * Triage Severity: `#C62828` (Red Flag), `#EA580C` (Urgent), `#B76A00` (Warning), `#18865B` (Safe)
  * Touch Targets: Minimum 48 × 48 px on all interactive elements

### Backend & Clinical Services
* **Runtime:** Node.js `>= 18` / TypeScript `5.7+`
* **Database:** PostgreSQL 16 (Relational models with Row-Level Security and audit trails)
* **Caching & Queue:** Redis 7 (Session locks, queue management, and temporary intake caching)
* **API Specifications:** OpenAPI 3.0.3 REST API with FHIR R4 interoperability layer
* **Clinical Protocol Engine:** 13 JSON Schemas conforming to Draft-07 standards

---

## 👥 4. 4-Persona User Roles & Mobile UI Workflows

The mobile app includes a top **Role Switcher Bar** (`👤 Patient`, `💊 Pharmacist (R.Ph)`, `🩺 Doctor (RMP)`, `⚙️ Admin / Ops`) allowing immediate exploration of every user journey:

### A. 👤 Patient / Caregiver Journey
1. **Counter QR Poster & 1-Tap Dialing (`HomeScreen.tsx`):**
   * High-visibility banner, counter QR standee graphic, and universal `tel:+918069000000` dialer action.
   * Interactive voice intake simulator demonstrating Hindi speech recognition and SBAR extraction.
2. **Language Selection & DPDP Affirmative Consent (`LanguageConsentScreen.tsx`):**
   * Multi-language selection across 7 Indian languages (Hindi, English, Tamil, Telugu, Marathi, Bengali, Gujarati).
   * DPDP Act 2023 accordion explaining data retention (raw audio purged after 30 days) and mandatory checkbox.
3. **Live AI Voice Intake Call (`VoiceCallActiveScreen.tsx`):**
   * Active call timer, real-time audio waveform visualization, live bilingual transcript preview, mute control, and 1-tap 108 emergency escalation.
4. **Guided Symptom Intake Form (`SymptomIntakeScreen.tsx`):**
   * Manual option for noisy pharmacy counters.
   * Demographic age/gender inputs with **CDSCO Pediatric Ban Enforcement** (<4 years blocks anti-cold syrup FDCs).
   * 1–10 pain severity slider and 8-point emergency red-flag screening.
5. **Intake Completed & WhatsApp Tracker (`IntakeCompletedScreen.tsx`):**
   * Generates unique intake code (e.g. `#DRG-2026-8812`), SBAR summary preview, and real-time WhatsApp delivery tracker (`Delivered ✓✓`).
6. **Patient SBAR Health Report (`PatientReportScreen.tsx`):**
   * Patient-accessible SBAR report card with cleared red flags, preliminary differential diagnoses, permitted OTC self-care guidelines, and statutory disclaimers.
7. **ABHA Vault & Medical Records (`HealthRecordsScreen.tsx`):**
   * Ayushman Bharat Health Account (ABHA ID) linkage (`91-8821-4402-9102`), encrypted records vault (Prescriptions, Lab reports, SBAR intakes), camera upload, and DPDP data revocation controls.
8. **Doctor Teleconsultation Discovery (`DoctorSearchScreen.tsx`, `DoctorDetailScreen.tsx`):**
   * NMC-verified physicians, experience, degrees, consultation fees, date picker, slot chips, and appointment confirmation.
9. **NABL Diagnostic Labs Network (`LabsScreen.tsx`):**
   * Search nearby certified labs (Dr. Lal PathLabs, Thyrocare, Metropolis), view test packages, pricing, and book home collection.
10. **CDSCO OTC Catalog & Checkout (`ProductCatalogScreen.tsx`, `CheckoutScreen.tsx`):**
    * OTC wellness products, Schedule H prescription gates, 12% GST invoice breakdown, and in-store counter pickup token.

### B. 💊 Registered Pharmacist (R.Ph) Journey
1. **Pharmacy Portal Login (`PharmacistLoginScreen.tsx`):**
   * State Pharmacy Council (PCI) license verification (`DL-RPH-2022-XXXX`), counter outlet selector, and OTP authentication.
2. **Clinical Triage Console (`PharmacistTriageScreen.tsx`):**
   * 4-level queue (`RED`, `ORANGE`, `YELLOW`, `GREEN`) sorted by clinical urgency, KPI counters, and quick decision actions.
3. **Dedicated Case Review (`IntakeReviewScreen.tsx`):**
   * Audio snippet player with duration controls, verbatim transcript, full SBAR breakdown, differential diagnoses with ICD-10 codes, and CDSCO formulary validation.
4. **Emergency Red Flag Escalation (`SafetyEscalationScreen.tsx`):**
   * Triggered on critical red flags (e.g. acute chest pain radiating to left arm).
   * 1-tap direct dial to **National 108 Ambulance Service**.
   * Nearest emergency trauma centers list with live ICU bed availability.
   * Emergency next-of-kin SOS SMS dispatch.
   * Pharmacist first-aid stabilization protocols.
5. **Tele-OPD Doctor Referral (`ReferralWorkflowScreen.tsx`):**
   * 1-click handover to on-duty RMP doctors with pharmacist clinical remarks, referral reasons, and instant patient SMS dispatch.
6. **Compliance Audit Logs (`CaseHistoryScreen.tsx`):**
   * Searchable log of all processed cases with filter pills and verified R.Ph digital signature seals.

### C. 🩺 Registered Medical Practitioner (RMP / Doctor) Journey
1. **Referral Queue by Urgency (`DoctorReferralInboxScreen.tsx`):**
   * Inbound referrals from pharmacy counters sorted by urgency (STAT/RED, URGENT/ORANGE, ROUTINE/YELLOW) with pharmacy contact and SBAR overview.
2. **Clinical Assessment & e-Prescription (`ClinicalAssessmentScreen.tsx`):**
   * Live video teleconsultation interface.
   * Full SOAP note documentation (Subjective, Objective vitals recorded at pharmacy, Assessment with ICD-10 selection, Plan).
   * **NMC 2020 Compliant Digital e-Prescription:** Prescribes Schedule H drugs with dosage, frequency, duration, and cryptographic digital signature stamp dispatched directly to the pharmacy counter.

### D. ⚙️ Pharmacy Manager & Administrator Journey
1. **Enterprise Operations Analytics (`AdminDashboardScreen.tsx`):**
   * Network KPIs: Total intakes, OTC conversion rate (73.8%), doctor referrals, 108 emergency handoffs.
   * Voice AI Diagnostics: Speech-to-text accuracy (97.2%), average intake completion time (1m 38s), dialect distribution.
   * Multi-outlet monitoring across connected store branches.
2. **Counter QR Standee Generator (`QRCodeManagementScreen.tsx`):**
   * Configurable standee designer with outlet branding, counter number, and primary language selector.
   * Dynamic security token rotation (invalidates stale QR codes to prevent unauthorized intake reuse).
   * Print-ready PDF preview for A4 and acrylic counter tent cards.

---

## ⚖️ 5. Clinical Safety & Indian Regulatory Guardrails

1. **CDSCO Drugs Rules 2026:**
   * Centrally versioned formulary engine.
   * **Pediatric Safety Filter:** Automatic hard blocking of fixed-dose combination anti-cold syrups (Chlorpheniramine + Phenylephrine) in children under 4 years of age.
   * **Schedule H / H1 Restrictions:** Prescription drugs cannot be dispensed as OTC. System strictly requires an RMP e-prescription.
2. **NMC Telemedicine Practice Guidelines 2020:**
   * AI never independently diagnoses patients or prescribes medicines.
   * AI-generated differential diagnoses are explicitly tagged as preliminary hypotheses for qualified professional review.
   * Prescriptions are authored, reviewed, and digitally signed by an NMC-registered doctor.
3. **Digital Personal Data Protection (DPDP) Act 2023:**
   * Affirmative, informed consent collected before processing symptoms or voice data.
   * Raw audio recordings scheduled for automatic purging after 30 days.
   * Data sovereignty controls allowing patients to view and revoke access to their health records at any time.
4. **ABDM / FHIR R4 Ready:**
   * Data models conform to Ayushman Bharat Digital Mission (ABDM) FHIR R4 profiles (`Patient`, `Condition`, `Observation`, `MedicationRequest`, `Encounter`).

---

## 📋 6. Prerequisites & Environment Setup

Ensure your local machine has the following tools installed:

1. **Node.js:** Version `18.x` or `>= 20.x` (LTS recommended)
2. **Package Manager:** `npm` (included with Node.js)
3. **Java Development Kit (JDK):** OpenJDK 17 (Required for React Native Android builds)
4. **Android Development:**
   * Android Studio installed with Android SDK (API Level 34 or 35)
   * Android SDK Platform-Tools added to your system `PATH`
   * Android Emulator or a physical Android smartphone connected via USB with USB Debugging enabled
5. **iOS Development (macOS only):**
   * Xcode 15+ and CocoaPods (`sudo gem install cocoapods`)
6. **Docker (Optional, for backend database):**
   * Docker Desktop for running PostgreSQL 16 and Redis 7 containers

---

## 🚀 7. Step-by-Step Installation & Running Guide

### Step 1: Clone the Repository & Navigate to Workspace
```bash
git clone <repository-url>
cd "d:\Pharmacy app"
```

### Step 2: Install Dependencies
Install dependencies for both root and workspace packages:
```bash
# Install root dependencies
npm install

# Install mobile frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

---

### Step 3: Run the Mobile Application (React Native)

#### Option A: Start Metro Bundler First
In the root directory or inside `frontend/`:
```bash
# From root directory:
npm run dev:mobile
# or
npm start

# Alternatively, directly from frontend:
cd frontend
npm start
```

#### Option B: Run on Android Emulator or Device
Open your Android Emulator in Android Studio or connect your phone via USB, then run:
```bash
# From root directory:
npm run android

# Or from frontend/:
cd frontend
npm run android
```

#### Option C: Run on iOS Simulator (macOS only)
```bash
# Install CocoaPods dependencies first:
cd frontend/ios
pod install
cd ../..

# Launch on iOS simulator:
npm run ios
```

---

### Step 4: Testing & Navigating the 4 Personas
Once the mobile app opens on your phone or emulator:
1. Look at the top **Role Bar** right below the header:
   * Tap `👤 Patient` to test QR scanning, Voice Call Intake, Symptom Forms, WhatsApp Delivery, ABHA Vault, Doctor Search, and OTC Catalog.
   * Tap `💊 Pharmacist (R.Ph)` to test Pharmacy Login, Triage Queue, Detailed SBAR Review, 108 Emergency Escalations, and Audit History.
   * Tap `🩺 Doctor (RMP)` to test Referral Inboxes, Tele-OPD Video Consults, SOAP Documentation, and Digital e-Prescriptions.
   * Tap `⚙️ Admin / Ops` to view Operational KPIs, Voice AI diagnostics, and the Counter QR Standee Generator.
2. In the Patient Home Screen, tap **"🎙️ Start In-App Voice Intake Call Now ›"** to experience the full AI voice interaction flow with animated waveforms and real-time SBAR generation.

---

### Step 5: (Optional) Run Backend Services & Database
If you wish to spin up the local PostgreSQL database, Redis cache, and backend services:
```bash
# Start PostgreSQL 16 and Redis 7 via Docker Compose
docker compose up -d

# Verify backend TypeScript compilation
npm run type-check:backend
```

---

## 🛠️ 8. Available Scripts & Verification Commands

All standard commands are executable from the monorepo root:

| Command | Action |
| :--- | :--- |
| `npm start` or `npm run dev:mobile` | Starts the React Native Metro bundler in watch mode |
| `npm run android` | Builds and launches the app on an Android emulator or device |
| `npm run ios` | Builds and launches the app on an iOS simulator (macOS) |
| `npm run type-check:frontend` | Verifies TypeScript types across the mobile React Native codebase |
| `npm run type-check:backend` | Verifies TypeScript compilation for backend clinical services |
| `docker compose up -d` | Launches local PostgreSQL 16 and Redis 7 development containers |

---

## 📚 9. Documentation Suite

Full technical, clinical, and architectural blueprints are available in the **[`docs/`](file:///d:/Pharmacy%20app/docs/)** folder:

* **[`MASTER_DOCUMENT.md`](file:///d:/Pharmacy%20app/docs/MASTER_DOCUMENT.md):** 15-section complete product and engineering specification.
* **[`TECHNICAL_DESIGN_DOCUMENT.md`](file:///d:/Pharmacy%20app/docs/TECHNICAL_DESIGN_DOCUMENT.md):** Full architecture, DB schema, RLS policies, and security controls.
* **[`API_DATA_CONTRACTS.md`](file:///d:/Pharmacy%20app/docs/API_DATA_CONTRACTS.md):** Mock JSON schemas for doctor, intake, lab, and inventory endpoints.
* **[`MOBILE_ARCHITECTURE_REACT_NATIVE.md`](file:///d:/Pharmacy%20app/docs/MOBILE_ARCHITECTURE_REACT_NATIVE.md):** Screen-by-screen UX specifications, layout grids, and touch target rules.
* **[`REQUIREMENTS_LOCKING.md`](file:///d:/Pharmacy%20app/docs/REQUIREMENTS_LOCKING.md):** Core pages, field specifications, and user action maps.
* **[`AI_CLINICAL_ENGINE_SPECIFICATION.md`](file:///d:/Pharmacy%20app/docs/AI_CLINICAL_ENGINE_SPECIFICATION.md):** 4-prompt decoupled voice pipeline and SBAR clinical extraction logic.

---

## 🔒 License & Regulatory Note

*DrGodly Pharmacy Assist is a clinical decision support and health intake technology platform. In accordance with the Pharmacy Act 1948, Drugs & Cosmetics Act 1940, CDSCO Drugs Rules 2026, and NMC Telemedicine Practice Guidelines 2020, this software does not independently dispense medicines or provide unverified medical diagnoses. All prescription drug dispensing and definitive medical diagnoses require authorization by a qualified Registered Pharmacist or Registered Medical Practitioner.*
