import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  highScore: number;
  onRestart: () => void;
  onHome: () => void;
}

export function GameOverModal({ visible, score, highScore, onRestart, onHome }: GameOverModalProps) {
  const isNewHighScore = score > highScore;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={['#1F2937', '#111827']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.modal}
        >
          <View style={styles.content}>
            {isNewHighScore ? (
              <View style={styles.newHighScoreContainer}>
                <MaterialIcons name="emoji-events" size={48} color="#FCD34D" />
                <Text style={styles.newHighScoreText}>New High Score!</Text>
              </View>
            ) : (
              <View style={styles.gameOverContainer}>
                <MaterialIcons name="sports-esports" size={48} color="#8B5CF6" />
                <Text style={styles.gameOverText}>Game Over</Text>
              </View>
            )}
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Your Score</Text>
              <Text style={styles.scoreValue}>{score}</Text>
              
              <Text style={styles.highScoreLabel}>High Score</Text>
              <Text style={styles.highScoreValue}>{highScore}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={onRestart}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Play Again</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.homeButton}
                onPress={onHome}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <AntDesign name="home" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Home</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 20,
    margin: 20,
    maxWidth: 350,
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    elevation: 20,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  newHighScoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  newHighScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FCD34D',
    marginTop: 8,
  },
  gameOverContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginTop: 8,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  highScoreLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  highScoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FCD34D',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  restartButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  homeButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
