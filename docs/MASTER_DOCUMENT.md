# DrGodly Pharmacy Assist — Master Business, System Requirements, User Stories & Architecture Document
**Document ID:** DRG-PHARM-SPEC-2026-V2  
**Product:** DrGodly Pharmacy Assist  
**Ecosystem Integration:**  
* **Frontend / HMS Hub:** [`Yazhnimalan/bezs-hms`](https://github.com/Yazhnimalan/bezs-hms) (Next.js 16 App Router, React 19, Prisma, Tailwind v4, LiveKit, Vapi)
* **Backend / FHIR Server:** [`naveenraj-g/fhir`](https://github.com/naveenraj-g/fhir.git) (FastAPI + SQLAlchemy 2.0 + PostgreSQL 15, FHIR R4 REST API)
* **AI Agent Platform:** [`Yazhnimalan/bezs-agent`](https://github.com/Yazhnimalan/bezs-agent) & [`fhir-mcp`](https://github.com/naveenraj-g/fhir/tree/main/fhir-mcp) (FastMCP at `:8002/mcp`)
* **IAM / Auth:** [`Yazhnimalan/bezs-iam`](https://github.com/Yazhnimalan/bezs-iam) (BetterAuth at `:5001`)
* **Storage / PDFs:** [`Yazhnimalan/bezs-filenest`](https://github.com/Yazhnimalan/bezs-filenest) (FileNest at `:8000`)
**Jurisdiction:** India  
**Applicable Regulations:** CDSCO Drugs Rules 2026, DPDP Act 2023, Telemedicine Practice Guidelines 2020, ABDM FHIR R4  
**Target Release:** Production MVP  

---

## 1. Executive Summary & Ecosystem Integration

DrGodly Pharmacy Assist converts the unstructured verbal symptom description at Indian retail pharmacy counters into an intelligent, protocol-constrained digital clinical intake layer.

Unlike standalone, isolated health bots, **DrGodly Pharmacy Assist integrates directly into DrGodly's production healthcare infrastructure**:
1. **Frontend Hub ([`Yazhnimalan/bezs-hms`](https://github.com/Yazhnimalan/bezs-hms)):**
   * Pharmacist Workspace Console is mounted natively under `src/app/[locale]/(apps)/bezs/pharmacy`.
   * Built on Next.js 16 App Router, React 19, Tailwind CSS v4, Radix UI, and shadcn.
   * Telemedicine doctor escalations seamlessly leverage `LiveKit` video rooms (`@livekit/components-react`).
   * Clinical reports and prescriptions store in `FileNest` (`@filenest-fs/nextjs`).
2. **Backend FHIR R4 Platform ([`naveenraj-g/fhir`](https://github.com/naveenraj-g/fhir.git)):**
   * Encounters, Patients, Conditions (differentials), Observations (symptoms), and MedicationRequests synchronize directly with the FastAPI FHIR server at `/api/fhir/v1/`.
   * AI agents leverage `fhir-mcp` (`:8002/mcp`) via streamable-HTTP FastMCP tools for schema-validated clinical queries.
3. **Voice AI Ingestion ([`Yazhnimalan/bezs-agent`](https://github.com/Yazhnimalan/bezs-agent) + Vapi):**
   * Low-latency streaming voice agent processing Indian English, Hindi, Tamil, Telugu, and colloquial code-switching (Hinglish/Tanglish).

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

---

## 2. Master Document Index (Separate Documentation Suite)

For detailed module-by-module analysis, refer to the individual dedicated specifications:

* **[Business Requirements Document (BRD)](BUSINESS_REQUIREMENTS_DOCUMENT.md):** Market problem, 5-stakeholder value propositions, CDSCO 2026 compliance, DPDP Act consent, monetization models, and business KPIs.
* **[User Stories & Acceptance Criteria](USER_STORIES.md):** Granular user stories in Gherkin syntax (`Given-When-Then`) covering Patient, Pharmacist, Doctor, Lab Partner, and Chain Admin.
* **[System Requirements Specification (SRS)](SYSTEM_REQUIREMENTS_SPECIFICATION.md):** Functional requirements (FR-01 to FR-13), Non-functional requirements (NFR-01 to NFR-12), and external interface contracts.
* **[System Architecture & Technical Design](SYSTEM_ARCHITECTURE.md):** End-to-end architecture, decoupled 3-tier intelligence model, multi-tenant database ER diagram, CDSCO formulary engine, and ABDM FHIR R4 synchronization adapter.

---

## 3. Production Code & Database Deliverables

* **Prisma Schema Extension:** [`prisma/schema/pharmacy.prisma`](file:///d:/Pharmacy%20app/prisma/schema/pharmacy.prisma) (Defines `Pharmacy`, `PharmacyQrCode`, `PharmacistReview` for `bezs-hms`).
* **FHIR R4 Sync Service:** [`src/modules/server/core/fhir/fhirSync.service.ts`](file:///d:/Pharmacy%20app/src/modules/server/core/fhir/fhirSync.service.ts) (Native adapter for `naveenraj-g/fhir`).
* **CDSCO 2026 Formulary Service:** [`src/modules/server/core/formulary/cdscoFormulary.service.ts`](file:///d:/Pharmacy%20app/src/modules/server/core/formulary/cdscoFormulary.service.ts) (Formulary filtering, pediatric ban, allergy verification).
* **Pharmacy Intake Use Case:** [`src/modules/server/core/pharmacy/application/usecases/createPharmacyIntake.usecase.ts`](file:///d:/Pharmacy%20app/src/modules/server/core/pharmacy/application/usecases/createPharmacyIntake.usecase.ts).
* **4-Column Pharmacist Workspace:** [`src/modules/client/pharmacy/ClinicalWorkspace4Column.tsx`](file:///d:/Pharmacy%20app/src/modules/client/pharmacy/ClinicalWorkspace4Column.tsx) (React 19, Tailwind v4, Radix UI).
* **PostgreSQL Schema DDL:** [`database/schema.sql`](file:///d:/Pharmacy%20app/database/schema.sql).
* **OpenAPI REST Specification:** [`api/openapi.json`](file:///d:/Pharmacy%20app/api/openapi.json).
* **10-Sprint Coding Agent Prompts:** [`tasks/CODING_AGENT_TASKS.md`](file:///d:/Pharmacy%20app/tasks/CODING_AGENT_TASKS.md).
