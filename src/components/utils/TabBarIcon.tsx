import React from "react";
import { themeColor, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default ({
  icon,
  focused,
  size = 24, // Valeur par défaut, mais paramétrable
}: {
  icon: any;
  focused: boolean;
  size?: number;
}) => {
  const { isDarkmode } = useTheme();

  return (
    <Ionicons
      name={icon}
      size={size} // Assurez-vous que cette propriété est bien dynamique
      color={
        focused ? (isDarkmode ? themeColor.white100 : "#E9F59E") : "#84A100"
      }
      style={{
        marginBottom: 0,
        lineHeight: size, // Astuce pour forcer les styles si nécessaire
      }}
    />
  );
};
