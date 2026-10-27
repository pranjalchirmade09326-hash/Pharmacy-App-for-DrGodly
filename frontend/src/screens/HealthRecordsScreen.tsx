import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { colors } from "../theme/colors";

const MOCK_RECORDS = [
  {
    id: "REC-2026-01",
    title: "Tele-OPD e-Prescription",
    doctor: "Dr. Rajesh Gupta, MD (Internal Medicine)",
    facility: "Apollo Telehealth / DrGodly",
    date: "27 Oct 2026",
    type: "PRESCRIPTION",
    badgeColor: colors.purpleRx,
    badgeBg: colors.purpleLight,
    summary: "Augmentin 625mg BD, Paracetamol 650mg SOS for Community-Acquired Pneumonia.",
  },
  {
    id: "REC-2026-02",
    title: "Diagnostic Lab Report (NABL)",
    doctor: "Dr. Lal PathLabs Reference Lab",
    facility: "NABL Accredited Lab #MC-2041",
    date: "24 Oct 2026",
    type: "LAB_REPORT",
    badgeColor: colors.primary,
    badgeBg: colors.primaryLight,
    summary: "Complete Blood Count (CBC) & HbA1c. Hb: 13.8 g/dL, TLC: 11,200 /uL, HbA1c: 5.9%.",
  },
  {
    id: "REC-2026-03",
    title: "Retail Pharmacy Intake SBAR",
    doctor: "Arun K. Verma, R.Ph",
    facility: "Apollo Pharmacy - Connaught Place",
    date: "27 Oct 2026",
    type: "SBAR_SUMMARY",
    badgeColor: colors.greenSafe,
    badgeBg: colors.greenLight,
    summary: "Voice Intake DRG-2026-8812. Acid Peptic Disease. Magaldrate + Simethicone OTC dispensed.",
  },
];

export function HealthRecordsScreen({ navigation }: { navigation?: any }) {
  const [selectedType, setSelectedType] = useState("ALL");
  const [abhaLinked, setAbhaLinked] = useState(true);

  const filteredRecords = MOCK_RECORDS.filter((rec) => {
    if (selectedType === "ALL") return true;
    if (selectedType === "RX") return rec.type === "PRESCRIPTION";
    if (selectedType === "LABS") return rec.type === "LAB_REPORT";
    if (selectedType === "SBAR") return rec.type === "SBAR_SUMMARY";
    return true;
  });

  const handleUploadRecord = () => {
    Alert.alert(
      "Upload Health Document",
      "Choose upload source:",
      [
        { text: "Camera (Take Photo of Rx)", onPress: () => Alert.alert("Camera Opened", "Captured document encrypted and saved.") },
        { text: "Document Gallery / PDF", onPress: () => Alert.alert("Document Selected", "File parsed and added to your health vault.") },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleAbhaToggle = () => {
    if (abhaLinked) {
      Alert.alert(
        "Unlink ABHA ID?",
        "Unlinking will disconnect your Ayushman Bharat Digital Mission (ABDM) electronic health records.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Unlink", style: "destructive", onPress: () => setAbhaLinked(false) },
        ]
      );
    } else {
      setAbhaLinked(true);
      Alert.alert("ABHA Linked", "Successfully authenticated with ABDM via Aadhaar OTP.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Health Records & ABHA Vault</Text>
          <Text style={styles.subtitle}>
            Secure, encrypted medical records vault compliant with DPDP Act 2023 & ABDM
          </Text>
        </View>

        {/* ABHA Card */}
        <View style={styles.abhaCard}>
          <View style={styles.abhaHeader}>
            <View>
              <Text style={styles.abhaTitle}>Ayushman Bharat Health Account</Text>
              <Text style={styles.abhaNumber}>
                {abhaLinked ? "ABHA ID: 91-8821-4402-9102" : "ABHA Not Linked"}
              </Text>
              <Text style={styles.abhaHolder}>Patient: Rahul Sharma • rahulsharma@abdm</Text>
            </View>
            <View style={[styles.abhaBadge, { backgroundColor: abhaLinked ? colors.greenLight : colors.yellowLight }]}>
              <Text style={[styles.abhaBadgeText, { color: abhaLinked ? colors.greenSafe : colors.yellowModerate }]}>
                {abhaLinked ? "✓ Linked" : "! Inactive"}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.abhaLinkBtn} onPress={handleAbhaToggle}>
            <Text style={styles.abhaLinkBtnText}>
              {abhaLinked ? "Manage ABDM Consent" : "Link ABHA via Aadhaar"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Upload Button */}
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadRecord}>
          <Text style={styles.uploadBtnText}>📷 Upload Prescription or Lab Report</Text>
        </TouchableOpacity>

        {/* Filters */}
        <View style={styles.filterRow}>
          {[
            { id: "ALL", label: "All Records" },
            { id: "RX", label: "Prescriptions" },
            { id: "LABS", label: "Lab Reports" },
            { id: "SBAR", label: "Intake Summaries" },
          ].map((f) => {
            const isSelected = selectedType === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => setSelectedType(f.id)}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Records List */}
        <View style={styles.recordsList}>
          {filteredRecords.map((item) => (
            <View key={item.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordTitle}>{item.title}</Text>
                <View style={[styles.typeBadge, { backgroundColor: item.badgeBg }]}>
                  <Text style={[styles.typeBadgeText, { color: item.badgeColor }]}>
                    {item.type}
                  </Text>
                </View>
              </View>

              <Text style={styles.recordFacility}>{item.doctor} • {item.facility}</Text>
              <Text style={styles.recordSummary}>{item.summary}</Text>

              <View style={styles.recordFooter}>
                <Text style={styles.recordDate}>Recorded: {item.date}</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      item.title,
                      `Viewing encrypted document ${item.id}.\n\nIssued by: ${item.facility}\n\n${item.summary}`
                    )
                  }
                >
                  <Text style={styles.viewDocLink}>View Document ›</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>🔒 DPDP Act 2023 Health Data Sovereignty</Text>
          <Text style={styles.privacyText}>
            You have full ownership of your clinical records. No pharmacy or hospital can access your files without your explicit OTP authorization. You can revoke access at any time.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 14,
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
  abhaCard: {
    backgroundColor: "#172B4D",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  abhaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  abhaTitle: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },
  abhaNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 4,
  },
  abhaHolder: {
    fontSize: 11,
    color: "#CBD5E1",
    marginTop: 2,
  },
  abhaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  abhaBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  abhaLinkBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  abhaLinkBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  uploadBtn: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: "dashed",
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  uploadBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
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
  recordsList: {
    gap: 10,
    marginBottom: 16,
  },
  recordCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: "800",
  },
  recordFacility: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  recordSummary: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
    marginBottom: 8,
  },
  recordFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
  },
  recordDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  viewDocLink: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  privacyCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
    padding: 12,
  },
  privacyTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  privacyText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
});
