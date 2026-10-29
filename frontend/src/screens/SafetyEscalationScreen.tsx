import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { MOCK_INTAKES, PharmacyIntakeRecord } from "../data/intakes";

interface SafetyEscalationScreenProps {
  route?: { params?: { intakeId?: string } };
  navigation?: any;
}

const NEARBY_EMERGENCY_CENTERS = [
  {
    name: "AIIMS Emergency & Trauma Centre",
    distance: "1.8 km away",
    address: "Ansari Nagar, New Delhi",
    phone: "011-26588500",
    icuBedsAvailable: 4,
  },
  {
    name: "Safdarjung Hospital Emergency OPD",
    distance: "2.4 km away",
    address: "Ring Road, Opposite AIIMS, New Delhi",
    phone: "011-26165060",
    icuBedsAvailable: 7,
  },
  {
    name: "Max Super Speciality Hospital (ER)",
    distance: "3.5 km away",
    address: "Press Enclave Marg, Saket",
    phone: "011-26515050",
    icuBedsAvailable: 2,
  },
];

export function SafetyEscalationScreen({ route, navigation }: SafetyEscalationScreenProps) {
  const intakeId = route?.params?.intakeId || "INTAKE-2026-0044";
  const intake: PharmacyIntakeRecord =
    MOCK_INTAKES.find((item) => item.intakeId === intakeId) || MOCK_INTAKES[2] || MOCK_INTAKES[0];

  const [alertSent, setAlertSent] = useState(false);

  const handleCallAmbulance = () => {
    Linking.openURL("tel:108").catch(() => {
      Alert.alert("Ambulance Service", "Calling Emergency National Ambulance Service: 108");
    });
  };

  const handleNotifyKin = () => {
    setAlertSent(true);
    Alert.alert(
      "Emergency SMS Dispatched",
      `Urgent alert dispatched to registered next-of-kin for ${intake.patient.name} with live GPS location of this pharmacy.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Urgent Warning Banner */}
        <View style={styles.emergencyBanner}>
          <Text style={styles.emergencyIcon}>🚨</Text>
          <Text style={styles.emergencyTitle}>CRITICAL EMERGENCY ESCALATION</Text>
          <Text style={styles.emergencySubtitle}>
            Red-flag symptom detected during clinical intake. Immediate hospital stabilization required. Do NOT attempt routine OTC treatment.
          </Text>
        </View>

        {/* Patient Snapshot */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Patient Emergency Profile</Text>
          <View style={styles.patientRow}>
            <View>
              <Text style={styles.patientName}>{intake.patient.name}</Text>
              <Text style={styles.patientInfo}>
                {intake.patient.age} Years • {intake.patient.gender} • {intake.patient.phone}
              </Text>
              <Text style={styles.intakeIdText}>Ref: {intake.intakeId}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillText}>STAT / RED</Text>
            </View>
          </View>
        </View>

        {/* Detected Red Flags */}
        <View style={styles.card}>
          <Text style={[styles.cardHeader, { color: colors.redEmergency }]}>
            🚩 Triggered Emergency Red Flags
          </Text>
          <View style={styles.redFlagList}>
            <View style={styles.redFlagItem}>
              <Text style={styles.redFlagDot}>•</Text>
              <Text style={styles.redFlagText}>
                {intake.redFlagsDetected && intake.redFlagsDetected.length > 0
                  ? intake.redFlagsDetected.join(", ")
                  : "Acute severe chest discomfort / dyspnea requiring urgent tertiary cardiac evaluation."}
              </Text>
            </View>
            <View style={styles.redFlagItem}>
              <Text style={styles.redFlagDot}>•</Text>
              <Text style={styles.redFlagText}>
                CDSCO 2026 Emergency Rule: Retail chemist prohibited from managing unstable cardiac, neurological, or respiratory emergencies.
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Ambulance Action Button */}
        <TouchableOpacity style={styles.ambulanceBtn} onPress={handleCallAmbulance}>
          <Text style={styles.ambulanceBtnIcon}>🚑</Text>
          <View>
            <Text style={styles.ambulanceBtnText}>DIAL 108 AMBULANCE (FREE)</Text>
            <Text style={styles.ambulanceBtnSub}>National Emergency Medical Response Service</Text>
          </View>
        </TouchableOpacity>

        {/* Next of Kin Action */}
        <TouchableOpacity
          style={[styles.actionButton, alertSent && styles.actionButtonSent]}
          onPress={handleNotifyKin}
        >
          <Text style={styles.actionButtonText}>
            {alertSent ? "✓ Emergency Alert Sent to Family" : "📲 Send Emergency SOS SMS to Family"}
          </Text>
        </TouchableOpacity>

        {/* Nearby Emergency Facilities */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>🏥 Nearest Emergency & Trauma Centers</Text>
          {NEARBY_EMERGENCY_CENTERS.map((hospital, index) => (
            <View key={index} style={styles.hospitalCard}>
              <View style={styles.hospitalInfo}>
                <Text style={styles.hospitalName}>{hospital.name}</Text>
                <Text style={styles.hospitalDist}>{hospital.distance} • {hospital.address}</Text>
                <Text style={styles.icuText}>🟢 {hospital.icuBedsAvailable} ICU Trauma Beds Available</Text>
              </View>
              <TouchableOpacity
                style={styles.callHospBtn}
                onPress={() => Linking.openURL(`tel:${hospital.phone}`).catch(() => {})}
              >
                <Text style={styles.callHospText}>Call ER</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* First-Aid Protocol */}
        <View style={styles.firstAidCard}>
          <Text style={styles.firstAidTitle}>🛡️ Pharmacist Immediate Stabilization Protocol</Text>
          <Text style={styles.firstAidStep}>1. Keep patient in a comfortable seated/propped-up position.</Text>
          <Text style={styles.firstAidStep}>2. Loosen tight collar and ensure well-ventilated air supply.</Text>
          <Text style={styles.firstAidStep}>3. Check SpO2 and Blood Pressure using pharmacy monitor.</Text>
          <Text style={styles.firstAidStep}>4. Keep emergency oxygen cylinder ready if SpO2 drops &lt; 92%.</Text>
          <Text style={styles.firstAidStep}>5. Do NOT give oral liquids or food if sensorium is altered.</Text>
        </View>

        {/* Back to Safety */}
        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => navigation?.goBack ? navigation.goBack() : null}
        >
          <Text style={styles.returnBtnText}>‹ Return to Pharmacist Queue</Text>
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
  emergencyBanner: {
    backgroundColor: colors.redEmergency,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  emergencyIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  emergencySubtitle: {
    fontSize: 12,
    color: "#FFEBEE",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  patientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  patientInfo: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  intakeIdText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  statPill: {
    backgroundColor: colors.redLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.redEmergency,
  },
  redFlagList: {
    backgroundColor: colors.redLight,
    borderRadius: 8,
    padding: 10,
  },
  redFlagItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  redFlagDot: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.redEmergency,
    marginRight: 6,
  },
  redFlagText: {
    fontSize: 12,
    color: colors.redEmergency,
    fontWeight: "600",
    flex: 1,
    lineHeight: 16,
  },
  ambulanceBtn: {
    backgroundColor: colors.redEmergency,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: colors.redEmergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  ambulanceBtnIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  ambulanceBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  ambulanceBtnSub: {
    color: "#FFEBEE",
    fontSize: 11,
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  actionButtonSent: {
    backgroundColor: colors.greenLight,
    borderColor: colors.greenSafe,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  hospitalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  hospitalInfo: {
    flex: 1,
    paddingRight: 10,
  },
  hospitalName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  hospitalDist: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  icuText: {
    fontSize: 11,
    color: colors.greenSafe,
    fontWeight: "600",
    marginTop: 2,
  },
  callHospBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  callHospText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  firstAidCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  firstAidTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.greenSafe,
    marginBottom: 8,
  },
  firstAidStep: {
    fontSize: 12,
    color: "#166534",
    marginBottom: 4,
    lineHeight: 16,
  },
  returnBtn: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  returnBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
});
