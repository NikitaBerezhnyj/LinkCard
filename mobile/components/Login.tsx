import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView, Alert, TouchableOpacity } from "react-native";
import { loginUser } from "@/api/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { useAppStyles } from "@/constants/style";

interface LoginProps {
  onToggle: () => void;
  onAuthenticate: (isAuthenticated: boolean) => void;
}

function Login({ onToggle, onAuthenticate }: LoginProps) {
  const stdStyles = useAppStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "* Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "* Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "* Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "* Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const userData = { email, password };
        const res = await loginUser(userData);
        await AsyncStorage.setItem("jwtToken", res.token ?? "");
        onAuthenticate(true);
      } catch (error: any) {
        if (error.response) {
          setErrorMessage(error.response.data.message);
          Alert.alert("Error", error.response.data.message);
        } else {
          Alert.alert("Error", "Login failed. Please try again.");
        }
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        stdStyles.container,
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: 1000
        }
      ]}
    >
      <View style={stdStyles.profile}>
        <Text style={stdStyles.header}>Login</Text>
        <Text style={stdStyles.text}>
          Don't have an account?{" "}
          <Text
            style={
              (stdStyles.buttonText,
              {
                color: stdStyles.linkButton.color,
                textDecorationLine: "underline"
              })
            }
            onPress={onToggle}
          >
            Register
          </Text>
        </Text>

        <Text style={stdStyles.label}>Email</Text>
        {errors.email && <Text style={stdStyles.error}>{errors.email}</Text>}
        <TextInput
          style={stdStyles.input}
          placeholder="Enter your email"
          placeholderTextColor={stdStyles.input_placeholderTextColor.color}
          value={email}
          onChangeText={text => {
            setEmail(text);
            setErrors(prev => ({ ...prev, email: "" }));
          }}
        />

        <Text style={stdStyles.label}>Password</Text>
        {errors.password && <Text style={stdStyles.error}>{errors.password}</Text>}
        <View
          style={[
            stdStyles.input,
            {
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
              marginBottom: 16
            }
          ]}
        >
          <TextInput
            style={{
              flex: 1,
              height: "100%",
              paddingRight: 40,
              color: stdStyles.input.color
            }}
            placeholder="Enter your password"
            placeholderTextColor={stdStyles.input_placeholderTextColor.color}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={text => {
              setPassword(text);
              setErrors(prev => ({ ...prev, password: "" }));
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 10,
              height: "100%",
              justifyContent: "center"
            }}
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={24}
              style={stdStyles.icon}
            />
          </TouchableOpacity>
        </View>

        {errorMessage && <Text style={stdStyles.error}>{errorMessage}</Text>}

        <TouchableOpacity style={stdStyles.buttonPrimary} onPress={handleLogin}>
          <Text style={stdStyles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Login;
