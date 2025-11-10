import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function TabsLayout() {
  return (
    <>
      {/* <HeaderSafeAreaView /> */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "#6b7280",
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
          name="profiles"
          options={{
            href: null,
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
        <Tabs.Screen
          name="news"
          options={{
            tabBarLabel: "news",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="menu" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ai-chat"
          options={{
            tabBarLabel: "Chat",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble" size={size} color={color} />
            ),
          }}
        />{" "}
        // Added AI Chat screen
      </Tabs>
    </>
  );
}
