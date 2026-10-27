import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Doctor } from "../data/doctors";
import { colors } from "../theme/colors";
import { borderRadius } from "../theme/spacing";
import { formatINR } from "../utils/currency";
import { Badge } from "./Badge";

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

export function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      {/* Top Section: Avatar + Details */}
      <View style={styles.topRow}>
        <Image
          source={{ uri: doctor.avatarUrl }}
          style={styles.avatar}
          resizeMode="cover"
        />

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {doctor.fullName}
            </Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {doctor.rating}</Text>
            </View>
          </View>

          <Text style={styles.specialty} numberOfLines={1}>
            {doctor.specialization}
          </Text>

          <Text style={styles.degrees} numberOfLines={1}>
            {doctor.degrees.join(", ")} • {doctor.experienceYears} yrs exp.
          </Text>
        </View>
      </View>

      {/* NMC Registration & Affiliation */}
      <View style={styles.metaBox}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>NMC Reg:</Text>
          <Text style={styles.metaValue} numberOfLines={1}>
            {doctor.nmcRegistrationNumber} ({doctor.stateMedicalCouncil})
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Hospital:</Text>
          <Text style={styles.metaValue} numberOfLines={1}>
            {doctor.hospitalAffiliation}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Languages:</Text>
          <Text style={styles.metaValue} numberOfLines={1}>
            {doctor.languages.join(", ")}
          </Text>
        </View>
      </View>

      {/* Footer: Fee + Next Slot + Action */}
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.feeLabel}>Consultation Fee</Text>
          <Text style={styles.feeValue}>
            {formatINR(doctor.consultationFeeINR)}
          </Text>
        </View>

        <View style={styles.slotActionBox}>
          <Text style={styles.slotText}>⏱ {doctor.nextAvailableSlot}</Text>
          <View style={styles.actionPill}>
            <Text style={styles.actionPillText}>Select Slot ›</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceMuted,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  ratingBadge: {
    backgroundColor: colors.yellowLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.yellowModerate,
  },
  specialty: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 2,
  },
  degrees: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  metaBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.sm,
    padding: 8,
    marginTop: 10,
    gap: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    width: 70,
  },
  metaValue: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
    fontWeight: "500",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  feeLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  feeValue: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  slotActionBox: {
    alignItems: "flex-end",
  },
  slotText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.secondary,
    marginBottom: 4,
  },
  actionPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  actionPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
