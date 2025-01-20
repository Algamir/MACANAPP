import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Text, Button } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import { Layout, TopNav, useTheme, themeColor } from "react-native-rapi-ui";
import * as Notifications from "expo-notifications";

export default function PlantList() {
  const route = useRoute(); // Utilise `useRoute` pour obtenir les paramètres passés à cette tab
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);
  const { isDarkmode, setTheme } = useTheme();
  const [moisture, setMoisture] = useState<number | null>(null);

  const ESP32_URL = "http://172.20.10.2/soil"; // Remplace par l'adresse IP de ton ESP32

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

  // Fonction pour charger les plantes depuis la base de données
  const fetchPlants = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");

      const { data, error } = await supabase
        .from("plants")
        .select("id, name, nickname, room, image_url")
        .eq("user_id", user.id);

      if (error) throw error;

      setPlants(data || []);
    } catch (error) {
      console.error("Error fetching plants:", error.message);
      alert("Failed to fetch plants.");
    } finally {
      setLoading(false);
    }
  };

  // Utilisation de useFocusEffect pour recharger les plantes chaque fois que l'écran devient actif
  useFocusEffect(
    React.useCallback(() => {
      fetchPlants(); // Recharge les plantes chaque fois que tu reviens sur cette page
    }, [])
  );

  const confirmDelete = (plantId: number) => {
    setSelectedPlant(plantId); // Stocke l'ID de la plante à supprimer
    setShowModal(true); // Affiche le modal
  };

  const deletePlant = async () => {
    if (selectedPlant === null) return;

    try {
      const { data, error } = await supabase
        .from("plants")
        .delete()
        .eq("id", selectedPlant);

      if (error) {
        console.error("Error deleting plant:", error.message);
        alert("Erreur lors de la suppression de la plante.");
      } else {
        console.log("Plant deleted successfully:", data);
        setPlants((prevPlants) =>
          prevPlants.filter((plant) => plant.id !== selectedPlant)
        );
      }
    } catch (error) {
      console.error("Unexpected error deleting plant:", error.message);
      alert("Une erreur inattendue s'est produite.");
    } finally {
      setShowModal(false); // Ferme le modal
      setSelectedPlant(null); // Réinitialise l'ID
    }
  };

  return (
    <Layout
      style={{
        backgroundColor: isDarkmode ? themeColor.dark : themeColor.secondary,
      }}
    >
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "Center",
            marginBottom: 7,
          }}
        >
          My garden
        </Text>
        <Text
          fontWeight="bold"
          style={{ textAlign: "center", marginBottom: 17 }}
        >
          Monitor all your plants at a glance
        </Text>
        <View style={styles.containerDark}>
          <ScrollView>
            {loading ? (
              <Text style={styles.textload}>Loading plants...</Text>
            ) : plants.length > 0 ? (
              plants.map((plant) => (
                <View key={plant.id} style={styles.card}>
                  <Image
                    source={{ uri: plant.image_url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.info}>
                    <Text style={styles.title}>
                      {plant.nickname || plant.name}
                    </Text>
                    <Text style={styles.subtitle}>Room: {plant.room}</Text>

                    <Text style={styles.subtitle}>Soil moisture sensor:</Text>
                    {loading ? (
                      <ActivityIndicator
                        size="large"
                        color="#9BAB51"
                        style={{
                          marginBottom: 10,
                        }}
                      />
                    ) : (
                      <Text style={styles.subtitle}>
                        {moisture !== null && moisture > 1000
                          ? "Too wet ! 🌧️"
                          : moisture !== null && moisture < 500
                          ? "Too dry ! 🌵"
                          : "Perfect Humidity ! 🌱"}
                      </Text>
                    )}
                    <Text style={styles.subtitle}>
                      Raw value: {moisture !== null ? moisture : "Pending..."}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => confirmDelete(plant.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.textload}>No plants found!</Text>
            )}
          </ScrollView>
        </View>
        {/* Modal pour la confirmation */}
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowModal(false)} // Fermer si on clique en dehors
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Êtes-vous sûr de vouloir supprimer cette plante ?
              </Text>
              <View style={styles.modalActions}>
                <Button
                  text="Annuler"
                  onPress={() => setShowModal(false)}
                  style={{ marginRight: 10 }}
                />
                <Button
                  text="Supprimer"
                  onPress={deletePlant}
                  status="danger"
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  containerDark: {
    flex: 1,
    backgroundColor: "#265121", // dark green
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  textload: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    padding: 10,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "red",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  moisture: {
    fontSize: 15,
    marginBottom: 10,
    color: themeColor.white,
  },
});
