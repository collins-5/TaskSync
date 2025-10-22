import { View, Text, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import KeyboardAvoidingWrapper from "~/components/core/keyboard-avoiding-wrapper";
import { useAuth } from "~/app/_layout";
import { Image } from "expo-image";
import supabase from "~/lib/utils/supabase";

export default function Setup() {
  const router = useRouter();
  const { user, setHasProfile, checkAuthState } = useAuth();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSaveProfile = async () => {
    if (!user) {
      setError("User not authenticated");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [firstName, ...lastNameParts] = fullName.trim().split(" ");
      const { error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          email: user.email,
          first_name: firstName || "",
          last_name: lastNameParts.join(" ") || "",
        });
      if (error) throw error;
      setHasProfile(true);
      await checkAuthState();
      router.replace("/(tabs)/dashboard");
    } catch (err) {
      setError((err as Error).message || "Failed to save profile");
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
                  source={require("../../../assets/splash-logo.png")}
                  className="w-32 h-32"
                  contentFit="contain"
                />
              </View>
              <CardTitle className="text-3xl font-bold text-primary mb-2">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-center text-xl text-muted-foreground">
                Enter your name to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
              {error && (
                <Text className="text-red-500 text-center">{error}</Text>
              )}
              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#6366f1"
                  style={{ marginVertical: 20 }}
                />
              )}
              <Button
                text="Save Profile"
                variant="default"
                size="lg"
                className="bg-primary rounded-lg"
                onPress={handleSaveProfile}
                disabled={loading || !fullName.trim()}
                accessibilityLabel="Save profile button"
              />
            </CardContent>
          </Card>
        </View>
      </KeyboardAvoidingWrapper>
    </>
  );
}
