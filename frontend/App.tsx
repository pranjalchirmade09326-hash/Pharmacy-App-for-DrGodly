import React from "react";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from "./src/context/CartContext";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { PixelDeviceFrame } from "./src/components/PixelDeviceFrame";

// Suppress deprecation warnings in case any transitive packages invoke legacy SafeAreaView
LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <PixelDeviceFrame>
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </PixelDeviceFrame>
    </SafeAreaProvider>
  );
}
