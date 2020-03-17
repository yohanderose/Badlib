import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
//

import ScratchScreen from "./components/scratch";
import BitScreen from "./components/bits";
import SetScreen from "./components/sets";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Scratch") {
              iconName = "ios-document";
            } else if (route.name === "Bits") {
              iconName = "ios-build";
            } else if (route.name == "Sets") {
              iconName = "ios-microphone";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        })}
        tabBarOptions={{
          activeTintColor: "tomato",
          inactiveTintColor: "gray"
        }}
      >
        <Tab.Screen name="Scratch" component={ScratchScreen} />
        <Tab.Screen name="Bits" component={BitScreen} />
        <Tab.Screen name="Sets" component={SetScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
