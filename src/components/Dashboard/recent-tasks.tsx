import { FlashList } from "@shopify/flash-list";
import { TaskCard } from "~/components/core/TaskCard";
import { TaskCardSkeleton } from "~/components/core/TaskCardSkeleton";
import { Text } from "~/components/ui/text";
import View from "~/components/ui/view";
import { Task } from "~/hooks/useSupabaseData";
import SkeletonList from "../core/SkeletonList";
import NoResultFound from "../core/no-results-found";
import Icon from "../ui/icon";

type TaskViewProps = {
  tasks: Task[];
  loading: boolean;
};

export default function TaskView({ tasks, loading }: TaskViewProps) {
  return (
    <View className="mt-6 flex-1">
      <Text className="text-lg font-bold text-foreground ml-5 mb-3">
        Recent Tasks
      </Text>

      {loading ? (
        <View className="px-4">
          <SkeletonList skeletonComponent={TaskCardSkeleton} count={3} />
        </View>
      ) : (
        <FlashList
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
          contentContainerStyle={{ paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="mt-6">
              <NoResultFound
                icon={<Icon name="view-list" size={24} />}
                title="No Tasks Found"
                message="No tasks available. Tap the + button hto create a new task."
              />
            </View>
          }
        />
      )}
    </View>
  );
}
