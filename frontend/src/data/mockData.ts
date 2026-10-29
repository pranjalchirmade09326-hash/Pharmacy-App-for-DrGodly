// mockData.ts - Clinical Dataset for DrGodly Pharmacy Assist

export interface SBARData {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
}

export interface PatientIntake {
  id: string;
  tokenNumber: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  language: string;
  chiefComplaint: string;
  duration: string;
  severityScore: number; // 1 to 10
  triageLevel: "RED" | "ORANGE" | "YELLOW" | "GREEN";
  redFlagsDetected: string[];
  allergies: string;
  sbar: SBARData;
  whatsappDelivered: boolean;
  status: "AWAITING_PHARMACIST" | "DISPENSED" | "ESCALATED_RMP" | "EMERGENCY_108";
}

export const MOCK_INTAKES: PatientIntake[] = [
  {
    id: "intake_001",
    tokenNumber: "#INTAKE-0042",
    patientName: "Rahul Sharma",
    age: 34,
    gender: "Male",
    language: "Hindi",
    chiefComplaint: "Severe epigastric burning & retrosternal acid reflux",
    duration: "3 Days",
    severityScore: 5,
    triageLevel: "YELLOW",
    redFlagsDetected: [],
    allergies: "No Known Drug Allergies (NKDA)",
    sbar: {
      situation: "34M presenting at retail counter with post-prandial retrosternal burning and sour eructations for 72 hours.",
      background: "Exacerbated after spicy meals. No prior history of peptic ulcers. No NSAID overuse.",
      assessment: "Uncomplicated Acid Peptic Disease (Dyspepsia/GERD). Red flags negative: no radiating chest pain, no hematemesis, no dysphagia.",
      recommendation: "CDSCO-approved OTC antacid suspension (Aluminium/Magnesium Hydroxide + Simethicone). Refer to RMP if unresolved in 5 days.",
    },
    whatsappDelivered: true,
    status: "AWAITING_PHARMACIST",
  },
  {
    id: "intake_002",
    tokenNumber: "#INTAKE-0043",
    patientName: "Aarav Patel",
    age: 3,
    gender: "Male",
    language: "Gujarati",
    chiefComplaint: "Acute cough, nasal congestion & mild fever",
    duration: "2 Days",
    severityScore: 6,
    triageLevel: "ORANGE",
    redFlagsDetected: [
      "CDSCO 2026 GUARDRAIL: Pediatric patient under 4 years of age. Fixed-dose combination (FDC) cold syrups (Chlorpheniramine + Phenylephrine) prohibited.",
    ],
    allergies: "NKDA",
    sbar: {
      situation: "3-year-old male child presenting with rhinitis, persistent dry cough, and low-grade fever (100.2°F).",
      background: "No history of asthma or febrile seizures. Immunizations up to date.",
      assessment: "Pediatric Upper Respiratory Infection. CDSCO 2026 pediatric guardrail triggered for age under 4.",
      recommendation: "Mandatory escalation to Registered Medical Practitioner (Pediatrician). Dispense only pediatric oral rehydration; do NOT dispense OTC cold syrups.",
    },
    whatsappDelivered: true,
    status: "ESCALATED_RMP",
  },
  {
    id: "intake_003",
    tokenNumber: "#INTAKE-0044",
    patientName: "Suresh Menon",
    age: 58,
    gender: "Male",
    language: "Tamil",
    chiefComplaint: "Crushing chest discomfort radiating to left jaw & diaphoresis",
    duration: "45 Minutes",
    severityScore: 9,
    triageLevel: "RED",
    redFlagsDetected: [
      "EMERGENCY RED FLAG: Radiating retrosternal chest pain with left jaw radiation and cold sweating (High ACS / Myocardial Infarction suspicion).",
    ],
    allergies: "NKDA",
    sbar: {
      situation: "58M at pharmacy counter presenting with acute crushing chest tightness, cold sweating, and radiation to left mandible for 45 minutes.",
      background: "Hypertensive for 8 years. Smoker.",
      assessment: "Suspected Acute Coronary Syndrome (ACS / STEMI). Immediate life threat.",
      recommendation: "IMMEDIATE 108 AMBULANCE ESCALATION. Administer counter first-aid protocol under pharmacist. Strictly NO oral OTC dispensing.",
    },
    whatsappDelivered: true,
    status: "EMERGENCY_108",
  },
];

export const MOCK_MEDICATIONS = [
  {
    id: "med_01",
    brandName: "Gelusil MPS Mint Syrup",
    genericComposition: "Aluminium Hydroxide 250mg + Magnesium Hydroxide 250mg + Simethicone 50mg",
    category: "OTC Safe",
    schedule: "OTC",
    dosageForm: "Suspension",
    packSize: "200 ml Bottle",
    priceINR: 128,
    isPrescriptionRequired: false,
    cdscoCompliant: true,
  },
  {
    id: "med_02",
    brandName: "Dolo 650 Tablets",
    genericComposition: "Paracetamol IP 650mg",
    category: "OTC Safe",
    schedule: "OTC",
    dosageForm: "Tablet",
    packSize: "15 Tablets / Strip",
    priceINR: 31,
    isPrescriptionRequired: false,
    cdscoCompliant: true,
  },
  {
    id: "med_03",
    brandName: "Pan-D Capsules",
    genericComposition: "Pantoprazole Sodium 40mg + Domperidone 30mg SR",
    category: "Prescription Only",
    schedule: "Schedule H",
    dosageForm: "Capsule",
    packSize: "15 Capsules / Strip",
    priceINR: 215,
    isPrescriptionRequired: true,
    cdscoCompliant: true,
  },
];

export const MOCK_DOCTORS = [
  {
    id: "doc_01",
    name: "Dr. Rajeshwar Sharma",
    specialty: "General Physician & Diabetologist",
    degrees: "MBBS, MD (Internal Medicine)",
    experienceYears: 16,
    rating: 4.9,
    consultationFeeINR: 399,
    hospital: "Max Super Speciality Hospital, New Delhi",
    languages: ["Hindi", "English", "Punjabi"],
    availableSlot: "Next available in 15 mins",
  },
  {
    id: "doc_02",
    name: "Dr. Ananya Deshmukh",
    specialty: "Consultant Pediatrician",
    degrees: "MBBS, MD (Pediatrics)",
    experienceYears: 14,
    rating: 4.95,
    consultationFeeINR: 449,
    hospital: "Lilavati Hospital, Mumbai",
    languages: ["English", "Hindi", "Marathi"],
    availableSlot: "Next available in 25 mins",
  },
];
