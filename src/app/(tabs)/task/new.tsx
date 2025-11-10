import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { DropdownMenu } from "~/components/ui/drop-down-menu";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { useSupabaseData } from "~/hooks/useSupabaseData";
import { useSessionInit } from "~/components/core/SessionInitializer"; // Correct import
import supabase from "~/lib/utils/supabase";

export default function TaskCreation() {
  const router = useRouter();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const { tasks, teams } = useSupabaseData();
  const { user } = useSessionInit(); // Now correct

  const isEdit = !!edit;
  const taskToEdit = isEdit ? tasks.find((t) => t.id === edit) : null;

  const [title, setTitle] = useState(taskToEdit?.title ?? "");
  const [description, setDescription] = useState(taskToEdit?.description ?? "");
  const [status, setStatus] = useState<"Todo" | "InProgress" | "Done">(
    taskToEdit?.status ?? "Todo"
  );
  const [teamId, setTeamId] = useState(
    taskToEdit?.team_id ?? teams[0]?.id ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate team dropdown
  const teamOptions = teams.map((t) => ({
    label: t.name,
    value: t.id,
  }));

  // Sync form with taskToEdit when editing
  useEffect(() => {
    if (isEdit && taskToEdit) {
      setTitle(taskToEdit.title ?? "");
      setDescription(taskToEdit.description ?? "");
      setStatus((taskToEdit.status as typeof status) ?? "Todo");
      setTeamId(taskToEdit.team_id ?? teams[0]?.id ?? "");
    }
  }, [isEdit, taskToEdit, teams]);

  const handleSubmit = async () => {
    if (!title.trim() || !user) {
      setError("Title and user are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        id: isEdit ? edit : `task-${user.id}-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        status,
        first_name: user.user_metadata?.first_name ?? "User",
        last_name: user.user_metadata?.last_name ?? "",
        color: "#6366f1",
        team_id: teamId,
        user_id: user.id,
      };

      const { error } = await supabase
        .from("tasks")
        .upsert(payload, { onConflict: "id" });

      if (error) throw error;

      router.replace("/(tabs)/task");
    } catch (err: any) {
      setError(err.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderSafeAreaView />
      <KeyboardAvoidingWrapper
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 bg-background">
          {/* Header */}
          <View className="flex-row items-center pt-4 pb-3 bg-primary px-4">
            <Button
              variant="ghost"
              onPress={() => router.back()}
              className="rounded-full"
              iconProps={{
                name: "arrow-left",
                size: 24,
                className: "text-white",
              }}
            />
            <View className="flex-1 ml-3">
              <Text className="text-3xl font-bold text-white tracking-tight">
                {isEdit ? "Edit Task" : "New Task"}
              </Text>
              <Text className="text-primary-100 mt-1">
                {isEdit
                  ? "Update task details"
                  : "Add a task to keep your project on track"}
              </Text>
            </View>
          </View>

          {/* Form ScrollView */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingTop: 8 }}
            showsVerticalScrollIndicator={false}
          >
            <Card className="bg-card rounded-2xl shadow-lg overflow-hidden">
              <View className="h-2 bg-primary" />
              <CardHeader className="pb-2">
                <View className="flex-row items-center space-x-3">
                  <Avatar
                    resourceURL=""
                    className="w-10 h-10 border-2 border-background"
                    first_name="T"
                    last_name="S"
                    alt="Task"
                  />
                  <CardTitle className="text-lg text-primary ">Task Details</CardTitle>
                </View>
              </CardHeader>

              <Separator className="mx-4 bg-muted/50" />

              <CardContent className="space-y-5 pt-4">
                <Input
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Task Title"
                  className="rounded-lg px-4 py-3 text-foreground"
                  placeholderTextColor="rgb(156,163,175)"
                  autoCapitalize="sentences"
                  iconProps={{
                    name: "folder-plus-outline",
                    size: 20,
                    className: "text-muted-foreground",
                  }}
                />

                <Input
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Task Description (optional)"
                  className="rounded-lg px-4 py-3 text-foreground"
                  placeholderTextColor="rgb(156,163,175)"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  iconProps={{
                    name: "file-outline",
                    size: 20,
                    className: "text-muted-foreground",
                  }}
                />

                <DropdownMenu
                  items={[
                    { label: "Todo", value: "Todo" },
                    { label: "In Progress", value: "InProgress" },
                    { label: "Done", value: "Done" },
                  ]}
                  selectedValue={status}
                  onSelect={(v) => setStatus(v as typeof status)}
                  placeholder="Select Status"
                  className="rounded-lg border border-input"
                />

                <DropdownMenu
                  items={teamOptions}
                  selectedValue={teamId}
                  onSelect={setTeamId}
                  placeholder="Select Team"
                  className="rounded-lg border border-input"
                />
              </CardContent>

              {error && (
                <View className="px-4 pb-3">
                  <Text className="text-red-500 text-center">{error}</Text>
                </View>
              )}

              <Separator className="mx-4 bg-muted/50" />

              <CardFooter className="flex-row justify-between pt-4 pb-5 px-4 space-x-3">
                <Button
                  text="Cancel"
                  variant="outline"
                  size="default"
                  className="flex-1"
                  onPress={() => router.back()}
                />
                <Button
                  text={isEdit ? "Update" : "Create"}
                  variant="default"
                  size="default"
                  className="flex-1 bg-primary"
                  onPress={handleSubmit}
                  disabled={loading || !title.trim()}
                />
              </CardFooter>

              {loading && (
                <View className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <ActivityIndicator size="large" color="#6366f1" />
                  <Text className="mt-3 text-foreground">Saving task...</Text>
                </View>
              )}
            </Card>
          </ScrollView>
        </View>
      </KeyboardAvoidingWrapper>
    </>
  );
}
