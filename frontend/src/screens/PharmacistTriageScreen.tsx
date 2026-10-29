import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { MOCK_INTAKES, PharmacyIntakeRecord } from "../data/intakes";
import { colors } from "../theme/colors";
import { borderRadius, shadows, spacing } from "../theme/spacing";
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
  const [filterLevel, setFilterLevel] = useState<"ALL" | "RED" | "ORANGE" | "YELLOW">("ALL");
  const [isEmergencyModalVisible, setIsEmergencyModalVisible] = useState(false);
  const [isWhatsAppModalVisible, setIsWhatsAppModalVisible] = useState(false);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const filteredQueue = MOCK_INTAKES.filter((i) => {
    if (filterLevel === "ALL") return true;
    return i.triageLevel === filterLevel;
  });

  const handleAction = (type: "DISPENSE" | "REFER_DOCTOR" | "LABS" | "EMERGENCY") => {
    if (type === "EMERGENCY") {
      setIsEmergencyModalVisible(true);
      return;
    }

    if (type === "DISPENSE") {
      setActionStatus(
        `Authorized & Dispensed: CDSCO OTC Formulary assigned to ${selectedIntake.patient.name}. Batch & R.Ph audit logged.`
      );
      Alert.alert(
        "Pharmacist Counter Dispense Signed",
        `Dispense approved under CDSCO OTC guidelines for ${selectedIntake.patient.name}. Digital WhatsApp summary & advice dispatched.`
      );
    } else if (type === "REFER_DOCTOR") {
      setActionStatus(
        `Escalated: High-priority RMP Teleconsultation request forwarded to Doctor Referral Inbox.`
      );
      Alert.alert(
        "Teleconsultation Dispatched",
        `Patient ${selectedIntake.patient.name} placed in on-call RMP General Physician queue. Wait SLA: < 3.5 mins.`
      );
    } else if (type === "LABS") {
      setActionStatus(
        `Diagnostic Requisition Generated: Pre-ordered tests forwarded to Diagnostic Pathology Hub.`
      );
      if (navigation?.navigate) {
        navigation.navigate("LabsTab");
      }
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

  const vitals = selectedIntake.vitals;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* 1. Pharmacist Station Header Banner */}
      <View style={styles.stationHeader}>
        <View style={styles.stationInfo}>
          <View style={styles.dutyPill}>
            <View style={styles.dutyDot} />
            <Text style={styles.dutyText}>CLINICAL CONSOLE • ONLINE</Text>
          </View>
          <Text style={styles.stationTitle}>Pharmacist Counter Triage</Text>
          <Text style={styles.licenseNo}>
            Logged in: <Text style={styles.bold}>R.Ph. Sandeep M.</Text> • Reg:{" "}
            <Text style={styles.bold}>DL-PH-2015-8812</Text>
          </Text>
          <View style={styles.quickNavRow}>
            <TouchableOpacity
              onPress={() => navigation?.navigate && navigation.navigate("CaseHistory")}
              style={styles.quickNavLink}
            >
              <Text style={styles.quickNavText}>📜 Audit Logs & History ›</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation?.navigate && navigation.navigate("SafetyEscalation")}
              style={styles.quickNavLink}
            >
              <Text style={styles.quickNavTextEmergency}>🚨 108 Emergency SLA Logs ›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 2. Queue Urgency Filter Tabs */}
      <View style={styles.queueHeaderBar}>
        <Text style={styles.sectionHeading}>
          Live Intake Queue ({MOCK_INTAKES.length} Patients Waiting)
        </Text>
        <View style={styles.filterTabsRow}>
          {[
            { key: "ALL" as const, label: `All (${MOCK_INTAKES.length})` },
            {
              key: "RED" as const,
              label: `Red (${MOCK_INTAKES.filter((i) => i.triageLevel === "RED").length})`,
            },
            {
              key: "ORANGE" as const,
              label: `Orange (${MOCK_INTAKES.filter((i) => i.triageLevel === "ORANGE").length})`,
            },
            {
              key: "YELLOW" as const,
              label: `Yellow (${MOCK_INTAKES.filter((i) => i.triageLevel === "YELLOW").length})`,
            },
          ].map((tab) => {
            const isSelected = filterLevel === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setFilterLevel(tab.key)}
                style={[styles.filterTabPill, isSelected && styles.filterTabPillActive]}
              >
                <Text
                  style={[
                    styles.filterTabPillText,
                    isSelected && styles.filterTabPillTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Horizontal Queue Scroll Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.queueScroll}
        contentContainerStyle={styles.queueContent}
      >
        {filteredQueue.map((intake) => {
          const isSelected = intake.intakeId === selectedIntake.intakeId;
          const isRed = intake.triageLevel === "RED";
          return (
            <TouchableOpacity
              key={intake.intakeId}
              activeOpacity={0.85}
              onPress={() => {
                setSelectedIntake(intake);
                setActionStatus(null);
              }}
              style={[
                styles.queueCard,
                isSelected && styles.queueCardSelected,
                isRed && styles.redBorderCard,
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
                {intake.patient.age}y • {intake.patient.gender} • {intake.patient.preferredLanguage}
              </Text>

              <Text style={styles.queueComplaint} numberOfLines={2}>
                &ldquo;{intake.chiefComplaint}&rdquo;
              </Text>

              {intake.redFlagsDetected.length > 0 && (
                <View style={styles.queueRedFlagTag}>
                  <Text style={styles.queueRedFlagText}>
                    ⚠️ {intake.redFlagsDetected.length} Red Flag
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 4. Critical Red Flag Alert Banner if RED */}
      {selectedIntake.triageLevel === "RED" && (
        <View style={styles.criticalAlertCard}>
          <View style={styles.criticalAlertHeader}>
            <Text style={styles.criticalAlertIcon}>🚨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.criticalAlertTitle}>
                CRITICAL EMERGENCY RED FLAG TRIGGERED
              </Text>
              <Text style={styles.criticalAlertDesc}>
                Acute life-threatening symptoms detected (Suspected ACS / Myocardial Infarction).
                Counter OTC dispensing is STRICTLY PROHIBITED.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setIsEmergencyModalVisible(true)}
            style={styles.emergencyBannerBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.emergencyBannerBtnText}>
              📞 Initiate 108 Ambulance Dispatch & Pre-Hospital Protocol ›
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 5. Patient Identity & Live Vitals Strip */}
      <View style={styles.card}>
        <View style={styles.patientProfileRow}>
          <View style={styles.patientAvatarBox}>
            <Text style={styles.patientAvatarText}>
              {selectedIntake.patient.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.patientProfileInfo}>
            <View style={styles.patientNameLine}>
              <Text style={styles.patientTitleName}>{selectedIntake.patient.name}</Text>
              <Badge
                label={`${selectedIntake.triageLevel} PRIORITY`}
                variant={getTriageVariant(selectedIntake.triageLevel)}
              />
            </View>
            <Text style={styles.patientSubInfo}>
              Age: {selectedIntake.patient.age} yrs • Gender: {selectedIntake.patient.gender} •
              Language: {selectedIntake.patient.preferredLanguage} • ID: {selectedIntake.intakeId}
            </Text>
          </View>
        </View>

        {/* Vitals Grid Strip */}
        <Text style={styles.vitalsTitle}>COUNTER VITALS & SCREENING METRICS:</Text>
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalCard}>
            <Text style={styles.vitalLabel}>BLOOD PRESSURE</Text>
            <Text
              style={[
                styles.vitalValue,
                vitals?.bp?.includes("158") || vitals?.bp?.includes("142")
                  ? styles.vitalAlert
                  : styles.vitalNormal,
              ]}
            >
              {vitals?.bp || "120/80"}
            </Text>
            <Text style={styles.vitalUnit}>mmHg (Arm)</Text>
          </View>

          <View style={styles.vitalCard}>
            <Text style={styles.vitalLabel}>PULSE / HR</Text>
            <Text
              style={[
                styles.vitalValue,
                (vitals?.pulse || 72) > 100 ? styles.vitalAlert : styles.vitalNormal,
              ]}
            >
              {vitals?.pulse || "--"}
            </Text>
            <Text style={styles.vitalUnit}>BPM (Radial)</Text>
          </View>

          <View style={styles.vitalCard}>
            <Text style={styles.vitalLabel}>SPO2 OXYGEN</Text>
            <Text
              style={[
                styles.vitalValue,
                (vitals?.spo2 || 99) < 95 ? styles.vitalDanger : styles.vitalNormal,
              ]}
            >
              {vitals?.spo2 || 99}%
            </Text>
            <Text style={styles.vitalUnit}>Room Air</Text>
          </View>

          <View style={styles.vitalCard}>
            <Text style={styles.vitalLabel}>TEMP</Text>
            <Text
              style={[
                styles.vitalValue,
                vitals?.temp?.includes("101") ? styles.vitalAlert : styles.vitalNormal,
              ]}
            >
              {vitals?.temp || "98.4°F"}
            </Text>
            <Text style={styles.vitalUnit}>Oral</Text>
          </View>

          <View style={styles.vitalCard}>
            <Text style={styles.vitalLabel}>BLOOD SUGAR</Text>
            <Text
              style={[
                styles.vitalValue,
                vitals?.grbs?.includes("248") ? styles.vitalDanger : styles.vitalNormal,
              ]}
            >
              {vitals?.grbs || "Normal"}
            </Text>
            <Text style={styles.vitalUnit}>Counter GRBS</Text>
          </View>
        </View>
      </View>

      {/* 6. Regulatory Guardrails & Red Flags */}
      {selectedIntake.redFlagsDetected.length > 0 && (
        <View style={styles.guardrailCard}>
          <Text style={styles.guardrailTitle}>
            🛡️ CDSCO 2026 REGULATORY GUARDRAILS & WARNINGS
          </Text>
          {selectedIntake.redFlagsDetected.map((rf, idx) => (
            <View key={idx} style={styles.guardrailItem}>
              <Text style={styles.guardrailBullet}>⚠️</Text>
              <Text style={styles.guardrailText}>{rf}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 7. Clinical SBAR Detail Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Structured SBAR Clinical Formulation</Text>
          <TouchableOpacity
            onPress={() => setIsWhatsAppModalVisible(true)}
            style={styles.whatsAppPreviewBtn}
          >
            <Text style={styles.whatsAppPreviewBtnText}>💬 WhatsApp SBAR ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sbarItem}>
          <View style={styles.sbarBadgeBox}>
            <Text style={styles.sbarLetter}>S</Text>
            <Text style={styles.sbarWord}>Situation</Text>
          </View>
          <Text style={styles.sbarBodyText}>{selectedIntake.sbarSummary.situation}</Text>
        </View>

        <View style={styles.sbarItem}>
          <View style={styles.sbarBadgeBox}>
            <Text style={styles.sbarLetter}>B</Text>
            <Text style={styles.sbarWord}>Background</Text>
          </View>
          <Text style={styles.sbarBodyText}>{selectedIntake.sbarSummary.background}</Text>
        </View>

        <View style={styles.sbarItem}>
          <View style={styles.sbarBadgeBox}>
            <Text style={styles.sbarLetter}>A</Text>
            <Text style={styles.sbarWord}>Assessment</Text>
          </View>
          <Text style={styles.sbarBodyText}>{selectedIntake.sbarSummary.assessment}</Text>
        </View>

        <View style={styles.sbarItem}>
          <View style={styles.sbarBadgeBox}>
            <Text style={styles.sbarLetter}>R</Text>
            <Text style={styles.sbarWord}>Recommendation</Text>
          </View>
          <Text style={styles.sbarBodyText}>{selectedIntake.sbarSummary.recommendation}</Text>
        </View>
      </View>

      {/* 8. Differential Hypotheses (ICD-10) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Differential Hypotheses & ICD-10 Coding</Text>
        {selectedIntake.differentialDiagnoses.map((diff, idx) => (
          <View key={idx} style={styles.diffItem}>
            <View style={styles.diffTop}>
              <Text style={styles.diffCondition}>{diff.condition}</Text>
              <Badge
                label={`${diff.probability} LIKELIHOOD`}
                variant={diff.probability === "HIGH" ? "blue" : "slate"}
              />
            </View>
            <Text style={styles.diffIcd}>ICD-10 Code: {diff.icd10}</Text>
            <Text style={styles.diffRationale}>{diff.rationale}</Text>
          </View>
        ))}
      </View>

      {/* 9. CDSCO Formulary Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>CDSCO 2026 Deterministic Formulary Mapping</Text>
        <Text style={styles.cardSub}>
          Formulations checked against Central Gazette Scheduling & Pediatric FDC Rules:
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

      {/* 10. Recommended Diagnostic Labs */}
      {selectedIntake.investigationsRecommended.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recommended Diagnostic Investigations</Text>
            <TouchableOpacity onPress={() => handleAction("LABS")}>
              <Text style={{ fontSize: 11, fontWeight: "800", color: colors.primary }}>
                Book at Partner Lab ›
              </Text>
            </TouchableOpacity>
          </View>
          {selectedIntake.investigationsRecommended.map((inv, idx) => (
            <View key={idx} style={styles.invRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.invName}>🔬 {inv.testName}</Text>
                <Text style={styles.invRationale}>{inv.rationale}</Text>
              </View>
              <Badge
                label={inv.urgency}
                variant={inv.urgency === "STAT" ? "red" : inv.urgency === "URGENT" ? "orange" : "blue"}
              />
            </View>
          ))}
        </View>
      )}

      {/* 11. Pharmacist Action & Verification Matrix */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pharmacist Clinical Action & Digital Sign-Off</Text>
        <Text style={styles.cardSub}>
          Select verified intervention to sign off and transmit report to patient:
        </Text>

        {actionStatus && (
          <View style={styles.actionStatusBar}>
            <Text style={styles.actionStatusText}>✓ {actionStatus}</Text>
          </View>
        )}

        <View style={styles.actionButtonsCol}>
          <TouchableOpacity
            style={styles.reviewAudioBtn}
            onPress={() =>
              navigation?.navigate &&
              navigation.navigate("IntakeReview", { intakeId: selectedIntake.intakeId })
            }
            activeOpacity={0.8}
          >
            <Text style={styles.reviewAudioBtnText}>
              🎙️ Open Audio Player & Full Transcript Review ›
            </Text>
          </TouchableOpacity>

          {selectedIntake.triageLevel !== "RED" ? (
            <>
              <Button
                title="💊 Dispense Safe CDSCO OTC Medication"
                variant="success"
                size="md"
                onPress={() => handleAction("DISPENSE")}
              />

              <Button
                title="🩺 Escalate to Telemedicine Doctor (RMP)"
                variant="primary"
                size="md"
                onPress={() => handleAction("REFER_DOCTOR")}
              />

              <Button
                title="🔬 Generate Diagnostic Lab Requisition"
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

      {/* WhatsApp SBAR Preview Modal */}
      <Modal
        visible={isWhatsAppModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsWhatsAppModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.whatsAppModalCard}>
            <View style={styles.whatsAppModalHeader}>
              <Text style={styles.whatsAppModalTitle}>💬 WhatsApp SBAR Summary Preview</Text>
              <TouchableOpacity onPress={() => setIsWhatsAppModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.whatsAppMessageBox}>
              <Text style={styles.whatsAppHeaderMsg}>
                🏥 *DrGodly Pharmacy Assist — Clinical Intake Summary*
              </Text>
              <Text style={styles.whatsAppBodyMsg}>
                Dear {selectedIntake.patient.name}, here is your digital consultation record from Apollo Pharmacy Counter.
              </Text>
              <Text style={styles.whatsAppDivider}>--------------------------------</Text>
              <Text style={styles.whatsAppMsgLine}>
                *Token:* {selectedIntake.intakeId} | *Triage:* {selectedIntake.triageLevel}
              </Text>
              <Text style={styles.whatsAppMsgLine}>
                *Situation:* {selectedIntake.sbarSummary.situation}
              </Text>
              <Text style={styles.whatsAppMsgLine}>
                *Assessment:* {selectedIntake.sbarSummary.assessment}
              </Text>
              <Text style={styles.whatsAppMsgLine}>
                *Recommended Care:* {selectedIntake.sbarSummary.recommendation}
              </Text>
              <Text style={styles.whatsAppDivider}>--------------------------------</Text>
              <Text style={styles.whatsAppFooterMsg}>
                Verified by Registered Pharmacist (R.Ph Sandeep M.). Consult Registered Medical Practitioner if symptoms persist.
              </Text>
            </ScrollView>

            <Button
              title="Close Preview"
              variant="primary"
              onPress={() => setIsWhatsAppModalVisible(false)}
              style={{ width: "100%", marginTop: 14 }}
            />
          </View>
        </View>
      </Modal>

      {/* Emergency Red Flag Modal */}
      <EmergencyModal
        visible={isEmergencyModalVisible}
        onClose={() => setIsEmergencyModalVisible(false)}
        patientName={`${selectedIntake.patient.name} (${selectedIntake.patient.age}y)`}
        reason={
          selectedIntake.redFlagsDetected.join(" • ") ||
          "Critical cardiovascular or respiratory emergency"
        }
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
    padding: 14,
    paddingBottom: 40,
  },
  stationHeader: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
    ...shadows.sm,
  },
  stationInfo: {
    flex: 1,
  },
  dutyPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  dutyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  dutyText: {
    fontSize: 9.5,
    fontWeight: "900",
    color: "#166534",
    letterSpacing: 0.5,
  },
  stationTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  licenseNo: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bold: {
    fontWeight: "800",
    color: colors.textPrimary,
  },
  quickNavRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  quickNavLink: {
    paddingVertical: 2,
  },
  quickNavText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  quickNavTextEmergency: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.redEmergency,
  },
  queueHeaderBar: {
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  filterTabsRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  filterTabPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterTabPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  filterTabPillTextActive: {
    color: "#FFFFFF",
  },
  queueScroll: {
    marginBottom: 14,
  },
  queueContent: {
    gap: 10,
    paddingVertical: 4,
  },
  queueCard: {
    width: 210,
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.sm,
  },
  queueCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: "#F0F9FF",
  },
  redBorderCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.redEmergency,
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
    fontWeight: "600",
  },
  queueName: {
    fontSize: 13.5,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  queueMeta: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 1,
    marginBottom: 4,
  },
  queueComplaint: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: "italic",
    lineHeight: 14,
  },
  queueRedFlagTag: {
    backgroundColor: "#FEF2F2",
    borderRadius: borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  queueRedFlagText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.redEmergency,
  },
  criticalAlertCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.redEmergency,
    marginBottom: 14,
  },
  criticalAlertHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  criticalAlertIcon: {
    fontSize: 22,
  },
  criticalAlertTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.redEmergency,
    letterSpacing: -0.2,
  },
  criticalAlertDesc: {
    fontSize: 11.5,
    color: "#991B1B",
    marginTop: 2,
    lineHeight: 15,
  },
  emergencyBannerBtn: {
    backgroundColor: colors.redEmergency,
    borderRadius: borderRadius.md,
    paddingVertical: 9,
    alignItems: "center",
    marginTop: 10,
  },
  emergencyBannerBtnText: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
    ...shadows.sm,
  },
  patientProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  patientAvatarBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  patientAvatarText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  patientProfileInfo: {
    flex: 1,
  },
  patientNameLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  patientTitleName: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  patientSubInfo: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  vitalsTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  vitalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  vitalCard: {
    flex: 1,
    minWidth: 65,
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 8,
    alignItems: "center",
  },
  vitalLabel: {
    fontSize: 8.5,
    fontWeight: "800",
    color: colors.textMuted,
    textAlign: "center",
  },
  vitalValue: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2,
    textAlign: "center",
  },
  vitalNormal: {
    color: colors.textPrimary,
  },
  vitalAlert: {
    color: "#D97706",
  },
  vitalDanger: {
    color: colors.redEmergency,
  },
  vitalUnit: {
    fontSize: 8.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  guardrailCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: 14,
  },
  guardrailTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#B45309",
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  guardrailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 4,
  },
  guardrailBullet: {
    fontSize: 12,
  },
  guardrailText: {
    fontSize: 11,
    color: "#78350F",
    fontWeight: "600",
    flex: 1,
    lineHeight: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  cardSub: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 8,
  },
  whatsAppPreviewBtn: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  whatsAppPreviewBtnText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#166534",
  },
  sbarItem: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 8,
  },
  sbarBadgeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  sbarLetter: {
    backgroundColor: colors.primary,
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    width: 18,
    height: 18,
    textAlign: "center",
    borderRadius: 9,
    lineHeight: 18,
  },
  sbarWord: {
    fontSize: 11.5,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  sbarBodyText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  diffItem: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 8,
  },
  diffTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  diffCondition: {
    fontSize: 12.5,
    fontWeight: "800",
    color: colors.textPrimary,
    flex: 1,
  },
  diffIcd: {
    fontSize: 10.5,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 2,
  },
  diffRationale: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 15,
  },
  formItem: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 8,
  },
  formTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formGeneric: {
    fontSize: 12.5,
    fontWeight: "800",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  formIndication: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },
  formDosage: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 2,
  },
  formWarning: {
    fontSize: 10.5,
    color: "#92400E",
    marginTop: 2,
  },
  invRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 6,
  },
  invName: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  invRationale: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  reviewAudioBtn: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    marginBottom: 10,
  },
  reviewAudioBtnText: {
    fontSize: 12.5,
    fontWeight: "800",
    color: colors.primary,
  },
  actionStatusBar: {
    backgroundColor: "#F0FDF4",
    padding: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginBottom: 10,
  },
  actionStatusText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#166534",
  },
  actionButtonsCol: {
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    padding: 16,
  },
  whatsAppModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 16,
    maxHeight: "80%",
  },
  whatsAppModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  whatsAppModalTitle: {
    fontSize: 14.5,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  modalCloseText: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: "800",
  },
  whatsAppMessageBox: {
    backgroundColor: "#E5DDD5",
    borderRadius: borderRadius.md,
    padding: 12,
  },
  whatsAppHeaderMsg: {
    fontSize: 12,
    fontWeight: "800",
    color: "#128C7E",
    marginBottom: 6,
  },
  whatsAppBodyMsg: {
    fontSize: 11.5,
    color: "#1F2937",
    marginBottom: 6,
  },
  whatsAppDivider: {
    fontSize: 10,
    color: "#9CA3AF",
    marginVertical: 4,
  },
  whatsAppMsgLine: {
    fontSize: 11.5,
    color: "#1F2937",
    marginBottom: 4,
    lineHeight: 16,
  },
  whatsAppFooterMsg: {
    fontSize: 10.5,
    color: "#4B5563",
    fontStyle: "italic",
    marginTop: 6,
  },
});
