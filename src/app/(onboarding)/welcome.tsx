// app/(onboarding)/welcome.tsx
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { useSessionInit } from "~/components/core/SessionInitializer";
import { useRef, useState, useEffect } from "react";
import Icon from "~/components/ui/icon";

const { width, height } = Dimensions.get("window");

interface Step {
  title: string;
  description: string;
  icon: string;
  gradient: string[];
  iconBg: string;
}

const steps: Step[] = [
  {
    title: "Create Your First Task",
    description:
      "Create tasks, set deadlines, and track progress in one beautiful workspace.",
    icon: "folder-plus",
    gradient: ["#10b981", "#059669"],
    iconBg: "bg-green-500",
  },
  {
    title: "Build Your Team",
    description:
      "Invite teammates, assign roles, and collaborate seamlessly in real time.",
    icon: "account-multiple-plus",
    gradient: ["#3b82f6", "#2563eb"],
    iconBg: "bg-blue-500",
  },
  {
    title: "Browse news",
    description:
      "check on latest top headlines news and updates from the world.",
    icon: "newspaper-variant-multiple",
    gradient: ["#3b82f6", "#2563eb"],
    iconBg: "bg-red-500",
  },
  {
    title: "Stay in Sync",
    description:
      "Get instant updates, chat effortlessly, and ship projects faster — together.",
    icon: "sync",
    gradient: ["#a855f7", "#9333ea"],
    iconBg: "bg-purple-500",
  },
];

export default function Welcome() {
  const router = useRouter();
  const { loggedIn, hasProfile } = useSessionInit();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Icon rotation animation on index change
  useEffect(() => {
    iconRotate.setValue(0);
    Animated.spring(iconRotate, {
      toValue: 1,
      tension: 40,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    if (!loggedIn) router.push("/(auth)/sign-up");
    else if (!hasProfile) router.push("/(onboarding)/setup");
    else router.push("/(tabs)/dashboard");
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onMomentumScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const spin = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
      <StatusBar barStyle="dark-content" />

      {/* Skip Button */}
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="absolute top-12 right-6 z-10"
      >
        <TouchableOpacity
          onPress={handleSkip}
          className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm flex-row shadow-sm"
        >
          <Text className="text-gray-700 font-semibold">Skip</Text>
          <Icon name="arrow-right" size={16} className="text-gray-700 ml-1" />
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content */}
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        {/* Swipeable Steps */}
        <FlatList
          ref={flatListRef}
          data={steps}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumScrollEnd}
          keyExtractor={(_, i) => i.toString()}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1, 0.8],
              extrapolate: "clamp",
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            return (
              <View
                style={{ width }}
                className="justify-center items-center px-8"
              >
                <Animated.View
                  style={{
                    transform: [{ scale }],
                    opacity,
                  }}
                  className="items-center"
                >
                  {/* Animated Icon Container */}
                  <Animated.View
                    style={{
                      transform: [
                        { rotate: currentIndex === index ? spin : "0deg" },
                      ],
                    }}
                    className="mb-12"
                  >
                    <View className="relative">
                      {/* Glow effect */}
                      <View
                        className={`absolute inset-0 w-32 h-32 rounded-full ${item.iconBg} opacity-20 blur-2xl`}
                        style={{ transform: [{ scale: 1.3 }] }}
                      />

                      {/* Icon circle */}
                      <View
                        className={`w-32 h-32 rounded-full ${item.iconBg} items-center justify-center shadow-2xl`}
                        style={{
                          shadowColor: item.gradient[0],
                          shadowOffset: { width: 0, height: 8 },
                          shadowOpacity: 0.3,
                          shadowRadius: 16,
                          elevation: 12,
                        }}
                      >
                        <Icon
                          name={item.icon}
                          size={32}
                          className="text-white"
                        />
                      </View>
                    </View>
                  </Animated.View>

                  {/* Title */}
                  <Text className="text-3xl font-black text-gray-900 text-center mb-4 tracking-tight">
                    {item.title}
                  </Text>

                  {/* Description */}
                  <Text className="text-lg text-gray-600 text-center leading-7 px-2 max-w-sm">
                    {item.description}
                  </Text>
                </Animated.View>
              </View>
            );
          }}
        />

        {/* Progress Dots */}
        <View className="flex-row justify-center items-center mb-8">
          {steps.map((step, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

            const dotScale = scrollX.interpolate({
              inputRange,
              outputRange: [1, 1.3, 1],
              extrapolate: "clamp",
            });

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 32, 8],
              extrapolate: "clamp",
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({
                    index: i,
                    animated: true,
                  });
                  setCurrentIndex(i);
                }}
              >
                <Animated.View
                  style={{
                    height: 8,
                    width: dotWidth,
                    borderRadius: 4,
                    marginHorizontal: 4,
                    opacity,
                    transform: [{ scale: dotScale }],
                  }}
                  className={`${steps[currentIndex].iconBg}`}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Bottom Card */}
      <Animated.View style={{ opacity: fadeAnim }} className="px-6 pb-8">
        <View
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          {/* Brand */}
          <View className="items-center mb-6">
            <Text className="text-5xl font-black text-gray-900 mb-2 tracking-tight">
              TaskSync
            </Text>
            <View className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full" />
          </View>

          <Text className="text-lg text-gray-600 text-center mb-6 font-medium">
            {currentIndex === steps.length - 1
              ? "Ready to transform your workflow?"
              : "Swipe to learn more"}
          </Text>

          {/* Action Button */}
          <Button
            text={currentIndex === steps.length - 1 ? "Get Started" : "Next"}
            size="lg"
            onPress={handleNext}
            className={`${steps[currentIndex].iconBg} shadow-lg`}
            style={{
              shadowColor: steps[currentIndex].gradient[0],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          />

          {/* Social Proof */}
          <View className="flex-row items-center justify-center mt-6 space-x-2">
            <View className="flex-row">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="star-outline"
                  size={16}
                  className="text-yellow-400 -mr-1"
                />
              ))}
            </View>
            <Text className="text-gray-500 text-sm ml-2">
              Trusted by 50K+ teams
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
