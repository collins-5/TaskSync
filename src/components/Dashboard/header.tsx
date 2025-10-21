// src/components/Header.tsx
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../ui/text";
import View from "../ui/view";

export const HEADER_HEIGHT = 50; // 108px total content height

export default function Header({
  title = "Dashboard",
  subtitle = "Welcome back, John!",
  showBack = false,
}: {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-primary"
      style={{
        paddingTop: insets.top,
        height: HEADER_HEIGHT + insets.top,
        ...styles.shadow, // subtle shadow for depth
      }}
    >
      {/* Optional: Darker overlay for depth (pure RN, no gradient) */}
      <View
        className="absolute inset-0 bg-black opacity-10"
        style={{ borderRadius: 0 }}
      />

      <View className="flex-1 justify-end px-5 pb-3">
        {/* Back Button (optional) */}
        {showBack && (
          <View className="absolute left-9 top-12">
            <Text className="text-black text-3xl font-bold">←</Text>
          </View>
        )}

        
        <Text className="text-3xl font-bold text-white tracking-tight"
        >
          {title}
        </Text>

        {/* Subtitle */}
        <Text
          className="text-primary-100 text-base mt-0.5 opacity-90"
          style={{ fontWeight: "500" }}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

// Subtle shadow to lift the header
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});
