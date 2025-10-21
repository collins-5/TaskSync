import { FlatList, Animated, ScrollView, View as RNView } from "react-native";
import { useRef } from "react";
import { useRouter } from "expo-router";
import View from "~/components/ui/view";
import { Text } from "~/components/ui/text";
import { Avatar } from "~/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import QuickAction from "~/components/Dashboard/quick-action";
import Header from "~/components/Dashboard/header";
import { useData } from "~/hooks/useData";
import TaskCard from "~/components/Dashboard/task-card";

const quickActions = [
  {
    icon: "add-circle-outline" as const,
    label: "New Task",
    color: "#6366f1",
    route: "/tasks/new",
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
    route: "/tasks",
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
  const { tasks, teams, loading, error } = useData();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground">Error: {error}</Text>
      </View>
    );
  }

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
            data={tasks.slice(0, 5)}
            renderItem={({ item }) => (
              <TaskCard
                title={item.title}
                subtitle={item.status}
                amount={teams.find((t) => t.id === item.teamId)?.name || item.teamId}
                icon="document-outline"
                color={item.color}
                onPress={() => router.push(`/tasks/${item.id}`)}
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
            data={teams.slice(0, 3)}
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