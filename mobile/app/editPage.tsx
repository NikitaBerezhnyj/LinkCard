import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { useAppStyles } from "@/constants/style";

function editPage() {
  const stdStyles = useAppStyles();
  return (
    <SafeAreaView style={stdStyles.container}>
      <View>
        <Text style={stdStyles.text}>editPage</Text>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({});

export default editPage;
