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

export interface PatientVitals {
  bp?: string;
  pulse?: number;
  spo2?: number;
  temp?: string;
  grbs?: string;
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
  vitals?: PatientVitals;
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
    timestamp: "8m ago",
    patient: {
      name: "Rahul Sharma",
      age: 34,
      gender: "MALE",
      phone: "+919876543210",
      preferredLanguage: "Hindi"
    },
    vitals: {
      bp: "122/80 mmHg",
      pulse: 74,
      spo2: 99,
      temp: "98.4°F",
      grbs: "108 mg/dL"
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
    timestamp: "18m ago",
    patient: {
      name: "Sunita Patel",
      age: 48,
      gender: "FEMALE",
      phone: "+919812345678",
      preferredLanguage: "Gujarati / Hindi"
    },
    vitals: {
      bp: "130/84 mmHg",
      pulse: 82,
      spo2: 98,
      temp: "99.8°F",
      grbs: "124 mg/dL"
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
      { testName: "Pulse Oximetry (SpO2)", urgency: "STAT", rationale: "Counter check (current SpO2: 98% on room air)." },
      { testName: "CBC with ESR", urgency: "ROUTINE", rationale: "Assess viral vs bacterial etiology if fever persists." }
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
    timestamp: "32m ago",
    patient: {
      name: "Amit Verma",
      age: 56,
      gender: "MALE",
      phone: "+919700112233",
      preferredLanguage: "English / Hindi"
    },
    vitals: {
      bp: "158/98 mmHg",
      pulse: 104,
      spo2: 94,
      temp: "98.6°F",
      grbs: "186 mg/dL"
    },
    triageLevel: "RED",
    chiefComplaint: "Chhati me bhari-pan, dard jo baen hath ki taraf ja raha hai, aur thanda paseena.",
    sbarSummary: {
      situation: "56-year-old male with acute retrosternal crushing chest pressure radiating to left arm with diaphoresis for 45 mins.",
      background: "Smoking history 15 pack-years, Type 2 Diabetes, Dyslipidemia.",
      assessment: "CRITICAL RED FLAG ALERT: Highly suspicious for Acute Coronary Syndrome (ACS / STEMI). Life threat.",
      recommendation: "IMMEDIATE EMERGENCY REFERRAL: Do not dispense routine OTC medications. Call Ambulance 108 immediately and transfer patient to the nearest Cardiac Care Hospital."
    },
    differentialDiagnoses: [
      { condition: "Acute Coronary Syndrome (ACS / STEMI)", icd10: "I21.9", probability: "HIGH", rationale: "Radiating crushing chest pain with autonomic diaphoresis in high-risk patient." },
      { condition: "Aortic Dissection", icd10: "I71.0", probability: "LOW", rationale: "Sudden tearing pain, differential radial pulse to be verified." }
    ],
    investigationsRecommended: [
      { testName: "12-Lead Electrocardiogram (ECG)", urgency: "STAT", rationale: "Immediate recording to detect ST elevation." },
      { testName: "High-Sensitivity Cardiac Troponin I", urgency: "STAT", rationale: "Evaluate myocardial necrosis." }
    ],
    cdscoFormularyOptions: [
      {
        genericName: "EMERGENCY PROTOCOL ONLY - Soluble Aspirin 300mg",
        indication: "Pre-hospital antiplatelet loading under physician direction",
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
    timestamp: "50m ago",
    patient: {
      name: "Ananya Iyer (Mother: Kavita)",
      age: 3,
      gender: "FEMALE",
      phone: "+919655443322",
      preferredLanguage: "Tamil / English"
    },
    vitals: {
      bp: "Normal for age",
      pulse: 118,
      spo2: 97,
      temp: "101.5°F",
      grbs: "N/A"
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
  },
  {
    intakeId: "INTAKE-2026-0046",
    timestamp: "1h 15m ago",
    patient: {
      name: "Sunita Devi",
      age: 52,
      gender: "FEMALE",
      phone: "+919833445566",
      preferredLanguage: "Bhojpuri / Hindi"
    },
    vitals: {
      bp: "142/88 mmHg",
      pulse: 86,
      spo2: 98,
      temp: "99.1°F",
      grbs: "248 mg/dL (High)"
    },
    triageLevel: "ORANGE",
    chiefComplaint: "Right foot ke thumb par phoda ho gaya hai, dard kam hai par peela pani nikal raha hai.",
    sbarSummary: {
      situation: "52-year-old female with chronic diabetes presenting with a non-healing ulcerated blister on the right great toe with seropurulent discharge for 6 days.",
      background: "Type 2 Diabetes Mellitus for 11 years on irregular Metformin. Evident peripheral sensory neuropathy (loss of protective vibration/monofilament sensation).",
      assessment: "Diabetic Foot Ulcer (Wagner Grade 1) with localized soft tissue infection and uncontrolled hyperglycemia. High risk of osteomyelitis if untreated.",
      recommendation: "Mandatory urgent referral to Diabetologist / General Surgeon. Sterile saline counter dressing. Do NOT dispense OTC topical steroid creams."
    },
    differentialDiagnoses: [
      { condition: "Diabetic Foot Ulcer (Wagner Grade 1)", icd10: "E11.621", probability: "HIGH", rationale: "Neuropathic plantar ulcer in long-standing diabetic with purulent discharge." },
      { condition: "Cellulitis of Lower Extremity", icd10: "L03.115", probability: "MODERATE", rationale: "Erythema extending 1.5 cm around ulcer margins." }
    ],
    investigationsRecommended: [
      { testName: "Fasting & Post-Prandial Blood Sugar + HbA1c", urgency: "URGENT", rationale: "Evaluate glycemic control (counter GRBS: 248 mg/dL)." },
      { testName: "Wound Swab for Aerobic Culture & Sensitivity", urgency: "ROUTINE", rationale: "Guide targeted antibiotic therapy." },
      { testName: "X-Ray Right Foot (AP & Oblique)", urgency: "URGENT", rationale: "Rule out underlying cortical osteomyelitis." }
    ],
    cdscoFormularyOptions: [
      {
        genericName: "Povidone Iodine 5% Sterile Ointment",
        indication: "Topical broad-spectrum antiseptic for minor superficial wound dressing",
        schedule: "OTC",
        dosage: "Apply thin film after sterile normal saline rinse, cover with sterile gauze",
        warnings: "Do not apply over large open lesions without doctor direction."
      }
    ],
    redFlagsDetected: [
      "Diabetic Neuropathic Ulcer with active exudate and uncontrolled blood sugar (>240 mg/dL)",
      "High limb-threatening progression risk if oral antibiotics are delayed"
    ],
    status: "PENDING_REVIEW"
  },
  {
    intakeId: "INTAKE-2026-0047",
    timestamp: "1h 40m ago",
    patient: {
      name: "Priya Nair",
      age: 28,
      gender: "FEMALE",
      phone: "+919744556677",
      preferredLanguage: "Malayalam / English"
    },
    vitals: {
      bp: "106/68 mmHg",
      pulse: 88,
      spo2: 99,
      temp: "98.2°F",
      grbs: "92 mg/dL"
    },
    triageLevel: "ORANGE",
    chiefComplaint: "Pregnancy ke 8th week me bohot zyada ulti aur chakkar aa rahe hain, pani bhi nahi pachta.",
    sbarSummary: {
      situation: "28-year-old primigravida at 8 weeks gestation presenting with severe intractable nausea and persistent vomiting (>6 episodes/day) for 48 hours.",
      background: "Confirmed intrauterine pregnancy via USG at 6 weeks. No fever, no abdominal cramping, no vaginal bleeding.",
      assessment: "Hyperemesis Gravidarum with impending dehydration. PREGNANCY REGULATORY SAFETY GUARDRAIL: Strict teratogenicity screening required before dispensing any anti-emetic.",
      recommendation: "Approved first-line CDSCO pregnancy safety combination (Doxylamine Succinate + Pyridoxine Hydrochloride). Oral Rehydration Solution (ORS) sips. Urgent Ob/Gyn evaluation if unable to retain fluids."
    },
    differentialDiagnoses: [
      { condition: "Hyperemesis Gravidarum", icd10: "O21.0", probability: "HIGH", rationale: "First-trimester persistent vomiting with inability to tolerate liquids." },
      { condition: "Acute Viral Gastroenteritis in Pregnancy", icd10: "A08.4", probability: "LOW", rationale: "No diarrhea, no fever, no abdominal pain." }
    ],
    investigationsRecommended: [
      { testName: "Urine Routine & Microscopic (for Ketones & Specific Gravity)", urgency: "STAT", rationale: "Detect starvation ketosis and dehydration." },
      { testName: "Serum Electrolytes (Na, K, Cl)", urgency: "URGENT", rationale: "Evaluate hypokalemia from persistent emesis." }
    ],
    cdscoFormularyOptions: [
      {
        genericName: "Doxylamine Succinate (10mg) + Pyridoxine HCl (10mg) Tablet",
        indication: "First-line CDSCO and FDA approved antiemetic for nausea and vomiting in pregnancy",
        schedule: "SCHEDULE_H",
        dosage: "2 tablets at bedtime on an empty stomach with a glass of water",
        warnings: "Schedule H prescription medication; dispense only on RMP authorization."
      },
      {
        genericName: "Oral Rehydration Salts (WHO Low Osmolarity)",
        indication: "Fluid and electrolyte maintenance",
        schedule: "OTC",
        dosage: "Sip 1 liter slowly over 4-6 hours",
        warnings: "Do not add sugar or fruit juices to the solution."
      }
    ],
    redFlagsDetected: [
      "First Trimester Pregnancy: High teratogenic vulnerability; prohibited OTC antiemetics blocked",
      "Persistent dehydration risk (unable to retain fluids for >12 hours)"
    ],
    status: "PENDING_REVIEW"
  }
];
