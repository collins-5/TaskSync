import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { DropdownMenu } from "~/components/ui/drop-down-menu";
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
import { useAuth } from "../_layout";

export default function Setup() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Member");
  const { setHasProfile } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    // TODO: Save to Supabase
    console.log("Profile setup:", { name, role });

    // Simulate saving profile
    // await supabase.from('profiles').insert({ id: userId, name, role });

    setHasProfile(true);
    router.replace("/(tabs)/dashboard");
  };

  return (
    <>
      <HeaderSafeAreaView />
      <KeyboardAvoidingWrapper>
        <View className="flex-1 bg-background justify-center px-6 py-4">
          <Card className="bg-card rounded-2xl shadow-lg">
            <CardHeader className="items-center pb-4">
              {/* Logo */}
              <View className="items-center mb-6">
                <Image
                  source={require("../../../assets/splash-logo.png")}
                  className="w-24 h-24"
                  contentFit="contain"
                />
              </View>
              <CardTitle className="text-3xl font-bold text-primary mb-2">
                Complete Profile
              </CardTitle>
              <CardDescription className="text-center text-lg text-muted-foreground">
                Help us personalize your experience
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Name Input */}
              <View>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="Full Name"
                  className="rounded-lg px-4 py-3 text-foreground"
                  placeholderTextColor="rgb(156, 163, 175)"
                  autoCapitalize="words"
                  iconProps={{
                    name: "account-outline",
                    size: 20,
                    className: "text-muted-foreground",
                  }}
                />
              </View>

              {/* Role Dropdown */}
              <View>
                <DropdownMenu
                  items={[
                    { label: "Admin", value: "Admin" },
                    { label: "Manager", value: "Manager" },
                    { label: "Member", value: "Member" },
                  ]}
                  selectedValue={role}
                  onSelect={setRole}
                  placeholder="Select Your Role"
                  className="rounded-lg border border-input"
                />
              </View>

              <Separator className="my-4 bg-muted" />

              {/* Continue Button */}
              <Button
                text="Continue to Dashboard"
                variant="default"
                size="lg"
                className="bg-primary rounded-lg"
                onPress={handleSubmit}
                disabled={!name.trim()}
              />

              {/* Skip for now */}
              <View className="flex-row justify-center mt-2">
                <TouchableOpacity
                  onPress={() => router.replace("/(tabs)/dashboard")}
                >
                  <Text className="text-muted-foreground text-sm">
                    Skip for now
                  </Text>
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        </View>
      </KeyboardAvoidingWrapper>
    </>
  );
}
