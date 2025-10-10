import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../config/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_SIZE = 60;
const TOUCH_AREA_SIZE = 300;
const CATCH_ZONE_HEIGHT = 320; // Bottom zone where items can be caught
const HEADER_HEIGHT = 120; // Approximate header height

type ItemType = 'catchWaterDrop' | 'water_drop' | 'rock' | 'germwaterDrop';

interface FallingItem {
  id: string;
  type: ItemType;
  x: number;
  animatedY: Animated.Value;
  speed: number;
  isBroken?: boolean;
  currentY: number; // Track current Y position
}

interface GameState {
  score: number;
  level: number;
  highScore: number;
  isPlaying: boolean;
  isPaused: boolean;
  canResume: boolean;
}

const ITEM_CONFIGS = {
  catchWaterDrop: {
    source: require('../../assets/game/catchWaterDrop.png'),
    points: 10,
    spawnChance: 0.05,
  },
  water_drop: {
    source: require('../../assets/game/water_drop.png'),
    points: 5,
    spawnChance: 0.4,
  },
  rock: {
    source: require('../../assets/game/rock.png'),
    points: -5,
    spawnChance: 0.3,
  },
  germwaterDrop: {
    source: require('../../assets/game/germwaterDrop.png'),
    points: -10,
    spawnChance: 0.25,
  },
};

