import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
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
  dismissKeyboardOnTap?: boolean;
}

export default function KeyboardAvoidingWrapper({
  children,
  scrollEnabled = true,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 20,
  behavior = Platform.OS === "ios" ? "padding" : undefined,
  style,
  className,
  dismissKeyboardOnTap = true,
}: KeyboardAvoidingWrapperProps) {
  const content = dismissKeyboardOnTap ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  ) : (
    children
  );

  // For Android, we don't use behavior to avoid jumping
  if (Platform.OS === "android") {
    return (
      <KeyboardAvoidingView
        style={[{ flex: 1 }, style]}
        className={cn("bg-background", className)}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  // For iOS, use padding behavior
  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      className={cn("bg-background", className)}
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {content}
    </KeyboardAvoidingView>
  );
}
