# DrGodly Pharmacy Assist — Component Breakdown & Architecture Planning

## 1. Overview
This architectural plan establishes a modular, reusable component hierarchy following atomic design principles. All components adhere strictly to the 4px/8px spacing grid, accessible color contrast (WCAG AA), and responsive mobile-first behavior.

---

## 2. Component Hierarchy Map

```
App Shell (src/app/layout.tsx)
├── EmergencyBanner (Top fixed emergency bar with 108 direct call link)
├── Navbar (Branding, Navigation Links, Store Switcher, Cart Badge)
├── Page Content (src/app/*)
└── Footer (CDSCO 2026 Disclaimers, NMC Telemedicine Guidelines, DPDP Act 2023, ABDM badges)

Page 1: Home Landing Page (src/app/page.tsx)
├── HeroSection
│   ├── PharmacyQrCard (High-contrast QR code, Counter instruction, tel:+918069000000 1-tap dialer)
│   └── ValuePropositionBanner (No app install, 100% voice guided, WhatsApp report)
├── HowItWorksSteps (4-step visual journey: Scan -> Voice Intake -> Report -> Care)
└── LiveIntakeSimulator (Interactive voice demo widget showing real-time AI speech-to-SBAR triage)

Page 2: Doctor Search Listing (src/app/doctors/page.tsx)
├── DoctorFilterSidebar
│   ├── SpecialtyFilter (General Physician, Pulmonology, Gastroenterology, Pediatrics, ENT)
│   ├── ExperienceFilter (5+ yrs, 10+ yrs, 15+ yrs)
│   ├── FeeRangeSlider (₹299 - ₹999)
│   └── LanguageFilter (Hindi, English, Tamil, Telugu, Punjabi)
├── DoctorSearchBar (Debounced name, hospital, and symptom search)
├── DoctorGrid
│   └── DoctorCard (Avatar, NMC badge, Specialization, Exp, Fee, Next Slot, Book CTA)
└── DoctorEmptyState (Helpful fallback with reset filter button)

Page 3: Doctor Detailed Profile (src/app/doctors/[id]/page.tsx)
├── DoctorHeaderCard (Doctor image, NMC number, State Council, Degrees, Verified status)
├── DoctorBioSection (Specialties, Clinical interests, Hospital affiliations)
├── SlotPickerMatrix
│   ├── DateSelectorTabs (Today, Tomorrow, Day 3, Day 4)
│   ├── MorningSlotsGroup (Interactive SlotChips: 09:00 AM - 12:00 PM)
│   ├── AfternoonSlotsGroup (Interactive SlotChips: 01:00 PM - 05:00 PM)
│   └── EveningSlotsGroup (Interactive SlotChips: 05:30 PM - 08:30 PM)
└── BookingSummaryCard (Selected Slot Banner, Fee Breakdown, Patient Details, Confirm Button)

Page 4: Product Catalog (src/app/catalog/page.tsx)
├── CatalogHeroBanner (CDSCO Compliance Banner, Safe OTC Guidance)
├── CategoryTabs (All, Digestive, Respiratory, Pain/Fever, Supplements, First Aid)
├── ProductSearchBar
├── ProductGrid
│   └── ProductCard (Image, Schedule Badge, Salt Composition, Pack Size, Price, Add to Cart)
└── CartDrawer / FloatingCartBar (Real-time item count, subtotal, checkout button)

Page 5: Checkout & Dispense System (src/app/checkout/page.tsx)
├── OrderSummaryPanel
│   ├── CartItemList (Quantity adjusters, remove button, Schedule H prescription flag)
│   └── PrescriptionUploadGate (File upload dropzone, Telemedicine link if Rx missing)
└── CheckoutFormPanel
    ├── PatientDetailsForm (Name, Phone +91, Age, Gender, Pickup vs Delivery)
    ├── PharmacyStoreSelector (Selected local counter confirmation)
    ├── PriceBreakdownBox (Subtotal, CGST 6%, SGST 6%, Total Payable INR)
    └── PlaceOrderButton (Generates dispense token & triggers WhatsApp confirmation)

Page 6: Pharmacist Triage Console (src/app/pharmacy/workspace/page.tsx)
└── ClinicalWorkspace4Column
    ├── Column 1: IntakeQueueSidebar (Filter by triage level, patient name, queue card list)
    ├── Column 2: ClinicalSummaryPanel (Chief complaint, SBAR details, AI Red Flag screen)
    ├── Column 3: DifferentialAndFormularyPanel (Ranked ICD-10 differentials, CDSCO formulary)
    └── Column 4: PharmacistActionMatrix (Dispense OTC, Refer Doctor, Order Labs, Emergency 108)
```

---

## 3. Atomic Design Components Specification

| Component | Props | Visual State & Behavior |
|---|---|---|
| `Badge` | `variant: 'red' \| 'orange' \| 'yellow' \| 'green' \| 'blue' \| 'purple' \| 'slate'`, `children: ReactNode` | Renders pill badge with high-contrast background and border. |
| `Button` | `variant: 'primary' \| 'secondary' \| 'danger' \| 'outline'`, `size: 'sm' \| 'md' \| 'lg'`, `onClick`, `disabled` | Primary: Medical Teal `#0D9488` with hover transition; Danger: Red `#EF4444`; Focus outline for a11y. |
| `SlotChip` | `time: string`, `isSelected: boolean`, `isBooked: boolean`, `onSelect: () => void` | Booked: `opacity-40 cursor-not-allowed line-through`; Selected: `bg-teal-50 border-teal-600 text-teal-800 font-bold ring-2 ring-teal-500/20`. |
| `Modal` | `isOpen: boolean`, `onClose: () => void`, `title: string`, `children: ReactNode` | Backdrop blur `bg-slate-900/60`, keyboard Esc key dismissal, accessibility focus trap. |
| `EmergencyBanner` | None (Autonomous) | Fixed alert styling with bold red icon and 1-tap tel dialer for Indian Ambulance 108. |
| `Navbar` | `activeRoute: string`, `cartCount: number` | Responsive sticky top header, mobile hamburger toggle, store picker dropdown. |
