// src/app/(tabs)/tasks/new.tsx
import { View, Text, Platform, RefreshControl, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";

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

export default function TaskCreation() {
  const router = useRouter();

  // ── Form state ─────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Todo" | "InProgress" | "Done">("Todo");
  const [refreshing, setRefreshing] = useState(false);

  // ── Mock refresh (replace with Supabase fetch) ─────────────────────────────
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  // ── Submit handler (Supabase placeholder) ───────────────────────────────────
  const handleSubmit = async () => {
    if (!title.trim()) return; // Simple validation
    console.log("Creating task →", { title, description, status });
    router.replace("/(tabs)/tasks"); // Back to tasks index
  };

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <KeyboardAvoidingWrapper
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1">
          {/* Header */}
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
                New Task
              </Text>
              <Text className="text-primary-100 mt-1">
                Add a task to keep your project on track
              </Text>
            </View>
          </View>

          {/* Scrollable content */}
          <ScrollView
            className="flex-1"
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
                    alt="TaskSync"
                    size={"lg"}
                  />
                  <View className="flex-1">
                    <CardTitle className="text-lg">Task Details</CardTitle>
                  </View>
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
                  accessibilityLabel="Task title input"
                />
                <View className="my-8"/>
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
                    name: "file-outline", // Valid Ionicons name
                    size: 20,
                    className: "text-muted-foreground",
                  }}
                  accessibilityLabel="Task description input"
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
                  accessibilityLabel="Task status dropdown"
                />
              </CardContent>
              <Separator className="mx-4 bg-muted/50" />
              <CardFooter className="flex-row justify-between pt-4 pb-5 px-4 space-x-3">
                <Button
                  text="Cancel"
                  variant="outline"
                  size="default"
                  className="flex-1 text-center"
                  onPress={() => router.back()}
                  accessibilityLabel="Cancel task creation"
                />
                <Button
                  text="Create"
                  variant="default"
                  size="default"
                  className="flex-1 text-center"
                  onPress={handleSubmit}
                  disabled={!title.trim()}
                  accessibilityLabel="Create task button"
                />
              </CardFooter>
            </Card>
          </ScrollView>
        </View>
      </KeyboardAvoidingWrapper>
    </>
  );
}
