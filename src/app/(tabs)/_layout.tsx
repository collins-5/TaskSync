import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function TabsLayout() {
  return (
     <>
      <HeaderSafeAreaView />
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6", // Tailwind blue-500
        tabBarInactiveTintColor: "#6b7280", // Tailwind gray-500
        tabBarStyle: { backgroundColor: "#fff" },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          tabBarLabel: "Teams",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          tabBarLabel: "Task",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
    </>
  );
}
