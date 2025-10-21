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
import { Avatar } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { useData } from "~/hooks/useData";

export default function Tasks() {
  const router = useRouter();
  const { tasks, teams, loading, error } = useData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground">Loading...</Text>
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

  const renderTask = ({ item }: { item: typeof tasks[0] }) => (
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
            className="w-10 h-10 border-2 border-background"
            first_name={item.first_name}
            last_name={item.last_name}
            alt={item.title}
          />
          <View className="flex-1">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <Text
              className={`text-sm px-2 py-1 rounded-full mt-1 ${
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
      <Separator className="mx-4 bg-muted/50" />
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
          onPress={() => router.push(`/task/${item.id}`)}
          accessibilityLabel={`Open ${item.title} details`}
        />
      </CardFooter>
    </Card>
  );

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 pt-4 pb-3 bg-primary">
        <Text className="text-3xl font-bold text-white tracking-tight">
          Tasks
        </Text>
        <Text className="text-primary-100 mt-1">
          Your project tasks
        </Text>
      </View>
      <FlatList
        data={tasks}
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
          </View>
        }
      />
      <Button
        variant="default"
        size="lg"
        className="absolute bottom-4 right-5 rounded-full items-center justify-center"
        iconProps={{ name: "plus-box-outline", size: 24, className: "text-white " }}
        onPress={() => router.push("/task/new")}
      />
    </View>
  );
}