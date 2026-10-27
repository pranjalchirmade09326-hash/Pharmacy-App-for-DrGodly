import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { colors } from "../theme/colors";

interface PharmacistLoginScreenProps {
  navigation?: any;
  onLoginSuccess?: (pharmacistData: any) => void;
}

const PHARMACY_OUTLETS = [
  { id: "store_01", name: "Apollo Pharmacy - Connaught Place, New Delhi", regNo: "DL-PH-2024-889" },
  { id: "store_02", name: "MedPlus Pharmacy - Koramangala 5th Block, Bengaluru", regNo: "KA-PH-2023-412" },
  { id: "store_03", name: "Sanjivani Chemist - Dadar West, Mumbai", regNo: "MH-PH-2021-950" },
  { id: "store_04", name: "Wellness Forever - Banjara Hills, Hyderabad", regNo: "TS-PH-2025-103" },
];

export function PharmacistLoginScreen({ navigation, onLoginSuccess }: PharmacistLoginScreenProps) {
  const [phoneOrEmail, setPhoneOrEmail] = useState("9876543210");
  const [councilRegNo, setCouncilRegNo] = useState("PCI-DL-2019-4821");
  const [selectedStore, setSelectedStore] = useState(PHARMACY_OUTLETS[0].id);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOtp = () => {
    if (!phoneOrEmail || !councilRegNo) {
      Alert.alert("Required Fields", "Please enter your Phone number and State Pharmacy Council Registration Number.");
      return;
    }
    setOtpSent(true);
    setOtp("4821"); // autofill test OTP
  };

  const handleLogin = () => {
    if (!otp) {
      Alert.alert("Enter OTP", "Please enter the 4-digit verification code sent to your mobile.");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const store = PHARMACY_OUTLETS.find((s) => s.id === selectedStore);
      const session = {
        name: "Arun K. Verma, B.Pharm, R.Ph",
        registrationNo: councilRegNo,
        storeName: store?.name,
        storeRegNo: store?.regNo,
        loginTime: new Date().toLocaleTimeString(),
      };
      if (onLoginSuccess) {
        onLoginSuccess(session);
      }
      if (navigation?.navigate) {
        navigation.navigate("PharmacistTab");
      }
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>💊</Text>
          </View>
          <Text style={styles.title}>Pharmacist Portal Login</Text>
          <Text style={styles.subtitle}>
            Authorized Registered Pharmacist Login under CDSCO Drugs & Cosmetics Act
          </Text>
        </View>

        <View style={styles.complianceNotice}>
          <Text style={styles.complianceTitle}>⚖️ Statutory Verification Notice</Text>
          <Text style={styles.complianceText}>
            Access to DrGodly Clinical Decision Support is strictly restricted to Registered Pharmacists holding a valid State Pharmacy Council (PCI) license.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Registered Mobile Number</Text>
          <View style={styles.phoneInputRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              keyboardType="phone-pad"
              value={phoneOrEmail}
              onChangeText={setPhoneOrEmail}
              placeholder="10-digit mobile number"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <Text style={styles.inputLabel}>State Pharmacy Council Reg. No. (PCI)</Text>
          <TextInput
            style={styles.textInput}
            value={councilRegNo}
            onChangeText={setCouncilRegNo}
            placeholder="e.g. DL-RPH-2022-XXXX"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="characters"
          />

          <Text style={styles.inputLabel}>Active Pharmacy Counter Outlet</Text>
          <View style={styles.outletContainer}>
            {PHARMACY_OUTLETS.map((outlet) => {
              const isSelected = selectedStore === outlet.id;
              return (
                <TouchableOpacity
                  key={outlet.id}
                  style={[styles.outletCard, isSelected && styles.outletCardSelected]}
                  onPress={() => setSelectedStore(outlet.id)}
                >
                  <View style={styles.outletRadio}>
                    <View style={isSelected ? styles.radioInnerSelected : styles.radioInnerUnselected} />
                  </View>
                  <View style={styles.outletDetails}>
                    <Text style={[styles.outletName, isSelected && styles.outletNameSelected]}>
                      {outlet.name}
                    </Text>
                    <Text style={styles.outletReg}>License: {outlet.regNo}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {otpSent ? (
            <View style={styles.otpSection}>
              <Text style={styles.inputLabel}>4-Digit Verification Code (OTP)</Text>
              <TextInput
                style={[styles.textInput, styles.otpInput]}
                keyboardType="numeric"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
                placeholder="• • • •"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.otpHelper}>Demo OTP auto-filled: 4821</Text>

              <TouchableOpacity
                style={[styles.primaryBtn, isVerifying && styles.disabledBtn]}
                onPress={handleLogin}
                disabled={isVerifying}
              >
                <Text style={styles.primaryBtnText}>
                  {isVerifying ? "Verifying Credentials..." : "Authenticate & Open Workspace"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSendOtp}>
              <Text style={styles.primaryBtnText}>Send Verification OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            🔒 256-Bit Encrypted Session • Audit Logged with IP & Timestamp
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
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginVertical: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  complianceNotice: {
    backgroundColor: colors.yellowLight,
    borderColor: colors.yellowModerate,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  complianceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.yellowModerate,
    marginBottom: 4,
  },
  complianceText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 12,
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCode: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: "center",
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: "#FFFFFF",
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: "#FFFFFF",
  },
  outletContainer: {
    marginVertical: 4,
  },
  outletCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 8,
    backgroundColor: colors.surfaceMuted,
  },
  outletCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  outletRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioInnerSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioInnerUnselected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
  },
  outletDetails: {
    flex: 1,
  },
  outletName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  outletNameSelected: {
    color: colors.primary,
  },
  outletReg: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  otpSection: {
    marginTop: 8,
  },
  otpInput: {
    textAlign: "center",
    fontSize: 20,
    letterSpacing: 8,
    fontWeight: "700",
  },
  otpHelper: {
    fontSize: 12,
    color: colors.greenSafe,
    textAlign: "center",
    marginVertical: 6,
    fontWeight: "500",
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  footerInfo: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
  },
});
