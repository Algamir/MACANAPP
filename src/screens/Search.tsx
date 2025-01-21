import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Camera } from "expo-camera";
import { Layout, TopNav, useTheme, themeColor } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default function PlantIdentifier({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [plantImage, setPlantImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [plantDetails, setPlantDetails] = useState<any>(null);
  const [careDetails, setCareDetails] = useState<any>(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const { isDarkmode, setTheme } = useTheme();
  const PLANTNET_API_KEY = "2b10NXoC2YxjcwgwW45hp75u";
  const TREFLE_API_KEY = "4WIrBi5NyTjlsumyT1VpAALTG_QSBGqcjlcDF-OZ268";

  // Fonction pour demander les permissions de la caméra
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === "granted");
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to your camera.");
    }
  };

  // Fonction pour prendre une photo avec la caméra
  const takePhoto = async () => {
    const permissionResult = await Camera.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "We need permission to use your camera."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPlantImage(result.assets[0].uri);
      identifyPlant(result.assets[0].uri);
    }
  };

  // Fonction pour choisir une image depuis la galerie
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "We need permission to access your photo library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPlantImage(result.assets[0].uri);
      identifyPlant(result.assets[0].uri);
    }
  };

  // Fonction pour identifier une plante via l'API PlantNet
  const identifyPlant = async (imageUri: string) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("images", {
      uri: imageUri,
      type: "image/jpeg",
      name: "plant.jpg",
    });
    formData.append("organs", "leaf"); // Peut être "flower", "fruit", etc.

    try {
      const response = await axios.post(
        `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = response.data;
      if (data.results && data.results.length > 0) {
        const plant = data.results[0];
        setPlantDetails({
          scientificName: plant.species.scientificNameWithoutAuthor,
          commonNames: plant.species.commonNames.join(", "),
          family: plant.species.family.scientificName,
        });
        // Alert.alert(
        //   "Plant Identified!",
        //   `Name: ${plant.species.scientificNameWithoutAuthor}\nFamily: ${plant.species.family.scientificName}`
        // );

        // Appeler Trefle API pour récupérer les informations d'entretien
        getPlantCareInfo(plant.species.scientificNameWithoutAuthor);
      } else {
        Alert.alert("No Results", "Could not identify the plant.");
      }
    } catch (error) {
      console.error("Error identifying plant:", error);
      Alert.alert("Error", "Failed to identify the plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les informations d'entretien via l'API Trefle
  const getPlantCareInfo = async (scientificName: string) => {
    try {
      // Nettoyage et encodage du nom scientifique
      const cleanScientificName = scientificName.trim();
      const encodedScientificName = encodeURIComponent(cleanScientificName);

      // Construire l'URL avec le bon paramètre
      const url = `https://trefle.io/api/v1/plants?token=${TREFLE_API_KEY}&filter%5Bscientific_name%5D=${encodedScientificName}`;
      console.log("Constructed URL:", url);

      // Requête vers l'API Trefle
      const searchResponse = await axios.get(url);
      console.log("Trefle API Search Response:", searchResponse.data);

      // Vérification si des données sont disponibles
      if (searchResponse.data.data && searchResponse.data.data.length > 0) {
        const plant = searchResponse.data.data[0]; // Première plante trouvée
        console.log("Plant data:", plant);

        // Préparer les données pour affichage
        const plantDetails = {
          name: plant.common_name || "Unknown",
          scientificName: plant.scientific_name,
          family: plant.family || "Unknown",
          imageUrl: plant.image_url || null,
          atmospheric_humidity:
            plant.atmospheric_humidity || "pas d'humididité spécifié",
          light: plant.light || "pas de lumière spécifié",
          year: plant.year || "Unknown",
          author: plant.author || "Unknown",
        };

        // Afficher un aperçu des informations
        Alert.alert(
          "Plant Trouvé",
          `Light: ${plantDetails.light}\nHumidity: ${plantDetails.atmospheric_humidity}\nCommon Name: ${plantDetails.name}\nScientific Name: ${plantDetails.scientificName}\nFamily: ${plantDetails.family}\nYear: ${plantDetails.year}\nAuthor: ${plantDetails.author}`
        );

        if (plantDetails.light) {
          <Text>La light: {plantDetails.imageUrl}</Text>;
        }
        // Si une image est disponible
        if (plantDetails.imageUrl) {
          console.log("Plant Image URL:", plantDetails.imageUrl);
        }
      } else {
        Alert.alert("No Data", `No data found for "${scientificName}".`);
      }
    } catch (error) {
      console.error(
        "Error fetching plant care info:",
        error.response ? error.response.data : error
      );
      Alert.alert("Error", "Failed to retrieve plant information.");
    }
  };

  return (
    <Layout
      style={{
        backgroundColor: isDarkmode ? themeColor.dark : themeColor.secondary,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Bouton pour choisir une image depuis la galerie */}
        <TouchableOpacity
          onPress={pickImage}
          style={{
            padding: 10,
            backgroundColor: "#A6A6A6",
            borderRadius: 8,
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold" }}>
            Select a Photo in your gallery
          </Text>
          <Ionicons name="image" size={25} />
        </TouchableOpacity>

        {/* Bouton pour prendre une photo avec la caméra */}
        <TouchableOpacity
          onPress={takePhoto}
          style={{
            padding: 10,
            backgroundColor: "#9BAB51",
            borderRadius: 8,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold" }}>
            Take a Photo with your camera
          </Text>
          <Ionicons name="camera" size={25} />
        </TouchableOpacity>

        {/* Affichage de l'image sélectionnée */}
        {plantImage && (
          <Image
            source={{ uri: plantImage }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        )}

        {/* Spinner de chargement */}
        {loading && <ActivityIndicator size="large" color="#265121" />}

        {/* Affichage des détails de la plante */}
        {plantDetails && (
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
                color: isDarkmode ? themeColor.white200 : themeColor.dark,
              }}
            >
              Scientific Name: {plantDetails.scientificName}
            </Text>

            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                textAlign: "left",
                color: isDarkmode ? themeColor.white200 : themeColor.dark,
              }}
            >
              🌿 Common Names:
            </Text>
            <Text
              style={{
                marginBottom: 10,
                color: isDarkmode ? themeColor.white200 : themeColor.dark,
              }}
            >
              {plantDetails.commonNames}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: isDarkmode ? themeColor.white200 : themeColor.dark,
              }}
            >
              🌿 Family:
            </Text>
            <Text
              style={{
                color: isDarkmode ? themeColor.white200 : themeColor.dark,
              }}
            >
              {plantDetails.family}
            </Text>
          </View>
        )}

        {/* Affichage des informations d'entretien */}
        {careDetails && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Water Needs: {careDetails.water}
            </Text>
            <Text>Humidity: {careDetails.humidity}</Text>
          </View>
        )}
      </View>
    </Layout>
  );
}
