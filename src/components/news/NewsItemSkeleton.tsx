// src/components/skeletons/NewsItemSkeleton.tsx
import React from "react";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

export const NewsItemSkeleton = () => (
  <View className="bg-white rounded-xl mb-4 overflow-hidden shadow-md">
    {/* Image */}
    <Skeleton className="w-full h-48 bg-gray-200" />

    {/* Content */}
    <View className="p-4">
      {/* Title */}
      <Skeleton className="h-5 w-full mb-2 rounded-md" />
      <Skeleton className="h-5 w-10/12 mb-3 rounded-md" />

      {/* Description */}
      <Skeleton className="h-4 w-full mb-2 rounded-md" />
      <Skeleton className="h-4 w-9/12 mb-2 rounded-md" />
      <Skeleton className="h-4 w-8/12 rounded-md" />

      {/* Source & Date */}
      <View className="flex-row justify-between mt-3">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </View>
    </View>
  </View>
);
