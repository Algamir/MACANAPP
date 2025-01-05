import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
  Platform,
} from "react-native";
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
          >
            <Text
              fontWeight="bold"
              size="h1"
              style={{
                color: themeColor.primary,
                marginBottom: 20,
              }}
            >
              LOGIN
            </Text>
          </View>

          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require("../../../assets/images/MacanaLogoNobg.svg")} // Ton logo
            />
          </View>

          {/* Formulaire */}
          <View
            style={{
              alignSelf: "center",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <FormControl className="p-4 border rounded-lg border-outline-300">
              <VStack space="xl">
                <Heading className="text-typography-900">Login</Heading>
                <VStack space="xs">
                  <Text className="text-typography-500">Email</Text>
                  <Input className="min-w-[250px]">
                    <InputField
                      type="text"
                      placeholder="Email address"
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
                  <Input className="text-center">
                    <InputField
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                    />
                    <InputSlot className="pr-3" onPress={handleState}>
                      <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                  </Input>
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ForgetPassword");
              }}
            >
              <Text
                size="md"
                fontWeight="bold"
                style={{ color: themeColor.primary }}
              >
                Forget password
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
