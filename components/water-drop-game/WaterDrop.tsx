import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

interface WaterDropProps {
  x: number;
  onCatch: () => void;
  onMiss: () => void;
  speed?: number;
}

export function WaterDrop({ x, onCatch, onMiss, speed = 3000 }: WaterDropProps) {
  const dropY = useRef(new Animated.Value(-50)).current;
  const dropX = useRef(new Animated.Value(x)).current;

  useEffect(() => {
    // Start falling animation
    Animated.timing(dropY, {
      toValue: screenHeight + 50,
      duration: speed,
      useNativeDriver: true,
    }).start(() => {
      onMiss(); // Drop reached bottom without being caught
    });
  }, [speed, onMiss]);

  const handleCatch = () => {
    // Stop animation and trigger catch
    dropY.stopAnimation();
    onCatch();
  };

  return (
    <Animated.View
      style={[
        styles.dropContainer,
        {
          transform: [
            { translateY: dropY },
            { translateX: dropX }
          ]
        }
      ]}
    >
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8', '#1E40AF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.waterDrop}
      >
        <View style={styles.dropInner} />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dropContainer: {
    position: 'absolute',
    width: 20,
    height: 30,
  },
  waterDrop: {
    width: 20,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
    elevation: 4,
  },
  dropInner: {
    width: 8,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
});
