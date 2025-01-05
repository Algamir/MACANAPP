import React, { useEffect, useState } from "react";
import { View, Linking } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../initSupabase";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    // Récupérer la session à partir de Supabase
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); // Utilisation de getSession()
      if (session?.user?.email) {
        setEmail(session.user.email); // Si l'email est dans la session, le mettre à jour
      }
    };

    fetchSession(); // Appeler la fonction pour récupérer la session

    // Optionnel : écouter les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user?.email) {
          setEmail(session.user.email);
        }
      }
    );

    return () => {
      // Annuler la souscription lorsque le composant est démonté
      authListener.subscription.unsubscribe();
    };
  }, []); // Le useEffect se déclenche une seule fois au montage

  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {email ? (
          <Text>Bienvenue, {email} !</Text> // Affiche l'email si disponible
        ) : (
          <Text>Chargement de votre email...</Text> // Message de chargement en attendant l'email
        )}
        <Section style={{ marginTop: 20 }}>
          <SectionContent>
            <Text fontWeight="bold" style={{ textAlign: "center" }}>
              These UI components provided by Rapi UI
            </Text>
            <Button
              style={{ marginTop: 10 }}
              text="Rapi UI Documentation"
              status="info"
              onPress={() => Linking.openURL("https://rapi-ui.kikiding.space/")}
            />
            <Button
              text="Go to second screen"
              onPress={() => {
                navigation.navigate("SecondScreen");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              status="danger"
              text="Logout"
              onPress={async () => {
                const { error } = await supabase.auth.signOut();
                if (!error) {
                  alert("Signed out!");
                }
                if (error) {
                  alert(error.message);
                }
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
