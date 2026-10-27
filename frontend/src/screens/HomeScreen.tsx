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
import { borderRadius, shadows, spacing } from "../theme/spacing";
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
        <View style={styles.heroHeaderRow}>
          <Badge label="✦ AI Clinical Counter Assist" variant="blue" style={styles.heroBadge} />
          <View style={styles.livePulseContainer}>
            <View style={styles.livePulseDot} />
            <Text style={styles.livePulseText}>24/7 ONLINE</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>
          Not feeling well?{"\n"}
          <Text style={styles.heroTitleHighlight}>Consult DrGodly</Text> at the counter.
        </Text>
        
        <Text style={styles.heroSubtitle}>
          Scan the pharmacy standee, explain your symptoms in your preferred language, and receive an instant structured clinical intake report on WhatsApp for safe OTC dispensing.
        </Text>

        <Button
          title="📞 Tap to Call DrGodly (+91-8069-000-000)"
          variant="primary"
          size="lg"
          onPress={dialDrGodly}
          style={styles.heroCallBtn}
        />
      </View>

      {/* Pharmacy Counter Acrylic Standee Card */}
      <View style={styles.qrPosterCard}>
        <View style={styles.posterHeader}>
          <Text style={styles.posterTag}>IN-STORE DIGITAL CLINICAL TRIAGE</Text>
          <Text style={styles.posterTitle}>Scan to Speak with DrGodly</Text>
          <Text style={styles.posterSub}>Instant Voice Consultation • Zero App Download Required</Text>
        </View>

        {/* QR Code Graphic Box */}
        <View style={styles.qrBox}>
          <View style={styles.qrGraphic}>
            <View style={styles.qrCorners}>
              <View style={styles.cornerSquare} />
              <View style={styles.cornerSquare} />
            </View>
            <View style={styles.qrCenter}>
              <View style={styles.qrBrand}>
                <Text style={styles.qrBrandText}>DRGODLY</Text>
              </View>
            </View>
            <View style={styles.qrCorners}>
              <View style={styles.cornerSquare} />
              <View style={styles.cornerSmall} />
            </View>
          </View>

          <View style={styles.qrScanPill}>
            <Text style={styles.qrActionText}>Universal 1-Tap Camera Scan</Text>
          </View>
          <Text style={styles.qrSubText}>
            Opens phone dialer with tel:+918069000000
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("LanguageConsent")}
          style={styles.startVoiceBtn}
        >
          <Text style={styles.startVoiceBtnText}>
            🎙️ Start In-App Voice Intake Call Now ›
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={dialDrGodly}
          style={styles.openDialerBtn}
        >
          <Text style={styles.openDialerText}>Open Phone Dialer</Text>
        </TouchableOpacity>

        <Text style={styles.statutoryNote}>
          DrGodly is an AI clinical assistant. It does not replace a licensed medical doctor.
        </Text>
      </View>

      {/* 4-Step Walkthrough */}
      <View style={styles.stepsSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>How It Works at the Counter</Text>
          <Text style={styles.sectionSub}>4-step rapid clinical protocol</Text>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Scan Counter QR</Text>
            <Text style={styles.stepDesc}>
              Scan the standee with your smartphone camera. A universal link immediately launches the voice intake.
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>AI Voice Clinical Intake</Text>
            <Text style={styles.stepDesc}>
              Speak naturally in Hindi, English, Tamil, or Telugu. DrGodly screens chief complaints and rules out red flags.
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>WhatsApp Clinical Report</Text>
            <Text style={styles.stepDesc}>
              Structured SBAR clinical summary delivered directly to the patient&apos;s WhatsApp within seconds.
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pharmacist Review & Dispense</Text>
            <Text style={styles.stepDesc}>
              The counter pharmacist verifies the report, dispenses CDSCO-compliant OTC relief, or escalates to an RMP.
            </Text>
          </View>
        </View>
      </View>

      {/* Live AI Voice Intake Simulation Box */}
      <View style={styles.simBox}>
        <View style={styles.simHeader}>
          <View style={styles.simHeaderLeft}>
            <Text style={styles.simTag}>INTERACTIVE VOICE DEMO</Text>
            <Text style={styles.simTitle}>Live SBAR Intake Simulator</Text>
          </View>
          <View style={[styles.simStatusPill, simulating && styles.simStatusPillActive]}>
            <Text style={[styles.simStatusPillText, simulating && styles.simStatusPillTextActive]}>
              {simulating ? `LIVE STEP ${simStep}/4` : "READY"}
            </Text>
          </View>
        </View>

        <View style={styles.simBody}>
          {simulating && (
            <View style={styles.waveformRow}>
              {[20, 36, 52, 28, 44, 60, 32, 48, 24].map((h, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.waveformBar,
                    { height: h * (0.5 + ((simStep + idx) % 3) * 0.25) },
                  ]}
                />
              ))}
            </View>
          )}

          {simStep === 0 && (
            <View style={styles.simStandbyBox}>
              <Text style={styles.simStandbyIcon}>🎙️</Text>
              <Text style={styles.simLog}>
                Simulate an incoming patient call (Rahul Sharma, 34M — Acid Peptic Disease) to see real-time multilingual questioning and SBAR clinical extraction.
              </Text>
            </View>
          )}

          {simStep === 1 && (
            <View style={styles.simSpeech}>
              <View style={styles.speakerBadgeRow}>
                <Text style={styles.speakerLabel}>PATIENT AUDIO (Hindi):</Text>
                <Text style={styles.timestampText}>00:04</Text>
              </View>
              <Text style={styles.speechText}>
                &ldquo;Namaste DrGodly, mujhe 3 din se pet me tez jalan aur khatti dakar aa rahi hai khane ke baad...&rdquo;
              </Text>
            </View>
          )}

          {simStep === 2 && (
            <View style={styles.simSpeechAI}>
              <View style={styles.speakerBadgeRow}>
                <Text style={styles.speakerLabelAI}>DRGODLY CLINICAL INTAKE:</Text>
                <Text style={styles.timestampText}>00:11</Text>
              </View>
              <Text style={styles.speechTextAI}>
                &ldquo;Kya aapko nigalne me dard, ya ulti me khoon aaya hai?&rdquo; &rarr; Patient: &ldquo;Nahi, bilkul nahi.&rdquo;
              </Text>
            </View>
          )}

          {simStep >= 3 && (
            <View style={styles.sbarResult}>
              <View style={styles.sbarTitleRow}>
                <Text style={styles.sbarCheckIcon}>✓</Text>
                <Text style={styles.sbarTitle}>SBAR Clinical Extraction Generated</Text>
              </View>
              <View style={styles.sbarDivider} />
              <Text style={styles.sbarItem}><Text style={styles.bold}>Situation:</Text> 34M with post-prandial retrosternal burning for 72 hrs.</Text>
              <Text style={styles.sbarItem}><Text style={styles.bold}>Assessment:</Text> Acid Peptic Disease (GERD). Red flags ruled out.</Text>
              <Text style={styles.sbarItem}><Text style={styles.bold}>Recommendation:</Text> CDSCO-approved OTC antacid suspension.</Text>
            </View>
          )}

          {simStep >= 4 && (
            <View style={styles.whatsappPreview}>
              <View style={styles.waTagRow}>
                <Text style={styles.waIcon}>💬</Text>
                <Text style={styles.waTag}>WhatsApp Dispatch: Token #INTAKE-0042</Text>
              </View>
              <Text style={styles.waText}>
                Clinical summary sent to +91 98765 43210. Present this to your counter pharmacist for verified OTC dispensing.
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

      {/* Quick Nav Grid (US Digital Health Services) */}
      <View style={styles.navGrid}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("DoctorsTab")}
          style={styles.navCard}
        >
          <View style={[styles.navIconContainer, { backgroundColor: "#EFF6FF" }]}>
            <Text style={styles.navIcon}>🩺</Text>
          </View>
          <Text style={styles.navCardTitle}>Consult Doctors</Text>
          <Text style={styles.navCardSubtitle}>NMC Verified Tele-RMPs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("CatalogTab")}
          style={styles.navCard}
        >
          <View style={[styles.navIconContainer, { backgroundColor: "#ECFDF5" }]}>
            <Text style={styles.navIcon}>💊</Text>
          </View>
          <Text style={styles.navCardTitle}>OTC Catalog</Text>
          <Text style={styles.navCardSubtitle}>CDSCO 2026 Compliant</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.navGrid, { marginTop: -4 }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("LabsTab")}
          style={styles.navCard}
        >
          <View style={[styles.navIconContainer, { backgroundColor: "#FAF5FF" }]}>
            <Text style={styles.navIcon}>🧪</Text>
          </View>
          <Text style={styles.navCardTitle}>Diagnostic Labs</Text>
          <Text style={styles.navCardSubtitle}>NABL Certified At-Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("HealthRecords")}
          style={styles.navCard}
        >
          <View style={[styles.navIconContainer, { backgroundColor: "#FFFBEB" }]}>
            <Text style={styles.navIcon}>📂</Text>
          </View>
          <Text style={styles.navCardTitle}>Health Vault</Text>
          <Text style={styles.navCardSubtitle}>ABHA ID & Documents</Text>
        </TouchableOpacity>
      </View>

      {/* Manual Typing Form Card */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("SymptomIntake")}
        style={styles.manualIntakeCard}
      >
        <View style={styles.manualIntakeLeft}>
          <View style={styles.manualIntakeIconBox}>
            <Text style={styles.manualIntakeIcon}>📝</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.manualIntakeTitle}>
              Prefer Typing? Manual Symptom Intake Form
            </Text>
            <Text style={styles.manualIntakeSub}>
              Guided step-by-step clinical questions with CDSCO safety rule-outs.
            </Text>
          </View>
        </View>
        <Text style={styles.chevronIcon}>›</Text>
      </TouchableOpacity>

      {/* Pharmacist Triage Console Card */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("PharmacistTab")}
        style={styles.pharmacistLaunchCard}
      >
        <View style={styles.pharmacistLaunchContent}>
          <View style={styles.pharmacistBadge}>
            <Text style={styles.pharmacistBadgeText}>PHARMACIST CONSOLE</Text>
          </View>
          <Text style={styles.pharmacistLaunchTitle}>
            Launch Pharmacist Triage Queue (R.Ph) ›
          </Text>
          <Text style={styles.pharmacistLaunchSub}>
            Clinical review of incoming counter intakes with SBAR summary and red flag alerts.
          </Text>
        </View>
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
    padding: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginBottom: 16,
    ...shadows.sm,
  },
  heroHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  heroBadge: {
    alignSelf: "flex-start",
  },
  livePulseContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.greenSafe,
    marginRight: 5,
  },
  livePulseText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.greenSafe,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: colors.textPrimary,
    lineHeight: 29,
    letterSpacing: -0.6,
  },
  heroTitleHighlight: {
    color: colors.primary,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 16,
  },
  heroCallBtn: {
    width: "100%",
  },
  qrPosterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#93C5FD",
    marginBottom: 20,
    alignItems: "center",
    ...shadows.md,
  },
  posterHeader: {
    backgroundColor: colors.primary,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    marginBottom: 16,
  },
  posterTag: {
    fontSize: 10,
    fontWeight: "800",
    color: "#BFDBFE",
    letterSpacing: 0.8,
  },
  posterTitle: {
    fontSize: 16.5,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 2,
    letterSpacing: -0.2,
  },
  posterSub: {
    fontSize: 11,
    color: "#DBEAFE",
    marginTop: 2,
    fontWeight: "500",
  },
  qrBox: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: borderRadius.xl,
    padding: 18,
    alignItems: "center",
    width: "100%",
    marginBottom: 14,
  },
  qrGraphic: {
    width: 144,
    height: 144,
    backgroundColor: colors.textPrimary,
    borderRadius: borderRadius.lg,
    padding: 12,
    justifyContent: "space-between",
    ...shadows.sm,
  },
  qrCorners: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cornerSquare: {
    width: 30,
    height: 30,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    backgroundColor: colors.secondary,
    borderRadius: 6,
  },
  cornerSmall: {
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    borderRadius: 6,
  },
  qrCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  qrBrand: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  qrBrandText: {
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  qrScanPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: 12,
    ...shadows.sm,
  },
  qrActionText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  qrSubText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 4,
  },
  startVoiceBtn: {
    backgroundColor: colors.secondary,
    width: "100%",
    paddingVertical: 13,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    marginBottom: 8,
    ...shadows.sm,
  },
  startVoiceBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.1,
  },
  openDialerBtn: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  openDialerText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  statutoryNote: {
    fontSize: 10.5,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 14,
  },
  stepsSection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    ...shadows.sm,
  },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  stepDesc: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  simBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 20,
    ...shadows.md,
  },
  simHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingBottom: 10,
    marginBottom: 12,
  },
  simHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  simTag: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.6,
  },
  simTitle: {
    fontSize: 15.5,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginTop: 1,
  },
  simStatusPill: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  simStatusPillActive: {
    backgroundColor: colors.greenLight,
    borderColor: "#A7F3D0",
  },
  simStatusPillText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.textMuted,
  },
  simStatusPillTextActive: {
    color: colors.greenSafe,
  },
  simBody: {
    gap: 10,
  },
  waveformRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
  },
  waveformBar: {
    width: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  simStandbyBox: {
    backgroundColor: colors.surfaceMuted,
    padding: 14,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  simStandbyIcon: {
    fontSize: 22,
  },
  simLog: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    flex: 1,
  },
  simSpeech: {
    backgroundColor: colors.surfaceMuted,
    padding: 12,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 3.5,
    borderLeftColor: colors.primary,
  },
  simSpeechAI: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 3.5,
    borderLeftColor: colors.secondary,
  },
  speakerBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  speakerLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  speakerLabelAI: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.secondaryDark,
    letterSpacing: 0.5,
  },
  timestampText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  speechText: {
    fontSize: 12.5,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  speechTextAI: {
    fontSize: 12.5,
    color: colors.textPrimary,
    lineHeight: 18,
    fontWeight: "500",
  },
  sbarResult: {
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: "#99F6E4",
  },
  sbarTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sbarCheckIcon: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  sbarTitle: {
    fontSize: 12.5,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  sbarDivider: {
    height: 1,
    backgroundColor: "#CCFBF1",
    marginVertical: 8,
  },
  sbarItem: {
    fontSize: 11.5,
    color: colors.textPrimary,
    marginBottom: 3,
    lineHeight: 16,
  },
  bold: {
    fontWeight: "800",
  },
  whatsappPreview: {
    backgroundColor: colors.greenLight,
    padding: 12,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  waTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  waIcon: {
    fontSize: 14,
  },
  waTag: {
    fontSize: 11.5,
    fontWeight: "800",
    color: colors.greenSafe,
  },
  waText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  simActionRow: {
    marginTop: 4,
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
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    ...shadows.sm,
  },
  navIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  navIcon: {
    fontSize: 24,
  },
  navCardTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  navCardSubtitle: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  manualIntakeCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.xl,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.sm,
  },
  manualIntakeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
    gap: 12,
  },
  manualIntakeIconBox: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  manualIntakeIcon: {
    fontSize: 18,
  },
  manualIntakeTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  manualIntakeSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 15,
  },
  chevronIcon: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: "800",
  },
  pharmacistLaunchCard: {
    backgroundColor: "#0F172A",
    borderRadius: borderRadius.xl,
    padding: 18,
    ...shadows.md,
  },
  pharmacistLaunchContent: {
    alignItems: "flex-start",
  },
  pharmacistBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginBottom: 6,
  },
  pharmacistBadgeText: {
    color: "#93C5FD",
    fontSize: 9.5,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  pharmacistLaunchTitle: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  pharmacistLaunchSub: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
});
