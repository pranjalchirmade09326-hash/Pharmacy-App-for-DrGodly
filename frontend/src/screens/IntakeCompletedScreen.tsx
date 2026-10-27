import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";

interface IntakeCompletedScreenProps {
  intakeData?: any;
  onViewReport: () => void;
  onConsultDoctor: () => void;
  onHome: () => void;
}

export function IntakeCompletedScreen({
  intakeData,
  onViewReport,
  onConsultDoctor,
  onHome,
}: IntakeCompletedScreenProps) {
  const patientName = intakeData?.patientName || "Rajesh Kumar";
  const complaint = intakeData?.chiefComplaint || "Epigastric burning & acidity";
  const duration = intakeData?.duration || "2 Days";
  const triage = intakeData?.triageLevel || "YELLOW";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Animation Header */}
      <View style={styles.successIconCircle}>
        <Text style={styles.successCheck}>✓</Text>
      </View>
      <Text style={styles.title}>Intake Completed!</Text>
      <Text style={styles.subtitle}>
        Your symptom summary has been recorded and safely transmitted to the counter pharmacist.
      </Text>

      {/* Reference Card */}
      <View style={styles.refCard}>
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>Intake Reference ID</Text>
          <Text style={styles.refCode}>#DRG-2026-8812</Text>
        </View>
        <View style={styles.refDivider} />
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>Pharmacy Branch</Text>
          <Text style={styles.refValue}>Apollo Pharmacy Indiranagar</Text>
        </View>
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>Patient Name</Text>
          <Text style={styles.refValue}>{patientName}</Text>
        </View>
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>Reported Complaint</Text>
          <Text style={styles.refValue}>{complaint} ({duration})</Text>
        </View>
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>Clinical Triage Status</Text>
          <Badge
            label={triage === "RED" ? "EMERGENCY ALERT" : "PHARMACIST CARE REVIEW"}
            variant={triage === "RED" ? "danger" : "warning"}
          />
        </View>
      </View>

      {/* WhatsApp Tracker Card */}
      <View style={styles.whatsAppCard}>
        <View style={styles.waHeader}>
          <Text style={styles.waIcon}>💬</Text>
          <Text style={styles.waTitle}>WhatsApp Delivery Tracker</Text>
        </View>
        <Text style={styles.waDesc}>
          Official summary notification dispatched to your mobile (+91 98XXX-XX210).
        </Text>
        <View style={styles.waStatusBadge}>
          <Text style={styles.waStatusText}>✓✓ Delivered to Device</Text>
        </View>
      </View>

      {/* Counter Walkthrough Instruction */}
      <View style={styles.instructionsCard}>
        <Text style={styles.stepTitle}>Next Immediate Step at Counter:</Text>
        <Text style={styles.stepText}>
          1. Walk to the pharmacy counter and inform the pharmacist.
        </Text>
        <Text style={styles.stepText}>
          2. The pharmacist has received your SBAR summary on their dashboard.
        </Text>
        <Text style={styles.stepText}>
          3. They will review safety rules and provide appropriate care or connect you with a doctor.
        </Text>
      </View>

      {/* Action Buttons */}
      <Button
        title="View Full SBAR Health Report 📄"
        onPress={onViewReport}
        style={styles.actionBtn}
      />
      <Button
        title="Connect to Doctor Consultation 👨‍⚕️"
        variant="secondary"
        onPress={onConsultDoctor}
        style={styles.actionBtn}
      />
      <Button
        title="Back to Pharmacy Counter Home"
        variant="outline"
        onPress={onHome}
        style={styles.actionBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    alignItems: "center",
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.greenLight,
    borderWidth: 3,
    borderColor: colors.greenSafe,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 14,
  },
  successCheck: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.greenSafe,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 20,
    lineHeight: 18,
    marginBottom: 20,
  },
  refCard: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  refRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  refLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  refValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  refCode: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  refDivider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: 6,
  },
  whatsAppCard: {
    width: "100%",
    backgroundColor: colors.secondaryLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginBottom: 16,
  },
  waHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  waIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  waTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.secondaryDark,
  },
  waDesc: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
    marginBottom: 8,
  },
  waStatusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  waStatusText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.greenSafe,
  },
  instructionsCard: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  stepText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 16,
  },
  actionBtn: {
    width: "100%",
    marginBottom: 10,
    height: 48,
  },
});
