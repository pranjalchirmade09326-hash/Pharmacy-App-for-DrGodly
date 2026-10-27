# DrGodly Pharmacy Assist — UX Specification
**Version:** 1.0.0 (Developer-Ready MVP)  
**Jurisdiction:** India  
**Target Channels:** Physical Counter QR + Native Phone Dialer + Interactive WhatsApp + Pharmacist Web Console + Doctor Telemedicine Portal

---

## 1. Architectural Philosophy & Zero-Friction Patient Model
The primary friction point in Indian retail pharmacy health interventions is application download drop-off. Over 84% of tier-1/tier-2 pharmacy walk-ins will abandon a service requiring an App Store/Play Store download while standing at a counter. 

**DrGodly eliminates patient app installation entirely:**
```
[Physical Counter QR] 
        │ (Camera scan)
        ▼
[Native Phone Dialer (tel:+91XXXXXXXXXX)]
        │ (1-Tap Call)
        ▼
[DrGodly Multilingual Voice Agent]
        │ (5-7 min voice intake)
        ▼
[Interactive WhatsApp Message & Dynamic Web-Report]
        │
        ▼
[Pharmacist Console Review / Telemedicine Doctor Bridge]
```

---

## 2. Screen 1: Physical Pharmacy QR Standee & Counter Display

### 2.1 Physical Specifications
* **Format:** A5 Acrylic Tent Card (Countertop) + A3 Foamboard Poster (Entrance/Waiting Area)
* **Visual Hierarchy:** High-contrast QR code centered, minimum size 60mm x 60mm.
* **Colors:** DrGodly Teal (`#0D9488`), Medical Navy (`#0F172A`), Pure White (`#FFFFFF`).

### 2.2 Microcopy & Localization (Example: Tamil Nadu / Chennai Counter)
```text
┌────────────────────────────────────────────────────────┐
│  [DrGodly Logo]                                        │
│                                                        │
│  Not feeling well? Talk to DrGodly                     │
│  உடல்நிலை சரியில்லையா? டாக்டர் காட்லியுடன் பேசுங்கள்   │
│                                                        │
│             ┌───────────────────────┐                  │
│             │                       │                  │
│             │     [   QR CODE   ]   │                  │
│             │      tel:+91...       │                  │
│             │                       │                  │
│             └───────────────────────┘                  │
│                                                        │
│  1. Scan QR with Camera                                │
│  2. Tap "Call" on your phone                           │
│  3. Explain symptoms in your own language              │
│  4. Get your Pharmacy Health Report on WhatsApp        │
│                                                        │
│  ────────────────────────────────────────────────────  │
│  ⚠️ Notice: DrGodly is an AI clinical intake assistant.│
│  It does not replace a registered medical practitioner.│
│  In an emergency, visit a hospital immediately.        │
└────────────────────────────────────────────────────────┘
```

### 2.3 QR Payload
* Standard URI Scheme: `tel:+918047361899` (Direct link to telephony DID gateway).
* Optional Web Fallback URL for older scanners without auto-tel trigger:
  `https://rx.drgodly.com/scan?p=PH00128&c=COUNTER1` (Redirects to `tel:` immediately with telemetry).

---

## 3. Patient Voice Intake Experience (VUI Specification)

### 3.1 Turn-by-Turn Dialogue Architecture

#### Turn 1: Inbound Connection & Language Selection
* **Agent:** "Welcome to DrGodly at Apollo Pharmacy, Indiranagar. For English, press 1 or say English. இந்திக்கு 2 ஐ அழுத்தவும். தமிழுக்கு 3 ஐ அழுத்தவும். తెలుగు కోసం 4 నొక్కండి."
* **Inputs:** Voice utterance recognition or DTMF keypress.
* **Fallback:** If no response in 4 seconds, default to regional dominant language + English.

