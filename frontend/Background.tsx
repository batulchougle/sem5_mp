import React, { PropsWithChildren } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export default function Background({ children }: PropsWithChildren) {
  return (
    <ImageBackground
      source={require('./assets/doodles.png')}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.11, 
  },
});

/*
import Background from './Background';

export default function SomeScreen() {
  return (
    <Background>
      {/* your screen layout }
      </Background>
    );
  }*/