import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface QuizQuestion {
  id: string;
  QuizNClean_image: string;
  QuizNClean_options: Array<{
    id: string;
    icon: string;
    correct: boolean;
  }>;
}

export interface QuizProgress {
  userId: string;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  earnedBadges: string[];
  timestamp: any;
}

export interface QuizBadge {
  userId: string;
  badgeType: 'time' | 'medal' | 'streak' | 'perfect';
  badgeName: string;
  description: string;
  quizId: string;
  timestamp: any;
}

export function useQuiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsRef = collection(db, 'QuizNClean');
      const snapshot = await getDocs(questionsRef);
      
      const questionsData: QuizQuestion[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        questionsData.push({
          id: doc.id,
          QuizNClean_image: data.QuizNClean_image || '',
          QuizNClean_options: data.QuizNClean_options || []
        });
      });
      
      setQuestions(questionsData);
      console.log('Loaded quiz questions:', questionsData.length);
    } catch (error) {
      console.error('Error loading quiz questions:', error);
      // Fallback to hardcoded questions if Firebase fails
      setQuestions(getHardcodedQuestions());
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (
    userId: string,
    correctAnswers: number,
    wrongAnswers: number,
    totalQuestions: number,
    timeSpent: number,
    earnedBadges: string[]
  ) => {
    try {
      const progressData: Omit<QuizProgress, 'id'> = {
        userId,
        correctAnswers,
        wrongAnswers,
        totalQuestions,
        timeSpent,
        earnedBadges,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'quizProgress'), progressData);
      console.log('Quiz progress saved successfully');
    } catch (error) {
      console.error('Error saving quiz progress:', error);
    }
  };

  const saveBadge = async (
    userId: string,
    badgeType: 'time' | 'medal' | 'streak' | 'perfect',
    badgeName: string,
    description: string,
    quizId: string
  ) => {
    try {
      const badgeData: Omit<QuizBadge, 'id'> = {
        userId,
        badgeType,
        badgeName,
        description,
        quizId,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'quizBadges'), badgeData);
      console.log('Quiz badge saved successfully');
    } catch (error) {
      console.error('Error saving quiz badge:', error);
    }
  };

  return {
    questions,
    loading,
    saveProgress,
    saveBadge
  };
}

// Fallback hardcoded questions for when Firebase is not available
function getHardcodedQuestions(): QuizQuestion[] {
  return [
    {
      id: '1',
      QuizNClean_image: 'rotten_apple',
      QuizNClean_options: [
        {
          id: '1a',
          icon: 'rotten_apple_throw',
          correct: true
        },
        {
          id: '1b',
          icon: 'rotten_apple_eating',
          correct: false
        }
      ]
    },
    {
      id: '2',
      QuizNClean_image: 'garbagebag',
      QuizNClean_options: [
        {
          id: '2a',
          icon: 'garbagebag_floor',
          correct: false
        },
        {
          id: '2b',
          icon: 'garbagebag_dustbin',
          correct: true
        }
      ]
    },
    {
      id: '3',
      QuizNClean_image: 'sneez',
      QuizNClean_options: [
        {
          id: '3a',
          icon: 'sneez_covered',
          correct: true
        },
        {
          id: '3b',
          icon: 'sneez_not_covered',
          correct: false
        }
      ]
    },
    {
      id: '4',
      QuizNClean_image: 'plastic',
      QuizNClean_options: [
        {
          id: '4a',
          icon: 'plastic_in_river',
          correct: false
        },
        {
          id: '4b',
          icon: 'plastic_in_bag',
          correct: true
        }
      ]
    },
    {
      id: '5',
      QuizNClean_image: 'dirtyhands',
      QuizNClean_options: [
        {
          id: '5a',
          icon: 'dirtyhands_wash',
          correct: true
        },
        {
          id: '5b',
          icon: 'dirtyhands_eating',
          correct: false
        }
      ]
    },
    {
      id: '6',
      QuizNClean_image: 'running_tap',
      QuizNClean_options: [
        {
          id: '6a',
          icon: 'running_tap_close',
          correct: true
        },
        {
          id: '6b',
          icon: 'running_tap_ignore',
          correct: false
        }
      ]
    },
    {
      id: '7',
      QuizNClean_image: 'sleep',
      QuizNClean_options: [
        {
          id: '7a',
          icon: 'sleep_brush',
          correct: true
        },
        {
          id: '7b',
          icon: 'sleep_no_brush',
          correct: false
        }
      ]
    },
    {
      id: '8',
      QuizNClean_image: 'wound',
      QuizNClean_options: [
        {
          id: '8a',
          icon: 'wound_cleanwith_mud',
          correct: false
        },
        {
          id: '8b',
          icon: 'wound_cleanwith_water',
          correct: true
        }
      ]
    }
  ];
}
