import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";

// Define the navigation stack's param list
type RootStackParamList = {
  Home: undefined;
};

// Create the stack navigator
const Stack = createStackNavigator<RootStackParamList>();

// Sample Home Screen with Tailwind classes
const HomeScreen: React.FC = () => (
  <View className="flex-1 justify-center items-center bg-white">
    <Text className="text-2xl font-bold text-blue-500">Welcome to MyApp!</Text>
  </View>
);

// Root layout component
const RootLayout: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ 
            title: "Dashboard",
            headerStyle: { backgroundColor: '#f8f9fa' },
            headerTitleStyle: { fontWeight: 'bold', color: '#343a40' },            
          
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootLayout;