export default function CatchWaterDropsGame() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    highScore: 0,
    isPlaying: false,
    isPaused: false,
    canResume: false,
  });
  
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastLevelScore, setLastLevelScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const itemIdCounter = useRef(0);

  useEffect(() => {
    loadGameData();
    return () => {
      stopGame();
    };
  }, []);

  useEffect(() => {
    // When player reaches the threshold for the current level, show results
    const target = gameState.level * 100; // 100 points per level
    if (gameState.score >= target && !showResults && gameState.isPlaying) {
      setLastLevelScore(gameState.score);
      setShowResults(true);
      // Stop spawning while results are shown
      stopGame();
    }
  }, [gameState.score]);

  const loadGameData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const gameDocRef = doc(db, 'gameScores', `${userId}_catchWaterDrops`);
      const gameDoc = await getDoc(gameDocRef);

      if (gameDoc.exists()) {
        const data = gameDoc.data();
        setGameState(prev => ({
          ...prev,
          highScore: data.highScore || 0,
          canResume: data.canResume || false,
        }));

        if (data.canResume) {
          setShowResumeDialog(true);
        }
      }
    } catch (error) {
      console.error('Error loading game data:', error);
    }
  };

  const saveGameData = async (score: number, level: number, canResume: boolean, isHighScore = false) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const gameDocRef = doc(db, 'gameScores', `${userId}_catchWaterDrops`);
      const currentHighScore = isHighScore ? Math.max(score, gameState.highScore) : gameState.highScore;

      await setDoc(gameDocRef, {
        userId,
        gameName: 'Catch Water Drops',
        score,
        level,
        highScore: currentHighScore,
        canResume,
        savedScore: canResume ? score : 0,
        savedLevel: canResume ? level : 1,
        lastPlayed: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setGameState(prev => ({
        ...prev,
        highScore: currentHighScore,
      }));
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const resumeGame = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const gameDocRef = doc(db, 'gameScores', `${userId}_catchWaterDrops`);
      const gameDoc = await getDoc(gameDocRef);

      if (gameDoc.exists()) {
        const data = gameDoc.data();
        setGameState(prev => ({
          ...prev,
          score: data.savedScore || 0,
          level: data.savedLevel || 1,
          isPlaying: true,
          isPaused: false,
          canResume: false,
        }));
        setShowResumeDialog(false);
        startGame(data.savedScore || 0, data.savedLevel || 1);
      }
    } catch (error) {
      console.error('Error resuming game:', error);
    }
  };

  const restartGame = () => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      level: 1,
      isPlaying: true,
      isPaused: false,
      canResume: false,
    }));
    setShowResumeDialog(false);
    startGame(0, 1);
  };

  const startGame = (initialScore = 0, initialLevel = 1) => {
    setFallingItems([]);
    setGameState(prev => ({
      ...prev,
      score: initialScore,
      level: initialLevel,
      isPlaying: true,
      isPaused: false,
    }));
    startSpawning(initialLevel);
  };

  const stopGame = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
  };

  const pauseGame = async () => {
    setGameState(prev => ({ ...prev, isPaused: true }));
    stopGame();
    await saveGameData(gameState.score, gameState.level, true);
  };

  const continueGame = () => {
    setGameState(prev => ({ ...prev, isPaused: false }));
    startSpawning(gameState.level);
  };

  const endGame = async () => {
    stopGame();
    const isNewHighScore = gameState.score > gameState.highScore;
    await saveGameData(gameState.score, gameState.level, false, isNewHighScore);
    
    Alert.alert(
      'Game Over',
      `Final Score: ${gameState.score}\nLevel: ${gameState.level}\n${isNewHighScore ? 'New High Score! 🎉' : `High Score: ${gameState.highScore}`}`,
      [
        { text: 'Back to Dashboard', onPress: () => router.back() },
        { text: 'Play Again', onPress: () => restartGame() },
      ]
    );
  };

  const getRandomItemType = (): ItemType => {
    const random = Math.random();
    let cumulativeChance = 0;

    for (const [type, config] of Object.entries(ITEM_CONFIGS)) {
      cumulativeChance += config.spawnChance;
      if (random <= cumulativeChance) {
        return type as ItemType;
      }
    }
    return 'water_drop';
  };

  const spawnItem = (level: number) => {
    const itemType = getRandomItemType();
    const x = Math.random() * (SCREEN_WIDTH - ITEM_SIZE);
    
    const baseSpeed = 4000;
    const speedMultiplier = Math.max(0.6, 1 - (level - 1) * 0.04);
    const speed = baseSpeed * speedMultiplier;

    const animatedY = new Animated.Value(-ITEM_SIZE);
    
    const newItem: FallingItem = {
      id: `item_${itemIdCounter.current++}`,
      type: itemType,
      x,
      animatedY: animatedY,
      speed,
      isBroken: false,
      currentY: -ITEM_SIZE,
    };

    setFallingItems(prev => [...prev, newItem]);

    // Add listener to track Y position
    const listenerId = animatedY.addListener(({ value }) => {
      setFallingItems(prev => 
        prev.map(item => 
          item.id === newItem.id ? { ...item, currentY: value } : item
        )
      );
    });

    Animated.timing(animatedY, {
      toValue: SCREEN_HEIGHT,
      duration: speed,
      useNativeDriver: true,
    }).start(() => {
      animatedY.removeListener(listenerId);
      setFallingItems(prev => prev.filter(item => item.id !== newItem.id));
    });
  };

  const startSpawning = (level: number) => {
    stopGame();

    const baseSpawnInterval = 1000;
    const spawnMultiplier = Math.max(0.3, 1 - (level - 1) * 0.05);
    const spawnInterval = baseSpawnInterval * spawnMultiplier;

    const initialSpawnCount = Math.min(2 + Math.floor(level / 2), 5);
    for (let i = 0; i < initialSpawnCount; i++) {
      setTimeout(() => spawnItem(level), i * 300);
    }

    spawnIntervalRef.current = setInterval(() => {
      spawnItem(level);
    }, spawnInterval);
  };

  const handleItemPress = (item: FallingItem) => {
    // Don't allow touching already broken items
    if (item.isBroken) {
      return;
    }

    // Calculate the catch zone start position (from top of screen)
    const catchZoneStartY = SCREEN_HEIGHT - CATCH_ZONE_HEIGHT;
    
    // Check if item is in the catch zone
    if (item.currentY < catchZoneStartY) {
      // Item not in catch zone yet
      Alert.alert('Too Early', '⚠️ Wait for items to reach the blue catch zone!');
      return;
    }

    const points = ITEM_CONFIGS[item.type].points;
    const newScore = Math.max(0, gameState.score + points);
    
    // If it's a water drop (positive points), show broken animation
    if (points > 0) {
      setFallingItems(prev => 
        prev.map(i => i.id === item.id ? { ...i, isBroken: true } : i)
      );
      
      setTimeout(() => {
        setFallingItems(prev => prev.filter(i => i.id !== item.id));
      }, 200);
    } else {
      // For rocks and germs, remove immediately
      setFallingItems(prev => prev.filter(i => i.id !== item.id));
    }
    
    setGameState(prev => ({
      ...prev,
      score: newScore,
    }));

    // Check for game over
    if (newScore === 0 && gameState.score > 0 && points < 0) {
      endGame();
    }
  };

  const handleBackPress = () => {
    if (gameState.isPlaying && !gameState.isPaused) {
      Alert.alert(
        'Pause Game',
        'Do you want to pause and save your progress?',
        [
          { text: 'Continue Playing', style: 'cancel' },
          {
            text: 'Pause & Save',
            onPress: async () => {
              await pauseGame();
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleNextLevel = () => {
    // Move to next level (if any) and resume spawning
    setShowResults(false);
    setGameState(prev => ({ ...prev, level: Math.min(10, prev.level + 1), isPlaying: true, isPaused: false }));
    // Start spawning again at new level
    startSpawning(Math.min(10, gameState.level + 1));
  };

  const handleBackToHome = async () => {
    // Save and go back to dashboard
    await saveGameData(gameState.score, gameState.level, false);
    router.push('/student/dashboard');
  };

  if (showResults) {
    const score = lastLevelScore;
    return (
      <LinearGradient
        colors={['#a78bfa', '#c4b5fd', '#e9d5ff']}
        style={styles.container}
      >
        <StatusBar style="dark" />
        <View style={styles.resultsContainer}>
          <View style={styles.resultsCard}>
            <View style={styles.medalContainer}>
              <Text style={styles.medalEmoji}>🏅</Text>
            </View>
            
            <Text style={styles.resultsTitle}>Great!</Text>
            <Text style={styles.resultsSubtitle}>Level {gameState.level} Completed</Text>
            
            <View style={styles.scoreContainer}>
              <View style={styles.starContainer}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.scoreText}>{score}</Text>
                <Text style={styles.star}>⭐</Text>
              </View>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.retakeButton} 
                onPress={() => {
                  // Retake: restart level keeping same level
                  setShowResults(false);
                  startGame(0, gameState.level);
                }}
              >
                <Text style={styles.retakeButtonText}>🔄 Retake Level</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backButtonResult} onPress={handleBackToHome}>
                <LinearGradient
                  colors={['#a78bfa', '#c4b5fd']}
                  style={styles.backButtonGradient}
                >
                  <Text style={styles.backButtonText}>Home</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.nextButton} onPress={handleNextLevel}>
                <LinearGradient
                  colors={['#8b5cf6', '#a78bfa']}
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>Next Level ➜</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#a78bfa', '#c4b5fd', '#e9d5ff']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBackPress} >
          <Text style={styles.backIcon}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.statContainer}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{gameState.score}</Text>
          </View>
          
          <View style={styles.statContainer}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>{gameState.level}/10</Text>
          </View>
          
          <View style={styles.statContainer}>
            <Text style={styles.statLabel}>High Score</Text>
            <Text style={styles.statValue}>{gameState.highScore}</Text>
          </View>
        </View>

        {gameState.isPlaying && !gameState.isPaused && (
          <TouchableOpacity onPress={pauseGame} style={styles.pauseButton}>
            <Text style={styles.pauseIcon}>⏸</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      <LinearGradient
        colors={['#faf5ff', '#fce7f3']}
        style={styles.gameArea}
      >
        {!gameState.isPlaying ? (
          <View style={styles.startContainer}>
            <Text style={styles.gameTitle}>Catch Water Drops</Text>
            <Text style={styles.gameInstructions}>
              🌊 Catch clean water drops (+5 points){'\n'}
              💧 Catch special water drops (+10 points){'\n'}
              🪨 Avoid rocks (-5 points){'\n'}
              🦠 Avoid germ water (-10 points){'\n\n'}
              ⚠️ Catch items ONLY in the bottom blue zone!{'\n'}
              Reach 100 points to level up!
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => startGame()}
            >
              <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
          </View>
        ) : gameState.isPaused ? (
          <View style={styles.startContainer}>
            <Text style={styles.gameTitle}>Game Paused</Text>
            <Text style={styles.gameInstructions}>
              Score: {gameState.score}{'\n'}
              Level: {gameState.level}
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={continueGame}
            >
              <Text style={styles.startButtonText}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.startButton, styles.secondaryButton]}
              onPress={() => {
                endGame();
                router.back();
              }}
            >
              <Text style={[styles.startButtonText, styles.secondaryButtonText]}>
                End Game
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {fallingItems.map((item) => (
              <Animated.View
                key={item.id}
                style={[
                  styles.fallingItem,
                  {
                    left: item.x,
                    transform: [{ translateY: item.animatedY }],
                  },
                ]}
                pointerEvents="box-none"
              >
                <TouchableOpacity
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.7}
                  style={styles.touchArea}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                  <Image
                    source={
                      item.isBroken && (item.type === 'water_drop' || item.type === 'catchWaterDrop')
                        ? require('../../assets/game/watedrop_brok.png')
                        : ITEM_CONFIGS[item.type].source
                    }
                    style={[
                      styles.itemImage,
                      item.isBroken && { opacity: 0.3, transform: [{ scale: 1.2 }] }
                    ]}
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}

            <View style={styles.catchZone}>
              <Text style={styles.catchZoneText}>✋ TAP ITEMS HERE ✋</Text>
            </View>
          </>
        )}
      </LinearGradient>

      <Modal
        visible={showResumeDialog}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome Back!</Text>
            <Text style={styles.modalText}>
              You have a saved game. Would you like to continue where you left off?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={resumeGame}
              >
                <Text style={styles.modalButtonTextPrimary}>Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={restartGame}
              >
                <Text style={styles.modalButtonTextSecondary}>New Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 16,
    color: '#5029acff',
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statContainer: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#5029acff',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2b1460ff',
  },
  pauseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  pauseIcon: {
    fontSize: 20,
    color: 'white',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4c1d95',
    marginBottom: 20,
    textAlign: 'center',
  },
  gameInstructions: {
    fontSize: 16,
    color: '#5b21b6',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginVertical: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6d28d9',
  },
  secondaryButtonText: {
    color: '#6d28d9',
  },
  fallingItem: {
    position: 'absolute',
    zIndex:10,
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  touchArea: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    resizeMode: 'contain',
  },
  catchZone: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex:0,
    height: CATCH_ZONE_HEIGHT,
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(167, 139, 250, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catchZoneText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6d28d9',
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#8b5cf6',
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#b438fbff',
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b438fbff',
  },
  /* Results screen styles */
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultsCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 6,
  },
  medalContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -60,
    marginBottom: 12,
  },
  medalEmoji: {
    fontSize: 36,
  },
  resultsTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 18,
  },
  scoreContainer: {
    marginVertical: 12,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  star: {
    fontSize: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  buttonGroup: {
    width: '100%',
    marginTop: 12,
    gap: 10,
  },
  retakeButton: {
    backgroundColor: '#eef2ff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#5b21b6',
    fontWeight: '700',
  },
  backButtonResult: {
    marginTop: 8,
  },
  backButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 12,
    alignItems: 'center',
  },
backButtonText: {
    fontSize: 16,
    color: '#4c1d95',
    fontWeight: '600',
  },
  
  nextButton: {
    marginTop: 8,
  },
  nextButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 12,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
});