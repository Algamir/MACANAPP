import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "SecondScreen">) {
  const { isDarkmode, setTheme } = useTheme();
  const [moisture, setMoisture] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const ESP32_URL = "http://172.20.10.2/soil"; // Remplace par l'adresse IP de ton ESP32

  // Demande de permissions pour les notifications
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission de notification non accordée !");
      }
    };
    requestPermission();
  }, []);

  useEffect(() => {
    const fetchMoistureData = async () => {
      try {
        const response = await fetch(ESP32_URL);
        const data = await response.json();
        setMoisture(data.moisture);
        setLoading(false);

        // Envoie une notification si trop sec
        if (data.moisture < 500) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Alerte Humidité",
              body: "Le sol est trop sec ! 🌵",
            },
            trigger: null, // Notification immédiate
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    const interval = setInterval(() => {
      fetchMoistureData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <TopNav
        middleContent="Second Screen"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
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
      <View style={styles.container}>
        <Text fontWeight="bold" style={styles.title}>
          Soil moisture sensor
        </Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#9BAB51"
            style={{
              marginBottom: 30,
            }}
          />
        ) : (
          <Text fontWeight="bold" style={styles.moisture} status="primary">
            {moisture !== null && moisture > 1000
              ? "Too wet! 🌧️"
              : moisture !== null && moisture < 500
              ? "Too dry ! 🌵"
              : "Perfect Humidity ! 🌱"}
          </Text>
        )}
        <Text
          style={{
            fontSize: 16,
            marginBottom: 50,
            color: isDarkmode ? themeColor.white200 : themeColor.white200,
          }}
        >
          Raw value: {moisture !== null ? moisture : "Pending..."}
        </Text>
      </View>
      <View style={styles.container}>
        <Text fontWeight="bold" style={styles.title}>
          Ambiente humidity sensor
        </Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#9BAB51"
            style={{
              marginBottom: 30,
            }}
          />
        ) : (
          <Text fontWeight="bold" style={styles.moisture} status="primary">
            Ambient humidity level:
          </Text>
        )}
        <Text
          style={{
            fontSize: 16,
            marginBottom: 50,
            color: isDarkmode ? themeColor.white200 : themeColor.white200,
          }}
        >
          Raw value: {moisture !== null ? moisture : "Pending..."}
        </Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#265121", // dark green
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: themeColor.primary,
  },
  moisture: {
    fontSize: 20,
    marginBottom: 10,
    color: themeColor.white,
  },
});
