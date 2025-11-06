import { Animated, ScrollView, TouchableOpacity } from "react-native";
import { useRef } from "react";
import { useRouter } from "expo-router";
import View from "~/components/ui/view";
import Header from "~/components/Dashboard/header";
import HeaderSkeleton from "~/components/Dashboard/header-loading-skeleton";
import TaskView from "~/components/Dashboard/recent-tasks";
import TeamView from "~/components/Dashboard/teams-overview";
import { useSupabaseData } from "~/hooks/useSupabaseData";
import QuickActions from "~/components/Dashboard/quick-action";

const quickActions = [
  {
    icon: "add-circle-outline" as const,
    label: "New Task",
    color: "#6366f1",
    route: "/task/new",
  },
  {
    icon: "people-outline" as const,
    label: "Teams",
    color: "#10b981",
    route: "/teams",
  },
  {
    icon: "list-outline" as const,
    label: "All Tasks",
    color: "#f59e0b",
    route: "/task",
  },
  {
    icon: "chatbubble-outline" as const,
    label: "AI Chat",
    color: "#5E60CE",
    route: "/ai-chat",
  },
  {
    icon: "people-outline" as const,
    label: "Teams",
    color: "#10b981",
    route: "/teams",
  },
  {
    icon: "list-outline" as const,
    label: "All Tasks",
    color: "#f59e0b",
    route: "/task",
  },
  {
    icon: "chatbubble-outline" as const,
    label: "AI Chat",
    color: "#5E60CE",
    route: "/ai-chat",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { profile, teams, tasks, loading } = useSupabaseData();

  const handleQuickActionPress = (route?: string) => {
    if (route) router.push(route);
  };

  console.log("tasks", tasks);


  return (
    <View className="flex-1 bg-background">
      <TouchableOpacity onPress={() => router.push("/profiles")}>
        {loading ? (
          <HeaderSkeleton />
        ) : (
          <Header
            title="Dashboard"
            subtitle={
              profile ? `Welcome back, ${profile.first_name}!` : "Welcome back!"
            }
            image={profile?.image}
          />
        )}
      </TouchableOpacity>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <QuickActions actions={quickActions} onPress={handleQuickActionPress} />

        <TeamView teams={teams} loading={loading} />
        <TaskView tasks={tasks} loading={loading} />
      </Animated.ScrollView>
    </View>
  );
}
