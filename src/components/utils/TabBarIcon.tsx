import React from "react";
import { themeColor, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default ({ icon, focused }: { icon: any; focused: boolean }) => {
  const { isDarkmode } = useTheme();
  return (
    <Ionicons
      name={icon}
      style={{ marginBottom: -7 }}
      size={24}
      color={
        focused ? (isDarkmode ? themeColor.white100 : "#E9F59E") : "#84A100"
      }
    />
  );
};
