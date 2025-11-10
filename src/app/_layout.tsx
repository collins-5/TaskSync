// app/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SheetProvider } from "react-native-actions-sheet";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import "../../global.css";
import "~/components/ui/bottom-sheets";
import SessionInitializer, {
  useSessionInit,
} from "~/components/core/SessionInitializer";
import LoadingAnimation from "~/components/core/initial-loading";
import NetworkError from "~/components/core/NetworkError";

const AppContent = () => {
  const { loading, loggedIn, hasProfile } = useSessionInit();
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter();

  /* --------------------------------------------------------------
     NetInfo listener – true = offline
     -------------------------------------------------------------- */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline =
        state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
      console.log("Network state:", offline ? "Offline" : "Online");
    });

    // initial check
    NetInfo.fetch().then((state) => {
      const offline =
        state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
      console.log("Initial network state:", offline ? "Offline" : "Online");
    });

    return () => unsubscribe();
  }, []);

  /* --------------------------------------------------------------
     Navigation logic – only run when NOT loading & NOT offline
     -------------------------------------------------------------- */
  useEffect(() => {
    if (loading || isOffline) return; // ← block navigation

    const timer = setTimeout(() => {
      if (!loggedIn) {
        router.replace("/(onboarding)/welcome");
      } else if (!hasProfile) {
        router.replace("/(onboarding)/setup");
      } else {
        router.replace("/(tabs)/dashboard");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [loading, loggedIn, hasProfile, isOffline, router]);

  if (loading) {
    return <LoadingAnimation />;
  }

  // if (isOffline) {
  //   return <NetworkError 
  //   onRetry={() => NetInfo.refresh()} 
  //   />;
  // }

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
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
