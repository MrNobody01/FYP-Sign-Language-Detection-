import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyBhQF0hVqTBuPfj9zJGkXL_EjzJX59pYv0'; // ✅ Your API Key

export default function VoiceToText() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('Press the mic and start speaking...');
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      console.log('Starting recording..');
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await rec.startAsync();

      setRecording(rec);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stored at', uri);

    transcribeAudio(uri);
    setRecording(null);
  };

  const transcribeAudio = async (uri) => {
    try {
      setLoading(true);

      // Convert audio file to Base64
      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Send request to Google Speech API
      const response = await axios.post(
        `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
        {
          config: {
            encoding: 'LINEAR16', // Match Google API requirement
            languageCode: 'en-US',
            sampleRateHertz: 16000,
          },
          audio: { content: fileBase64 },
        }
      );

      const transcript =
        response.data.results?.map((res) => res.alternatives[0].transcript).join(' ') ||
        'No speech detected';
      setRecognizedText(transcript);
    } catch (error) {
      console.error('Speech-to-text error:', error.response?.data || error.message);
      setRecognizedText('Error recognizing speech.');
    } finally {
      setLoading(false);
    }
  };

  const handleMicPress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice to Text (Google API)</Text>
      <TextInput
        style={styles.textBox}
        value={recognizedText}
        editable={false}
        multiline
      />
      {loading && <ActivityIndicator size="large" color="#4A90E2" />}
      <TouchableOpacity
        style={[styles.micButton, isRecording && { backgroundColor: '#E53935' }]}
        onPress={handleMicPress}
      >
        <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎤'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4ff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  textBox: {
    width: '90%',
    minHeight: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 20,
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  micButton: {
    width: 80,
    height: 80,
    backgroundColor: '#4A90E2',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: { fontSize: 30, color: '#fff' },
});
