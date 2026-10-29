import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { colors } from "../theme/colors";
import { useCart } from "../context/CartContext";
import { borderRadius, shadows } from "../theme/spacing";

const STORES = [
  { id: "PHARM-DEL-041", name: "Apollo Pharmacy — Connaught Place, New Delhi", area: "Connaught Place, New Delhi", distance: "0.2 km" },
  { id: "PHARM-BLR-012", name: "MedPlus — Indiranagar, Bengaluru", area: "Indiranagar, Bengaluru", distance: "1.1 km" },
  { id: "PHARM-MUM-088", name: "Wellness Forever — Andheri West, Mumbai", area: "Andheri West, Mumbai", distance: "2.4 km" },
];

interface MobileHeaderProps {
  onOpenCart?: () => void;
}

export function MobileHeader({ onOpenCart }: MobileHeaderProps) {
  const { cartCount } = useCart();
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  return (
    <View style={styles.header}>
      {/* Brand & Store Selector */}
      <View style={styles.brandContainer}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>✝</Text>
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.title}>DrGodly</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>CLINIC & RX</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Location selector pill */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setIsStoreModalOpen(true)}
          style={styles.storePill}
        >
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.storeText} numberOfLines={1}>
            {selectedStore.area}
          </Text>
          <Text style={styles.storeChevron}>▾</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Icon & Badge */}
      {onOpenCart && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenCart}
          style={styles.cartButton}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Store Switcher Modal */}
      <Modal
        visible={isStoreModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsStoreModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select Pharmacy Counter</Text>
                <Text style={styles.modalSubtitle}>
                  Intakes and orders are assigned to this registered counter.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsStoreModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={STORES}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingVertical: 8 }}
              renderItem={({ item }) => {
                const isSelected = selectedStore.id === item.id;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedStore(item);
                      setIsStoreModalOpen(false);
                    }}
                    style={[
                      styles.storeOption,
                      isSelected && styles.storeOptionSelected,
                    ]}
                  >
                    <View style={styles.storeOptionLeft}>
                      <View style={[styles.storeRadio, isSelected && styles.storeRadioSelected]}>
                        {isSelected && <View style={styles.storeRadioInner} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.storeOptionText,
                            isSelected && styles.storeOptionTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text style={styles.storeDistance}>Distance: {item.distance}</Text>
                      </View>
                    </View>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkIcon}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsStoreModalOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.sm,
  },
  brandContainer: {
    flex: 1,
    marginRight: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: 8.5,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  storePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignSelf: "flex-start",
    maxWidth: "92%",
  },
  locationPin: {
    fontSize: 10.5,
    marginRight: 4,
  },
  storeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
    flexShrink: 1,
  },
  storeChevron: {
    fontSize: 9,
    color: colors.textMuted,
    marginLeft: 4,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartIcon: {
    fontSize: 18,
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 9.5,
    fontWeight: "900",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 20,
    maxHeight: "80%",
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalCloseIcon: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: "700",
  },
  storeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  storeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  storeOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  storeRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  storeRadioSelected: {
    borderColor: colors.primary,
  },
  storeRadioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.primary,
  },
  storeOptionText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  storeOptionTextSelected: {
    fontWeight: "800",
    color: colors.primaryDark,
  },
  storeDistance: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  checkBadge: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  checkIcon: {
    color: colors.greenSafe,
    fontSize: 9.5,
    fontWeight: "900",
  },
  closeButton: {
    backgroundColor: colors.textPrimary,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
