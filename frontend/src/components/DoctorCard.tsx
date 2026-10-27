import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Doctor } from "../data/doctors";
import { colors } from "../theme/colors";
import { borderRadius, shadows } from "../theme/spacing";
import { formatINR } from "../utils/currency";

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
          <View style={styles.slotIndicator}>
            <View style={styles.slotDot} />
            <Text style={styles.slotText}>⏱ {doctor.nextAvailableSlot}</Text>
          </View>
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
    borderRadius: borderRadius.xl,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceMuted,
    marginRight: 14,
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
    fontSize: 15.5,
    fontWeight: "900",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 6,
    letterSpacing: -0.2,
  },
  ratingBadge: {
    backgroundColor: colors.yellowLight,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.yellowModerate,
  },
  specialty: {
    fontSize: 12.5,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 2,
  },
  degrees: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  metaBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    marginTop: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.cardBorderLight,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    color: colors.textMuted,
    width: 75,
  },
  metaValue: {
    fontSize: 11.5,
    color: colors.textSecondary,
    flex: 1,
    fontWeight: "500",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  feeLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  feeValue: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  slotActionBox: {
    alignItems: "flex-end",
  },
  slotIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  slotDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.greenSafe,
    marginRight: 4,
  },
  slotText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: colors.secondaryDark,
  },
  actionPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  actionPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
