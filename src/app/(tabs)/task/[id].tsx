// ─────────────────────────────────────────────────────────────────────────────
//  Task Details – Polished UI with dynamic data from index.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { View, Text, Platform, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
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
import { DropdownMenu } from "~/components/ui/drop-down-menu";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

// Mock data (same as index.tsx)
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

export default function TaskDetails() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Type the id
  const router = useRouter();

  // Find task by ID (replace with Supabase fetch later)
  const task = mockTasks.find((t) => t.id === id) || {
    id: "unknown",
    title: "Task Not Found",
    description: "No task found with this ID",
    status: "Todo",
    first_name: "?",
    last_name: "?",
    color: "#6b7280",
    teamId: "unknown",
  };

  const [status, setStatus] = useState(task.status);

  // ── Update status in Supabase (placeholder) ────────────────────────────────
  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    // TODO: Update Supabase
    // await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
  };

  return (
    <>
      <View className="flex-1 bg-background">
        {/* ── Header (consistent with Tasks, Teams) ───────────────────────────── */}
        <View className="px-5 pt-4 pb-3 bg-primary">
          <Text className="text-3xl font-bold text-white tracking-tight">
            {task.title}
          </Text>
          <Text className="text-primary-100 mt-1">Task Details</Text>
        </View>

        {/* ── Main content ────────────────────────────────────────────────────── */}
        <View className="flex-1 px-4 pt-4">
          <Card className="bg-card rounded-2xl shadow-lg overflow-hidden">
            {/* Colored top strip */}
            <View className="h-2" style={{ backgroundColor: task.color }} />

            <CardHeader className="pb-2">
              <View className="flex-row items-center space-x-3">
                <Avatar
                  resourceURL=""
                  className="w-10 h-10 border-2 border-background"
                  first_name={task.first_name}
                  last_name={task.last_name}
                  alt={task.title}
                />
                <View className="flex-1">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <Text
                    className={`text-sm px-2 py-1 rounded-full mt-1 ${
                      status === "Todo"
                        ? "bg-red-100 text-red-800"
                        : status === "InProgress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {status}
                  </Text>
                </View>
              </View>
            </CardHeader>

            <Separator className="mx-4 bg-muted/50" />

            <CardContent className="pt-4 space-y-4">
              {/* Description */}
              <View>
                <Text className="text-sm font-semibold text-foreground">
                  Description
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  {task.description || "No description provided"}
                </Text>
              </View>

              {/* Team */}
              <View>
                <Text className="text-sm font-semibold text-foreground">
                  Team
                </Text>
                <TouchableOpacity
                  onPress={() => router.push(`/teams/${task.teamId}`)}
                  accessibilityLabel={`View team ${task.teamId}`}
                >
                  <Text className="text-sm text-primary underline mt-1">
                    {task.teamId}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Status Dropdown */}
              <View>
                <Text className="text-sm font-semibold text-foreground mb-1">
                  Status
                </Text>
                <DropdownMenu
                  items={[
                    { label: "Todo", value: "Todo" },
                    { label: "In Progress", value: "InProgress" },
                    { label: "Done", value: "Done" },
                  ]}
                  selectedValue={status}
                  onSelect={handleStatusChange}
                  placeholder="Select Status"
                  className="rounded-lg border border-input"
                  accessibilityLabel="Task status dropdown"
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
                text="Edit Task"
                variant="default"
                size="default"
                className="flex-1 bg-primary"
                onPress={() => router.push(`/tasks/new?edit=${id}`)} // Pass edit mode
                accessibilityLabel="Edit task"
              />
            </CardFooter>
          </Card>
        </View>
      </View>
    </>
  );
}
