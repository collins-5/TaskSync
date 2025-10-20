import { Stack } from "expo-router";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function TaskLayout() {
  return (
     <>
      <HeaderSafeAreaView />
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="new" />
    </Stack>
    </>
  );
}
