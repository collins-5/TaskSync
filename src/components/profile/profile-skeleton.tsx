import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function ProfileSkeleton() {
  return (
    <>
      <HeaderSafeAreaView />

      <View className="flex-1 bg-background px-6 pt-10 pb-6">
        {/* AVATAR + NAME SECTION */}
        <View className="items-center mb-8">
          {/* Back Button Skeleton */}
          <View className="absolute -left-1">
            <Skeleton className="w-12 h-12 rounded-full" />
          </View>

          {/* Avatar */}
          <Skeleton className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-4" />

          {/* Email */}
          <Skeleton className="h-4 w-48 mt-4" />

          {/* Full Name */}
          <Skeleton className="h-7 w-56 mt-2" />

          {/* Member Since */}
          <Skeleton className="h-4 w-40 mt-2" />
        </View>

        {/* Edit Button (when not editing) */}
        <View className="flex-row justify-end mb-6">
          <Skeleton className="h-12 w-32 rounded-lg" />
        </View>

        {/* FORM FIELDS */}
        <View className="space-y-4">
          {/* First Name */}
          <View>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </View>

          {/* Last Name */}
          <View>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </View>

          {/* Email */}
          <View>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </View>
        </View>

        {/* Save/Cancel Buttons (when editing) */}
        <View className="mt-8 flex-row justify-around">
          <Skeleton className="h-12 w-32 rounded-lg" />
          <Skeleton className="h-12 w-32 rounded-lg" />
        </View>
      </View>
    </>
  );
}
