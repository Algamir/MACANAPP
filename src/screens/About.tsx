import React from "react";
import { View } from "react-native";
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
import { supabase } from "../initSupabase";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const testUploadToSupabase = async () => {
    try {
      // Exemple de contenu à uploader
      const fileContent = "Hello, this is a test file!";
      const file = new Blob([fileContent], { type: "text/plain" });
      // const file = new Blob([fileContent], { type: "text/plain" });
      const fileName = `testDuseigneur`;

      // Upload le fichier dans le bucket `plant-images`
      const { data, error } = await supabase.storage
        .from("plant-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false, // Empêche d'écraser des fichiers existants
        });

      if (error) {
        console.error("Erreur d'upload :", error.message);
        return;
      }

      console.log("Fichier uploadé avec succès :", data);
      const publicUrl = `https://ljncfqddlttfgctpnbgw.supabase.co/storage/v1/object/public/plant-images/${data.path}`;
      console.log("URL publique :", publicUrl);
    } catch (err) {
      console.error("Erreur inattendue :", err);
    }
  };

  testUploadToSupabase();
  return (
    <Layout>
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
        <Text>This is the About tab</Text>
      </View>
    </Layout>
  );
}
