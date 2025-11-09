import { Image } from "expo-image";
import {  router, Stack } from "expo-router";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import View from "~/components/ui/view";

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 px-6 items-center justify-center">
        <Image
          source={require("@assets/404-illustration.svg")}
          className="w-64 h-64 mb-8"
          contentFit="contain"
          transition={200}
          style={{ width: 600, height: 256 }}

        />
        <Text className="text-6xl font-bold text-foreground mb-2">404</Text>
        <Text className="text-2xl font-semibold text-foreground mb-2">
          Page Not Found
        </Text>
        <Text className="text-base text-muted-foreground text-center max-w-xs mb-10">
          Oops! Looks like this page took a wrong turn and got lost.
        </Text>
        <Button
          text="go back"
          variant="link"
          size="lg"
          className="w-full text-center"
          onPress={() => router.replace("/(tabs)/dashboard")}
        />
      </View>
    </>
  );
};

export default NotFoundScreen;
