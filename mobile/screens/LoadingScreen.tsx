import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { useAppStyles } from "@/constants/style";

const LoadingScreen = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const stdStyles = useAppStyles();

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 750,
          useNativeDriver: true
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true
        })
      ]).start(() => pulse());
    };

    pulse();
  }, [scale]);

  return (
    <View
      style={
        (stdStyles.container,
        {
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: stdStyles.container.backgroundColor
        })
      }
    >
      <Animated.Image
        style={{ width: 100, height: 100, transform: [{ scale }] }}
        source={require("@/assets/images/icon.png")}
      />
    </View>
  );
};

export default LoadingScreen;
