import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView, Alert, TouchableOpacity } from "react-native";
import { registerUser } from "@/api/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { useAppStyles } from "@/constants/style";

interface RegisterProps {
  onToggle: () => void;
  onAuthenticate: (isAuthenticated: boolean) => void;
}

function Register({ onToggle, onAuthenticate }: RegisterProps) {
  const stdStyles = useAppStyles();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) {
      newErrors.username = "* Username is required";
      isValid = false;
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "* Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "* Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const userData = { username, email, password };
        const res = await registerUser(userData);
        await AsyncStorage.setItem("jwtToken", res.token ?? "");
        onAuthenticate(true);
      } catch (error: any) {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          setErrorMessage(error.response.data.message);
          Alert.alert("Error", error.response.data.message);
        }
      }
    }
  };

  return (
    <SafeAreaView
      style={
        (stdStyles.container,
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: stdStyles.container.backgroundColor,
          width: 1000
        })
      }
    >
      <View style={stdStyles.profile}>
        <Text style={stdStyles.header}>Register</Text>
        <Text style={stdStyles.text}>
          Already have an account?{" "}
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
            Login
          </Text>
        </Text>

        <Text style={stdStyles.label}>Username</Text>
        {errors.username && <Text style={stdStyles.error}>{errors.username}</Text>}
        <TextInput
          style={stdStyles.input}
          placeholder="Enter your username"
          placeholderTextColor={stdStyles.input_placeholderTextColor.color}
          value={username}
          onChangeText={text => {
            setUsername(text);
            setErrors(prev => ({ ...prev, username: "" }));
          }}
        />

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
              marginBottom: 16,
              overflow: "hidden"
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

        <Text style={stdStyles.label}>Confirm Password</Text>
        {errors.confirmPassword && <Text style={stdStyles.error}>{errors.confirmPassword}</Text>}
        <View
          style={[
            stdStyles.input,
            {
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
              marginBottom: 16,
              overflow: "hidden"
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
            placeholder="Confirm your password"
            placeholderTextColor={stdStyles.input_placeholderTextColor.color}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              setErrors(prev => ({ ...prev, confirmPassword: "" }));
            }}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: "absolute",
              right: 10,
              height: "100%",
              justifyContent: "center"
            }}
          >
            <FontAwesome
              name={showConfirmPassword ? "eye-slash" : "eye"}
              size={24}
              style={stdStyles.icon}
            />
          </TouchableOpacity>
        </View>

        {errorMessage && <Text style={stdStyles.error}>{errorMessage}</Text>}

        <TouchableOpacity style={stdStyles.buttonPrimary} onPress={handleSubmit}>
          <Text style={stdStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Register;
