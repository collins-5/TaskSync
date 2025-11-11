// src/components/profile/MenuItem.tsx
import { TouchableOpacity, Text } from "react-native";
import Icon, { type IconNames } from "~/components/ui/icon";

type MenuItemProps = {
  title: string;
  onPress: () => void;
  iconName: IconNames;
};

export default function MenuItem({ title, onPress, iconName }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-border"
    >
      <Icon name={iconName} size={22} className="text-teal-600 mr-4" />
      <Text className="flex-1 text-foreground text-base">{title}</Text>
      <Icon name="chevron-right" size={20} className="text-muted-foreground" />
    </TouchableOpacity>
  );
}
