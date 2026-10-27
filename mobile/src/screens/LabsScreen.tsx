import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Linking,
  Modal,
} from "react-native";
import { colors } from "../theme/colors";
import { borderRadius } from "../theme/spacing";
import { formatINR } from "../utils/currency";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";

interface LabItem {
  id: string;
  name: string;
  distanceKm: number;
  location: string;
  phone: string;
  rating: number;
  homeCollection: boolean;
  popularTests: Array<{ name: string; price: number; tat: string }>;
}

const MOCK_LABS: LabItem[] = [
  {
    id: "l1",
    name: "Dr. Lal PathLabs — Connaught Place",
    distanceKm: 0.8,
    location: "Block B, Middle Circle, CP, New Delhi",
    phone: "+911139885050",
    rating: 4.8,
    homeCollection: true,
    popularTests: [
      { name: "Complete Blood Count (CBC)", price: 350, tat: "6h" },
      { name: "H. pylori Stool Antigen", price: 1200, tat: "24h" },
      { name: "Liver Function Test (LFT)", price: 650, tat: "12h" },
    ],
  },
  {
    id: "l2",
    name: "Thyrocare Aarogyam Wellness Centre",
    distanceKm: 1.2,
    location: "Barakhamba Road, Near Metro Gate 3",
    phone: "+912230900000",
    rating: 4.7,
    homeCollection: true,
    popularTests: [
      { name: "Aarogyam Profile (63 Tests)", price: 999, tat: "24h" },
      { name: "Thyroid Profile (T3, T4, TSH)", price: 350, tat: "12h" },
      { name: "Lipid Profile (Cholesterol)", price: 450, tat: "12h" },
    ],
  },
  {
    id: "l3",
    name: "Metropolis Healthcare Diagnostics",
    distanceKm: 1.5,
    location: "Kasturba Gandhi Marg, Janpath",
    phone: "+911140506000",
    rating: 4.9,
    homeCollection: true,
    popularTests: [
      { name: "Cardiac Troponin I (STAT)", price: 1500, tat: "2h" },
      { name: "12-Lead ECG Recording", price: 300, tat: "Instant" },
      { name: "Kidney Function Test (KFT)", price: 550, tat: "8h" },
    ],
  },
];

export function LabsScreen() {
  const [search, setSearch] = useState("");
  const [selectedLab, setSelectedLab] = useState<LabItem | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  const filtered = MOCK_LABS.filter((l) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.popularTests.some((t) => t.name.toLowerCase().includes(q))
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search test (CBC, H. pylori, ECG) or lab..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.labCard}>
            <View style={styles.labHeader}>
              <View style={styles.labInfo}>
                <Text style={styles.labName}>{item.name}</Text>
                <Text style={styles.labDist}>
                  📍 {item.distanceKm} km away • {item.location}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {item.rating}</Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              <Badge label="NABL Accredited" variant="blue" />
              {item.homeCollection && (
                <Badge label="Home Collection Available" variant="green" />
              )}
            </View>

            <View style={styles.testsBox}>
              <Text style={styles.testsLabel}>AVAILABLE TESTS:</Text>
              {item.popularTests.map((t, idx) => (
                <View key={idx} style={styles.testRow}>
                  <View>
                    <Text style={styles.testName}>{t.name}</Text>
                    <Text style={styles.testTat}>TAT: {t.tat}</Text>
                  </View>
                  <View style={styles.testRight}>
                    <Text style={styles.testPrice}>{formatINR(t.price)}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedLab(item);
                        setSelectedTest(t.name);
                        setIsBooked(true);
                      }}
                      style={styles.bookBtn}
                    >
                      <Text style={styles.bookBtnText}>Book</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${item.phone}`)}
              style={styles.callRow}
            >
              <Text style={styles.callText}>📞 Call Lab: {item.phone}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={isBooked}
        transparent
        animationType="fade"
        onRequestClose={() => setIsBooked(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalCheck}>✓</Text>
            <Text style={styles.modalTitle}>Lab Order Requisition Scheduled!</Text>
            <Text style={styles.modalToken}>Token: #LAB-2026-7810</Text>
            <Text style={styles.modalSub}>
              Test: {selectedTest} at {selectedLab?.name}
            </Text>
            <Text style={styles.modalNote}>
              Phlebotomist will contact you for morning fasting sample collection.
            </Text>
            <Button
              title="Done"
              variant="primary"
              onPress={() => setIsBooked(false)}
              style={{ width: "100%", marginTop: 14 }}
            />
          </View>
        </View>
      </Modal>
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
  searchInput: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    color: colors.textPrimary,
  },
  list: {
    padding: 16,
    paddingBottom: 30,
  },
  labCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  labHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  labInfo: {
    flex: 1,
    marginRight: 8,
  },
  labName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  labDist: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
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
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  testsBox: {
    marginTop: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.sm,
    padding: 10,
    gap: 6,
  },
  testsLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
  },
  testRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  testName: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  testTat: {
    fontSize: 10,
    color: colors.textMuted,
  },
  testRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  testPrice: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  bookBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  callRow: {
    marginTop: 10,
    alignItems: "center",
  },
  callText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
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
  modalCheck: {
    fontSize: 32,
    color: colors.secondary,
    fontWeight: "900",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 6,
    textAlign: "center",
  },
  modalToken: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 2,
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },
  modalNote: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 8,
  },
});
