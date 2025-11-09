// src/components/AILoadingMessage.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import Icon from "../ui/icon";

const AILoadingMessage = () => {
  // Only animate the three dots
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createDotAnimation = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createDotAnimation(dot1, 0),
      createDotAnimation(dot2, 200),
      createDotAnimation(dot3, 400),
    ]).start();
  }, [dot1, dot2, dot3]);

  return (
    <View className="flex-row items-start mb-4">
      {/* Avatar */}
      <View className="w-10 h-10 rounded-full bg-primary/20 mr-3 border border-border items-center justify-center">
      <Icon name={'pulse'} size={24}  />
      </View>

      {/* Message Bubble */}
      <View className="max-w-[75%] bg-muted rounded-3xl rounded-tl-md px-5 py-4 border border-border">
        <View className="flex-row items-center">
          <Text className="text-foreground mr-2">AI is thinking</Text>

          {/* Animated Dots Only */}
          <View className="flex-row">
            <Animated.Text
              style={{ opacity: dot1 }}
              className="text-foreground"
            >
              .
            </Animated.Text>
            <Animated.Text
              style={{ opacity: dot2 }}
              className="text-foreground"
            >
              .
            </Animated.Text>
            <Animated.Text
              style={{ opacity: dot3 }}
              className="text-foreground"
            >
              .
            </Animated.Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AILoadingMessage;
