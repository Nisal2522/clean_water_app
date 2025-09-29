import { useResponsive } from '@/hooks/use-responsive';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OrientationGrid, OrientationLayout, OrientationText } from './orientation-layout';

export function OrientationDemo() {
  const { orientation, screenWidth, screenHeight, isMobile } = useResponsive();

  return (
    <OrientationLayout
      style={styles.container}
      portraitStyle={styles.portraitContainer}
      landscapeStyle={styles.landscapeContainer}
    >
      <OrientationText
        portraitSize={24}
        landscapeSize={20}
        style={styles.title}
      >
        📱 Mobile Orientation Demo
      </OrientationText>

      <Text style={styles.info}>
        Orientation: {orientation} | Screen: {screenWidth}x{screenHeight}
      </Text>

      <OrientationGrid
        portraitColumns={1}
        landscapeColumns={2}
        gap={12}
        style={styles.grid}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎮 Games</Text>
          <Text style={styles.cardText}>
            {orientation === 'portrait' 
              ? 'Vertical layout for portrait mode' 
              : 'Horizontal layout for landscape mode'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📚 Lessons</Text>
          <Text style={styles.cardText}>
            {orientation === 'portrait' 
              ? 'Stacked content in portrait' 
              : 'Side-by-side content in landscape'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>❓ Challenges</Text>
          <Text style={styles.cardText}>
            {orientation === 'portrait' 
              ? 'Full width cards in portrait' 
              : 'Compact cards in landscape'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏆 Progress</Text>
          <Text style={styles.cardText}>
            {orientation === 'portrait' 
              ? 'Vertical progress tracking' 
              : 'Horizontal progress tracking'}
          </Text>
        </View>
      </OrientationGrid>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {orientation === 'portrait' 
            ? '📱 Portrait Mode: Vertical Layout' 
            : '🔄 Landscape Mode: Horizontal Layout'}
        </Text>
        <Text style={styles.footerSubtext}>
          Rotate your device to see the layout change! 🔄
        </Text>
      </View>
    </OrientationLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  portraitContainer: {
    flexDirection: 'column',
    padding: 16,
  },
  landscapeContainer: {
    flexDirection: 'row',
    padding: 12,
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
    marginBottom: 20,
    fontSize: 14,
    backgroundColor: '#E5E7EB',
    padding: 8,
    borderRadius: 8,
  },
  grid: {
    flex: 1,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    marginBottom: 8,
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
    marginBottom: 4,
  },
  footerSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
});
