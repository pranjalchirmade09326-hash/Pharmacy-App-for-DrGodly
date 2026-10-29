import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
} from "react-native";
import { colors } from "../theme/colors";
import { borderRadius } from "../theme/spacing";
import { Button } from "./Button";

interface EmergencyModalProps {
  visible: boolean;
  onClose: () => void;
  patientName?: string;
  reason?: string;
}

export function EmergencyModal({
  visible,
  onClose,
  patientName = "Patient",
  reason = "Acute crushing chest pain with radiation to arm and diaphoresis (ACS Red Flag)",
}: EmergencyModalProps) {
  const dialAmbulance = () => {
    Linking.openURL("tel:108").catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🚨</Text>
          </View>

          <Text style={styles.title}>EMERGENCY PROTOCOL ACTIVATED</Text>
          <Text style={styles.patient}>Patient: {patientName}</Text>

          <View style={styles.reasonBox}>
            <Text style={styles.reasonLabel}>Clinical Red Flag Detected:</Text>
            <Text style={styles.reasonText}>{reason}</Text>
          </View>

          <Text style={styles.warning}>
            DO NOT DISPENSE ROUTINE OTC MEDICATIONS. Immediate pre-hospital resuscitation and emergency cardiac hospital transfer is required.
          </Text>

          <Button
            title="📞 DIAL AMBULANCE 108 NOW"
            variant="danger"
            size="lg"
            onPress={dialAmbulance}
            style={styles.dialBtn}
          />

          <TouchableOpacity onPress={onClose} style={styles.dismissBtn}>
            <Text style={styles.dismissText}>Dismiss & Return to Console</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.xl,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.redEmergency,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.redLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.redEmergency,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  patient: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 4,
  },
  reasonBox: {
    backgroundColor: colors.redLight,
    padding: 12,
    borderRadius: borderRadius.md,
    marginTop: 14,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: colors.redEmergency,
  },
  reasonLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.redEmergency,
    textTransform: "uppercase",
  },
  reasonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7F1D1D",
    marginTop: 2,
    lineHeight: 16,
  },
  warning: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
    marginVertical: 14,
    lineHeight: 16,
  },
  dialBtn: {
    width: "100%",
  },
  dismissBtn: {
    marginTop: 12,
    padding: 8,
  },
  dismissText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
