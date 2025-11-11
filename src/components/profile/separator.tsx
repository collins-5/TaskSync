// src/components/profile/Separator.tsx
import { View } from "react-native";

type SeparatorProps = {
  className?: string;
};

export default function Separator({ className = "my-2" }: SeparatorProps) {
  return <View className={`h-px bg-border ${className}`} />;
}
