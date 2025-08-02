import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');
const API_URL = "http://192.168.100.176:6000";

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      Alert.alert("Success", "Login successful");
      navigation.replace("UserSelection"); // Navigate to Camera after login
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Invalid login");
    }
  };

  return (
    <LinearGradient colors={['#4B6CB7', '#FFFFFF']} style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Redirect to Register */}
      <Text style={styles.registerText}>
        Not a user?{' '}
        <Text style={styles.registerLink} onPress={() => navigation.navigate("Register")}>
          Click to Register
        </Text>
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: height * 0.05, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  subtitle: { fontSize: height * 0.02, color: '#555', marginBottom: 20 },
  inputContainer: { width: '100%', marginBottom: 15, position: 'relative' },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#fff' },
  eyeButton: { position: 'absolute', right: 15, top: 12 },
  eyeText: { fontSize: 18 },
  loginButton: { width: '100%', backgroundColor: '#4B6CB7', paddingVertical: 15, borderRadius: 25, marginTop: 15, alignItems: 'center' },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  registerText: { marginTop: 15, fontSize: 14, color: '#444' },
  registerLink: { color: '#4B6CB7', fontWeight: 'bold' },
});
