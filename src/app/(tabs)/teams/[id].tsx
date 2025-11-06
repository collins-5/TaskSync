import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
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
import { useSupabaseData } from "~/hooks/useSupabaseData";

export default function TeamDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, teams, loading, error } = useSupabaseData();
  const [refreshing, setRefreshing] = useState(false);

  const team = teams.find((t) => t.id === id) || {
    id: "unknown",
    name: "Team Not Found",
    members: 0,
    color: "#6b7280",
    initials: "??",
  };

  const teamTasks = tasks.filter((task) => task.team_id === id);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-foreground mt-2">Loading team details...</Text>
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

  const renderTask = ({ item }: { item: (typeof tasks)[0] }) => (
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
          onPress={() => router.push(`/tasks/${item.id}`)}
          accessibilityLabel={`Open ${item.title} details`}
        />
      </CardFooter>
    </Card>
  );

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 pt-4 pb-3 bg-primary">
        <Text className="text-3xl font-bold text-white tracking-tight">
          {team.name}
        </Text>
        <Text className="text-primary-100 mt-1">Team Details</Text>
      </View>
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
            <View>
              <Text className="text-sm font-semibold text-foreground">
                Members
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                {team.members} team members
              </Text>
            </View>
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
              onPress={() => router.push(`/task/new?team_id=${id}`)}
              accessibilityLabel="Create task for this team"
            />
          </CardFooter>
        </Card>
      </View>
    </View>
  );
}
