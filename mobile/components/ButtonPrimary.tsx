import React from "react";
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import { useAppStyles } from "@/constants/style";

interface ButtonPrimaryProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  backgroundColor?: string;
  textColor?: string;
  size?: number;
}

function ButtonPrimary({ onPress, title, backgroundColor, textColor, size }: ButtonPrimaryProps) {
  const stdStyles = useAppStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        stdStyles.buttonPrimary,
        backgroundColor ? { backgroundColor: backgroundColor } : {},
        size ? { width: size } : {}
      ]}
    >
      <Text style={[stdStyles.buttonText, textColor ? { color: textColor } : {}]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default ButtonPrimary;
