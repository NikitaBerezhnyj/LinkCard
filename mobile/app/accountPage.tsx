import React from "react";
import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStyles } from "@/constants/style";

function accountPage() {
  const stdStyles = useAppStyles();

  const signOut = async () => {
    await AsyncStorage.removeItem("jwtToken");
  };

  return (
    <SafeAreaView style={stdStyles.container}>
      {/* Розділ акаунту */}
      <View style={styles.section}>
        <Text style={stdStyles.text}>Account</Text>
        <Button title="Sign Out" onPress={signOut} />
      </View>

      {/* Роздільна лінія */}
      <View style={styles.divider} />

      {/* Розділ налаштувань */}
      <View style={styles.section}>
        <Text style={stdStyles.text}>Settings</Text>
        {/* Інші налаштування або елементи можуть бути додані тут */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 20,
    alignItems: "center"
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    alignSelf: "stretch",
    marginVertical: 10
  }
});

export default accountPage;
