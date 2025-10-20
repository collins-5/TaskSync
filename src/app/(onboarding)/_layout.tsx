import { Stack } from "expo-router";
import { ScreenWrapper } from "~/components/core/screen-wrapper";

export default function OnboardingLayout() {
  return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="welcome" />
          <Stack.Screen name="setup" />
        </Stack>
  );
}
