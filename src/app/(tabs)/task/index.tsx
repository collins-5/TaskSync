import { FlatList, View, Text, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import { useSupabaseData } from "~/hooks/useSupabaseData";
import { TaskCard } from "~/components/core/TaskCard";
import SkeletonList from "~/components/core/SkeletonList";
import { TaskCardSkeleton } from "~/components/core/TaskCardSkeleton";

export default function Tasks() {
  const router = useRouter();
  const { tasks, teams, loading, error } = useSupabaseData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground">Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 pt-4 pb-3 bg-primary">
        <Text className="text-3xl font-bold text-white tracking-tight">
          Tasks
        </Text>
        <Text className="text-primary-100 mt-1">Your project tasks</Text>
      </View>

      {loading ? (<SkeletonList skeletonComponent={TaskCardSkeleton} count={9}/>):(
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskCard
            task={{
              id: item.id,
              title: item.title,
              description: item.description || "No description",
              status: item.status,
              first_name: item.first_name || "Unknown",
              last_name: item.last_name || "",
              color: item.color,
              team_id: item.team_id,
            }}
          />
        )}
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
          <SkeletonList skeletonComponent={TaskCardSkeleton} count={9}/>
        }
      />)}

      <Button
        variant="default"
        size="lg"
        className="absolute bottom-4 right-5 rounded-full shadow-lg"
        iconProps={{ name: "plus", size: 28, className: "text-white" }}
        onPress={() => router.push("/task/new")}
        accessibilityLabel="Create new task"
      />
    </View>
  );
}
