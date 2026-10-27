export interface CatalogProduct {
  id: string;
  brandName: string;
  genericComposition: string;
  cdscoCategory: 'OTC' | 'SCHEDULE_H_RESTRICTED' | 'SUPPLEMENT' | 'AYUSH';
  prescriptionRequired: boolean;
  packSize: string;
  mrpINR: number;
  sellingPriceINR: number;
  inStock: boolean;
  stockCount: number;
  dosageInstructions: string;
  safetyWarnings: string[];
  category: 'digestive' | 'respiratory' | 'pain_fever' | 'supplements' | 'first_aid';
  imageUrl: string;
}

export const MOCK_PRODUCTS: CatalogProduct[] = [
  {
    id: "prod-001",
    brandName: "Electral Oral Rehydration Salts (ORS)",
    genericComposition: "WHO Formula: Sodium Chloride 2.6g, Potassium Chloride 1.5g, Sodium Citrate 2.9g, Dextrose 13.5g",
    cdscoCategory: "OTC",
    prescriptionRequired: false,
    packSize: "21.8g Sachet (Pack of 5)",
    mrpINR: 110,
    sellingPriceINR: 98,
    inStock: true,
    stockCount: 85,
    dosageInstructions: "Dissolve 1 full sachet in 1000 ml clean water. Consume within 24 hours.",
    safetyWarnings: [
      "Use with caution in severe renal impairment.",
      "Do not boil the reconstituted solution."
    ],
    category: "digestive",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-002",
    brandName: "Gelusil MPS Antacid & Antigas Liquid",
    genericComposition: "Aluminium Hydroxide 0.25g, Magnesium Hydroxide 0.25g, Simethicone 50mg per 5ml",
    cdscoCategory: "OTC",
    prescriptionRequired: false,
    packSize: "200 ml Mint Flavour Bottle",
    mrpINR: 165,
    sellingPriceINR: 145,
    inStock: true,
    stockCount: 42,
    dosageInstructions: "Take 1-2 teaspoonfuls (5-10 ml) 30-60 mins after meals and at bedtime.",
    safetyWarnings: [
      "Not recommended for prolonged unmonitored use.",
      "Shake well before use."
    ],
    category: "digestive",
    imageUrl: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-003",
    brandName: "Digene Ultra Fizz Antacid Sachet",
    genericComposition: "Sodium Bicarbonate, Citric Acid, Khatika (Ayurvedic neutralizer)",
    cdscoCategory: "AYUSH",
    prescriptionRequired: false,
    packSize: "5g Sachet (Pack of 10)",
    mrpINR: 120,
    sellingPriceINR: 105,
    inStock: true,
    stockCount: 110,
    dosageInstructions: "Dissolve 1 sachet in a glass of cold water (150 ml) and drink immediately.",
    safetyWarnings: [
      "Contains sodium; caution in hypertension.",
      "Not a replacement for chronic GERD therapy."
    ],
    category: "digestive",
    imageUrl: "https://images.unsplash.com/photo-1550572017-edb79a61324c?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-004",
    brandName: "Dolo 650 Fast Release Paracetamol",
    genericComposition: "Paracetamol 650mg (Acetaminophen)",
    cdscoCategory: "OTC",
    prescriptionRequired: false,
    packSize: "Strip of 15 Tablets",
    mrpINR: 34,
    sellingPriceINR: 30,
    inStock: true,
    stockCount: 220,
    dosageInstructions: "Adults: 1 tablet every 6 to 8 hours as needed. Maximum 4 tablets in 24 hours.",
    safetyWarnings: [
      "Overdose may cause severe liver damage.",
      "Do not combine with other paracetamol products."
    ],
    category: "pain_fever",
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-005",
    brandName: "Strepsils Honey & Lemon Lozenges",
    genericComposition: "Dichlorobenzyl Alcohol 1.2mg, Amylmetacresol 0.6mg",
    cdscoCategory: "OTC",
    prescriptionRequired: false,
    packSize: "Strip of 8 Lozenges",
    mrpINR: 55,
    sellingPriceINR: 48,
    inStock: true,
    stockCount: 150,
    dosageInstructions: "Dissolve 1 lozenge slowly in the mouth every 2-3 hours.",
    safetyWarnings: [
      "Not recommended for children under 6.",
      "Consult doctor if sore throat persists >3 days."
    ],
    category: "respiratory",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-006",
    brandName: "Otrivin Adult Saline Nasal Spray",
    genericComposition: "Isotonic Buffered Sodium Chloride 0.9% w/v",
    cdscoCategory: "OTC",
    prescriptionRequired: false,
    packSize: "50 ml Metered Dose Spray",
    mrpINR: 125,
    sellingPriceINR: 110,
    inStock: true,
    stockCount: 60,
    dosageInstructions: "1-2 sprays into each nostril 2-3 times daily to gently cleanse nasal passages.",
    safetyWarnings: [
      "For nasal use only.",
      "Preservative-free saline without chemical decongestants."
    ],
    category: "respiratory",
    imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-007",
    brandName: "Becosules Z Multivitamin & Zinc",
    genericComposition: "Vitamin B-Complex (B1, B2, B6, B12), Vitamin C 150mg, Zinc Sulphate 41.4mg",
    cdscoCategory: "SUPPLEMENT",
    prescriptionRequired: false,
    packSize: "Strip of 20 Capsules",
    mrpINR: 52,
    sellingPriceINR: 45,
    inStock: true,
    stockCount: 95,
    dosageInstructions: "1 capsule daily after a principal meal with a glass of water.",
    safetyWarnings: [
      "Nutritional dietary supplement.",
      "Store in a cool dry place."
    ],
    category: "supplements",
    imageUrl: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-008",
    brandName: "Betadine 5% Antiseptic Ointment",
    genericComposition: "Povidone-Iodine 5% w/w",
    cdscoCategory: "OTC",
    prescriptionRequired: false,
    packSize: "20g Tube",
    mrpINR: 85,
    sellingPriceINR: 75,
    inStock: true,
    stockCount: 70,
    dosageInstructions: "Clean wound thoroughly and apply a thin layer 1-2 times daily.",
    safetyWarnings: [
      "Avoid in patients with iodine hypersensitivity.",
      "For external topical use only."
    ],
    category: "first_aid",
    imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-009",
    brandName: "Pan 40 (Pantoprazole Gastro-Resistant)",
    genericComposition: "Pantoprazole Sodium IP 40mg",
    cdscoCategory: "SCHEDULE_H_RESTRICTED",
    prescriptionRequired: true,
    packSize: "Strip of 15 Tablets",
    mrpINR: 155,
    sellingPriceINR: 135,
    inStock: true,
    stockCount: 140,
    dosageInstructions: "1 tablet once daily in the morning 30 minutes before breakfast as prescribed by RMP.",
    safetyWarnings: [
      "SCHEDULE H PRESCRIPTION DRUG: Not to be sold by retail without an RMP prescription.",
      "Consult DrGodly tele-doctor to obtain prescription."
    ],
    category: "digestive",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-010",
    brandName: "Amoxyclav 625 (Amoxicillin + Clavulanate)",
    genericComposition: "Amoxicillin 500mg + Potassium Clavulanate 125mg",
    cdscoCategory: "SCHEDULE_H_RESTRICTED",
    prescriptionRequired: true,
    packSize: "Strip of 10 Tablets",
    mrpINR: 210,
    sellingPriceINR: 185,
    inStock: true,
    stockCount: 50,
    dosageInstructions: "Take strictly as prescribed by your doctor. Complete the full antibiotic course.",
    safetyWarnings: [
      "SCHEDULE H1 DRUG: Sold on retail prescription only with register record.",
      "Strict prescription required under CDSCO stewardship rules."
    ],
    category: "respiratory",
    imageUrl: "https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=300&auto=format&fit=crop&q=80"
  }
];
