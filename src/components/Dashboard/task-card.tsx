import { TouchableOpacity } from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Ionicons } from "@expo/vector-icons";
import View from "../ui/view";
import { Text } from "../ui/text";

interface Props {
  title: string;
  subtitle: string; // Status for tasks
  amount: string; // Team name for tasks
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void; // Add for navigation
}

export default function TaskCard({ title, subtitle, amount, icon, color, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card className="mb-4 mx-4 rounded-2xl shadow-lg">
        <CardHeader className="flex-row items-center">
          <View
            className="w-11 h-11 rounded-full justify-center items-center mr-3"
            style={{ backgroundColor: `${color}33` }}
          >
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <View className="flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <Text
              className={`text-xs px-2 py-1 rounded-full mt-1 ${
                subtitle === "Todo"
                  ? "bg-red-100 text-red-800"
                  : subtitle === "InProgress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
              }`}
            >
              {subtitle}
            </Text>
          </View>
          <Text className="text-sm text-muted-foreground">{amount}</Text>
        </CardHeader>
      </Card>
    </TouchableOpacity>
  );
}
