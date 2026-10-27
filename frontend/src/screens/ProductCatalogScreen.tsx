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
import { MOCK_PRODUCTS, CatalogProduct } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { colors } from "../theme/colors";
import { borderRadius } from "../theme/spacing";
import { formatINR } from "../utils/currency";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  { label: "All", value: "ALL" },
  { label: "Digestive", value: "digestive" },
  { label: "Respiratory", value: "respiratory" },
  { label: "Pain & Fever", value: "pain_fever" },
  { label: "Supplements", value: "supplements" },
  { label: "First Aid", value: "first_aid" },
];

interface ProductCatalogScreenProps {
  navigation: any;
}

export function ProductCatalogScreen({ navigation }: ProductCatalogScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { cartCount, subtotalINR } = useCart();

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        prod.brandName.toLowerCase().includes(q) ||
        prod.genericComposition.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "ALL" || prod.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.headerBox}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search ORS, antacids, vitamins, dolo..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <TouchableOpacity
                key={cat.value}
                onPress={() => setSelectedCategory(cat.value)}
                style={[
                  styles.catPill,
                  isSelected && styles.catPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.catPillText,
                    isSelected && styles.catPillTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* CDSCO Regulatory Guidance Notice */}
      <View style={styles.cdscoNotice}>
        <Text style={styles.cdscoNoticeText}>
          🛡 <Text style={styles.bold}>CDSCO 2026 Compliant:</Text> Schedule H items strictly require an authentic RMP prescription before dispense.
        </Text>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          cartCount > 0 && styles.listContentWithCart,
        ]}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>💊</Text>
            <Text style={styles.emptyTitle}>No matching products</Text>
            <Text style={styles.emptySub}>
              Try searching a generic salt or select another category.
            </Text>
          </View>
        }
      />

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <View style={styles.floatingCartBar}>
          <View>
            <Text style={styles.cartBarCount}>
              🛒 {cartCount} {cartCount === 1 ? "Item" : "Items"} in Cart
            </Text>
            <Text style={styles.cartBarSubtotal}>
              Subtotal: <Text style={styles.cartBarAmount}>{formatINR(subtotalINR)}</Text>
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("CheckoutTab")}
            style={styles.checkoutBtn}
          >
            <Text style={styles.checkoutBtnText}>Checkout & Dispense ›</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBox: {
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
  categoryScroll: {
    marginTop: 10,
  },
  categoryContent: {
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  catPillSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  catPillTextSelected: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  cdscoNotice: {
    backgroundColor: colors.yellowLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
  },
  cdscoNoticeText: {
    fontSize: 11,
    color: "#92400E",
    lineHeight: 15,
  },
  bold: {
    fontWeight: "800",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  listContentWithCart: {
    paddingBottom: 85,
  },
  emptyBox: {
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
  emptySub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  floatingCartBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  cartBarCount: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  cartBarSubtotal: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  cartBarAmount: {
    fontWeight: "900",
    color: colors.primary,
    fontSize: 13,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  checkoutBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
