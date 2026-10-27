import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { colors } from "../theme/colors";
import { borderRadius, shadows } from "../theme/spacing";
import { EmergencyBanner } from "../components/EmergencyBanner";
import { MobileHeader } from "../components/MobileHeader";
import { useCart } from "../context/CartContext";

// Patient Screens
import { HomeScreen } from "../screens/HomeScreen";
import { DoctorSearchScreen } from "../screens/DoctorSearchScreen";
import { DoctorDetailScreen } from "../screens/DoctorDetailScreen";
import { ProductCatalogScreen } from "../screens/ProductCatalogScreen";
import { CheckoutScreen } from "../screens/CheckoutScreen";
import { LabsScreen } from "../screens/LabsScreen";
import { LanguageConsentScreen } from "../screens/LanguageConsentScreen";
import { VoiceCallActiveScreen } from "../screens/VoiceCallActiveScreen";
import { SymptomIntakeScreen } from "../screens/SymptomIntakeScreen";
import { IntakeCompletedScreen } from "../screens/IntakeCompletedScreen";
import { PatientReportScreen } from "../screens/PatientReportScreen";
import { HealthRecordsScreen } from "../screens/HealthRecordsScreen";

// Pharmacist Screens
import { PharmacistLoginScreen } from "../screens/PharmacistLoginScreen";
import { PharmacistTriageScreen } from "../screens/PharmacistTriageScreen";
import { IntakeReviewScreen } from "../screens/IntakeReviewScreen";
import { SafetyEscalationScreen } from "../screens/SafetyEscalationScreen";
import { ReferralWorkflowScreen } from "../screens/ReferralWorkflowScreen";
import { CaseHistoryScreen } from "../screens/CaseHistoryScreen";

// Doctor Screens
import { DoctorReferralInboxScreen } from "../screens/DoctorReferralInboxScreen";
import { ClinicalAssessmentScreen } from "../screens/ClinicalAssessmentScreen";

// Admin Screens
import { AdminDashboardScreen } from "../screens/AdminDashboardScreen";
import { QRCodeManagementScreen } from "../screens/QRCodeManagementScreen";

export type UserRole = "PATIENT" | "PHARMACIST" | "DOCTOR" | "ADMIN";

interface StackEntry {
  screen: string;
  params?: any;
}

