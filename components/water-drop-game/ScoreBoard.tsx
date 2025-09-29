import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  level: number;
  lives: number;
}

export function ScoreBoard({ score, highScore, level, lives }: ScoreBoardProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.scoreCard}
      >
        <View style={styles.scoreRow}>
          <View style={styles.scoreItem}>
            <MaterialIcons name="emoji-events" size={20} color="#FCD34D" />
            <Text style={styles.scoreText}>{score}</Text>
          </View>
          
          <View style={styles.scoreItem}>
            <MaterialIcons name="star" size={20} color="#FCD34D" />
            <Text style={styles.scoreText}>{highScore}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialIcons name="trending-up" size={16} color="#A78BFA" />
            <Text style={styles.infoText}>Level {level}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <MaterialIcons name="favorite" size={16} color="#F87171" />
            <Text style={styles.infoText}>{lives}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  scoreCard: {
    borderRadius: 12,
    padding: 12,
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    elevation: 6,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#E5E7EB',
    fontWeight: '600',
  },
});
