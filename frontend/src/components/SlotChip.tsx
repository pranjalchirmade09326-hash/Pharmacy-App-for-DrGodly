import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { borderRadius } from "../theme/spacing";

interface SlotChipProps {
  time: string;
  isSelected: boolean;
  isBooked: boolean;
  onPress: () => void;
}

export function SlotChip({ time, isSelected, isBooked, onPress }: SlotChipProps) {
  if (isBooked) {
    return (
      <TouchableOpacity
        disabled
        style={[styles.baseChip, styles.bookedChip]}
      >
        <Text style={[styles.baseText, styles.bookedText]}>{time}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.baseChip,
        isSelected ? styles.selectedChip : styles.unselectedChip,
      ]}
    >
      <Text
        style={[
          styles.baseText,
          isSelected ? styles.selectedText : styles.unselectedText,
        ]}
      >
        {isSelected ? `✓ ${time}` : time}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  unselectedChip: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.cardBorder,
  },
  selectedChip: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  bookedChip: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.cardBorder,
    opacity: 0.6,
  },
  baseText: {
    fontSize: 13,
    fontWeight: "600",
  },
  unselectedText: {
    color: colors.textSecondary,
  },
  selectedText: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  bookedText: {
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
});
