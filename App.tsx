import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import React from "react";
import { ThemeProvider } from "react-native-rapi-ui";
import Navigation from "./src/navigation";
import { AuthProvider } from "./src/provider/AuthProvider";

export default function App() {
  const images = [
    require("./assets/images/login.png"),
    require("./assets/images/register.png"),
    require("./assets/images/forget.png"),
  ];
  return (
    <GluestackUIProvider mode="light"><ThemeProvider images={images}>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
        <StatusBar />
      </ThemeProvider></GluestackUIProvider>
  );
}
