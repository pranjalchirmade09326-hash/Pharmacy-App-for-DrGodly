export interface DifferentialItem {
  condition: string;
  icd10: string;
  probability: 'HIGH' | 'MODERATE' | 'LOW';
  rationale: string;
}

export interface InvestigationItem {
  testName: string;
  urgency: 'ROUTINE' | 'URGENT' | 'STAT';
  rationale: string;
}

export interface CDSCOFormularyOption {
  genericName: string;
  indication: string;
  schedule: 'OTC' | 'SCHEDULE_H' | 'SCHEDULE_H1';
  dosage: string;
  warnings: string;
}

export interface PharmacyIntakeRecord {
  intakeId: string;
  timestamp: string;
  patient: {
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    preferredLanguage: string;
  };
  triageLevel: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  chiefComplaint: string;
  sbarSummary: {
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
  };
  differentialDiagnoses: DifferentialItem[];
  investigationsRecommended: InvestigationItem[];
  cdscoFormularyOptions: CDSCOFormularyOption[];
  redFlagsDetected: string[];
  status: 'PENDING_REVIEW' | 'PHARMACIST_DISPENSED' | 'REFERRED_TO_DOCTOR' | 'ESCALATED_EMERGENCY';
}

export const MOCK_INTAKES: PharmacyIntakeRecord[] = [
  {
    intakeId: "INTAKE-2026-0042",
    timestamp: "10m ago",
    patient: {
      name: "Rahul Sharma",
      age: 34,
      gender: "MALE",
      phone: "+919876543210",
      preferredLanguage: "Hindi"
    },
    triageLevel: "YELLOW",
    chiefComplaint: "Pet me jalan aur khatti dakar 3 din se ho rahi hai khana khane ke baad.",
    sbarSummary: {
      situation: "34-year-old male with epigastric burning and post-prandial sour regurgitation for 72 hours.",
      background: "Drinks 4-5 cups of cutting chai daily with irregular spicy street food. No prior NSAID consumption.",
      assessment: "Consistent with uncomplicated Acid Peptic Disease (GERD). Red flags (dysphagia, hematemesis, melena) negative.",
      recommendation: "Short-term CDSCO OTC antacid/H2RA, lifestyle guidance. Refer to RMP if persistent >14 days."
    },
    differentialDiagnoses: [
      { condition: "Gastroesophageal Reflux Disease (GERD)", icd10: "K21.9", probability: "HIGH", rationale: "Meal-related retrosternal pyrosis and acid regurgitation." },
      { condition: "Functional Dyspepsia", icd10: "K30", probability: "MODERATE", rationale: "Post-prandial fullness and epigastric discomfort." }
    ],
    investigationsRecommended: [
      { testName: "H. pylori Stool Antigen", urgency: "ROUTINE", rationale: "If refractory to 14-day acid suppression." },
      { testName: "Complete Blood Count (CBC)", urgency: "ROUTINE", rationale: "Rule out occult anemia." }
    ],
    cdscoFormularyOptions: [
      {
        genericName: "Magaldrate (480mg) + Simethicone (20mg) Suspension",
        indication: "Immediate symptomatic relief of hyperacidity and flatulence",
        schedule: "OTC",
        dosage: "10-20 ml 1 hour after meals and at bedtime",
        warnings: "Do not exceed recommended dose. Shake well before use."
      },
      {
        genericName: "Famotidine 20mg Tablet",
        indication: "Gastric acid reduction for mild GERD",
        schedule: "OTC",
        dosage: "20mg once daily at bedtime for up to 14 days",
        warnings: "Consult doctor if symptom relief is absent after 14 days."
      }
    ],
    redFlagsDetected: [],
    status: "PENDING_REVIEW"
  },
  {
    intakeId: "INTAKE-2026-0043",
    timestamp: "25m ago",
    patient: {
      name: "Sunita Patel",
      age: 48,
      gender: "FEMALE",
      phone: "+919812345678",
      preferredLanguage: "Gujarati / Hindi"
    },
    triageLevel: "YELLOW",
    chiefComplaint: "Gale me kharash, sukhi khasi aur halka bukhar 4 din se.",
    sbarSummary: {
      situation: "48-year-old female with non-productive dry cough and low-grade subjective fever for 4 days.",
      background: "Hypertension well-controlled on Amlodipine 5mg. Denies shortness of breath at rest.",
      assessment: "Acute Viral Pharyngitis / Upper Respiratory Tract Infection (URTI). No lower respiratory consolidation.",
      recommendation: "Supportive symptomatic therapy: warm saline gargles, lozenges, and safe OTC antipyretic."
    },
    differentialDiagnoses: [
      { condition: "Acute Viral Pharyngitis / URTI", icd10: "J02.9", probability: "HIGH", rationale: "Dry cough, pharyngeal hyperemia, no focal chest signs." },
      { condition: "Acute Bronchitis (Early)", icd10: "J20.9", probability: "MODERATE", rationale: "Progressing cough without wheezing." }
    ],
    investigationsRecommended: [
      { testName: "Pulse Oximetry (SpO2)", urgency: "STAT", rationale: "Counter check (current SpO2: 98% on room air)." }
    ],
    cdscoFormularyOptions: [
      {
        genericName: "Paracetamol 650mg Tablet",
        indication: "Antipyretic and analgesic for throat pain and mild fever",
        schedule: "OTC",
        dosage: "1 tablet every 6-8 hours as required",
        warnings: "Max 4 doses/day. Avoid alcohol."
      },
      {
        genericName: "Amylmetacresol + Dichlorobenzyl Alcohol Lozenges",
        indication: "Soothing topical throat antiseptic",
        schedule: "OTC",
        dosage: "1 lozenge slowly dissolved in mouth every 2-3 hours",
        warnings: "Do not chew or swallow whole."
      }
    ],
    redFlagsDetected: [],
    status: "PENDING_REVIEW"
  },
  {
    intakeId: "INTAKE-2026-0044",
    timestamp: "45m ago",
    patient: {
      name: "Amit Verma",
      age: 56,
      gender: "MALE",
      phone: "+919700112233",
      preferredLanguage: "English / Hindi"
    },
    triageLevel: "RED",
    chiefComplaint: "Chhati me bhari-pan, dard jo baen hath ki taraf ja raha hai, aur thanda paseena.",
    sbarSummary: {
      situation: "56-year-old male with acute retrosternal crushing chest pressure radiating to left arm with diaphoresis for 45 mins.",
      background: "Smoking history 15 pack-years, Type 2 Diabetes, Dyslipidemia.",
      assessment: "CRITICAL RED FLAG ALERT: Highly suspicious for Acute Coronary Syndrome (ACS / Unstable Angina / Acute STEMI).",
      recommendation: "IMMEDIATE EMERGENCY REFERRAL: Do not dispense routine OTC medications. Call Ambulance 108 immediately and transfer patient to the nearest Cardiac Care Hospital."
    },
    differentialDiagnoses: [
      { condition: "Acute Coronary Syndrome (ACS / STEMI)", icd10: "I21.9", probability: "HIGH", rationale: "Radiating crushing chest pain with autonomic diaphoresis in high-risk patient." }
    ],
    investigationsRecommended: [
      { testName: "12-Lead Electrocardiogram (ECG)", urgency: "STAT", rationale: "Immediate recording to detect ST elevation." },
      { testName: "High-Sensitivity Cardiac Troponin I", urgency: "STAT", rationale: "Evaluate myocardial necrosis." }
    ],
    cdscoFormularyOptions: [
      {
        genericName: "EMERGENCY PROTOCOL ONLY - Soluble Aspirin 300mg",
        indication: "Pre-hospital antiplatelet loading under physician guidance",
        schedule: "SCHEDULE_H",
        dosage: "Dispersible tablet chewed under direct medical direction",
        warnings: "Contraindicated in active GI bleeding."
      }
    ],
    redFlagsDetected: [
      "Retrosternal crushing chest pain radiating to left arm & jaw",
      "Profuse diaphoresis (cold sweats)",
      "High cardiovascular risk profile (Age 56, Smoker, Diabetes)"
    ],
    status: "ESCALATED_EMERGENCY"
  },
  {
    intakeId: "INTAKE-2026-0045",
    timestamp: "1h ago",
    patient: {
      name: "Ananya Iyer (Presented by Mother: Kavita)",
      age: 3,
      gender: "FEMALE",
      phone: "+919655443322",
      preferredLanguage: "Tamil / English"
    },
    triageLevel: "ORANGE",
    chiefComplaint: "Bachhi ko 2 din se bukhar (101.5°F) aur sardi-khasi hai.",
    sbarSummary: {
      situation: "3-year-old female presenting with 48 hours of fever (101.5°F), rhinorrhea, and nocturnal cough.",
      background: "Immunizations up to date. No prior wheezing episodes.",
      assessment: "Pediatric URTI with Fever. CRITICAL CDSCO 2026 REGULATORY GATE: Patient age is 3 years (<4 years threshold). Fixed Dose Combination (FDC) anti-cold syrups (Chlorpheniramine + Phenylephrine) are STRICTLY BANNED under CDSCO Gazette notifications.",
      recommendation: "Weight-based single-ingredient Paracetamol suspension for fever. Saline nasal drops for congestion. Mandatory pediatrician teleconsultation."
    },
    differentialDiagnoses: [
      { condition: "Pediatric Viral URTI / Common Cold", icd10: "J06.9", probability: "HIGH", rationale: "Fever, clear rhinorrhea, age-typical viral prodrome." }
    ],
    investigationsRecommended: [
      { testName: "Clinical Pediatric Teleconsultation", urgency: "URGENT", rationale: "Assess hydration, respiratory rate, and chest retraction." }
    ],
    cdscoFormularyOptions: [
      {
        genericName: "Paracetamol Pediatric Suspension (120mg/5ml)",
        indication: "Pediatric antipyretic for fever relief",
        schedule: "OTC",
        dosage: "10-15 mg/kg per dose every 6 hours (Confirmed dose: 3.5 ml)",
        warnings: "Strictly avoid combination anti-cold FDCs under 4 years per CDSCO rules."
      },
      {
        genericName: "Normal Saline (0.9% NaCl) Pediatric Drops",
        indication: "Gentle nasal decongestion and mucus clearance",
        schedule: "OTC",
        dosage: "1-2 drops into each nostril before feeds",
        warnings: "Preservative-free; discard after 30 days."
      }
    ],
    redFlagsDetected: [
      "Pediatric Patient under 4 years: CDSCO anti-cold FDC ban restriction enforced",
      "Persistent fever >48 hours requiring pediatrician evaluation"
    ],
    status: "PENDING_REVIEW"
  }
];
