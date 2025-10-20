import { View, Text } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { DropdownMenu } from "~/components/ui/drop-down-menu";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";

export default function Setup() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Member");
  const router = useRouter();

  const handleSubmit = () => {
    // TODO: Save setup data to Supabase
    console.log({ name, role });
    router.push("/login");
  };

  return (
    <>
      <HeaderSafeAreaView />
      <View className="flex-1 p-4 bg-background">
        <Text className="text-2xl font-bold text-foreground mb-4">
          Set Up Your Profile
        </Text>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
          className="mb-4"
          accessibilityLabel="Name input"
        />
        <DropdownMenu
          items={[
            { label: "Admin", value: "Admin" },
            { label: "Manager", value: "Manager" },
            { label: "Member", value: "Member" },
          ]}
          selectedValue={role}
          onSelect={setRole}
          placeholder="Select Role"
          className="mb-4"
          accessibilityLabel="Role dropdown"
        />
        <Button
          text="Continue"
          variant="default"
          size="default"
          onPress={handleSubmit}
          accessibilityLabel="Continue button"
        />
      </View>
    </>
  );
}
