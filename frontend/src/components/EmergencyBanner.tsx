import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { colors } from "../theme/colors";
import { borderRadius, shadows } from "../theme/spacing";

export function EmergencyBanner() {
  const callEmergency = () => {
    Linking.openURL("tel:108").catch(() => {});
  };

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.leftInfo}>
        <View style={styles.dotContainer}>
          <View style={styles.pulseRing} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.emergencyLabel}>CRITICAL EMERGENCY:</Text>
        <Text style={styles.emergencyText} numberOfLines={1}>
          Chest pain / Trauma
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={callEmergency}
        style={styles.callButton}
      >
        <Text style={styles.callButtonText}>📞 Call 108</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: colors.redEmergency,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  dotContainer: {
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  pulseRing: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  emergencyLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.6,
    marginRight: 4,
  },
  emergencyText: {
    color: "#FEE2E2",
    fontSize: 11,
    fontWeight: "500",
    flexShrink: 1,
  },
  callButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  callButtonText: {
    color: colors.redEmergency,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
});
