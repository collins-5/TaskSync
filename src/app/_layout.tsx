import { Stack, useRouter } from "expo-router";
import { createContext, useContext, useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native"; // Added for status bar
import "../../global.css";
import "~/components/ui/bottom-sheets";
import { SafeAreaView } from "react-native-safe-area-context";
import { SheetProvider } from "react-native-actions-sheet";

interface AuthContextType {
  loggedIn: boolean;
  hasProfile: boolean;
  setLoggedIn: (value: boolean) => void;
  setHasProfile: (value: boolean) => void;
  checkAuthState: () => Promise<void>;
}

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

const getAuthToken = async (): Promise<string | null> => {
  return "mock-token"; // Simulate logged in
};

const checkUserProfile = async (userId: string): Promise<boolean> => {
  return false; // Simulate no profile
};

export default function RootLayout() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const userId = "user123";

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
    return null;
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
            {/* Set StatusBar background to bg-primary (#6366f1) */}
            <StatusBar
              backgroundColor="green"
              barStyle="light-content"
            />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            </Stack>
          </SafeAreaView>
        </AuthContext.Provider>
      </GestureHandlerRootView>
    </SheetProvider>
  );
}