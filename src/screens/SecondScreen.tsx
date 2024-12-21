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

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "SecondScreen">) {
  const { isDarkmode, setTheme } = useTheme();
  const [moisture, setMoisture] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const ESP32_URL = "http://192.168.1.37/soil"; // Remplace par l'adresse IP de ton ESP32

  useEffect(() => {
    const fetchMoistureData = async () => {
      try {
        const response = await fetch(ESP32_URL);
        const data = await response.json();
        setMoisture(data.moisture);
        setLoading(false);
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
            size={20}
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
          Capteur d'humidité du sol
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0078D7" />
        ) : (
          <Text fontWeight="bold" style={styles.moisture}>
            {moisture !== null && moisture > 1000
              ? "Trop humide ! 🌧️"
              : moisture !== null && moisture < 500
              ? "Trop sec ! 🌵"
              : "Humidité parfaite ! 🌱"}
          </Text>
        )}
        <Text
          style={{
            fontSize: 16,
            color: isDarkmode ? themeColor.white200 : themeColor.dark200, // Style inline ici
          }}
        >
          Valeur brute : {moisture !== null ? moisture : "En attente..."}
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: themeColor.primary,
  },
  moisture: {
    fontSize: 20,
    marginBottom: 10,
    color: themeColor.success,
  },
});
