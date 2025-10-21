import { FlatList, View, Text, RefreshControl } from "react-native";
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
import { Avatar } from "~/components/ui/avatar"; // Only import Avatar
import { Separator } from "~/components/ui/separator";

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

export default function Teams() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const renderTeam = ({ item }: { item: (typeof mockTeams)[0] }) => (
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
      {/* Colored top banner */}
      <View className="h-2" style={{ backgroundColor: item.color }} />

      <CardHeader className="pb-2">
        <View className="flex-row items-center space-x-3">
          {/* Use your Avatar with initials */}
          <Avatar
            resourceURL=""
            className="w-12 h-12 border-2 border-background"
            first_name={item.initials[0]}
            last_name={item.initials[1]}
            // Or just pass initials as a fallback via alt or resourceURL if needed
            alt={item.initials}
          />

          <View className="flex-1">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <Text className="text-sm text-muted-foreground">
              {item.members} members
            </Text>
          </View>
        </View>
      </CardHeader>

      <Separator className="mx-4 bg-muted/50" />

      <CardFooter className="pt-3 pb-4">
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
  );

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-5 pt-4 pb-3 bg-primary">
        <Text className="text-3xl font-bold text-white tracking-tight">
          Teams
        </Text>
        <Text className="text-primary-100 mt-1">
          Manage your project groups
        </Text>
      </View>

      <FlatList
        data={mockTeams}
        renderItem={renderTeam}
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
              No teams yet. Create one to get started!
            </Text>
          </View>
        }
      />
    </View>
  );
}
