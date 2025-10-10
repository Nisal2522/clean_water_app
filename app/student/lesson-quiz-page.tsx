import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '@/config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';

interface Quiz {
  question: string;
  answers: string[];
  correctAnswer: number;
}

interface QuizData {
  id: string;
  lessonId: string;
  topic: string;
  quizzes: Quiz[];
}

export default function LessonQuiz() {
  const { lessonId } = useLocalSearchParams();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (lessonId) {
      fetchQuiz();
    }
  }, [lessonId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('lessonId', '==', lessonId)
      );
      const querySnapshot = await getDocs(quizzesQuery);
      
      if (!querySnapshot.empty) {
        const quizDoc = querySnapshot.docs[0];
        const data = {
          id: quizDoc.id,
          ...quizDoc.data(),
        } as QuizData;
        
        setQuizData(data);
        setSelectedAnswers(new Array(data.quizzes.length).fill(-1));
      } else {
        Alert.alert('No Quiz', 'No quiz available for this lesson');
        router.back();
      }
    } catch (error: any) {
      console.error('Error fetching quiz:', error);
      Alert.alert('Error', 'Failed to load quiz');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedAnswers[currentQuestionIndex] === -1) {
      Alert.alert('Select an Answer', 'Please select an answer before continuing');
      return;
    }

    if (currentQuestionIndex < (quizData?.quizzes.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    
    let correct = 0;
    quizData.quizzes.forEach((quiz, index) => {
      if (selectedAnswers[index] === quiz.correctAnswer) {
        correct++;
      }
    });
    
    return Math.round((correct / quizData.quizzes.length) * 100);
  };

  const saveScore = async (finalScore: number) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const scoreData = {
        userId: user.uid,
        lessonId: lessonId as string,
        score: finalScore,
        totalQuestions: quizData?.quizzes.length || 0,
        correctAnswers: selectedAnswers.filter((ans, idx) => 
          ans === quizData?.quizzes[idx].correctAnswer
        ).length,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Create unique document ID based on userId and lessonId
      const scoreDocId = `${user.uid}_${lessonId}`;
      
      await setDoc(doc(db, 'lessonScores', scoreDocId), scoreData, { merge: true });
    } catch (error: any) {
      console.error('Error saving score:', error);
    }
  };

  const handleCompleteQuiz = async () => {
    if (selectedAnswers.some(ans => ans === -1)) {
      Alert.alert('Incomplete', 'Please answer all questions before completing the quiz');
      return;
    }

    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
    
    await saveScore(finalScore);
  };

  const handleBackToLesson = () => {
    router.back();
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quizData?.quizzes.length || 0).fill(-1));
    setShowResults(false);
    setScore(0);
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#a78bfa', '#c4b5fd', '#e9d5ff']}
        style={styles.container}
      >
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>Loading Quiz...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!quizData) {
    return null;
  }

  // Results Screen
  if (showResults) {
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
            <Text style={styles.resultsSubtitle}>Your Lesson Completed!</Text>
            
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
                onPress={handleRetakeQuiz}
              >
                <Text style={styles.retakeButtonText}>🔄 Retake Quiz</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backButton} onPress={handleBackToLesson}>
                <LinearGradient
                  colors={['#8b5cf6', '#a78bfa']}
                  style={styles.backButtonGradient}
                >
                  <Text style={styles.backButtonText}>Back to Lesson</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }

  // Quiz Screen
  const currentQuiz = quizData.quizzes[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.quizzes.length) * 100;

  return (
    <LinearGradient
      colors={['#a78bfa', '#c4b5fd', '#e9d5ff']}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToLesson} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{quizData.topic}</Text>
        </View>

        <View style={styles.quizCard}>
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Question {currentQuestionIndex + 1} of {quizData.quizzes.length}
            </Text>
          </View>

          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuiz.question}</Text>
          </View>

          {/* Answers */}
          <View style={styles.answersContainer}>
            {currentQuiz.answers.map((answer, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.answerButton,
                  selectedAnswers[currentQuestionIndex] === index && styles.answerButtonSelected,
                ]}
                onPress={() => handleAnswerSelect(index)}
              >
                <View style={styles.answerContent}>
                  <View style={styles.answerLabel}>
                    <Text style={[
                      styles.answerLabelText,
                      selectedAnswers[currentQuestionIndex] === index && styles.answerLabelTextSelected,
                    ]}>
                      {String.fromCharCode(97 + index)})
                    </Text>
                  </View>
                  <Text style={[
                    styles.answerText,
                    selectedAnswers[currentQuestionIndex] === index && styles.answerTextSelected,
                  ]}>
                    {answer}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Navigation */}
          <View style={styles.navigationContainer}>
            {currentQuestionIndex > 0 && (
              <TouchableOpacity 
                style={styles.navButton} 
                onPress={handlePreviousQuestion}
              >
                <Text style={styles.navButtonText}>← Previous</Text>
              </TouchableOpacity>
            )}
            
            <View style={{ flex: 1 }} />
            
            {currentQuestionIndex < quizData.quizzes.length - 1 ? (
              <TouchableOpacity 
                style={styles.navButton} 
                onPress={handleNextQuestion}
              >
                <Text style={styles.navButtonText}>Next →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.completeButton} 
                onPress={handleCompleteQuiz}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#a78bfa']}
                  style={styles.completeButtonGradient}
                >
                  <Text style={styles.completeButtonText}>Complete Quiz</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#4c1d95',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: 26,
  },
  answersContainer: {
    marginBottom: 24,
  },
  answerButton: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  answerButtonSelected: {
    backgroundColor: '#d8b4fe',
    borderColor: '#8b5cf6',
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  answerLabelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  answerLabelTextSelected: {
    color: 'white',
  },
  answerText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  answerTextSelected: {
    fontWeight: '600',
    color: '#4c1d95',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navButtonText: {
    fontSize: 16,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  completeButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  completeButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  medalContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  medalEmoji: {
    fontSize: 50,
  },
  resultsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 30,
  },
  scoreContainer: {
    marginBottom: 40,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    fontSize: 32,
    marginHorizontal: 8,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  retakeButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  backButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
