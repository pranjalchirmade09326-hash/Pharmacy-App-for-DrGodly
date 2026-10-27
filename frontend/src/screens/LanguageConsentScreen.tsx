import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";

interface LanguageConsentScreenProps {
  onProceed?: (selectedLanguage: string) => void;
  onBack?: () => void;
  navigation?: any;
  route?: any;
}

export function LanguageConsentScreen({
  onProceed,
  onBack,
  navigation,
  route,
}: LanguageConsentScreenProps) {
  const [selectedLang, setSelectedLang] = useState<string>("hi");
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [showConsentDetails, setShowConsentDetails] = useState<boolean>(false);

  const languages = [
    { code: "en", label: "English", script: "English" },
    { code: "hi", label: "Hindi", script: "हिन्दी" },
    { code: "ta", label: "Tamil", script: "தமிழ்" },
    { code: "te", label: "Telugu", script: "తెలుగు" },
    { code: "mr", label: "Marathi", script: "मराठी" },
    { code: "kn", label: "Kannada", script: "ಕನ್ನಡ" },
    { code: "ml", label: "Malayalam", script: "മലയാളം" },
  ];

  const handleContinue = () => {
    if (!consentChecked) {
      Alert.alert(
        "Consent Required",
        "Please provide affirmative consent under India's DPDP Act 2023 to proceed with clinical symptom processing."
      );
      return;
    }
    if (onProceed) {
      onProceed(selectedLang);
    } else if (navigation?.navigate) {
      navigation.navigate("VoiceCallActive", { language: selectedLang });
    }
  };

  const handleBack = () => {
    if (onBack) onBack();
    else if (navigation?.goBack) navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {(onBack || navigation?.goBack) && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹ Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Language & Privacy Consent</Text>
        <Text style={styles.subtitle}>
          Select your comfortable language for the AI voice consultation.
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Choose Language / भाषा चुनें</Text>
      <View style={styles.langGrid}>
        {languages.map((item) => {
          const isSelected = selectedLang === item.code;
          return (
            <TouchableOpacity
              key={item.code}
              style={[styles.langCard, isSelected && styles.langCardSelected]}
              onPress={() => setSelectedLang(item.code)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.langScript,
                  isSelected && styles.langScriptSelected,
                ]}
              >
                {item.script}
              </Text>
              <Text
                style={[
                  styles.langLabel,
                  isSelected && styles.langLabelSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.consentBox}>
        <View style={styles.consentHeaderRow}>
          <Text style={styles.consentTitle}>
            🔒 Data Privacy Notice (DPDP Act 2023)
          </Text>
          <TouchableOpacity
            onPress={() => setShowConsentDetails(!showConsentDetails)}
          >
            <Text style={styles.expandLink}>
              {showConsentDetails ? "Hide Details" : "View Details"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.consentSummary}>
          DrGodly converts your verbal answers into a structured clinical
          summary for the counter pharmacist.
        </Text>

        {showConsentDetails && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailItem}>
              • Purpose: Assists licensed pharmacist and RMP during consultation.
            </Text>
            <Text style={styles.detailItem}>
              • Storage: Audio is encrypted with AES-256 and purged in 30 days.
            </Text>
            <Text style={styles.detailItem}>
              • Clinical Safety: DrGodly does not prescribe medicines or replace
              doctor consultation.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setConsentChecked(!consentChecked)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              consentChecked && styles.checkboxChecked,
            ]}
          >
            {consentChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            I consent to speak with DrGodly AI assistant and authorize
            processing of my reported symptoms under India's DPDP Act 2023.
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Proceed to Voice Intake →"
        variant={consentChecked ? "primary" : "secondary"}
        onPress={handleContinue}
        disabled={!consentChecked}
        style={styles.ctaButton}
      />
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
  header: {
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 6,
    marginBottom: 8,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  langGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  langCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  langCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  langScript: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  langScriptSelected: {
    color: colors.primary,
  },
  langLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  langLabelSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
  consentBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 24,
  },
  consentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  consentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  expandLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
  consentSummary: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  detailsContainer: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  detailItem: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  ctaButton: {
    height: 52,
  },
});