#### Turn 2: Mandatory AI Disclosure & DPDP Consent
* **Agent (English):** "I am DrGodly, an AI health assistant. I am not a doctor. I will ask you about your symptoms so our pharmacist and doctors can help you safely. Do you agree to continue?"
* **Agent (Hindi):** "मैं डॉक्टर गॉडली हूँ, एक AI स्वास्थ्य सहायक। मैं डॉक्टर नहीं हूँ। मैं आपके लक्षणों के बारे में जानकारी लूँगा ताकि हमारे फार्मासिस्ट आपकी सुरक्षित मदद कर सकें। क्या आप आगे बढ़ने के लिए सहमत हैं?"
* **Affirmative Response Trigger:** "Yes", "Haan", "Aam", "Seri", "Okay", "Continue".
* **Refusal Response:** If patient says "No" / "Nahi", Agent responds: "No problem. Please speak directly with the pharmacist at the counter. Thank you." (Call disconnects).

#### Turn 3: Demographics Collection
* **Agent:** "May I know your full name and age?"
* **Patient:** "My name is Rajesh, I am 42 years old."
* **Slot Extraction:** `patient.name = "Rajesh"`, `patient.age = 42`.
* **Phone Identification:** Captured automatically via Telephony Caller Line Identification (CLI/ANI). Verified verbally: "We will send your report to this number ending in 9812. Is that correct?"

#### Turn 4: Chief Complaint Discovery (Open-Ended)
* **Agent:** "What health issue or discomfort are you experiencing today?"
* **Patient:** "Pet mein bohot jalan ho rahi hai do din se, khana khane ke baad zyada hoti hai." (Code-switched Hinglish).
* **NLP Extraction:** 
  * `chief_complaint = "Epigastric burning / Dyspepsia"`
  * `duration = "2 days"`
  * `aggravating_factor = "Post-prandial (after meals)"`

#### Turn 5: Dynamic Clinical Questioning (Branching Protocol)
* **Question 5a (Severity):** "On a scale of 1 to 10, how severe would you rate this discomfort?"
* **Question 5b (Radiation / Location):** "Is the burning feeling only in your upper stomach, or does it move up into your chest or throat?"
* **Question 5c (Associated Symptoms):** "Have you had any nausea, vomiting, or loose motions?"

#### Turn 6: Deterministic Red-Flag Interruption Gate
* **Clinical Safety Questions:**
  1. "Is the pain sudden and extremely sharp, like tearing?"
  2. "Have you noticed any blood in your vomit, or are your stools black or dark red?"
  3. "Do you have any severe sweating, shortness of breath, or dizziness?"
* **If ANY Red Flag is Positive:**
  * **Immediate Agent Pivot:** "Rajesh-ji, based on the symptoms you just described, this could require urgent emergency medical care. Please inform the pharmacist immediately or go to the nearest emergency hospital. I am flagging this as urgent right now."
  * **System Action:** Triage level locks to `RED`. In-store buzzer/alert triggers on Pharmacist Dashboard. Call ends with emergency SMS + WhatsApp.

#### Turn 7: Medical History & Contraindications
* **Agent:** "Do you have diabetes, blood pressure, kidney or liver disease?"
* **Agent:** "Are you currently taking any regular medications or pain killers?"
* **Agent:** "Do you have any known allergies to medicines, such as paracetamol or antacids?"

#### Turn 8: Wrap-up & WhatsApp Delivery
* **Agent:** "Thank you, Rajesh. I have collected all the details. Our pharmacist has received your clinical summary. You will also receive your DrGodly Pharmacy Intake Report on your WhatsApp in under a minute. Please walk up to the pharmacist counter now. Take care."
* **Telephony Event:** Hangup triggered. Backend dispatches WhatsApp template payload.

---

## 4. Patient WhatsApp Interactive Experience

### 4.1 Message 1: Clinical Notification Card (Immediate Delivery)
* **Header:** `DrGodly Pharmacy Assist`
* **Body:**
```text
Hello Rajesh Kumar,

Your DrGodly clinical intake at Apollo Pharmacy, Indiranagar is complete.

📋 Summary of Reported Symptoms:
• Upper abdominal burning sensation (2 days)
• Discomfort aggravated after food intake
• No emergency symptoms reported

🚦 Clinical Status: 🟡 PHARMACIST REVIEW RECOMMENDED
This intake has been securely transmitted to Pharmacist Ramesh at the counter.

Tap below to access your digital intake report or consult an online doctor.
```
* **Quick Action Buttons (Meta WhatsApp Interactive API):**
  1. `[📄 View Full Report]` (Opens secure webview)
  2. `[👨‍⚕️ Consult a Doctor]` (Initiates teleconsultation)
  3. `[🧪 Find Diagnostic Labs]` (Lists accredited local testing labs)

