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
import { borderRadius } from "../theme/spacing";

const STORES = [
  { id: "PHARM-DEL-041", name: "Apollo Pharmacy — Connaught Place, New Delhi" },
  { id: "PHARM-BLR-012", name: "MedPlus — Indiranagar, Bengaluru" },
  { id: "PHARM-MUM-088", name: "Wellness Forever — Andheri West, Mumbai" },
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
      {/* Brand & Subtitle */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>✝</Text>
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>DrGodly</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>PHARMACY</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsStoreModalOpen(true)}
            style={styles.storeRow}
          >
            <Text style={styles.storeText} numberOfLines={1}>
              📍 {selectedStore.name} ▾
            </Text>
          </TouchableOpacity>
        </View>
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
            <Text style={styles.modalTitle}>Select Pharmacy Counter</Text>
            <Text style={styles.modalSubtitle}>
              Orders and clinical intake will be assigned to this store.
            </Text>

            <FlatList
              data={STORES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedStore(item);
                    setIsStoreModalOpen(false);
                  }}
                  style={[
                    styles.storeOption,
                    selectedStore.id === item.id && styles.storeOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.storeOptionText,
                      selectedStore.id === item.id && styles.storeOptionTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {selectedStore.id === item.id && (
                    <Text style={styles.checkIcon}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setIsStoreModalOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: "#99F6E4",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  storeRow: {
    marginTop: 1,
    maxWidth: 240,
  },
  storeText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "500",
  },
  cartButton: {
    position: "relative",
    padding: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceMuted,
  },
  cartIcon: {
    fontSize: 18,
  },
  cartBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: colors.primary,
    borderRadius: 9999,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  storeOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  storeOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  storeOptionText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
    flex: 1,
  },
  storeOptionTextSelected: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  checkIcon: {
    color: colors.primary,
    fontWeight: "900",
    marginLeft: 8,
  },
  closeButton: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceMuted,
  },
  closeButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
});
