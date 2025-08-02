import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { manipulateAsync, FlipType } from 'expo-image-manipulator';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [sign, setSign] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [debugInfo, setDebugInfo] = useState("");
  const [flipMode, setFlipMode] = useState(true); // Toggle for testing
  const cameraRef = useRef(null);
  const ws = useRef(null);
  const reconnectTimer = useRef(null);
  const captureInterval = useRef(null);

  // Request camera permissions
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // WebSocket connection with reconnection logic
  const connectWebSocket = () => {
    try {
      ws.current = new WebSocket("ws://192.168.100.176:8006/ws");

      ws.current.onopen = () => {
        console.log("WebSocket Connected");
        setConnectionStatus("Connected");
        setDebugInfo("Connected to server");
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = null;
        }
      };

      ws.current.onmessage = (event) => {
        const data = event.data;
        console.log("Received:", data);
        
        if (data !== "ping") {
          if (data.startsWith("ERROR:")) {
            setSign("Error");
            setDebugInfo(data);
          } else if (data === "" || data === "No hand detected") {
            setSign("");
            setDebugInfo("Looking for hands...");
          } else if (data === "Low confidence") {
            setSign("");
            setDebugInfo("Low confidence");
          } else if (data.endsWith("?")) {
            // Uncertain prediction
            setSign(data.slice(0, -1));
            setDebugInfo("Uncertain");
          } else if (data && data.trim() !== "") {
            // Clean prediction
            setSign(data.trim());
            setDebugInfo("Detected!");
          } else {
            setSign("");
            setDebugInfo("Processing...");
          }
        }
      };

      ws.current.onerror = (error) => {
        console.log("WebSocket Error:", error.message);
        setConnectionStatus("Error");
        setDebugInfo("Connection error");
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket Closed:", event.code, event.reason);
        setConnectionStatus("Disconnected");
        setSign("");
        setDebugInfo("Disconnected");
        
        if (!reconnectTimer.current) {
          reconnectTimer.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            setDebugInfo("Reconnecting...");
            connectWebSocket();
          }, 3000);
        }
      };
    } catch (error) {
      console.log("WebSocket connection failed:", error);
      setConnectionStatus("Failed");
      setDebugInfo("Connection failed");
    }
  };

  // Capture frame function with flip testing
  const captureFrame = async () => {
    if (cameraRef.current && ws.current && ws.current.readyState === WebSocket.OPEN) {
      try {
        console.log("Capturing frame...");
        const photo = await cameraRef.current.takePictureAsync({ 
          base64: false, 
          quality: 0.8,
          skipProcessing: false,
          exif: false,
        });
        
        if (photo.uri) {
          console.log(`Processing frame with flip: ${flipMode}`);
          
          // Create manipulation operations based on flip mode
          const operations = [];
          
          if (flipMode) {
            operations.push({ flip: FlipType.Horizontal });
          }
          
          // Always resize for consistency
          operations.push({ resize: { width: 640, height: 480 } });
          
          const manipulatedImage = await manipulateAsync(
            photo.uri,
            operations,
            { 
              compress: 0.8, 
              format: 'jpeg',
              base64: true
            }
          );
          
          if (manipulatedImage.base64) {
            console.log("Sending frame, size:", manipulatedImage.base64.length);
            ws.current.send("data:image/jpeg;base64," + manipulatedImage.base64);
            setDebugInfo(`Frame sent (Flip: ${flipMode ? 'ON' : 'OFF'})`);
          }
        }
      } catch (e) {
        console.log("Camera capture error:", e);
        setDebugInfo("Capture error: " + e.message);
      }
    } else {
      console.log("Cannot capture - camera or websocket not ready");
      setDebugInfo("Camera/WS not ready");
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
      if (captureInterval.current) {
        clearInterval(captureInterval.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Start/stop continuous capture based on connection status
  useEffect(() => {
    if (permission?.granted && connectionStatus === "Connected") {
      console.log("Starting continuous capture");
      captureInterval.current = setInterval(captureFrame, 2000);
      
      return () => {
        if (captureInterval.current) {
          clearInterval(captureInterval.current);
          console.log("Stopped continuous capture");
        }
      };
    }
  }, [permission?.granted, connectionStatus, flipMode]); // Added flipMode dependency

  const toggleFlip = () => {
    setFlipMode(!flipMode);
    setDebugInfo(`Flip mode: ${!flipMode ? 'ON' : 'OFF'}`);
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <Text style={styles.permissionSubText}>
          Camera permission is required for sign detection
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        ref={cameraRef}
        facing="front"
      />
      
      {/* Main detection overlay */}
      <View style={[
        styles.overlay,
        { backgroundColor: sign ? "rgba(0,150,0,0.8)" : "rgba(0,0,0,0.8)" }
      ]}>
        <Text style={styles.signText}>
          {connectionStatus !== "Connected" 
            ? "No Connection" 
            : sign || "Show your hand"
          }
        </Text>
      </View>

      {/* Flip toggle button */}
      <TouchableOpacity 
        style={styles.flipButton} 
        onPress={toggleFlip}
        activeOpacity={0.8}
      >
        <Text style={styles.flipButtonText}>
          Flip: {flipMode ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>

      {/* Status bar */}
      <View style={[
        styles.statusBar, 
        { backgroundColor: connectionStatus === "Connected" ? "rgba(0,150,0,0.8)" : "rgba(150,0,0,0.8)" }
      ]}>
        <Text style={styles.statusText}>
          Status: {connectionStatus}
        </Text>
      </View>

      {/* Debug info */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          Debug: {debugInfo}
        </Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          📋 Make sign "L" to test • Toggle flip if wrong direction
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'black'
  },
  camera: { 
    flex: 1 
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  permissionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  permissionSubText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  overlay: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    padding: 30,
    borderRadius: 20,
    minWidth: 250,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signText: {
    fontSize: 42,
    color: "white",
    fontWeight: "bold",
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  flipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  flipButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  statusBar: {
    position: "absolute",
    bottom: 180,
    alignSelf: "center",
    padding: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusText: {
    fontSize: 16,
    color: "white",
    textAlign: 'center',
    fontWeight: 'bold',
  },
  debugContainer: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 15,
  },
  debugText: {
    fontSize: 12,
    color: "white",
    textAlign: 'center',
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 15,
    maxWidth: '90%',
  },
  instructionsText: {
    fontSize: 14,
    color: "white",
    textAlign: 'center',
    fontStyle: 'italic',
  },
});