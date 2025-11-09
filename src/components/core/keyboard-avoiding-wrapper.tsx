import React from "react";
import { KeyboardAvoidingView, Platform, ViewStyle } from "react-native";
import { cn } from "~/lib/utils";

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  scrollEnabled?: boolean;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: ViewStyle;
  keyboardVerticalOffset?: number;
  behavior?: "padding" | "height" | "position";
  style?: ViewStyle;
  className?: string;
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
      className={cn("bg-background", className)}
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
