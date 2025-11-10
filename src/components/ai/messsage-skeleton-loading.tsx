// components/MessageSkeleton.tsx
import * as React from "react";
import View from "../ui/view";
import { Skeleton } from "../ui/skeleton";

export const MessageSkeleton = ({ isUser }: { isUser: boolean }) => (
  <View className={`flex-row mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
    {!isUser && (
      <Skeleton className="w-10 h-10 rounded-full mr-3 border border-border" />
    )}
    <View
      className={`max-w-[75%] rounded-3xl px-5 py-3 ${
        isUser ? "bg-primary/30 rounded-tr-none" : "bg-muted/50 rounded-tl-none"
      } border border-border/50`}
    >
      <Skeleton className="h-4 rounded-full w-32 mb-2" />
      <Skeleton className="h-4 rounded-full w-24" />
    </View>
  </View>
);
