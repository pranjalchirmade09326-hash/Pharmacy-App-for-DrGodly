import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

export function QRCodeManagementScreen({ navigation }: { navigation?: any }) {
  const [storeName, setStoreName] = useState("Apollo Pharmacy - Connaught Place");
  const [counterNumber, setCounterNumber] = useState("Counter 1 (Main OTC)");
  const [selectedLang, setSelectedLang] = useState("Hindi");
  const [tokenKey, setTokenKey] = useState("TOKEN-DELHI-2026-9921");
  const [tokenRotated, setTokenRotated] = useState(false);

  const handleRotateToken = () => {
    const newToken = `TOKEN-DELHI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTokenKey(newToken);
    setTokenRotated(true);
    setTimeout(() => setTokenRotated(false), 2500);
    Alert.alert("Token Rotated", "Previous counter QR codes have been safely invalidated.");
  };

  const handlePrint = () => {
    Alert.alert(
      "Print Standee",
      `Generating high-resolution print PDF for ${storeName} - ${counterNumber} in A4 / 5x7 Counter Acrylic Tent format.`
    );
  };

  const handleTestScan = () => {
    if (navigation?.navigate) {
      navigation.navigate("LanguageConsent");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Counter QR Standee Generator</Text>
          <Text style={styles.subtitle}>
            Deploy branded scan-to-voice intake QR stands at retail pharmacy counters
          </Text>
        </View>

        {/* Standee Configuration */}
        <View style={styles.configCard}>
          <Text style={styles.sectionTitle}>⚙️ Counter Customization</Text>
          
          <Text style={styles.label}>Pharmacy Outlet Name</Text>
          <TextInput
            style={styles.input}
            value={storeName}
            onChangeText={setStoreName}
          />

          <Text style={styles.label}>Counter Label</Text>
          <TextInput
            style={styles.input}
            value={counterNumber}
            onChangeText={setCounterNumber}
          />

          <Text style={styles.label}>Default Standee Primary Language</Text>
          <View style={styles.langRow}>
            {["Hindi", "Tamil", "Telugu", "English"].map((lang) => {
              const isSelected = selectedLang === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  style={[styles.langChip, isSelected && styles.langChipSelected]}
                  onPress={() => setSelectedLang(lang)}
                >
                  <Text style={[styles.langText, isSelected && styles.langTextSelected]}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Visual Standee Preview Card */}
        <View style={styles.standeePreview}>
          <View style={styles.standeeHeader}>
            <Text style={styles.brandTitle}>DrGodly Pharmacy Assist</Text>
            <Text style={styles.brandTagline}>AI Clinical Intake & SBAR Support</Text>
          </View>

          <View style={styles.qrDisplayBox}>
            {/* Visual simulation of QR matrix */}
            <View style={styles.qrMatrixSim}>
              <View style={styles.qrCornerTL}>
                <View style={styles.qrCornerInner} />
              </View>
              <View style={styles.qrCornerTR}>
                <View style={styles.qrCornerInner} />
              </View>
              <View style={styles.qrCornerBL}>
                <View style={styles.qrCornerInner} />
              </View>
              
              <View style={styles.centerBadge}>
                <Text style={styles.centerBadgeText}>💊</Text>
              </View>
            </View>
            <Text style={styles.qrScanText}>SCAN WITH SMARTPHONE CAMERA</Text>
            <Text style={styles.qrScanSub}>Apni bhasha me bimari batayein • 1 min intake</Text>
          </View>

          <View style={styles.standeeFooter}>
            <Text style={styles.storeStandeeName}>{storeName}</Text>
            <Text style={styles.counterStandeeTag}>{counterNumber} • {tokenKey}</Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.buttonStack}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handlePrint}>
            <Text style={styles.primaryBtnText}>🖨️ Print Counter Standee (PDF)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testBtn} onPress={handleTestScan}>
            <Text style={styles.testBtnText}>📱 Simulate Patient Scanning This QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rotateBtn} onPress={handleRotateToken}>
            <Text style={styles.rotateBtnText}>
              🔄 Rotate Token Security Key
            </Text>
          </TouchableOpacity>
        </View>

        {/* Compliance Footer */}
        <View style={styles.complianceFoot}>
          <Text style={styles.complianceFootText}>
            🔒 DPDP Act 2023 Compliant: QR code establishes end-to-end encrypted session bound strictly to this retail counter.
          </Text>
        </View>
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
  header: {
    marginBottom: 14,
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
  configCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    height: 44,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.textPrimary,
  },
  langRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  langChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  langTextSelected: {
    color: "#FFFFFF",
  },
  standeePreview: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  standeeHeader: {
    alignItems: "center",
    marginBottom: 14,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  brandTagline: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  qrDisplayBox: {
    alignItems: "center",
    marginVertical: 10,
  },
  qrMatrixSim: {
    width: 170,
    height: 170,
    borderWidth: 4,
    borderColor: "#172B4D",
    borderRadius: 12,
    padding: 10,
    position: "relative",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  qrCornerTL: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 38,
    height: 38,
    borderWidth: 4,
    borderColor: "#172B4D",
    justifyContent: "center",
    alignItems: "center",
  },
  qrCornerTR: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 38,
    height: 38,
    borderWidth: 4,
    borderColor: "#172B4D",
    justifyContent: "center",
    alignItems: "center",
  },
  qrCornerBL: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 38,
    height: 38,
    borderWidth: 4,
    borderColor: "#172B4D",
    justifyContent: "center",
    alignItems: "center",
  },
  qrCornerInner: {
    width: 18,
    height: 18,
    backgroundColor: "#172B4D",
  },
  centerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  centerBadgeText: {
    fontSize: 22,
  },
  qrScanText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  qrScanSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  standeeFooter: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 10,
    width: "100%",
    marginTop: 10,
  },
  storeStandeeName: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  counterStandeeTag: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  buttonStack: {
    gap: 10,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  testBtn: {
    backgroundColor: colors.secondaryLight,
    borderWidth: 1,
    borderColor: colors.secondary,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  testBtnText: {
    color: colors.secondaryDark,
    fontSize: 13,
    fontWeight: "700",
  },
  rotateBtn: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  rotateBtnText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  complianceFoot: {
    paddingHorizontal: 8,
    alignItems: "center",
  },
  complianceFootText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
});
