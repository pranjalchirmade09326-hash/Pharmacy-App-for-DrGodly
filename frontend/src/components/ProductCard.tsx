import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { CatalogProduct } from "../data/products";
import { colors } from "../theme/colors";
import { borderRadius, shadows } from "../theme/spacing";
import { formatINR } from "../utils/currency";
import { Badge } from "./Badge";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: CatalogProduct;
  onPress?: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.clickableArea}
      >
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          {/* Scheduling Badge */}
          <View style={styles.badgeRow}>
            {product.prescriptionRequired ? (
              <Badge label="Rx • Sched H" variant="purple" />
            ) : product.cdscoCategory === "AYUSH" ? (
              <Badge label="Ayurvedic / OTC" variant="yellow" />
            ) : (
              <Badge label="CDSCO Safe OTC" variant="green" />
            )}
            <Text style={styles.packSize}>{product.packSize}</Text>
          </View>

          {/* Product Brand Name */}
          <Text style={styles.brandName} numberOfLines={1}>
            {product.brandName}
          </Text>

          {/* Generic Salt */}
          <Text style={styles.generic} numberOfLines={2}>
            {product.genericComposition}
          </Text>

          {/* Pricing Row */}
          <View style={styles.pricingRow}>
            <Text style={styles.sellingPrice}>
              {formatINR(product.sellingPriceINR)}
            </Text>
            {product.mrpINR > product.sellingPriceINR && (
              <Text style={styles.mrp}>MRP {formatINR(product.mrpINR)}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Cart Control Bottom Row */}
      <View style={styles.actionRow}>
        {qty === 0 ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => addToCart(product)}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add to Cart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.stepper}>
            <TouchableOpacity
              onPress={() => updateQuantity(product.id, -1)}
              style={styles.stepBtn}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepQty}>{qty}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(product.id, 1)}
              style={styles.stepBtn}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.sm,
  },
  clickableArea: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceMuted,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  packSize: {
    fontSize: 10.5,
    color: colors.textMuted,
    fontWeight: "500",
  },
  brandName: {
    fontSize: 14.5,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  generic: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  pricingRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 6,
  },
  sellingPrice: {
    fontSize: 15.5,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  mrp: {
    fontSize: 11,
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  actionRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    alignItems: "flex-end",
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: 2,
  },
  stepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepBtnText: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.primary,
  },
  stepQty: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
    paddingHorizontal: 8,
  },
});
