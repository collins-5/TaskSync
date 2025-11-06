import { View, Text } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";

export default function HeaderSkeleton() {
  return (
    <View className="bg-primary p-4 flex-row items-center">
      {/* Avatar placeholder */}
      <Skeleton className="w-12 h-12 rounded-full mr-4 bg-muted" />

      {/* Title + subtitle placeholders */}
      <View className="flex-1">
        <Skeleton className="h-6 w-24 mb-1 bg-primary-foreground/20" />
        <Skeleton className="h-5 w-32 bg-primary-foreground/20" />
      </View>
    </View>
  );
}
