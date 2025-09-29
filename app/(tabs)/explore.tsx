import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressScreen() {
  const weeklyProgress = [
    { day: 'Mon', completed: true, streak: 3 },
    { day: 'Tue', completed: true, streak: 4 },
    { day: 'Wed', completed: true, streak: 5 },
    { day: 'Thu', completed: false, streak: 0 },
    { day: 'Fri', completed: false, streak: 0 },
    { day: 'Sat', completed: false, streak: 0 },
    { day: 'Sun', completed: false, streak: 0 },
  ];

  const achievements = [
    { title: 'Hand Washing Master', description: 'Washed hands 7 days in a row', icon: '🧼', earned: true },
    { title: 'Teeth Champion', description: 'Brushed teeth twice daily for 5 days', icon: '🦷', earned: true },
    { title: 'Clean Hero', description: 'Complete all hygiene tasks for 30 days', icon: '✨', earned: false },
    { title: 'Daily Streak', description: 'Maintain a 10-day streak', icon: '🔥', earned: false },
  ];

  const stats = [
    { label: 'Current Streak', value: '5 days', icon: '🔥' },
    { label: 'Total Stars', value: '47', icon: '⭐' },
    { label: 'Level', value: '5', icon: '🏆' },
    { label: 'Badges Earned', value: '2/4', icon: '🎖️' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <Text style={styles.headerSubtitle}>Keep up the great work! 🌟</Text>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View entering={SlideInUp.delay(200).duration(500)} style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <Animated.View
              key={stat.label}
              entering={FadeIn.delay(300 + index * 100).duration(300)}
              style={styles.statCard}
            >
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                style={styles.statGradient}
              >
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </LinearGradient>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Weekly Progress */}
        <Animated.View entering={SlideInUp.delay(400).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.weeklyContainer}>
            {weeklyProgress.map((day, index) => (
              <Animated.View
                key={day.day}
                entering={FadeIn.delay(500 + index * 50).duration(300)}
                style={styles.dayContainer}
              >
                <View style={[
                  styles.dayCircle,
                  day.completed ? styles.dayCompleted : styles.dayIncomplete
                ]}>
                  <Text style={[
                    styles.dayText,
                    day.completed ? styles.dayTextCompleted : styles.dayTextIncomplete
                  ]}>
                    {day.day}
                  </Text>
                </View>
                {day.streak > 0 && (
                  <Text style={styles.streakText}>{day.streak}🔥</Text>
                )}
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={SlideInUp.delay(600).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              <Animated.View
                key={achievement.title}
                entering={FadeIn.delay(700 + index * 100).duration(300)}
                style={styles.achievementCard}
              >
                <LinearGradient
                  colors={achievement.earned ? ['#10B981', '#3B82F6'] : ['#F3F4F6', '#E5E7EB']}
                  style={styles.achievementGradient}
                >
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementContent}>
                    <Text style={[
                      styles.achievementTitle,
                      achievement.earned ? styles.achievementTitleEarned : styles.achievementTitleNotEarned
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      achievement.earned ? styles.achievementDescriptionEarned : styles.achievementDescriptionNotEarned
                    ]}>
                      {achievement.description}
                    </Text>
                  </View>
                  {achievement.earned && (
                    <MaterialIcons name="check-circle" size={24} color="#10B981" />
                  )}
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Tips Section */}
        <Animated.View entering={SlideInUp.delay(800).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Tips</Text>
          <View style={styles.tipsContainer}>
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A']}
              style={styles.tipCard}
            >
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>
                Remember to wash your hands for at least 20 seconds with soap and water!
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  statGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  weeklyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 4,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCompleted: {
    backgroundColor: '#10B981',
  },
  dayIncomplete: {
    backgroundColor: '#E5E7EB',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayTextCompleted: {
    color: '#FFFFFF',
  },
  dayTextIncomplete: {
    color: '#9CA3AF',
  },
  streakText: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '600',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  achievementGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  achievementTitleEarned: {
    color: '#FFFFFF',
  },
  achievementTitleNotEarned: {
    color: '#6B7280',
  },
  achievementDescription: {
    fontSize: 14,
  },
  achievementDescriptionEarned: {
    color: 'rgba(255,255,255,0.8)',
  },
  achievementDescriptionNotEarned: {
    color: '#9CA3AF',
  },
  tipsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});
