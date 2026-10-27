import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from "react-native";
import { useCart } from "../context/CartContext";
import { colors } from "../theme/colors";
import { borderRadius } from "../theme/spacing";
import { formatINR } from "../utils/currency";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";

interface CheckoutScreenProps {
  navigation: any;
}

export function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    subtotalINR,
    cgstINR,
    sgstINR,
    totalAmountINR,
    hasPrescriptionRestrictedItem,
  } = useCart();

  const [patientName, setPatientName] = useState("Rahul Sharma");
  const [patientPhone, setPatientPhone] = useState("+91 98765 43210");
  const [patientAge, setPatientAge] = useState("34");
  const [patientGender, setPatientGender] = useState("MALE");
  const [pickupMode, setPickupMode] = useState<"STORE" | "DELIVERY">("STORE");
  const [prescriptionAttached, setPrescriptionAttached] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handlePlaceOrder = () => {
    if (hasPrescriptionRestrictedItem && !prescriptionAttached) {
      Alert.alert(
        "Prescription Required",
        "Please attach a valid doctor prescription for Schedule H medicines before dispensing."
      );
      return;
    }
    setIsSuccessModalOpen(true);
  };

  if (cartCount === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is currently empty</Text>
        <Text style={styles.emptySub}>
          Explore CDSCO-compliant OTC supplements or consult a tele-doctor to add medications.
        </Text>
        <Button
          title="Browse Product Catalog"
          variant="primary"
          onPress={() => navigation.navigate("CatalogTab")}
          style={styles.browseBtn}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Items in Cart Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Itemized Dispense Cart ({cartCount})</Text>
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemDetails}>
              <View style={styles.itemTop}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.brandName}
                </Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.itemGeneric} numberOfLines={1}>
                {item.genericComposition}
              </Text>

              {item.prescriptionRequired && (
                <View style={styles.rxBadgeRow}>
                  <Badge label="Rx Required • Schedule H" variant="purple" />
                </View>
              )}

              <View style={styles.priceStepperRow}>
                <Text style={styles.itemPrice}>
                  {formatINR(item.unitPriceINR * item.quantity)}
                </Text>

                <View style={styles.stepper}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, -1)}
                    style={styles.stepBtn}
                  >
                    <Text style={styles.stepBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepQty}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, 1)}
                    style={styles.stepBtn}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Schedule H Prescription Gate */}
      {hasPrescriptionRestrictedItem && (
        <View style={styles.rxGateCard}>
          <View style={styles.rxGateHeader}>
            <Text style={styles.rxGateIcon}>⚠️</Text>
            <View style={styles.rxGateInfo}>
              <Text style={styles.rxGateTitle}>Prescription Verification Gate</Text>
              <Text style={styles.rxGateSub}>
                Your order contains Schedule H/H1 drugs requiring an authorized RMP prescription.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPrescriptionAttached(!prescriptionAttached)}
            style={[
              styles.attachBtn,
              prescriptionAttached && styles.attachBtnActive,
            ]}
          >
            <Text style={styles.attachBtnText}>
              {prescriptionAttached
                ? "✓ Prescription Attached (Ref: RX-2026-NMC-719)"
                : "📎 Attach RMP Prescription / Link Teleconsult"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Patient Information Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Details for Dispense</Text>

        <View style={styles.formRow}>
          <Text style={styles.label}>Patient Name</Text>
          <TextInput
            value={patientName}
            onChangeText={setPatientName}
            style={styles.input}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>WhatsApp / Phone</Text>
          <TextInput
            value={patientPhone}
            onChangeText={setPatientPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.dualRow}>
          <View style={styles.dualCol}>
            <Text style={styles.label}>Age (Years)</Text>
            <TextInput
              value={patientAge}
              onChangeText={setPatientAge}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.dualCol}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {(["MALE", "FEMALE"] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setPatientGender(g)}
                  style={[
                    styles.genderBtn,
                    patientGender === g && styles.genderBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.genderText,
                      patientGender === g && styles.genderTextActive,
                    ]}
                  >
                    {g === "MALE" ? "Male" : "Female"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Pickup vs Delivery Mode */}
        <View style={styles.modeRow}>
          <Text style={styles.label}>Fulfillment Mode</Text>
          <View style={styles.modeToggle}>
            <TouchableOpacity
              onPress={() => setPickupMode("STORE")}
              style={[
                styles.modeBtn,
                pickupMode === "STORE" && styles.modeBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  pickupMode === "STORE" && styles.modeBtnTextActive,
                ]}
              >
                🏪 In-Store Counter Pickup
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPickupMode("DELIVERY")}
              style={[
                styles.modeBtn,
                pickupMode === "DELIVERY" && styles.modeBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  pickupMode === "DELIVERY" && styles.modeBtnTextActive,
                ]}
              >
                🛵 Local Delivery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Transparent GST Billing Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tax Invoice Breakdown (GST 12%)</Text>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Medicines & Supplements Subtotal</Text>
          <Text style={styles.billVal}>{formatINR(subtotalINR)}</Text>
        </View>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Central GST (CGST @ 6%)</Text>
          <Text style={styles.billVal}>{formatINR(cgstINR)}</Text>
        </View>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>State GST (SGST @ 6%)</Text>
          <Text style={styles.billVal}>{formatINR(sgstINR)}</Text>
        </View>

        <View style={[styles.billRow, styles.grandTotalRow]}>
          <Text style={styles.grandTotalLabel}>Total Amount Payable</Text>
          <Text style={styles.grandTotalVal}>{formatINR(totalAmountINR)}</Text>
        </View>

        <Button
          title={`Confirm & Dispense (${formatINR(totalAmountINR)})`}
          variant="primary"
          size="lg"
          onPress={handlePlaceOrder}
          style={styles.placeOrderBtn}
        />
      </View>

      {/* Dispense Token Success Modal */}
      <Modal
        visible={isSuccessModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSuccessModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.successBadge}>
              <Text style={styles.successCheck}>✓</Text>
            </View>

            <Text style={styles.successTitle}>Dispense Order Confirmed!</Text>
            <Text style={styles.successToken}>Pickup Token: #DISP-2026-8941</Text>

            <View style={styles.successBox}>
              <Text style={styles.boxText}>
                <Text style={styles.bold}>Patient:</Text> {patientName} ({patientAge}y)
              </Text>
              <Text style={styles.boxText}>
                <Text style={styles.bold}>Store:</Text> Apollo Pharmacy, Connaught Place
              </Text>
              <Text style={styles.boxText}>
                <Text style={styles.bold}>Total Paid:</Text> {formatINR(totalAmountINR)}
              </Text>
              <Text style={styles.boxText}>
                <Text style={styles.bold}>Fulfillment:</Text> Ready for counter pickup in 10 mins
              </Text>
            </View>

            <Text style={styles.smsNote}>
              Digital GST invoice & medication counseling guidelines have been sent to {patientPhone}.
            </Text>

            <Button
              title="Return to Catalog"
              variant="primary"
              size="md"
              onPress={() => {
                setIsSuccessModalOpen(false);
                clearCart();
                navigation.navigate("CatalogTab");
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
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  browseBtn: {
    width: "80%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  clearText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.redEmergency,
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  itemImage: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceMuted,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    flex: 1,
  },
  removeText: {
    fontSize: 14,
    color: colors.textMuted,
    paddingHorizontal: 4,
  },
  itemGeneric: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  rxBadgeRow: {
    marginTop: 3,
  },
  priceStepperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  stepBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  stepBtnText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  stepQty: {
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 6,
    color: colors.textPrimary,
  },
  rxGateCard: {
    backgroundColor: colors.purpleLight,
    borderWidth: 1.5,
    borderColor: "#C4B5FD",
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 16,
  },
  rxGateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rxGateIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  rxGateInfo: {
    flex: 1,
  },
  rxGateTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.purpleRx,
  },
  rxGateSub: {
    fontSize: 11,
    color: "#5B21B6",
    marginTop: 1,
  },
  attachBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.purpleRx,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  attachBtnActive: {
    backgroundColor: "#F5F3FF",
    borderColor: "#7C3AED",
  },
  attachBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.purpleRx,
  },
  formRow: {
    marginBottom: 10,
  },
  dualRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  dualCol: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  genderRow: {
    flexDirection: "row",
    gap: 6,
    height: 40,
  },
  genderBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  genderBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  genderText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  genderTextActive: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  modeRow: {
    marginTop: 6,
  },
  modeToggle: {
    gap: 6,
  },
  modeBtn: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceMuted,
  },
  modeBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  modeBtnTextActive: {
    color: colors.primaryDark,
    fontWeight: "800",
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  billLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  billVal: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 10,
    marginTop: 8,
    marginBottom: 14,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  grandTotalVal: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primary,
  },
  placeOrderBtn: {
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
  successBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.greenLight,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successCheck: {
    fontSize: 26,
    color: colors.secondary,
    fontWeight: "900",
  },
  successTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  successToken: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 2,
  },
  successBox: {
    backgroundColor: colors.surfaceMuted,
    padding: 12,
    borderRadius: borderRadius.md,
    width: "100%",
    marginVertical: 14,
    gap: 4,
  },
  boxText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bold: {
    fontWeight: "700",
    color: colors.textPrimary,
  },
  smsNote: {
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
