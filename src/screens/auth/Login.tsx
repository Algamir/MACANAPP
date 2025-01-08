import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image as RNImage, // Renommez l'import de React Native
  Platform,
} from "react-native";
import { Image } from "@/components/ui/image";
import { supabase } from "../../initSupabase";
import { AuthStackParamList } from "../../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FormControl } from "@/components/ui/form-control";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ButtonText } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";

export default function ({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, "Login">) {
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("12345");
  const [showPassword, setShowPassword] = React.useState(false);
  const handleState = () =>
    setShowPassword((showState) => {
      return !showState;
    });
  async function login() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (!error && !data) {
      setLoading(false);
      alert("Check your email for the login link!");
    }
    if (error) {
      setLoading(false);
      alert(error.message);
    }
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            backgroundColor: isDarkmode
              ? themeColor.dark
              : themeColor.secondary,
          }}
        >
          {/* Section supérieure */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 20,
            }}
          ></View>

          {/* Logo */}
          <View
            style={{
              alignItems: "center",
              marginTop: Platform.OS === "web" ? 0 : 20,
              marginBottom: Platform.OS === "web" ? 0 : 20,
            }}
          >
            {Platform.OS === "web" ? (
              // Affichage du SVG sur le web
              <Image
                resizeMode="contain"
                alt="Logo"
                size="none"
                className="aspect-[320/208] w-full max-w-[320px]"
                source={require("../../../assets/images/MacanaLogoNobg.svg")} // Ton logo
              />
            ) : (
              // Affichage du PNG sur mobile
              <Image
                resizeMode="contain"
                alt="Logo"
                style={{
                  width: Platform.OS === "web" ? 320 : 300, // Taille spécifique selon la plateforme
                  height: Platform.OS === "web" ? 208 : 100,
                }}
                source={require("../../../assets/images/MacanaLogo.png")} // Ton logo
              />
            )}
          </View>
          {/* Formulaire */}
          <View
            style={{
              alignSelf: "center",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <FormControl>
              <VStack space="xl">
                <Heading className="color-primary-0 text-typography-900 text-center uppercase">
                  Login
                </Heading>
                <VStack space="xs">
                  <Text className="text-typography-500">Email</Text>
                  <Input className="bg-secondary-0 rounded-lg border-secondary-0">
                    <InputField
                      type="text"
                      placeholder="Email address"
                      className="placeholder:text-primary-0"
                      value={email}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      onChangeText={(text) => setEmail(text)}
                    />
                  </Input>
                </VStack>
                <VStack space="xs">
                  <Text className="text-typography-500">Password</Text>
                  <Input className="bg-secondary-0 rounded-lg border-secondary-0">
                    <InputField
                      className="placeholder:text-primary-0"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                    />
                    {/* Sépare la gestion de l'icône pour éviter le focus */}
                    <TouchableOpacity
                      className="pr-3"
                      activeOpacity={0.8}
                      onPress={handleState}
                    >
                      <InputIcon
                        className="color-primary-0"
                        as={showPassword ? EyeIcon : EyeOffIcon}
                      />
                    </TouchableOpacity>
                  </Input>
                  <View
                    style={{
                      marginLeft: 4,
                      justifyContent: "left",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("ForgetPassword");
                      }}
                    >
                      <Text
                        size="sm"
                        fontWeight="bold"
                        style={{ color: themeColor.primary }}
                      >
                        Forget password
                      </Text>
                    </TouchableOpacity>
                  </View>
                </VStack>
              </VStack>
            </FormControl>
            <Button
              status="primary"
              text={loading ? "Loading" : "Continue"}
              onPress={login}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />
          </View>

          {/* Liens */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              justifyContent: "center",
            }}
          >
            <Text size="md">Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              <Text
                size="md"
                fontWeight="bold"
                style={{
                  marginLeft: 5,
                  color: themeColor.primary,
                }}
              >
                Register here
              </Text>
            </TouchableOpacity>
          </View>

          {/* Thème */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 30,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                isDarkmode ? setTheme("light") : setTheme("dark");
              }}
            >
              <Text
                size="md"
                fontWeight="bold"
                style={{
                  marginLeft: 5,
                  color: themeColor.primary,
                }}
              >
                {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