export function AppNavigator() {
  const [currentRole, setCurrentRole] = useState<UserRole>("PATIENT");
  const [activeTab, setActiveTab] = useState<string>("HomeTab");
  const [stackHistory, setStackHistory] = useState<StackEntry[]>([]);
  const { cartCount } = useCart();

  const currentStack = stackHistory.length > 0 ? stackHistory[stackHistory.length - 1] : null;

  const navigation = {
    navigate: (screen: string, params?: any) => {
      // Role Switch detection
      if (screen === "PharmacistTab" || screen === "PharmacistTriage") {
        setCurrentRole("PHARMACIST");
        setActiveTab("TriageQueue");
        setStackHistory([]);
        return;
      }
      if (screen === "DoctorsTab") {
        setCurrentRole("PATIENT");
        setActiveTab("DoctorsTab");
        setStackHistory([]);
        return;
      }
      if (screen === "LabsTab") {
        setCurrentRole("PATIENT");
        setActiveTab("LabsTab");
        setStackHistory([]);
        return;
      }
      if (screen === "CatalogTab") {
        setCurrentRole("PATIENT");
        setActiveTab("CatalogTab");
        setStackHistory([]);
        return;
      }
      if (screen === "CheckoutTab" || screen === "Checkout") {
        setCurrentRole("PATIENT");
        setActiveTab("CheckoutTab");
        setStackHistory([]);
        return;
      }

      // Check if screen is treated as modal/stack screen
      const stackScreens = [
        "DoctorDetail",
        "LanguageConsent",
        "VoiceCallActive",
        "SymptomIntake",
        "IntakeCompleted",
        "PatientReport",
        "HealthRecords",
        "IntakeReview",
        "SafetyEscalation",
        "ReferralWorkflow",
        "CaseHistory",
        "ClinicalAssessment",
        "QRCodeManagement",
      ];

      if (stackScreens.includes(screen)) {
        setStackHistory((prev) => [...prev, { screen, params: params || {} }]);
      } else {
        setStackHistory([]);
        setActiveTab(screen);
      }
    },
    goBack: () => {
      setStackHistory((prev) => (prev.length > 0 ? prev.slice(0, prev.length - 1) : []));
    },
  };

  const getScreenTitle = (screenName: string) => {
    switch (screenName) {
      case "DoctorDetail":
        return "Doctor Consultation Details";
      case "LanguageConsent":
        return "Language & DPDP Consent";
      case "VoiceCallActive":
        return "Live AI Voice Intake Call";
      case "SymptomIntake":
        return "Clinical Symptom Intake";
      case "IntakeCompleted":
        return "Intake Summary & WhatsApp";
      case "PatientReport":
        return "SBAR Health Report";
      case "HealthRecords":
        return "Health Vault & ABHA";
      case "IntakeReview":
        return "Pharmacist SBAR Clinical Review";
      case "SafetyEscalation":
        return "Emergency 108 Red Flag Escalation";
      case "ReferralWorkflow":
        return "Doctor Tele-OPD Referral";
      case "CaseHistory":
        return "Audit Logs & Dispense History";
      case "ClinicalAssessment":
        return "RMP Clinical Assessment & Rx";
      case "QRCodeManagement":
        return "Counter QR Standee Generator";
      default:
        return "DrGodly Healthcare";
    }
  };

  const renderCurrentScreen = () => {
    // If there is an active stack screen, render it with back button
    if (currentStack) {
      const { screen, params } = currentStack;
      return (
        <View style={styles.screenWrapper}>
          <View style={styles.subHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backBtnText}>‹ Back</Text>
            </TouchableOpacity>
            <Text style={styles.subHeaderTitle} numberOfLines={1}>
              {getScreenTitle(screen)}
            </Text>
            <View style={{ width: 48 }} />
          </View>

          {screen === "DoctorDetail" && (
            <DoctorDetailScreen route={{ params }} navigation={navigation} />
          )}
          {screen === "LanguageConsent" && (
            <LanguageConsentScreen navigation={navigation} />
          )}
          {screen === "VoiceCallActive" && (
            <VoiceCallActiveScreen route={{ params }} navigation={navigation} />
          )}
          {screen === "SymptomIntake" && (
            <SymptomIntakeScreen route={{ params }} navigation={navigation} />
          )}
          {screen === "IntakeCompleted" && (
            <IntakeCompletedScreen route={{ params }} navigation={navigation} />
          )}
          {screen === "PatientReport" && (
            <PatientReportScreen route={{ params }} navigation={navigation} />
          )}
          {screen === "HealthRecords" && (
            <HealthRecordsScreen navigation={navigation} />
          )}
          {screen === "IntakeReview" && (
            <IntakeReviewScreen route={{ params }} navigation={navigation} />
          )}
          {screen === "SafetyEscalation" && (
            <SafetyEscalationScreen route={{ params }} navigation={navigation} />
          )}
          {screen === "ReferralWorkflow" && (
            <ReferralWorkflowScreen route={{ params }} navigation={navigation} />
          )}
          {screen === "CaseHistory" && (
            <CaseHistoryScreen navigation={navigation} />
          )}
          {screen === "ClinicalAssessment" && (
            <ClinicalAssessmentScreen route={{ params }} navigation={navigation} />
          )}
          {screen === "QRCodeManagement" && (
            <QRCodeManagementScreen navigation={navigation} />
          )}
        </View>
      );
    }

    // Role-based main tabs
    if (currentRole === "PATIENT") {
      switch (activeTab) {
        case "HomeTab":
          return <HomeScreen navigation={navigation} />;
        case "DoctorsTab":
          return <DoctorSearchScreen navigation={navigation} />;
        case "LabsTab":
          return <LabsScreen />;
        case "CatalogTab":
          return <ProductCatalogScreen navigation={navigation} />;
        case "RecordsTab":
          return <HealthRecordsScreen navigation={navigation} />;
        case "CheckoutTab":
          return <CheckoutScreen navigation={navigation} />;
        default:
          return <HomeScreen navigation={navigation} />;
      }
    }

    if (currentRole === "PHARMACIST") {
      switch (activeTab) {
        case "TriageQueue":
          return <PharmacistTriageScreen navigation={navigation} />;
        case "ReviewTab":
          return <IntakeReviewScreen navigation={navigation} />;
        case "HistoryTab":
          return <CaseHistoryScreen navigation={navigation} />;
        case "EscalationTab":
          return <SafetyEscalationScreen navigation={navigation} />;
        case "LoginTab":
          return <PharmacistLoginScreen navigation={navigation} />;
        default:
          return <PharmacistTriageScreen navigation={navigation} />;
      }
    }

    if (currentRole === "DOCTOR") {
      switch (activeTab) {
        case "InboxTab":
          return <DoctorReferralInboxScreen navigation={navigation} />;
        case "ConsultTab":
          return <ClinicalAssessmentScreen navigation={navigation} />;
        default:
          return <DoctorReferralInboxScreen navigation={navigation} />;
      }
    }

    if (currentRole === "ADMIN") {
      switch (activeTab) {
        case "AnalyticsTab":
          return <AdminDashboardScreen navigation={navigation} />;
        case "QRTab":
          return <QRCodeManagementScreen navigation={navigation} />;
        default:
          return <AdminDashboardScreen navigation={navigation} />;
      }
    }

    return <HomeScreen navigation={navigation} />;
  };

  // Define bottom tabs per role
  const getTabsForCurrentRole = () => {
    switch (currentRole) {
      case "PATIENT":
        return [
          { key: "HomeTab", label: "Home", icon: "🏠" },
          { key: "DoctorsTab", label: "Doctors", icon: "🩺" },
          { key: "LabsTab", label: "Labs", icon: "🧪" },
          { key: "CatalogTab", label: "OTC", icon: "💊" },
          { key: "RecordsTab", label: "Vault", icon: "📂" },
          {
            key: "CheckoutTab",
            label: "Cart",
            icon: "🛒",
            badge: cartCount > 0 ? cartCount : undefined,
          },
        ];
      case "PHARMACIST":
        return [
          { key: "TriageQueue", label: "Queue", icon: "📋" },
          { key: "ReviewTab", label: "Review", icon: "🔍" },
          { key: "HistoryTab", label: "Audit", icon: "📜" },
          { key: "EscalationTab", label: "108 Red", icon: "🚨" },
          { key: "LoginTab", label: "Auth", icon: "🔑" },
        ];
      case "DOCTOR":
        return [
          { key: "InboxTab", label: "Referrals", icon: "📥" },
          { key: "ConsultTab", label: "Tele-OPD", icon: "🩺" },
        ];
      case "ADMIN":
        return [
          { key: "AnalyticsTab", label: "Analytics", icon: "📊" },
          { key: "QRTab", label: "QR Stands", icon: "🏷️" },
        ];
      default:
        return [];
    }
  };

  const currentTabs = getTabsForCurrentRole();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <EmergencyBanner />
      <MobileHeader onOpenCart={() => navigation.navigate("CheckoutTab")} />

      {/* Role Switcher Pill Bar */}
      <View style={styles.roleBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleScroll}>
          {[
            { role: "PATIENT" as UserRole, label: "👤 Patient", defaultTab: "HomeTab" },
            { role: "PHARMACIST" as UserRole, label: "💊 Pharmacist (R.Ph)", defaultTab: "TriageQueue" },
            { role: "DOCTOR" as UserRole, label: "🩺 Doctor (RMP)", defaultTab: "InboxTab" },
            { role: "ADMIN" as UserRole, label: "⚙️ Admin / Ops", defaultTab: "AnalyticsTab" },
          ].map((item) => {
            const isRoleActive = currentRole === item.role;
            return (
              <TouchableOpacity
                key={item.role}
                onPress={() => {
                  setCurrentRole(item.role);
                  setActiveTab(item.defaultTab);
                  setStackHistory([]);
                }}
                style={[styles.rolePill, isRoleActive && styles.rolePillActive]}
              >
                <Text style={[styles.rolePillText, isRoleActive && styles.rolePillTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Screen Body */}
      <View style={styles.body}>{renderCurrentScreen()}</View>

      {/* Dynamic Role Bottom Navigation Bar */}
      {stackHistory.length === 0 && (
        <View style={styles.tabBar}>
          {currentTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => {
                  setActiveTab(tab.key);
                }}
                style={styles.tabItem}
              >
                <View style={styles.iconContainer}>
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  {tab.badge && (
                    <View style={styles.badgePill}>
                      <Text style={styles.badgePillText}>{tab.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  roleBar: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingVertical: 7,
  },
  roleScroll: {
    paddingHorizontal: 12,
    gap: 6,
    alignItems: "center",
  },
  rolePill: {
    paddingHorizontal: 13,
    paddingVertical: 6.5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  rolePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  rolePillText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  rolePillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenWrapper: {
    flex: 1,
  },
  subHeader: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.sm,
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  subHeaderTitle: {
    fontSize: 14.5,
    fontWeight: "800",
    color: colors.textPrimary,
    flex: 1,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingVertical: 6,
    paddingBottom: 10,
    ...shadows.md,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  iconContainer: {
    position: "relative",
    width: 28,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    fontSize: 18,
  },
  badgePill: {
    position: "absolute",
    top: -3,
    right: -8,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    minWidth: 17,
    height: 17,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  badgePillText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: "800",
  },
});
