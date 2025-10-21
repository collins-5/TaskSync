// ─────────────────────────────────────────────────────────────────────────────
//  Dashboard – Aligned with Tasks and Teams data
// ─────────────────────────────────────────────────────────────────────────────
import { FlatList, Animated, ScrollView, View as RNView  } from "react-native";
import { useRef } from "react";
import { useRouter } from "expo-router";

import View from "~/components/ui/view";
import { Text } from "~/components/ui/text";
import { Avatar } from "~/components/ui/avatar";
import QuickAction from "~/components/Dashboard/quick-action";
import TransactionCard from "~/components/Dashboard/transaction-card"; // Renamed to TaskCard in spirit
import Header from "~/components/Dashboard/header";
import { Card, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

// Mock data (shared with tasks/index.tsx and teams/index.tsx)
const mockTeams = [
  {
    id: "team1",
    name: "Design Team",
    members: 12,
    color: "#6366f1",
    initials: "DT",
  },
  {
    id: "team2",
    name: "Development Team",
    members: 8,
    color: "#10b981",
    initials: "DT",
  },
  {
    id: "team3",
    name: "Marketing Crew",
    members: 5,
    color: "#f59e0b",
    initials: "MC",
  },
  {
    id: "team4",
    name: "Support Squad",
    members: 6,
    color: "#ef4444",
    initials: "SS",
  },
];

const mockTasks = [
  {
    id: "task1",
    title: "Design Homepage",
    description: "Create wireframes for new homepage layout",
    status: "Todo",
    first_name: "Design",
    last_name: "Task",
    color: "#6366f1",
    teamId: "team1",
  },
  {
    id: "task2",
    title: "API Integration",
    description: "Connect backend to frontend for user auth",
    status: "InProgress",
    first_name: "API",
    last_name: "Task",
    color: "#10b981",
    teamId: "team2",
  },
  {
    id: "task3",
    title: "Bug Fixes",
    description: "Resolve issues in payment module",
    status: "Done",
    first_name: "Bug",
    last_name: "Fix",
    color: "#f59e0b",
    teamId: "team1",
  },
];

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
];

export default function Dashboard() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View className="flex-1 bg-background">
      <Header title="Dashboard" subtitle="Welcome back, John!" />

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Quick Actions */}
        <RNView className="mt-4">
          <Text className="text-lg font-bold text-foreground ml-5 mb-3">
            Quick Actions
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-5"
          >
            {quickActions.map((action, i) => (
              <QuickAction
                key={i}
                {...action}
                onPress={() => router.push(action.route)}
              />
            ))}
          </ScrollView>
        </RNView>

        {/* Recent Tasks */}
        <RNView className="mt-6">
          <Text className="text-lg font-bold text-foreground ml-5 mb-3">
            Recent Tasks
          </Text>
          <FlatList
            data={mockTasks.slice(0, 5)} // Limit to 5 for dashboard
            renderItem={({ item }) => (
              <TransactionCard
                title={item.title}
                subtitle={item.status}
                amount={
                  mockTeams.find((t) => t.id === item.teamId)?.name ||
                  item.teamId
                }
                icon="document-outline"
                color={item.color}
                onPress={() => router.push(`/task/${item.id}`)}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </RNView>

        {/* Teams Overview */}
        <RNView className="mt-6">
          <Text className="text-lg font-bold text-foreground ml-5 mb-3">
            Your Teams
          </Text>
          <FlatList
            data={mockTeams.slice(0, 3)} // Limit to 3 for dashboard
            renderItem={({ item }) => (
              <Card
                className="mb-4 mx-4 rounded-2xl bg-card shadow-lg"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  elevation: 4,
                }}
              >
                <View className="h-2" style={{ backgroundColor: item.color }} />
                <CardHeader className="pb-2">
                  <View className="flex-row items-center space-x-3">
                    <Avatar
                    resourceURL=""
                      className="w-10 h-10 border-2 border-background"
                      first_name={item.initials[0]}
                      last_name={item.initials[1]}
                      alt={item.name}
                    />
                    <View className="flex-1">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <Text className="text-sm text-muted-foreground">
                        {item.members} members
                      </Text>
                    </View>
                  </View>
                </CardHeader>
                <CardFooter className="pt-2 pb-4">
                  <Button
                    text="View Team"
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onPress={() => router.push(`/teams/${item.id}`)}
                    accessibilityLabel={`Open ${item.name}`}
                  />
                </CardFooter>
              </Card>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        </RNView>
      </Animated.ScrollView>
    </View>
  );
}
