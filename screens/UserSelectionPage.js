import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function UserSelectionPage({ navigation }) {
  return (
    <LinearGradient
      colors={['#4B6CB7', '#AEC6E9']} // Gradient background
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>USER SELECTION PAGE</Text>
      </View>

      <Text style={styles.subtitle}>Select your Status:</Text>

      {/* Deaf Person Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('DeafPerson')}
      >
        <Text style={styles.cardText}>Deaf Person</Text>
        <Image source={require('../assets/deaf_icon.png')} style={styles.icon} />
      </TouchableOpacity>

      {/* Normal Person Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('NormalPerson')}
      >
        <Text style={styles.cardText}>Normal Person</Text>
        <Image source={require('../assets/mic_icon.png')} style={styles.icon} />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
