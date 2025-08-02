import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function NormalPerson({ navigation }) {
  return (
    <LinearGradient colors={['#4B6CB7', '#FFFFFF']} style={styles.container}>
      <Text style={styles.title}>Normal Person</Text>
      <Text style={styles.subtitle}>Choose an option to proceed</Text>

      {/* Text to PSL Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('TextToPSL')}
      >
        <Text style={styles.buttonText}>📝 Text to PSL</Text>
      </TouchableOpacity>

      {/* Voice to Text Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('VoiceToText')}
      >
        <Text style={styles.buttonText}>🎤 Voice to Text</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 20 
  },
  title: { 
    fontSize: height * 0.05, 
    fontWeight: 'bold', 
    color: '#000', 
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: height * 0.02, 
    color: '#555', 
    marginBottom: 30 
  },
  button: { 
    width: '100%', 
    backgroundColor: '#4B6CB7', 
    paddingVertical: 15, 
    borderRadius: 25, 
    marginVertical: 10, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
