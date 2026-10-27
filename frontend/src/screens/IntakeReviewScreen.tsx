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
import { MOCK_INTAKES, PharmacyIntakeRecord } from "../data/intakes";

interface IntakeReviewScreenProps {
  route?: { params?: { intakeId?: string } };
  navigation?: any;
}

export function IntakeReviewScreen({ route, navigation }: IntakeReviewScreenProps) {
  const intakeId = route?.params?.intakeId || "INTAKE-2026-0042";
  const intake: PharmacyIntakeRecord =
    MOCK_INTAKES.find((item) => item.intakeId === intakeId) || MOCK_INTAKES[0];

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleDispenseOTC = () => {
    Alert.alert(
      "Confirm CDSCO OTC Dispense",
      `Are you sure you want to approve and dispense the permitted OTC guidance for ${intake.patient.name}? Pharmacist license stamp will be recorded.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve & Dispense",
          onPress: () => {
            Alert.alert("Dispense Recorded", "Compliance audit trail updated with R.Ph signature.");
            navigation?.goBack ? navigation.goBack() : null;
          },
        },
      ]
    );
  };

  const handleReferDoctor = () => {
    if (navigation?.navigate) {
      navigation.navigate("ReferralWorkflow", { intakeId: intake.intakeId });
    }
  };

  const handleEmergencyEscalate = () => {
    if (navigation?.navigate) {
      navigation.navigate("SafetyEscalation", { intakeId: intake.intakeId });
    }
  };

  const getTriageBadgeColor = (level: string) => {
    switch (level) {
      case "RED":
        return { bg: colors.redLight, text: colors.redEmergency, label: "CRITICAL RED FLAG" };
      case "ORANGE":
        return { bg: colors.orangeLight, text: colors.orangeUrgent, label: "URGENT RMP REVIEW" };
      case "YELLOW":
        return { bg: colors.yellowLight, text: colors.yellowModerate, label: "MODERATE / OTC REVIEW" };
      case "GREEN":
      default:
        return { bg: colors.greenLight, text: colors.greenSafe, label: "ROUTINE CARE" };
    }
  };

  const badgeInfo = getTriageBadgeColor(intake.triageLevel);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.patientName}>{intake.patient.name}</Text>
              <Text style={styles.patientMeta}>
                {intake.patient.age} Y • {intake.patient.gender} • {intake.patient.phone}
              </Text>
              <Text style={styles.languagePill}>Language: {intake.patient.preferredLanguage}</Text>
            </View>
            <View style={[styles.triageBadge, { backgroundColor: badgeInfo.bg }]}>
              <Text style={[styles.triageBadgeText, { color: badgeInfo.text }]}>
                {badgeInfo.label}
              </Text>
            </View>
          </View>
          <Text style={styles.intakeIdText}>Case Ref: {intake.intakeId} • Recorded {intake.timestamp}</Text>
        </View>

        {/* Voice Recording Excerpt Player */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎙️ Voice Intake Audio & Live Transcript</Text>
          <View style={styles.audioPlayerRow}>
            <TouchableOpacity style={styles.playButton} onPress={toggleAudio}>
              <Text style={styles.playButtonText}>{isPlayingAudio ? "⏸ Pause" : "▶ Play Intake"}</Text>
            </TouchableOpacity>
            <View style={styles.audioWaveform}>
              <Text style={styles.audioTimerText}>{isPlayingAudio ? "Playing 0:14 / 0:42" : "Duration 0:42"}</Text>
              <View style={styles.waveformBars}>
                <View style={[styles.bar, { height: 16 }]} />
                <View style={[styles.bar, { height: 24, backgroundColor: colors.primary }]} />
                <View style={[styles.bar, { height: 12 }]} />
                <View style={[styles.bar, { height: 28, backgroundColor: colors.primary }]} />
                <View style={[styles.bar, { height: 18 }]} />
                <View style={[styles.bar, { height: 10 }]} />
              </View>
            </View>
          </View>
          <View style={styles.transcriptBox}>
            <Text style={styles.transcriptLabel}>Verbatim Patient Utterance:</Text>
            <Text style={styles.transcriptText}>"{intake.chiefComplaint}"</Text>
          </View>
        </View>

        {/* SBAR Clinical Report Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📋 Structured SBAR Clinical Summary</Text>
          
          <View style={styles.sbarItem}>
            <Text style={[styles.sbarLabel, { color: colors.primary }]}>S — Situation</Text>
            <Text style={styles.sbarContent}>{intake.sbarSummary.situation}</Text>
          </View>

          <View style={styles.sbarItem}>
            <Text style={[styles.sbarLabel, { color: colors.secondaryDark }]}>B — Background</Text>
            <Text style={styles.sbarContent}>{intake.sbarSummary.background}</Text>
          </View>

          <View style={styles.sbarItem}>
            <Text style={[styles.sbarLabel, { color: colors.yellowModerate }]}>A — Assessment</Text>
            <Text style={styles.sbarContent}>{intake.sbarSummary.assessment}</Text>
          </View>

          <View style={styles.sbarItem}>
            <Text style={[styles.sbarLabel, { color: colors.greenSafe }]}>R — Recommendation</Text>
            <Text style={styles.sbarContent}>{intake.sbarSummary.recommendation}</Text>
          </View>
        </View>

        {/* Red Flags Status */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🚩 Emergency Red Flag Screening</Text>
          {intake.redFlagsDetected && intake.redFlagsDetected.length > 0 ? (
            <View style={styles.redFlagAlert}>
              <Text style={styles.redFlagAlertTitle}>⚠️ Red Flags Detected:</Text>
              {intake.redFlagsDetected.map((rf, idx) => (
                <Text key={idx} style={styles.redFlagAlertItem}>• {rf}</Text>
              ))}
            </View>
          ) : (
            <View style={styles.safeFlagsBox}>
              <Text style={styles.safeFlagsText}>
                ✅ All 8 Emergency Red Flags Cleared (No chest pain, dyspnea, hematemesis, high fever above 103°F, altered sensorium)
              </Text>
            </View>
          )}
        </View>

        {/* Differential Diagnoses */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🧠 Preliminary Differential Diagnoses</Text>
          <Text style={styles.helperText}>
            For clinician review only. Not a definitive diagnosis.
          </Text>
          {intake.differentialDiagnoses.map((diff, index) => (
            <View key={index} style={styles.diffItem}>
              <View style={styles.diffHeader}>
                <Text style={styles.diffCondition}>{diff.condition}</Text>
                <View style={styles.diffIcdPill}>
                  <Text style={styles.diffIcdText}>ICD-10: {diff.icd10}</Text>
                </View>
              </View>
              <Text style={styles.diffProb}>Probability: <Text style={{ fontWeight: '700' }}>{diff.probability}</Text></Text>
              <Text style={styles.diffRationale}>{diff.rationale}</Text>
            </View>
          ))}
        </View>

        {/* CDSCO Formulary Options */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💊 CDSCO Permitted Formulary Guidance</Text>
          {intake.cdscoFormularyOptions.map((med, index) => {
            const isOTC = med.schedule === "OTC";
            return (
              <View key={index} style={styles.medItem}>
                <View style={styles.medHeader}>
                  <Text style={styles.medName}>{med.genericName}</Text>
                  <View style={[styles.schedBadge, { backgroundColor: isOTC ? colors.greenLight : colors.purpleLight }]}>
                    <Text style={[styles.schedBadgeText, { color: isOTC ? colors.greenSafe : colors.purpleRx }]}>
                      {med.schedule}
                    </Text>
                  </View>
                </View>
                <Text style={styles.medDetail}>Dosage: {med.dosage}</Text>
                <Text style={styles.medDetail}>Indication: {med.indication}</Text>
                <Text style={styles.medWarning}>⚠️ Warning: {med.warnings}</Text>
              </View>
            );
          })}
        </View>

        {/* Action Panel */}
        <View style={styles.actionCard}>
          <Text style={styles.actionCardTitle}>👨‍⚕️ Registered Pharmacist Clinical Decision</Text>
          
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.greenSafe }]}
            onPress={handleDispenseOTC}
          >
            <Text style={styles.actionBtnText}>✅ Approve Permitted OTC Guidance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={handleReferDoctor}
          >
            <Text style={styles.actionBtnText}>🩺 Refer to Registered Doctor (Tele-OPD)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.redEmergency }]}
            onPress={handleEmergencyEscalate}
          >
            <Text style={styles.actionBtnText}>🚨 Escalate Emergency Red Flag</Text>
          </TouchableOpacity>
        </View>

        {/* Statutory Footer */}
        <View style={styles.statutoryFooter}>
          <Text style={styles.statutoryText}>
            Adheres strictly to CDSCO Drugs Rules 2026 and Pharmacy Act 1948. Prescription medicines (Schedule H/H1) cannot be dispensed without a valid RMP prescription.
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
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  patientMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  languagePill: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 4,
  },
  triageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  triageBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  intakeIdText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  helperText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
    fontStyle: "italic",
  },
  audioPlayerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  playButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  audioWaveform: {
    flex: 1,
  },
  audioTimerText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  waveformBars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.cardBorder,
  },
  transcriptBox: {
    backgroundColor: "#FAF5FF",
    borderLeftWidth: 3,
    borderLeftColor: colors.purpleRx,
    padding: 10,
    borderRadius: 6,
  },
  transcriptLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.purpleRx,
    marginBottom: 2,
  },
  transcriptText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontStyle: "italic",
  },
  sbarItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
    paddingBottom: 8,
  },
  sbarLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3,
  },
  sbarContent: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  redFlagAlert: {
    backgroundColor: colors.redLight,
    borderWidth: 1,
    borderColor: colors.redEmergency,
    borderRadius: 8,
    padding: 12,
  },
  redFlagAlertTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.redEmergency,
    marginBottom: 4,
  },
  redFlagAlertItem: {
    fontSize: 12,
    color: colors.redEmergency,
    fontWeight: "600",
    lineHeight: 16,
  },
  safeFlagsBox: {
    backgroundColor: colors.greenLight,
    borderRadius: 8,
    padding: 10,
  },
  safeFlagsText: {
    fontSize: 12,
    color: colors.greenSafe,
    fontWeight: "600",
  },
  diffItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingBottom: 8,
    marginBottom: 8,
  },
  diffHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  diffCondition: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  diffIcdPill: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  diffIcdText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  diffProb: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  diffRationale: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  medItem: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  medHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  medName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },
  schedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  schedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  medDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  medWarning: {
    fontSize: 11,
    color: colors.yellowModerate,
    marginTop: 4,
    fontWeight: "500",
  },
  actionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  actionBtn: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  statutoryFooter: {
    paddingHorizontal: 8,
    alignItems: "center",
  },
  statutoryText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
});
