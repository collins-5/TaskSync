import { View, Text, StyleSheet } from "react-native";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { useRouter } from "expo-router";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "Todo" | "InProgress" | "Done";
  first_name: string;
  last_name: string;
  color: string;
  team_id: string;
};

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();

  return (
    <Card
      className="mb-4 overflow-hidden bg-card rounded-2xl"
      style={styles.cardShadow}
    >
      <View className="h-2" style={{ backgroundColor: task.color }} />
      <CardHeader className="pb-2">
        <View className="flex-row items-center space-x-3">
          <Avatar
            resourceURL=""
            className="w-10 h-10 border-2 border-background"
            first_name={task.first_name}
            last_name={task.last_name}
            alt={task.title}
          />
          <View className="flex-1">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <Text
              className={`text-sm px-2 py-1 rounded-full mt-1 ${
                task.status === "Todo"
                  ? "bg-red-100 text-red-800"
                  : task.status === "InProgress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
              }`}
            >
              {task.status}
            </Text>
          </View>
        </View>
      </CardHeader>
      <Separator className="mx-4 bg-muted/50" />
      <CardContent className="pt-2">
        <Text className="text-sm text-muted-foreground line-clamp-2">
          {task.description || "No description"}
        </Text>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button
          text="View Task"
          variant="ghost"
          size="sm"
          className="flex-1"
          onPress={() => router.push(`/task/${task.id}`)}
          accessibilityLabel={`Open ${task.title} details`}
        />
      </CardFooter>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
});
