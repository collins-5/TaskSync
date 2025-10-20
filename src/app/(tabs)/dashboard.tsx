import { FlatList, Animated, ScrollView, View as RNView } from "react-native";
import { useRef } from "react";
import View from "~/components/ui/view";
// import Header, { HEADER_MAX, HEADER_MIN } from "~/components/Dashboard/header";
import { Text } from "~/components/ui/text";
import QuickAction from "~/components/Dashboard/quick-action";
import TransactionCard from "~/components/Dashboard/transaction-card";
import Header from "~/components/Dashboard/header";


const quickActions = [
  { icon: "card-outline" as const, label: "Pay", color: "#FF6B6B" },
  { icon: "wallet-outline" as const, label: "Wallet", color: "#4ECDC4" },
  {
    icon: "stats-chart-outline" as const,
    label: "Analytics",
    color: "#5E60CE",
  },
  { icon: "send-outline" as const, label: "Send", color: "#FFB86C" },
];

const transactions = [
  {
    title: "Spotify",
    subtitle: "Subscription",
    amount: "-$12.99",
    icon: "musical-notes" as const,
    color: "#1DB954",
  },
  {
    title: "Grocery Store",
    subtitle: "Weekly shopping",
    amount: "-$84.50",
    icon: "cart" as const,
    color: "#FF9500",
  },
  {
    title: "Salary",
    subtitle: "Monthly pay",
    amount: "+$3,200",
    icon: "cash" as const,
    color: "#34C759",
  },
  {
    title: "Spotify",
    subtitle: "Subscription",
    amount: "-$12.99",
    icon: "musical-notes" as const,
    color: "#1DB954",
  },
  {
    title: "Grocery Store",
    subtitle: "Weekly shopping",
    amount: "-$84.50",
    icon: "cart" as const,
    color: "#FF9500",
  },
  {
    title: "Salary",
    subtitle: "Monthly pay",
    amount: "+$3,200",
    icon: "cash" as const,
    color: "#34C759",
  },
  {
    title: "Spotify",
    subtitle: "Subscription",
    amount: "-$12.99",
    icon: "musical-notes" as const,
    color: "#1DB954",
  },
  {
    title: "Grocery Store",
    subtitle: "Weekly shopping",
    amount: "-$84.50",
    icon: "cart" as const,
    color: "#FF9500",
  },
  {
    title: "Salary",
    subtitle: "Monthly pay",
    amount: "+$3,200",
    icon: "cash" as const,
    color: "#34C759",
  },
];

export default function Dashboard() {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View className="flex-1 bg-background">
      <Header  />

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true } // <-- THIS LINE
        )}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ paddingTop: HEADER_MAX - HEADER_MIN }} // offset for collapsed header
      >
        {/* Quick Actions */}
        <RNView className="mt-1">
          <Text className="text-lg font-bold text-foreground ml-5 mb-3">
            Quick Actions
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-5"
          >
            {quickActions.map((a, i) => (
              <QuickAction key={i} {...a} />
            ))}
          </ScrollView>
        </RNView>

        {/* Recent Transactions */}
        <RNView className="mt-6">
          <Text className="text-lg font-bold text-foreground ml-5 mb-3">
            Recent Transactions
          </Text>
          <FlatList
            data={transactions}
            renderItem={({ item }) => <TransactionCard {...item} />}
            keyExtractor={(item, idx) => idx.toString()}
            scrollEnabled={false}
          />
        </RNView>

        <RNView className="h-24" />
      </Animated.ScrollView>
    </View>
  );
}
