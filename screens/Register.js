import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const { height } = Dimensions.get('window');
const API_URL = "http://192.168.101.20:6000";

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      await axios.post(`${API_URL}/register`, { email, password });
      Alert.alert("Success", "Registration successful, please login");
      navigation.replace("Login"); // Go back to login after registering
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <LinearGradient colors={['#4B6CB7', '#FFFFFF']} style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" value={email} onChangeText={setEmail} keyboardType="email-address" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already a user?{' '}
        <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
          Login here
        </Text>
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: height * 0.05, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  subtitle: { fontSize: height * 0.02, color: '#555', marginBottom: 20 },
  inputContainer: { width: '100%', marginBottom: 15 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#fff' },
  registerButton: { width: '100%', backgroundColor: '#4B6CB7', paddingVertical: 15, borderRadius: 25, marginTop: 15, alignItems: 'center' },
  registerButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loginText: { marginTop: 15, fontSize: 14, color: '#444' },
  loginLink: { color: '#4B6CB7', fontWeight: 'bold' },
});
