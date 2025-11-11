// src/app/(tabs)/drawer/settings.tsx
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useState } from "react";
import Icon from "~/components/ui/icon";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import DrawerDashboardButton from "~/components/core/drawer-dashboard-button";
import ProfileDrawer from "~/components/drawer/drawer";

type Props = DrawerScreenProps<any>;

export default function Settings({ navigation }: Props) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <HeaderSafeAreaView />
      <View className="px-5 pt-4 flex-row pb-3 bg-primary">
        <DrawerDashboardButton setDrawerOpen={setDrawerOpen} />
        <Text className="text-3xl font-bold text-white tracking-tight">
          Account Settings
        </Text>
      </View>
      <ScrollView className="flex-1 bg-background">
        <View className="px-6 pt-6 space-y-4">
          <View className="flex-row items-center justify-between py-4 border-b border-border">
            <Text className="text-foreground">Push Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: "#14b8a6" }}
            />
          </View>

          <View className="flex-row items-center justify-between py-4 border-b border-border">
            <Text className="text-foreground">Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ true: "#14b8a6" }}
            />
          </View>

          <TouchableOpacity
            onPress={() => Alert.alert("Privacy", "Your data is safe.")}
            className="flex-row items-center justify-between py-4 border-b border-border"
          >
            <Text className="text-foreground">Privacy Policy</Text>
            <Icon
              name="chevron-right"
              size={20}
              className="text-muted-foreground"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("About", "TaskFlow v1.0")}
            className="flex-row items-center justify-between py-4 border-b border-border"
          >
            <Text className="text-foreground">About App</Text>
            <Icon
              name="chevron-right"
              size={20}
              className="text-muted-foreground"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ProfileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
