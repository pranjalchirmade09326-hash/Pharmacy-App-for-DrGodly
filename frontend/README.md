# DrGodly Pharmacy Assist — React Native Mobile Codebase

> **Pure React Native Mobile Application (Android & iOS)**  
> *Production-grade mobile UI for Indian Retail Pharmacies with 4 distinct persona experiences (Patient, Pharmacist, Doctor, Admin).*

---

## 📱 Mobile Architecture & Layout

The mobile frontend is located in `frontend/` and built with **React Native 0.76.5**, **React Navigation 7**, and **TypeScript 5.7+**:

```text
frontend/
├── src/
│   ├── components/               # Reusable UI Atoms (Button, Badge, DoctorCard, SlotChip, EmergencyBanner, Modal)
│   ├── context/                  # Global Cart and Session state (CartContext)
│   ├── data/                     # Mock clinical datasets (doctors, intakes, products)
│   ├── navigation/               # Multi-role routing & stack navigation (AppNavigator, types)
│   ├── screens/                  # 22 Dedicated Mobile UI Screens across 4 user roles
│   ├── theme/                    # Design tokens: #185ADB, #16B8B0, #172B4D, #C62828, #18865B
│   └── utils/                    # Indian currency formatters (INR) & date helpers
├── App.tsx                       # Root component wrapping CartProvider and AppNavigator
├── package.json                  # React Native dependencies
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 🏥 22 Screen Inventory (By User Persona)

### 1. 👤 Patient & Caregiver Screens
* **`HomeScreen.tsx`**: Pharmacy counter QR poster, 1-tap `tel:+918069000000` dialer action, interactive voice intake simulator, quick navigation grid.
* **`LanguageConsentScreen.tsx`**: 7 Indian language selection (Hindi, English, Tamil, Telugu, Marathi, Bengali, Gujarati) + DPDP Act 2023 affirmative consent.
* **`VoiceCallActiveScreen.tsx`**: Live voice call screen with timer, animated audio waveform, live bilingual transcript, mute, and 108 emergency handoff.
* **`SymptomIntakeScreen.tsx`**: Step-by-step guided questionnaire, CDSCO pediatric filter (<4 years blocks anti-cold syrup FDCs), 1–10 severity slider, and 8-point red-flag screening.
* **`IntakeCompletedScreen.tsx`**: Reference token `#DRG-2026-8812`, SBAR overview, and live WhatsApp delivery status tracker.
* **`PatientReportScreen.tsx`**: Patient-accessible SBAR report, cleared red flags, preliminary differential diagnoses, permitted OTC self-care guidelines, and NMC disclaimers.
* **`HealthRecordsScreen.tsx`**: Ayushman Bharat Health Account (ABHA ID) linkage (`91-8821-4402-9102`), encrypted records vault (Prescriptions, Labs, SBARs), camera upload, and DPDP consent controls.
* **`DoctorSearchScreen.tsx`**: NMC-verified physician search, specialty filters, fee filters (&le; ₹500, &le; ₹700, &le; ₹900).
* **`DoctorDetailScreen.tsx`**: Doctor credentials, calendar date picker, Morning/Afternoon/Evening slot chips, appointment booking.
* **`LabsScreen.tsx`**: NABL diagnostic labs network (Dr. Lal PathLabs, Thyrocare, Metropolis), test packages, home collection booking.
* **`ProductCatalogScreen.tsx`**: CDSCO 2026 OTC catalog, Schedule H prescription gates, Category filters, Add-to-cart steppers.
* **`CheckoutScreen.tsx`**: Itemized cart, Schedule H prescription gate, 12% GST invoice breakdown, pickup token generation (`#DISP-2026-8941`).

