import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Card, CardHeader, CardFooter } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "../ui/skeleton";

function TeamCardSkeleton() {
  return (
    <Card
      className="mb-4 overflow-hidden bg-card w-[350px] rounded-2xl"
      style={styles.cardShadow}
    >
      {/* Color Bar */}
      <Skeleton className="h-2" />

      {/* Card Header */}
      <CardHeader className="pb-2">
        <View className="flex-row items-center space-x-3">
          {/* Avatar Skeleton */}
          <Skeleton className="w-12 h-12 rounded-full border-2 border-background" />

          {/* Title and Members Skeleton */}
          <View className="flex-1">
            <Skeleton className="h-5 w-3/4 mb-2 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </View>
        </View>
      </CardHeader>

      {/* Separator */}
      <Separator className="mx-4 bg-muted/50" />

      {/* Button Skeleton */}
      <CardFooter className="pt-3 pb-4">
        <Skeleton className="h-8 w-full rounded-lg" />
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

export { TeamCardSkeleton };
