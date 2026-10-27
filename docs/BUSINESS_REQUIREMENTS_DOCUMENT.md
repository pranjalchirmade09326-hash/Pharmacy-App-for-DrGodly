# DrGodly Pharmacy Assist — Business Requirements Document (BRD)
**Document ID:** DRG-BRD-2026-V2  
**Product:** DrGodly Pharmacy Assist  
**Ecosystem Integration:**  
* **Frontend / HMS Hub:** [`Yazhnimalan/bezs-hms`](https://github.com/Yazhnimalan/bezs-hms) (Next.js 16 App Router, React 19, Prisma, LiveKit, Vapi)
* **Backend / FHIR Server:** [`naveenraj-g/fhir`](https://github.com/naveenraj-g/fhir.git) (FastAPI FHIR R4 Platform + FastMCP Gateway at `:8002/mcp`)
* **AI Agent Platform:** [`Yazhnimalan/bezs-agent`](https://github.com/Yazhnimalan/bezs-agent) (Voice & Clinical Extraction at `:8018`)
* **IAM & File Storage:** [`Yazhnimalan/bezs-iam`](https://github.com/Yazhnimalan/bezs-iam) & [`Yazhnimalan/bezs-filenest`](https://github.com/Yazhnimalan/bezs-filenest)
**Jurisdiction:** India  
**Applicable Regulations:** CDSCO Drugs & Cosmetics Act 1940 / Rules 1945 (2026 Updates), Telemedicine Practice Guidelines 2020, Digital Personal Data Protection (DPDP) Act 2023, Ayushman Bharat Digital Mission (ABDM)  
**Status:** Approved for Engineering Implementation  

---

## 1. Executive Summary & Market Problem

### 1.1 The Retail Pharmacy Landscape in India
In India, the neighborhood retail pharmacy (chemist shop) serves as the primary gateway for over 70% of acute outpatient health episodes. When individuals experience fever, persistent cough, digestive discomfort, skin rashes, or headaches, the standard behavior is to visit a pharmacy rather than schedule a formal clinic visit.

At the pharmacy counter, a verbal interaction takes place:
1. The customer describes symptoms in colloquial language or regional dialects (Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Hinglish).
2. The pharmacist or shop assistant listens briefly (typically 30–60 seconds).
3. The pharmacist recommends and dispenses medications based on verbal impressions, commercial availability, or historical habit.

### 1.2 Core Vulnerabilities in the Status Quo
* **Incomplete Clinical Information:** Critical diagnostic factors—such as duration, exact severity, radiation of pain, prior adverse drug reactions, and chronic comorbidities—are rarely systematically evaluated.
* **Missed Life-Threatening Emergencies:** Early signs of acute coronary syndromes (myocardial infarction), severe peritonitis, internal gastrointestinal bleeding, or acute neurologic deficits are frequently miscategorized as simple acidity, indigestion, or tension headaches.
* **Antimicrobial Resistance & Regulatory Exposure:** Unauthorized over-the-counter dispensing of prescription-only antibiotics (Schedule H and Schedule H1 drugs) remains a major regulatory liability and contributes directly to antimicrobial resistance (AMR).
* **Pediatric Ingestion Hazards:** Recent CDSCO 2026 gazette notifications strictly restrict fixed-dose combinations (FDCs) of chlorpheniramine maleate and phenylephrine for children under 4 years of age. Unregulated counter recommendations put pediatric patients at risk.
* **Absence of Medical Records:** Encounters are completely unrecorded; no longitudinal history or paper trail exists for subsequent doctor visits or hospital referrals.

### 1.3 The DrGodly Strategic Vision
DrGodly Pharmacy Assist introduces an intelligent, zero-friction clinical intake and care navigation layer integrating directly with the **DrGodly HMS (`bezs-hms`)** and **FHIR Platform (`naveenraj-g/fhir`)**:
```
[Pharmacy QR Standee] 
        │ (Camera scan)
        ▼
[Native Phone Dialer (tel:+91XXXXXXXXXX)]
        │ (1-Tap Call — Zero App Download)
        ▼
[Vapi / bezs-agent Multilingual Voice AI]
        │ (Empathetic turn-by-turn intake)
        ▼
[Deterministic Clinical Safety Engine]
        │
        ├─────────────────────────────────────────┐
        ▼                                         ▼
[Interactive WhatsApp Patient Report]    [bezs-hms Pharmacist Workspace]
        │                                         │
        ▼                                         ├─────────────────────────┐
[Accredited Lab Booking]                          ▼                         ▼
                                       [Dispense Approved OTC]   [LiveKit Doctor Telemedicine]
                                                  │                         │
                                                  └────────────┬────────────┘
                                                               ▼
                                                  [naveenraj-g/fhir Server]
                                                  (Patient, Encounter, Condition,
                                                   Observation, MedicationRequest)
```

The platform is strictly an **intake, triage, and care navigation system**—not an autonomous prescribing or autonomous diagnosing machine.

---

## 2. Business Objectives & Success Criteria

### 2.1 Primary Business Objectives
1. **Clinical Safety Guarantee:** Prevent inappropriate over-the-counter dispensing for emergency conditions by maintaining 100% sensitivity on red-flag emergency screening.
2. **Zero-Friction Patient Adoption:** Eliminate the 84% user drop-off associated with native mobile app installations by utilizing standard telephony (`tel:`) and WhatsApp.
3. **Operational Efficiency for Pharmacies:** Reduce unstructured counter conversation time from 5 minutes to under 90 seconds of structured clinical review on the Pharmacist Dashboard.
4. **Strict Regulatory Governance:** Ensure that 100% of dispensed medications comply with CDSCO 2026 schedules (OTC vs Schedule H/H1) and the Telemedicine Practice Guidelines 2020.
5. **Ecosystem Interoperability:** Automatically synchronize every intake, condition, and medication record with the central `naveenraj-g/fhir` platform and ABDM national health grid.

### 2.2 Key Performance Indicators (KPIs)

| Metric Category | KPI | Target Value | Measurement Cadence |
| :--- | :--- | :--- | :--- |
| **Patient Acquisition** | QR Scan to Call Conversion Rate | $\ge 40\%$ | Daily |
| **Intake Completion** | Call Start to Intake Completion Rate | $\ge 85\%$ | Real-time |
| **Voice Experience** | Speech-to-Speech Turnaround Latency | $<800\text{ ms}$ | Per turn |
| **Clinical Safety** | Red-Flag Screening Sensitivity | $100\%$ (Zero false negatives) | Automated test suite |
| **Pharmacist Efficiency** | Time to Complete Patient Review | $<90\text{ seconds}$ | Per encounter |
| **Compliance** | Schedule H/H1 Unauthorized Dispensing | $0\%$ (Strictly blocked) | Continuous audit |
| **Commercial Adoption** | Daily Intakes per Active Pharmacy Counter | $\ge 15\text{ intakes/day}$ | Weekly |
| **Downstream Conversion**| Doctor Referral Conversion Rate | $\ge 12\%$ | Monthly |
| **Diagnostic Booking** | Diagnostic Lab Referral Conversion | $\ge 8\%$ | Monthly |

---

## 3. Regulatory & Legal Compliance Framework (India)

### 3.1 CDSCO Drugs & Cosmetics Act 1940 and Rules 1945 (2026 Updates)
* **Centrally Managed Formulary:** Drug schedule classifications (OTC, Schedule G, Schedule H, Schedule H1, Schedule X) reside in a centralized database (`drug_registry`), strictly separated from LLM prompts.
* **Zero Autonomous AI Dispensing:** The software prohibits the AI from issuing prescription medication recommendations. All Schedule H/H1 drugs require an RMP prescription.
* **Pediatric Safety Mandates (2026 Gazette Notification):** Strict contraindications against anti-cold fixed-dose combinations (chlorpheniramine maleate + phenylephrine) for children under 4 years of age.

### 3.2 Telemedicine Practice Guidelines 2020 (NMC / MoHFW)
* **Role of AI/ML Systems:** AI platforms are permitted solely as assistive clinical intake, triage, and documentation tools. AI is legally prohibited from autonomously counseling patients on treatment or generating prescriptions.
* **LiveKit Doctor Teleconsultations:** Integrated with `bezs-hms`, allowing RMPs to conduct live video calls, review AI-drafted SOAP notes, and issue digitally signed e-prescriptions.

### 3.3 Digital Personal Data Protection (DPDP) Act 2023
* **Explicit Verbal Consent:** Recorded affirmative verbal consent ("Yes", "Haan", "Aam") captured on the voice call before collecting sensitive personal health data.
* **Data Localization:** 100% of database records, audio caches, and cloud infrastructure hosted within India (AWS `ap-south-1` Mumbai / GCP `asia-south1`).

---

## 4. Comprehensive Monetization & Commercial Architecture

DrGodly Pharmacy Assist operates a high-margin, multi-sided B2B2C business model serving retail pharmacies, patients, telemedicine doctors, and diagnostic laboratory chains:

### 4.1 Pharmacy SaaS & Access Pricing Models
* **Option A — Flat SaaS Subscription:** 
  * Basic Counter Tier: ₹999 / month / counter (up to 150 intakes/month, standard SBAR summary, WhatsApp delivery).
  * Pro Counter Tier: ₹2,499 / month / counter (unlimited intakes, LiveKit teleconsultation bridge, priority support, NABL lab referral network).
* **Option B — Usage-Based Metering:** 
  * ₹10 per completed clinical intake with zero upfront fixed software fees; ideal for independent rural and semi-urban chemists.
* **Option C — Hybrid Commercial Model (Recommended for Growth):** 
  * ₹499 base monthly access fee + ₹5 per completed intake above 100 intakes.
* **Option D — Enterprise Pharmacy Chains (Apollo, MedPlus, Wellness Forever):** 
  * Custom enterprise contract, multi-location central dashboard, active ERP/POS inventory integration, centralized CDSCO audit logging, dedicated SLA.

### 4.2 High-Margin Downstream Revenue Streams
1. **Telemedicine Consultation Revenue Share:**
   * Instant RMP video teleconsultations via LiveKit are priced at ₹199 to ₹399 depending on specialty.
   * Revenue split: 70% to RMP, 15% to DrGodly platform, 15% to retail pharmacy as referral incentive.
2. **Diagnostic Laboratory Referral Network Commissions:**
   * NABL-accredited diagnostic partner laboratories (Dr Lal PathLabs, Metropolis, Agilus, Suburban) offer integrated test booking with transparent pricing.
   * Referral lead generation fee: ₹75 to ₹200 per fulfilled diagnostic test (or 15-20% of invoice value).
3. **Chronic Condition Navigation & Adherence Reminders:**
   * WhatsApp automated refill notifications and adherence checks for diabetic, hypertensive, and thyroid patients.

---

## 5. Master Product KPIs & North Star Metric

### 5.1 The North Star Metric
> **Intake-to-Appropriate-Action Rate (IAAR):**  
> *The percentage of completed patient intakes that result in a clinically verified and safe outcome within 2 hours (either verified OTC dispensing, completed doctor consultation, or booked diagnostic test).*  
> **Target:** $\ge 88\%$

### 5.2 Key Performance Indicators (Categorized)

| Category | Specific Metric | Target SLA |
| :--- | :--- | :--- |
| **Acquisition** | QR Scan to Call Conversion Rate | $\ge 40\%$ |
| **Acquisition** | New Patient First-Time Call Completion Rate | $\ge 85\%$ |
| **Voice AI Performance** | First-Word Audio Latency (Streaming Vapi/LiveKit) | $< 650\text{ ms}$ |
| **Voice AI Performance** | Speech-to-Speech Turnaround Latency | $< 950\text{ ms}$ |
| **Clinical Safety** | Red-Flag Screening Sensitivity | $100\%$ (Zero missed emergency life threats) |
| **Clinical Safety** | CDSCO Schedule H/H1 Unauthorized Dispensing | $0\%$ (Strictly prevented) |
| **Clinical Safety** | Pediatric Under-4 Anti-Cold FDC Interception | $100\%$ (Enforced by CDSCO 2026 rule) |
| **Pharmacist Efficiency** | Average Pharmacist Decision Review Time | $< 75\text{ seconds}$ |
| **Business / Unit Economics** | Intakes per Active Counter per Day | $\ge 15\text{ intakes}$ |
| **Business / Unit Economics** | Doctor Consultation Escalate Rate | $12\%\text{ -- }18\%$ |
| **Business / Unit Economics** | Diagnostic Lab Order Conversion Rate | $8\%\text{ -- }12\%$ |

