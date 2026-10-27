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

interface VoiceCallActiveScreenProps {
  onComplete: (intakeData: any) => void;
  onCancel: () => void;
  language?: string;
}

export function VoiceCallActiveScreen({
  onComplete,
  onCancel,
  language = "Hindi",
}: VoiceCallActiveScreenProps) {
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
      onComplete({
        patientName: "Rajesh Kumar",
        age: 42,
        gender: "Male",
        complaint: "Epigastric burning & dyspepsia",
        durationDays: 2,
        severity: 5,
        redFlagsCleared: [
          "No radiating chest/arm pain (ACS Rule-Out)",
          "No hematemesis or melena stool",
          "No persistent vomiting",
        ],
        triageLevel: "YELLOW",
      });
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
          <View style={styles.pulseDot} />
          <Text style={styles.liveText}>DRGODLY INTAKE LIVE</Text>
        </View>
        <Text style={styles.timer}>{formatTimer(secondsElapsed)}</Text>
      </View>

      {/* Voice Visualizer Avatar */}
      <View style={styles.visualizerContainer}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarIcon}>🩺</Text>
        </View>
        <View style={styles.waveformRow}>
          {[40, 65, 90, 110, 80, 55, 75, 95, 60, 45].map((h, i) => (
            <View
              key={i}
              style={[
                styles.waveformBar,
                { height: isMuted ? 10 : h * (0.4 + (i % 3) * 0.2) },
              ]}
            />
          ))}
        </View>
        <Text style={styles.topicPill}>Current Phase: {activeTurn.topic}</Text>
      </View>

      {/* Real-time Bilingual Transcript */}
      <ScrollView style={styles.transcriptBox} contentContainerStyle={styles.transcriptContent}>
        <View style={styles.bubbleAI}>
          <Text style={styles.speakerLabel}>DrGodly Assistant ({language}):</Text>
          <Text style={styles.bubbleTextAI}>{activeTurn.ai}</Text>
        </View>
        <View style={styles.bubblePatient}>
          <Text style={styles.speakerLabelPatient}>Patient (Speech-to-Text):</Text>
          <Text style={styles.bubbleTextPatient}>{activeTurn.patient}</Text>
        </View>
      </ScrollView>

      {/* Interactive Turn Simulation & Controls */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.advanceTurnButton}
          onPress={handleNextTurn}
          activeOpacity={0.8}
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
            onPress={onCancel}
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
    backgroundColor: colors.card,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.greenSafe,
    marginRight: 8,
  },
  liveText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.greenSafe,
    letterSpacing: 0.8,
  },
  timer: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  visualizerContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: colors.primaryLight,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarIcon: {
    fontSize: 34,
  },
  waveformRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    marginBottom: 12,
  },
  waveformBar: {
    width: 5,
    backgroundColor: colors.secondary,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  topicPill: {
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  transcriptBox: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transcriptContent: {
    paddingVertical: 16,
  },
  bubbleAI: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    borderBottomLeftRadius: 4,
    padding: 14,
    marginBottom: 12,
    maxWidth: "88%",
  },
  bubblePatient: {
    backgroundColor: colors.secondaryLight,
    borderRadius: 14,
    borderBottomRightRadius: 4,
    padding: 14,
    marginBottom: 12,
    maxWidth: "88%",
    alignSelf: "flex-end",
  },
  speakerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  speakerLabelPatient: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.secondaryDark,
    marginBottom: 4,
  },
  bubbleTextAI: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  bubbleTextPatient: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  advanceTurnButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  advanceTurnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controlBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
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
    borderColor: colors.redEmergency,
  },
  endCallBtn: {
    backgroundColor: colors.redEmergency,
    borderColor: colors.redEmergency,
  },
  controlIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  controlLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});
