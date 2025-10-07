import { StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "./colors";

export const useAppStyles = () => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return StyleSheet.create({
    container: {
      flex: 1,
      color: themeColors.text,
      backgroundColor: themeColors.background,
      padding: 0
    },
    header: {
      textAlign: "center",
      color: themeColors.text,
      fontSize: 24,
      marginBottom: 16
    },
    tabBar: {},
    text: {
      color: themeColors.text,
      fontSize: 16,
      marginBottom: 8
    },
    linkButton: {
      color: themeColors.active
    },
    error: {
      color: themeColors.danger,
      fontSize: 16
    },
    buttonPrimary: {
      backgroundColor: themeColors.active,
      padding: 10,
      borderRadius: 5,
      marginBottom: 8
    },
    buttonText: {
      color: themeColors.buttonText,
      textAlign: "center",
      fontSize: 16
    },
    input: {
      backgroundColor: themeColors.formBackground,
      borderColor: themeColors.formBorder,
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      color: themeColors.text,
      marginBottom: 16,
      width: 250
    },
    input_placeholderTextColor: {
      color: themeColors.disabled
    },
    label: {
      color: themeColors.text,
      fontSize: 16
    },
    icon: {
      color: themeColors.icon
    },
    tabIcon: {
      color: themeColors.tabIconDefault
    },
    tabIconSelected: {
      color: themeColors.tabIconSelected
    },
    post: {
      backgroundColor: themeColors.postBackground,
      borderColor: themeColors.postBorder,
      borderWidth: 1,
      borderRadius: 10,
      padding: 16,
      marginVertical: 10
    },
    profile: {
      backgroundColor: themeColors.profileBackground,
      borderColor: themeColors.profileBorder,
      borderWidth: 1,
      padding: 16,
      borderRadius: 10
    },
    sidebar: {
      backgroundColor: themeColors.sidebarBackground,
      flex: 1
    }
  });
};
