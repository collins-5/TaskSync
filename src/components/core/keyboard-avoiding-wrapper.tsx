import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ViewStyle,
} from "react-native";
import { cn } from "~/lib/utils"; // Assuming you have a Tailwind helper like `cn`

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  scrollEnabled?: boolean;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: ViewStyle;
  keyboardVerticalOffset?: number;
  behavior?: "padding" | "height" | "position"; // Add behavior
  style?: ViewStyle; // Allow custom outer styles
  className?: string; // Allow Tailwind classes
}

export default function KeyboardAvoidingWrapper({
  children,
  scrollEnabled = true,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 20,
  behavior = Platform.OS === "ios" ? "padding" : "height",
  style,
  className,
}: KeyboardAvoidingWrapperProps) {
  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      className={cn("bg-background", className)} // Default bg to match app
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        contentContainerStyle={[
          { flexGrow: 1 },
          contentContainerStyle,
        ]}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {children}
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
