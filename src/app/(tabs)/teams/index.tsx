import {
  FlatList,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { Card, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import { useSupabaseData } from "~/hooks/useSupabaseData";

export default function Teams() {
  const router = useRouter();
  const { teams, loading, error } = useSupabaseData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-foreground mt-2">Loading teams...</Text>
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

  const renderTeam = ({ item }: { item: (typeof teams)[0] }) => (
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
      <View className="h-2" style={{ backgroundColor: item.color }} />
      <CardHeader className="pb-2">
        <View className="flex-row items-center space-x-3">
          <Avatar
          resourceURL=""
            className="w-12 h-12 border-2 border-background"
            first_name={item.initials[0]}
            last_name={item.initials[1]}
            alt={item.name}
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
      <HeaderSafeAreaView />
      <View className="px-5 pt-4 pb-3 bg-primary">
        <Text className="text-3xl font-bold text-white tracking-tight">
          Teams
        </Text>
        <Text className="text-primary-100 mt-1">
          Manage your project groups
        </Text>
      </View>
      <FlatList
        data={teams}
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
      <Button
        variant="default"
        size="lg"
        className="absolute bottom-4 right-4 rounded-full items-center justify-center shadow-lg"
        iconProps={{ name: "plus", size: 28, className: "text-white" }}
        onPress={() => router.push("/teams/new")}
        accessibilityLabel="Create new team"
      />
    </View>
  );
}
