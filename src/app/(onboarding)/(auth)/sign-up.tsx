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
import { Image } from "expo-image";

export default function SignUp() {
  const { setLoggedIn } = useAuth();
  const router = useRouter();

  return (
    <>
      <HeaderSafeAreaView />
      <KeyboardAvoidingWrapper>
        <View className="flex-1 bg-background justify-center px-6 py-4">
          <Card className="bg-card rounded-2xl shadow-md">
            <CardHeader className="items-center pb-4">
              {/* Logo */}
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
              {/* Social Sign Up Button */}
              <View className="flex-row justify-center space-x-3">
                <Button
                  text="Google"
                  variant="outline"
                  size="default"
                  className="flex-1 text-center rounded-lg border-gray-200"
                />
              </View>

              <Separator className="my-6 bg-foreground" text="OR" />

              {/* Full Name Input */}
              <View className="mb-4">
                <Input
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

              {/* Email Input */}
              <View className="mb-4">
                <Input
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

              {/* Password Input */}
              <View className="mb-4">
                <Input
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

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Input
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

              {/* Sign Up Button */}
              <Button
                text="Sign Up"
                variant="default"
                size="lg"
                className="bg-primary rounded-lg"
                onPress={() => {
                  setLoggedIn(true);
                  router.push("/(onboarding)/setup");
                }}
              />

              {/* Terms & Conditions */}
              <Text className="text-center text-muted-foreground text-xs mt-4">
                By signing up, you agree to our{" "}
                <Text className="text-primary underline">
                  Terms & Conditions
                </Text>
              </Text>

              {/* Sign In Link */}
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
