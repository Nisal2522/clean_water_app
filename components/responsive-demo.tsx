import { useResponsive } from '@/hooks/use-responsive';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ResponsiveGrid, ResponsiveLayout, ResponsiveText } from './responsive-layout';

export function ResponsiveDemo() {
  const { isMobile, isTablet, isDesktop, screenWidth, screenHeight } = useResponsive();

  return (
    <ResponsiveLayout
      style={styles.container}
      mobileStyle={styles.mobileContainer}
      tabletStyle={styles.tabletContainer}
      desktopStyle={styles.desktopContainer}
    >
      <ResponsiveText
        mobileSize={18}
        tabletSize={22}
        desktopSize={28}
        style={styles.title}
      >
        Responsive Clean Water App
      </ResponsiveText>

      <Text style={styles.info}>
        Screen: {screenWidth}x{screenHeight} | 
        Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
      </Text>

      <ResponsiveGrid
        columns={{ mobile: 1, tablet: 2, desktop: 3 }}
        gap={16}
        style={styles.grid}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎮 Games</Text>
          <Text style={styles.cardText}>
            {isMobile ? 'Play hygiene games on your phone!' : 
             isTablet ? 'Enjoy interactive games on your tablet!' : 
             'Experience full games on desktop!'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📚 Lessons</Text>
          <Text style={styles.cardText}>
            {isMobile ? 'Quick lessons for mobile learning' : 
             'Comprehensive lessons with detailed content'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>❓ Challenges</Text>
          <Text style={styles.cardText}>
            {isMobile ? 'Daily challenges on the go' : 
             'Advanced challenges with progress tracking'}
          </Text>
        </View>
      </ResponsiveGrid>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This layout adapts to your screen size automatically! 📱💻🖥️
        </Text>
      </View>
    </ResponsiveLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  mobileContainer: {
    padding: 12,
  },
  tabletContainer: {
    padding: 24,
    maxWidth: 768,
    alignSelf: 'center',
  },
  desktopContainer: {
    padding: 32,
    maxWidth: 1024,
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#8B5CF6',
    textAlign: 'center',
    marginBottom: 16,
  },
  info: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 24,
    fontSize: 14,
  },
  grid: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
