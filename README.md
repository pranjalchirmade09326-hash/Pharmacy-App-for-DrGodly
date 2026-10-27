# DrGodly Pharmacy Assist
> **AI-Powered Clinical Intake, Triage & Care Navigation for Indian Pharmacies**  
> *Natively integrated with the DrGodly Ecosystem: [`Yazhnimalan/bezs-hms`](https://github.com/Yazhnimalan/bezs-hms) and [`naveenraj-g/fhir`](https://github.com/naveenraj-g/fhir.git).*

---

## 🏥 Ecosystem Repositories & Architecture Alignment

DrGodly Pharmacy Assist is engineered to plug directly into DrGodly's existing production services:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              DRGODLY INTEGRATED WORKFLOW                               │
│                                                                                        │
│   [Pharmacy QR (tel:)] ──► [Vapi / bezs-agent Voice AI] ──► [Deterministic Safety]     │
│                                                                   │                    │
│                                                                   ▼                    │
│   [Patient WhatsApp Report] ◄────── [bezs-hms Pharmacist Console] ◄                    │
│                                               │                                        │
│                              ┌────────────────┴────────────────┐                       │
│                              ▼                                 ▼                       │
│                   [Dispense Approved OTC]           [LiveKit Doctor Telemed]           │
│                              │                                 │                       │
│                              └────────────────┬────────────────┘                       │
│                                               ▼                                        │
│                                   [naveenraj-g/fhir Server]                            │
│                                   (/api/fhir/v1/Encounter, Patient,                    │
│                                    Condition, Observation, MedicationRequest)          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Frontend / HMS Hub ([`Yazhnimalan/bezs-hms`](https://github.com/Yazhnimalan/bezs-hms)):**
   * Next.js 16.2.4 App Router, React 19.2.4, Tailwind CSS v4, Radix UI, and shadcn.
   * Pharmacy console mounted at `src/app/[locale]/(apps)/bezs/pharmacy`.
   * Video doctor teleconsultations provisioned via **LiveKit** (`livekit-client`, `livekit-server-sdk`).
   * Clinical reports and prescriptions stored via **FileNest** (`@filenest-fs/nextjs`).
   * Authentication via **BetterAuth** (`bezs-iam`).
2. **Backend / FHIR R4 Platform ([`naveenraj-g/fhir`](https://github.com/naveenraj-g/fhir.git)):**
   * Production FHIR R4 REST API in Python (FastAPI + SQLAlchemy 2.0 + PostgreSQL 15 + Redis 7).
   * Synchronizes `Patient`, `Encounter`, `Condition`, `Observation`, and `MedicationRequest` resources.
   * AI tools exposed to agents via `fhir-mcp` (FastMCP at `:8002/mcp`).
3. **Voice AI Ingestion ([`Yazhnimalan/bezs-agent`](https://github.com/Yazhnimalan/bezs-agent) + Vapi):**
   * Inbound telephony gateway streaming audio with turn-taking and colloquial code-switching (Hinglish/Tanglish).

---

## 📑 Specification Suite (Separate Master Documents)

* **[Business Requirements Document (BRD)](docs/BUSINESS_REQUIREMENTS_DOCUMENT.md):** Market problem, 5-stakeholder value propositions, CDSCO 2026 rules, DPDP Act 2023 consent, and monetization models.
* **[User Stories & Acceptance Criteria](docs/USER_STORIES.md):** Granular Gherkin stories (`Given-When-Then`) covering Patient, Pharmacist, Doctor, and Lab Partner.
* **[System Requirements Specification (SRS)](docs/SYSTEM_REQUIREMENTS_SPECIFICATION.md):** Functional requirements (FR-01 to FR-13), Non-functional requirements (NFR-01 to NFR-12), and external interfaces.
* **[System Architecture & Technical Design](docs/SYSTEM_ARCHITECTURE.md):** Microservice topology, decoupled 3-tier intelligence model, multi-tenant database ER diagram, and FHIR synchronization service.

---

## 🛠️ Codebase Structure

```text
├── api/
│   └── openapi.json                  # OpenAPI 3.0.3 specification for REST endpoints
├── database/
│   └── schema.sql                    # PostgreSQL DDL with multi-tenancy & audit trails
├── docs/
│   ├── BUSINESS_REQUIREMENTS_DOCUMENT.md
│   ├── USER_STORIES.md
│   ├── SYSTEM_REQUIREMENTS_SPECIFICATION.md
│   └── SYSTEM_ARCHITECTURE.md
├── prisma/
│   └── schema/
│       └── pharmacy.prisma           # Prisma extension for bezs-hms local Postgres
├── protocols/
│   ├── protocol.schema.json          # Draft-07 JSON Schema for clinical protocols
│   ├── gi_dyspepsia_adult.json       # Adult acute dyspepsia protocol
│   └── respiratory_cough_cold.json   # Respiratory protocol with CDSCO pediatric ban
├── src/
│   └── modules/
│       ├── client/
│       │   └── pharmacy/
│       │       └── ClinicalWorkspace4Column.tsx   # React 19 / Tailwind v4 Workspace UI
│       └── server/
│           └── core/
│               ├── fhir/
│               │   └── fhirSync.service.ts         # Native naveenraj-g/fhir adapter
│               ├── formulary/
│               │   └── cdscoFormulary.service.ts   # CDSCO 2026 rule engine & pediatric filter
│               └── pharmacy/
│                   └── application/usecases/
│                       └── createPharmacyIntake.usecase.ts
├── tasks/
│   └── CODING_AGENT_TASKS.md         # 10 sequential sprint prompts for autonomous coding agents
├── docker-compose.yml                # Local dev environment (PostgreSQL 16 + Redis 7)
└── package.json
```

---

## ⚖️ Indian Regulatory & Compliance Guardrails
* **CDSCO 2026 Drug Rules:** Centrally managed, versioned formulary engine. Automatic ban on pediatric anti-cold FDCs (chlorpheniramine + phenylephrine under 4 years of age). Zero autonomous AI prescribing of Schedule H/H1 drugs.
* **Telemedicine Practice Guidelines 2020:** AI is restricted to intake, triage, and documentation assistance. All clinical decisions and prescriptions are signed by a Registered Medical Practitioner (RMP).
* **DPDP Act 2023:** Explicit, affirmative verbal consent captured during voice intake with timestamped audit records. Raw audio purged after 30 days.
* **ABDM FHIR R4 Ready:** Direct synchronization to standard FHIR resources on `naveenraj-g/fhir`.
