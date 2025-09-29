import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface PlayerBucketProps {
  x: number;
  width: number;
  height: number;
}

export function PlayerBucket({ x, width, height }: PlayerBucketProps) {
  return (
    <Animated.View
      style={[
        styles.bucketContainer,
        {
          left: x,
          width,
          height,
        }
      ]}
    >
      <LinearGradient
        colors={['#F59E0B', '#D97706', '#B45309']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bucket}
      >
        <View style={styles.bucketInner}>
          <MaterialIcons name="water-drop" size={24} color="#3B82F6" />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bucketContainer: {
    position: 'absolute',
    bottom: 20,
  },
  bucket: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
    elevation: 6,
  },
  bucketInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    padding: 4,
  },
});
