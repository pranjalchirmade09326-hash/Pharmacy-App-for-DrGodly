import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MOCK_DOCTORS, Doctor } from "../data/doctors";
import { DoctorCard } from "../components/DoctorCard";
import { colors } from "../theme/colors";
import { borderRadius } from "../theme/spacing";
import { Badge } from "../components/Badge";

const SPECIALTIES = [
  "All",
  "General Physician",
  "Pulmonology",
  "Gastroenterologist",
  "Pediatrician",
  "ENT",
  "Dermatologist",
];

const FEE_OPTIONS: { label: string; value: number | "ALL" }[] = [
  { label: "Any Fee", value: "ALL" },
  { label: "≤ ₹500", value: 500 },
  { label: "≤ ₹700", value: 700 },
  { label: "≤ ₹900", value: 900 },
];

interface DoctorSearchScreenProps {
  navigation: any;
}

export function DoctorSearchScreen({ navigation }: DoctorSearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedFee, setSelectedFee] = useState<number | "ALL">("ALL");

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.fullName.toLowerCase().includes(q) ||
        doc.specialization.toLowerCase().includes(q) ||
        doc.hospitalAffiliation.toLowerCase().includes(q) ||
        doc.languages.some((l) => l.toLowerCase().includes(q));

      const matchesSpecialty =
        selectedSpecialty === "All" ||
        doc.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());

      const matchesFee =
        selectedFee === "ALL" || doc.consultationFeeINR <= selectedFee;

      return matchesSearch && matchesSpecialty && matchesFee;
    });
  }, [searchQuery, selectedSpecialty, selectedFee]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("All");
    setSelectedFee("ALL");
  };

  return (
    <View style={styles.container}>
      {/* Header Search Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search doctors, cough, fever, stomach..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Specialty Filter Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          {SPECIALTIES.map((spec) => {
            const isSelected = selectedSpecialty === spec;
            return (
              <TouchableOpacity
                key={spec}
                onPress={() => setSelectedSpecialty(spec)}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextSelected,
                  ]}
                >
                  {spec}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Fee Quick Chips */}
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>MAX FEE:</Text>
          {FEE_OPTIONS.map((f) => {
            const isSelected = selectedFee === f.value;
            return (
              <TouchableOpacity
                key={f.label}
                onPress={() => setSelectedFee(f.value)}
                style={[
                  styles.feeChip,
                  isSelected && styles.feeChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.feeChipText,
                    isSelected && styles.feeChipTextSelected,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Result Count Banner */}
      <View style={styles.countBanner}>
        <Text style={styles.countText}>
          Showing <Text style={styles.countBold}>{filteredDoctors.length}</Text> NMC-verified practitioners
        </Text>
        {(searchQuery || selectedSpecialty !== "All" || selectedFee !== "ALL") && (
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.resetText}>Reset All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Doctor Cards List */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            onPress={() =>
              navigation.navigate("DoctorDetail", { doctorId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🩺</Text>
            <Text style={styles.emptyTitle}>No doctors match your criteria</Text>
            <Text style={styles.emptySubtitle}>
              Try searching a broader specialty or resetting the fee filters.
            </Text>
            <TouchableOpacity onPress={resetFilters} style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchHeader: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  clearText: {
    fontSize: 14,
    color: colors.textMuted,
    padding: 4,
  },
  filterScroll: {
    marginTop: 10,
  },
  filterScrollContent: {
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterPillSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  filterPillTextSelected: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  feeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  feeLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
  },
  feeChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  feeChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  feeChipText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  feeChipTextSelected: {
    color: colors.primaryDark,
  },
  countBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  countText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  countBold: {
    fontWeight: "800",
    color: colors.textPrimary,
  },
  resetText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 14,
  },
  emptyBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  emptyBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
});
