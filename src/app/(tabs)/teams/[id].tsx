// ─────────────────────────────────────────────────────────────────────────────
//  Team Details – Polished UI with dynamic data from Teams index.tsx
// ─────────────────────────────────────────────────────────────────────────────
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

// Mock data (shared with Teams and Tasks index.tsx)
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

export default function TeamDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Find team by ID (replace with Supabase fetch later)
  const team = mockTeams.find((t) => t.id === id) || {
    id: "unknown",
    name: "Team Not Found",
    members: 0,
    color: "#6b7280",
    initials: "??",
  };

  // Filter tasks by teamId
  const teamTasks = mockTasks.filter((task) => task.teamId === id);

  // Refresh handler (mock for now)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  // Render task card
  const renderTask = ({ item }: { item: (typeof mockTasks)[0] }) => (
    <Card
      className="mb-4 overflow-hidden bg-card rounded-xl"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <View className="h-1" style={{ backgroundColor: item.color }} />
      <CardHeader className="pb-2">
        <View className="flex-row items-center space-x-3">
          <Avatar
          resourceURL=""
            className="w-8 h-8 border-2 border-background"
            first_name={item.first_name}
            last_name={item.last_name}
            alt={item.title}
          />
          <View className="flex-1">
            <CardTitle className="text-base">{item.title}</CardTitle>
            <Text
              className={`text-xs px-2 py-1 rounded-full mt-1 ${
                item.status === "Todo"
                  ? "bg-red-100 text-red-800"
                  : item.status === "InProgress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
              }`}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </CardHeader>
      <CardContent className="pt-2">
        <Text className="text-sm text-muted-foreground line-clamp-2">
          {item.description || "No description"}
        </Text>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button
          text="View Task"
          variant="ghost"
          size="sm"
          className="flex-1"
          onPress={() => router.push(`/task/${item.id}`)}
          accessibilityLabel={`Open ${item.title} details`}
        />
      </CardFooter>
    </Card>
  );

  return (
    <>
      <View className="flex-1 bg-background">
        {/* ── Header (matches Teams, Tasks, TaskCreation) ────────────────────── */}
        <View className="flex-row pt-4 pb-3 bg-primary">
          <View className="w-1/7 mr-4">
            <Button
              variant={"ghost"}
              onPress={() => router.back()}
              className="rounded-full"
              iconProps={{
                name: "arrow-left",
                size: 24,
                className: "text-white",
              }}
            />
          </View>
          <View className="w-2/3">
            <Text className="text-3xl font-bold text-white tracking-tight">
              {team.name}
            </Text>
            <Text className="text-primary-100 mt-1">Team Details</Text>
          </View>
        </View>

        {/* ── Main content ───────────────────────────────────────────────────── */}
        <View className="flex-1 px-4 pt-4">
          <Card className="bg-card rounded-2xl shadow-lg overflow-hidden">
            <View className="h-2" style={{ backgroundColor: team.color }} />

            <CardHeader className="pb-2">
              <View className="flex-row items-center space-x-3">
                <Avatar
                  resourceURL=""
                  className="w-10 h-10 border-2 border-background"
                  first_name={team.initials[0]}
                  last_name={team.initials[1]}
                  alt={team.name}
                />
                <View className="flex-1">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <Text className="text-sm text-muted-foreground">
                    {team.members} members
                  </Text>
                </View>
              </View>
            </CardHeader>

            <Separator className="mx-4 bg-muted/50" />

            <CardContent className="pt-4 space-y-4">
              {/* Members */}
              <View>
                <Text className="text-sm font-semibold text-foreground">
                  Members
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  {team.members} team members
                </Text>
              </View>

              {/* Tasks */}
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Team Tasks
                </Text>
                <FlatList
                  data={teamTasks}
                  renderItem={renderTask}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingBottom: 16 }}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <Text className="text-sm text-muted-foreground">
                      No tasks assigned to this team yet.
                    </Text>
                  }
                />
              </View>
            </CardContent>

            <Separator className="mx-4 bg-muted/50" />

            <CardFooter className="flex-row justify-between pt-4 pb-5 px-4 space-x-3">
              <Button
                text="Back"
                variant="outline"
                size="default"
                className="flex-1"
                onPress={() => router.back()}
                accessibilityLabel="Go back"
              />
              <Button
                text="Create Task"
                variant="default"
                size="default"
                className="flex-1 bg-primary"
                onPress={() => router.push(`/tasks/new?teamId=${id}`)}
                accessibilityLabel="Create task for this team"
              />
            </CardFooter>
          </Card>
        </View>
      </View>
    </>
  );
}
