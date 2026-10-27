import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "../theme/colors";

export type BadgeVariant =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "slate";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = "slate", style }: BadgeProps) {
  const getBadgeStyle = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case "red":
        return {
          container: { backgroundColor: colors.redLight, borderColor: "#FECACA" },
          text: { color: colors.redEmergency },
        };
      case "orange":
        return {
          container: { backgroundColor: colors.orangeLight, borderColor: "#FED7AA" },
          text: { color: colors.orangeUrgent },
        };
      case "yellow":
        return {
          container: { backgroundColor: colors.yellowLight, borderColor: "#FDE68A" },
          text: { color: colors.yellowModerate },
        };
      case "green":
        return {
          container: { backgroundColor: colors.greenLight, borderColor: "#A7F3D0" },
          text: { color: colors.greenSafe },
        };
      case "blue":
        return {
          container: { backgroundColor: colors.blueLight, borderColor: "#BAE6FD" },
          text: { color: colors.blueInfo },
        };
      case "purple":
        return {
          container: { backgroundColor: colors.purpleLight, borderColor: "#DDD6FE" },
          text: { color: colors.purpleRx },
        };
      case "slate":
      default:
        return {
          container: { backgroundColor: colors.surfaceMuted, borderColor: colors.cardBorder },
          text: { color: colors.textSecondary },
        };
    }
  };

  const { container, text } = getBadgeStyle();

  return (
    <View style={[styles.baseBadge, container, style]}>
      <Text style={[styles.baseText, text]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  baseBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  baseText: {
    fontSize: 10.5,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
