# DrGodly Pharmacy Assist — Technical Design Document (TDD)

## 1. Executive Summary & Design Principles
DrGodly Pharmacy Assist is a clinical intake, doctor teleconsultation, and care navigation application designed for Indian retail pharmacies. The architecture enforces three golden medical and technical tenets:
1. **Clinical Decoupling & Safety:** Conversational AI extracts symptoms into SBAR summaries; deterministic rule engines (CDSCO Formulary, clinical red flag trees) gate the recommendations; final clinical decisions and dispensing are reserved exclusively for registered medical practitioners (RMPs) and licensed registered pharmacists.
2. **Speed & Zero-Friction Usability:** Consumers interact at the pharmacy counter via QR $\rightarrow$ phone dialer without requiring native app installations. The web application renders instantaneously with optimized static layouts and responsive Tailwind CSS v4 design.
3. **Regulatory Strictness:** Compliance with CDSCO 2026 scheduling (banning pediatric anti-cold FDCs under 4 years old, Schedule H/H1 prescription enforcement), NMC Telemedicine Practice Guidelines 2020, and DPDP Act 2023.

---

## 2. Directory & Folder Structure

```
d:\Pharmacy app\
├── docs/                                  # Engineering & Architectural Specifications
│   ├── REQUIREMENTS_LOCKING.md            # Step 1 Locked Scope & Requirements
│   ├── TECHNICAL_DESIGN_DOCUMENT.md       # Step 2 TDD & Engineering Blueprint
│   ├── API_DATA_CONTRACTS.md              # Mock JSON Contracts & Payloads
│   ├── api_contracts/                     # Formal JSON Schema Definitions
│   │   ├── doctor.schema.json
│   │   ├── slot.schema.json
│   │   ├── catalog_product.schema.json
│   │   ├── checkout_order.schema.json
│   │   └── pharmacy_intake.schema.json
│   ├── SYSTEM_ARCHITECTURE.md             # Tiered Architecture & Data Flow
│   ├── USER_STORIES.md                    # Gherkin BDD Stories
│   └── SYSTEM_REQUIREMENTS_SPECIFICATION.md
├── src/
│   ├── app/                               # Next.js App Router (Step 4 & 5 Core Routes)
│   │   ├── layout.tsx                     # Global App Shell (Navbar, Store Switcher, Emergency Bar, Footer)
│   │   ├── globals.css                    # Tailwind CSS v4 Theme Variables & Tokens
│   │   ├── page.tsx                       # Home / Pharmacy Counter QR Scan & AI Intake Landing
│   │   ├── doctors/                       # Doctor Teleconsultation Discovery
│   │   │   ├── page.tsx                   # Filterable Doctor Listing
│   │   │   └── [id]/                      # Doctor Detailed Profile & Interactive Slot Picker
│   │   │       └── page.tsx
│   │   ├── catalog/                       # CDSCO-Compliant OTC Product Catalog
│   │   │   └── page.tsx
│   │   ├── checkout/                      # Patient Dispense, Cart & Prescription Gate
│   │   │   └── page.tsx
│   │   └── pharmacy/                      # Pharmacist Professional Workspace
│   │       └── workspace/
│   │           └── page.tsx               # 4-Column Clinical Triage Console
│   ├── components/                        # Atomic & Modular UI Components (Step 3)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                 # Header navigation & Store Switcher
│   │   │   ├── EmergencyBanner.tsx        # Critical 108 Emergency Helpline Banner
│   │   │   └── Footer.tsx                 # Regulatory Disclaimers & Licensing
│   │   ├── ui/
│   │   │   ├── Badge.tsx                  # Triage & Regulatory Schedule Badges
│   │   │   ├── Button.tsx                 # Medical Primary/Secondary Action Buttons
│   │   │   ├── Modal.tsx                  # Emergency Alert & Prescription Dialogs
│   │   │   └── SlotChip.tsx               # Interactive Appointment Slot Chip
│   │   └── cards/
│   │       ├── DoctorCard.tsx             # Doctor Search Result Card
│   │       ├── ProductCard.tsx            # OTC Product Catalog Card
│   │       └── IntakeQueueCard.tsx        # Pharmacist Triage Queue Card
│   ├── data/                              # Mock Data Stores (Step 5)
│   │   ├── doctors.mock.ts                # 6 NMC-registered Indian Doctors
│   │   ├── products.mock.ts               # CDSCO 2026 OTC & Supplement Catalog
│   │   └── intakes.mock.ts                # 4 In-depth Clinical Patient Scenarios
│   ├── lib/                               # Utility Helpers & Formatters
│   │   ├── utils.ts                       # Classnames merger (clsx + twMerge)
│   │   ├── currency.ts                    # INR formatting (₹ / Lakhs)
│   │   └── fhirMapper.ts                  # ABDM FHIR R4 Mapping Helpers
│   └── modules/                           # Reusable Business & Server Logic
│       ├── client/
│       │   └── pharmacy/ClinicalWorkspace4Column.tsx
│       └── server/core/
│           ├── fhir/fhirSync.service.ts
│           └── formulary/cdscoFormulary.service.ts
├── protocols/                             # Clinical Decision Support Protocol JSONs
│   ├── gi_dyspepsia_adult.json
│   ├── respiratory_cough_cold.json
│   └── protocol.schema.json
├── database/                              # PostgreSQL DDL
│   └── schema.sql
├── next.config.mjs
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

## 3. Brand Theme Tokens & Design System

The visual identity is engineered for high clinical trust, rapid visual triage, and effortless readability under standard pharmacy lighting.

### 3.1 Color Palette
- **Medical Blue / Clinical Teal (`--primary`):**
  - Primary Base: `#0D9488` (`hsl(174, 85%, 31%)`) — Used for primary CTA buttons, active tabs, header accents.
  - Light Teal Tint: `#F0FDFA` (`hsl(166, 76%, 97%)`) — Used for highlighted slot chips, card backgrounds.
  - Dark Teal Shade: `#115E59` (`hsl(175, 84%, 22%)`) — Used for active state borders and text accents.
