import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeIn,
    SlideInLeft,
    SlideInUp
} from 'react-native-reanimated';

interface ChildDashboardProps {
  childName?: string;
  avatarSrc?: string;
  level?: number;
  stars?: number;
  totalStars?: number;
  onNavigate?: (section: string) => void;
}

export function ChildDashboard({ 
  childName = "Alex Hero",
  avatarSrc,
  level = 5,
  stars = 47,
  totalStars = 60,
  onNavigate = () => {}
}: ChildDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');

  const progressPercentage = (stars / totalStars) * 100;

  const activityCards = [
    {
      id: 'games',
      title: 'Games',
      icon: '🎮',
      description: 'Play fun hygiene games!',
      gradient: ['#3B82F6', '#8B5CF6']
    },
    {
      id: 'lessons',
      title: 'Lessons',
      icon: '📚',
      description: 'Learn hygiene tips',
      gradient: ['#10B981', '#3B82F6']
    },
    {
      id: 'quizzes',
      title: 'Challenges',
      icon: '❓',
      description: 'Test your knowledge!',
      gradient: ['#F59E0B', '#EC4899']
    }
  ];

  const badges = [
    { name: 'Hand Washer', icon: '🧼', earned: true },
    { name: 'Teeth Champion', icon: '🦷', earned: true },
    { name: 'Clean Hero', icon: '✨', earned: false },
    { name: 'Daily Streak', icon: '🔥', earned: true }
  ];

  const tabs = [
    { id: 'home', label: 'Home', icon: 'home-outline' },
    { id: 'progress', label: 'Progress', icon: 'trending-up-outline' },
    { id: 'settings', label: 'Settings', icon: 'settings-outline' }
  ];

  return (
    <View style={styles.container}>
      {/* Status Bar Space */}
      <View style={styles.statusBar} />
      
      {/* Profile Card */}
      <Animated.View 
        entering={FadeIn.delay(200).duration(500)}
        style={styles.profileCard}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
          style={styles.profileGradient}
        >
          <View style={styles.profileContent}>
            <View style={styles.profileHeader}>
              <Animated.View
                entering={SlideInLeft.delay(300).duration(500)}
                style={styles.avatarContainer}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  style={styles.avatarGradient}
                >
                  <Image 
                    source={avatarSrc ? { uri: avatarSrc } : require('@/assets/images/child.jpeg')}
                    style={styles.avatar}
                  />
                </LinearGradient>
              </Animated.View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.greeting}>Hi, {childName}! 👋</Text>
                <View style={styles.levelContainer}>
                  <View style={styles.levelBadge}>
                    <Ionicons name="trophy" size={12} color="#F59E0B" />
                    <Text style={styles.levelText}>Level {level}</Text>
                  </View>
                  <View style={styles.starsContainer}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.starsText}>{stars}/{totalStars}</Text>
                  </View>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <Animated.View 
                      style={[
                        styles.progressFill, 
                        { width: `${progressPercentage}%` }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            </View>
            
            {/* Badges */}
            <Animated.View 
              entering={SlideInUp.delay(400).duration(500)}
              style={styles.badgesContainer}
            >
              {badges.map((badge, index) => (
                <Animated.View
                  key={badge.name}
                  entering={FadeIn.delay(500 + index * 100).duration(300)}
                >
                  <View style={[
                    styles.badge,
                    badge.earned ? styles.badgeEarned : styles.badgeNotEarned
                  ]}>
                    <Text style={styles.badgeIcon}>{badge.icon}</Text>
                    <Text style={[
                      styles.badgeText,
                      badge.earned ? styles.badgeTextEarned : styles.badgeTextNotEarned
                    ]}>
                      {badge.name}
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Activity Cards */}
      <ScrollView style={styles.activitiesContainer} showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={FadeIn.delay(600).duration(500)}
          style={styles.activityCardsContainer}
        >
          {activityCards.map((card, index) => (
            <Animated.View
              key={card.id}
              entering={SlideInLeft.delay(700 + index * 100).duration(500)}
            >
              <TouchableOpacity
                onPress={() => onNavigate(card.id)}
                style={styles.activityCard}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={card.gradient}
                  style={styles.activityGradient}
                >
                  <View style={styles.activityContent}>
                    <Text style={styles.activityIcon}>{card.icon}</Text>
                    <View style={styles.activityTextContainer}>
                      <Text style={styles.activityTitle}>{card.title}</Text>
                      <Text style={styles.activityDescription}>{card.description}</Text>
                    </View>
                    <Ionicons 
                      name="chevron-forward" 
                      size={24} 
                      color="rgba(255,255,255,0.8)" 
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation */}
      <Animated.View 
        entering={SlideInUp.delay(1000).duration(500)}
        style={styles.bottomNavigation}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
          style={styles.navigationGradient}
        >
          <View style={styles.navigationContent}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => {
                  setActiveTab(tab.id);
                  onNavigate(tab.id);
                }}
                style={[
                  styles.navigationTab,
                  activeTab === tab.id && styles.activeTab
                ]}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={tab.icon as any} 
                  size={20} 
                  color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[
                  styles.navigationLabel,
                  activeTab === tab.id && styles.activeNavigationLabel
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  statusBar: {
    height: 48,
  },
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  profileGradient: {
    borderRadius: 20,
    padding: 24,
  },
  profileContent: {
    gap: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    borderRadius: 32,
    padding: 3,
  },
  avatarGradient: {
    borderRadius: 29,
    padding: 3,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 26,
  },
  profileInfo: {
    flex: 1,
    gap: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeEarned: {
    backgroundColor: '#8B5CF6',
  },
  badgeNotEarned: {
    backgroundColor: '#F3F4F6',
  },
  badgeIcon: {
    fontSize: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextEarned: {
    color: '#FFFFFF',
  },
  badgeTextNotEarned: {
    color: '#9CA3AF',
  },
  activitiesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  activityCardsContainer: {
    gap: 16,
    paddingBottom: 20,
  },
  activityCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityGradient: {
    borderRadius: 16,
    padding: 20,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  activityIcon: {
    fontSize: 32,
  },
  activityTextContainer: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activityDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  bottomNavigation: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  navigationGradient: {
    borderRadius: 20,
    padding: 8,
  },
  navigationContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navigationTab: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 4,
    minWidth: 80,
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  navigationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeNavigationLabel: {
    color: '#FFFFFF',
  },
});
