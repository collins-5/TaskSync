import { FlatList, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/text";

// === Single Quick Action Button Component (inside the same file) ===
function QuickActionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} className="items-center w-20 mr-4">
      <TouchableOpacity
        onPress={onPress}
        className="w-14 h-14 rounded-full justify-center items-center mb-2 shadow-lg"
        style={{ backgroundColor: color }}
      >
        <Ionicons name={icon} size={28} color="white" />
      </TouchableOpacity>
      <Text className="text-xs text-foreground text-center font-medium">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// === Main QuickActions Component with FlatList ===
type QuickActionItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  route?: string;
};

type QuickActionsProps = {
  actions: QuickActionItem[];
  onPress: (route?: string) => void;
};

export default function QuickActions({ actions, onPress }: QuickActionsProps) {
  return (
    <View className="mt-4">
      <Text className="text-lg font-bold text-foreground ml-5 mb-3">
        Quick Actions
      </Text>

      <FlatList
        data={actions}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 12 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <QuickActionButton
            icon={item.icon}
            label={item.label}
            color={item.color}
            onPress={() => onPress(item.route)}
          />
        )}
      />
    </View>
  );
}
