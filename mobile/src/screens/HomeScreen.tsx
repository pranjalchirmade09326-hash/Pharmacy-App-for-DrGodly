import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { colors } from "../theme/colors";
import { borderRadius, spacing } from "../theme/spacing";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const dialDrGodly = () => {
    Linking.openURL("tel:+918069000000");
  };

  const startSimulation = () => {
    setSimulating(true);
    setSimStep(1);
    setTimeout(() => setSimStep(2), 2000);
    setTimeout(() => setSimStep(3), 4200);
    setTimeout(() => setSimStep(4), 6500);
  };

  const resetSimulation = () => {
    setSimulating(false);
    setSimStep(0);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Hero Welcome Banner */}
      <View style={styles.heroBanner}>
        <Badge label="Bharat Pharmacy Healthcare" variant="blue" style={styles.heroBadge} />
        <Text style={styles.heroTitle}>
          Not feeling well?{"\n"}
          <Text style={styles.heroTitleHighlight}>Talk to DrGodly</Text> at the counter.
        </Text>
        <Text style={styles.heroSubtitle}>
          Scan the pharmacy counter QR, tap call to explain your symptoms in your language, and get a structured WhatsApp report for safe dispensing.
        </Text>

        <Button
          title="📞 Tap to Call DrGodly (+91-8069-000-000)"
          variant="primary"
          size="lg"
          onPress={dialDrGodly}
          style={styles.heroCallBtn}
        />
      </View>

      {/* Pharmacy Counter QR Poster Card */}
      <View style={styles.qrPosterCard}>
        <View style={styles.posterHeader}>
          <Text style={styles.posterTag}>IN-PHARMACY FREE CLINICAL TRIAGE</Text>
          <Text style={styles.posterTitle}>Scan to Speak with DrGodly</Text>
        </View>

        {/* QR Code Graphic Box */}
        <View style={styles.qrBox}>
          <View style={styles.qrGraphic}>
            <View style={styles.qrCorners}>
              <View style={styles.cornerSquare} />
              <View style={styles.cornerSquare} />
            </View>
            <View style={styles.qrCenter}>
              <Text style={styles.qrBrand}>DRGODLY</Text>
            </View>
            <View style={styles.qrCorners}>
              <View style={styles.cornerSquare} />
              <View style={styles.cornerSmall} />
            </View>
          </View>
          <Text style={styles.qrActionText}>Universal 1-Tap Action:</Text>
          <Text style={styles.qrSubText}>
            Camera scan opens phone dialer with tel:+918069000000
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={dialDrGodly}
          style={styles.openDialerBtn}
        >
          <Text style={styles.openDialerText}>Open Native Phone Dialer Now</Text>
        </TouchableOpacity>

        <Text style={styles.statutoryNote}>
          DrGodly is an AI clinical assistant. It does not replace a doctor.
        </Text>
      </View>

      {/* 4-Step Walkthrough */}
      <View style={styles.stepsSection}>
        <Text style={styles.sectionHeading}>How It Works at the Counter</Text>

        <View style={styles.stepCard}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Scan Counter QR</Text>
            <Text style={styles.stepDesc}>
              Scan the poster with smartphone camera. Universal tel: link pops up dialer.
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>AI Voice Intake Call</Text>
            <Text style={styles.stepDesc}>
              Talk in Hindi, English, Tamil, or Telugu. DrGodly asks demographic & clinical questions.
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>WhatsApp Intake Report</Text>
            <Text style={styles.stepDesc}>
              Structured SBAR clinical summary delivered directly to patient&apos;s WhatsApp.
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>4</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pharmacist / Doctor Action</Text>
            <Text style={styles.stepDesc}>
              Pharmacist reviews the case, dispenses CDSCO-compliant OTC relief, or escalates to RMP.
            </Text>
          </View>
        </View>
      </View>

      {/* Live AI Voice Intake Simulation Box */}
      <View style={styles.simBox}>
        <View style={styles.simHeader}>
          <Text style={styles.simTag}>INTERACTIVE VOICE DEMO</Text>
          <Text style={styles.simTitle}>Live SBAR Intake Simulator</Text>
        </View>

        <View style={styles.simBody}>
          <Text style={styles.simStatus}>
            {simulating ? `🟢 SIMULATING INTAKE CALL (Step ${simStep}/4)` : "⚪ STANDBY"}
          </Text>

          {simStep === 0 && (
            <Text style={styles.simLog}>
              Press below to simulate an incoming patient call (Rahul Sharma, 34M - Acid Peptic Disease) and see real-time SBAR extraction.
            </Text>
          )}

          {simStep === 1 && (
            <View style={styles.simSpeech}>
              <Text style={styles.speakerLabel}>PATIENT AUDIO (Hindi):</Text>
              <Text style={styles.speechText}>
                &ldquo;Namaste DrGodly, mujhe 3 din se pet me tez jalan aur khatti dakar aa rahi hai khane ke baad...&rdquo;
              </Text>
            </View>
          )}

          {simStep === 2 && (
            <View style={styles.simSpeech}>
              <Text style={styles.speakerLabel}>AI CLINICAL QUESTIONING:</Text>
              <Text style={styles.speechText}>
                &ldquo;Kya aapko nigalne me dard, ya ulti me khoon aaya hai?&rdquo; &rarr; Patient: &ldquo;Nahi, bilkul nahi.&rdquo;
              </Text>
            </View>
          )}

          {simStep >= 3 && (
            <View style={styles.sbarResult}>
              <Text style={styles.sbarTitle}>✓ SBAR Clinical Extraction Generated</Text>
              <Text style={styles.sbarItem}><Text style={styles.bold}>Situation:</Text> 34M with post-prandial retrosternal burning for 72 hrs.</Text>
              <Text style={styles.sbarItem}><Text style={styles.bold}>Assessment:</Text> Acid Peptic Disease (GERD). Red flags negative.</Text>
              <Text style={styles.sbarItem}><Text style={styles.bold}>Recommendation:</Text> CDSCO-approved OTC antacid suspension.</Text>
            </View>
          )}

          {simStep >= 4 && (
            <View style={styles.whatsappPreview}>
              <Text style={styles.waTag}>📱 WhatsApp Dispatch: Token #INTAKE-0042</Text>
              <Text style={styles.waText}>
                Summary sent to +919876543210. Show this to your pharmacist for safe OTC dispensing.
              </Text>
            </View>
          )}

          <View style={styles.simActionRow}>
            {!simulating ? (
              <Button
                title="▶ Start Voice Simulation"
                variant="primary"
                onPress={startSimulation}
                style={styles.simBtn}
              />
            ) : (
              <Button
                title="↺ Reset Demo"
                variant="outline"
                onPress={resetSimulation}
                style={styles.simBtn}
              />
            )}
          </View>
        </View>
      </View>

      {/* Quick Nav Grid */}
      <View style={styles.navGrid}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("DoctorsTab")}
          style={styles.navCard}
        >
          <Text style={styles.navIcon}>🩺</Text>
          <Text style={styles.navCardTitle}>Consult Doctors</Text>
          <Text style={styles.navCardSubtitle}>NMC Verified Tele-RMPs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("CatalogTab")}
          style={styles.navCard}
        >
          <Text style={styles.navIcon}>💊</Text>
          <Text style={styles.navCardTitle}>OTC Catalog</Text>
          <Text style={styles.navCardSubtitle}>CDSCO 2026 Compliant</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("PharmacistTab")}
        style={styles.pharmacistLaunchCard}
      >
        <Text style={styles.pharmacistLaunchTitle}>
          🏥 Launch Pharmacist Triage Console (RPh) ›
        </Text>
        <Text style={styles.pharmacistLaunchSub}>
          4-Column clinical review of active patient intakes with SBAR and red flags.
        </Text>
      </TouchableOpacity>

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
  heroBanner: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  heroBadge: {
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
    lineHeight: 28,
  },
  heroTitleHighlight: {
    color: colors.primary,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 14,
  },
  heroCallBtn: {
    width: "100%",
  },
  qrPosterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 20,
    alignItems: "center",
  },
  posterHeader: {
    backgroundColor: colors.primary,
    width: "100%",
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginBottom: 14,
  },
  posterTag: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  posterTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 2,
  },
  qrBox: {
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#99F6E4",
    borderRadius: borderRadius.lg,
    padding: 18,
    alignItems: "center",
    width: "100%",
  },
  qrGraphic: {
    width: 140,
    height: 140,
    backgroundColor: colors.textPrimary,
    borderRadius: borderRadius.md,
    padding: 10,
    justifyContent: "space-between",
  },
  qrCorners: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cornerSquare: {
    width: 28,
    height: 28,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  cornerSmall: {
    width: 22,
    height: 22,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    borderRadius: 4,
  },
  qrCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  qrBrand: {
    backgroundColor: colors.primary,
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qrActionText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 12,
  },
  qrSubText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
  openDialerBtn: {
    backgroundColor: colors.secondary,
    width: "100%",
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginTop: 12,
  },
  openDialerText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  statutoryNote: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 8,
  },
  stepsSection: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  stepDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
    lineHeight: 15,
  },
  simBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 20,
  },
  simHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingBottom: 8,
    marginBottom: 10,
  },
  simTag: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  simTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  simBody: {
    gap: 10,
  },
  simStatus: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  simLog: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  simSpeech: {
    backgroundColor: colors.surfaceMuted,
    padding: 10,
    borderRadius: borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  speakerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
  },
  speechText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontStyle: "italic",
    marginTop: 2,
  },
  sbarResult: {
    backgroundColor: colors.primaryLight,
    padding: 10,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: "#99F6E4",
  },
  sbarTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
    marginBottom: 4,
  },
  sbarItem: {
    fontSize: 11,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  bold: {
    fontWeight: "700",
  },
  whatsappPreview: {
    backgroundColor: colors.greenLight,
    padding: 10,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  waTag: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.greenSafe,
  },
  waText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  simActionRow: {
    marginTop: 6,
  },
  simBtn: {
    width: "100%",
  },
  navGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  navCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
  },
  navIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  navCardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  navCardSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  pharmacistLaunchCard: {
    backgroundColor: colors.textPrimary,
    borderRadius: borderRadius.lg,
    padding: 14,
    alignItems: "center",
  },
  pharmacistLaunchTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  pharmacistLaunchSub: {
    color: "#94A3B8",
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
});
