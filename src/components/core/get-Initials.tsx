import { Text } from "react-native";
import { getInitials } from "~/lib/utils/getInitials";

type GetInitialsProps = {
  firstName?: string | null;
  lastName?: string | null;
  className?: string;
};

export default function GetInitials({
  firstName = "",
  lastName = "",
  className = "text-white text-3xl font-bold",
}: GetInitialsProps) {
  const initials = getInitials(firstName ?? "", lastName ?? "");

  return <Text className={className}>{initials}</Text>;
}
