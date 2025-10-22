import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useAuth } from "../../_layout";
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

export default function SignUp() {
  const { setLoggedIn, setHasProfile, checkAuthState } = useAuth();
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
      const { data: { user }, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (user) {
        const [firstName, ...lastNameParts] = fullName.trim().split(" ");
        await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
          first_name: firstName || "",
          last_name: lastNameParts.join(" ") || "",
        });
        setLoggedIn(true);
        setHasProfile(!!firstName);
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
        options: { redirectTo: "http://localhost:8081/(tabs)/dashboard" },
      });
      if (error) throw error;
      setLoggedIn(true);
      await checkAuthState();
    } catch (err) {
      setError((err as Error).message || "Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderSafeAreaView />
      <KeyboardAvoidingWrapper>
        <View className="flex-1 bg-background justify-center px-6 py-4">
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
              {error && (
                <Text className="text-red-500 text-center">{error}</Text>
              )}
              {loading && (
                <ActivityIndicator size="large" color="#6366f1" style={{ marginVertical: 20 }} />
              )}
              <Button
                text="Sign Up"
                variant="default"
                size="lg"
                className="bg-primary rounded-lg"
                onPress={handleSignUp}
                disabled={loading || !fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()}
              />
              <Text className="text-center text-muted-foreground text-xs mt-4">
                By signing up, you agree to our{" "}
                <Text className="text-primary underline">
                  Terms & Conditions
                </Text>
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
    </>
  );
}
