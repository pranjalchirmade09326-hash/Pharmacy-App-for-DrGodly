import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { colors } from "../theme/colors";
import { borderRadius, shadows, spacing } from "../theme/spacing";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { MOCK_INTAKES } from "../data/mockData";

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  // Voice Simulation State powered by MOCK_INTAKES[0]
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const activeIntake = MOCK_INTAKES[0];

  const dialEmergency108 = () => {
    Linking.openURL("tel:108").catch(() => {});
  };

  const dialDrGodly = () => {
    Linking.openURL("tel:+918069000000").catch(() => {});
  };

  const startSimulation = () => {
    setSimulating(true);
    setSimStep(1);
    setTimeout(() => setSimStep(2), 2200);
    setTimeout(() => setSimStep(3), 4400);
    setTimeout(() => setSimStep(4), 6800);
  };

  const resetSimulation = () => {
    setSimulating(false);
    setSimStep(0);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* 1. Counter Station Live Bar */}
        <View style={styles.counterStatusCard}>
          <View style={styles.counterLeft}>
            <View style={styles.counterDot} />
            <Text style={styles.counterText}>
              Apollo Pharmacy • Counter #3 • Active Standee
            </Text>
          </View>
          <View style={styles.counterBadge}>
            <Text style={styles.counterBadgeText}>R.Ph Sandeep M.</Text>
          </View>
        </View>

        {/* 1B. Visual Healthcare Hero Showcase */}
        <View style={styles.heroVisualCard}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80" }}
            style={styles.heroVisualImage}
            resizeMode="cover"
          />
          <View style={styles.heroVisualOverlay}>
            <View style={styles.heroVisualBadgeRow}>
              <View style={styles.officialBadge}>
                <Text style={styles.officialBadgeText}>🇮🇳 CDSCO 2026 VERIFIED</Text>
              </View>
              <View style={styles.pciBadge}>
                <Text style={styles.pciBadgeText}>NMC 2020 GUIDELINES</Text>
              </View>
            </View>
            <Text style={styles.heroVisualTitle}>AI Clinical Counter Assist</Text>
            <Text style={styles.heroVisualSubtitle}>
              Triage Red-Flags • Multilingual Voice • Instant SBAR
            </Text>
          </View>
        </View>

        {/* 2. Hero Card */}
        <View style={styles.heroBanner}>
          <View style={styles.heroHeaderRow}>
            <Badge label="✦ AI Clinical Counter Assist • 24/7 Live" variant="blue" style={styles.heroBadge} />
            <View style={styles.livePulseContainer}>
              <View style={styles.livePulseDot} />
              <Text style={styles.livePulseText}>ONLINE</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Not feeling well?{"\n"}
            <Text style={styles.heroTitleHighlight}>Talk to DrGodly</Text> at the counter.
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Scan the counter standee or tap call to describe your symptoms in your native language. An instant SBAR clinical note is sent to WhatsApp for safe dispensing.
          </Text>

          <Button
            title="📞 Tap to Call DrGodly (+91-8069-000-000)"
            variant="primary"
            size="lg"
            onPress={dialDrGodly}
            style={styles.heroCallBtn}
          />
        </View>

        {/* 4. Acrylic Counter Standee QR Card */}
        <View style={styles.qrPosterCard}>
          <View style={styles.posterHeader}>
            <Text style={styles.posterTag}>IN-STORE DIGITAL CLINICAL TRIAGE</Text>
            <Text style={styles.posterTitle}>Scan to Speak with DrGodly</Text>
            <Text style={styles.posterSub}>Instant Multilingual Voice Intake • Zero App Download Required</Text>
          </View>

          {/* Graphic QR Box with Corner Markers & DrGodly Brand */}
          <View style={styles.qrBox}>
            <View style={styles.qrGraphic}>
              <Image
                source={{ uri: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=tel:+918069000000&color=185ADB" }}
                style={styles.qrCodeImage}
                resizeMode="contain"
              />
              <View style={styles.qrBrand}>
                <Text style={styles.qrBrandText}>DRGODLY AI</Text>
              </View>
            </View>

            <View style={styles.qrScanPill}>
              <Text style={styles.qrActionText}>Universal 1-Tap Camera Scan</Text>
            </View>
            <Text style={styles.qrSubText}>
              Scan from any camera to call +91-8069-000-000 for voice intake
            </Text>
          </View>

          {/* Primary CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("LanguageConsent")}
            style={styles.startVoiceBtn}
          >
            <Text style={styles.startVoiceBtnText}>
              🎙️ Start In-App Voice Intake Call Now ›
            </Text>
          </TouchableOpacity>

          {/* Secondary Outline Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={dialDrGodly}
            style={styles.openDialerBtn}
          >
            <Text style={styles.openDialerText}>Open Phone Dialer</Text>
          </TouchableOpacity>

          <Text style={styles.statutoryNote}>
            DrGodly is an AI clinical assistant. It does not replace a doctor.
          </Text>
        </View>

        {/* 5. Interactive Live SBAR Voice Simulator */}
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
                  Tap below to simulate an incoming patient voice intake call ({activeIntake.patientName}, {activeIntake.age}M — {activeIntake.chiefComplaint}) and watch unstructured speech convert into an instant structured SBAR clinical note.
                </Text>
              </View>
            )}

            {/* Step 1: Patient Hindi Audio Bubble */}
            {simStep === 1 && (
              <View style={styles.simSpeech}>
                <View style={styles.speakerBadgeRow}>
                  <Text style={styles.speakerLabel}>PATIENT AUDIO ({activeIntake.language}):</Text>
                  <Text style={styles.timestampText}>00:04</Text>
                </View>
                <Text style={styles.speechText}>
                  &ldquo;Namaste DrGodly, mujhe 3 din se pet me tez jalan aur khatti dakar aa rahi hai khane ke baad...&rdquo;
                </Text>
              </View>
            )}

            {/* Step 2: DrGodly AI Red-Flag Check Bubble */}
            {simStep === 2 && (
              <View style={styles.simSpeechAI}>
                <View style={styles.speakerBadgeRow}>
                  <Text style={styles.speakerLabelAI}>DRGODLY AI RED-FLAG SCREENING:</Text>
                  <Text style={styles.timestampText}>00:11</Text>
                </View>
                <Text style={styles.speechTextAI}>
                  &ldquo;Kya aapko nigalne me dard, ya ulti me khoon aaya hai?&rdquo; &rarr; Patient: &ldquo;Nahi, bilkul nahi.&rdquo;
                </Text>
              </View>
            )}

            {/* Step 3: Structured SBAR Card Output */}
            {simStep >= 3 && (
              <View style={styles.sbarResult}>
                <View style={styles.sbarTitleRow}>
                  <Text style={styles.sbarCheckIcon}>✓</Text>
                  <Text style={styles.sbarTitle}>Structured SBAR Clinical Note Generated</Text>
                </View>
                <View style={styles.sbarDivider} />
                <Text style={styles.sbarItem}><Text style={styles.bold}>Situation:</Text> {activeIntake.sbar.situation}</Text>
                <Text style={styles.sbarItem}><Text style={styles.bold}>Background:</Text> {activeIntake.sbar.background}</Text>
                <Text style={styles.sbarItem}><Text style={styles.bold}>Assessment:</Text> {activeIntake.sbar.assessment}</Text>
                <Text style={styles.sbarItem}><Text style={styles.bold}>Recommendation:</Text> {activeIntake.sbar.recommendation}</Text>
              </View>
            )}

            {/* Step 4: WhatsApp Token Badge */}
            {simStep >= 4 && (
              <View style={styles.whatsappPreview}>
                <View style={styles.waTagRow}>
                  <Text style={styles.waIcon}>💬</Text>
                  <Text style={styles.waTag}>WhatsApp Delivered: Token {activeIntake.tokenNumber}</Text>
                </View>
                <Text style={styles.waText}>
                  Structured SBAR clinical summary sent to patient WhatsApp. Show this token to the counter pharmacist for safe dispensing.
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

        {/* Seasonal Epidemic / Dengue Diagnostic Alert */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("LabsTab")}
          style={styles.epidemicAlertCard}
        >
          <View style={styles.epidemicHeaderRow}>
            <View style={styles.epidemicTagPill}>
              <Text style={styles.epidemicTagText}>🚨 SEASONAL HEALTH ALERT • DELHI NCR</Text>
            </View>
            <Text style={styles.epidemicArrowText}>Book Lab Test ›</Text>
          </View>
          <Text style={styles.epidemicTitle}>
            Viral Fever & Dengue Cases Surging Locally
          </Text>
          <Text style={styles.epidemicSub}>
            Suspecting fever? Get 4-Hour STAT Complete Blood Count (CBC) & Platelet count at home in 45 mins from certified partner labs.
          </Text>
        </TouchableOpacity>

        {/* 6. Quick Care Grid (4 Cards with Photographic Thumbnails) */}
        <View style={styles.navGrid}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("DoctorsTab")}
            style={styles.navCard}
          >
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80" }}
              style={styles.navCardImage}
              resizeMode="cover"
            />
            <View style={styles.navCardTextContainer}>
              <View style={[styles.navIconContainer, { backgroundColor: "#EFF6FF" }]}>
                <Text style={styles.navIcon}>🩺</Text>
              </View>
              <Text style={styles.navCardTitle}>Consult Doctors</Text>
              <Text style={styles.navCardSubtitle}>NMC Verified Tele-RMPs</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("CatalogTab")}
            style={styles.navCard}
          >
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80" }}
              style={styles.navCardImage}
              resizeMode="cover"
            />
            <View style={styles.navCardTextContainer}>
              <View style={[styles.navIconContainer, { backgroundColor: "#ECFDF5" }]}>
                <Text style={styles.navIcon}>💊</Text>
              </View>
              <Text style={styles.navCardTitle}>OTC Catalog</Text>
              <Text style={styles.navCardSubtitle}>CDSCO 2026 Compliant</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.navGrid, { marginTop: -4 }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("LabsTab")}
            style={styles.navCard}
          >
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=300&auto=format&fit=crop&q=80" }}
              style={styles.navCardImage}
              resizeMode="cover"
            />
            <View style={styles.navCardTextContainer}>
              <View style={[styles.navIconContainer, { backgroundColor: "#FAF5FF" }]}>
                <Text style={styles.navIcon}>🧪</Text>
              </View>
              <Text style={styles.navCardTitle}>Diagnostic Labs</Text>
              <Text style={styles.navCardSubtitle}>NABL Certified At-Home</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("HealthRecords")}
            style={styles.navCard}
          >
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=300&auto=format&fit=crop&q=80" }}
              style={styles.navCardImage}
              resizeMode="cover"
            />
            <View style={styles.navCardTextContainer}>
              <View style={[styles.navIconContainer, { backgroundColor: "#FFFBEB" }]}>
                <Text style={styles.navIcon}>📂</Text>
              </View>
              <Text style={styles.navCardTitle}>Health Vault</Text>
              <Text style={styles.navCardSubtitle}>ABHA ID & Records</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 7. Pharmacist Console Teaser (Dark Slate Card) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("PharmacistTab")}
          style={styles.pharmacistLaunchCard}
        >
          <View style={styles.pharmacistLaunchContent}>
            <View style={styles.pharmacistBadge}>
              <Text style={styles.pharmacistBadgeText}>PHARMACIST CONSOLE (R.PH)</Text>
            </View>
            <Text style={styles.pharmacistLaunchTitle}>
              Launch Pharmacist Triage Queue (R.Ph) ›
            </Text>
            <Text style={styles.pharmacistLaunchSub}>
              Review patient SBAR intakes, verify 8 red flags, and sign off on safe OTC dispensing or doctor referrals.
            </Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heroVisualCard: {
    height: 160,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
    ...shadows.sm,
  },
  heroVisualImage: {
    width: "100%",
    height: "100%",
  },
  heroVisualOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    padding: 16,
    justifyContent: "flex-end",
  },
  heroVisualBadgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  officialBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  officialBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  pciBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pciBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  heroVisualTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  heroVisualSubtitle: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "500",
  },
  qrCodeImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 6,
  },
  navCardImage: {
    width: "100%",
    height: 70,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  navCardTextContainer: {
    padding: 12,
    paddingTop: 8,
    alignItems: "center",
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
    textAlign: "center",
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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
  counterStatusCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
    ...shadows.sm,
  },
  counterLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 6,
  },
  counterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.greenSafe,
    marginRight: 6,
  },
  counterText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  counterBadge: {
    backgroundColor: colors.blueLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  counterBadgeText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.primary,
  },
  epidemicAlertCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: borderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: 12,
    ...shadows.sm,
  },
  epidemicHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  epidemicTagPill: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  epidemicTagText: {
    fontSize: 9.5,
    fontWeight: "900",
    color: colors.redEmergency,
    letterSpacing: 0.5,
  },
  epidemicArrowText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  epidemicTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#92400E",
    letterSpacing: -0.2,
  },
  epidemicSub: {
    fontSize: 11,
    color: "#78350F",
    marginTop: 3,
    lineHeight: 15,
  },
});
