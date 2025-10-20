import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { DropdownMenu } from "~/components/ui/drop-down-menu";

const mockTask = {
  id: "1",
  title: "Complete UI Design",
  description: "Design the TaskSync UI with NativeWind.",
  status: "Todo",
  teamId: "team1",
};

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const [status, setStatus] = useState(mockTask.status);

  return (
    <View className="flex-1 p-4 bg-background">
      <Card>
        <CardHeader>
          <CardTitle>{mockTask.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-foreground mb-2">{mockTask.description}</Text>
          <Text className="text-foreground mb-2">
            Team ID: {mockTask.teamId}
          </Text>
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
        </CardContent>
      </Card>
    </View>
  );
}
