import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { colors } from "../theme/colors";
import { borderRadius, shadows } from "../theme/spacing";

interface VoiceCallActiveScreenProps {
  onComplete?: (intakeData: any) => void;
  onCancel?: () => void;
  language?: string;
  navigation?: any;
  route?: { params?: { language?: string } };
}

export function VoiceCallActiveScreen({
  onComplete,
  onCancel,
  language: propLang,
  navigation,
  route,
}: VoiceCallActiveScreenProps) {
  const language = propLang || route?.params?.language || "Hindi";
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<number>(0);

  const dialogueScript = [
    {
      ai: "Namaste! Main DrGodly AI clinical assistant hoon. Kripya apna naam aur umar bataiye.",
      patient: "Mera naam Rajesh Kumar hai, meri umar 42 saal hai.",
      topic: "Demographics Verification",
    },
    {
      ai: "Dhanyawaad Rajesh ji. Aaj aapko kya takleef ho rahi hai aur ye kitne din se hai?",
      patient: "Mujhe pet ke upar ke hisse me bohot jalan aur acidity hai, 2 din se chal raha hai.",
      topic: "Chief Complaint & Duration",
    },
    {
      ai: "Samajh gaya. 1 se 10 ke paimane par dard kitna tez hai? Aur kya ye dard seene ya baayein haath me jaa raha hai?",
      patient: "Dard lagbhag 5/10 hai. Haath me nahi jaa raha, sirf khane ke baad pet me jalan badhti hai.",
      topic: "Severity & Cardiac Red Flag Rule-Out",
    },
    {
      ai: "Kya aapko ulti me khoon, ya kala mal aane jaisi koi dikkat hui hai?",
      patient: "Nahi, aisi koi dikkat nahi hai. Bas jalan aur thoda aafra (bloating) hai.",
      topic: "GI Bleeding Screening",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleNextTurn = () => {
    if (currentTurn < dialogueScript.length - 1) {
      setCurrentTurn((prev) => prev + 1);
    } else {
      // Intake complete
      const intakeData = {
        patientName: "Rajesh Kumar",
        age: 42,
        gender: "Male",
        chiefComplaint: "Epigastric burning & dyspepsia",
        duration: "2 Days",
        severity: 5,
        redFlagsCleared: [
          "No radiating chest/arm pain (ACS Rule-Out)",
          "No hematemesis or melena stool",
          "No persistent vomiting",
        ],
        triageLevel: "YELLOW",
      };
      if (onComplete) {
        onComplete(intakeData);
      } else if (navigation?.navigate) {
        navigation.navigate("IntakeCompleted", intakeData);
      }
    }
  };

  const handleEmergencyHandoff = () => {
    Alert.alert(
      "Emergency Assistance",
      "Calling 108 Emergency Ambulance or transfer to counter pharmacist immediately.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Dial 108", style: "destructive", onPress: () => {} },
      ]
    );
  };

  const activeTurn = dialogueScript[currentTurn];

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.liveIndicator}>
          <View style={styles.pulseContainer}>
            <View style={styles.pulseRing} />
            <View style={styles.pulseDot} />
          </View>
          <Text style={styles.liveText}>DRGODLY INTAKE LIVE</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{formatTimer(secondsElapsed)}</Text>
        </View>
      </View>

      {/* Voice Visualizer Avatar */}
      <View style={styles.visualizerContainer}>
        <View style={styles.avatarGlow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>🩺</Text>
          </View>
        </View>
        
        <View style={styles.waveformRow}>
          {[40, 65, 90, 110, 80, 55, 75, 95, 60, 45].map((h, i) => (
            <View
              key={i}
              style={[
                styles.waveformBar,
                { height: isMuted ? 8 : h * (0.35 + (i % 3) * 0.22) },
              ]}
            />
          ))}
        </View>

        <View style={styles.topicPill}>
          <Text style={styles.topicPillText}>Current Focus: {activeTurn.topic}</Text>
        </View>
      </View>

      {/* Real-time Bilingual Transcript */}
      <ScrollView style={styles.transcriptBox} contentContainerStyle={styles.transcriptContent}>
        <View style={styles.bubbleAI}>
          <View style={styles.bubbleHeaderRow}>
            <Text style={styles.speakerLabel}>DrGodly Assistant ({language})</Text>
            <Text style={styles.bubbleTime}>AI Voice</Text>
          </View>
          <Text style={styles.bubbleTextAI}>{activeTurn.ai}</Text>
        </View>

        <View style={styles.bubblePatient}>
          <View style={styles.bubbleHeaderRow}>
            <Text style={styles.speakerLabelPatient}>Patient (Rajesh Kumar)</Text>
            <Text style={styles.bubbleTimePatient}>Speech-to-Text</Text>
          </View>
          <Text style={styles.bubbleTextPatient}>{activeTurn.patient}</Text>
        </View>
      </ScrollView>

      {/* Interactive Turn Simulation & Controls */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.advanceTurnButton}
          onPress={handleNextTurn}
          activeOpacity={0.85}
        >
          <Text style={styles.advanceTurnText}>
            {currentTurn < dialogueScript.length - 1
              ? `Next Question (${currentTurn + 1}/${dialogueScript.length}) →`
              : "Finish Voice Intake & Generate SBAR ✓"}
          </Text>
        </TouchableOpacity>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Text style={styles.controlIcon}>{isMuted ? "🔇" : "🎤"}</Text>
            <Text style={styles.controlLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, styles.emergencyBtn]}
            onPress={handleEmergencyHandoff}
          >
            <Text style={styles.controlIcon}>🚨</Text>
            <Text style={[styles.controlLabel, { color: colors.redEmergency }]}>
              Dial 108
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, styles.endCallBtn]}
            onPress={() => (onCancel ? onCancel() : navigation?.goBack ? navigation.goBack() : null)}
          >
            <Text style={styles.controlIcon}>📞</Text>
            <Text style={[styles.controlLabel, { color: "#FFFFFF" }]}>
              End Call
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    ...shadows.sm,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  pulseContainer: {
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  pulseRing: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(16, 185, 129, 0.25)",
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.greenSafe,
  },
  liveText: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.greenSafe,
    letterSpacing: 0.8,
  },
  timerContainer: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  timer: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  visualizerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorderLight,
  },
  avatarGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  avatarIcon: {
    fontSize: 30,
  },
  waveformRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    marginBottom: 12,
    gap: 4,
  },
  waveformBar: {
    width: 4.5,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  topicPill: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  topicPillText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  transcriptBox: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transcriptContent: {
    paddingVertical: 16,
  },
  bubbleAI: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    borderBottomLeftRadius: 4,
    padding: 14,
    marginBottom: 12,
    maxWidth: "90%",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.sm,
  },
  bubblePatient: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.xl,
    borderBottomRightRadius: 4,
    padding: 14,
    marginBottom: 12,
    maxWidth: "90%",
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    ...shadows.sm,
  },
  bubbleHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  speakerLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.2,
  },
  bubbleTime: {
    fontSize: 9.5,
    color: colors.textMuted,
    fontWeight: "600",
  },
  speakerLabelPatient: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primaryDark,
    letterSpacing: 0.2,
  },
  bubbleTimePatient: {
    fontSize: 9.5,
    color: colors.primary,
    fontWeight: "600",
  },
  bubbleTextAI: {
    fontSize: 13.5,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  bubbleTextPatient: {
    fontSize: 13.5,
    color: colors.textPrimary,
    lineHeight: 19,
    fontWeight: "500",
  },
  footer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    ...shadows.md,
  },
  advanceTurnButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
    ...shadows.sm,
  },
  advanceTurnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "800",
    letterSpacing: -0.1,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  controlBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surfaceMuted,
  },
  controlBtnActive: {
    backgroundColor: colors.redLight,
    borderColor: colors.redEmergency,
  },
  emergencyBtn: {
    backgroundColor: colors.redLight,
    borderColor: "#FECACA",
  },
  endCallBtn: {
    backgroundColor: colors.redEmergency,
    borderColor: colors.redEmergency,
    ...shadows.sm,
  },
  controlIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  controlLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
});
