import { View, Text, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { useAuth } from "../_layout"; // Adjust path based on your project structure

export default function Welcome() {
  const router = useRouter();
  const { loggedIn } = useAuth();

  return (
    <ImageBackground
      source={require("assets/onboarding.png")}
      className="flex-1 justify-center items-center p-4"
      resizeMode="cover"
    >
      <View className="flex-1 justify-center items-center absolute bottom-12 bg-muted p-10 rounded-2xl">
        <Text className="text-3xl font-bold text-foreground mb-4">
          Welcome to TaskSync
        </Text>
        <Text className="text-foreground text-center font-extrabold mb-6">
          Collaborate with your team, manage tasks, and stay organized.
        </Text>
        <Button
          text="Get Started"
          size="lg"
          className="text-foreground"
          onPress={() => {
            if (!loggedIn) {
              router.push("/sign-in");
            } else {
              router.push("/(onboarding)/setup");
            }
          }}
          accessibilityLabel="Get started button"
        />
      </View>
    </ImageBackground>
  );
}
