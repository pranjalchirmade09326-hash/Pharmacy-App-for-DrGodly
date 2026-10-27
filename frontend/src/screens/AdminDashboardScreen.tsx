import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { colors } from "../theme/colors";

export function AdminDashboardScreen({ navigation }: { navigation?: any }) {
  const [timeRange, setTimeRange] = useState("TODAY");

  const STORES = [
    { id: "S1", name: "Apollo Pharmacy - Connaught Place", activeIntakes: 4, todayTotal: 38, status: "ONLINE" },
    { id: "S2", name: "MedPlus - Koramangala 5th Block", activeIntakes: 2, todayTotal: 29, status: "ONLINE" },
    { id: "S3", name: "Sanjivani Chemist - Dadar West", activeIntakes: 5, todayTotal: 42, status: "ONLINE" },
    { id: "S4", name: "Wellness Forever - Banjara Hills", activeIntakes: 1, todayTotal: 21, status: "ONLINE" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Platform Operations & Analytics</Text>
          <Text style={styles.subtitle}>
            DrGodly Pharmacy Assist — Enterprise Healthcare Network Monitoring
          </Text>
        </View>

        {/* Time Selector */}
        <View style={styles.timeSelector}>
          {["TODAY", "LAST 7 DAYS", "THIS MONTH"].map((range) => {
            const isSelected = timeRange === range;
            return (
              <TouchableOpacity
                key={range}
                style={[styles.rangeBtn, isSelected && styles.rangeBtnSelected]}
                onPress={() => setTimeRange(range)}
              >
                <Text style={[styles.rangeText, isSelected && styles.rangeTextSelected]}>
                  {range}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Top KPI Cards */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiNumber}>130</Text>
            <Text style={styles.kpiLabel}>Total Intakes</Text>
            <Text style={styles.kpiTrend}>↑ 14% vs yesterday</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiNumber, { color: colors.greenSafe }]}>96</Text>
            <Text style={styles.kpiLabel}>OTC Dispensed</Text>
            <Text style={styles.kpiTrend}>73.8% resolution</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiNumber, { color: colors.primary }]}>28</Text>
            <Text style={styles.kpiLabel}>Doctor Referrals</Text>
            <Text style={styles.kpiTrend}>Avg wait 3.8m</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiNumber, { color: colors.redEmergency }]}>6</Text>
            <Text style={styles.kpiLabel}>108 Red Flags</Text>
            <Text style={styles.kpiTrend}>100% escalated</Text>
          </View>
        </View>

        {/* Voice AI Engine Performance */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎙️ Voice AI Engine Diagnostics</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Speech-to-Text Accuracy (Indian Accents)</Text>
            <Text style={styles.metricVal}>97.2%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Avg. Voice Intake Duration</Text>
            <Text style={styles.metricVal}>1m 38s</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Top Dialects Captured</Text>
            <Text style={styles.metricVal}>Hindi (42%), Tamil (24%), Eng (18%)</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>SBAR Conversion Latency</Text>
            <Text style={styles.metricVal}>1.4 seconds</Text>
          </View>
        </View>

        {/* Counter Outlet Network */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>🏪 Network Pharmacy Outlets</Text>
            <TouchableOpacity onPress={() => navigation?.navigate && navigation.navigate("QRCodeManagement")}>
              <Text style={styles.manageQrLink}>Manage QR Standees ›</Text>
            </TouchableOpacity>
          </View>

          {STORES.map((s) => (
            <View key={s.id} style={styles.storeRow}>
              <View style={styles.storeDetails}>
                <Text style={styles.storeName}>{s.name}</Text>
                <Text style={styles.storeMeta}>
                  Today: {s.todayTotal} cases • {s.activeIntakes} in current queue
                </Text>
              </View>
              <View style={styles.onlineBadge}>
                <Text style={styles.onlineText}>🟢 {s.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Regulatory & Safety Audit */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚖️ Regulatory & Safety Compliance</Text>
          <View style={styles.complianceRow}>
            <Text style={styles.complianceKey}>CDSCO Drugs Rules 2026 Engine</Text>
            <Text style={styles.compliancePass}>ACTIVE ✓</Text>
          </View>
          <View style={styles.complianceRow}>
            <Text style={styles.complianceKey}>Under-4 Pediatric FDC Syrup Gate</Text>
            <Text style={styles.compliancePass}>ENFORCED ✓</Text>
          </View>
          <View style={styles.complianceRow}>
            <Text style={styles.complianceKey}>DPDP Act 2023 Consent Audit Trail</Text>
            <Text style={styles.compliancePass}>100% LOGGED ✓</Text>
          </View>
          <View style={styles.complianceRow}>
            <Text style={styles.complianceKey}>NMC Telemedicine Guidelines 2020</Text>
            <Text style={styles.compliancePass}>VERIFIED ✓</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
  timeSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  rangeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  rangeBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rangeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  rangeTextSelected: {
    color: "#FFFFFF",
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  kpiCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  kpiNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  kpiLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  },
  kpiTrend: {
    fontSize: 10,
    color: colors.greenSafe,
    marginTop: 4,
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  manageQrLink: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metricVal: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  storeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  storeMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  onlineBadge: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.greenSafe,
  },
  complianceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  complianceKey: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  compliancePass: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.greenSafe,
  },
});
