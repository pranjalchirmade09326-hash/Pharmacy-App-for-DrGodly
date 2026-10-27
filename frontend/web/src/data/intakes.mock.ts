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
    timestamp: "10 mins ago",
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
      situation: "34-year-old male presenting with epigastric burning and post-prandial sour regurgitation for 72 hours.",
      background: "No history of peptic ulcer, non-smoker, drinks 4-5 cups of cutting chai daily with irregular spicy street food. No prior NSAID consumption.",
      assessment: "Consistent with uncomplicated Acid Peptic Disease (GERD / Functional Dyspepsia). Red flags (dysphagia, hematemesis, melena, weight loss) screened negative.",
      recommendation: "Short-term CDSCO-approved OTC antacid/H2RA, lifestyle guidance (avoid lying down 2 hrs post meals). Refer to General Physician if persistent after 14 days."
    },
    differentialDiagnoses: [
      { condition: "Gastroesophageal Reflux Disease (GERD)", icd10: "K21.9", probability: "HIGH", rationale: "Typical meal-related retrosternal pyrosis and acid regurgitation." },
      { condition: "Functional Dyspepsia", icd10: "K30", probability: "MODERATE", rationale: "Post-prandial fullness and upper abdominal discomfort." }
    ],
    investigationsRecommended: [
      { testName: "H. pylori Stool Antigen / Serology", urgency: "ROUTINE", rationale: "Consider if refractory to initial 14-day acid suppression." },
      { testName: "Complete Hemogram (CBC)", urgency: "ROUTINE", rationale: "Rule out occult anemia." }
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
        indication: "Gastric acid suppression for mild-moderate GERD",
        schedule: "OTC",
        dosage: "20mg once daily at bedtime for up to 14 days",
        warnings: "Discontinue and consult doctor if symptoms worsen or fail to improve in 2 weeks."
      }
    ],
    redFlagsDetected: [],
    status: "PENDING_REVIEW"
  },
  {
    intakeId: "INTAKE-2026-0043",
    timestamp: "25 mins ago",
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
      situation: "48-year-old female presenting with non-productive irritating dry cough, pharyngeal tickle, and low-grade subjective fever for 4 days.",
      background: "Known hypertension well-controlled on Amlodipine 5mg. No history of bronchial asthma or COPD. Denies shortness of breath at rest.",
      assessment: "Likely Acute Viral Pharyngitis / Upper Respiratory Tract Infection (URTI). No signs of lower respiratory tract consolidation.",
      recommendation: "Supportive symptomatic therapy with warm saline gargles, honey-lemon lozenges, and safe OTC antipyretic. Refer to Pulmonologist if fever spikes >101°F or cough exceeds 10 days."
    },
    differentialDiagnoses: [
      { condition: "Acute Viral Pharyngitis / URTI", icd10: "J02.9", probability: "HIGH", rationale: "Dry cough, pharyngeal hyperemia, absence of focal chest signs." },
      { condition: "Acute Bronchitis (Early Stage)", icd10: "J20.9", probability: "MODERATE", rationale: "Progressing cough without wheezing or cyanosis." }
    ],
    investigationsRecommended: [
      { testName: "Pulse Oximetry (SpO2)", urgency: "STAT", rationale: "Baseline check at pharmacy counter (current SpO2: 98% on room air)." },
      { testName: "CBC with ESR", urgency: "ROUTINE", rationale: "Evaluate inflammatory response if persistent." }
    ],
    cdscoFormularyOptions: [
      {
        genericName: "Paracetamol 650mg Tablet",
        indication: "Antipyretic and analgesic for throat pain and mild fever",
        schedule: "OTC",
        dosage: "1 tablet every 6-8 hours as required (max 4 doses/day)",
        warnings: "Do not exceed maximum daily limit of 4000mg. Avoid alcohol."
      },
      {
        genericName: "Dichlorobenzyl Alcohol + Amylmetacresol Lozenges",
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
    timestamp: "42 mins ago",
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
      situation: "56-year-old male with acute retrosternal chest pressure radiating to left shoulder and jaw, accompanied by diaphoresis and mild nausea for 45 minutes.",
      background: "History of smoking 15 pack-years, Type 2 Diabetes, and Dyslipidemia. No prior known CAD.",
      assessment: "CRITICAL RED FLAG ALERT: Highly suspicious for Acute Coronary Syndrome (ACS / Unstable Angina / Acute STEMI). Immediate emergency escalation required.",
      recommendation: "IMMEDIATE EMERGENCY REFERRAL: Do not dispense routine OTC medications. Call Ambulance 108 immediately and transfer patient to the nearest Cardiac Care Hospital with ICU."
    },
    differentialDiagnoses: [
      { condition: "Acute Coronary Syndrome (ACS / NSTEMI / STEMI)", icd10: "I21.9", probability: "HIGH", rationale: "Classic radiating crushing chest pain with autonomic diaphoresis in high-risk patient." },
      { condition: "Aortic Dissection", icd10: "I71.0", probability: "LOW", rationale: "Consider if tearing pain radiates to interscapular back." }
    ],
    investigationsRecommended: [
      { testName: "12-Lead Electrocardiogram (ECG)", urgency: "STAT", rationale: "Immediate bedside recording to detect ST elevation / T wave changes." },
      { testName: "High-Sensitivity Cardiac Troponin I / T", urgency: "STAT", rationale: "Rule in/out myocardial necrosis." }
    ],
    cdscoFormularyOptions: [
      {
        genericName: "EMERGENCY PROTOCOL ONLY - Soluble Aspirin 300mg",
        indication: "Pre-hospital antiplatelet loading under physician direction",
        schedule: "SCHEDULE_H",
        dosage: "Dispersible tablet chewed under medical supervision",
        warnings: "Contraindicated in active GI bleeding or severe aspirin allergy."
      }
    ],
    redFlagsDetected: [
      "Retrosternal crushing chest pain with radiation to left arm & jaw",
      "Profuse diaphoresis (cold sweats) and lightheadedness",
      "High cardiovascular risk profile (Age >50, Smoker, Diabetics)"
    ],
    status: "ESCALATED_EMERGENCY"
  },
  {
    intakeId: "INTAKE-2026-0045",
    timestamp: "1 hour ago",
    patient: {
      name: "Ananya Iyer (Presented by Mother: Kavita Iyer)",
      age: 3,
      gender: "FEMALE",
      phone: "+919655443322",
      preferredLanguage: "Tamil / English"
    },
    triageLevel: "ORANGE",
    chiefComplaint: "Bachhi ko 2 din se bukhar (101.5°F) aur sardi-khasi hai.",
    sbarSummary: {
      situation: "3-year-old female presenting with 48 hours of fever peaking at 101.5°F, runny nose, and nocturnal dry cough.",
      background: "Immunizations up to date per National Immunization Schedule (NIS). No prior wheezing episodes.",
      assessment: "Pediatric Upper Respiratory Tract Infection with Fever. CRITICAL CDSCO 2026 REGULATORY GATE: Patient age is 3 years (<4 years threshold). Fixed Dose Combination (FDC) anti-cold syrups (Chlorpheniramine + Phenylephrine) are STRICTLY BANNED under CDSCO Gazette notifications.",
      recommendation: "Weight-based single-ingredient Paracetamol pediatric drops/suspension for fever. Saline nasal drops for congestion. Mandatory pediatrician teleconsultation for prescription review."
    },
    differentialDiagnoses: [
      { condition: "Pediatric Viral URTI / Common Cold", icd10: "J06.9", probability: "HIGH", rationale: "Low grade fever, clear rhinorrhea, age-typical viral prodrome." },
      { condition: "Acute Otitis Media (Early)", icd10: "H66.9", probability: "MODERATE", rationale: "Needs otoscopic inspection by Pediatrician." }
    ],
    investigationsRecommended: [
      { testName: "Clinical Pediatric Teleconsultation", urgency: "URGENT", rationale: "Assess hydration, respiratory rate, and chest retraction." }
    ],
    cdscoFormularyOptions: [
      {
        genericName: "Paracetamol Pediatric Suspension (120mg/5ml)",
        indication: "Pediatric antipyretic for fever relief",
        schedule: "OTC",
        dosage: "10-15 mg/kg per dose every 6 hours as needed (Pediatrician confirmed dose: 3.5 ml)",
        warnings: "Strictly avoid combination anti-cold FDCs under 4 years per CDSCO rules. Do not exceed 4 doses in 24 hours."
      },
      {
        genericName: "Normal Saline (0.9% NaCl) Pediatric Nasal Drops",
        indication: "Gentle nasal decongestion and mucus clearance",
        schedule: "OTC",
        dosage: "1-2 drops into each nostril before feeds and at sleep",
        warnings: "Preservative-free; discard 30 days after opening."
      }
    ],
    redFlagsDetected: [
      "Pediatric Patient under 4 years: CDSCO anti-cold FDC ban restriction enforced",
      "Persistent fever >48 hours requiring pediatrician evaluation"
    ],
    status: "PENDING_REVIEW"
  }
];
