import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import Signup from './frontend/Signup'; // Start with Signup, you can switch to Login for testing

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Signup />
      </View>
    </SafeAreaProvider>
  );
}
