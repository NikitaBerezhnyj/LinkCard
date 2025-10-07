import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        height: 60
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("index")}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>LinkCard</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("accountPage")}>
        {/* <Image
          source={require("@/assets/account-icon.png")}
          style={{ width: 30, height: 30 }}
        /> */}
        <Text>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
