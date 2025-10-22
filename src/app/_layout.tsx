import { Stack, useRouter } from "expo-router";
import { createContext, useContext, useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";
import "../../global.css";
import "~/components/ui/bottom-sheets";
import { SafeAreaView } from "react-native-safe-area-context";
import { SheetProvider } from "react-native-actions-sheet";
import type { User } from "@supabase/supabase-js";
import supabase from "~/lib/utils/supabase";

interface AuthContextType {
  loggedIn: boolean;
  hasProfile: boolean;
  user: User | null;
  setLoggedIn: (value: boolean) => void;
  setHasProfile: (value: boolean) => void;
  setUser: (user: User | null) => void;
  checkAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  hasProfile: false,
  user: null,
  setLoggedIn: () => {},
  setHasProfile: () => {},
  setUser: () => {},
  checkAuthState: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function RootLayout() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuthState = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setLoggedIn(false);
        setHasProfile(false);
        setUser(null);
        return;
      }

      setLoggedIn(true);
      setUser(session.user);

      const { data: profile, error } = await supabase
        .from("users")
        .select("id, first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (error || !profile || (!profile.first_name && !profile.last_name)) {
        setHasProfile(false);
      } else {
        setHasProfile(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setLoggedIn(false);
      setHasProfile(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoggedIn(!!session);
      checkAuthState();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

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
  }, [loggedIn, hasProfile, loading, router]);

  if (loading) {
    return null;
  }

  return (
    <SheetProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContext.Provider
          value={{
            loggedIn,
            hasProfile,
            user,
            setLoggedIn,
            setHasProfile,
            setUser,
            checkAuthState,
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
              backgroundColor="#6366f1" // bg-primary
              barStyle="light-content"
            />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
              <Stack.Screen name="(onboarding)/setup" options={{ headerShown: false }} />
            </Stack>
          </SafeAreaView>
        </AuthContext.Provider>
      </GestureHandlerRootView>
    </SheetProvider>
  );
}
