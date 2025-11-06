import { Stack } from "expo-router";

import View from "~/components/ui/view";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{
          headerTitle: "",
          headerBackVisible: false,
          headerBackground: () => (
            <View className="bg-primary" style={{ flex: 1 }} />
          ),
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerTitle: "",
          headerBackVisible: false,
          headerBackground: () => (
            <View className="bg-primary" style={{ flex: 1 }} />
          ),
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
