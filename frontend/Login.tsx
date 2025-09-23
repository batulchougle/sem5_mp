import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import Signup from './Signup';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false); // toggle to signup

  if (showSignup) return <Signup />; // show signup page if toggled

  const handleLogin = () => {
  };

  return (
    <View style={styles.container}>
      {/* App Logo and Name */}
      <View style={styles.logoContainer}>
        <Image
          source={ require('./assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.appName}>CafeQueue</Text>
      </View>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowSignup(true)}>
        <Text style={styles.linkText}>Don't have an account? Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15 },
  button: { width: '100%', height: 50, backgroundColor: '#4CAF50', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#007BFF', marginTop: 10 },
  // Logo + App name
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 160,
    height: 160,
    borderRadius: 16,
    marginBottom: 10,
  },
  appName: {
    fontSize: 48, 
    fontWeight: '800',
    color: '#222',
    letterSpacing: 0.5,
    fontFamily: Platform.select({ ios: 'Snell Roundhand', android: 'cursive', default: undefined }),
    marginBottom: 4,
  },
});