- **Mint Green (`--secondary` / Success):**
  - Mint Base: `#10B981` (`hsl(160, 84%, 39%)`) — Used for "In Stock", "Verified RMP", "GREEN Triage Safe" indicators.
  - Mint Surface: `#ECFDF5` (`hsl(152, 81%, 96%)`) — Success badge fill.
- **Triage Severity Palette:**
  - **RED (Emergency):** `#EF4444` (`hsl(0, 84%, 60%)`) — Anaphylaxis, Acute Chest Pain, Ambulance 108 Alert.
  - **ORANGE (High Urgency):** `#F97316` (`hsl(24, 95%, 53%)`) — Urgent doctor teleconsultation needed.
  - **YELLOW (Moderate):** `#F59E0B` (`hsl(38, 92%, 50%)`) — Protocolized OTC or doctor consult.
  - **GREEN (Mild Self-Limiting):** `#10B981` (`hsl(160, 84%, 39%)`) — Safe OTC symptomatic care.
- **Neutral Surface Palette:**
  - Background Canvas: `#F8FAFC` (Slate 50)
  - Card & Modal Background: `#FFFFFF` (Pure White)
  - Foreground Text: `#0F172A` (Slate 900)
  - Muted Text / Labels: `#64748B` (Slate 500)
  - Borders & Dividers: `#E2E8F0` (Slate 200)

### 3.2 Typography & Spacing Standard
- **Scale:** Strict 4px/8px multiples (e.g., `p-2` [8px], `p-4` [16px], `p-6` [24px], `gap-4` [16px]).
- **Border Radius:** `rounded-lg` (8px), `rounded-xl` (12px), `rounded-2xl` (16px).
- **Elevation / Shadows:**
  - Card Default: `shadow-sm hover:shadow-md transition-shadow`
  - Floating Emergency Bar: `shadow-lg border-b border-red-200`
  - Modal Backdrop: `bg-slate-900/60 backdrop-blur-sm`

---

## 4. State Management & Data Flow Architecture

The data architecture separates ephemeral local UI state, persistent client cart state, and server/FHIR synchronized healthcare records:

```
[Customer Interaction] ──> (Local State: Slot Pick / Filter) ──> [Cart Store (Local Storage)]
                                                                           │
                                                                   [Checkout Action]
                                                                           │
                                                                           ▼
[AI Phone Call] ──> [SBAR Extraction] ──> [Deterministic Formulary] ──> [Pharmacist Workspace State]
                                                                           │
                                                                   [Pharmacist Sign-Off]
                                                                           │
                                                                           ▼
                                                              [FHIR R4 Server (PostgreSQL)]
                                                                - Patient / Encounter
                                                                - Condition / Observation
                                                                - MedicationRequest
```

### 4.1 State Scopes
1. **Local State (`useState`):**
   - Active slot chip selection on doctor profile page.
   - Doctor search bar query and specialty filter dropdown.
   - Active catalog tab (All, Digestive, Respiratory, Pain, Vitamins).
   - Pharmacist workspace active patient selection index.
2. **Persistent Client State (`localStorage` / Custom Hook):**
   - Shopping Cart: `{ items: CartItem[], pharmacyStoreId: string }`.
   - Selected Pharmacy Counter: `{ storeId: 'PHARM-DEL-041', storeName: 'Apollo Pharmacy - Connaught Place' }`.
3. **Server & FHIR Sync:**
   - FHIR R4 Bundle sync (`Patient`, `Encounter`, `Observation`, `MedicationRequest`, `ServiceRequest`).
   - WhatsApp Notification Webhook (Twilio / Gupshup / Infobip).
