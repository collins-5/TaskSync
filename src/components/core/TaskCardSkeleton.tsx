import * as React from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "../ui/skeleton";

function TaskCardSkeleton() {
  return (
    <Card
      className="mb-4 overflow-hidden bg-card rounded-2xl"
      style={styles.cardShadow}
    >
      {/* Color Bar */}
      <Skeleton className="h-2" />

      {/* Card Header */}
      <CardHeader className="pb-2">
        <View className="flex-row items-center space-x-3">
          {/* Avatar Skeleton */}
          <Skeleton className="w-10 h-10 rounded-full border-2 border-background" />

          {/* Title and Status Skeleton */}
          <View className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-1 rounded" />
            <Skeleton className="h-5 w-1/3 rounded-full mt-1 px-2 py-1" />
          </View>
        </View>
      </CardHeader>

      {/* Separator */}
      <Separator className="mx-4 bg-muted/50" />

      {/* Content Skeleton */}
      <CardContent className="pt-2">
        <Skeleton className="h-4 w-full mb-1 rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </CardContent>

      {/* Button Skeleton */}
      <CardFooter className="pt-2 pb-4">
        <Skeleton className="h-8 flex-1 rounded-lg" />
      </CardFooter>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
});

export { TaskCardSkeleton };
