import { View, Text } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { DropdownMenu } from "~/components/ui/drop-down-menu";
import { Button } from "~/components/ui/button";

export default function TaskCreation() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const router = useRouter();

  const handleSubmit = () => {
    // TODO: Save to Supabase
    console.log({ title, description, status });
    router.push("/(tabs)/dashboard");
  };

  return (
    <View className="flex-1 p-4 bg-background">
      <Text className="text-2xl font-bold text-foreground mb-4">
        Create Task
      </Text>
      <Input
        value={title}
        onChangeText={setTitle}
        placeholder="Task Title"
        className="mb-4"
        accessibilityLabel="Task title input"
      />
      <Input
        value={description}
        onChangeText={setDescription}
        placeholder="Task Description"
        className="mb-4"
        accessibilityLabel="Task description input"
      />
      <DropdownMenu
        items={[
          { label: "Todo", value: "Todo" },
          { label: "InProgress", value: "InProgress" },
          { label: "Done", value: "Done" },
        ]}
        selectedValue={status}
        onSelect={setStatus}
        placeholder="Select Status"
        className="mb-4"
        accessibilityLabel="Task status dropdown"
      />
      <Button
        text="Create"
        variant="default"
        size="default"
        onPress={handleSubmit}
        accessibilityLabel="Create task button"
      />
    </View>
  );
}
