import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from "react-native";
import { colors } from "../theme/colors";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";

interface PatientReportScreenProps {
  intakeData?: any;
  onBack?: () => void;
  onConsultDoctor?: () => void;
  onFindLabs?: () => void;
  navigation?: any;
  route?: { params?: any };
}

export function PatientReportScreen({
  intakeData: propData,
  onBack,
  onConsultDoctor,
  onFindLabs,
  navigation,
  route,
}: PatientReportScreenProps) {
  const intakeData = propData || route?.params?.intakeData || route?.params;
  const patientName = intakeData?.patientName || "Rajesh Kumar";
  const age = intakeData?.age || 42;
  const gender = intakeData?.gender || "Male";
  const complaint = intakeData?.chiefComplaint || "Epigastric burning & dyspepsia";
  const duration = intakeData?.duration || "2 Days";
  const severity = intakeData?.severity || 5;

  const handleBack = () => {
    if (onBack) onBack();
    else if (navigation?.goBack) navigation.goBack();
  };

  const handleConsultDoctor = () => {
    if (onConsultDoctor) onConsultDoctor();
    else if (navigation?.navigate) navigation.navigate("DoctorsTab");
  };

  const handleFindLabs = () => {
    if (onFindLabs) onFindLabs();
    else if (navigation?.navigate) navigation.navigate("LabsTab");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `DrGodly Pharmacy Health Summary (#DRG-2026-8812) for ${patientName} (${age}y/${gender}): ${complaint}. Prepared for licensed clinician review.`,
      });
    } catch (e) {}
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {(onBack || navigation?.goBack) && (
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </TouchableOpacity>
      )}

      {/* Report Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.reportTitle}>Clinical Intake Summary</Text>
            <Text style={styles.intakeId}>#DRG-2026-8812 • Verified Intake</Text>
          </View>
          <Badge label="🟡 YELLOW TRIAGE" variant="yellow" />
        </View>

        <View style={styles.patientMetaRow}>
          <Text style={styles.patientName}>
            {patientName}, {age}y / {gender}
          </Text>
          <Text style={styles.branchName}>Apollo Pharmacy Indiranagar</Text>
        </View>
      </View>

      {/* SBAR Section 1: Situation */}
      <View style={styles.sbarCard}>
        <View style={styles.sbarHeader}>
          <Text style={styles.sbarLetter}>S</Text>
          <Text style={styles.sbarTitle}>Situation (Chief Complaint)</Text>
        </View>
        <Text style={styles.sbarBody}>
          Patient presents with acute {complaint.toLowerCase()} persisting for{" "}
          {duration}. Severity rated as {severity}/10. Discomfort aggravates
          after oily or spicy meals; partial temporary relief with cold milk.
        </Text>
      </View>

      {/* SBAR Section 2: Background */}
      <View style={styles.sbarCard}>
        <View style={styles.sbarHeader}>
          <Text style={styles.sbarLetter}>B</Text>
          <Text style={styles.sbarTitle}>Background & Past History</Text>
        </View>
        <Text style={styles.sbarBody}>
          • Known Drug Allergies: No Known Drug Allergies (NKDA)
        </Text>
        <Text style={styles.sbarBody}>
          • Chronic Comorbidities: Nil reported (No HTN, No DM, No Renal disease)
        </Text>
        <Text style={styles.sbarBody}>
          • Current Daily Medications: None reported
        </Text>
      </View>

      {/* SBAR Section 3: Assessment & Safety Screening */}
      <View style={styles.sbarCard}>
        <View style={styles.sbarHeader}>
          <Text style={styles.sbarLetter}>A</Text>
          <Text style={styles.sbarTitle}>Assessment & Red Flag Rule-Out</Text>
        </View>
        <View style={styles.ruleOutBox}>
          <Text style={styles.ruleOutTitle}>Cleared Red Flags (Screened Negative):</Text>
          <Text style={styles.ruleOutItem}>✓ No radiating chest tightness or left arm pain (ACS Rule-Out)</Text>
          <Text style={styles.ruleOutItem}>✓ No hematemesis (coffee-ground vomiting) or melena</Text>
          <Text style={styles.ruleOutItem}>✓ No abdominal rigidity, peritoneal guarding, or high fever</Text>
        </View>
        <View style={styles.differentialBox}>
          <Text style={styles.diffHeading}>Preliminary Clinical Differentials (For RMP Review Only):</Text>
          <Text style={styles.diffItem}>1. Acute Non-Ulcer Dyspepsia (ICD-10: K30)</Text>
          <Text style={styles.diffItem}>2. Gastroesophageal Reflux Disease without esophagitis (ICD-10: K21.9)</Text>
        </View>
      </View>

      {/* SBAR Section 4: Recommendation */}
      <View style={styles.sbarCard}>
        <View style={styles.sbarHeader}>
          <Text style={styles.sbarLetter}>R</Text>
          <Text style={styles.sbarTitle}>Recommendation & Pharmacist Care</Text>
        </View>
        <Text style={styles.sbarBody}>
          • Permitted Self-Care Pathway: Non-systemic antacid oral suspension (Magaldrate + Simethicone, OTC) for up to 3 days.
        </Text>
        <Text style={styles.sbarBody}>
          • Dietary Guidance: Smaller frequent meals; avoid lying down within 2 hours of dining; restrict excess caffeine and chili.
        </Text>
        <Text style={styles.sbarBody}>
          • Red Flag Watch: Seek hospital care immediately if pain radiates to jaw/arm or stool turns black.
        </Text>
      </View>

      {/* Statutory Regulatory Disclaimer */}
      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerTitle}>
          ⚖️ Statutory Medical Disclaimer (NMC & CDSCO Compliance)
        </Text>
        <Text style={styles.disclaimerText}>
          DrGodly is an assistive clinical intake platform and does NOT provide an
          autonomous diagnosis or prescription. This health summary is prepared
          solely for qualified licensed healthcare professionals in compliance
          with the Telemedicine Practice Guidelines 2020 and CDSCO Drugs Rules 2026.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Button
          title="Share Report (WhatsApp / PDF) 📤"
          onPress={handleShare}
          style={styles.btn}
        />
        <Button
          title="Consult Telemedicine Doctor Now 👨‍⚕️"
          variant="secondary"
          onPress={handleConsultDoctor}
          style={styles.btn}
        />
        <Button
          title="Book Diagnostic Lab Tests Nearby 🧪"
          variant="outline"
          onPress={handleFindLabs}
          style={styles.btn}
        />
      </View>
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
  backBtn: {
    paddingVertical: 6,
    marginBottom: 8,
  },
  backBtnText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  intakeId: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  patientMetaRow: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 10,
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  patientName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  branchName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sbarCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  sbarHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sbarLetter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    textAlign: "center",
    lineHeight: 26,
    fontSize: 14,
    fontWeight: "800",
    marginRight: 8,
  },
  sbarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sbarBody: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
    marginBottom: 6,
  },
  ruleOutBox: {
    backgroundColor: colors.greenLight,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  ruleOutTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.greenSafe,
    marginBottom: 4,
  },
  ruleOutItem: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
    marginBottom: 2,
  },
  differentialBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 10,
  },
  diffHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 4,
  },
  diffItem: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  disclaimerBox: {
    backgroundColor: colors.orangeLight,
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.orangeUrgent,
    marginBottom: 20,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.orangeUrgent,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  actionsContainer: {
    marginTop: 4,
  },
  btn: {
    marginBottom: 10,
    height: 48,
  },
});
