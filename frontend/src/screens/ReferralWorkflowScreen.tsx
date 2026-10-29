import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { MOCK_INTAKES, PharmacyIntakeRecord } from "../data/intakes";
import { MOCK_DOCTORS, Doctor } from "../data/doctors";

interface ReferralWorkflowScreenProps {
  route?: { params?: { intakeId?: string } };
  navigation?: any;
}

const REFERRAL_REASONS = [
  "Prescription-only medicine (Schedule H/H1) required",
  "Symptoms refractory to routine OTC care (>72 hours)",
  "Diagnostic workup (CBC / Chest X-Ray / USG) needed",
  "Specialist second opinion requested by patient",
  "Pediatric clinical evaluation required",
];

export function ReferralWorkflowScreen({ route, navigation }: ReferralWorkflowScreenProps) {
  const intakeId = route?.params?.intakeId || "INTAKE-2026-0043";
  const intake: PharmacyIntakeRecord =
    MOCK_INTAKES.find((item) => item.intakeId === intakeId) || MOCK_INTAKES[1] || MOCK_INTAKES[0];

  const [selectedDoctorId, setSelectedDoctorId] = useState(MOCK_DOCTORS[0]?.id || "doc-del-001");
  const [selectedReason, setSelectedReason] = useState(REFERRAL_REASONS[0]);
  const [pharmacistNotes, setPharmacistNotes] = useState(
    "Patient presented at retail counter with persistent productive cough and nocturnal fever spikes. Vitals stable. Cleared red flags. Requesting tele-OPD evaluation for Schedule H antibiotic/bronchodilator assessment."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralSent, setReferralSent] = useState(false);
  const [referralRef, setReferralRef] = useState("");

  const handleSubmitReferral = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const ref = `REF-NMC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setReferralRef(ref);
      setReferralSent(true);
    }, 700);
  };

  const selectedDoctor = MOCK_DOCTORS.find((d: Doctor) => d.id === selectedDoctorId) || MOCK_DOCTORS[0];

  if (referralSent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Tele-OPD Referral Dispatched!</Text>
          <Text style={styles.successRef}>Booking Reference: {referralRef}</Text>

          <View style={styles.successCard}>
            <Text style={styles.successCardRow}>
              <Text style={styles.bold}>Assigned Doctor:</Text> {selectedDoctor.fullName} ({selectedDoctor.specialization})
            </Text>
            <Text style={styles.successCardRow}>
              <Text style={styles.bold}>Patient:</Text> {intake.patient.name} ({intake.patient.phone})
            </Text>
            <Text style={styles.successCardRow}>
              <Text style={styles.bold}>Estimated Wait Time:</Text> ~3 to 5 minutes
            </Text>
            <Text style={styles.successCardRow}>
              <Text style={styles.bold}>SMS Telemed Link:</Text> Sent to patient's WhatsApp & SMS
            </Text>
          </View>

          <View style={styles.compliancePill}>
            <Text style={styles.compliancePillText}>
              ⚖️ NMC Telemedicine Practice Guidelines 2020 Compliant
            </Text>
          </View>

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation?.goBack ? navigation.goBack() : null}
          >
            <Text style={styles.doneBtnText}>Return to Pharmacist Queue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Doctor Tele-OPD Referral</Text>
          <Text style={styles.subtitle}>
            Seamless handoff from Pharmacy Counter to Registered Medical Practitioner
          </Text>
        </View>

        {/* Patient Clinical Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Patient Intake Summary</Text>
          <View style={styles.patientInfoRow}>
            <Text style={styles.patientName}>{intake.patient.name}</Text>
            <Text style={styles.patientAge}>{intake.patient.age} Y • {intake.patient.gender}</Text>
          </View>
          <Text style={styles.complaintText}>"{intake.chiefComplaint}"</Text>
          <View style={styles.assessmentBox}>
            <Text style={styles.assessmentLabel}>SBAR Assessment Summary:</Text>
            <Text style={styles.assessmentText}>{intake.sbarSummary.assessment}</Text>
          </View>
        </View>

        {/* Select Doctor */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select On-Duty RMP Doctor</Text>
          <Text style={styles.cardSub}>NMC Registered Physicians available for immediate teleconsultation</Text>
          
          {MOCK_DOCTORS.map((doctor: Doctor) => {
            const isSelected = selectedDoctorId === doctor.id;
            return (
              <TouchableOpacity
                key={doctor.id}
                style={[styles.doctorOption, isSelected && styles.doctorOptionSelected]}
                onPress={() => setSelectedDoctorId(doctor.id)}
              >
                <View style={styles.radioCircle}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={styles.doctorDetails}>
                  <Text style={[styles.doctorName, isSelected && { color: colors.primary }]}>
                    {doctor.fullName}
                  </Text>
                  <Text style={styles.doctorSpecialty}>
                    {doctor.specialization} • {doctor.degrees.join(", ")}
                  </Text>
                  <Text style={styles.doctorReg}>
                    Reg: {doctor.nmcRegistrationNumber} • Fee: ₹{doctor.consultationFeeINR}
                  </Text>
                </View>
                <View style={styles.onlineBadge}>
                  <Text style={styles.onlineText}>🟢 Live</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Clinical Reason for Referral */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Primary Clinical Reason</Text>
          {REFERRAL_REASONS.map((reason, index) => {
            const isSelected = selectedReason === reason;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.reasonChip, isSelected && styles.reasonChipSelected]}
                onPress={() => setSelectedReason(reason)}
              >
                <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                  {isSelected ? "● " : "○ "} {reason}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Pharmacist Clinical Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pharmacist Handover Remarks</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={pharmacistNotes}
            onChangeText={setPharmacistNotes}
            placeholder="Add vital signs, patient history, or specific concerns for the doctor..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.disabledBtn]}
          onPress={handleSubmitReferral}
          disabled={isSubmitting}
        >
          <Text style={styles.submitBtnText}>
            {isSubmitting ? "Dispatching SBAR to Doctor..." : "🚀 Transmit SBAR & Initiate Referral"}
          </Text>
        </TouchableOpacity>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  patientInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  patientAge: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  complaintText: {
    fontSize: 13,
    fontStyle: "italic",
    color: colors.textSecondary,
    marginBottom: 10,
  },
  assessmentBox: {
    backgroundColor: colors.primaryLight,
    padding: 10,
    borderRadius: 8,
  },
  assessmentLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 2,
  },
  assessmentText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  doctorOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
    backgroundColor: colors.surfaceMuted,
  },
  doctorOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  doctorReg: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  onlineBadge: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.greenSafe,
  },
  reasonChip: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 8,
    backgroundColor: colors.surfaceMuted,
  },
  reasonChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  reasonText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  reasonTextSelected: {
    fontWeight: "700",
    color: colors.primary,
  },
  textArea: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  successContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.greenSafe,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successIcon: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
  },
  successRef: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 6,
    marginBottom: 20,
  },
  successCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    width: "100%",
    marginBottom: 16,
  },
  successCardRow: {
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 18,
  },
  bold: {
    fontWeight: "700",
  },
  compliancePill: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 24,
  },
  compliancePillText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  doneBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