---

### 4.2 Web-Report Layout (`https://rx.drgodly.com/r/{reportId}`)
* **Header:** Apollo Pharmacy Logo + DrGodly Security Badge + Encounter ID `#DG-2026-00981`.
* **Section 1: Patient Profile & Timeline**
  * Age: 42 | Gender: Male | Intake Time: 12:14 PM | Language: Hindi/English
* **Section 2: Reported Clinical Presentation**
  * Chief Complaint: Epigastric Burning
  * Duration: 2 Days | Severity: 5/10
  * Food Relationship: Post-meal aggravation
* **Section 3: Safety & Red-Flag Clearance**
  * 🟢 Acute myocardial pain screened (Negative)
  * 🟢 Upper gastrointestinal bleeding screened (No hematemesis/melena)
  * 🟢 Syncope / altered consciousness screened (Negative)
* **Section 4: Clinical Differential Considerations (Non-Diagnostic)**
  * *Notice:* "These are potential clinical explanations to assist your healthcare provider and do NOT constitute a definitive diagnosis."
  * 1. Dyspepsia / Non-Ulcer Stomach Discomfort
  * 2. Gastroesophageal Reflux (GERD)
  * 3. Gastritis
* **Section 5: Recommended Next Steps**
  * Primary Recommendation: In-person evaluation by the pharmacy's registered pharmacist.
  * Lifestyle Measures: Avoid spicy/fried foods, eat smaller frequent meals, do not lie down immediately after eating.
* **Section 6: Potential Investigations (If Symptoms Persist >7 Days)**
  * Serum H. pylori antigen / stool antigen
  * Upper GI Endoscopy (if refractory to initial care)
* **Section 7: Nearby Diagnostic Laboratories**
  * Apollo Diagnostics (0.4 km away) — CBC, H. pylori, LFT
  * Lal PathLabs (1.2 km away) — Home sample pickup available
* **Section 8: Statutory Disclaimer (CDSCO & Telemedicine Practice Guidelines 2020)**
  * "Generated via DrGodly AI Clinical Triage System. All medication dispensing is subject to the review and discretion of a registered pharmacist or qualified medical practitioner."

---

## 5. Pharmacist Workspace UX (Web Application)

### 5.1 Real-Time Intake Queue (`/drgodly/pharmacy/intakes`)
```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  DrGodly Pharmacy Assist │ Apollo Pharmacy #00128 (Indiranagar)      [Dr. Ramesh, R.Ph]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Queue Filters: [All (18)]  [🟡 Review Needed (12)]  [🔴 Urgent (1)]  [🟢 Complete (5)] │
├───────────────┬────────────┬─────────────┬──────────┬──────────────┬──────────────────┤
│ TIME          │ PATIENT    │ COMPLAINT   │ TRIAGE   │ WAITING TIME │ ACTION           │
├───────────────┼────────────┼─────────────┼──────────┼──────────────┼──────────────────┤
│ 12:15 PM (Now)│ Rajesh K.  │ Dyspepsia   │ 🟡 Review│ 2 mins       │ [Open Encounter] │
│ 12:11 PM      │ Meena S.   │ Rash / Itch │ 🟡 Review│ 6 mins       │ [Open Encounter] │
│ 12:02 PM      │ Arun M.    │ Chest Pain  │ 🔴 URGENT│ 15 mins      │ [VIEW EMERGENCY] │
│ 11:50 AM      │ Priya D.   │ Cough/Cold  │ 🟢 Done  │ -            │ [View Summary]   │
└───────────────┴────────────┴─────────────┴──────────┴──────────────┴──────────────────┘
```

### 5.2 4-Column Clinical Workspace Screen (`/drgodly/pharmacy/intakes/:id`)

