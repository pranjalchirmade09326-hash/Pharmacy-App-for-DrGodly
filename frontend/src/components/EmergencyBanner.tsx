import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { colors } from "../theme/colors";

export function EmergencyBanner() {
  const callEmergency = () => {
    Linking.openURL("tel:108");
  };

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.leftInfo}>
        <View style={styles.dot} />
        <Text style={styles.emergencyLabel}>CRITICAL EMERGENCY:</Text>
        <Text style={styles.emergencyText} numberOfLines={1}>
          Chest pain / Trauma
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
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
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    marginRight: 6,
  },
  emergencyLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginRight: 4,
  },
  emergencyText: {
    color: "#FEE2E2",
    fontSize: 11,
    flexShrink: 1,
  },
  callButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  callButtonText: {
    color: colors.redEmergency,
    fontSize: 11,
    fontWeight: "800",
  },
});
