import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { colors } from "../theme/colors";

interface ClinicalAssessmentScreenProps {
  route?: { params?: { referralId?: string; referral?: any } };
  navigation?: any;
}

export function ClinicalAssessmentScreen({ route, navigation }: ClinicalAssessmentScreenProps) {
  const referral = route?.params?.referral || {
    referralId: "REF-NMC-2026-9142",
    patient: {
      name: "Sunita Patel",
      age: 48,
      gender: "FEMALE",
      phone: "+919812345678",
    },
    pharmacy: {
      name: "Apollo Pharmacy, Connaught Place",
    },
    chiefComplaint: "High fever 102.4°F with productive cough for 4 days.",
  };

  const [callActive, setCallActive] = useState(true);
  const [callMuted, setCallMuted] = useState(false);
  const [subjectiveNote, setSubjectiveNote] = useState(
    "Patient reports productive cough with yellow-green phlegm for 4 days, chills, right-sided pleuritic chest tightness on deep inspiration. Denies hemoptysis."
  );
  const [vitals, setVitals] = useState({
    temp: "101.8 °F",
    pulse: "94 bpm",
    bp: "128/82 mmHg",
    spo2: "96% on room air",
  });
  const [selectedIcd10, setSelectedIcd10] = useState("J18.9 - Community-Acquired Pneumonia (CAP)");
  const [rxList, setRxList] = useState([
    {
      drugName: "Tab. Amoxicillin + Clavulanic Acid (Augmentin 625)",
      dosage: "625 mg",
      frequency: "1 tablet twice daily (BD) after food",
      duration: "5 days",
      schedule: "Schedule H",
    },
    {
      drugName: "Tab. Paracetamol 650mg (Dolo 650)",
      dosage: "650 mg",
      frequency: "1 tablet SOS for fever > 100°F (Max 3/day)",
      duration: "3 days",
      schedule: "OTC",
    },
    {
      drugName: "Syr. Levosalbutamol + Ambroxol",
      dosage: "5 ml",
      frequency: "Thrice daily after food",
      duration: "5 days",
      schedule: "Schedule H",
    },
  ]);
  const [rxSigned, setRxSigned] = useState(false);

  const handleSignPrescription = () => {
    Alert.alert(
      "Sign & Dispatch e-Prescription?",
      "Under NMC Telemedicine Guidelines 2020, this digital prescription will be signed with your NMC Registration (NMC-MCI-2015-44210) and dispatched immediately to Apollo Pharmacy counter.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Digitally Sign & Dispatch",
          onPress: () => {
            setRxSigned(true);
            Alert.alert(
              "e-Prescription Dispatched!",
              "Digital prescription successfully transmitted to retail pharmacy and sent as PDF link to patient's WhatsApp."
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Active Teleconsultation Bar */}
        <View style={styles.telemedBar}>
          <View style={styles.callStatus}>
            <View style={styles.liveIndicator} />
            <Text style={styles.callTimerText}>Live Tele-OPD Video Call • 03:42</Text>
          </View>
          <View style={styles.callControls}>
            <TouchableOpacity
              style={[styles.callBtn, callMuted && styles.callBtnActive]}
              onPress={() => setCallMuted(!callMuted)}
            >
              <Text style={styles.callBtnText}>{callMuted ? "Unmute" : "Mute"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.callBtn, styles.endCallBtn]}
              onPress={() => setCallActive(!callActive)}
            >
              <Text style={[styles.callBtnText, { color: "#FFFFFF" }]}>End Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Patient Header */}
        <View style={styles.patientCard}>
          <Text style={styles.patientName}>{referral.patient.name}</Text>
          <Text style={styles.patientMeta}>
            {referral.patient.age} Y • {referral.patient.gender} • {referral.patient.phone}
          </Text>
          <Text style={styles.pharmacyRef}>
            Origin: {referral.pharmacy.name} • Ref: {referral.referralId}
          </Text>
        </View>

        {/* SOAP Notes Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📝 SOAP Clinical Documentation</Text>

          {/* S - Subjective */}
          <Text style={styles.soapLabel}>S — Subjective History</Text>
          <TextInput
            style={styles.textInput}
            multiline
            value={subjectiveNote}
            onChangeText={setSubjectiveNote}
          />

          {/* O - Objective / Vitals */}
          <Text style={styles.soapLabel}>O — Objective Signs & Vitals (Recorded at Pharmacy)</Text>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>Temperature</Text>
              <Text style={styles.vitalValue}>{vitals.temp}</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>SpO2</Text>
              <Text style={styles.vitalValue}>{vitals.spo2}</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>{vitals.bp}</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>Pulse</Text>
              <Text style={styles.vitalValue}>{vitals.pulse}</Text>
            </View>
          </View>

          {/* A - Assessment / Diagnosis */}
          <Text style={styles.soapLabel}>A — Clinical Assessment (ICD-10)</Text>
          <View style={styles.icdPicker}>
            <Text style={styles.icdSelectedText}>{selectedIcd10}</Text>
          </View>
        </View>

        {/* P - Plan / e-Prescription */}
        <View style={styles.sectionCard}>
          <View style={styles.rxHeaderRow}>
            <Text style={styles.sectionTitle}>💊 P — Digital e-Prescription (Rx)</Text>
            <View style={styles.nmcBadge}>
              <Text style={styles.nmcBadgeText}>NMC Compliant</Text>
            </View>
          </View>
          <Text style={styles.rxSub}>
            Includes Schedule H medications prescribed by Dr. Rajesh Gupta, MD (NMC-MCI-2015-44210)
          </Text>

          {rxList.map((item, index) => (
            <View key={index} style={styles.rxItem}>
              <View style={styles.rxTop}>
                <Text style={styles.rxName}>{item.drugName}</Text>
                <View style={styles.schedPill}>
                  <Text style={styles.schedPillText}>{item.schedule}</Text>
                </View>
              </View>
              <Text style={styles.rxDetail}>
                Dosage: <Text style={styles.bold}>{item.dosage}</Text> • Regimen: <Text style={styles.bold}>{item.frequency}</Text>
              </Text>
              <Text style={styles.rxDetail}>Duration: {item.duration}</Text>
            </View>
          ))}

          {rxSigned ? (
            <View style={styles.signedBox}>
              <Text style={styles.signedTitle}>✓ Digitally Signed by RMP</Text>
              <Text style={styles.signedMeta}>
                Signature Hash: SHA256-NMC-2026-88F921BC • Dispatched to Pharmacy
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.signBtn} onPress={handleSignPrescription}>
              <Text style={styles.signBtnText}>🖋️ Digitally Sign & Transmit e-Prescription</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack ? navigation.goBack() : null}
        >
          <Text style={styles.backBtnText}>‹ Back to Referrals Queue</Text>
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
  telemedBar: {
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  callStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
    marginRight: 8,
  },
  callTimerText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  callControls: {
    flexDirection: "row",
    gap: 8,
  },
  callBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  callBtnActive: {
    backgroundColor: colors.orangeUrgent,
  },
  endCallBtn: {
    backgroundColor: colors.redEmergency,
  },
  callBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  patientCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
  },
  patientName: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  patientMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pharmacyRef: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 4,
    fontWeight: "500",
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  soapLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    marginTop: 10,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 10,
    fontSize: 13,
    color: colors.textPrimary,
    minHeight: 60,
    textAlignVertical: "top",
  },
  vitalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  vitalBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 8,
  },
  vitalLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  vitalValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 2,
  },
  icdPicker: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  icdSelectedText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  rxHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nmcBadge: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  nmcBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.greenSafe,
  },
  rxSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 10,
  },
  rxItem: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: colors.surfaceMuted,
  },
  rxTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  rxName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },
  schedPill: {
    backgroundColor: colors.purpleLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  schedPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.purpleRx,
  },
  rxDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bold: {
    fontWeight: "600",
    color: colors.textPrimary,
  },
  signBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  signBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  signedBox: {
    backgroundColor: colors.greenLight,
    borderWidth: 1,
    borderColor: colors.greenSafe,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    alignItems: "center",
  },
  signedTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.greenSafe,
  },
  signedMeta: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  backBtn: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
});