### 2. 💊 Registered Pharmacist (R.Ph) Screens
* **`PharmacistLoginScreen.tsx`**: State Pharmacy Council (PCI) registration verification (`DL-RPH-2022-XXXX`), outlet store selector, and OTP authentication.
* **`PharmacistTriageScreen.tsx`**: 4-column clinical triage queue (`RED`, `ORANGE`, `YELLOW`, `GREEN`), live KPI counters, and quick clinical actions.
* **`IntakeReviewScreen.tsx`**: Dedicated case review with voice recording player, live transcript, full SBAR breakdown, differential diagnoses with ICD-10 codes, and CDSCO formulary validation.
* **`SafetyEscalationScreen.tsx`**: Emergency red flag trigger screen, 1-tap 108 Ambulance dialer, nearest trauma centers with live ICU beds, family SOS alert, and first-aid stabilization protocols.
* **`ReferralWorkflowScreen.tsx`**: 1-click teleconsultation referral dispatch to on-duty RMP doctors with pharmacist handover remarks.
* **`CaseHistoryScreen.tsx`**: Searchable compliance audit logs, filter by Dispensed / Referred / Emergency, verified R.Ph digital signature seal.

### 3. 🩺 Registered Medical Practitioner (RMP / Doctor) Screens
* **`DoctorReferralInboxScreen.tsx`**: Inbound referrals sorted by clinical urgency (STAT/RED, URGENT/ORANGE, ROUTINE/YELLOW) with pharmacy contact and SBAR overview.
* **`ClinicalAssessmentScreen.tsx`**: Tele-OPD video consultation interface, SOAP clinical notes (Subjective, Objective vitals, Assessment ICD-10, Plan), **NMC 2020 Compliant Digital e-Prescription** with cryptographic signature hash.

### 4. ⚙️ Administrator & Store Manager Screens
* **`AdminDashboardScreen.tsx`**: Real-time network analytics, total intakes, OTC conversion rate (73.8%), emergency escalations, Voice AI accuracy (97.2%) & latency diagnostics, multi-store network monitoring.
* **`QRCodeManagementScreen.tsx`**: Counter QR standee generator for retail acrylic tent cards, store branding selector, dynamic security token rotation, print PDF preview.

---

## 🎨 Master Design System

All screens conform strictly to the master design system:
* **Primary (Medical Blue):** `#185ADB`
* **Secondary (Mint Teal):** `#16B8B0`
* **Background Canvas:** `#F8FAFC`
* **Card Surface:** `#FFFFFF`
* **Text Primary:** `#172B4D` (Deep Navy Slate)
* **Text Secondary:** `#475569`
* **Clinical Triage Severity:**
  * Red (Emergency / STAT): `#C62828` / `#FFEBEE`
  * Orange (Urgent RMP): `#EA580C` / `#FFF7ED`
  * Yellow (Moderate / OTC): `#B76A00` / `#FEFCE8`
  * Green (Safe / Routine): `#18865B` / `#EDF7F2`
  * Purple (Schedule H Rx): `#7C3AED` / `#F5F3FF`
* **Touch Targets:** Minimum 48 × 48 px on all interactive buttons.

---

## 🚀 How to Run the Mobile App

### 1. Prerequisites
- Node.js >= 18
- OpenJDK 17
- Android Studio with Android SDK (API 34/35) or Xcode 15+ (macOS for iOS)

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Start Metro Bundler
```bash
npm start
```

### 4. Run on Android Emulator or Physical Smartphone
```bash
npm run android
```

### 5. Run on iOS Simulator (macOS only)
```bash
cd ios && pod install && cd ..
npm run ios
```

---

## 🔄 Testing Personas via the Top Role Bar

When the app is running, use the top **Role Bar** right below the header:
* Tap `👤 Patient` to test the patient journey from QR scan to voice intake and WhatsApp report.
* Tap `💊 Pharmacist (R.Ph)` to review the triage queue, listen to voice snippets, approve CDSCO OTC relief, or escalate red flags.
* Tap `🩺 Doctor (RMP)` to view inbound referrals and issue NMC-compliant e-prescriptions.
* Tap `⚙️ Admin / Ops` to view network operations analytics and print counter QR standees.
