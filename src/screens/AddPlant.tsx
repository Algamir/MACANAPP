import React, { useState } from "react";
import {
  View,
  Text,
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
import { Layout, TopNav, useTheme, themeColor } from "react-native-rapi-ui";
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
import { v4 as uuidv4 } from "uuid";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const [plantName, setPlantName] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [plantImage, setPlantImage] = useState<string | null>(null);
  const [plantImages, setPlantImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      console.log("re");
      setSelectedImage(result.assets[0].uri);
      await uploadImage(result.assets[0]);
    }
  };
  const uploadImage = async (image) => {
    try {
      console.log("dans l'upload");
      const response = await fetch(image.uri);
      const blob = await response.blob();

      // Nom du fichier dans le stockage
      const fileName = `${uuidv4()}.jpeg`;

      const { data, error } = await supabase.storage
        .from("plant-images") // Le bucket Supabase
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: true, // Écrase le fichier s'il existe
        });

      if (error) {
        throw error;
      }

      const publicUrl = `https://ljncfqddlttfgctpnbgw.supabase.co/storage/v1/object/public/plant-images/${encodeURIComponent(
        fileName
      )}`;
      Alert.alert("Upload réussi", `Image accessible à :\n${publicUrl}`);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  // const uploadImageToSupabase = async (imageUri: string) => {
  //   const response = await fetch(image.uri);
  //     const blob = await response.blob();

  //     // Nom du fichier dans le stockage
  //     const fileName = `test plant.jpeg`;

  //     const { data, error } = await supabase.storage
  //       .from('plant-images') // Le bucket Supabase
  //       .upload(fileName, blob, {
  //         contentType: 'image/jpeg',
  //         upsert: true, // Écrase le fichier s'il existe
  //       });

  //     if (error) {
  //       throw error;
  //     }

  //     const publicUrl = `https://ljncfqddlttfgctpnbgw.supabase.co/storage/v1/object/public/plant-images/${encodeURIComponent(fileName)}`;
  //     Alert.alert('Upload réussi', `Image accessible à :\n${publicUrl}`);
  //   } catch (error) {
  //     Alert.alert('Erreur', error.message);
  //   }
  // // };

  // const pickImage = async () => {
  //   try {
  //     // Demander les permissions pour accéder à la galerie
  //     const permissionResult =
  //       await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (permissionResult.granted === false) {
  //       alert("Permission d'accès à la galerie refusée !");
  //       return;
  //     }

  //     // Ouvrir le picker pour choisir une image
  //     const pickerResult = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images, // Mise à jour du paramètre déprécié
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });

  //     if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
  //       // Si l'utilisateur a choisi une image, uploader l'image
  //       const imageUri = pickerResult.assets[0].uri;
  //       const imageUrl = await uploadImageToSupabase(imageUri);
  //       console.log("URL de l'image uploadée:", imageUrl);
  //     } else {
  //       alert("Aucune image sélectionnée.");
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Erreur lors de la sélection ou l'upload de l'image:",
  //       error
  //     );
  //   }
  // };

  // // Fonction pour uploader l'image dans Supabase

  // const handleSavePlant = (imageUrl: string) => {
  //   // Traite l'image téléchargée et effectue d'autres actions comme l'ajouter à une base de données ou autre
  //   console.log("Image enregistrée avec succès : ", imageUrl);
  //   // Code pour ajouter l'image à un formulaire, ou l'enregistrer dans ta base de données, etc.
  // };

  // // Fonction pour prendre une photo avec la caméra
  // const takePhoto = async () => {
  //   const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  //   if (!permissionResult.granted) {
  //     Alert.alert(
  //       "Permission Required",
  //       "We need permission to access your camera."
  //     );
  //     return;
  //   }

  //   const result = await ImagePicker.launchCameraAsync({
  //     mediaTypes: ["images", "videos"],
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled && result.assets[0].uri) {
  //     const uploadedImageUrl = await uploadImageToSupabase(
  //       result.assets[0].uri
  //     );
  //     if (uploadedImageUrl) {
  //       setPlantImages([...plantImages, uploadedImageUrl]);
  //     }
  //   }
  // };

  // // Fonction pour supprimer une image de la liste
  // const removeImage = (index: number) => {
  //   const updatedImages = plantImages.filter((_, i) => i !== index);
  //   setPlantImages(updatedImages);
  // };

  return (
    <Layout>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          marginTop: 30,
        }}
      >
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
                textAlign: "left",
                color: themeColor.dark,
              }}
            >
              Add a New Plant
            </Text>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            )}
            <Image
              source={{
                uri: "https://ljncfqddlttfgctpnbgw.supabase.co/storage/v1/object/public/plant-images/test%20plant.jpeg",
              }}
              style={{ width: 200, height: 200 }} // Adjust the size as needed
            />
            {/* Image Picker */}
            <VStack space="xs">
              <Text
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: themeColor.dark,
                  marginBottom: 8,
                  marginTop: 15,
                }}
              >
                Find Your plant with AI !
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
                  // onPress={takePhoto}
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
              <View>
                <Image source={{ uri: plantImage }} />
              </View>
              <View style={styles.imageContainer}>
                {plantImages.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      // onPress={() => removeImage(index)}
                    >
                      <Ionicons name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </VStack>
            {/* Plant Name */}
            <VStack space="xs">
              <FormControl isRequired>
                <FormControlLabel>
                  <FormControlLabelText>Plant Name</FormControlLabelText>
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
                  <FormControlLabelText>
                    Choose the room for your plant
                  </FormControlLabelText>
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
                  <FormControlLabelText>
                    Nickname (optional)
                  </FormControlLabelText>
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

            {/* Save Button */}
            <Button
              size="md"
              variant="solid"
              action="primary"
              className="bg-primary-0 rounded-lg border-primary-0"
              // onPress={handleSavePlant}
              // disabled={!plantName || !selectedRoom}
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
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 2,
  },
});
