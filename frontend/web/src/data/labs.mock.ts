export interface DiagnosticLab {
  id: string;
  name: string;
  distanceKm: number;
  location: string;
  phone: string;
  rating: number;
  reviewCount: number;
  homeCollectionAvailable: boolean;
  nablAccredited: boolean;
  popularTests: Array<{
    testName: string;
    priceINR: number;
    turnaroundTime: string;
  }>;
}

export const MOCK_LABS: DiagnosticLab[] = [
  {
    id: "lab-lal-01",
    name: "Dr. Lal PathLabs — Connaught Place Centre",
    distanceKm: 0.8,
    location: "Block B, Middle Circle, Connaught Place, New Delhi",
    phone: "+91 11 3988 5050",
    rating: 4.8,
    reviewCount: 3420,
    homeCollectionAvailable: true,
    nablAccredited: true,
    popularTests: [
      { testName: "Complete Blood Count (CBC)", priceINR: 350, turnaroundTime: "6 Hours" },
      { testName: "H. pylori Stool Antigen Detection", priceINR: 1200, turnaroundTime: "24 Hours" },
      { testName: "Liver Function Test (LFT)", priceINR: 650, turnaroundTime: "12 Hours" },
      { testName: "HbA1c Glycated Hemoglobin", priceINR: 450, turnaroundTime: "8 Hours" },
    ],
  },
  {
    id: "lab-thyro-02",
    name: "Thyrocare Aarogyam Wellness Centre",
    distanceKm: 1.2,
    location: "Barakhamba Road, Near Metro Gate 3, New Delhi",
    phone: "+91 22 3090 0000",
    rating: 4.7,
    reviewCount: 2180,
    homeCollectionAvailable: true,
    nablAccredited: true,
    popularTests: [
      { testName: "Aarogyam Complete Health Profile (63 Tests)", priceINR: 999, turnaroundTime: "24 Hours" },
      { testName: "Thyroid Function Test (T3, T4, TSH)", priceINR: 350, turnaroundTime: "12 Hours" },
      { testName: "Lipid Profile (Cholesterol & Triglycerides)", priceINR: 450, turnaroundTime: "12 Hours" },
      { testName: "Vitamin D & B12 Combo", priceINR: 850, turnaroundTime: "24 Hours" },
    ],
  },
  {
    id: "lab-metro-03",
    name: "Metropolis Healthcare Diagnostic Laboratory",
    distanceKm: 1.5,
    location: "Kasturba Gandhi Marg, Janpath, New Delhi",
    phone: "+91 11 4050 6000",
    rating: 4.9,
    reviewCount: 1890,
    homeCollectionAvailable: true,
    nablAccredited: true,
    popularTests: [
      { testName: "High-Sensitivity Cardiac Troponin I", priceINR: 1500, turnaroundTime: "2 Hours (STAT)" },
      { testName: "12-Lead Electrocardiogram (ECG)", priceINR: 300, turnaroundTime: "Instant / Bedside" },
      { testName: "Renal Function Test (KFT / Creatinine)", priceINR: 550, turnaroundTime: "8 Hours" },
      { testName: "Serum Electrolytes (Na, K, Cl)", priceINR: 450, turnaroundTime: "6 Hours" },
    ],
  },
  {
    id: "lab-apollo-04",
    name: "Apollo Diagnostics Clinic",
    distanceKm: 2.1,
    location: "Pahar Ganj Road, Central Delhi",
    phone: "+91 11 2345 6789",
    rating: 4.6,
    reviewCount: 1420,
    homeCollectionAvailable: false,
    nablAccredited: true,
    popularTests: [
      { testName: "Dengue NS1 Antigen & IgM/IgG", priceINR: 950, turnaroundTime: "4 Hours" },
      { testName: "Urine Routine & Microscopic", priceINR: 200, turnaroundTime: "4 Hours" },
      { testName: "Widal Test for Typhoid Fever", priceINR: 250, turnaroundTime: "6 Hours" },
    ],
  },
];
