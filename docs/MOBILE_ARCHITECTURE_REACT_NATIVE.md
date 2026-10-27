# DrGodly Pharmacy Assist — React Native Mobile UI Architecture

## 1. Overview & Mobile-First Strategy
DrGodly Pharmacy Assist is architected as a native mobile experience for Indian retail pharmacies. The mobile UI caters to two primary user personas:
1. **Health Consumer / Walk-in Patient:** Scan counter QR poster, trigger native phone dialer via universal `Linking.openURL('tel:+918069000000')`, review WhatsApp clinical intake reports, book video/audio teleconsultations with NMC-registered doctors, and browse CDSCO-compliant OTC wellness products.
2. **Licensed Retail Pharmacist:** Review incoming patient voice intakes on a high-density clinical triage console, inspect AI SBAR extractions, verify CDSCO formulary safety rules (e.g. anti-cold FDC ban under 4 years old, Schedule H/H1 restrictions), dispense safe OTC medications, or escalate emergency cases to Ambulance 108.

---

## 2. React Native Directory Structure

```
d:\Pharmacy app\mobile\
├── package.json                   # React Native & Navigation dependencies
├── App.tsx                        # Application Root with SafeAreaProvider, NavigationContainer & CartContext
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.tsx       # BottomTabNavigator & NativeStackNavigator
│   │   └── types.ts               # Navigation route param list types
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Pharmacy Counter QR, 1-Tap Dialer & Live Intake Voice Simulator
│   │   ├── DoctorSearchScreen.tsx # Search & filter verified NMC tele-doctors by specialty & fee
│   │   ├── DoctorDetailScreen.tsx # Detailed credentials, calendar date picker & interactive slot chips
│   │   ├── ProductCatalogScreen.tsx # CDSCO OTC health supplements with scheduling badges & cart actions
│   │   ├── CheckoutScreen.tsx     # Cart itemization, prescription gate, patient form & GST invoice
│   │   └── PharmacistTriageScreen.tsx # 4-column clinical triage console with SBAR, red flags & 108 escalation
│   ├── components/
│   │   ├── MobileHeader.tsx       # Brand logo, store switcher dropdown & cart icon badge
│   │   ├── EmergencyBanner.tsx    # Sticky emergency alert bar with 1-tap call to 108
│   │   ├── Badge.tsx              # Native color pills (RED, ORANGE, YELLOW, GREEN, SCHEDULE_H)
│   │   ├── Button.tsx             # Medical Teal & Slate buttons with active press states
│   │   ├── SlotChip.tsx           # Interactive appointment slot button with highlight toggle
│   │   ├── DoctorCard.tsx         # Native doctor listing card with NMC badge & fee
│   │   ├── ProductCard.tsx        # Native OTC medicine card with salt info & stock
│   │   ├── EmergencyModal.tsx     # Critical red-flag emergency alert dialog
│   │   └── PrescriptionModal.tsx  # Schedule H/H1 prescription requirement modal
│   ├── theme/
│   │   ├── colors.ts              # Medical Blue (#0D9488), Mint (#10B981), Red (#EF4444), Amber (#F59E0B)
│   │   ├── typography.ts          # Native font scales & weights
│   │   └── spacing.ts             # 4px/8px multiples
│   ├── context/
│   │   └── CartContext.tsx        # Mobile shopping cart provider (items, add, update, remove, subtotal)
│   ├── data/
│   │   ├── doctors.ts             # 6 NMC-registered Indian doctors with multi-day slots
│   │   ├── products.ts            # CDSCO-compliant OTC supplements and medications
│   │   └── intakes.ts             # 4 Clinical patient scenarios (GERD, Bronchitis, Angina, Pediatric)
│   └── utils/
│       └── currency.ts            # Indian Rupee (₹) formatting helper
```

---

## 3. Screen Specifications & User Actions Map

### 3.1 Screen 1: Pharmacy Counter & Intake (`HomeScreen`)
- **Display:** Large physical pharmacy counter poster with prominent QR artwork, One-Tap Dialer button, and language support pills (Hindi, English, Tamil, Telugu).
- **User Action:** Tapping "Call DrGodly" calls `Linking.openURL('tel:+918069000000')` to instantly pop up the smartphone's native dialer.
- **Interactive Simulator:** Pressing "Simulate Patient Intake Call" starts a live animated intake simulation showing real-time audio waveforms, Hindi/English speech-to-text transcript, SBAR clinical extraction, and a preview of the delivered WhatsApp report.

### 3.2 Screen 2: Doctor Discovery (`DoctorSearchScreen`)
- **Display:** Search input for doctor name, specialty, hospital, or symptoms. Horizontal scrolling filter pills for specialties (General Physician, Pulmonology, Gastroenterology, Pediatrics, ENT, Dermatology) and fee caps (≤ ₹500, ≤ ₹700, All).
- **User Action:** Typing in the search input instantly filters the doctor list. Tapping any doctor card or "Select Slot" transitions to `DoctorDetailScreen`.

### 3.3 Screen 3: Doctor Detailed Profile & Slot Booking (`DoctorDetailScreen`)
- **Display:** Full doctor credentials, NMC registration number, State Council, degrees, hospital affiliations, consultation fees, and clinical bio.
- **Slot Interaction:** Horizontal date picker tabs (Today, Tomorrow, Day 3). Morning, afternoon, and evening slot chips.
- **User Action:** Tapping a slot chip toggles its selection (`border-teal-600`, `bg-teal-50`, checkmark, highlighted slot text). Tapping "Confirm Appointment" opens a confirmation modal with consultation token.

### 3.4 Screen 4: CDSCO Product Catalog (`ProductCatalogScreen`)
- **Display:** Category filter tabs (All, Digestive, Respiratory, Pain/Fever, Vitamins/Supplements, First Aid). Product cards with salt compositions, pack sizes, MRP, and CDSCO scheduling badges:
  - Green Badge: `CDSCO OTC Safe`
  - Amber/Red Badge: `Schedule H / H1 - Rx Required`
- **User Action:** Tapping "Add to Cart" increments quantity and updates the top header badge. A floating bottom bar displays live cart summary with quick checkout navigation.

### 3.5 Screen 5: Cart & Checkout (`CheckoutScreen`)
- **Display:** Itemized cart list with +/- quantity steppers and delete buttons. Prescription upload banner if cart contains Schedule H medicines. Patient demographics form (Name, Phone, Age, Gender) and store pickup vs delivery selector.
- **GST Invoice:** Automatic 12% GST calculation (Subtotal, CGST 6%, SGST 6%, Total Payable INR).
- **User Action:** Tapping "Confirm Dispense" completes the order and displays a dispense pickup token.

### 3.6 Screen 6: Pharmacist Clinical Triage Console (`PharmacistTriageScreen`)
- **Display:** Real-time intake queue with triage severity badges (`RED` Critical, `ORANGE` Urgent, `YELLOW` Moderate, `GREEN` Mild). Full SBAR clinical case review, differential diagnoses with ICD-10 codes, and CDSCO formulary recommendations.
- **User Action:**
  - Selecting an intake updates the clinical detail view.
  - Tapping an emergency case (e.g. Amit Verma - Angina) opens an instant emergency modal with one-tap 108 Ambulance calling.
  - Pharmacist can tap "Dispense OTC", "Refer to Doctor", or "Order Labs" to sign off and dispatch report.
