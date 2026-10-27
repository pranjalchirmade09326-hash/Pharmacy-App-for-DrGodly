# DrGodly Pharmacy Assist
> **AI-Powered Clinical Intake, Triage & Care Navigation for Indian Pharmacies**  
> *Natively integrated with the DrGodly Ecosystem: **DrGodly HMS Frontend Hub** and **DrGodly FHIR R4 Interoperability Server**.*

---

## 🏥 Architecture & Monorepo Layout

DrGodly Pharmacy Assist is organized as a clean, production-grade monorepo partitioned into three dedicated directories: **`frontend/`**, **`backend/`**, and **`docs/`**:

```text
drgodly-pharmacy/
├── frontend/
│   ├── web/                          # Next.js 15 Web Application (App Router, React 19, Tailwind CSS v4)
│   │   ├── src/
│   │   │   ├── app/                  # Routes: /, /doctors, /catalog, /checkout, /pharmacy/workspace, /labs, /report, /mobile
│   │   │   ├── components/           # UI design system atoms & molecules
│   │   │   ├── data/                 # Realistic mock datasets (doctors, intakes, products, labs)
│   │   │   ├── lib/                  # Zustand cart store & utility helpers
│   │   │   └── modules/client/       # High-density 4-column pharmacist workspace
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mobile/                       # Pure React Native Mobile Application (React Native 0.76.5, React Navigation 7)
│       ├── src/
│       │   ├── screens/              # HomeScreen, DoctorSearchScreen, DoctorDetailScreen, ProductCatalogScreen,
│       │   │                         # CheckoutScreen, PharmacistTriageScreen, LabsScreen
│       │   ├── components/           # Mobile design system components
│       │   ├── context/              # CartContext provider
│       │   ├── navigation/           # Bottom tab router & stack navigation
│       │   ├── theme/                # Medical blue & teal design tokens
│       │   └── utils/                # Currency formatters & helpers
│       ├── App.tsx
│       ├── package.json
│       └── tsconfig.json
│
├── backend/
│   ├── api/                          # OpenAPI 3.0.3 specification for REST endpoints
│   ├── database/                     # PostgreSQL DDL with multi-tenancy, RLS & audit trails
│   ├── prisma/                       # Prisma extension schemas
│   ├── protocols/                    # 13 CDSCO-compliant clinical protocol JSON schemas
│   │   ├── protocol.schema.json      # Draft-07 JSON Schema validator
│   │   ├── fever_adult_pediatric.json
│   │   ├── respiratory_cough_cold.json
│   │   ├── sore_throat.json
│   │   ├── acute_diarrhea_dehydration.json
│   │   ├── constipation.json
│   │   ├── vomiting_nausea.json
│   │   ├── gi_dyspepsia_adult.json
│   │   ├── acute_headache.json
│   │   ├── musculoskeletal_pain.json
│   │   ├── skin_rashes.json
│   │   ├── allergic_rhinitis.json
│   │   ├── urinary_tract.json
│   │   └── general_fatigue.json
│   ├── src/
│   │   └── modules/core/
│   │       ├── fhir/                 # Centralized FHIR R4 REST API adapter
│   │       ├── formulary/            # CDSCO 2026 rule engine & pediatric filter
│   │       ├── pharmacy/             # Pharmacy intake application usecases
│   │       └── voice/                # Decoupled 4-Prompt AI Voice Orchestrator
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                             # Complete Specification Suite
│   ├── MASTER_DOCUMENT.md            # Master 15-section product & technical specification
│   ├── BUSINESS_REQUIREMENTS_DOCUMENT.md
│   ├── USER_STORIES.md
│   ├── SYSTEM_REQUIREMENTS_SPECIFICATION.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── UX_SPECIFICATION.md
│   ├── AI_CLINICAL_ENGINE_SPECIFICATION.md
│   ├── TECHNICAL_SPECIFICATION.md
│   ├── TECHNICAL_DESIGN_DOCUMENT.md
│   ├── REQUIREMENTS_LOCKING.md
│   ├── API_DATA_CONTRACTS.md
│   └── MOBILE_ARCHITECTURE_REACT_NATIVE.md
│
├── docker-compose.yml                # Local dev environment (PostgreSQL 16 + Redis 7)
└── package.json                      # Monorepo workspace orchestrator
```

---

## ⚡ Development & Verification Commands

All standard `npm` package manager commands are supported at the root:

```bash
# Run web application in development mode
npm run dev
# or
npm run dev:web

# Run mobile application bundler
npm run dev:mobile

# Production build of web application
npm run build

# Run TypeScript type verification across all packages
npm run type-check

# Run individual package type checks
npm run type-check:web
npm run type-check:mobile
npm run type-check:backend
```

---

## ⚖️ Indian Regulatory & Compliance Guardrails

* **CDSCO 2026 Drug Rules:** Centrally managed, versioned formulary engine. Automatic ban on pediatric anti-cold FDCs (chlorpheniramine + phenylephrine under 4 years of age). Zero autonomous AI prescribing of Schedule H/H1 drugs.
* **Telemedicine Practice Guidelines 2020:** AI is restricted to intake, triage, and documentation assistance. All clinical decisions and prescriptions are signed by a Registered Medical Practitioner (RMP).
* **DPDP Act 2023:** Explicit, affirmative verbal consent captured during voice intake with timestamped audit records. Raw audio purged after 30 days.
* **ABDM FHIR R4 Ready:** Direct synchronization to standard FHIR resources on the centralized FHIR R4 server.
