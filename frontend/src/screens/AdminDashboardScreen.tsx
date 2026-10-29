import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { borderRadius, shadows, spacing } from "../theme/spacing";
import { formatINR } from "../utils/currency";

export function AdminDashboardScreen({ navigation }: { navigation?: any }) {
  const [timeRange, setTimeRange] = useState("TODAY");

  const STORES = [
    {
      id: "S1",
      name: "Apollo Pharmacy — Connaught Place, New Delhi",
      city: "Delhi NCR",
      pharmacist: "R.Ph Sandeep M. (Reg: DL-8812)",
      activeIntakes: 4,
      todayTotal: 38,
      status: "ONLINE",
      revenue: 14200,
    },
    {
      id: "S2",
      name: "MedPlus — Koramangala 5th Block, Bengaluru",
      city: "Bengaluru",
      pharmacist: "R.Ph Divya K. (Reg: KA-4019)",
      activeIntakes: 2,
      todayTotal: 29,
      status: "ONLINE",
      revenue: 9800,
    },
    {
      id: "S3",
      name: "Sanjivani Chemist — Dadar West, Mumbai",
      city: "Mumbai",
      pharmacist: "R.Ph Rahul T. (Reg: MH-9021)",
      activeIntakes: 5,
      todayTotal: 42,
      status: "ONLINE",
      revenue: 16500,
    },
    {
      id: "S4",
      name: "Wellness Forever — Banjara Hills, Hyderabad",
      city: "Hyderabad",
      pharmacist: "R.Ph Mohammed A. (Reg: TS-3312)",
      activeIntakes: 1,
      todayTotal: 21,
      status: "ONLINE",
      revenue: 7750,
    },
    {
      id: "S5",
      name: "Frank Ross Pharmacy — Salt Lake, Kolkata",
      city: "Kolkata",
      pharmacist: "R.Ph Sourav B. (Reg: WB-7714)",
      activeIntakes: 3,
      todayTotal: 31,
      status: "ONLINE",
      revenue: 11200,
    },
  ];

  const AUDIT_LOGS = [
    {
      id: "log_1",
      time: "10:14 AM",
      store: "Koramangala Store",
      event: "CDSCO 2026 Pediatric Guardrail Enforced",
      detail: "Prohibited cold syrup FDC blocked for 3-year-old patient. Pediatric ORS dispensed.",
      severity: "WARNING",
    },
    {
      id: "log_2",
      time: "09:48 AM",
      store: "Connaught Place Store",
      event: "108 Red Flag Emergency Dispatched",
      detail: "Suspected ACS with radiating chest pain. Ambulance 108 dispatched under 1.8 mins.",
      severity: "CRITICAL",
    },
    {
      id: "log_3",
      time: "09:22 AM",
      store: "Dadar West Store",
      event: "Schedule H Anti-Hypertensive Verification",
      detail: "Over-the-counter dispensing of Amlodipine blocked without RMP prescription.",
      severity: "SAFE",
    },
    {
      id: "log_4",
      time: "08:50 AM",
      store: "Salt Lake Store",
      event: "Diagnostic Lab Order Requisition Generated",
      detail: "HbA1c & Fasting Glucose panel routed to Thyrocare Aarogyam partner hub.",
      severity: "SAFE",
    },
  ];

  const DIALECT_STATS = [
    { lang: "Hindi (Standard + Bhojpuri)", pct: 44, color: "#3B82F6" },
    { lang: "Marathi", pct: 18, color: "#10B981" },
    { lang: "Tamil", pct: 14, color: "#8B5CF6" },
    { lang: "Telugu", pct: 11, color: "#F59E0B" },
    { lang: "Bengali", pct: 7, color: "#EC4899" },
    { lang: "English", pct: 6, color: "#64748B" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.platformBadge}>
            <Text style={styles.platformBadgeText}>ENTERPRISE NETWORK OPS • ACTIVE</Text>
          </View>
          <Text style={styles.title}>Platform Operations & Clinical Analytics</Text>
          <Text style={styles.subtitle}>
            DrGodly Pharmacy Assist — Multi-Chain Retail Clinical Monitoring Console
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
                activeOpacity={0.8}
              >
                <Text style={[styles.rangeText, isSelected && styles.rangeTextSelected]}>
                  {range}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Top KPI Cards Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiNumber}>161</Text>
            <Text style={styles.kpiLabel}>Total Intakes</Text>
            <Text style={styles.kpiTrend}>↑ 18% vs yesterday</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={[styles.kpiNumber, { color: colors.greenSafe }]}>118</Text>
            <Text style={styles.kpiLabel}>OTC Dispensed</Text>
            <Text style={styles.kpiTrend}>73.2% resolution</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={[styles.kpiNumber, { color: colors.primary }]}>36</Text>
            <Text style={styles.kpiLabel}>Doctor Consults</Text>
            <Text style={styles.kpiTrend}>Avg wait 3.2m</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={[styles.kpiNumber, { color: colors.redEmergency }]}>7</Text>
            <Text style={styles.kpiLabel}>108 Red Flags</Text>
            <Text style={styles.kpiTrend}>100% escalated</Text>
          </View>
        </View>

        {/* Commercial & Revenue Performance */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💰 Revenue & Pharmacy Counter Monetization</Text>
          <View style={styles.revenueGrid}>
            <View style={styles.revenueBox}>
              <Text style={styles.revenueLabel}>COUNTER OTC SALES</Text>
              <Text style={styles.revenueValue}>{formatINR(59450)}</Text>
              <Text style={styles.revenueSub}>Across 5 network stores</Text>
            </View>

            <View style={styles.revenueBox}>
              <Text style={styles.revenueLabel}>DIAGNOSTIC COMMISSIONS</Text>
              <Text style={[styles.revenueValue, { color: colors.primary }]}>
                {formatINR(18200)}
              </Text>
              <Text style={styles.revenueSub}>Dr. Lal / Thyrocare / Metropolis</Text>
            </View>

            <View style={styles.revenueBox}>
              <Text style={styles.revenueLabel}>TELEMEDICINE CONSULT FEES</Text>
              <Text style={[styles.revenueValue, { color: "#8B5CF6" }]}>
                {formatINR(9000)}
              </Text>
              <Text style={styles.revenueSub}>36 consultations settled</Text>
            </View>
          </View>
        </View>

        {/* Voice AI Multilingual Engine Performance */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎙️ Voice AI Engine & Multilingual Diagnostics</Text>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Speech-to-Text Accuracy (Indian Accents)</Text>
            <Text style={styles.metricVal}>98.1%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Average Voice Intake Duration</Text>
            <Text style={styles.metricVal}>1m 24s</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>SBAR Conversion Latency</Text>
            <Text style={styles.metricVal}>1.1 seconds</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>CDSCO Compliance Check Latency</Text>
            <Text style={styles.metricVal}>0.3 seconds</Text>
          </View>

          {/* Dialect Distribution Bar */}
          <Text style={styles.dialectTitle}>DIALECT DISTRIBUTION (LAST 24 HOURS):</Text>
          <View style={styles.dialectBar}>
            {DIALECT_STATS.map((d, idx) => (
              <View
                key={idx}
                style={{
                  flex: d.pct,
                  height: 10,
                  backgroundColor: d.color,
                  borderTopLeftRadius: idx === 0 ? 5 : 0,
                  borderBottomLeftRadius: idx === 0 ? 5 : 0,
                  borderTopRightRadius: idx === DIALECT_STATS.length - 1 ? 5 : 0,
                  borderBottomRightRadius: idx === DIALECT_STATS.length - 1 ? 5 : 0,
                }}
              />
            ))}
          </View>

          <View style={styles.dialectLegendGrid}>
            {DIALECT_STATS.map((d, idx) => (
              <View key={idx} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                <Text style={styles.legendText}>
                  {d.lang}: <Text style={styles.bold}>{d.pct}%</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Counter Outlet Network */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>🏪 Network Pharmacy Outlets (5 Stores)</Text>
            <TouchableOpacity
              onPress={() => navigation?.navigate && navigation.navigate("QRCodeManagement")}
            >
              <Text style={styles.manageQrLink}>Manage QR Standees ›</Text>
            </TouchableOpacity>
          </View>

          {STORES.map((s) => (
            <View key={s.id} style={styles.storeRow}>
              <View style={styles.storeDetails}>
                <View style={styles.storeTopLine}>
                  <Text style={styles.storeName}>{s.name}</Text>
                  <View style={styles.onlineBadge}>
                    <Text style={styles.onlineText}>🟢 {s.status}</Text>
                  </View>
                </View>
                <Text style={styles.storePharmacist}>👨‍⚕️ {s.pharmacist}</Text>
                <View style={styles.storeStatsRow}>
                  <Text style={styles.storeStatPill}>
                    Active Queue: <Text style={styles.bold}>{s.activeIntakes}</Text>
                  </Text>
                  <Text style={styles.storeStatPill}>
                    Today Total: <Text style={styles.bold}>{s.todayTotal}</Text>
                  </Text>
                  <Text style={styles.storeStatPill}>
                    Sales: <Text style={styles.bold}>{formatINR(s.revenue)}</Text>
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Real-time Regulatory & Safety Incident Stream */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚖️ Live Regulatory & Safety Audit Stream</Text>
          <View style={styles.auditList}>
            {AUDIT_LOGS.map((log) => {
              const isCrit = log.severity === "CRITICAL";
              const isWarn = log.severity === "WARNING";
              return (
                <View key={log.id} style={styles.auditItem}>
                  <View style={styles.auditTimeCol}>
                    <Text style={styles.auditTimeText}>{log.time}</Text>
                    <View
                      style={[
                        styles.auditDot,
                        isCrit ? styles.dotCrit : isWarn ? styles.dotWarn : styles.dotSafe,
                      ]}
                    />
                  </View>
                  <View style={styles.auditBody}>
                    <Text style={styles.auditEvent}>{log.event}</Text>
                    <Text style={styles.auditStore}>📍 {log.store}</Text>
                    <Text style={styles.auditDetail}>{log.detail}</Text>
                  </View>
                </View>
              );
            })}
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
    padding: 14,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
    ...shadows.sm,
  },
  platformBadge: {
    backgroundColor: colors.blueLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  platformBadgeText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  timeSelector: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  rangeBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rangeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  rangeTextSelected: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  kpiCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.sm,
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    marginTop: 2,
  },
  kpiTrend: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 14,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: "900",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  manageQrLink: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  revenueGrid: {
    gap: 8,
  },
  revenueBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
  },
  revenueLabel: {
    fontSize: 9.5,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  revenueValue: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.greenSafe,
    marginTop: 2,
  },
  revenueSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  metricLabel: {
    fontSize: 11.5,
    color: colors.textSecondary,
  },
  metricVal: {
    fontSize: 11.5,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  dialectTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 6,
  },
  dialectBar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
    marginBottom: 8,
  },
  dialectLegendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minWidth: 100,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10.5,
    color: colors.textSecondary,
  },
  bold: {
    fontWeight: "800",
    color: colors.textPrimary,
  },
  storeRow: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 8,
  },
  storeDetails: {
    flex: 1,
  },
  storeTopLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  storeName: {
    fontSize: 12.5,
    fontWeight: "800",
    color: colors.textPrimary,
    flex: 1,
  },
  storePharmacist: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  storeStatsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    flexWrap: "wrap",
  },
  storeStatPill: {
    fontSize: 10.5,
    color: colors.textSecondary,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  onlineBadge: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  onlineText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#166534",
  },
  auditList: {
    gap: 10,
  },
  auditItem: {
    flexDirection: "row",
    gap: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  auditTimeCol: {
    alignItems: "center",
    width: 55,
  },
  auditTimeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
  },
  auditDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  dotSafe: {
    backgroundColor: colors.greenSafe,
  },
  dotWarn: {
    backgroundColor: "#F59E0B",
  },
  dotCrit: {
    backgroundColor: colors.redEmergency,
  },
  auditBody: {
    flex: 1,
  },
  auditEvent: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  auditStore: {
    fontSize: 10.5,
    color: colors.primary,
    fontWeight: "600",
    marginTop: 1,
  },
  auditDetail: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
});
