import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../theme/colors";
import { borderRadius } from "../theme/spacing";

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "success";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case "primary":
        return {
          container: { backgroundColor: colors.primary },
          text: { color: "#FFFFFF" },
        };
      case "secondary":
        return {
          container: { backgroundColor: colors.textPrimary },
          text: { color: "#FFFFFF" },
        };
      case "success":
        return {
          container: { backgroundColor: colors.secondary },
          text: { color: "#FFFFFF" },
        };
      case "danger":
        return {
          container: { backgroundColor: colors.redEmergency },
          text: { color: "#FFFFFF" },
        };
      case "outline":
        return {
          container: {
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: colors.cardBorder,
          },
          text: { color: colors.textPrimary },
        };
      default:
        return {
          container: { backgroundColor: colors.primary },
          text: { color: "#FFFFFF" },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case "sm":
        return {
          container: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: borderRadius.sm },
          text: { fontSize: 12 },
        };
      case "lg":
        return {
          container: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: borderRadius.lg },
          text: { fontSize: 16 },
        };
      case "md":
      default:
        return {
          container: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: borderRadius.md },
          text: { fontSize: 14 },
        };
    }
  };

  const vStyle = getVariantStyles();
  const sStyle = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseButton,
        vStyle.container,
        sStyle.container,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? colors.primary : "#FFFFFF"}
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.baseText, vStyle.text, sStyle.text, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  baseText: {
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
