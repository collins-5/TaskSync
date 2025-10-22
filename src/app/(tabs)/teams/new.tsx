import { View, Text, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
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
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { useAuth } from "~/app/_layout";
import supabase from "~/lib/utils/supabase";
import { ScrollView } from "react-native-actions-sheet";

export default function TeamCreation() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !members.trim() || !user) return;
    setLoading(true);
    setError("");

    try {
      const initials = name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() || "")
        .join("");
      const payload = {
        id: `team-${user.id}-${Date.now()}`,
        name,
        members: parseInt(members, 10),
        color: "#6366f1", // default primary
        initials,
      };

      const { error } = await supabase.from("teams").insert(payload);
      if (error) throw error;

      router.replace("/(tabs)/teams");
    } catch (err) {
      setError((err as Error).message || "Failed to create team");
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
                New Team
              </Text>
              <Text className="text-primary-100 mt-1">
                Create a team to collaborate on projects
              </Text>
            </View>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingTop: 8 }}
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
                  />
                  <CardTitle className="text-lg">Team Details</CardTitle>
                </View>
              </CardHeader>
              <Separator className="mx-4 bg-muted/50" />
              <CardContent className="space-y-5 pt-4">
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="Team Name"
                  className="rounded-lg px-4 py-3 text-foreground"
                  placeholderTextColor="rgb(156,163,175)"
                  autoCapitalize="words"
                  iconProps={{
                    name: "pulse",
                    size: 20,
                    className: "text-muted-foreground",
                  }}
                />
                <Input
                  value={members}
                  onChangeText={setMembers}
                  placeholder="Number of Members"
                  className="rounded-lg px-4 py-3 text-foreground"
                  placeholderTextColor="rgb(156,163,175)"
                  keyboardType="numeric"
                  iconProps={{
                    name: "pulse",
                    size: 20,
                    className: "text-muted-foreground",
                  }}
                />
              </CardContent>
              {error && (
                <Text className="text-red-500 text-center px-4">{error}</Text>
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
                  text="Create"
                  variant="default"
                  size="default"
                  className="flex-1 bg-primary"
                  onPress={handleSubmit}
                  disabled={loading || !name.trim() || !members.trim()}
                />
              </CardFooter>
              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#6366f1"
                  style={{ marginTop: 20 }}
                />
              )}
            </Card>
          </ScrollView>
        </View>
      </KeyboardAvoidingWrapper>
    </>
  );
}
