import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
  Modal,
  Alert,
} from "react-native";
import { colors } from "../theme/colors";
import { borderRadius, shadows, spacing } from "../theme/spacing";
import { formatINR } from "../utils/currency";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";

export interface LabTestItem {
  id: string;
  code: string;
  name: string;
  category: "FULL_BODY" | "DIABETES" | "FEVER" | "CARDIAC" | "THYROID" | "WOMEN";
  parametersCount: number;
  badge?: string;
  fasting: string;
  sampleType: string;
  tat: string;
  price: number;
  originalPrice: number;
  labName: string;
  labRating: number;
  distanceKm: number;
  accreditations: string[];
  keyParameters: string[];
}

export interface PastLabReport {
  id: string;
  reportNumber: string;
  testName: string;
  labName: string;
  date: string;
  status: "NORMAL" | "ATTENTION" | "CRITICAL";
  statusText: string;
  verifiedBy: string;
  keyFindings: string;
}

const MOCK_LAB_TESTS: LabTestItem[] = [
  {
    id: "test_01",
    code: "DL-FB-82",
    name: "Dr. Lal Smart Full Body Health Checkup",
    category: "FULL_BODY",
    parametersCount: 82,
    badge: "⭐ MOST POPULAR • 48% OFF",
    fasting: "10-12 hrs fasting required",
    sampleType: "Blood (EDTA + Serum) & Urine",
    tat: "12 Hours",
    price: 1299,
    originalPrice: 2500,
    labName: "Dr. Lal PathLabs — Connaught Place",
    labRating: 4.8,
    distanceKm: 0.8,
    accreditations: ["NABL", "CAP Certified", "ISO 15189"],
    keyParameters: [
      "Complete Hemogram (CBC + ESR)",
      "Liver Function Test (11 Parameters)",
      "Kidney Function Test (KFT)",
      "Lipid Profile (Cholesterol)",
      "Thyroid Stimulating Hormone (TSH)",
      "HbA1c Glycated Hemoglobin",
      "Vitamin D & Vitamin B12",
      "Urine Routine & Microscopic",
    ],
  },
  {
    id: "test_02",
    code: "AG-CBC-24",
    name: "Complete Blood Count (CBC) with ESR",
    category: "FEVER",
    parametersCount: 24,
    badge: "⚡ STAT EXPRESS • 4h RESULT",
    fasting: "No fasting required",
    sampleType: "EDTA Whole Blood (2 ml)",
    tat: "4 Hours",
    price: 350,
    originalPrice: 500,
    labName: "Agilus Diagnostics (SRL) — Safdarjung",
    labRating: 4.8,
    distanceKm: 1.1,
    accreditations: ["NABL", "ICMR Approved"],
    keyParameters: [
      "Hemoglobin (Hb)",
      "Total Leucocyte Count (TLC)",
      "Differential Count (Neutrophils, Lymphocytes)",
      "Platelet Count (Automated + Smear)",
      "RBC Indices (MCV, MCH, MCHC)",
      "Erythrocyte Sedimentation Rate (ESR)",
    ],
  },
  {
    id: "test_03",
    code: "TH-DB-18",
    name: "Comprehensive Diabetic & Metabolic Profile",
    category: "DIABETES",
    parametersCount: 18,
    badge: "🩺 DIABETES ESSENTIAL",
    fasting: "8-10 hrs overnight fasting",
    sampleType: "Fluoride Blood & Serum",
    tat: "6 Hours",
    price: 699,
    originalPrice: 1200,
    labName: "Thyrocare Aarogyam Wellness Centre",
    labRating: 4.7,
    distanceKm: 1.2,
    accreditations: ["NABL", "ISO Certified"],
    keyParameters: [
      "HbA1c (Glycated Hemoglobin by HPLC)",
      "Estimated Average Glucose (eAG)",
      "Fasting Blood Sugar (FBS)",
      "Lipid Profile with Triglycerides",
      "Microalbumin / Creatinine Ratio (Urine)",
    ],
  },
  {
    id: "test_04",
    code: "MET-DENGUE-04",
    name: "Dengue & Acute Viral Fever Diagnostic Panel",
    category: "FEVER",
    parametersCount: 8,
    badge: "🚨 SEASONAL SURGE ALERT",
    fasting: "No fasting required",
    sampleType: "Serum & Whole Blood",
    tat: "3 Hours STAT",
    price: 1150,
    originalPrice: 1800,
    labName: "Metropolis Healthcare — Janpath",
    labRating: 4.9,
    distanceKm: 1.5,
    accreditations: ["NABL", "CAP Certified"],
    keyParameters: [
      "Dengue NS1 Antigen (ELISA)",
      "Dengue IgM & IgG Antibodies",
      "Platelet Count (STAT verification)",
      "Peripheral Smear for Malarial Parasite (MP)",
    ],
  },
  {
    id: "test_05",
    code: "AP-CARD-12",
    name: "Advanced Cardiac Risk & Lipid Screening",
    category: "CARDIAC",
    parametersCount: 14,
    badge: "❤️ HEART HEALTH",
    fasting: "12 hrs fasting strictly required",
    sampleType: "Blood Serum (3 ml)",
    tat: "8 Hours",
    price: 950,
    originalPrice: 1600,
    labName: "Apollo Diagnostics — Defence Colony",
    labRating: 4.8,
    distanceKm: 2.1,
    accreditations: ["NABL", "Apollo Quality Protocol"],
    keyParameters: [
      "High-Sensitivity CRP (hs-CRP)",
      "Total Cholesterol & Triglycerides",
      "HDL, LDL, VLDL Cholesterol",
      "Apolipoprotein A1 & B",
      "Cardiac Risk Ratio (TC/HDL)",
    ],
  },
  {
    id: "test_06",
    code: "MAX-THY-03",
    name: "Thyroid Profile Total (T3, T4, Ultrasensitive TSH)",
    category: "THYROID",
    parametersCount: 3,
    badge: "⚡ SAME DAY REPORT",
    fasting: "Morning fasting preferred",
    sampleType: "Blood Serum",
    tat: "6 Hours",
    price: 380,
    originalPrice: 650,
    labName: "Max Lab Diagnostics — Saket",
    labRating: 4.9,
    distanceKm: 3.4,
    accreditations: ["NABL", "JCI Standards"],
    keyParameters: [
      "Total Triiodothyronine (T3)",
      "Total Thyroxine (T4)",
      "Ultrasensitive 3rd Gen TSH",
    ],
  },
  {
    id: "test_07",
    code: "TH-VIT-02",
    name: "Active Vitamin D3 & Vitamin B12 Combo",
    category: "FULL_BODY",
    parametersCount: 2,
    badge: "🦴 BONE & ENERGY VITAL",
    fasting: "No fasting required",
    sampleType: "Blood Serum (Protected from Light)",
    tat: "12 Hours",
    price: 850,
    originalPrice: 1500,
    labName: "Thyrocare Aarogyam Wellness Centre",
    labRating: 4.7,
    distanceKm: 1.2,
    accreditations: ["NABL", "ISO Certified"],
    keyParameters: [
      "25-Hydroxy Vitamin D (Total D2 + D3)",
      "Vitamin B12 (Cyanocobalamin)",
    ],
  },
  {
    id: "test_08",
    code: "MET-WOMEN-22",
    name: "Women's Wellness & Hormonal Balance Panel",
    category: "WOMEN",
    parametersCount: 22,
    badge: "🌸 WOMEN'S HEALTH",
    fasting: "10 hrs fasting required",
    sampleType: "Blood Serum & Plasma",
    tat: "16 Hours",
    price: 1499,
    originalPrice: 2800,
    labName: "Metropolis Healthcare — Janpath",
    labRating: 4.9,
    distanceKm: 1.5,
    accreditations: ["NABL", "CAP Certified"],
    keyParameters: [
      "Complete Blood Count with Ferritin (Iron Reserve)",
      "Thyroid Stimulating Hormone (TSH)",
      "Serum Calcium & Phosphorus",
      "HbA1c & Fasting Insulin (HOMA-IR)",
      "Prolactin & Free Testosterone",
    ],
  },
];

