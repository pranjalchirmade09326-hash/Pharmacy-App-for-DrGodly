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
import { A2UIRenderer, A2UISpec } from "../components/A2UIRenderer";
import { AIAgentService, ClinicalAgentState } from "../services/aiAgentService";

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
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);
  const [emergencyTriggered, setEmergencyTriggered] = useState<string | null>(null);

  const [clinicalState, setClinicalState] = useState<ClinicalAgentState>({
    patientName: "Rajesh Kumar",
    age: 42,
    gender: "Male",
    chiefComplaint: "Epigastric burning & dyspepsia",
    duration: "2 Days",
    severity: 5,
    redFlagsCleared: ["No radiating chest/arm pain (ACS Rule-Out)"],
    triageLevel: "YELLOW",
  });

  const dialogueScript = [
    {
      ai: "Namaste! Main DrGodly AI clinical assistant hoon. Kripya apna naam aur umar bataiye.",
      patient: `Mera naam ${clinicalState.patientName} hai, meri umar ${clinicalState.age} saal hai.`,
      topic: "Demographics Verification",
    },
    {
      ai: "Dhanyawaad Rajesh ji. Aaj aapko kya takleef ho rahi hai aur ye kitne din se hai?",
      patient: `Mujhe ${clinicalState.chiefComplaint} hai, lagbhag ${clinicalState.duration} se chal raha hai.`,
      topic: "Chief Complaint & Duration",
    },
    {
      ai: "Samajh gaya. 1 se 10 ke paimane par dard kitna tez hai? Aur kya ye dard seene ya baayein haath me jaa raha hai?",
      patient: `Dard lagbhag ${clinicalState.severity}/10 hai. Haath me dard nahi jaa raha, sirf khane ke baad pet me jalan hoti hai.`,
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

  const finishIntake = () => {
    const intakeData = {
      patientName: clinicalState.patientName,
      age: clinicalState.age,
      gender: clinicalState.gender,
      chiefComplaint: clinicalState.chiefComplaint,
      duration: clinicalState.duration,
      severity: clinicalState.severity,
      redFlagsCleared: clinicalState.redFlagsCleared,
      triageLevel: clinicalState.triageLevel,
    };
    if (onComplete) {
      onComplete(intakeData);
    } else if (navigation?.navigate) {
      navigation.navigate("IntakeCompleted", intakeData);
    }
  };

  const handleNextTurn = () => {
    if (currentTurn < dialogueScript.length - 1) {
      setCurrentTurn((prev) => prev + 1);
    } else {
      finishIntake();
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

  // A2UI Action Handler from Dynamic Components
  const handleA2UIAction = (actionId: string, payload?: any) => {
    switch (actionId) {
      case "ACTION_SET_COMPLAINT":
        if (payload?.complaint) {
          setClinicalState((prev) => ({
            ...prev,
            chiefComplaint: payload.complaint,
            duration: payload.duration || prev.duration,
          }));
        }
        break;

      case "ACTION_SET_SEVERITY":
        if (payload?.severity) {
          setClinicalState((prev) => ({
            ...prev,
            severity: payload.severity,
          }));
        }
        break;

      case "ACTION_TRIGGER_REDFLAG":
        setEmergencyTriggered(payload?.redFlag || "Critical red-flag detected by AI triage.");
        setClinicalState((prev) => ({
          ...prev,
          triageLevel: "RED",
          activeRedFlag: payload?.redFlag,
        }));
        Alert.alert(
          "🚨 Emergency Red Flag Triggered",
          payload?.redFlag || "Cardiac or upper GI bleeding red flag detected.",
          [
            { text: "Dial 108 Now", style: "destructive", onPress: handleEmergencyHandoff },
            { text: "Understood", style: "cancel" },
          ]
        );
        break;

      case "ACTION_CLEAR_REDFLAG":
        if (payload?.flagCleared) {
          setClinicalState((prev) => ({
            ...prev,
            redFlagsCleared: [...prev.redFlagsCleared, payload.flagCleared],
          }));
        }
        break;

      case "ACTION_PROCEED_NEXT":
        handleNextTurn();
        break;

      case "ACTION_FINALIZE_INTAKE":
        finishIntake();
        break;

      case "ACTION_DIAL_108":
        handleEmergencyHandoff();
        break;

      case "ACTION_HANDOVER_PHARMACIST":
        Alert.alert(
          "Pharmacist Handover",
          "Case transferred to Pharmacist Triage Console with RED STAT priority.",
          [
            {
              text: "Open Triage Console",
              onPress: () => {
                if (navigation?.navigate) navigation.navigate("PharmacistTab");
              },
            },
          ]
        );
        break;

      default:
        console.log("A2UI Action:", actionId, payload);
    }
  };

  // Generate dynamic A2UI declarative specification from AI Agent Service
  const a2uiSpec: A2UISpec = emergencyTriggered
    ? AIAgentService.getEmergencyA2UISpec(emergencyTriggered, language)
    : AIAgentService.getTurnA2UISpec(currentTurn, clinicalState, language);

  const activeTurn = dialogueScript[Math.min(currentTurn, dialogueScript.length - 1)];

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

        <View style={styles.headerInfoRow}>
          <View style={styles.topicPill}>
            <Text style={styles.topicPillText}>Focus: {activeTurn.topic}</Text>
          </View>
          <TouchableOpacity
            style={[styles.a2uiTogglePill, showJsonInspector && styles.a2uiTogglePillActive]}
            onPress={() => setShowJsonInspector(!showJsonInspector)}
            activeOpacity={0.8}
          >
            <Text style={[styles.a2uiTogglePillText, showJsonInspector && styles.a2uiTogglePillTextActive]}>
              ⚡ A2UI {showJsonInspector ? "Hide JSON" : "Inspect JSON"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Real-time Bilingual Transcript & Dynamic A2UI Content */}
      <ScrollView style={styles.transcriptBox} contentContainerStyle={styles.transcriptContent}>
        {/* Raw A2UI JSON Inspector Panel (Collapsible for Developer/Demo Inspection) */}
        {showJsonInspector && (
          <View style={styles.jsonInspectorContainer}>
            <View style={styles.jsonInspectorHeader}>
              <Text style={styles.jsonInspectorTitle}>A2UI Declarative Protocol Stream</Text>
              <Text style={styles.jsonInspectorSub}>Agent-to-User Interface JSON Spec</Text>
            </View>
            <Text style={styles.jsonCodeText}>
              {JSON.stringify(a2uiSpec, null, 2)}
            </Text>
          </View>
        )}

        {/* AI Voice Bubble */}
        <View style={styles.bubbleAI}>
          <View style={styles.bubbleHeaderRow}>
            <Text style={styles.speakerLabel}>DrGodly Assistant ({language})</Text>
            <Text style={styles.bubbleTime}>AI Voice</Text>
          </View>
          <Text style={styles.bubbleTextAI}>{activeTurn.ai}</Text>
        </View>

        {/* Dynamic A2UI Interactive Agent Response Card */}
        <View style={styles.a2uiWrapper}>
          <View style={styles.a2uiTagRow}>
            <Text style={styles.a2uiTagIcon}>⚡</Text>
            <Text style={styles.a2uiTagText}>A2UI DYNAMIC INTERACTIVE AGENT WIDGET</Text>
          </View>
          <A2UIRenderer spec={a2uiSpec} onAction={handleA2UIAction} />
        </View>

        {/* Patient Speech-to-Text Bubble */}
        <View style={styles.bubblePatient}>
          <View style={styles.bubbleHeaderRow}>
            <Text style={styles.speakerLabelPatient}>Patient ({clinicalState.patientName})</Text>
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
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorderLight,
  },
  avatarGlow: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  avatarIcon: {
    fontSize: 26,
  },
  waveformRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    marginBottom: 10,
    gap: 4,
  },
  waveformBar: {
    width: 4.5,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  headerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  topicPill: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  topicPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  a2uiTogglePill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  a2uiTogglePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  a2uiTogglePillText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  a2uiTogglePillTextActive: {
    color: "#FFFFFF",
  },
  transcriptBox: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transcriptContent: {
    paddingVertical: 14,
  },
  jsonInspectorContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  jsonInspectorHeader: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
    paddingBottom: 6,
  },
  jsonInspectorTitle: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  jsonInspectorSub: {
    color: "#94A3B8",
    fontSize: 10,
  },
  jsonCodeText: {
    fontFamily: "monospace",
    color: "#E2E8F0",
    fontSize: 10.5,
    lineHeight: 15,
  },
  bubbleAI: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    borderBottomLeftRadius: 4,
    padding: 14,
    marginBottom: 8,
    maxWidth: "92%",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.sm,
  },
  a2uiWrapper: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  a2uiTagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 4,
  },
  a2uiTagIcon: {
    fontSize: 11,
  },
  a2uiTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
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
