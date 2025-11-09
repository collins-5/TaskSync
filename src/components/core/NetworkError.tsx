// ~/components/ui/NetworkError.tsx
import { Image } from "expo-image";
import { View, Text, TouchableOpacity } from "react-native";
import { Button } from "~/components/ui/button";

interface NetworkErrorProps {
  onRetry?: () => void;
}

export default function NetworkError({ onRetry }: NetworkErrorProps = {}) {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      {/* Image */}
      <Image
        source={require("@assets/network-illustration.jpg")}
        // className="w-64 h-64 mb-8"
        contentFit="contain"
        transition={200}
        style={{ width: 600, height: 256 }}
      />

      {/* Title */}
      <Text className="text-foreground text-2xl font-bold text-center mb-2">
        No Internet Connection
      </Text>

      {/* Subtitle */}
      <Text className="text-muted-foreground text-base text-center max-w-xs mb-8">
        Please check your network settings and try again.
      </Text>

      {/* Retry Button */}
      {onRetry && (
        <Button
          text="Try Again"
          onPress={onRetry}
          variant="default"
          size="lg"
          className="min-w-40 text-center"
        />
      )}
    </View>
  );
}
