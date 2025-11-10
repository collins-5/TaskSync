import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useSessionInit } from "~/components/core/SessionInitializer";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { Separator } from "~/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Image } from "expo-image";
import { useState } from "react";
import supabase from "~/lib/utils/supabase";
import { Skeleton } from "~/components/ui/skeleton";

export default function SignUp() {
  const { checkAuthState } = useSessionInit();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (user) {
        const [firstName, ...lastNameParts] = fullName.trim().split(" ");
        await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
          first_name: firstName || "",
          last_name: lastNameParts.join(" ") || "",
        });
        await checkAuthState();
      }
    } catch (err) {
      setError((err as Error).message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: "your-app-redirect-url://(tabs)/dashboard" },
      });
      if (error) throw error;
      await checkAuthState();
    } catch (err) {
      setError((err as Error).message || "Failed to sign up with Google");
    } finally {
      setLoading(false);
      Alert.alert("Google Sign-In... Will be implemented soon");
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <View className="flex-1 bg-background justify-center px-6">
        <Card className="bg-card rounded-2xl shadow-md">
          <CardHeader className="items-center pb-4">
            <View className="items-center mb-6">
              <Image
                source={require("../../../../assets/splash-logo.png")}
                className="w-32 h-32"
                contentFit="contain"
              />
            </View>
            <CardTitle className="text-3xl font-bold text-primary mb-2">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center text-xl text-muted-foreground">
              Create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <View className="flex-row justify-center space-x-3">
              <Button
                text="Google"
                variant="outline"
                size="default"
                className="flex-1 text-center rounded-lg border-gray-200"
                onPress={handleGoogleSignUp}
                disabled={loading}
              />
            </View>
            <Separator className="my-6 bg-foreground" text="OR" />
            <View className="mb-4">
              <Input
                value={fullName}
                onChangeText={setFullName}
                className="rounded-lg px-4 py-3 text-black"
                placeholder="Full Name"
                placeholderTextColor="rgb(105, 105, 105)"
                autoCapitalize="words"
                iconProps={{
                  name: "account-outline",
                  size: 20,
                  className: "text-muted-foreground",
                }}
              />
            </View>
            <View className="mb-4">
              <Input
                value={email}
                onChangeText={setEmail}
                className="rounded-lg px-4 py-3 text-black"
                placeholder="Email Address"
                placeholderTextColor="rgb(105, 105, 105)"
                keyboardType="email-address"
                autoCapitalize="none"
                iconProps={{
                  name: "email-outline",
                  size: 20,
                  className: "text-muted-foreground",
                }}
              />
            </View>
            <View className="mb-4">
              <Input
                value={password}
                onChangeText={setPassword}
                className="rounded-lg px-4 py-3 text-black"
                placeholder="Password"
                placeholderTextColor="rgb(105, 105, 105)"
                secureTextEntry
                iconProps={{
                  name: "lock-outline",
                  size: 20,
                  className: "text-muted-foreground",
                }}
              />
            </View>
            <View className="mb-6">
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="rounded-lg px-4 py-3 text-black"
                placeholder="Confirm Password"
                placeholderTextColor="rgb(105, 105, 105)"
                secureTextEntry
                iconProps={{
                  name: "lock-outline",
                  size: 20,
                  className: "text-muted-foreground",
                }}
              />
            </View>
            {error && <Text className="text-red-500 text-center">{error}</Text>}
            <Button
              text="Sign Up"
              variant="default"
              size="lg"
              className="rounded-lg"
              onPress={handleSignUp}
              disabled={
                loading ||
                !fullName.trim() ||
                !email.trim() ||
                !password.trim() ||
                !confirmPassword.trim()
              }
              loading={loading}
            />
            <Text className="text-center text-muted-foreground text-xs mt-4">
              By signing up, you agree to our{" "}
              <Text className="text-primary underline">Terms & Conditions</Text>
            </Text>
            <View className="flex-row justify-center mt-6">
              <Text className="text-muted-foreground">
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-semibold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </CardContent>
        </Card>
      </View>
    </KeyboardAvoidingWrapper>
  );
}
