import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import TabBar from "@/components/TabBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadScreen from "@/screens/LoadingScreen";
import AuthScreen from "@/screens/AuthScreen";
import Header from "@/components/Header";

function _layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    const delayLoading = async () => {
      await checkAuth();
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
    };

    delayLoading();
  }, []);

  const handleAuthentication = (isAuthenticated: boolean) => {
    setIsAuthenticated(isAuthenticated);
  };

  if (loading) {
    return <LoadScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 0, margin: 0 }}>
      <StatusBar backgroundColor="black" />
      {isAuthenticated ? (
        <Tabs tabBar={props => <TabBar {...props} />}>
          <Tabs.Screen
            name="scannerPage"
            options={{ title: "Scanner", header: () => <Header /> }}
          />
          <Tabs.Screen name="index" options={{ title: "QR Code", header: () => <Header /> }} />
          <Tabs.Screen name="editPage" options={{ title: "Edit", header: () => <Header /> }} />
          <Tabs.Screen
            name="accountPage"
            options={{ title: "Account", header: () => <Header /> }}
          />
        </Tabs>
      ) : (
        <AuthScreen onAuthenticate={handleAuthentication} />
      )}
    </SafeAreaView>
  );
}

export default _layout;
