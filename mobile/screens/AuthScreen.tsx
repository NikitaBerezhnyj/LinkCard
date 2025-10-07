import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Login from "@/components/Login";
import Register from "@/components/Register";

interface AuthScreenProps {
  onAuthenticate: (isAuthenticated: boolean) => void;
}

const AuthScreen = ({ onAuthenticate }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <View style={styles.container}>
      {isLogin ? (
        <Login onToggle={toggleForm} onAuthenticate={onAuthenticate} />
      ) : (
        <Register onToggle={toggleForm} onAuthenticate={onAuthenticate} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default AuthScreen;
