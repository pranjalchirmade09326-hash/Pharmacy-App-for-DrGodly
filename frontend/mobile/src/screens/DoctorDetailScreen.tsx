import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { MOCK_DOCTORS, DoctorSlot } from "../data/doctors";
import { colors } from "../theme/colors";
import { borderRadius } from "../theme/spacing";
import { formatINR } from "../utils/currency";
import { SlotChip } from "../components/SlotChip";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";

interface DoctorDetailScreenProps {
  route: { params: { doctorId: string } };
  navigation: any;
}

export function DoctorDetailScreen({
  route,
  navigation,
}: DoctorDetailScreenProps) {
  const doctorId = route?.params?.doctorId || MOCK_DOCTORS[0].id;
  const doctor =
    MOCK_DOCTORS.find((d) => d.id === doctorId) || MOCK_DOCTORS[0];

  const [selectedDate, setSelectedDate] = useState("2026-10-27");
  const [selectedSlot, setSelectedSlot] = useState<DoctorSlot | null>(
    doctor.slots.find((s) => !s.isBooked) || null
  );
  const [isBookedModalOpen, setIsBookedModalOpen] = useState(false);

  const DATES = [
    { label: "Today, 27 Oct", value: "2026-10-27" },
    { label: "Tomorrow, 28 Oct", value: "2026-10-28" },
    { label: "Wed, 29 Oct", value: "2026-10-29" },
  ];

  const currentSlots = doctor.slots.filter(
    (s) => s.date === selectedDate || selectedDate === "2026-10-27"
  );

  const morningSlots = currentSlots.filter((s) => s.period === "morning");
  const afternoonSlots = currentSlots.filter((s) => s.period === "afternoon");
  const eveningSlots = currentSlots.filter((s) => s.period === "evening");

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;
    setIsBookedModalOpen(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Top Doctor Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <Image
            source={{ uri: doctor.avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.avatarInfo}>
            <View style={styles.verifiedRow}>
              <Badge label="NMC VERIFIED RMP" variant="green" />
              <Text style={styles.ratingText}>★ {doctor.rating} ({doctor.reviewCount})</Text>
            </View>

            <Text style={styles.name}>{doctor.fullName}</Text>
            <Text style={styles.specialization}>{doctor.specialization}</Text>
            <Text style={styles.degrees}>
              {doctor.degrees.join(", ")} • {doctor.experienceYears} Years Exp.
            </Text>
          </View>
        </View>

        {/* NMC Regulatory Information Box */}
        <View style={styles.nmcBox}>
          <Text style={styles.nmcTitle}>National Medical Commission (NMC) Verification</Text>
          <Text style={styles.nmcText}>
            Registration No: <Text style={styles.bold}>{doctor.nmcRegistrationNumber}</Text>
          </Text>
          <Text style={styles.nmcText}>
            State Council: <Text style={styles.bold}>{doctor.stateMedicalCouncil}</Text>
          </Text>
          <Text style={styles.nmcText}>
            Affiliation: <Text style={styles.bold}>{doctor.hospitalAffiliation}</Text>
          </Text>
          <Text style={styles.nmcText}>
            Languages: <Text style={styles.bold}>{doctor.languages.join(", ")}</Text>
          </Text>
        </View>

        {/* Bio */}
        <View style={styles.bioBox}>
          <Text style={styles.bioHeading}>About Doctor & Clinical Practice</Text>
          <Text style={styles.bioText}>{doctor.aboutBio}</Text>
        </View>
      </View>

      {/* Interactive Slot Picker Section */}
      <View style={styles.slotSection}>
        <Text style={styles.sectionTitle}>Select Consultation Slot</Text>
        <Text style={styles.sectionSub}>
          Tap any available slot. Selected time will highlight in teal.
        </Text>

        {/* Date Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateTabsScroll}
        >
          {DATES.map((d) => {
            const isSelected = selectedDate === d.value;
            return (
              <TouchableOpacity
                key={d.value}
                onPress={() => setSelectedDate(d.value)}
                style={[
                  styles.dateTab,
                  isSelected && styles.dateTabSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dateTabText,
                    isSelected && styles.dateTabTextSelected,
                  ]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Morning Slots */}
        {morningSlots.length > 0 && (
          <View style={styles.periodGroup}>
            <Text style={styles.periodLabel}>🌅 MORNING SLOTS (09:00 AM - 12:00 PM)</Text>
            <View style={styles.chipsRow}>
              {morningSlots.map((slot) => (
                <SlotChip
                  key={slot.slotId}
                  time={slot.time}
                  isSelected={selectedSlot?.slotId === slot.slotId}
                  isBooked={slot.isBooked}
                  onPress={() => setSelectedSlot(slot)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Afternoon Slots */}
        {afternoonSlots.length > 0 && (
          <View style={styles.periodGroup}>
            <Text style={styles.periodLabel}>☀️ AFTERNOON SLOTS (01:00 PM - 05:00 PM)</Text>
            <View style={styles.chipsRow}>
              {afternoonSlots.map((slot) => (
                <SlotChip
                  key={slot.slotId}
                  time={slot.time}
                  isSelected={selectedSlot?.slotId === slot.slotId}
                  isBooked={slot.isBooked}
                  onPress={() => setSelectedSlot(slot)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Evening Slots */}
        {eveningSlots.length > 0 && (
          <View style={styles.periodGroup}>
            <Text style={styles.periodLabel}>🌙 EVENING SLOTS (05:00 PM - 08:30 PM)</Text>
            <View style={styles.chipsRow}>
              {eveningSlots.map((slot) => (
                <SlotChip
                  key={slot.slotId}
                  time={slot.time}
                  isSelected={selectedSlot?.slotId === slot.slotId}
                  isBooked={slot.isBooked}
                  onPress={() => setSelectedSlot(slot)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Active Highlight Banner */}
        {selectedSlot ? (
          <View style={styles.selectedBanner}>
            <Text style={styles.selectedBannerTag}>SELECTED APPOINTMENT</Text>
            <Text style={styles.selectedBannerTime}>
              📅 {selectedDate} at ⏱ {selectedSlot.time}
            </Text>
            <Text style={styles.selectedBannerNote}>
              Encrypted WebRTC Audio/Video consultation link will be sent via WhatsApp.
            </Text>
          </View>
        ) : (
          <View style={styles.unselectedBanner}>
            <Text style={styles.unselectedText}>
              Please tap a slot above to proceed with booking.
            </Text>
          </View>
        )}
      </View>

      {/* Pricing Breakdown & Booking Button */}
      <View style={styles.checkoutBox}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>RMP Consultation Fee</Text>
          <Text style={styles.priceVal}>{formatINR(doctor.consultationFeeINR)}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Platform & e-Prescription Fee</Text>
          <Text style={styles.freeVal}>FREE (Sponsored by Pharmacy)</Text>
        </View>

        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalVal}>{formatINR(doctor.consultationFeeINR)}</Text>
        </View>

        <Button
          title={
            selectedSlot
              ? `Confirm Booking for ${selectedSlot.time}`
              : "Select a Slot to Continue"
          }
          variant="primary"
          size="lg"
          disabled={!selectedSlot}
          onPress={handleConfirmBooking}
          style={styles.confirmBtn}
        />
      </View>

      {/* Booking Success Confirmation Modal */}
      <Modal
        visible={isBookedModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsBookedModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>

            <Text style={styles.successTitle}>Teleconsultation Confirmed!</Text>
            <Text style={styles.tokenText}>Reference Token: #TELE-2026-904</Text>

            <View style={styles.modalDetails}>
              <Text style={styles.modalDetailItem}>
                <Text style={styles.bold}>Doctor:</Text> {doctor.fullName}
              </Text>
              <Text style={styles.modalDetailItem}>
                <Text style={styles.bold}>Time:</Text> {selectedSlot?.time} ({selectedDate})
              </Text>
              <Text style={styles.modalDetailItem}>
                <Text style={styles.bold}>Mode:</Text> In-Pharmacy Teleconsultation Booth / WhatsApp Video
              </Text>
              <Text style={styles.modalDetailItem}>
                <Text style={styles.bold}>NMC RMP:</Text> {doctor.nmcRegistrationNumber}
              </Text>
            </View>

            <Text style={styles.modalNote}>
              The digital e-prescription generated during this call will sync directly with the pharmacist counter for dispense.
            </Text>

            <Button
              title="Return to Home"
              variant="primary"
              size="md"
              onPress={() => {
                setIsBookedModalOpen(false);
                navigation.navigate("HomeTab");
              }}
              style={styles.modalCloseBtn}
            />
          </View>
        </View>
      </Modal>

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
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceMuted,
    marginRight: 14,
  },
  avatarInfo: {
    flex: 1,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.yellowModerate,
  },
  name: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  specialization: {
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
  nmcBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    marginTop: 12,
    gap: 3,
  },
  nmcTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  nmcText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  bold: {
    fontWeight: "700",
    color: colors.textPrimary,
  },
  bioBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  bioHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textPrimary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  bioText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  slotSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  dateTabsScroll: {
    marginBottom: 14,
  },
  dateTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginRight: 8,
  },
  dateTabSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  dateTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  dateTabTextSelected: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  periodGroup: {
    marginBottom: 12,
  },
  periodLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedBanner: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginTop: 8,
  },
  selectedBannerTag: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  selectedBannerTime: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.primaryDark,
    marginTop: 2,
  },
  selectedBannerNote: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  unselectedBanner: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    alignItems: "center",
    marginTop: 8,
  },
  unselectedText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  checkoutBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priceVal: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  freeVal: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.secondary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 8,
    marginTop: 6,
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primary,
  },
  confirmBtn: {
    width: "100%",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 24,
    alignItems: "center",
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  successIconText: {
    fontSize: 28,
    color: colors.secondary,
    fontWeight: "900",
  },
  successTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  tokenText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 4,
  },
  modalDetails: {
    backgroundColor: colors.surfaceMuted,
    padding: 12,
    borderRadius: borderRadius.md,
    width: "100%",
    marginVertical: 14,
    gap: 4,
  },
  modalDetailItem: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalNote: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 16,
  },
  modalCloseBtn: {
    width: "100%",
  },
});
