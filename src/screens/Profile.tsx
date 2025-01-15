import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Layout, Text } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import { Grid, GridItem } from "@/components/ui/grid";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("User not logged in");
        }

        const { data, error } = await supabase
          .from("plants")
          .select("id, name, nickname, room, image_url")
          .eq("user_id", user.id); // Récupérer les plantes associées à l'utilisateur connecté

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

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <Text>Loading plants...</Text>
        ) : plants.length > 0 ? (
          plants.map((plant) => (
            <View key={plant.id} style={styles.card}>
              <Image
                source={{ uri: plant.image_url }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.info}>
                <Text style={styles.title}>{plant.nickname || plant.name}</Text>
                <Text style={styles.subtitle}>Room: {plant.room}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text>No plants found!</Text>
        )}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
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
});
