# DrGodly Pharmacy Assist — React Native Mobile Application

This directory contains the production-grade **React Native** mobile application for DrGodly Pharmacy Assist, custom-tailored for Indian retail pharmacies.

---

## 1. Core Mobile Screens

1. **`HomeScreen` (`src/screens/HomeScreen.tsx`):**
   - High-contrast pharmacy counter QR poster graphic.
   - 1-Tap universal `tel:+918069000000` dialer action (`Linking.openURL`).
   - 4-step Bharat intake explanation (Scan &rarr; AI Voice &rarr; WhatsApp Report &rarr; Pharmacist Dispense).
   - Live AI Voice Intake Simulator with animated status, Hindi speech recognition, and SBAR extraction.

2. **`DoctorSearchScreen` (`src/screens/DoctorSearchScreen.tsx`):**
   - Search bar across doctor names, specialties, hospitals, and symptoms.
   - Filter pills for specialties (General Physician, Pulmonology, Gastroenterology, Pediatrics, ENT, Dermatology).
   - Fee filters (&le; ₹500, &le; ₹700, &le; ₹900).
   - NMC-verified doctor cards with experience, degrees, council numbers, and next available slots.

3. **`DoctorDetailScreen` (`src/screens/DoctorDetailScreen.tsx`):**
   - Detailed RMP verification details, state medical councils, hospital affiliations, and clinical bios.
   - Multi-day horizontal calendar date picker (Today, Tomorrow, Day 3).
   - Interactive Morning, Afternoon, and Evening slot chips with visual teal highlight toggle.
   - Consultation fee breakdown and appointment confirmation modal with token generation (`#TELE-2026-904`).

4. **`ProductCatalogScreen` (`src/screens/ProductCatalogScreen.tsx`):**
   - CDSCO 2026-compliant OTC supplement & medication catalog.
   - Category filter pills (Digestive, Respiratory, Pain/Fever, Supplements, First Aid).
   - Clear scheduling badges (`CDSCO OTC Safe` green badge, `Schedule H - Rx Required` purple badge).
   - Add to Cart steppers and floating bottom cart bar.

5. **`CheckoutScreen` (`src/screens/CheckoutScreen.tsx`):**
   - Itemized cart with quantity steppers and remove triggers.
   - Schedule H prescription upload / telemedicine consultation gate.
   - Patient details input (Name, WhatsApp +91, Age, Gender).
   - In-store counter pickup vs local delivery selector.
   - Transparent GST invoice calculation (Subtotal, CGST 6%, SGST 6%, Total Payable INR).
   - Order confirmation modal with pickup token (`#DISP-2026-8941`).

6. **`PharmacistTriageScreen` (`src/screens/PharmacistTriageScreen.tsx`):**
   - Professional workstation for licensed Registered Pharmacists (RPh).
   - Intake queue with triage severity badges (`RED`, `ORANGE`, `YELLOW`, `GREEN`).
   - Structured SBAR clinical summary (Situation, Background, Assessment, Recommendation).
   - Differential diagnosis matrix with ICD-10 codes.
   - Deterministic CDSCO 2026 formulary validation (enforcing under-4 pediatric anti-cold FDC ban).
   - 4-action decision matrix: Dispense OTC, Refer to Doctor, Order Labs, or trigger Emergency 108 protocol.

---

## 2. Running the Mobile Application

### Prerequisites
- Node.js &gt;= 18
- React Native CLI or Expo CLI
- Android Studio (for Android emulator) or Xcode (for iOS simulator)

### Start Metro Bundler
```bash
cd mobile
npm install # or pnpm install
npm run start
```

### Run on Android
```bash
npm run android
```

### Run on iOS (macOS only)
```bash
npm run ios
```