const MOCK_PAST_REPORTS: PastLabReport[] = [
  {
    id: "rep_01",
    reportNumber: "DL-REP-2026-8819",
    testName: "Complete Blood Count (CBC) with Platelets",
    labName: "Dr. Lal PathLabs — Connaught Place",
    date: "18 Oct 2026",
    status: "NORMAL",
    statusText: "Normal Findings",
    verifiedBy: "Dr. N. Sengupta, MD (Pathology)",
    keyFindings: "Hb: 14.2 g/dL (Normal: 13-17) • Platelets: 2.45 Lakhs/μL • TLC: 7,400 cells/cumm.",
  },
  {
    id: "rep_02",
    reportNumber: "TH-REP-2026-5521",
    testName: "Comprehensive HbA1c & Fasting Glucose",
    labName: "Thyrocare Aarogyam Wellness",
    date: "02 Oct 2026",
    status: "ATTENTION",
    statusText: "Borderline Pre-Diabetic",
    verifiedBy: "Dr. M. Iyer, MD (Biochemistry)",
    keyFindings: "HbA1c: 6.3% (Pre-diabetic threshold 5.7 - 6.4%) • Fasting Blood Sugar: 112 mg/dL.",
  },
  {
    id: "rep_03",
    reportNumber: "MET-REP-2026-3012",
    testName: "Lipid Profile & Serum Cholesterol",
    labName: "Metropolis Healthcare",
    date: "12 Aug 2026",
    status: "ATTENTION",
    statusText: "Mild Dyslipidemia",
    verifiedBy: "Dr. Anita Desai, MD (Pathology)",
    keyFindings: "Total Cholesterol: 218 mg/dL (Desirable <200) • LDL: 138 mg/dL • Triglycerides: 165 mg/dL.",
  },
];

