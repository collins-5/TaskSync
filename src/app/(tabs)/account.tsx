// src/app/(tabs)/drawer/account.tsx
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { DrawerScreenProps } from "@react-navigation/drawer";
import supabase from "~/lib/utils/supabase";
import { useSupabaseData } from "~/hooks/useSupabaseData";
import Icon from "~/components/ui/icon";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import DrawerDashboardButton from "~/components/core/drawer-dashboard-button";
import { useState } from "react";
import ProfileDrawer from "~/components/drawer/drawer";

type Props = DrawerScreenProps<any>;

export default function Account({ navigation }: Props) {
  const { profile } = useSupabaseData();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDelete = () => {
    Alert.alert("Delete Account", "This cannot be undone.", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await supabase.from("users").delete().eq("id", profile?.id);
          await supabase.auth.signOut();
          navigation.navigate("(tabs)", { screen: "profiles" });
        },
      },
    ]);
  };

  return (
    <>
      <HeaderSafeAreaView />
      <View className="px-5 pt-4 flex-row pb-3 bg-primary">
        <DrawerDashboardButton setDrawerOpen={setDrawerOpen} />
        <Text className="text-3xl font-bold text-white tracking-tight">
          Manage Account
        </Text>
      </View>
      <ScrollView className="flex-1 bg-background">
        <View className="px-6 pt-6 space-y-4">
          <Text className="text-sm text-muted-foreground">Account ID</Text>
          <Text className="text-foreground font-mono">{profile?.id}</Text>

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-border">
            <Text className="text-foreground">Export Data</Text>
            <Icon name="download" size={20} className="text-muted-foreground" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-border">
            <Text className="text-foreground">Linked Devices</Text>
            <Icon
              name="chevron-right"
              size={20}
              className="text-muted-foreground"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="mt-8 p-4 bg-red-50 rounded-lg items-center"
          >
            <Text className="text-red-600 font-medium">Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ProfileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
