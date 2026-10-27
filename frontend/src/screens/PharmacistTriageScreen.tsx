import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MOCK_INTAKES, PharmacyIntakeRecord } from "../data/intakes";
import { colors } from "../theme/colors";
import { borderRadius } from "../theme/spacing";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { EmergencyModal } from "../components/EmergencyModal";

interface PharmacistTriageScreenProps {
  navigation?: any;
}

export function PharmacistTriageScreen({ navigation }: PharmacistTriageScreenProps) {
  const [selectedIntake, setSelectedIntake] = useState<PharmacyIntakeRecord>(
    MOCK_INTAKES[0]
  );
  const [isEmergencyModalVisible, setIsEmergencyModalVisible] = useState(false);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const handleAction = (type: "DISPENSE" | "REFER_DOCTOR" | "LABS" | "EMERGENCY") => {
    if (type === "EMERGENCY") {
      setIsEmergencyModalVisible(true);
      return;
    }

    if (type === "DISPENSE") {
      setActionStatus("Approved: Safe OTC medications dispensed per CDSCO 2026 guidelines.");
      Alert.alert(
        "Pharmacist Dispense Signed",
        `Dispense authorized for ${selectedIntake.patient.name}. Verified WhatsApp summary sent.`
      );
    } else if (type === "REFER_DOCTOR") {
      setActionStatus("Escalated: Teleconsultation scheduled with on-call NMC General Physician.");
      Alert.alert(
        "Teleconsultation Scheduled",
        `Patient ${selectedIntake.patient.name} referred to RMP video consultation.`
      );
    } else if (type === "LABS") {
      setActionStatus("Order Placed: Diagnostic lab requisition generated with nearby Thyrocare/Dr Lal center.");
      Alert.alert(
        "Diagnostic Labs Ordered",
        `Requisition for ${selectedIntake.investigationsRecommended.map((i) => i.testName).join(", ")} dispatched to patient WhatsApp.`
      );
    }
  };

  const getTriageVariant = (level: string) => {
    switch (level) {
      case "RED":
        return "red";
      case "ORANGE":
        return "orange";
      case "YELLOW":
        return "yellow";
      case "GREEN":
      default:
        return "green";
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Pharmacist Station Header */}
      <View style={styles.stationHeader}>
        <View style={styles.stationInfo}>
          <Text style={styles.stationTitle}>Pharmacist Clinical Console</Text>
          <Text style={styles.licenseNo}>
            Logged in: <Text style={styles.bold}>RPh. Sandeep M. (Reg: DL-PH-2015-8812)</Text>
          </Text>
          <TouchableOpacity
            onPress={() => navigation?.navigate && navigation.navigate("CaseHistory")}
            style={{ marginTop: 4 }}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>
              📜 View Full Audit Logs & Case History ›
            </Text>
          </TouchableOpacity>
          <Text style={{ display: 'none' }}>
          </Text>
        </View>
        <Badge label="Active Station" variant="green" />
      </View>

      {/* Patient Intake Queue Selector (Horizontal Cards) */}
      <View style={styles.queueSection}>
        <Text style={styles.sectionHeading}>Active Patient Intakes Queue ({MOCK_INTAKES.length})</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.queueScroll}
          contentContainerStyle={styles.queueContent}
        >
          {MOCK_INTAKES.map((intake) => {
            const isSelected = intake.intakeId === selectedIntake.intakeId;
            return (
              <TouchableOpacity
                key={intake.intakeId}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedIntake(intake);
                  setActionStatus(null);
                }}
                style={[
                  styles.queueCard,
                  isSelected && styles.queueCardSelected,
                  intake.triageLevel === "RED" && styles.redBorder,
                ]}
              >
                <View style={styles.queueCardHeader}>
                  <Badge
                    label={intake.triageLevel}
                    variant={getTriageVariant(intake.triageLevel)}
                  />
                  <Text style={styles.queueTime}>{intake.timestamp}</Text>
                </View>

                <Text style={styles.queueName} numberOfLines={1}>
                  {intake.patient.name}
                </Text>
                <Text style={styles.queueMeta}>
                  {intake.patient.age}y • {intake.patient.gender}
                </Text>

                <Text style={styles.queueComplaint} numberOfLines={2}>
                  &ldquo;{intake.chiefComplaint}&rdquo;
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Critical Red Flag Alert Banner if RED */}
      {selectedIntake.triageLevel === "RED" && (
        <View style={styles.criticalAlertCard}>
          <Text style={styles.criticalAlertTitle}>🚨 CRITICAL EMERGENCY TRIAGE DETECTED</Text>
          <Text style={styles.criticalAlertDesc}>
            Symptoms indicate Acute Coronary Syndrome (ACS / Unstable Angina). Immediate 108 call required.
          </Text>
          <TouchableOpacity
            onPress={() => setIsEmergencyModalVisible(true)}
            style={styles.emergencyBannerBtn}
          >
            <Text style={styles.emergencyBannerBtnText}>Open 108 Emergency Protocol ›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Clinical SBAR Detail Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>1. Structured SBAR Clinical Summary</Text>
          <Badge
            label={`${selectedIntake.triageLevel} TRIAGE`}
            variant={getTriageVariant(selectedIntake.triageLevel)}
          />
        </View>

        <View style={styles.sbarRow}>
          <Text style={styles.sbarLabel}>S (Situation):</Text>
          <Text style={styles.sbarVal}>{selectedIntake.sbarSummary.situation}</Text>
        </View>

        <View style={styles.sbarRow}>
          <Text style={styles.sbarLabel}>B (Background):</Text>
          <Text style={styles.sbarVal}>{selectedIntake.sbarSummary.background}</Text>
        </View>

        <View style={styles.sbarRow}>
          <Text style={styles.sbarLabel}>A (Assessment):</Text>
          <Text style={styles.sbarVal}>{selectedIntake.sbarSummary.assessment}</Text>
        </View>

        <View style={styles.sbarRow}>
          <Text style={styles.sbarLabel}>R (Recommendation):</Text>
          <Text style={styles.sbarVal}>{selectedIntake.sbarSummary.recommendation}</Text>
        </View>
      </View>

      {/* Differential Hypotheses Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>2. AI Differential Hypotheses (ICD-10)</Text>
        {selectedIntake.differentialDiagnoses.map((diff, idx) => (
          <View key={idx} style={styles.diffItem}>
            <View style={styles.diffTop}>
              <Text style={styles.diffCondition}>{diff.condition}</Text>
              <Badge
                label={`${diff.probability} PROBABILITY`}
                variant={diff.probability === "HIGH" ? "blue" : "slate"}
              />
            </View>
            <Text style={styles.diffIcd}>ICD-10 Code: {diff.icd10}</Text>
            <Text style={styles.diffRationale}>{diff.rationale}</Text>
          </View>
        ))}
      </View>

      {/* CDSCO Formulary Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>3. CDSCO 2026 Deterministic Formulary</Text>
        <Text style={styles.cardSub}>
          Medications mapped against Indian central gazette scheduling:
        </Text>

        {selectedIntake.cdscoFormularyOptions.map((form, idx) => (
          <View key={idx} style={styles.formItem}>
            <View style={styles.formTop}>
              <Text style={styles.formGeneric}>{form.genericName}</Text>
              <Badge
                label={form.schedule}
                variant={form.schedule === "OTC" ? "green" : "purple"}
              />
            </View>
            <Text style={styles.formIndication}>Indication: {form.indication}</Text>
            <Text style={styles.formDosage}>Dosage: {form.dosage}</Text>
            <Text style={styles.formWarning}>⚠️ {form.warnings}</Text>
          </View>
        ))}
      </View>

      {/* Pharmacist Actions Matrix */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>4. Pharmacist Action & Verification</Text>
        <Text style={styles.cardSub}>
          Select appropriate clinical intervention to sign off and dispatch report:
        </Text>

        {actionStatus && (
          <View style={styles.actionStatusBar}>
            <Text style={styles.actionStatusText}>✓ {actionStatus}</Text>
          </View>
        )}

        <View style={styles.actionButtonsCol}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primaryLight,
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.primary,
              alignItems: "center",
              marginBottom: 10,
            }}
            onPress={() => navigation?.navigate && navigation.navigate("IntakeReview", { intakeId: selectedIntake.intakeId })}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary }}>
              🔍 Open Detailed Clinical Review & Audio Player ›
            </Text>
          </TouchableOpacity>
          {selectedIntake.triageLevel !== "RED" ? (
            <>
              <Button
                title="💊 Dispense Safe CDSCO OTC Relief"
                variant="success"
                size="md"
                onPress={() => handleAction("DISPENSE")}
              />

              <Button
                title="🩺 Escalate to Telemedicine Doctor"
                variant="primary"
                size="md"
                onPress={() => handleAction("REFER_DOCTOR")}
              />

              <Button
                title="🔬 Order Diagnostic Lab Requisition"
                variant="outline"
                size="md"
                onPress={() => handleAction("LABS")}
              />
            </>
          ) : (
            <Button
              title="🚨 TRIGGER EMERGENCY 108 PROTOCOL NOW"
              variant="danger"
              size="lg"
              onPress={() => handleAction("EMERGENCY")}
            />
          )}
        </View>
      </View>

      {/* Emergency Red Flag Modal */}
      <EmergencyModal
        visible={isEmergencyModalVisible}
        onClose={() => setIsEmergencyModalVisible(false)}
        patientName={`${selectedIntake.patient.name} (${selectedIntake.patient.age}y)`}
        reason={selectedIntake.redFlagsDetected.join(" • ") || "Critical cardiovascular or respiratory red flag"}
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
  },
  stationHeader: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  stationInfo: {
    flex: 1,
  },
  stationTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  licenseNo: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bold: {
    fontWeight: "700",
  },
  queueSection: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  queueScroll: {
    flexGrow: 0,
  },
  queueContent: {
    gap: 10,
  },
  queueCard: {
    width: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  queueCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  redBorder: {
    borderColor: colors.redEmergency,
  },
  queueCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  queueTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  queueName: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  queueMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  queueComplaint: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: "italic",
    marginTop: 6,
    lineHeight: 15,
  },
  criticalAlertCard: {
    backgroundColor: colors.redLight,
    borderWidth: 2,
    borderColor: colors.redEmergency,
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 14,
  },
  criticalAlertTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.redEmergency,
  },
  criticalAlertDesc: {
    fontSize: 12,
    color: "#7F1D1D",
    marginTop: 2,
    marginBottom: 10,
    lineHeight: 16,
  },
  emergencyBannerBtn: {
    backgroundColor: colors.redEmergency,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.sm,
    alignItems: "center",
  },
  emergencyBannerBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  cardSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 10,
  },
  sbarRow: {
    marginBottom: 8,
  },
  sbarLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primaryDark,
    marginBottom: 1,
  },
  sbarVal: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  diffItem: {
    backgroundColor: colors.surfaceMuted,
    padding: 10,
    borderRadius: borderRadius.md,
    marginBottom: 8,
  },
  diffTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  diffCondition: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  diffIcd: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 2,
  },
  diffRationale: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  formItem: {
    backgroundColor: colors.surfaceMuted,
    padding: 10,
    borderRadius: borderRadius.md,
    marginBottom: 8,
  },
  formTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formGeneric: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  formIndication: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  formDosage: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryDark,
    marginTop: 2,
  },
  formWarning: {
    fontSize: 10,
    color: "#B45309",
    marginTop: 3,
  },
  actionStatusBar: {
    backgroundColor: colors.greenLight,
    padding: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    marginBottom: 10,
  },
  actionStatusText: {
    fontSize: 12,
    color: "#065F46",
    fontWeight: "700",
  },
  actionButtonsCol: {
    gap: 8,
  },
});
