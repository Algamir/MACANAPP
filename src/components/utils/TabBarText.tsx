import React from "react";
import { Text, themeColor, useTheme } from "react-native-rapi-ui";
export default ({ title, focused }: { title: string; focused: boolean }) => {
  const { isDarkmode } = useTheme();
  return (
    <Text
      fontWeight="bold"
      style={{
        marginBottom: 5,
        color: focused
          ? isDarkmode
            ? themeColor.white100
            : themeColor.primary
          : "#9BAB51",
        fontSize: 10,
      }}
    >
      {title}
    </Text>
  );
};
