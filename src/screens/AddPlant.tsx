import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../types/navigation";
import {
  Layout,
  TopNav,
  useTheme,
  themeColor,
  Text,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectItem,
  SelectPortal,
  SelectContent,
} from "@/components/ui/select";
import { AddIcon, ChevronDownIcon } from "@/components/ui/icon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { supabase } from "../initSupabase";
import * as FileSystem from "expo-file-system";
import LottieView from "lottie-react-native"; // Import de Lottie
import Lottie from "lottie-react";

// import Lottie from "lottie-react";
export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const [plantName, setPlantName] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [plantImage, setPlantImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState<boolean>(false); // État de chargement pour l'animation
  const [showAnimation, setShowAnimation] = useState(true);

  // Choisir une image
  const pickImage = async (uri: string) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    const fileInfo = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64, // ou Binary si nécessaire
    });

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission refusée",
        "Vous devez autoriser l’accès à la galerie pour continuer."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("nouveau log");
      setSelectedImage(result.assets[0].uri); // On stocke l'image sélectionnée
      console.log(result.assets[0].uri);
    }
    setLoading(false); // Arrêter l'animation après l'ajout
  };

  //  Prendre PHOTO
  const takePhoto = async () => {
    try {
      // Demande de permission pour accéder à l'appareil photo
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access camera is required!");
        return;
      }

      // Ouvre l'appareil photo pour prendre une photo
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1, // Qualité de l'image entre 0 (faible) et 1 (haute)
      });

      if (!result.canceled) {
        const photoUri = result.assets[0].uri; // Chemin de l'image capturée
        setPlantImage(photoUri); // Mets à jour l'état avec l'URI de l'image
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
    setLoading(false); // Arrêter l'animation après l'ajout
  };

  //BOUTON SAVE
  const handleSavePlant = async () => {
    if (!plantName || !selectedRoom || !selectedImage) {
      Alert.alert(
        "Erreur",
        "Veuillez remplir tous les champs requis et choisir une image."
      );
      return;
    }
    try {
      setLoading(true); // Active le chargement
      const { data, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error("Erreur d'authentification :", authError.message);
        Alert.alert(
          "Erreur",
          "Impossible de récupérer l'utilisateur connecté."
        );

        return;
      }

      const user = data?.user; // Accéder à `user`

      if (!user) {
        Alert.alert("Erreur", "Utilisateur non connecté.");
        return;
      }

      const userId = user.id; // Maintenant `user.id` est accessible
      const generateUUID = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      };
      // Upload de l'image

      console.log("Uploading image...");
      const response = await fetch(selectedImage);
      console.log("Uapres le fetch...");

      const blob = await response.blob();
      console.log("Uapres le blob...");
      const fileName = generateUUID();
      console.log("Uapres le geneerateuid...");
      console.log(blob.type); // Exemple : "image/heic", "video/quicktime"

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("plant-images")
        .upload(fileName, blob, {
          contentType: blob.type,
          upsert: true,
        });

      console.log("Uapres le upload...");
      if (uploadError) {
        throw uploadError;
      }
      console.log(uploadError);

      // Génération de l'URL public
      const imageUrl = `https://ljncfqddlttfgctpnbgw.supabase.co/storage/v1/object/public/plant-images/${encodeURIComponent(
        fileName
      )}`;

      console.log("Image uploaded successfully:", imageUrl);

      // Enregistrement des données dans la table Supabase
      const { data: insertData, error: insertError } = await supabase
        .from("plants") // Remplace "plants" par le nom de ta table
        .insert([
          {
            name: plantName,
            nickname: nickname || null,
            room: selectedRoom,
            image_url: imageUrl || null,
            user_id: userId, // Inclure user_id
          },
        ]);
      console.log("Erreur de téléchargement :", uploadError);
      console.log("Erreur d'insertion :", insertError);
      console.log("Uploading image2...");
      if (insertError) {
        throw insertError;
      }

      Alert.alert("Succès", "Plante enregistrée avec succès !");
      setPlantName("");
      setNickname("");
      setSelectedRoom(null);
      setSelectedImage(null);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'enregistrement."
      );
    }
    // Fais disparaître l'animation après 3 secondes
    setTimeout(() => {
      setLoading(false);
    }, 3000); // 3000 ms = 3 secondes
  };

  // Fonction pour supprimer l'image
  const removeImage = () => {
    setSelectedImage(null); // On réinitialise l'état de l'image à null
  };
  return (
    <Layout
      style={{
        backgroundColor: isDarkmode ? themeColor.dark : themeColor.secondary,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          marginTop: 30,
        }}
      >
        {/* {loading && <View style={styles.overlay}> </View>} */}
        <View
          style={{
            alignSelf: "center",
            width: "100%",
            maxWidth: 400,
          }}
        >
          <VStack space="$4">
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Add a New Plant
            </Text>

            {/* Image Picker */}
            <VStack space="xs">
              <Text
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: 8,
                  marginTop: 15,
                }}
              >
                Choose or take a photo of your plant!*
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    padding: 10,
                    backgroundColor: "#d3d3d3",
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Ionicons name="image" size={20} style={{ marginRight: 5 }} />
                  <Text>Select from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={takePhoto}
                  style={{
                    padding: 10,
                    backgroundColor: "#d3d3d3",
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="camera"
                    size={20}
                    style={{ marginRight: 5 }}
                  />
                  <Text>Take Photo</Text>
                </TouchableOpacity>
              </View>
              {selectedImage && (
                <View style={styles.imageContainer}>
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.image}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={removeImage}
                    >
                      <Ionicons name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </VStack>

            {/* Plant Name */}
            <VStack space="xs">
              <FormControl isRequired>
                <FormControlLabel>
                  <Text>Plant Name</Text>
                  <FormControlLabelText></FormControlLabelText>
                </FormControlLabel>
                <Input className="bg-secondary-0 rounded-lg border-secondary-0">
                  <InputField
                    type="text"
                    placeholder="Plant Name"
                    value={plantName}
                    onChangeText={setPlantName}
                    className="placeholder:text-primary-0"
                    autoCapitalize="words"
                  />
                </Input>
                <FormControlHelper>
                  <FormControlHelperText>
                    This is the name of your plant (e.g., Ficus, Aloe Vera).
                  </FormControlHelperText>
                </FormControlHelper>
              </FormControl>
            </VStack>

            {/* Room Selection */}
            <VStack space="xs">
              <FormControl isRequired>
                <FormControlLabel>
                  <Text>Choose the room for your plant</Text>
                  <FormControlLabelText></FormControlLabelText>
                </FormControlLabel>
                <Select
                  onValueChange={setSelectedRoom}
                  selectedValue={selectedRoom}
                >
                  <SelectTrigger className="bg-secondary-0 rounded-lg border-secondary-0">
                    <SelectInput
                      placeholder="Select Room"
                      className="placeholder:text-primary-0"
                    />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      <SelectItem label="Balcony" value="Balcony" />
                      <SelectItem label="Bedroom" value="Bedroom" />
                      <SelectItem label="Kitchen" value="Kitchen" />
                      <SelectItem label="Living Room" value="Living Room" />
                      <SelectItem label="Office" value="Office" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
                <FormControlHelper>
                  <FormControlHelperText>
                    Please select the room where your plant will be placed.
                  </FormControlHelperText>
                </FormControlHelper>
              </FormControl>
            </VStack>

            {/* Nickname */}
            <VStack space="xs">
              <FormControl>
                <FormControlLabel>
                  <Text>Nickname (optional)</Text>
                  <FormControlLabelText></FormControlLabelText>
                </FormControlLabel>
                <Input className="bg-secondary-0 rounded-lg border-secondary-0">
                  <InputField
                    type="text"
                    placeholder="Nickname (e.g., Greenie)"
                    value={nickname}
                    onChangeText={setNickname}
                    className="placeholder:text-primary-0"
                    autoCapitalize="words"
                  />
                </Input>
                <FormControlHelper>
                  <FormControlHelperText>
                    This is the cute name of your plant (e.g., Bambouchou,
                    Basilou, Alocachou).
                  </FormControlHelperText>
                </FormControlHelper>
              </FormControl>
            </VStack>

            {/* Animation Lottie - Overlay */}
            {/* {loading && (
              <View>
                <Lottie
                  animationData={require("../../assets/animation/plant.json")} // Chemin vers l'animation Lottie
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            )} */}

            {/* Save Button */}
            <Button
              size="md"
              variant="solid"
              action="primary"
              className="bg-primary-0 rounded-lg border-primary-0"
              onPress={handleSavePlant}
              disabled={!plantName || !selectedRoom}
              style={{ marginTop: 20, marginBottom: 30 }}
            >
              <ButtonText className="text-white">Save Plant</ButtonText>
              <ButtonIcon as={AddIcon} className="ml-2" />
            </Button>
          </VStack>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  imageWrapper: {
    position: "relative",
    margin: 5,
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: "center",
  },
  lottie: {
    width: 100,
    height: 100,
    alignSelf: "center",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    // zIndex: 1, // S'assurer que l'overlay est au-dessus du formulaire
  },
  loadingText: {
    color: "#fff",
    marginTop: 120,
    fontSize: 16,
    textAlign: "center",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Fond semi-transparent
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2, // S'assurer que l'overlay est au-dessus du formulaire
  },
});
