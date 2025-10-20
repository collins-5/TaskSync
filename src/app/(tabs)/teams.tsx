import { FlatList, View, Text } from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";

const mockTeams = [
  { id: "team1", name: "Design Team" },
  { id: "team2", name: "Development Team" },
];

export default function Teams() {
  const router = useRouter();

  return (
    <View className="flex-1 p-4 bg-background">
      <Text className="text-2xl font-bold text-foreground mb-4">Teams</Text>
      <FlatList
        data={mockTeams}
        renderItem={({ item }) => (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                text="View Team"
                variant="ghost"
                size="sm"
                onPress={() => router.push(`/team/${item.id}`)} // Add team/[id].tsx later
                accessibilityLabel={`View ${item.name}`}
              />
            </CardContent>
          </Card>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
