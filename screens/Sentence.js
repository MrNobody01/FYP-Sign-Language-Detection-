import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Sentences() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Sentences Screen</Text>
      <Text style={styles.subtitle}>This is a placeholder for sentence detection.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4ff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#333', textAlign: 'center', paddingHorizontal: 20 },
});
