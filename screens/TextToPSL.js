import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const { height } = Dimensions.get('window');

const TextToPSL = () => {
  const [inputText, setInputText] = useState('');
  const [pslOutput, setPslOutput] = useState([]);

  const handleConvert = async () => {
    if (!inputText.trim()) return;
    try {
      const response = await axios.post('http://192.168.101.20:8006/text-to-psl', { text: inputText });
      setPslOutput(response.data.translation || []);
    } catch (err) {
      console.error('API Error:', err.message);
    }
  };

  return (
    <LinearGradient colors={['#4B6CB7', '#FFFFFF']} style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
                <Text style={styles.subtitle}>Enter text and see it converted into PSL signs</Text>

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder="Type your text here..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
          />
        </View>

        {/* Convert Button */}
        <TouchableOpacity style={styles.button} onPress={handleConvert}>
          <Text style={styles.buttonText}>Convert</Text>
        </TouchableOpacity>

        {/* Output Display */}
        <Text style={styles.outputTitle}>🔡 PSL Translation</Text>
        <ScrollView horizontal contentContainerStyle={styles.outputContainer}>
          {pslOutput.length > 0 ? (
            pslOutput.map((item, index) => (
              <View key={index} style={styles.pslItem}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.pslImage} />
                ) : null}
                <Text style={styles.pslLetter}>{item.letter}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>Your translated PSL signs will appear here</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: height * 0.05, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  subtitle: { fontSize: height * 0.02, color: '#555', marginBottom: 20, textAlign: 'center' },
  inputContainer: { width: '100%', marginBottom: 15 },
  input: { 
    width: '100%', 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    backgroundColor: '#fff' 
  },
  button: { 
    width: '100%', 
    backgroundColor: '#4B6CB7', 
    paddingVertical: 15, 
    borderRadius: 25, 
    marginTop: 10, 
    alignItems: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  outputTitle: { fontSize: height * 0.025, fontWeight: 'bold', color: '#000', marginTop: 25, marginBottom: 10 },
  outputContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  pslItem: { alignItems: 'center', marginHorizontal: 10 },
  pslImage: { width: 80, height: 80, borderRadius: 10, borderWidth: 1, borderColor: '#ccc' },
  pslLetter: { marginTop: 5, fontWeight: 'bold', fontSize: 16, color: '#333' },
  placeholderText: { fontSize: 14, color: '#777', marginTop: 10 },
});

export default TextToPSL;
