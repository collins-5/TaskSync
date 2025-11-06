import { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Easing } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Path,
  Polyline,
} from "react-native-svg";

export default function LoadingAnimation() {
  const [dots, setDots] = useState(0);
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Dots animation
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 400);

    // Spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressValue, {
          toValue: 1,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(progressValue, {
          toValue: 2,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(dotsInterval);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressTranslate = progressValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [-192, 0, 192],
  });

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <View className="items-center">
        {/* Animated sync icon */}
        <View className="relative mb-6">
          {/* Outer rotating ring */}
          <Animated.View
            style={{
              position: "absolute",
              transform: [{ rotate: spin }],
            }}
          >
            <Svg width={80} height={80} viewBox="0 0 80 80">
              <Defs>
                <LinearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <Stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="1"
                  />
                  <Stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="0.6"
                  />
                </LinearGradient>
              </Defs>
              <Circle
                cx="40"
                cy="40"
                r="36"
                stroke="url(#gradient1)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="180 40"
                fill="none"
              />
            </Svg>
          </Animated.View>

          {/* Inner pulsing circle */}
          <View className="h-20 w-20 items-center justify-center">
            <Animated.View
              style={{
                position: "absolute",
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "hsl(var(--primary))",
                opacity: 0.3,
                transform: [{ scale: pulseValue }],
              }}
            />
            <Svg
              width={32}
              height={32}
              viewBox="0 0 24 24"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Polyline points="23 4 23 10 17 10" />
              <Polyline points="1 20 1 14 7 14" />
              <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </Svg>
          </View>
        </View>

        {/* TaskSync text */}
        <View className="items-center mb-4">
          <Text className="text-3xl font-bold text-primary mb-2">TaskSync</Text>
          <Text className="text-muted-foreground">
            Loading{".".repeat(dots)}
            <Text style={{ opacity: 0 }}>{".".repeat(3 - dots)}</Text>
          </Text>
        </View>

        {/* Progress bar */}
        <View className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <Animated.View
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "hsl(var(--primary))",
              transform: [{ translateX: progressTranslate }],
            }}
          />
        </View>
      </View>
    </View>
  );
}
