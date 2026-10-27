# DrGodly Pharmacy Assist — API Data Contracts & Mock JSON Schemas

This document defines the formal data contracts between the DrGodly Pharmacy Frontend, the AI clinical intake engine, the CDSCO formulary service, and the ABDM FHIR R4 server.

---

## 1. Doctor Profile & Slot Availability Contract

- **Endpoint:** `GET /api/v1/doctors` & `GET /api/v1/doctors/:id`
- **Schema Reference:** [`docs/api_contracts/doctor.schema.json`](file:///d:/Pharmacy%20app/docs/api_contracts/doctor.schema.json)
- **Sample Response Payload:**

```json
{
  "id": "doc-del-001",
  "fullName": "Dr. Rajesh K. Sharma",
  "degrees": ["MBBS", "MD (General Medicine)"],
  "nmcRegistrationNumber": "NMC-MCI-2014-48291",
  "stateMedicalCouncil": "Delhi Medical Council",
  "specialization": "Internal Medicine / General Physician",
  "experienceYears": 14,
  "languages": ["Hindi", "English", "Punjabi"],
  "consultationFeeINR": 499,
  "rating": 4.9,
  "reviewCount": 1280,
  "avatarUrl": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
  "hospitalAffiliation": "Max Super Speciality Hospital & DrGodly Virtual Care",
  "aboutBio": "Senior Physician with over 14 years experience treating acute respiratory illnesses, gastrointestinal disorders, diabetes management, and chronic hypertension. Expert in tele-triage and rational pharmacotherapy.",
  "availableToday": true,
  "nextAvailableSlot": "Today, 04:30 PM",
  "slots": [
    { "slotId": "slot-01", "date": "2026-10-27", "time": "04:30 PM", "period": "afternoon", "isBooked": false },
    { "slotId": "slot-02", "date": "2026-10-27", "time": "05:00 PM", "period": "evening", "isBooked": false },
    { "slotId": "slot-03", "date": "2026-10-27", "time": "05:30 PM", "period": "evening", "isBooked": true },
    { "slotId": "slot-04", "date": "2026-10-27", "time": "06:00 PM", "period": "evening", "isBooked": false },
    { "slotId": "slot-05", "date": "2026-10-28", "time": "10:00 AM", "period": "morning", "isBooked": false },
    { "slotId": "slot-06", "date": "2026-10-28", "time": "10:30 AM", "period": "morning", "isBooked": false }
  ]
}
```

---

## 2. Product Catalog Contract

- **Endpoint:** `GET /api/v1/catalog`
- **Schema Reference:** [`docs/api_contracts/catalog_product.schema.json`](file:///d:/Pharmacy%20app/docs/api_contracts/catalog_product.schema.json)
- **Sample Response Payload:**

```json
{
  "id": "prod-otc-001",
  "brandName": "Electral ORS Powder",
  "genericComposition": "WHO-recommended Oral Rehydration Salts (Sodium Chloride 2.6g, Potassium Chloride 1.5g, Sodium Citrate 2.9g, Dextrose 13.5g)",
  "cdscoCategory": "OTC",
  "prescriptionRequired": false,
  "packSize": "21.8g Sachet (Pack of 5)",
  "mrpINR": 110,
  "sellingPriceINR": 98,
  "inStock": true,
  "stockCount": 85,
  "category": "digestive",
  "dosageInstructions": "Dissolve contents of 1 sachet in 1 litre of clean drinking water. Consume within 24 hours.",
  "safetyWarnings": [
    "Use with caution in severe renal impairment",
    "Do not boil the reconstituted solution"
  ],
  "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80"
}
```

---

## 3. Checkout & Dispense Order Contract

- **Endpoint:** `POST /api/v1/orders/checkout`
- **Schema Reference:** [`docs/api_contracts/checkout_order.schema.json`](file:///d:/Pharmacy%20app/docs/api_contracts/checkout_order.schema.json)
- **Sample Request Payload:**

```json
{
  "pharmacyStoreId": "PHARM-DEL-041",
  "patientDetails": {
    "name": "Rahul Sharma",
    "phone": "+919876543210",
    "age": 34,
    "gender": "MALE",
    "deliveryAddress": "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
    "pickupMode": "STORE_PICKUP"
  },
  "cartItems": [
    {
      "productId": "prod-otc-001",
      "brandName": "Electral ORS Powder",
      "unitPriceINR": 98,
      "quantity": 2,
      "prescriptionRequired": false
    },
    {
      "productId": "prod-otc-003",
      "brandName": "Gelusil MPS Antacid Liquid",
      "unitPriceINR": 140,
      "quantity": 1,
      "prescriptionRequired": false
    }
  ],
  "subtotalINR": 336,
  "cgstINR": 20.16,
  "sgstINR": 20.16,
  "totalAmountINR": 376.32,
  "prescriptionUploaded": false,
  "telemedicineReferralId": "TELE-2026-904"
}
```

---

## 4. Pharmacy Clinical Intake Triage Contract

- **Endpoint:** `GET /api/v1/pharmacy/intakes`
- **Schema Reference:** [`docs/api_contracts/pharmacy_intake.schema.json`](file:///d:/Pharmacy%20app/docs/api_contracts/pharmacy_intake.schema.json)
- **Sample Response Payload:**

```json
{
  "intakeId": "INTAKE-2026-0042",
  "timestamp": "2026-10-27T10:15:30Z",
  "patient": {
    "name": "Rahul Sharma",
    "age": 34,
    "gender": "MALE",
    "phone": "+919876543210",
    "preferredLanguage": "Hindi"
  },
  "triageLevel": "YELLOW",
  "chiefComplaint": "Pet me jalan aur khatti dakar 3 din se ho rahi hai khana khane ke baad.",
  "sbarSummary": {
    "situation": "34M presenting with epigastric burning and sour belching exacerbated post-prandially for 72 hours.",
    "background": "No prior ulcer history, no NSAID abuse, non-smoker, drinks 4-5 cups of cutting chai daily with irregular spicy street food.",
    "assessment": "Consistent with acute uncomplicated acid peptic disorder (GERD / functional dyspepsia). Red flags (dysphagia, hematemesis, melena, unexplained weight loss) screened negative.",
    "recommendation": "Recommend short-term CDSCO-approved OTC antacid/H2RA, lifestyle and dietary modification. Refer to General Physician if symptoms persist beyond 14 days."
  },
  "differentialDiagnoses": [
    { "condition": "Gastroesophageal Reflux Disease (GERD)", "icd10": "K21.9", "probability": "HIGH", "rationale": "Classic retrosternal pyrosis related to meals." },
    { "condition": "Functional Dyspepsia", "icd10": "K30", "probability": "MODERATE", "rationale": "Postprandial fullness and epigastric discomfort." }
  ],
  "investigationsRecommended": [
    { "testName": "Serum Helicobacter pylori Stool Antigen", "urgency": "ROUTINE", "rationale": "If refractory to initial 14-day acid suppression." }
  ],
  "cdscoFormularyOptions": [
    {
      "genericName": "Magaldrate + Simethicone Oral Suspension",
      "indication": "Immediate symptomatic relief of hyperacidity and flatulence",
      "schedule": "OTC",
      "dosage": "10-20 ml post meals and at bedtime",
      "warnings": "Do not exceed recommended dose. Caution in renal impairment."
    },
    {
      "genericName": "Famotidine 20mg Tablet",
      "indication": "Gastric acid reduction",
      "schedule": "OTC",
      "dosage": "20 mg once daily at bedtime for up to 14 days",
      "warnings": "Consult doctor if symptom relief is absent after 14 days."
    }
  ],
  "redFlagsDetected": [],
  "status": "PENDING_REVIEW"
}
```
