import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { colors } from "../theme/colors";

interface PixelDeviceFrameProps {
  children: React.ReactNode;
}

export function PixelDeviceFrame({ children }: PixelDeviceFrameProps) {
  const { width, height } = useWindowDimensions();
  const [frameEnabled, setFrameEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState("09:41");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // On native Android or iOS, always render full screen
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  // On narrow mobile screens (< 520px), render edge to edge
  const isDesktop = width > 520;

  if (!isDesktop || !frameEnabled) {
    return (
      <View style={styles.fullScreenWrapper}>
        {isDesktop && (
          <View style={styles.floatingToolbar}>
            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={() => setFrameEnabled(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.floatingBtnText}>📱 Switch to Pixel Frame View</Text>
            </TouchableOpacity>
          </View>
        )}
        {children}
      </View>
    );
  }

  // Calculate realistic Pixel 9 Pro dimensions based on viewport
  const pixelWidth = 412;
  const targetHeight = Math.min(height - 100, 892);
  const frameHeight = Math.max(targetHeight, 640);

  return (
    <View style={styles.desktopCanvas}>
      {/* Top Device Bar */}
      <View style={styles.topControlBar}>
        <View style={styles.deviceBadge}>
          <Text style={styles.deviceBadgeIcon}>🤖</Text>
          <Text style={styles.deviceBadgeText}>Google Pixel 9 Pro</Text>
          <View style={styles.androidPill}>
            <Text style={styles.androidPillText}>Android 15 • 412 × 892</Text>
          </View>
        </View>

        <View style={styles.controlActions}>
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => setFrameEnabled(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.toggleBtnText}>⤢ Full Browser Width</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Outer Google Pixel Chassis */}
      <View
        style={[
          styles.phoneOuterChassis,
          { width: pixelWidth + 24, height: frameHeight + 24 },
        ]}
      >
        {/* Hardware side buttons */}
        <View style={styles.powerButton} />
        <View style={styles.volumeUpButton} />
        <View style={styles.volumeDownButton} />

        {/* Inner Phone Screen */}
        <View style={styles.phoneScreen}>
          {/* Centered Pixel Front-Facing Camera Punch Hole */}
          <View pointerEvents="none" style={styles.punchHoleWrapper}>
            <View style={styles.punchHoleCamera} />
          </View>

          {/* Android Pixel Native Status Bar */}
          <View style={styles.androidStatusBar}>
            <Text style={styles.statusTime}>{currentTime}</Text>
            <View style={styles.statusIcons}>
              <Text style={styles.status5G}>5G</Text>
              <Text style={styles.statusIcon}>📶</Text>
              <Text style={styles.statusBattery}>100% 🔋</Text>
            </View>
          </View>

          {/* App Viewport Body */}
          <View style={styles.appViewport}>{children}</View>

          {/* Android Navigation Bar Gesture Pill */}
          <View pointerEvents="none" style={styles.androidNavPillContainer}>
            <View style={styles.androidNavPill} />
          </View>
        </View>
      </View>

      {/* Bottom Hint Strip */}
      <View style={styles.bottomHintContainer}>
        <Text style={styles.bottomHintText}>
          ✦ DrGodly Pharmacy Mobile Assistant • Native Google Pixel Viewport
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenWrapper: {
    flex: 1,
    position: "relative",
  },
  floatingToolbar: {
    position: "absolute",
    top: 12,
    right: 16,
    zIndex: 9999,
  },
  floatingBtn: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  floatingBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  desktopCanvas: {
    flex: 1,
    backgroundColor: "#0B0F19",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    minHeight: "100%",
  },
  topControlBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 436,
    maxWidth: "100%",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  deviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deviceBadgeIcon: {
    fontSize: 14,
  },
  deviceBadgeText: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  androidPill: {
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    borderWidth: 1,
    borderColor: "#0284C7",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  androidPillText: {
    color: "#38BDF8",
    fontSize: 9.5,
    fontWeight: "800",
  },
  controlActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleBtn: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  toggleBtnText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
  },
  phoneOuterChassis: {
    backgroundColor: "#1E293B",
    borderRadius: 46,
    padding: 10,
    position: "relative",
    borderWidth: 3,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 24,
  },
  powerButton: {
    position: "absolute",
    right: -5,
    top: 140,
    width: 3.5,
    height: 48,
    backgroundColor: "#475569",
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  volumeUpButton: {
    position: "absolute",
    right: -5,
    top: 210,
    width: 3.5,
    height: 44,
    backgroundColor: "#475569",
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  volumeDownButton: {
    position: "absolute",
    right: -5,
    top: 262,
    width: 3.5,
    height: 44,
    backgroundColor: "#475569",
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 36,
    overflow: "hidden",
    position: "relative",
  },
  punchHoleWrapper: {
    position: "absolute",
    top: 7,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },
  punchHoleCamera: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: "#000000",
    borderWidth: 1.5,
    borderColor: "#1E293B",
  },
  androidStatusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 4,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    zIndex: 999,
  },
  statusTime: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  status5G: {
    fontSize: 9.5,
    fontWeight: "900",
    color: colors.primary,
  },
  statusIcon: {
    fontSize: 10,
  },
  statusBattery: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0F172A",
  },
  appViewport: {
    flex: 1,
    backgroundColor: colors.background,
  },
  androidNavPillContainer: {
    height: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  androidNavPill: {
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
  },
  bottomHintContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  bottomHintText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "600",
  },
});
