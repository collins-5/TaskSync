// src/components/drawer/ProfileDrawer.tsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import LogoutButton from "~/components/core/logout-button";
import { useSessionInit } from "../core/SessionInitializer";

// Your Icon
import Icon from "@/components/ui/icon";
import { useSupabaseData } from "~/hooks/useSupabaseData";

const { width, height } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.6; // 60% width

// ── Utility ─────────────────────────────────────────────────────────
const cn = (...inputs: (string | undefined | null | false)[]) => {
  return twMerge(clsx(inputs));
};

// ── Reusable ───────────────────────────────────────────────────────
const Separator = ({ className }: { className?: string }) => (
  <View className={cn("h-px bg-gray-200 dark:bg-gray-700", className)} />
);

type MenuIconName =
  | "account-outline"
  | "cog-outline"
  | "account-cog-outline"
  | "newspaper-variant-multiple"
  | "close";

interface MenuItemProps {
  title: string;
  onPress: () => void;
  iconName: MenuIconName;
}
const MenuItem = ({ title, onPress, iconName }: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      "flex-row items-center space-x-4 py-4 px-4 rounded-2xl",
      "active:bg-gray-100 dark:active:bg-gray-800"
    )}
    activeOpacity={0.7}
  >
    <Icon
      name={iconName}
      size={22}
      className="text-indigo-600 dark:text-indigo-400"
    />
    <Text className="text-lg font-medium text-gray-800 dark:text-gray-100 flex-1">
      {title}
    </Text>
  </TouchableOpacity>
);

// ── Main Drawer ────────────────────────────────────────────────────
interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const router = useRouter();
  const { user } = useSessionInit();

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const { profile } = useSupabaseData();

  // ---------- Animation ----------
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isOpen ? 0 : -DRAWER_WIDTH,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  // ---------- Navigation ----------
  const navigate = (path: string) => {
    onClose();
    router.push(path);
  };

  if (!isOpen) return null;

  const displayName = user?.email ?? "User";

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={{ opacity: backdropOpacity }}
        className="absolute inset-0 bg-black/60 z-40"
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Drawer – 60% width, flush with top (notch holds it) */}
      <Animated.View
        style={[
          { transform: [{ translateX }] },
          { width: DRAWER_WIDTH, height },
        ]}
        className="absolute left-0 top-0 z-50"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Pure White Card – starts at top edge */}
          <View className="flex-1 bg-white shadow-2xl border-r border-gray-100">
            {/* Header – flush with top */}
            <View className="flex-row items-center justify-between p-6 pt-safe pb-4">
              <Text className="text-2xl font-bold text-gray-900">Menu</Text>
              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-100 rounded-full p-2.5 shadow-md"
                activeOpacity={0.8}
              >
                <Icon name="close" size={24} className="text-gray-700" />
              </TouchableOpacity>
            </View>

            {/* Greeting */}
            <View className="px-6 pt-3 pb-5">
              <Text className="text-sm font-medium text-gray-600">Hello,</Text>
              <Text className="text-xl font-bold text-gray-900 mt-1">
                {displayName}
              </Text>
              <Text className="text-xl font-bold text-gray-900 mt-1">
                {profile?.first_name} {profile?.last_name}
              </Text>
            </View>

            <Separator className="mx-6" />

            {/* Menu */}
            <View className="flex-1 px-6 py-4 space-y-1">
              <MenuItem
                title="Top Stories"
                onPress={() => navigate("/(tabs)/news")}
                iconName="newspaper-variant-multiple"
              />
              <MenuItem
                title="Profile"
                onPress={() => navigate("/profiles")}
                iconName="account-outline"
              />
              <Separator className="my-2" />
              <MenuItem
                title="Account Settings"
                onPress={() => navigate("/settings")}
                iconName="cog-outline"
              />
              <Separator className="my-2" />
              <MenuItem
                title="Manage Account"
                onPress={() => navigate("/account")}
                iconName="account-cog-outline"
              />
              <Separator className="my-2" />
              <View className="py-3 px-4">
                <LogoutButton />
              </View>
            </View>

            {/* Footer */}
            <View className="p-5 border-t border-gray-100">
              <Text className="text-xs text-center text-gray-500">
                © 2025 TaskSync. All rights reserved.
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </>
  );
}
