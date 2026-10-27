import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { colors } from "../theme/colors";
import { EmergencyBanner } from "../components/EmergencyBanner";
import { MobileHeader } from "../components/MobileHeader";
import { HomeScreen } from "../screens/HomeScreen";
import { DoctorSearchScreen } from "../screens/DoctorSearchScreen";
import { DoctorDetailScreen } from "../screens/DoctorDetailScreen";
import { ProductCatalogScreen } from "../screens/ProductCatalogScreen";
import { CheckoutScreen } from "../screens/CheckoutScreen";
import { PharmacistTriageScreen } from "../screens/PharmacistTriageScreen";
import { useCart } from "../context/CartContext";

type ActiveTab =
  | "HomeTab"
  | "DoctorsTab"
  | "CatalogTab"
  | "CheckoutTab"
  | "PharmacistTab";

export function AppNavigator() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("HomeTab");
  const [activeStackScreen, setActiveStackScreen] = useState<string | null>(null);
  const [stackParams, setStackParams] = useState<any>({});
  const { cartCount } = useCart();

  const navigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === "DoctorDetail") {
        setActiveStackScreen("DoctorDetail");
        setStackParams(params || {});
      } else {
        setActiveStackScreen(null);
        setActiveTab(screen as ActiveTab);
        setStackParams(params || {});
      }
    },
    goBack: () => {
      setActiveStackScreen(null);
    },
  };

  const renderCurrentScreen = () => {
    if (activeStackScreen === "DoctorDetail") {
      return (
        <View style={styles.screenWrapper}>
          <View style={styles.subHeader}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Text style={styles.backBtnText}>‹ Back to Doctors</Text>
            </TouchableOpacity>
            <Text style={styles.subHeaderTitle}>Doctor Consultation</Text>
            <View style={{ width: 60 }} />
          </View>
          <DoctorDetailScreen
            route={{ params: stackParams }}
            navigation={navigation}
          />
        </View>
      );
    }

    switch (activeTab) {
      case "HomeTab":
        return <HomeScreen navigation={navigation} />;
      case "DoctorsTab":
        return <DoctorSearchScreen navigation={navigation} />;
      case "CatalogTab":
        return <ProductCatalogScreen navigation={navigation} />;
      case "CheckoutTab":
        return <CheckoutScreen navigation={navigation} />;
      case "PharmacistTab":
        return <PharmacistTriageScreen />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  const tabs = [
    { key: "HomeTab" as ActiveTab, label: "Home", icon: "🏠" },
    { key: "DoctorsTab" as ActiveTab, label: "Doctors", icon: "🩺" },
    { key: "CatalogTab" as ActiveTab, label: "Catalog", icon: "💊" },
    {
      key: "CheckoutTab" as ActiveTab,
      label: "Cart",
      icon: "🛒",
      badge: cartCount > 0 ? cartCount : undefined,
    },
    { key: "PharmacistTab" as ActiveTab, label: "Console", icon: "🏥" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <EmergencyBanner />
      <MobileHeader onOpenCart={() => navigation.navigate("CheckoutTab")} />

      {/* Screen Body */}
      <View style={styles.body}>{renderCurrentScreen()}</View>

      {/* Bottom Tab Navigation Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key && !activeStackScreen;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => {
                setActiveStackScreen(null);
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
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  subHeaderTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingVertical: 6,
    paddingBottom: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    position: "relative",
    width: 28,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    fontSize: 18,
  },
  badgePill: {
    position: "absolute",
    top: -2,
    right: -6,
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgePillText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: "900",
  },
});
