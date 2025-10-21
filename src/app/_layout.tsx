import { Stack, useRouter } from "expo-router";
import { createContext, useContext, useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";
import "~/components/ui/bottom-sheets";
import { SafeAreaView } from "react-native-safe-area-context";
import { SheetProvider } from "react-native-actions-sheet";

// === 1. Define AuthContextType FIRST ===
interface AuthContextType {
  loggedIn: boolean;
  hasProfile: boolean;
  setLoggedIn: (value: boolean) => void;
  setHasProfile: (value: boolean) => void;
  checkAuthState: () => Promise<void>;
}

// === 2. Now create context ===
const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  hasProfile: false,
  setLoggedIn: () => {},
  setHasProfile: () => {},
  checkAuthState: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock async auth check
const getAuthToken = async (): Promise<string | null> => {
  // Replace with real auth check (AsyncStorage, SecureStore, etc.)
  return "mock-token"; // Simulate logged in
};

const checkUserProfile = async (userId: string): Promise<boolean> => {
  // Replace with real API call
  // const { data } = await supabase.from('profiles').select().eq('id', userId);
  // return data?.length > 0;
  return false; // Simulate no profile
};

export default function RootLayout() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const userId = "user123"; // Replace with real user ID from auth

  const checkAuthState = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();

      if (!token) {
        setLoggedIn(false);
        setHasProfile(false);
        return;
      }

      setLoggedIn(true);
      const profileExists = await checkUserProfile(userId);
      setHasProfile(profileExists);
    } catch (error) {
      console.error("Auth check failed:", error);
      setLoggedIn(false);
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();
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
    return null; // Or show splash screen
  }

  return (
    <SheetProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContext.Provider
          value={{
            loggedIn,
            hasProfile,
            setLoggedIn,
            setHasProfile,
            checkAuthState,
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(onboarding)"
                options={{ headerShown: false }}
              />
            </Stack>
          </SafeAreaView>
        </AuthContext.Provider>
      </GestureHandlerRootView>
    </SheetProvider>
  );
}
