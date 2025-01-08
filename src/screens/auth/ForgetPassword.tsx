import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
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
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";

export default function ({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, "ForgetPassword">) {
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function forget() {
    if (!email) {
      console.log("Error", "Please enter your email.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      console.log("Error", "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Envoi de l'email de réinitialisation
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error("Error sending reset email:", error.message);
        console.log("Error", "Error sending reset email: " + error.message);
      } else {
        console.log("Reset email sent:", data);
        console.log("Success", "Check your email to reset your password!");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      console.log(
        "Error",
        "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
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
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 20,
            }}
          ></View>

          <View
            style={{
              alignItems: "center",
              marginTop: Platform.OS === "web" ? 0 : -30,
            }}
          >
            {Platform.OS === "web" ? (
              <Image
                resizeMode="contain"
                alt="Logo"
                size="none"
                className="aspect-[320/208] w-full max-w-[320px]"
                source={require("../../../assets/images/MacanaLogoNobg.svg")}
              />
            ) : (
              <Image
                resizeMode="contain"
                alt="Logo"
                size="none"
                className="aspect-[320/208] w-full max-w-[130px]"
                source={require("../../../assets/images/MacanaLogo.png")}
              />
            )}
          </View>

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
                  Forget Password
                </Heading>
                <VStack space="xs">
                  <Text className="text-typography-500">Email</Text>
                  <Input className="bg-secondary-0 rounded-lg border-secondary-0">
                    <InputField
                      type="text"
                      placeholder="Enter your email"
                      className="placeholder:text-primary-0"
                      value={email}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      onChangeText={(text) => setEmail(text)}
                    />
                  </Input>
                </VStack>
              </VStack>
              <Button
                text={loading ? "Loading" : "Send email"}
                onPress={forget}
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
