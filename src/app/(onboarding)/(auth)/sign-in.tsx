// app/(auth)/sign-in.tsx
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useSessionInit } from "~/components/core/SessionInitializer";
import { Separator } from "~/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { SheetManager } from "react-native-actions-sheet";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import supabase from "~/lib/utils/supabase";
import {
  setupOAuthDeepLinkHandler,
  signInWithGoogle,
} from "~/lib/utils/signin-with-google";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper-auth";

export default function SignIn() {
  const { checkAuthState } = useSessionInit();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Deep link + user insert
  useEffect(() => {
    const cleanup = setupOAuthDeepLinkHandler(
      async () => {
        setGoogleLoading(false);
        await checkAuthState();
        router.replace("/(tabs)/dashboard");
      },
      (err) => {
        setGoogleLoading(false);
        Alert.alert("Sign-In Error", err.message);
      },
      async (user) => {
        // INSERT INTO `users`
        const name =
          user.user_metadata.full_name || user.email?.split("@")[0] || "";
        const [first_name = "", ...last] = name.trim().split(" ");
        const last_name = last.join(" ");

        await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
          first_name,
          last_name,
          avatar_url: user.user_metadata.avatar_url,
        });
      }
    );
    return cleanup;
  }, [checkAuthState, router]);

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await checkAuthState();
      router.replace("/(tabs)/dashboard");
    } catch (err) {
      setError((err as Error).message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    const ok = await signInWithGoogle();
    if (!ok) setGoogleLoading(false);
  };

  return (
    <KeyboardAvoidingWrapper>
      <View className="flex-1 bg-background justify-center px-6">
        <Card className="bg-card rounded-2xl shadow-md">
          <CardHeader className="items-center pb-4">
            <CardTitle className="text-3xl font-bold text-primary mb-2">
              Sign In
            </CardTitle>
            <View className="items-center mb-10">
              <Image
                source={require("../../../../assets/splash-logo.png")}
                className="w-32 h-32"
                contentFit="contain"
              />
            </View>
            <CardDescription className="text-center text-xl">
              Welcome back
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <View className="flex-row justify-center space-x-3">
              <Button
                text="Google"
                variant="outline"
                size="default"
                className="flex-1 text-center rounded-lg border-gray-200"
                onPress={handleGoogleSignIn}
                disabled={loading}
              />
            </View>
            <Separator className="my-6 bg-foreground" text="OR" />
            <View className="mb-4">
              <Input
                value={email}
                onChangeText={setEmail}
                className="rounded-lg px-4 py-3 text-black"
                placeholder="alphainvent@gmail.com"
                placeholderTextColor="rgb(105, 105, 105)"
                keyboardType="email-address"
                autoCapitalize="none"
                iconProps={{
                  name: "account-outline",
                  size: 20,
                  className: "text-gray-500",
                }}
              />
            </View>
            <View className="mb-4">
              <Input
                value={password}
                onChangeText={setPassword}
                className="rounded-lg px-4 py-3 text-black"
                placeholder="••••••••"
                placeholderTextColor="rgb(105, 105, 105)"
                secureTextEntry
                iconProps={{
                  name: "lock-outline",
                  size: 20,
                  className: "text-black",
                }}
              />
            </View>
            {error && <Text className="text-red-500 text-center">{error}</Text>}
            <TouchableOpacity
              onPress={() =>
                SheetManager.show("reset-password", {
                  payload: { screen: "email-or-phone-number" },
                })
              }
              className="mb-6"
              disabled={loading || googleLoading}
            >
              <Text className="text-gray-500 text-sm text-right underline">
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <Button
              text="Log In"
              variant="default"
              size="lg"
              className="rounded-lg"
              onPress={handleSignIn}
              disabled={
                loading || googleLoading || !email.trim() || !password.trim()
              }
              loading={loading}
            />
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Don't have an account? </Text>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity disabled={loading || googleLoading}>
                  <Text className="text-primary font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </CardContent>
        </Card>
      </View>
    </KeyboardAvoidingWrapper>
  );
}