const CATEGORIES = [
  { key: "ALL", label: "All Tests (8)" },
  { key: "FULL_BODY", label: "Full Body Checkup" },
  { key: "FEVER", label: "Fever & Infection" },
  { key: "DIABETES", label: "Diabetes & Sugar" },
  { key: "CARDIAC", label: "Heart & Lipid" },
  { key: "THYROID", label: "Thyroid Care" },
  { key: "WOMEN", label: "Women's Wellness" },
];

export function LabsScreen() {
  const [activeTab, setActiveTab] = useState<"CATALOG" | "REPORTS">("CATALOG");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [filterHomeOnly, setFilterHomeOnly] = useState(false);
  const [filterFastReport, setFilterFastReport] = useState(false);

  // Booking Flow State
  const [selectedTest, setSelectedTest] = useState<LabTestItem | null>(null);
  const [bookingStep, setBookingStep] = useState<"SLOT" | "CONFIRMED">("SLOT");
  const [selectedSlot, setSelectedSlot] = useState("Tomorrow 06:30 AM - 07:30 AM (Fasting)");
  const [selectedPatient, setSelectedPatient] = useState("Self: Rahul Sharma (34M)");
  const [homeAddress, setHomeAddress] = useState(
    "Flat 402, Royal Residency, Connaught Place, New Delhi - 110001"
  );
  const [bookingToken, setBookingToken] = useState("");

  const filteredTests = MOCK_LAB_TESTS.filter((item) => {
    const q = search.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.labName.toLowerCase().includes(q) ||
      item.keyParameters.some((p) => p.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;

    const matchesFast = !filterFastReport || item.tat.includes("3") || item.tat.includes("4");

    return matchesQuery && matchesCategory && matchesFast;
  });

  const handleOpenBooking = (test: LabTestItem) => {
    setSelectedTest(test);
    setBookingStep("SLOT");
    setBookingToken(`LAB-DEL-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleConfirmBooking = () => {
    setBookingStep("CONFIRMED");
  };

  const handleDownloadReport = (rep: PastLabReport) => {
    Alert.alert(
      "Digital Pathology Report",
      `Opening authenticated PDF report for ${rep.testName} (${rep.reportNumber}) verified by ${rep.verifiedBy}.`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. Top Diagnostic Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTag}>DIAGNOSTICS & PATHOLOGY HUB</Text>
          <Text style={styles.headerTitle}>Certified Diagnostic Lab Tests</Text>
          <Text style={styles.headerSubtitle}>
            NABL & CAP Accredited Labs • 100% Sterile Cold-Chain Sample Collection
          </Text>
        </View>

        {/* View Segment Switcher (Book Tests vs Past Reports) */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.switchBtn, activeTab === "CATALOG" && styles.switchBtnActive]}
            onPress={() => setActiveTab("CATALOG")}
            activeOpacity={0.8}
          >
            <Text style={[styles.switchBtnText, activeTab === "CATALOG" && styles.switchBtnTextActive]}>
              🧪 Book Tests ({MOCK_LAB_TESTS.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchBtn, activeTab === "REPORTS" && styles.switchBtnActive]}
            onPress={() => setActiveTab("REPORTS")}
            activeOpacity={0.8}
          >
            <Text style={[styles.switchBtnText, activeTab === "REPORTS" && styles.switchBtnTextActive]}>
              📄 Reports ({MOCK_PAST_REPORTS.length} Ready)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Main Body Content */}
      {activeTab === "CATALOG" ? (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Box */}
          <View style={styles.searchCard}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search test (CBC, HbA1c, Thyroid, Dengue) or lab..."
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")} style={styles.clearBtn}>
                  <Text style={styles.clearBtnText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Filter Toggle Strip */}
            <View style={styles.quickFilterRow}>
              <TouchableOpacity
                onPress={() => setFilterHomeOnly(!filterHomeOnly)}
                style={[styles.filterPill, filterHomeOnly && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, filterHomeOnly && styles.filterPillTextActive]}>
                  🏠 Free Home Pickup
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilterFastReport(!filterFastReport)}
                style={[styles.filterPill, filterFastReport && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, filterFastReport && styles.filterPillTextActive]}>
                  ⚡ Fast TAT (&lt; 4 Hours)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((c) => {
              const isSelected = selectedCategory === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => setSelectedCategory(c.key)}
                  style={[styles.catPill, isSelected && styles.catPillActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.catPillText, isSelected && styles.catPillTextActive]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Trust Banner Strip */}
          <View style={styles.trustStrip}>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>🛡️</Text>
              <View>
                <Text style={styles.trustHeading}>100% NABL Verified</Text>
                <Text style={styles.trustSub}>Highest accuracy standard</Text>
              </View>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>⏱️</Text>
              <View>
                <Text style={styles.trustHeading}>45-Min Home Pickup</Text>
                <Text style={styles.trustSub}>Barcoded cold-chain transit</Text>
              </View>
            </View>
          </View>

          {/* Test Cards List / Responsive Grid */}
          <View style={styles.testsGrid}>
            {filteredTests.map((test) => {
              const discountPercent = Math.round(
                ((test.originalPrice - test.price) / test.originalPrice) * 100
              );

              return (
                <View key={test.id} style={styles.testCard}>
                  {/* Top Badge Tag */}
                  {test.badge && (
                    <View style={styles.cardTopBadge}>
                      <Text style={styles.cardTopBadgeText}>{test.badge}</Text>
                    </View>
                  )}

                  {/* Header: Test Name & Lab Partner */}
                  <View style={styles.cardHeader}>
                    <View style={styles.headerMain}>
                      <Text style={styles.testTitle}>{test.name}</Text>
                      <Text style={styles.labPartner}>
                        🏥 {test.labName} • {test.distanceKm} km away
                      </Text>
                    </View>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingText}>★ {test.labRating}</Text>
                    </View>
                  </View>

                  {/* Accreditations Pill Strip */}
                  <View style={styles.accredStrip}>
                    {test.accreditations.map((acc, idx) => (
                      <View key={idx} style={styles.accredPill}>
                        <Text style={styles.accredPillText}>✓ {acc}</Text>
                      </View>
                    ))}
                    <View style={styles.paramPill}>
                      <Text style={styles.paramPillText}>
                        📊 {test.parametersCount} Parameters
                      </Text>
                    </View>
                  </View>

                  {/* Clinical Specifications Box */}
                  <View style={styles.specsBox}>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>🕒 Fasting:</Text>
                      <Text style={styles.specValue}>{test.fasting}</Text>
                    </View>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>🩸 Sample Type:</Text>
                      <Text style={styles.specValue}>{test.sampleType}</Text>
                    </View>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>⚡ Turnaround Time:</Text>
                      <Text style={styles.specValueHighlight}>{test.tat}</Text>
                    </View>
                  </View>

                  {/* Key Included Parameters Preview */}
                  <View style={styles.paramsPreviewBox}>
                    <Text style={styles.paramsPreviewTitle}>TESTS INCLUDED:</Text>
                    <View style={styles.paramsList}>
                      {test.keyParameters.map((param, pIdx) => (
                        <View key={pIdx} style={styles.paramBulletRow}>
                          <Text style={styles.bulletDot}>•</Text>
                          <Text style={styles.paramBulletText}>{param}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Bottom Price & Booking CTA */}
                  <View style={styles.cardFooter}>
                    <View style={styles.priceContainer}>
                      <View style={styles.priceRow}>
                        <Text style={styles.currentPrice}>{formatINR(test.price)}</Text>
                        <Text style={styles.originalPrice}>{formatINR(test.originalPrice)}</Text>
                      </View>
                      <Text style={styles.discountBadge}>{discountPercent}% SAVINGS</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.bookNowBtn}
                      onPress={() => handleOpenBooking(test)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.bookNowBtnText}>Book Test ›</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {filteredTests.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No Matching Diagnostic Tests</Text>
                <Text style={styles.emptySub}>
                  Try clearing filters or search for CBC, HbA1c, Thyroid, or Vitamin checkups.
                </Text>
                <Button
                  title="Reset All Filters"
                  variant="outline"
                  onPress={() => {
                    setSearch("");
                    setSelectedCategory("ALL");
                    setFilterFastReport(false);
                    setFilterHomeOnly(false);
                  }}
                  style={{ marginTop: 12 }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        /* 3. My Reports & Records Vault View */
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.reportsHeaderCard}>
            <View style={styles.vaultPill}>
              <Text style={styles.vaultPillText}>🔒 ABHA & DPDP Compliant Health Vault</Text>
            </View>
            <Text style={styles.reportsHeaderTitle}>Verified Pathology Reports</Text>
            <Text style={styles.reportsHeaderSub}>
              Digital lab reports delivered instantly to your WhatsApp & synced with DrGodly AI.
            </Text>
          </View>

          <View style={styles.reportsList}>
            {MOCK_PAST_REPORTS.map((rep) => {
              const isAttention = rep.status === "ATTENTION";
              return (
                <View key={rep.id} style={styles.reportCard}>
                  <View style={styles.reportTopRow}>
                    <View style={styles.reportIdentity}>
                      <Text style={styles.reportName}>{rep.testName}</Text>
                      <Text style={styles.reportLab}>{rep.labName}</Text>
                      <Text style={styles.reportMeta}>
                        📅 Sample Collected: {rep.date} • Ref: {rep.reportNumber}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusPill,
                        isAttention ? styles.statusPillAttention : styles.statusPillNormal,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          isAttention ? styles.statusPillTextAttention : styles.statusPillTextNormal,
                        ]}
                      >
                        {isAttention ? "⚠️ " + rep.statusText : "✓ " + rep.statusText}
                      </Text>
                    </View>
                  </View>

                  {/* Clinical Key Finding Card */}
                  <View style={styles.findingBox}>
                    <Text style={styles.findingLabel}>CLINICAL PATHOLOGY FINDING:</Text>
                    <Text style={styles.findingText}>{rep.keyFindings}</Text>
                    <Text style={styles.verifiedByText}>Verified By: {rep.verifiedBy}</Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.reportActionsRow}>
                    <TouchableOpacity
                      style={styles.downloadPdfBtn}
                      onPress={() => handleDownloadReport(rep)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.downloadPdfText}>📥 Download Signed PDF Report</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.consultDocBtn}
                      onPress={() =>
                        Alert.alert(
                          "Doctor Review Requested",
                          `Sharing ${rep.reportNumber} with on-duty Pharmacist and NMC Registered Physician.`
                        )
                      }
                      activeOpacity={0.8}
                    >
                      <Text style={styles.consultDocText}>🩺 Discuss with Doctor</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* 4. Interactive 2-Step Lab Sample Booking Modal */}
      <Modal
        visible={selectedTest !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTest(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {bookingStep === "SLOT" ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Modal Title */}
                <View style={styles.modalHeaderRow}>
                  <View>
                    <Text style={styles.modalStepBadge}>STEP 1 OF 2 • SAMPLE COLLECTION</Text>
                    <Text style={styles.modalTitle}>Schedule Lab Sample Pickup</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedTest(null)}
                    style={styles.modalCloseBtn}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Selected Test Summary Card */}
                {selectedTest && (
                  <View style={styles.modalSummaryCard}>
                    <Text style={styles.summaryTestName}>{selectedTest.name}</Text>
                    <Text style={styles.summaryLabName}>
                      🏥 {selectedTest.labName} • {selectedTest.tat} Report
                    </Text>
                    <View style={styles.summaryPriceRow}>
                      <Text style={styles.summaryPriceText}>
                        Total Payable: {formatINR(selectedTest.price)}
                      </Text>
                      <View style={styles.freePill}>
                        <Text style={styles.freePillText}>FREE Home Collection</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Patient Selection */}
                <Text style={styles.fieldLabel}>SELECT PATIENT:</Text>
                <View style={styles.optionList}>
                  {[
                    "Self: Rahul Sharma (34M)",
                    "Family: Ramesh Sharma (Father, 62M)",
                    "Family: Sita Sharma (Mother, 58F)",
                  ].map((p, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.selectOptionCard,
                        selectedPatient === p && styles.selectOptionCardActive,
                      ]}
                      onPress={() => setSelectedPatient(p)}
                    >
                      <Text style={styles.radioDot}>
                        {selectedPatient === p ? "🔘" : "⚪"}
                      </Text>
                      <Text style={styles.optionCardText}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Time Slot Selection */}
                <Text style={styles.fieldLabel}>CHOOSE COLLECTION TIME SLOT:</Text>
                <View style={styles.optionList}>
                  {[
                    "Tomorrow 06:30 AM - 07:30 AM (Fasting Preferred)",
                    "Tomorrow 08:00 AM - 09:00 AM (Fasting)",
                    "Tomorrow 10:30 AM - 11:30 AM",
                    "Today Express (within 45 mins) - Additional ₹99",
                  ].map((slot, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.selectOptionCard,
                        selectedSlot === slot && styles.selectOptionCardActive,
                      ]}
                      onPress={() => setSelectedSlot(slot)}
                    >
                      <Text style={styles.radioDot}>
                        {selectedSlot === slot ? "🔘" : "⚪"}
                      </Text>
                      <Text style={styles.optionCardText}>{slot}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Address Confirmation */}
                <Text style={styles.fieldLabel}>HOME COLLECTION ADDRESS:</Text>
                <View style={styles.addressInputCard}>
                  <TextInput
                    value={homeAddress}
                    onChangeText={setHomeAddress}
                    multiline
                    style={styles.addressInput}
                  />
                  <Text style={styles.addressHint}>
                    📍 Auto-detected GPS PIN 110001 (Connaught Place, New Delhi)
                  </Text>
                </View>

                {/* Safety Guarantee */}
                <View style={styles.safetyGuaranteeBox}>
                  <Text style={styles.safetyGuaranteeIcon}>🛡️</Text>
                  <Text style={styles.safetyGuaranteeText}>
                    Vaccinated Phlebotomist will arrive with sterile single-use vacuum collection tubes & cold-box temperature logger.
                  </Text>
                </View>

                {/* Confirmation Button */}
                <Button
                  title="Confirm & Book Sample Pickup ›"
                  variant="primary"
                  size="lg"
                  onPress={handleConfirmBooking}
                  style={{ width: "100%", marginTop: 16, marginBottom: 20 }}
                />
              </ScrollView>
            ) : (
              /* Step 2: Confirmed Screen */
              <View style={styles.confirmedContainer}>
                <View style={styles.confirmedIconBox}>
                  <Text style={styles.confirmedCheckIcon}>✓</Text>
                </View>

                <Text style={styles.confirmedTag}>REQUISITION SCHEDULED</Text>
                <Text style={styles.confirmedTitle}>Lab Sample Booking Confirmed!</Text>
                <Text style={styles.confirmedToken}>{bookingToken}</Text>

                <View style={styles.confirmedDetailsBox}>
                  <Text style={styles.confirmedDetailLine}>
                    <Text style={styles.boldText}>Test:</Text> {selectedTest?.name}
                  </Text>
                  <Text style={styles.confirmedDetailLine}>
                    <Text style={styles.boldText}>Lab:</Text> {selectedTest?.labName}
                  </Text>
                  <Text style={styles.confirmedDetailLine}>
                    <Text style={styles.boldText}>Patient:</Text> {selectedPatient}
                  </Text>
                  <Text style={styles.confirmedDetailLine}>
                    <Text style={styles.boldText}>Slot:</Text> {selectedSlot}
                  </Text>
                  <Text style={styles.confirmedDetailLine}>
                    <Text style={styles.boldText}>Pickup Address:</Text> {homeAddress}
                  </Text>
                </View>

                <View style={styles.whatsAppAlertBox}>
                  <Text style={styles.whatsAppAlertIcon}>💬</Text>
                  <Text style={styles.whatsAppAlertText}>
                    Appointment confirmation, fasting guide, and phlebotomist live-tracking link sent to your registered WhatsApp number.
                  </Text>
                </View>

                <Button
                  title="Done & View Diagnostic Hub"
                  variant="primary"
                  onPress={() => setSelectedTest(null)}
                  style={{ width: "100%", marginTop: 20 }}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    backgroundColor: "#FFFFFF",
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerLeft: {
    marginBottom: 10,
  },
  headerTag: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 2,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 3,
    marginTop: 4,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: borderRadius.sm,
  },
  switchBtnActive: {
    backgroundColor: "#FFFFFF",
    ...shadows.sm,
  },
  switchBtnText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.textMuted,
  },
  switchBtnTextActive: {
    color: colors.primary,
    fontWeight: "800",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    paddingHorizontal: 10,
    height: 42,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  quickFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  filterPill: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterPillActive: {
    backgroundColor: colors.blueLight,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.primary,
    fontWeight: "800",
  },
  categoryScroll: {
    paddingBottom: 10,
    gap: 8,
  },
  catPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  catPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  catPillTextActive: {
    color: "#FFFFFF",
  },
  trustStrip: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "space-between",
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  trustIcon: {
    fontSize: 18,
  },
  trustHeading: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  trustSub: {
    fontSize: 9.5,
    color: "#3B82F6",
  },
  trustDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#BFDBFE",
    marginHorizontal: 8,
  },
  testsGrid: {
    gap: 14,
  },
  testCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.sm,
    position: "relative",
    overflow: "hidden",
  },
  cardTopBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.yellowLight,
    borderBottomLeftRadius: borderRadius.md,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  cardTopBadgeText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#92400E",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 4,
  },
  headerMain: {
    flex: 1,
    paddingRight: 8,
  },
  testTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  labPartner: {
    fontSize: 11.5,
    color: colors.textSecondary,
    fontWeight: "600",
    marginTop: 3,
  },
  ratingBadge: {
    backgroundColor: colors.yellowLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#92400E",
  },
  accredStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginVertical: 10,
  },
  accredPill: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  accredPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#166534",
  },
  paramPill: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  paramPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  specsBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    gap: 4,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  specLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
  },
  specValue: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  specValueHighlight: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  paramsPreviewBox: {
    marginTop: 10,
    marginBottom: 10,
  },
  paramsPreviewTitle: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  paramsList: {
    gap: 3,
  },
  paramBulletRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bulletDot: {
    fontSize: 12,
    color: colors.primary,
    marginRight: 6,
  },
  paramBulletText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  priceContainer: {
    flexDirection: "column",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  currentPrice: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.greenSafe,
  },
  bookNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  bookNowBtnText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "800",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 4,
  },
  reportsHeaderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  vaultPill: {
    backgroundColor: "#F0FDF4",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginBottom: 6,
  },
  vaultPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#166534",
  },
  reportsHeaderTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  reportsHeaderSub: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.sm,
  },
  reportTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  reportIdentity: {
    flex: 1,
    paddingRight: 8,
  },
  reportName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  reportLab: {
    fontSize: 11.5,
    color: colors.textSecondary,
    fontWeight: "600",
    marginTop: 2,
  },
  reportMeta: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  statusPillNormal: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  statusPillAttention: {
    backgroundColor: colors.yellowLight,
    borderColor: "#FDE68A",
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: "800",
  },
  statusPillTextNormal: {
    color: "#166534",
  },
  statusPillTextAttention: {
    color: "#92400E",
  },
  findingBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    marginVertical: 10,
  },
  findingLabel: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  findingText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 16,
  },
  verifiedByText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    fontStyle: "italic",
  },
  reportActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  downloadPdfBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  downloadPdfText: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "800",
  },
  consultDocBtn: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  consultDocText: {
    color: colors.textPrimary,
    fontSize: 11.5,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    maxHeight: "90%",
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  modalStepBadge: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalCloseText: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: "700",
  },
  modalSummaryCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  summaryTestName: {
    fontSize: 13.5,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  summaryLabName: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summaryPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  summaryPriceText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  freePill: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  freePillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#166534",
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 6,
  },
  optionList: {
    gap: 6,
    marginBottom: 10,
  },
  selectOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  selectOptionCardActive: {
    backgroundColor: "#EFF6FF",
    borderColor: colors.primary,
  },
  radioDot: {
    fontSize: 13,
    marginRight: 8,
  },
  optionCardText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  addressInputCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
  },
  addressInput: {
    fontSize: 12,
    color: colors.textPrimary,
    minHeight: 44,
  },
  addressHint: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  safetyGuaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 8,
  },
  safetyGuaranteeIcon: {
    fontSize: 16,
  },
  safetyGuaranteeText: {
    fontSize: 11,
    color: "#166534",
    flex: 1,
    lineHeight: 15,
  },
  confirmedContainer: {
    alignItems: "center",
    paddingVertical: 14,
  },
  confirmedIconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  confirmedCheckIcon: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "900",
  },
  confirmedTag: {
    fontSize: 10,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.8,
  },
  confirmedTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 2,
  },
  confirmedToken: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
    backgroundColor: colors.blueLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginTop: 6,
    marginBottom: 14,
  },
  confirmedDetailsBox: {
    width: "100%",
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  confirmedDetailLine: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  boldText: {
    fontWeight: "800",
  },
  whatsAppAlertBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCF8C6",
    borderRadius: borderRadius.md,
    padding: 10,
    marginTop: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#86EFAC",
  },
  whatsAppAlertIcon: {
    fontSize: 16,
  },
  whatsAppAlertText: {
    fontSize: 11,
    color: "#065F46",
    flex: 1,
    lineHeight: 15,
  },
});
