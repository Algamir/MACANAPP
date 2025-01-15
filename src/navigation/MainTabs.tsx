import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { themeColor, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

import Home from "../screens/Home";
import About from "../screens/About";
import Profile from "../screens/Profile";
import Search from "../screens/Search";
import AddPlant from "../screens/AddPlant";

const Tabs = createBottomTabNavigator();

const MainTabs = () => {
  const { isDarkmode } = useTheme();

  const renderAddButton = (focused: boolean) => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          backgroundColor: isDarkmode ? themeColor.dark200 : "#265121", // Couleur dynamique
          width: 60,
          height: 60,
          marginBottom: 30, // Soulève le bouton
        }}
      >
        <Ionicons
          name="add-circle-outline"
          size={60} // Taille de l'icône
          color={
            focused ? (isDarkmode ? themeColor.white100 : "#E9F59E") : "#84A100"
          } // Couleur dynamique
        />
      </View>
    );
  };

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#9BAB51",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#265121",
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={24}
              color={
                focused
                  ? isDarkmode
                    ? themeColor.white100
                    : "#E9F59E"
                  : "#84A100"
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="leaf"
              size={24}
              color={
                focused
                  ? isDarkmode
                    ? themeColor.white100
                    : "#E9F59E"
                  : "#84A100"
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="AddPlant"
        component={AddPlant}
        options={{
          tabBarIcon: ({ focused }) => renderAddButton(focused),
        }}
      />
      <Tabs.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="search"
              size={24}
              color={
                focused
                  ? isDarkmode
                    ? themeColor.white100
                    : "#E9F59E"
                  : "#84A100"
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="About"
        component={About}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="cog"
              size={24}
              color={
                focused
                  ? isDarkmode
                    ? themeColor.white100
                    : "#E9F59E"
                  : "#84A100"
              }
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default MainTabs;
