import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SheetProvider } from "react-native-actions-sheet";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import "../../global.css";
import "~/components/ui/bottom-sheets";
import SessionInitializer, {
  useSessionInit,
} from "~/components/core/SessionInitializer";
import View from "~/components/ui/view";
import { Text } from "~/components/ui/text";
import LoadingAnimation from "~/components/core/initial-loading";

const AppContent = () => {
  const { loading, loggedIn, hasProfile } = useSessionInit();
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected || !state.isInternetReachable;
      setIsOffline(offline);
      console.log("Network state:", offline ? "Offline" : "Online");
    });

    NetInfo.fetch().then((state) => {
      const offline = !state.isConnected || !state.isInternetReachable;
      setIsOffline(offline);
      console.log("Initial network state:", offline ? "Offline" : "Online");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      console.log("Session loading, skipping navigation");
      return;
    }

    console.log("Navigation decision:", { loggedIn, hasProfile, isOffline });
    if (isOffline) {
      console.log("Offline, staying on current screen");
      return;
    }

    const timer = setTimeout(() => {
      if (!loggedIn) {
        console.log("Redirecting to welcome (not logged in)");
        router.replace("/(onboarding)/welcome");
      } else if (!hasProfile) {
        console.log("Redirecting to setup (no profile)");
        router.replace("/(onboarding)/setup");
      } else {
        console.log("Redirecting to dashboard (authenticated and has profile)");
        router.replace("/(tabs)/dashboard");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [loading, loggedIn, hasProfile, isOffline, router]);

  if (loading) {
    console.log("Rendering null during loading");
    return (
      <LoadingAnimation />
    );
  }

  if (isOffline) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-foreground text-lg">No internet connection</Text>
        <Text className="text-muted-foreground mt-2">
          Please check your network and try again
        </Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
      <Stack.Screen
        name="(onboarding)/setup"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <SheetProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar backgroundColor="green" barStyle="light-content" />
          <SessionInitializer>
            <AppContent />
          </SessionInitializer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SheetProvider>
  );
}
