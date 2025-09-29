import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { WaterDropGame } from '../components/water-drop-game/WaterDropGame';
import { useResponsive } from '../hooks/use-responsive';

export default function WaterDropGameScreen() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <WaterDropGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});
