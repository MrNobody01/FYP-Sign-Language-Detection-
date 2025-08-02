import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function FYPIntro({ navigation }) {
  return (
    <LinearGradient colors={['#4B6CB7', '#FFFFFF']} style={styles.container}>
      {/* Infinity Logo */}
      <Image
        source={require('../assets/image (1).png')} // ✅ Check asset path
        style={styles.logo}
      />

      {/* Title */}
      <Text style={styles.title}>HumZuban</Text>

      {/* Slogan */}
      <Text style={styles.slogan}>Bridging Voices, Connecting Hands.</Text>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("Navigating to Login");
          navigation.navigate('Login');
        }}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    height: height * 0.18,
    resizeMode: 'contain',
    marginBottom: height * 0.02,
  },
  title: {
    fontWeight: 'bold',
    fontSize: height * 0.055,
    color: '#000',
    marginTop: height * 0.02,
  },
  slogan: {
    fontSize: height * 0.025,
    color: '#333',
    textAlign: 'center',
    marginVertical: height * 0.02,
    fontStyle: 'italic',
  },
  button: {
    marginTop: height * 0.05,
    backgroundColor: '#4B6CB7',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: height * 0.022,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
