import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { borderRadius, shadows, spacing } from "../theme/spacing";

export interface DoctorInboxItem {
  referralId: string;
  urgency: "URGENT" | "ROUTINE";
  receivedTime: string;
  patient: {
    name: string;
    age: number;
    gender: string;
    phone: string;
    language: string;
    vitalsSummary?: string;
  };
  pharmacy: {
    name: string;
    pharmacist: string;
    phone: string;
  };
  chiefComplaint: string;
  sbarSituation: string;
  sbarAssessment: string;
  recommendedRx: string;
}

const DOCTOR_INBOX_CASES: DoctorInboxItem[] = [
  {
    referralId: "REF-NMC-2026-9142",
    urgency: "URGENT",
    receivedTime: "3 mins ago",
    patient: {
      name: "Sunita Patel",
      age: 48,
      gender: "FEMALE",
      phone: "+919812345678",
      language: "Gujarati / Hindi",
      vitalsSummary: "BP: 130/84 • SpO2: 98% • Temp: 99.8°F",
    },
    pharmacy: {
      name: "Apollo Pharmacy, Connaught Place",
      pharmacist: "R.Ph Sandeep M. (Reg: DL-PH-2015-8812)",
      phone: "+919876543210",
    },
    chiefComplaint: "High fever 102.4°F with productive cough for 4 days and pleuritic pain.",
    sbarSituation: "48-year-old female presenting with high-grade pyrexia and lower respiratory signs.",
    sbarAssessment: "Suspected Community-Acquired Pneumonia (CAP) or Acute Bronchitis. Rule out consolidation.",
    recommendedRx: "Requires Schedule H antibiotic (Amoxicillin-Clavulanate 625mg) and chest radiograph.",
  },
  {
    referralId: "REF-NMC-2026-9288",
    urgency: "URGENT",
    receivedTime: "12 mins ago",
    patient: {
      name: "Sunita Devi",
      age: 52,
      gender: "FEMALE",
      phone: "+919833445566",
      language: "Bhojpuri / Hindi",
      vitalsSummary: "BP: 142/88 • GRBS: 248 mg/dL • Temp: 99.1°F",
    },
    pharmacy: {
      name: "Apollo Pharmacy, Connaught Place",
      pharmacist: "R.Ph Sandeep M. (Reg: DL-PH-2015-8812)",
      phone: "+919876543210",
    },
    chiefComplaint: "Non-healing diabetic blister on right great toe with purulent exudate.",
    sbarSituation: "52-year-old female with uncontrolled diabetes presenting with Wagner Grade 1 neuropathic plantar ulcer.",
    sbarAssessment: "Diabetic Foot Ulcer with localized soft tissue infection and sensory neuropathy.",
    recommendedRx: "Urgent culture-directed oral antibiotics, surgical offloading dressing, and glycemic control.",
  },
  {
    referralId: "REF-NMC-2026-9350",
    urgency: "URGENT",
    receivedTime: "24 mins ago",
    patient: {
      name: "Priya Nair",
      age: 28,
      gender: "FEMALE",
      phone: "+919744556677",
      language: "Malayalam / English",
      vitalsSummary: "BP: 106/68 • Pulse: 88 • Temp: 98.2°F",
    },
    pharmacy: {
      name: "MedPlus Pharmacy, Koramangala",
      pharmacist: "R.Ph Divya K. (Reg: KA-4019)",
      phone: "+919845012345",
    },
    chiefComplaint: "Severe intractable vomiting at 8 weeks gestation with inability to retain fluids.",
    sbarSituation: "28-year-old primigravida with persistent hyperemesis (>6 times/day).",
    sbarAssessment: "Hyperemesis Gravidarum with impending dehydration. Teratogenic screening required.",
    recommendedRx: "Schedule H Doxylamine + Pyridoxine signoff, oral hydration, and urine ketone test.",
  },
  {
    referralId: "REF-NMC-2026-8821",
    urgency: "ROUTINE",
    receivedTime: "36 mins ago",
    patient: {
      name: "Karan Johar",
      age: 31,
      gender: "MALE",
      phone: "+919922334455",
      language: "Hindi / English",
      vitalsSummary: "BP: 118/76 • SpO2: 99%",
    },
    pharmacy: {
      name: "MedPlus Pharmacy, Koramangala",
      pharmacist: "R.Ph Divya K. (Reg: KA-4019)",
      phone: "+919845012345",
    },
    chiefComplaint: "Bilateral itchy red eyes with purulent discharge waking up in morning.",
    sbarSituation: "31-year-old male with acute conjunctivitis symptoms for 48 hours.",
    sbarAssessment: "Acute bacterial conjunctivitis. Needs Schedule H ophthalmic drops.",
    recommendedRx: "Moxifloxacin 0.5% eye drops (1 drop 3 times daily for 5 days).",
  },
  {
    referralId: "REF-NMC-2026-7734",
    urgency: "ROUTINE",
    receivedTime: "52 mins ago",
    patient: {
      name: "Geeta Ramachandran",
      age: 62,
      gender: "FEMALE",
      phone: "+919445566778",
      language: "Tamil",
      vitalsSummary: "BP: 134/82 • Pulse: 76",
    },
    pharmacy: {
      name: "Sanjivani Chemist, Dadar West",
      pharmacist: "R.Ph Rahul T. (Reg: MH-9021)",
      phone: "+919820011223",
    },
    chiefComplaint: "Knee osteoarthritis flare-up; routine paracetamol not relieving pain.",
    sbarSituation: "62-year-old known OA knee with acute worsening of weight-bearing pain.",
    sbarAssessment: "Osteoarthritis exacerbation. Needs short-course prescription NSAID and gastric protection.",
    recommendedRx: "Aceclofenac 100mg + Paracetamol 325mg with Pantoprazole 40mg.",
  },
];

