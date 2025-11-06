import { FlashList } from "@shopify/flash-list";
import { TeamCard } from "~/components/core/TeamCard";
import { TeamCardSkeleton } from "~/components/core/TeamCardSkeleton";
import { Text } from "~/components/ui/text";
import View from "~/components/ui/view";
import { Team } from "~/hooks/useSupabaseData";

type TeamViewProps = {
  teams: Team[];
  loading: boolean;
};

export default function TeamView({ teams, loading }: TeamViewProps) {
  return (
    <View className="mt-6">
      <Text className="text-lg font-bold text-foreground ml-5 mb-3">
        Your Teams
      </Text>

      {/* FlashList requires a height in horizontal mode */}
      <View className="h-44">
        {loading ? (
          <FlashList
            data={Array(4).fill({})}
            renderItem={() => <TeamCardSkeleton />}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />} 
            contentContainerStyle={{ paddingHorizontal: 20 }}
            keyExtractor={(_, i) => `skeleton-${i}`}
          />
        ) : teams.length === 0 ? (
          <View className="px-5">
            <Text className="text-muted-foreground">No teams yet.</Text>
          </View>
        ) : (
          <FlashList
            data={teams}
            renderItem={({ item }) => <TeamCard team={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />} 
            contentContainerStyle={{ paddingHorizontal: 20 }}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </View>
  );
}
