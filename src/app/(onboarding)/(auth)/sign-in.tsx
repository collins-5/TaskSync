import { View, Text, TouchableOpacity } from "react-native";
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
import { SheetManager } from "react-native-actions-sheet";
import { Image } from "expo-image";

export default function Login() {
  const { setLoggedIn } = useAuth();
  const router = useRouter();

  return (
    <>
      <HeaderSafeAreaView />
      <KeyboardAvoidingWrapper>
        <View className="flex-1 bg-background justify-center px-6 py-4">
          <Card className="bg-card rounded-2xl shadow-md">
            <CardHeader className="items-center pb-4">
              <CardTitle className="text-3xl font-bold text-primary mb-2">
                Sign In
                <View className="items-center mb-10">
                  <Image
                    source={require("../../../../assets/splash-logo.png")}
                    className="w-32 h-32"
                    contentFit="contain"
                  />
                </View>
              </CardTitle>
              <CardDescription className="text-center text-xl">
                Welcome back
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Social Login Buttons */}
              <View className="flex-row justify-center space-x-3">
                <Button
                  text="Google"
                  variant="outline"
                  size="default"
                  className="flex-1 text-center rounded-lg border-gray-200"
                />
              </View>
              <Separator className="my-6 bg-foreground" text="OR" />
              {/* Email Input */}
              <View className="mb-4">
                <Input
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
              {/* Password Input */}
              <View className="mb-4">
                <Input
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
              {/* Forgot Password */}
              <TouchableOpacity
                onPress={() =>
                  SheetManager.show("reset-password", {
                    payload: { screen: "email-or-phone-number" },
                  })
                }
                className="mb-6"
                accessibilityLabel="Forgot Password action sheet"
              >
                <Text className="text-gray-500 text-sm text-right underline">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              {/* Login Button */}
              <Button
                text="Log In"
                variant="default"
                size="lg"
                className="bg-primary rounded-lg"
                onPress={() => {
                  setLoggedIn(true);
                  router.push("/(onboarding)/setup");
                }}
              />
              {/* Sign Up Link */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Don't have an account? </Text>
                <Link href="/(auth)/sign-up" asChild>
                  <TouchableOpacity>
                    <Text className="text-primary font-semibold">Sign Up</Text>
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
