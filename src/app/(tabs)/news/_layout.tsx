import { Stack } from "expo-router";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function NewsLayout() {
  return (
    <>
      <HeaderSafeAreaView />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