```text
┌─────────────────┬─────────────────────┬─────────────────────┬──────────────────────────┐
│ COLUMN 1:       │ COLUMN 2:           │ COLUMN 3:           │ COLUMN 4:                │
│ PATIENT DEMO    │ CLINICAL SUMMARY    │ AI SAFETY & DIFF    │ PHARMACIST ACTION PANEL  │
├─────────────────┼─────────────────────┼─────────────────────┼──────────────────────────┤
│ Rajesh Kumar    │ Chief Complaint:    │ Triage Result:      │ Pharmacist Checklist:    │
│ Age: 42 | Male  │ Upper abdominal     │ 🟡 YELLOW           │ [x] Verified Allergies   │
│ Phone: +91 98.. │ burning             │                     │ [x] Verified Red Flags   │
│                 │                     │ Red Flags Screened: │ [x] Counseled on Dosing  │
│ Language:       │ Duration: 2 days    │ • Sudden severe: NO │                          │
│ Tamil/English   │ Severity: 5/10      │ • Bleeding/vomit: NO│ Protocol Candidates:     │
│                 │ Post-meal worsening │ • Syncope: NO       │ • Magaldrate + Simeth-   │
│ Known Medical   │                     │                     │   icone Suspension       │
│ History:        │ Associated:         │ Differentials:      │   (Schedule: OTC)        │
│ None reported   │ • Heartburn         │ 1. Dyspepsia        │                          │
│                 │ • Mild bloating     │ 2. Gastritis        │ Actions:                 │
│ Allergies:      │                     │ 3. GERD             │ [💊 Dispense Approved]   │
│ No known drug   │ Relevant Negatives: │                     │ [👨‍⚕️ Escalate to Doctor] │
│ allergies       │ • No fever          │ Investigations:     │ [🧪 Recommend Lab Test]  │
│                 │ • No diarrhea       │ • Routine stool test│ [🚨 Emergency Referral]  │
│ Audio Call:     │ • No weight loss    │   (if persistent)   │                          │
│ [▶️ Play 3:42]  │                     │                     │ [ Complete Encounter ]   │
└─────────────────┴─────────────────────┴─────────────────────┴──────────────────────────┘
```

### 5.3 Pharmacist Action Modals

#### Modal A: Dispense Protocol-Approved OTC Care
* Displays selected OTC item with max 3-day duration limit.
* Validates against central CDSCO formulary (flags if Schedule H or H1).
* Requires pharmacist confirmation: "I confirm this customer was counseled regarding dose, food interactions, and to consult an RMP if symptoms persist beyond 3 days."

#### Modal B: Escalate to Telemedicine Doctor
* Automatically packages the structured clinical intake into an RMP Referral Bundle.
* Sends SMS/WhatsApp notification to patient: "Pharmacist Ramesh has recommended an instant video consultation with a DrGodly Registered Medical Practitioner."

---

## 6. Doctor Telemedicine Portal UX (`/drgodly/doctor/consultations/:id`)

### 6.1 Pre-Consultation Structured Clinical Handoff
Doctors do not need to re-ask demographic, duration, or basic symptom questions. The DrGodly intake presents a standardized pre-consult summary:
1. **Patient Identifier & ABHA Status**
2. **Subjective Intake Summary:** Time-stamped onset, character, severity, triggers.
3. **Deterministic Red-Flag Status:** All negative and positive flags recorded.
4. **Current Medication & Allergy Verification.**

### 6.2 Doctor Consultation & SOAP Generator Screen
* **Left Panel:** WebRTC Audio/Video call feed with patient at pharmacy consultation booth or personal smartphone.
* **Center Panel:** Pre-populated AI SOAP draft:
  * **S (Subjective):** Patient-reported symptoms extracted from voice call.
  * **O (Objective):** Pharmacy-entered vitals (e.g. BP, pulse, temp if recorded) + physical inspection over camera.
  * **A (Assessment):** Doctor's finalized clinical diagnosis (ICD-10 searchable dropdown).
  * **P (Plan):** Rx builder, lab orders, dietary guidance, follow-up timeline.
* **Right Panel: E-Prescription Writer (Telemedicine Practice Guidelines 2020 Compliant)**
  * Doctor's Name, Qualification, State Medical Council Registration No.
  * Generic Drug Name, Strength, Dosage Form, Frequency, Duration, Route, Instructions.
  * Watermark & Cryptographic Signature Hash.
  * "Digitally signed under Information Technology Act, 2000."
  * One-click send to pharmacy dispensing queue + patient WhatsApp.
