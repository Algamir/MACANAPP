import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Text, Button } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import { Layout, TopNav, useTheme, themeColor } from "react-native-rapi-ui";
export default function PlantList() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);
  const { isDarkmode, setTheme } = useTheme();
  useEffect(() => {
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

    fetchPlants();
  }, []);

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
              <Text>No plants found!</Text>
            )}
          </ScrollView>
        </View>
        {/* Modal pour la confirmation */}
        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
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
    fontSize: 25,
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
});
