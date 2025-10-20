import { TouchableOpacity } from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

import { Ionicons } from "@expo/vector-icons";
import View from "../ui/view";
import { Text } from "../ui/text";

interface Props {
  title: string;
  subtitle: string;
  amount: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function TransactionCard({
  title,
  subtitle,
  amount,
  icon,
  color,
}: Props) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex-row items-center">
        <TouchableOpacity
          className="w-11 h-11 rounded-full justify-center items-center mr-3"
          style={{ backgroundColor: `${color}33` }}
        >
          <Ionicons name={icon} size={24} color={color} />
        </TouchableOpacity>
        <View className="flex-1">
          <CardTitle>{title}</CardTitle>
          <Text className="text-sm text-gray-500">{subtitle}</Text>
        </View>
        <Text className="font-bold text-foreground">{amount}</Text>
      </CardHeader>
    </Card>
  );
}
