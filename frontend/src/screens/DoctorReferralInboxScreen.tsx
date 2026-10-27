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

const DOCTOR_INBOX_CASES = [
  {
    referralId: "REF-NMC-2026-9142",
    urgency: "URGENT",
    receivedTime: "4 mins ago",
    patient: {
      name: "Sunita Patel",
      age: 48,
      gender: "FEMALE",
      phone: "+919812345678",
      language: "Gujarati / Hindi",
    },
    pharmacy: {
      name: "Apollo Pharmacy, Connaught Place",
      pharmacist: "Arun K. Verma, R.Ph (PCI-DL-2019-4821)",
      phone: "+919876543210",
    },
    chiefComplaint: "High fever 102.4°F with productive cough for 4 days and pleuritic pain.",
    sbarSituation: "48-year-old female presenting with high-grade pyrexia and lower respiratory signs.",
    sbarAssessment: "Suspected Community-Acquired Pneumonia (CAP) or Acute Bronchitis. Rule out consolidation.",
    recommendedRx: "Requires Schedule H antibiotic (Amoxicillin-Clavulanate) and chest radiograph.",
  },
  {
    referralId: "REF-NMC-2026-8821",
    urgency: "ROUTINE",
    receivedTime: "18 mins ago",
    patient: {
      name: "Karan Johar",
      age: 31,
      gender: "MALE",
      phone: "+919922334455",
      language: "Hindi / English",
    },
    pharmacy: {
      name: "MedPlus Pharmacy, Koramangala",
      pharmacist: "Deepa N., R.Ph (PCI-KA-2021-1129)",
      phone: "+919845012345",
    },
    chiefComplaint: "Bilateral itchy red eyes with purulent discharge waking up in morning.",
    sbarSituation: "31-year-old male with acute conjunctivitis symptoms for 48 hours.",
    sbarAssessment: "Acute bacterial conjunctivitis. Needs Schedule H ophthalmic drops.",
    recommendedRx: "Moxifloxacin 0.5% eye drops or Tobramycin.",
  },
  {
    referralId: "REF-NMC-2026-7734",
    urgency: "ROUTINE",
    receivedTime: "45 mins ago",
    patient: {
      name: "Geeta Ramachandran",
      age: 62,
      gender: "FEMALE",
      phone: "+919445566778",
      language: "Tamil",
    },
    pharmacy: {
      name: "Wellness Forever, Dadar",
      pharmacist: "Ramesh P., R.Ph (PCI-MH-2018-7712)",
      phone: "+919820011223",
    },
    chiefComplaint: "Knee osteoarthritis flare-up; routine paracetamol not relieving pain.",
    sbarSituation: "62-year-old known OA knee with acute worsening of weight-bearing pain.",
    sbarAssessment: "Osteoarthritis exacerbation. Needs short-course prescription NSAID and gastric protection.",
    recommendedRx: "Aceclofenac + Paracetamol with PPI.",
  },
];

export function DoctorReferralInboxScreen({ navigation }: { navigation?: any }) {
  const [inboxList, setInboxList] = useState(DOCTOR_INBOX_CASES);

  const handleStartConsultation = (referral: any) => {
    if (navigation?.navigate) {
      navigation.navigate("ClinicalAssessment", { referralId: referral.referralId, referral });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Doctor Tele-OPD Referrals</Text>
          <Text style={styles.subtitle}>
            Inbound SBAR cases from network pharmacies requiring RMP evaluation
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>3</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: colors.orangeUrgent }]}>1</Text>
            <Text style={styles.statLabel}>Urgent CAP</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: colors.greenSafe }]}>14</Text>
            <Text style={styles.statLabel}>Consulted Today</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.listContainer}>
          {inboxList.map((item) => {
            const isUrgent = item.urgency === "URGENT";
            return (
              <View key={item.referralId} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.urgencyPill, { backgroundColor: isUrgent ? colors.orangeLight : colors.blueLight }]}>
                    <Text style={[styles.urgencyText, { color: isUrgent ? colors.orangeUrgent : colors.primary }]}>
                      {isUrgent ? "⚡ URGENT TELE-OPD" : "📋 ROUTINE CONSULT"}
                    </Text>
                  </View>
                  <Text style={styles.receivedTime}>{item.receivedTime}</Text>
                </View>

                <View style={styles.patientRow}>
                  <Text style={styles.patientName}>{item.patient.name}</Text>
                  <Text style={styles.patientMeta}>
                    {item.patient.age} Y • {item.patient.gender} • {item.patient.language}
                  </Text>
                </View>

                <View style={styles.pharmacyBadge}>
                  <Text style={styles.pharmacyText}>
                    📍 Handoff from: <Text style={{ fontWeight: "700" }}>{item.pharmacy.name}</Text>
                  </Text>
                  <Text style={styles.pharmacistSub}>{item.pharmacy.pharmacist}</Text>
                </View>

                <Text style={styles.complaintText}>"{item.chiefComplaint}"</Text>

                <View style={styles.sbarPreview}>
                  <Text style={styles.sbarLabel}>Pharmacist SBAR Assessment:</Text>
                  <Text style={styles.sbarText}>{item.sbarAssessment}</Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.consultBtn}
                    onPress={() => handleStartConsultation(item)}
                  >
                    <Text style={styles.consultBtnText}>Accept & Open Consultation</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
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
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 10,
    alignItems: "center",
  },
  statNum: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContainer: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  urgencyPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: "800",
  },
  receivedTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  patientRow: {
    marginBottom: 6,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  patientMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  pharmacyBadge: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  pharmacyText: {
    fontSize: 11,
    color: colors.textPrimary,
  },
  pharmacistSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  complaintText: {
    fontSize: 13,
    fontStyle: "italic",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  sbarPreview: {
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  sbarLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 2,
  },
  sbarText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  consultBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  consultBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
