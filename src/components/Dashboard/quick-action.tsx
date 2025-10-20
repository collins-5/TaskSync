import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/text";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress?: () => void;
}

export default function QuickAction({ icon, label, color, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} className="items-center w-20 mr-4">
      <TouchableOpacity
        onPress={onPress}
        className="w-14 h-14 rounded-full justify-center items-center mb-2"
        style={{ backgroundColor: color }}
      >
        <Ionicons name={icon} size={28} color="white" />
      </TouchableOpacity>
      <Text className="text-xs text-foreground text-center">{label}</Text>
    </TouchableOpacity>
  );
}
