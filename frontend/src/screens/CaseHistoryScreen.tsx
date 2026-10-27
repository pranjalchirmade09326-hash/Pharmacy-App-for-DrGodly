import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { colors } from "../theme/colors";
import { MOCK_INTAKES } from "../data/intakes";

const HISTORICAL_CASES = [
  ...MOCK_INTAKES,
  {
    intakeId: "INTAKE-2026-0039",
    timestamp: "Yesterday, 6:15 PM",
    patient: {
      name: "Amitabh Banerjee",
      age: 52,
      gender: "MALE" as const,
      phone: "+919711223344",
      preferredLanguage: "Bengali",
    },
    triageLevel: "GREEN" as const,
    chiefComplaint: "Mild throat irritation and seasonal dry cough after commuting.",
    sbarSummary: {
      situation: "52-year-old male with mild dry tickle in throat for 24 hours.",
      background: "Exposure to urban smog. Non-smoker. No fever or dysphagia.",
      assessment: "Simple upper airway irritation. No red flags.",
      recommendation: "Warm water gargles, herbal lozenges, OTC Dextromethorphan syrup.",
    },
    differentialDiagnoses: [],
    investigationsRecommended: [],
    cdscoFormularyOptions: [],
    redFlagsDetected: [],
    status: "PHARMACIST_DISPENSED" as const,
  },
  {
    intakeId: "INTAKE-2026-0038",
    timestamp: "Yesterday, 3:30 PM",
    patient: {
      name: "Meenakshi Sundaram",
      age: 29,
      gender: "FEMALE" as const,
      phone: "+919443322110",
      preferredLanguage: "Tamil",
    },
    triageLevel: "ORANGE" as const,
    chiefComplaint: "Severe flank pain radiating to groin with nausea.",
    sbarSummary: {
      situation: "29-year-old female presenting with acute colicky right flank pain.",
      background: "Low fluid intake during summer. Prior episode of renal calculus 2 years ago.",
      assessment: "Suspected acute ureteric colic / nephrolithiasis.",
      recommendation: "Immediate referral to urologist / emergency ultrasound KUB.",
    },
    differentialDiagnoses: [],
    investigationsRecommended: [],
    cdscoFormularyOptions: [],
    redFlagsDetected: ["Severe unremitting colicky pain"],
    status: "REFERRED_TO_DOCTOR" as const,
  },
];

export function CaseHistoryScreen({ navigation }: { navigation?: any }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  const filteredCases = HISTORICAL_CASES.filter((item) => {
    const matchesSearch =
      item.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.intakeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patient.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (selectedFilter === "ALL") return true;
    if (selectedFilter === "DISPENSED") return item.status === "PHARMACIST_DISPENSED";
    if (selectedFilter === "REFERRED") return item.status === "REFERRED_TO_DOCTOR";
    if (selectedFilter === "EMERGENCY") return item.triageLevel === "RED" || item.status === "ESCALATED_EMERGENCY";
    return true;
  });

  const getStatusBadge = (status: string, triageLevel: string) => {
    if (triageLevel === "RED") {
      return { bg: colors.redLight, text: colors.redEmergency, label: "EMERGENCY 108" };
    }
    if (status === "REFERRED_TO_DOCTOR") {
      return { bg: colors.primaryLight, text: colors.primary, label: "DOCTOR REFERRED" };
    }
    if (status === "PHARMACIST_DISPENSED") {
      return { bg: colors.greenLight, text: colors.greenSafe, label: "OTC DISPENSED" };
    }
    return { bg: colors.yellowLight, text: colors.yellowModerate, label: "UNDER REVIEW" };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Audit Log & Case History</Text>
          <Text style={styles.subtitle}>
            CDSCO & Pharmacy Act compliance log of all processed clinical intakes
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by patient name, phone, or intake ID..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {["ALL", "DISPENSED", "REFERRED", "EMERGENCY"].map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Cases List */}
        <ScrollView contentContainerStyle={styles.listContainer}>
          {filteredCases.map((c) => {
            const badge = getStatusBadge(c.status, c.triageLevel);
            return (
              <TouchableOpacity
                key={c.intakeId}
                style={styles.caseCard}
                onPress={() => {
                  if (navigation?.navigate) {
                    navigation.navigate("IntakeReview", { intakeId: c.intakeId });
                  }
                }}
              >
                <View style={styles.caseHeader}>
                  <View>
                    <Text style={styles.patientName}>{c.patient.name}</Text>
                    <Text style={styles.patientMeta}>
                      {c.patient.age} Y • {c.patient.gender} • {c.patient.phone}
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>

                <Text style={styles.complaintText} numberOfLines={2}>
                  "{c.chiefComplaint}"
                </Text>

                <View style={styles.complianceFoot}>
                  <Text style={styles.caseRef}>{c.intakeId} • {c.timestamp}</Text>
                  <Text style={styles.signStamp}>✓ R.Ph Signed</Text>
                </View>
              </TouchableOpacity>
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
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 44,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  filterTextSelected: {
    color: "#FFFFFF",
  },
  listContainer: {
    paddingBottom: 24,
  },
  caseCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
  },
  caseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  patientMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  complaintText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  complianceFoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 6,
  },
  caseRef: {
    fontSize: 11,
    color: colors.textMuted,
  },
  signStamp: {
    fontSize: 11,
    color: colors.greenSafe,
    fontWeight: "600",
  },
});
