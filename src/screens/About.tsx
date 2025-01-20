import React from "react";

import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  Text,
  TopNav,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications"; // Import de Notifications pour les permissions
import { View, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const toggleNotifications = async () => {
    if (!isNotificationsEnabled) {
      // Demande de permission lors de l'activation
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission de notification non accordée !");
        return;
      }
    }
    // Basculer l'état du switch
    setIsNotificationsEnabled((prev) => !prev);
  };

  return (
    <Layout
      style={{
        backgroundColor: isDarkmode ? themeColor.dark : themeColor.secondary,
      }}
    >
      <TopNav
        middleContent="Setting"
        rightContent={
          <Ionicons
            name={isDarkmode ? "sunny" : "moon"}
            size={15}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => {
          if (isDarkmode) {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>SETTINGS</Text>

          <ScrollView style={styles.settingsList}>
            {/* Language Preferences */}
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <Text style={styles.icon}>🌐</Text>
                <Text style={styles.text}>Language Preferences</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            {/* Notifications */}
            <View style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <Text style={styles.icon}>🔔</Text>
                <Text style={styles.text}>Notifications</Text>
              </View>
              <Switch
                value={isNotificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: "#A6A6A6", true: "#C9D38A" }} // Couleur du fond
                thumbColor={isNotificationsEnabled ? "#265121" : "#265121"} // Couleur du cercle
              />
            </View>

            {/* Account Settings */}
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <Text style={styles.icon}>👤</Text>
                <Text style={styles.text}>Account Settings</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            {/* Support */}
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <Text style={styles.icon}>❓</Text>
                <Text style={styles.text}>Contact us</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <Text style={styles.icon}>📖</Text>
                <Text style={styles.text}>FAQ</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            {/* About */}
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <Text style={styles.icon}>ℹ️</Text>
                <Text style={styles.text}>Version 1.0.0</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <Text style={styles.icon}>📜</Text>
                <Text style={styles.text}>Privacy Policy</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <Text style={styles.icon}>🛡️</Text>
                <Text style={styles.text}>Terms of Use</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#265121", // dark green
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  settingsList: {
    padding: 16,
    backgroundColor: "#9BAB51", // light green
    borderRadius: 8,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff33",
  },
  settingLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
    color: "#ffffff",
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
  },
  chevron: {
    fontSize: 20,
    color: "#ffffff",
  },
});
