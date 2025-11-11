import { TouchableOpacity } from "react-native";
import Icon from "~/components/ui/icon";

type DrawerDashboardButtonProps = {
  setDrawerOpen: (open: boolean) => void;
  className?: string;
};

export default function DrawerDashboardButton({
  setDrawerOpen,
  className = "",
}: DrawerDashboardButtonProps) {

  const handlePress = () => {
    setDrawerOpen(true); 
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`p-2 rounded-full bg-white/10 ${className}`}
      activeOpacity={0.7}
    >
      <Icon name="menu" size={24} className="text-white" />
    </TouchableOpacity>
  );
}
