import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { useQuiz } from '../../hooks/useQuiz';
import { useAuth } from '../../hooks/useAuth';

export default function QuizGameScreen() {
  const { user } = useAuth();
  const { questions, loading: questionsLoading, saveProgress, saveBadge } = useQuiz();
  
  const [timeLeft, setTimeLeft] = useState(20);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [showTimeBadge, setShowTimeBadge] = useState(false);
  const [showFloatingBadge, setShowFloatingBadge] = useState(false);
  const [floatingBadgeType, setFloatingBadgeType] = useState<string>('');
  const [correctStreak, setCorrectStreak] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatingBadgeAnim = useRef(new Animated.Value(0)).current;
  const floatingBadgeScale = useRef(new Animated.Value(0)).current;
  const floatingBadgeOpacity = useRef(new Animated.Value(0)).current;

  // Use Firebase data instead of hardcoded data
  const currentQuiz = questions[currentQuestion - 1];

  // Sound effect function
  const playBadgeSound = async () => {
    try {
      // Use a free magical chime sound from a reliable CDN
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
        { shouldPlay: true, volume: 0.8 }
      );
      // Clean up the sound after it finishes
      setTimeout(() => {
        sound.unloadAsync();
      }, 2000);
    } catch (error) {
      console.log('Error playing sound:', error);
      // Fallback: try a different sound source
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav' },
          { shouldPlay: true, volume: 0.8 }
        );
        setTimeout(() => {
          sound.unloadAsync();
        }, 2000);
      } catch (fallbackError) {
        console.log('Fallback sound also failed:', fallbackError);
      }
    }
  };

  // Badge animation function
  const showBadgeAnimation = (badgeType: string) => {
    if (earnedBadges.includes(badgeType)) return; // Don't show if already earned
    
    // Play magical sound effect
    playBadgeSound();
    
    setFloatingBadgeType(badgeType);
    setShowFloatingBadge(true);
    setEarnedBadges([...earnedBadges, badgeType]);
    
    // Reset animation values
    floatingBadgeAnim.setValue(0);
    floatingBadgeScale.setValue(0);
    floatingBadgeOpacity.setValue(0);
    
    // Start the floating animation
    Animated.sequence([
      // Phase 1: Appear and scale up with bounce
      Animated.parallel([
        Animated.timing(floatingBadgeScale, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(floatingBadgeOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      // Phase 2: Bounce back to normal size
      Animated.timing(floatingBadgeScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      // Phase 3: Hold for a moment
      Animated.delay(500),
      // Phase 4: Float upward and shrink
      Animated.parallel([
        Animated.timing(floatingBadgeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(floatingBadgeScale, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Phase 5: Fade out and hide
      Animated.timing(floatingBadgeOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFloatingBadge(false);
      // Show permanent badge
      if (badgeType === 'time') {
        setShowTimeBadge(true);
      }
      // Medal badge is automatically added to earnedBadges array
    });
  };

  // Reset timer when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setTimeLeft(20);
      setCurrentQuestion(1);
      setScore(0);
      setShowFeedback(false);
      setIsCorrect(false);
      setSelectedAnswer(null);
      setShowTimeUp(false);
      setShowResults(false);
      setShowCompletion(false);
      setEarnedBadges([]);
      setShowTimeBadge(false);
      setShowFloatingBadge(false);
      setFloatingBadgeType('');
      setCorrectStreak(0);
      floatingBadgeAnim.setValue(0);
      floatingBadgeScale.setValue(0);
      floatingBadgeOpacity.setValue(0);
    }, [])
  );

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !showFeedback && !showTimeUp) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showFeedback && !showTimeUp) {
      // Time's up - show time up popup
      setShowTimeUp(true);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, showFeedback, showTimeUp]);


  // Pulse animation for timer
  useEffect(() => {
    if (timeLeft <= 5) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timeLeft]);


  const handleTimeUp = () => {
    // Show time's up popup instead of auto-advancing
    setShowTimeUp(true);
  };

  const handleAnswer = (option: any) => {
    setSelectedAnswer(option);
    setIsCorrect(option.correct);
    setShowFeedback(true);
    
    if (option.correct) {
      const newScore = score + 1;
      const newCorrectAnswers = correctAnswers + 1;
      const newStreak = correctStreak + 1;
      setScore(newScore);
      setCorrectAnswers(newCorrectAnswers);
      setCorrectStreak(newStreak);
      
      // Check for medal badge (5 correct answers in a row)
      if (newStreak === 5) {
        showBadgeAnimation('medal');
      }
    } else {
      const newWrongAnswers = wrongAnswers + 1;
      setWrongAnswers(newWrongAnswers);
      // Reset streak on wrong answer
      setCorrectStreak(0);
    }
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    // Move to next question
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      // Don't reset timer - keep it at 20 for all questions
    } else {
      // Quiz finished - check for time badge
      if (timeLeft >= 10) {
        showBadgeAnimation('time');
      }
      setShowCompletion(true);
      // Save progress to Firebase
      saveQuizProgress();
    }
  };

  const saveQuizProgress = async () => {
    try {
      // Generate a unique user ID for anonymous users
      const userId = user ? user.uid : `anonymous-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const totalQuestions = questions.length;
      
      // Save progress to Firebase
      await saveProgress(
        userId,
        correctAnswers,
        wrongAnswers,
        totalQuestions,
        timeSpent,
        earnedBadges
      );

      // Save badges to Firebase
      for (const badgeType of earnedBadges) {
        const badgeName = badgeType === 'time' ? 'Speed Master' : 'Medal Master';
        const description = badgeType === 'time' 
          ? 'Completed quiz in under 2 minutes' 
          : 'Got 5 correct answers in a row';
        
        await saveBadge(
          userId,
          badgeType as 'time' | 'medal' | 'streak' | 'perfect',
          badgeName,
          description,
          `quiz-${Date.now()}`
        );
      }

      console.log('Quiz progress saved to Firebase!', { userId, score: Math.round((correctAnswers / totalQuestions) * 100) });
    } catch (error) {
      console.error('Error saving quiz progress:', error);
    }
  };

  const handleSeeResults = () => {
    setShowTimeUp(false);
    setShowResults(true);
  };

  const handleBackToHome = () => {
    router.back();
  };

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [router]);

  // Show loading if questions are still loading
  if (questionsLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#B8D4FD', '#B8D4FD']}
          style={styles.mainContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading quiz questions...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Show error if no questions loaded
  if (!questions || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#B8D4FD', '#B8D4FD']}
          style={styles.mainContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>No quiz questions available</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
              <Text style={styles.retryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#B8D4FD', '#B8D4FD']}
        style={styles.mainContent}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          {/* Timer */}
          <Animated.View style={[
            styles.timer, 
            { 
              transform: [{ scale: pulseAnim }],
              backgroundColor: timeLeft <= 5 ? '#FF4444' : '#B8D4FD',
              borderColor: timeLeft <= 5 ? '#CC0000' : '#0A3AAB'
            }
          ]}>
            <Text style={[
              styles.timerText,
              { color: timeLeft <= 5 ? 'white' : 'white' }
            ]}>{timeLeft}</Text>
          </Animated.View>

          {/* Badges */}
          <View style={styles.rightIcons}>
            {earnedBadges.includes('time') && (
              <View style={styles.badgeContainer}>
                <Text style={styles.permanentBadgeEmoji}>⌚</Text>
              </View>
            )}
            {earnedBadges.includes('medal') && (
              <View style={styles.badgeContainer}>
                <Text style={styles.permanentBadgeEmoji}>🏅</Text>
              </View>
            )}
          </View>
        </View>

        {/* Question Number */}
        <View style={styles.questionNumberContainer}>
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>
              {currentQuestion.toString().padStart(2, '0')}
            </Text>
          </View>
        </View>

        {/* Question Area */}
        <View style={styles.questionArea}>
          <View style={styles.questionCard}>
            {currentQuiz?.QuizNClean_image === "rotten_apple" ? (
              <Image
                source={require('../../assets/quiz/rotten_apple.png')}
                style={styles.questionImage}
                resizeMode="contain"
              />
            ) : currentQuiz?.QuizNClean_image === "garbagebag" ? (
              <Image
                source={require('../../assets/quiz/garbagebag.png')}
                style={styles.questionImage}
                resizeMode="contain"
              />
            ) : currentQuiz?.QuizNClean_image === "sneez" ? (
              <Image
                source={require('../../assets/quiz/sneez.png')}
                style={styles.questionImage}
                resizeMode="contain"
              />
            ) : currentQuiz?.QuizNClean_image === "plastic" ? (
              <Image
                source={require('../../assets/quiz/plastic.png')}
                style={styles.questionImage}
                resizeMode="contain"
              />
            ) : currentQuiz?.QuizNClean_image === "dirtyhands" ? (
              <Image
                source={require('../../assets/quiz/dirtyhands.png')}
                style={styles.questionImage}
                resizeMode="contain"
              />
            ) : currentQuiz?.QuizNClean_image === "running_tap" ? (
              <Image
                source={require('../../assets/quiz/running_tap.png')}
                style={styles.questionImage}
                resizeMode="contain"
              />
            ) : currentQuiz?.QuizNClean_image === "sleep" ? (
              <Image
                source={require('../../assets/quiz/sleep.png')}
                style={styles.questionImage}
                resizeMode="contain"
              />
            ) : currentQuiz?.QuizNClean_image === "wound" ? (
              <Image
                source={require('../../assets/quiz/wound.png')}
                style={styles.questionImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.questionImage}>{currentQuiz?.QuizNClean_image || 'Loading...'}</Text>
            )}
          </View>
        </View>

        {/* Answer Choices */}
        <View style={styles.answerContainer}>
          {currentQuiz?.QuizNClean_options?.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.answerCard,
                selectedAnswer?.id === option.id && styles.selectedAnswerCard
              ]}
              onPress={() => handleAnswer(option)}
            >
              {option.icon === "rotten_apple_throw" ? (
                <Image
                  source={require('../../assets/quiz/rotten_apple_throw.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "rotten_apple_eating" ? (
                <Image
                  source={require('../../assets/quiz/rotten_apple_eating.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "garbagebag_floor" ? (
                <Image
                  source={require('../../assets/quiz/garbagebag_floor.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "garbagebag_dustbin" ? (
                <Image
                  source={require('../../assets/quiz/garbagebag_dustbin.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "sneez_covered" ? (
                <Image
                  source={require('../../assets/quiz/sneez_covered.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "sneez_not_covered" ? (
                <Image
                  source={require('../../assets/quiz/sneez_not_covered.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "plastic_in_river" ? (
                <Image
                  source={require('../../assets/quiz/plastic_in_river.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "plastic_in_bag" ? (
                <Image
                  source={require('../../assets/quiz/plastic_in_bag.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "dirtyhands_wash" ? (
                <Image
                  source={require('../../assets/quiz/dirtyhands_wash.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "dirtyhands_eating" ? (
                <Image
                  source={require('../../assets/quiz/dirtyhands_eating.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "running_tap_close" ? (
                <Image
                  source={require('../../assets/quiz/running_tap_close.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "running_tap_ignore" ? (
                <Image
                  source={require('../../assets/quiz/running_tap_ignore.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "sleep_brush" ? (
                <Image
                  source={require('../../assets/quiz/sleep_brush.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "sleep_no_brush" ? (
                <Image
                  source={require('../../assets/quiz/sleep_no_brush.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "wound_cleanwith_mud" ? (
                <Image
                  source={require('../../assets/quiz/wound_cleanwith_mud.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : option.icon === "wound_cleanwith_water" ? (
                <Image
                  source={require('../../assets/quiz/wound_cleanwith_water.png')}
                  style={styles.answerIcon}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.answerIcon}>{option.icon}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Popup */}
        {showFeedback && (
          <View style={styles.feedbackOverlay}>
            <View style={[
              styles.feedbackPopup,
              { backgroundColor: isCorrect ? '#B8D4FD' : '#FFB3B3' }
            ]}>
              <View style={styles.feedbackContent}>
                <View style={styles.feedbackIcon}>
                  <Ionicons 
                    name={isCorrect ? "checkmark" : "close"} 
                    size={24} 
                    color="white" 
                  />
                </View>
                <Text style={styles.feedbackText}>
                  {isCorrect ? "Amazing!" : "Better luck next time"}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.continueButtonText}>CONTINUE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Time's Up Popup */}
        {showTimeUp && (
          <View style={styles.feedbackOverlay}>
            <View style={[styles.feedbackPopup, { backgroundColor: '#FFB3B3' }]}>
              <View style={styles.feedbackContent}>
                <View style={styles.feedbackIcon}>
                  <Ionicons name="time" size={24} color="white" />
                </View>
                <Text style={styles.feedbackText}>Time's over!</Text>
              </View>
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleSeeResults}
              >
                <Text style={styles.continueButtonText}>See Results</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Results Popup */}
        {showResults && (
          <View style={styles.feedbackOverlay}>
            <View style={[styles.feedbackPopup, { backgroundColor: '#B8E6B8' }]}>
              <View style={styles.feedbackContent}>
                <View style={styles.feedbackIcon}>
                  <Ionicons name="trophy" size={24} color="white" />
                </View>
                <Text style={styles.feedbackText}>
                  You got {score} out of {questions.length} correct!
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleBackToHome}
              >
                <Text style={styles.continueButtonText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Completion Popup */}
        {showCompletion && (
          <View style={styles.feedbackOverlay}>
            <View style={[styles.feedbackPopup, { backgroundColor: '#B8E6B8' }]}>
              <View style={styles.feedbackContent}>
                <View style={styles.feedbackIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                </View>
                <Text style={styles.feedbackText}>
                  Quiz Complete!
                </Text>
              </View>
              <Text style={styles.scoreText}>
                You got {score} out of {questions.length} correct!
              </Text>
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleBackToHome}
              >
                <Text style={styles.continueButtonText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Floating Badge Animation */}
        {showFloatingBadge && (
          <Animated.View 
            style={[
              styles.floatingBadge,
              {
                transform: [
                  { 
                    scale: floatingBadgeScale
                  },
                  { 
                    translateY: floatingBadgeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -300]
                    })
                  }
                ],
                opacity: floatingBadgeOpacity
              }
            ]}
          >
            <View style={styles.floatingBadgeContainer}>
              <Text style={styles.badgeEmoji}>
                {floatingBadgeType === 'time' ? '⌚' : '🏅'}
              </Text>
              <View style={styles.glowEffect} />
            </View>
          </Animated.View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#A8C8E8',
  },
  timer: {
    marginTop:30,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  questionNumberContainer: {

    alignItems: 'center',
    paddingVertical: 10,
  },
  questionNumber: {
    backgroundColor: '#B8D4FD',
    borderWidth: 2,
    borderColor: '#0A3AAB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  questionNumberText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A3AAB',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#B8D4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
    zIndex: 1000,
  },
  floatingBadgeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    borderWidth: 4,
    borderColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 15,
  },
  badgeEmoji: {
    fontSize: 40,
    textAlign: 'center',
  },
  glowEffect: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    top: -10,
    left: -10,
    zIndex: -1,
  },
  permanentBadgeEmoji: {
    fontSize: 20,
    textAlign: 'center',
  },
  questionArea: {
     marginTop:-100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionCard: {
    marginTop:-250,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    width: 364,
    height: 258,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  questionImage: {
    fontSize: 120,
    textAlign: 'center',
    width: 350,
    height: 250,
  },
  answerContainer: {
    marginTop:-250,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingBottom: 60,
  },
  answerCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 14,
    width: '51%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  answerIcon: {
    fontSize: 60,
    textAlign: 'center',
    width: 180,
    height: 180,
  },
  selectedAnswerCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#0A3AAB',
    shadowColor: '#0A3AAB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    transform: [{ scale: 0.98 }],
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  feedbackPopup: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  feedbackContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  feedbackIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#0A3AAB',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    marginBottom:15,
    width: '100%',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A3AAB',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0A3AAB',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});