import { Stack, Redirect, useRouter } from "expo-router";
import { createContext, useContext, useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";
import "~/components/ui/bottom-sheets";
import { SafeAreaView } from "react-native-safe-area-context";
import { SheetProvider } from "react-native-actions-sheet";


// Define the shape of the AuthContext
interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}

// Create AuthContext with a default value
const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  setLoggedIn: () => {},
});

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function RootLayout() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // Handle initial redirect based on login state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loggedIn) {
        router.replace("/(tabs)/dashboard");
      } else {
        router.replace("/(onboarding)/welcome");
      }
    }, 0);
    return () => clearTimeout(timer); // Cleanup
  }, [loggedIn, router]);


  return (
    <SheetProvider
>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
          <SafeAreaView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen 
               name="(tabs)"
               options={{ 
                headerShown: false, 
                }} />
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
