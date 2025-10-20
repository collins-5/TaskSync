// src/components/Header.tsx
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../ui/text";
import View from "../ui/view";

export const HEADER_HEIGHT = 108; // 3/5 of original 180

export default function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-primary justify-end px-5 pb-3"
      style={{
        paddingTop: insets.top,
        height: HEADER_HEIGHT,
      }}
    >
      {/* Large Title */}
      <Text className="text-white font-bold text-2xl mb-1">Dashboard</Text>

      {/* Subtitle */}
      <Text className="text-blue-100 text-base">Welcome back, John!</Text>
    </View>
  );
}
