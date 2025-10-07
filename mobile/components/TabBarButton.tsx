import React, { useEffect } from "react";
import { StyleSheet, Pressable, useColorScheme } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import icons from "@/constants/icons";
import { Colors } from "@/constants/colors";

type IconKey = "index" | "scannerPage" | "editPage" | "accountPage";

function toIconKey(value: string): IconKey | undefined {
  if (
    value === "index" ||
    value === "scannerPage" ||
    value === "editPage" ||
    value === "accountPage"
  ) {
    return value as IconKey;
  }
  return undefined;
}

function TabBarButton({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label
}: {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  label: string;
}) {
  const scale = useSharedValue(0);
  const colorScheme = useColorScheme();

  const activeColor = colorScheme === "dark" ? Colors.dark.text : Colors.light.text;
  const inactiveColor =
    colorScheme === "dark" ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault;

  useEffect(() => {
    scale.value = withSpring(typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused, {
      duration: 350
    });
  }, [scale, isFocused]);

  const iconKey = toIconKey(routeName);

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      opacity
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.5]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [
        {
          scale: scaleValue
        }
      ],
      top
    };
  });

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={style.tabBarItem}>
      <Animated.View style={animatedIconStyle}>
        {iconKey ? icons[iconKey]({ color: isFocused ? activeColor : inactiveColor }) : null}
      </Animated.View>

      <Animated.Text
        style={[{ color: isFocused ? activeColor : inactiveColor }, animatedTextStyle]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const style = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5
  }
});

export default TabBarButton;
