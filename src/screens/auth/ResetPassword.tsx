import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image as RNImage,
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
}: NativeStackScreenProps<AuthStackParamList, "Register">) {
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleState = () =>
    setShowPassword((showState) => {
      return !showState;
    });

  async function register() {
    if (password !== confirmPassword) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    setLoading(true);
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (!error && !user) {
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
              marginTop: Platform.OS === "web" ? 0 : -30,
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
                size="none"
                className="aspect-[320/208] w-full max-w-[130px]"
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
                  Reset Password
                </Heading>

                <VStack space="xs">
                  <Text className="text-typography-500">New Password</Text>
                  <Input className="bg-secondary-0 rounded-lg border-secondary-0">
                    <InputField
                      className="placeholder:text-primary-0"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                    />
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
                </VStack>
                {/* Champ de confirmation du mot de passe */}
                <VStack space="xs">
                  <Text className="text-typography-500">
                    Confirm NewPassword
                  </Text>
                  <Input className="bg-secondary-0 rounded-lg border-secondary-0">
                    <InputField
                      className="placeholder:text-primary-0"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChangeText={(text) => setConfirmPassword(text)}
                    />
                  </Input>
                  {passwordError && (
                    <Text className="text-red-500">Passwords do not match</Text>
                  )}
                </VStack>
              </VStack>
              <Button
                text={loading ? "Loading" : "Reset Password"}
                onPress={resetpassword}
                style={{
                  marginTop: 20,
                }}
                disabled={loading}
              />
            </FormControl>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text size="md">Already have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login");
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
                  Login here
                </Text>
              </TouchableOpacity>
            </View>
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
                  }}
                >
                  {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
