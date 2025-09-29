import { ChildDashboard } from '@/components/child-dashboard';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const handleNavigate = (section: string) => {
    switch (section) {
      case 'water-drop-game':
        // Navigate to Water Drop Game
        router.push('/water-drop-game');
        break;
      case 'games':
        // Navigate to games section
        console.log('Navigate to games');
        break;
      case 'lessons':
        // Navigate to lessons section
        console.log('Navigate to lessons');
        break;
      case 'quizzes':
        // Navigate to quizzes section
        console.log('Navigate to quizzes');
        break;
      case 'progress':
        // Navigate to progress tab
        router.push('/(tabs)/explore');
        break;
      case 'settings':
        // Navigate to settings
        console.log('Navigate to settings');
        break;
      default:
        console.log('Navigate to:', section);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <ChildDashboard 
        childName="Alex Hero"
        level={5}
        stars={47}
        totalStars={60}
        onNavigate={handleNavigate}
      />
    </SafeAreaView>
  );
}
