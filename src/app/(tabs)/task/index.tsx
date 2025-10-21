// ─────────────────────────────────────────────────────────────────────────────
//  Tasks Index – List tasks, navigate to details or create new
// ─────────────────────────────────────────────────────────────────────────────
import { FlatList, View, Text, RefreshControl, Platform } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";

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

const mockTasks = [
  {
    id: "task1",
    title: "Design Homepage",
    description: "Create wireframes for new homepage layout",
    status: "Todo",
    first_name: "Design",
    last_name: "Task",
    color: "#6366f1",
  },
  {
    id: "task2",
    title: "API Integration",
    description: "Connect backend to frontend for user auth",
    status: "InProgress",
    first_name: "API",
    last_name: "Task",
    color: "#10b981",
  },
  {
    id: "task3",
    title: "Bug Fixes",
    description: "Resolve issues in payment module",
    status: "Done",
    first_name: "Bug",
    last_name: "Fix",
    color: "#f59e0b",
  },
];

export default function Tasks() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // ── Refresh handler (mock – replace with Supabase fetch) ───────────────────
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  // ── Render each task card ──────────────────────────────────────────────────
  const renderTask = ({ item }: { item: (typeof mockTasks)[0] }) => (
    <Card
      className="mb-4 overflow-hidden bg-card rounded-2xl"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      {/* Colored top strip (consistent with Teams, TaskCreation) */}
      <View className="h-2" style={{ backgroundColor: item.color }} />

      <CardHeader className="pb-2">
        <View className="flex-row items-center space-x-3">
          <Avatar
            resourceURL=""
            className="w-10 h-10 border-2 border-background"
            first_name={item.first_name}
            last_name={item.last_name}
            alt={item.title}
          />
          <View className="flex-1">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <Text className="text-sm text-muted-foreground">{item.status}</Text>
          </View>
        </View>
      </CardHeader>

      <Separator className="mx-4 bg-muted/50" />

      <CardContent className="pt-2">
        <Text className="text-sm text-muted-foreground line-clamp-2">
          {item.description || "No description"}
        </Text>
      </CardContent>

      <CardFooter className="pt-2 pb-4">
        <Button
          text="View Details"
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
        {/* ── Header (matches Teams, TaskCreation) ───────────────────────────── */}
        <View className="px-5 pt-4 pb-3 bg-primary">
          <Text className="text-3xl font-bold text-white tracking-tight">
            Tasks
          </Text>
          <Text className="text-primary-100 mt-1">
            Track your project progress
          </Text>
        </View>

        {/* ── Task list with pull-to-refresh ─────────────────────────────────── */}
        <FlatList
          data={mockTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
              colors={["#fff"]}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-muted-foreground text-base">
                No tasks yet. Create one to get started!
              </Text>
              <Button
                text="Create Task"
                variant="default"
                size="default"
                className="mt-4 bg-primary"
                onPress={() => router.push("/tasks/new")}
                accessibilityLabel="Create new task"
              />
            </View>
          }
        />

        {/* ── FAB for creating new task (optional) ───────────────────────────── */}
        <View className="absolute bottom-6 right-6">
          <Button
            text="+"
            variant="default"
            size="lg"
            className="rounded-full bg-primary shadow-lg"
            onPress={() => router.push("/task/new")}
            accessibilityLabel="Create new task"
          />
        </View>
      </View>
    </>
  );
}
