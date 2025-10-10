import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { auth, db } from '@/config/firebase';
import { collection, getDocs, query, orderBy, where, doc, getDoc } from 'firebase/firestore';

interface Lesson {
  id: string;
  topic: string;
  content: string;
  videoUrl: string | null;
  createdAt: any;
}

export default function LessonDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [checkingQuiz, setCheckingQuiz] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const lessonsQuery = query(collection(db, 'lessons'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(lessonsQuery);
      
      const fetchedLessons: Lesson[] = [];
      querySnapshot.forEach((doc) => {
        fetchedLessons.push({
          id: doc.id,
          ...doc.data(),
        } as Lesson);
      });

      setLessons(fetchedLessons);
    } catch (error: any) {
      console.error('Error fetching lessons:', error);
      Alert.alert('Error', 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonPress = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCheckingQuiz(true);
    
    // Check if quiz exists
    try {
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('lessonId', '==', lesson.id)
      );
      const querySnapshot = await getDocs(quizzesQuery);
      setHasQuiz(!querySnapshot.empty);
    } catch (error) {
      console.error('Error checking quiz:', error);
      setHasQuiz(false);
    } finally {
      setCheckingQuiz(false);
    }
  };

  const handleStartQuiz = () => {
    if (selectedLesson) {
      router.push({
        pathname: '/student/lesson-quiz-page',
        params: { lessonId: selectedLesson.id },
      });
    }
  };

  const handleBackToList = () => {
    setSelectedLesson(null);
    setHasQuiz(false);
  };

  const renderLesson = ({ item, index }: { item: Lesson; index: number }) => (
    <TouchableOpacity
      style={styles.lessonCard}
      onPress={() => handleLessonPress(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#a78bfa', '#c4b5fd']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}><Image source={require('../../assets/game/hand_washing_soap.png')} /></Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.lessonTitle}>{item.topic}</Text>
            <Text style={styles.lessonSubtitle}>
              {item.content.substring(0, 60)}...
            </Text>
          </View>
        </View>
        
        {item.videoUrl && (
          <Video
            source={{ uri: item.videoUrl }}
            style={styles.lessonVideo}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
          />
        )}
        
        <View style={styles.buttonContainer}>
          <View style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>Review Lesson</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#a78bfa', '#c4b5fd', '#e9d5ff']}
        style={styles.container}
      >
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>Loading Lessons...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Show selected lesson content
  if (selectedLesson) {
    return (
      <LinearGradient
       colors={['#faf5ff', '#fce7f3']}
        style={styles.container}
      >
        <StatusBar style="dark" />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={handleBackToList} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back to Lessons</Text>
          </TouchableOpacity>

          <View style={styles.contentCard}>
            <Text style={styles.title}>{selectedLesson.topic}</Text>
            
            {selectedLesson.videoUrl && (
              <Video
                source={{ uri: selectedLesson.videoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
              />
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📖 What is {selectedLesson.topic}?</Text>
              <Text style={styles.content}>{selectedLesson.content}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🤔 Why is this important?</Text>
              <View style={styles.bulletPoint}>
                <Text style={styles.bulletIcon}>✓</Text>
                <Text style={styles.bulletText}>To Stay Healthy</Text>
              </View>
              <View style={styles.bulletPoint}>
                <Text style={styles.bulletIcon}>✓</Text>
                <Text style={styles.bulletText}>For Good Health</Text>
              </View>
              <View style={styles.bulletPoint}>
                <Text style={styles.bulletIcon}>✓</Text>
                <Text style={styles.bulletText}>To Help Others</Text>
              </View>
            </View>

            {checkingQuiz ? (
              <ActivityIndicator size="small" color="#8b5cf6" style={{ marginTop: 20 }} />
            ) : hasQuiz && (
              <TouchableOpacity style={styles.quizButton} onPress={handleStartQuiz}>
                <LinearGradient
                  colors={['#8b5cf6', '#a78bfa']}
                  style={styles.quizButtonGradient}
                >
                  <Text style={styles.quizButtonText}>Start Quiz</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  // Show lesson list
  return (
    <LinearGradient
      colors={['#faf5ff', '#fce7f3']}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Lessons</Text>
        <Text style={styles.subtitle}>{lessons.length} Lessons Completed</Text>
      </View>

      {lessons.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.emptyTitle}>No Lessons Available</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new lessons
          </Text>
        </View>
      ) : (
        <FlatList
          data={lessons}
          renderItem={renderLesson}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4c1d95',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  lessonCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  lessonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  lessonVideo: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#000',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  reviewButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 150,
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#000',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletIcon: {
    fontSize: 16,
    color: '#10b981',
    marginRight: 8,
    fontWeight: 'bold',
  },
  bulletText: {
    fontSize: 15,
    color: '#4b5563',
    flex: 1,
  },
  quizButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 20,
  },
  quizButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  quizButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