export function DoctorReferralInboxScreen({ navigation }: { navigation?: any }) {
  const [inboxList, setInboxList] = useState(DOCTOR_INBOX_CASES);
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "URGENT" | "ROUTINE">("ALL");

  const filteredCases = inboxList.filter((item) => {
    if (selectedFilter === "ALL") return true;
    return item.urgency === selectedFilter;
  });

  const handleStartConsultation = (referral: any) => {
    if (navigation?.navigate) {
      navigation.navigate("ClinicalAssessment", {
        referralId: referral.referralId,
        referral,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.doctorBadge}>
              <Text style={styles.doctorBadgeText}>NMC RMP TELE-OPD CONSOLE</Text>
            </View>
            <View style={styles.livePulse}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>ON-CALL</Text>
            </View>
          </View>
          <Text style={styles.title}>Doctor Telemedicine Referrals</Text>
          <Text style={styles.subtitle}>
            Inbound SBAR cases from counter pharmacies requiring RMP evaluation & e-Prescriptions
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{inboxList.length}</Text>
            <Text style={styles.statLabel}>Pending Queue</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: colors.orangeUrgent }]}>
              {inboxList.filter((i) => i.urgency === "URGENT").length}
            </Text>
            <Text style={styles.statLabel}>Urgent Cases</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: colors.greenSafe }]}>14</Text>
            <Text style={styles.statLabel}>Consulted Today</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: colors.primary }]}>&lt; 3.2m</Text>
            <Text style={styles.statLabel}>Avg Wait Time</Text>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {[
            { key: "ALL" as const, label: `All Referrals (${inboxList.length})` },
            {
              key: "URGENT" as const,
              label: `⚡ Urgent (${inboxList.filter((i) => i.urgency === "URGENT").length})`,
            },
            {
              key: "ROUTINE" as const,
              label: `Routine (${inboxList.filter((i) => i.urgency === "ROUTINE").length})`,
            },
          ].map((tab) => {
            const isSelected = selectedFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setSelectedFilter(tab.key)}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List of Referral Cards */}
        <ScrollView
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredCases.map((item) => {
            const isUrgent = item.urgency === "URGENT";
            return (
              <View key={item.referralId} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.urgencyPill,
                      {
                        backgroundColor: isUrgent ? colors.orangeLight : colors.blueLight,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.urgencyText,
                        { color: isUrgent ? colors.orangeUrgent : colors.primary },
                      ]}
                    >
                      {isUrgent ? "⚡ URGENT TELE-OPD" : "📋 ROUTINE CONSULT"}
                    </Text>
                  </View>
                  <Text style={styles.receivedTime}>{item.receivedTime}</Text>
                </View>

                {/* Patient Profile */}
                <View style={styles.patientRow}>
                  <Text style={styles.patientName}>{item.patient.name}</Text>
                  <Text style={styles.patientMeta}>
                    {item.patient.age} Y • {item.patient.gender} • {item.patient.language}
                  </Text>
                </View>

                {/* Vitals Summary Strip */}
                {item.patient.vitalsSummary && (
                  <View style={styles.vitalsPillBox}>
                    <Text style={styles.vitalsPillText}>
                      📊 Counter Vitals: {item.patient.vitalsSummary}
                    </Text>
                  </View>
                )}

                {/* Pharmacy Handoff Badge */}
                <View style={styles.pharmacyBadge}>
                  <Text style={styles.pharmacyText}>
                    📍 Handoff from:{" "}
                    <Text style={{ fontWeight: "800", color: colors.textPrimary }}>
                      {item.pharmacy.name}
                    </Text>
                  </Text>
                  <Text style={styles.pharmacistSub}>{item.pharmacy.pharmacist}</Text>
                </View>

                {/* Chief Complaint */}
                <Text style={styles.complaintText}>&ldquo;{item.chiefComplaint}&rdquo;</Text>

                {/* SBAR Clinical Formulations */}
                <View style={styles.sbarPreview}>
                  <Text style={styles.sbarLabel}>PHARMACIST SBAR ASSESSMENT:</Text>
                  <Text style={styles.sbarText}>{item.sbarAssessment}</Text>
                </View>

                <View style={styles.rxPreview}>
                  <Text style={styles.rxLabel}>SUGGESTED PRESCRIPTION INTERVENTION:</Text>
                  <Text style={styles.rxText}>{item.recommendedRx}</Text>
                </View>

                {/* Action CTA */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.consultBtn}
                    onPress={() => handleStartConsultation(item)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.consultBtnText}>
                      📹 Accept Referral & Launch Video Consultation ›
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 14,
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
    ...shadows.sm,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  doctorBadge: {
    backgroundColor: colors.blueLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  doctorBadgeText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  livePulse: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.greenSafe,
    marginRight: 4,
  },
  liveText: {
    fontSize: 9.5,
    fontWeight: "900",
    color: colors.greenSafe,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 8,
    alignItems: "center",
  },
  statNum: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: "600",
    textAlign: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },
  filterPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: "#FFFFFF",
  },
  listContainer: {
    paddingBottom: 30,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  urgencyPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  receivedTime: {
    fontSize: 10.5,
    color: colors.textMuted,
    fontWeight: "600",
  },
  patientRow: {
    marginBottom: 6,
  },
  patientName: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  patientMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  vitalsPillBox: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 8,
  },
  vitalsPillText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  pharmacyBadge: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 8,
    marginBottom: 8,
  },
  pharmacyText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  pharmacistSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  complaintText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontStyle: "italic",
    marginBottom: 8,
    lineHeight: 16,
  },
  sbarPreview: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 8,
    marginBottom: 6,
  },
  sbarLabel: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  sbarText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  rxPreview: {
    backgroundColor: "#EFF6FF",
    borderRadius: borderRadius.md,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  rxLabel: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#1E40AF",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  rxText: {
    fontSize: 11.5,
    color: "#1E3A8A",
    fontWeight: "600",
    lineHeight: 15,
  },
  buttonRow: {
    marginTop: 2,
  },
  consultBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  consultBtnText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "800",
  },
});
