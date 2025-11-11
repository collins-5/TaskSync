// app/auth/v1/callback.tsx
import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { supabase } from "~/lib/utils/supabase";

export default function OAuthCallback() {
  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const code = params.code as string;
      const error = params.error as string;
      const error_description = params.error_description as string;

      if (error) {
        console.error("OAuth error:", error, error_description);
        router.replace("/(auth)/sign-in");
        return;
      }

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error("Session exchange failed:", exchangeError);
          router.replace("/(auth)/sign-in");
          return;
        }

        // Success! Go to dashboard
        router.replace("/(tabs)/dashboard");
      }
    };

    handleCallback();
  }, [params, router]);

  return (
    <View className="flex-1 items-center justify-center bg-red-600">
      <Text className="text-lg">Completing sign-in...</Text>
    </View>
  );
}
