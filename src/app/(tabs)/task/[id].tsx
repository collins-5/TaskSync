import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState } from "react";
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
import { useSupabaseData } from "~/hooks/useSupabaseData";
import supabase from "~/lib/utils/supabase";

export default function TaskDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, teams, loading, error } = useSupabaseData();

  const task = tasks.find((t) => t.id === id) || {
    id: "unknown",
    title: "Task Not Found",
    description: "No task found with this ID",
    status: "Todo",
    first_name: "?",
    last_name: "?",
    color: "#6b7280",
    team_id: "unknown",
  };

  const [status, setStatus] = useState(task.status);
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setSaving(true);
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#6366f1" />
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
    <>
      <HeaderSafeAreaView />
      <View className="flex-1 bg-background">
        <View className="px-5 pt-4 pb-3 bg-primary">
          <Text className="text-3xl font-bold text-white tracking-tight">
            {task.title}
          </Text>
          <Text className="text-primary-100 mt-1">Task Details</Text>
        </View>

        <View className="flex-1 px-4 pt-4">
          <Card className="bg-card rounded-2xl shadow-lg overflow-hidden">
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
              <View>
                <Text className="text-sm font-semibold text-foreground">
                  Description
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  {task.description || "No description provided"}
                </Text>
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground">
                  Team
                </Text>
                <TouchableOpacity
                  onPress={() => router.push(`/teams/${task.team_id}`)}
                >
                  <Text className="text-sm text-primary underline mt-1">
                    {teams.find((t) => t.id === task.team_id)?.name ||
                      task.team_id}
                  </Text>
                </TouchableOpacity>
              </View>

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
                />
                {saving && (
                  <Text className="text-sm text-muted-foreground mt-1">
                    Saving...
                  </Text>
                )}
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
              />
              <Button
                text="Edit Task"
                variant="default"
                size="default"
                className="flex-1 bg-primary"
                onPress={() => router.push(`/task/new?edit=${id}`)}
              />
            </CardFooter>
          </Card>
        </View>
      </View>
    </>
  );
}
