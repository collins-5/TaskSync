import { View, Text } from "react-native";
import { Image } from "expo-image";

interface HeaderProps {
  title: string;
  subtitle: string;
  image?: string | null;
}

export default function Header({ title, subtitle, image }: HeaderProps) {
  return (
    <View className="bg-primary p-4 flex-row items-center">
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-12 h-12 rounded-full mr-4"
          contentFit="cover"
        />
      ) : (
        <View className="w-12 h-12 rounded-full bg-muted mr-4 flex items-center justify-center">
          <Text className="text-foreground">?</Text>
        </View>
      )}
      <View>
        <Text className="text-2xl font-bold text-primary-foreground">
          {title}
        </Text>
        <Text className="text-lg text-primary-foreground">{subtitle}</Text>
      </View>
    </View>
  );
}
