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

import {
  Select,
  SelectContent,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@gluestack-ui/react";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "SecondScreen">) {
  const { isDarkmode, setTheme } = useTheme();
  const [moisture, setMoisture] = useState<number | null>(null);
  const [bmeData, setBmeData] = useState<{
    temperature: number | null;
    humidity: number | null;
    pressure: number | null;
  }>({
    temperature: null,
    humidity: null,
    pressure: null,
  });
  const [loading, setLoading] = useState(true);

  const ESP32_URL = "http://172.20.10.2/soil"; // Remplace par l'adresse IP de ton ESP32
  const ESP32_BME = "http://172.20.10.2/bme"; // Remplace par l'adresse IP de ton ESP32

  const [notificationFrequency, setNotificationFrequency] = useState(60); // Fréquence en minutes
  const [lastNotificationTime, setLastNotificationTime] = useState<
    number | null
  >(null);

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
    const fetchMoistureDatabme = async () => {
      try {
        const response = await fetch(ESP32_BME);
        const data = await response.json();
        setBmeData({
          temperature: data.temperature,
          humidity: data.humidity,
          pressure: data.pressure,
        });
        setLoading(false);

        // Envoie une notification si trop sec
        if (data.bme < 30) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Alert humidity level of the room",
              body: "The humidity of the room is too dry ! 🌵",
            },
            trigger: null, // Notification immédiate
          });
        }
        // Envoie une notification si trop sec
        if (data.bme > 90) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Alert humidity level of the room",
              body: "The humidity of the room is too Wet ! 💦",
            },
            trigger: null, // Notification immédiate
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    const fetchMoistureData = async () => {
      try {
        const response = await fetch(ESP32_URL);
        const data = await response.json();
        setMoisture(data.moisture);

        // Vérifie si une notification doit être envoyée
        if (data.moisture < 500) {
          const currentTime = Date.now();
          if (
            !lastNotificationTime ||
            currentTime - lastNotificationTime >=
              notificationFrequency * 60 * 1000 // Notification selon la fréquence choisie
          ) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Humidity plant alert",
                body: "The plant is too dry! 🌵",
              },
              trigger: null, // Notification immédiate
            });

            setLastNotificationTime(currentTime); // Met à jour le temps de la dernière notification
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    const interval = setInterval(() => {
      fetchMoistureData();
      fetchMoistureDatabme();
    }, 1000);

    return () => clearInterval(interval);
  }, [notificationFrequency, lastNotificationTime]);

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
          <Text fontWeight="bold" style={styles.moisture}>
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
        <Text fontWeight="bold" style={styles.title2}>
          Notification Frequency
        </Text>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.frequencyText}>
            Current frequency: {notificationFrequency} minutes
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text fontWeight="bold" style={styles.title}>
          Ambient humidity sensor
        </Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#9BAB51"
            style={{ marginBottom: 30 }}
          />
        ) : (
          <>
            <Text style={styles.bmeData}>
              Temperature:{" "}
              {bmeData.temperature !== null
                ? `${bmeData.temperature}°C`
                : "Pending..."}
            </Text>
            <Text style={styles.bmeData}>
              Humidity:{" "}
              {bmeData.humidity !== null
                ? `${bmeData.humidity}% RH`
                : "Pending..."}
            </Text>
            <Text style={styles.bmeData}>
              Pressure:{" "}
              {bmeData.pressure !== null
                ? `${bmeData.pressure} Pa`
                : "Pending..."}
            </Text>
          </>
        )}
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
    marginTop: 10,
    color: themeColor.white,
  },
  title2: {
    fontSize: 16,
    marginBottom: 13,
    marginTop: 10,
    color: themeColor.white,
  },
  moisture: {
    fontSize: 20,
    marginBottom: 10,

    color: themeColor.white,
  },
  bmeData: {
    fontSize: 18,
    marginBottom: 10,
    color: themeColor.white,
  },
  frequencyText: {
    fontSize: 12,
    color: themeColor.white,
    marginBottom: 10,
    marginTop: 6,
  },
});
