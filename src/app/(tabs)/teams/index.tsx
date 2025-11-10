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
import { TeamCard } from "~/components/core/TeamCard";
import SkeletonList from "~/components/core/SkeletonList";
import { TeamCardSkeleton } from "~/components/core/TeamCardSkeleton";
import NoResultFound from "~/components/core/no-results-found";
import Icon from "~/components/ui/icon";

export default function Teams() {
  const router = useRouter();
  const { teams, loading, error } = useSupabaseData();
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
        <HeaderSafeAreaView />
        <Text className="text-3xl font-bold text-white tracking-tight">
          Teams
        </Text>
        <Text className="text-primary-100 mt-1">
          Manage your project groups
        </Text>
      </View>
      {loading ? (
        <SkeletonList skeletonComponent={TeamCardSkeleton} count={9} />
      ) : (
        <FlatList
          data={teams}
          renderItem={({ item }) => <TeamCard team={item} />}
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
            <View className="mt-6">
              <NoResultFound
                icon={<Icon name="view-list" size={24} />}
                title="No Teams Found"
                message="No teams available. Tap the + button hto create a new team."
              />
            </View>
          }
        />
      )}
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
