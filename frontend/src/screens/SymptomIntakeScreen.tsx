import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { colors } from "../theme/colors";
import { borderRadius, shadows } from "../theme/spacing";
import { Button } from "../components/Button";

interface SymptomIntakeScreenProps {
  onSubmit?: (data: any) => void;
  onBack?: () => void;
  navigation?: any;
  route?: any;
}

export function SymptomIntakeScreen({
  onSubmit,
  onBack,
  navigation,
  route,
}: SymptomIntakeScreenProps) {
  const [patientName, setPatientName] = useState("Rajesh Kumar");
  const [age, setAge] = useState("42");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [isPregnant, setIsPregnant] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState("Acidity & Burning");
  const [duration, setDuration] = useState("2 Days");
  const [severity, setSeverity] = useState(5);
  const [knownAllergies, setKnownAllergies] = useState("No Known Drug Allergies (NKDA)");
  const [hasChestPain, setHasChestPain] = useState(false);
  const [hasGIBlood, setHasGIBlood] = useState(false);

  const complaints = [
    "Fever & Chills",
    "Cough & Cold",
    "Acidity & Burning",
    "Severe Headache",
    "Acute Diarrhea",
    "Body & Back Pain",
    "Skin Rash",
    "Burning Urination",
  ];

  const durations = ["Today", "1-2 Days", "3-5 Days", "> 1 Week", "Chronic"];

  const parsedAge = parseInt(age, 10) || 0;
  const isPediatric = parsedAge > 0 && parsedAge < 4;

  const handleSubmit = () => {
    if (!patientName.trim()) {
      Alert.alert("Validation Error", "Please enter the patient name.");
      return;
    }
    if (parsedAge <= 0) {
      Alert.alert("Validation Error", "Please enter a valid age.");
      return;
    }

    if (hasChestPain) {
      Alert.alert(
        "🚨 Emergency Red Flag",
        "Chest pain with potential cardiac radiation requires immediate emergency hospital care (Dial 108).",
        [{ text: "Understood", style: "destructive" }]
      );
      return;
    }

    const submissionData = {
      patientName,
      age: parsedAge,
      gender,
      isPregnant: gender === "Female" ? isPregnant : false,
      chiefComplaint: selectedComplaint,
      duration,
      severity,
      knownAllergies,
      redFlags: {
        hasChestPain,
        hasGIBlood,
      },
      triageLevel: hasChestPain || hasGIBlood ? "RED" : isPediatric ? "ORANGE" : "YELLOW",
    };

    if (onSubmit) {
      onSubmit(submissionData);
    } else if (navigation?.navigate) {
      navigation.navigate("IntakeCompleted", submissionData);
    }
  };

  const handleBack = () => {
    if (onBack) onBack();
    else if (navigation?.goBack) navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {(onBack || navigation?.goBack) && (
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Clinical Intake Form</Text>
        <Text style={styles.subtitle}>
          Structured pre-consultation information for the pharmacist.
        </Text>
      </View>

      {/* Demographics Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>1. Patient Demographics</Text>
        
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={patientName}
          onChangeText={setPatientName}
          placeholder="e.g. Rajesh Kumar"
          placeholderTextColor={colors.textMuted}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Age (Years)</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="Age"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={{ flex: 1.5 }}>
            <Text style={styles.label}>Biological Sex</Text>
            <View style={styles.segmentedRow}>
              {(["Male", "Female", "Other"] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.segmentBtn,
                    gender === g && styles.segmentBtnActive,
                  ]}
                  onPress={() => setGender(g)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      gender === g && styles.segmentTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* CDSCO 2026 Pediatric Guardrail */}
        {isPediatric && (
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ CDSCO 2026 Pediatric Guardrail</Text>
            <Text style={styles.warningText}>
              Patient is under 4 years of age. Fixed-dose combination (FDC)
              anti-cold syrups (Chlorpheniramine + Phenylephrine) are strictly
              banned. Pediatrician consultation required.
            </Text>
          </View>
        )}

        {gender === "Female" && parsedAge >= 14 && parsedAge <= 55 && (
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setIsPregnant(!isPregnant)}
          >
            <View style={[styles.checkbox, isPregnant && styles.checkboxActive]}>
              {isPregnant && <Text style={styles.checkText}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Currently pregnant or breastfeeding</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Chief Complaint */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>2. Chief Complaint & Duration</Text>
        <View style={styles.pillsWrap}>
          {complaints.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.pill,
                selectedComplaint === c && styles.pillActive,
              ]}
              onPress={() => setSelectedComplaint(c)}
            >
              <Text
                style={[
                  styles.pillText,
                  selectedComplaint === c && styles.pillTextActive,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: 14 }]}>Symptom Duration</Text>
        <View style={styles.pillsWrap}>
          {durations.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.pill, duration === d && styles.pillActive]}
              onPress={() => setDuration(d)}
            >
              <Text
                style={[
                  styles.pillText,
                  duration === d && styles.pillTextActive,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: 14 }]}>
          Pain / Discomfort Intensity: {severity} / 10
        </Text>
        <View style={styles.severityBar}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.severityBtn,
                severity === num && styles.severityBtnActive,
                num >= 7 ? styles.severityBtnRed : undefined,
              ]}
              onPress={() => setSeverity(num)}
            >
              <Text
                style={[
                  styles.severityText,
                  severity === num && styles.severityTextActive,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Red Flag Screen */}
      <View style={[styles.card, styles.alertCard]}>
        <Text style={[styles.cardTitle, { color: colors.redEmergency }]}>
          3. Emergency Safety Screening
        </Text>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setHasChestPain(!hasChestPain)}
        >
          <View style={[styles.checkbox, hasChestPain && styles.checkboxRed]}>
            {hasChestPain && <Text style={styles.checkText}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            Pain radiates to left arm, neck, or jaw with heavy sweating
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setHasGIBlood(!hasGIBlood)}
        >
          <View style={[styles.checkbox, hasGIBlood && styles.checkboxRed]}>
            {hasGIBlood && <Text style={styles.checkText}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            Vomited dark coffee-ground blood or passed sticky black stool
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Submit Intake to Pharmacist →"
        onPress={handleSubmit}
        style={{ marginTop: 10, height: 52 }}
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
  header: {
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 4,
    marginBottom: 6,
  },
  backBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
    ...shadows.sm,
  },
  alertCard: {
    borderColor: colors.redBorder,
    backgroundColor: colors.redLight,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  segmentedRow: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: borderRadius.sm,
  },
  segmentBtnActive: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
  warningBox: {
    backgroundColor: colors.orangeLight,
    borderLeftWidth: 3.5,
    borderLeftColor: colors.orangeUrgent,
    padding: 12,
    borderRadius: borderRadius.md,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.orangeUrgent,
    marginBottom: 3,
  },
  warningText: {
    fontSize: 11.5,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  pillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 13,
    paddingVertical: 7.5,
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 12.5,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  pillTextActive: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  severityBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  severityBtn: {
    width: 28,
    height: 34,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  severityBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  severityBtnRed: {
    borderColor: colors.redEmergency,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  severityTextActive: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxRed: {
    backgroundColor: colors.redEmergency,
    borderColor: colors.redEmergency,
  },
  checkText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    fontWeight: "500",
  },
});
