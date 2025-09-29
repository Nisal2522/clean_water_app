import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { GameOverModal } from './GameOverModal';
import { PlayerBucket } from './PlayerBucket';
import { ScoreBoard } from './ScoreBoard';
import { WaterDrop } from './WaterDrop';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Drop {
  id: number;
  x: number;
  speed: number;
}

export function WaterDropGame() {
  // Game state
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Player position
  const [bucketX, setBucketX] = useState(screenWidth / 2 - 30);
  const bucketWidth = 60;
  const bucketHeight = 40;
  
  // Drops management
  const [drops, setDrops] = useState<Drop[]>([]);
  const dropIdRef = useRef(0);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  
  // Sound effects
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Load sound effect
  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/catch.mp3')
      );
      setSound(newSound);
    } catch (error) {
      console.log('Sound not available:', error);
    }
  };

  const playCatchSound = async () => {
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    }
  };

  // Start game
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setGameOver(false);
    setIsPlaying(true);
    setDrops([]);
    startGameLoop();
  };

  // Game loop
  const startGameLoop = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    gameLoopRef.current = setInterval(() => {
      if (isPlaying && !gameOver) {
        spawnDrop();
      }
    }, 1000 - (level * 100)); // Faster spawning with higher levels
  };

  // Spawn new drop
  const spawnDrop = () => {
    const newDrop: Drop = {
      id: dropIdRef.current++,
      x: Math.random() * (screenWidth - 40) + 20,
      speed: 3000 - (level * 200), // Faster drops with higher levels
    };
    
    setDrops(prev => [...prev, newDrop]);
  };

  // Handle drop catch
  const handleDropCatch = useCallback((dropId: number) => {
    setDrops(prev => prev.filter(drop => drop.id !== dropId));
    setScore(prev => {
      const newScore = prev + 1;
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      
      // Level up every 10 points
      if (newScore > 0 && newScore % 10 === 0) {
        setLevel(prev => prev + 1);
      }
      
      return newScore;
    });
    
    playCatchSound();
  }, [highScore]);

  // Handle drop miss
  const handleDropMiss = useCallback((dropId: number) => {
    setDrops(prev => prev.filter(drop => drop.id !== dropId));
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameOver(true);
        setIsPlaying(false);
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      }
      return newLives;
    });
  }, []);

  // Handle player movement
  const onGestureEvent = (event: any) => {
    if (!isPlaying || gameOver) return;
    
    const newX = event.nativeEvent.x - bucketWidth / 2;
    const clampedX = Math.max(0, Math.min(screenWidth - bucketWidth, newX));
    setBucketX(clampedX);
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // Handle touch start
    }
  };

  // Collision detection
  const checkCollision = (dropX: number, dropY: number) => {
    const bucketY = screenHeight - 60;
    const dropBottom = dropY + 30;
    const dropLeft = dropX;
    const dropRight = dropX + 20;
    const bucketLeft = bucketX;
    const bucketRight = bucketX + bucketWidth;
    
    return (
      dropBottom >= bucketY &&
      dropLeft >= bucketLeft &&
      dropRight <= bucketRight
    );
  };

  // Restart game
  const restartGame = () => {
    setGameOver(false);
    startGame();
  };

  // Go home
  const goHome = () => {
    setIsPlaying(false);
    setGameOver(false);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    router.push('/(tabs)/');
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        {/* Score Board */}
        <ScoreBoard
          score={score}
          highScore={highScore}
          level={level}
          lives={lives}
        />
        
        {/* Water Drops */}
        {drops.map((drop) => (
          <WaterDrop
            key={drop.id}
            x={drop.x}
            onCatch={() => handleDropCatch(drop.id)}
            onMiss={() => handleDropMiss(drop.id)}
            speed={drop.speed}
          />
        ))}
        
        {/* Player Bucket */}
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <View style={styles.bucketContainer}>
            <PlayerBucket
              x={bucketX}
              width={bucketWidth}
              height={bucketHeight}
            />
          </View>
        </PanGestureHandler>
        
        {/* Start Button */}
        {!isPlaying && !gameOver && (
          <View style={styles.startContainer}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButton}
            >
              <TouchableOpacity
                onPress={startGame}
                style={styles.startButtonTouch}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Start Game</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
        
        {/* Game Over Modal */}
        <GameOverModal
          visible={gameOver}
          score={score}
          highScore={highScore}
          onRestart={restartGame}
          onHome={goHome}
        />
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    position: 'relative',
  },
  bucketContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  startContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  startButton: {
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
    elevation: 8,
  },
  startButtonTouch: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
