import { useResponsive } from '@/hooks/use-responsive';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OrientationGrid, OrientationLayout } from './orientation-layout';

export function MobileOrientationExample() {
  const { orientation, screenWidth, screenHeight, isMobile } = useResponsive();

  return (
    <OrientationLayout
      style={styles.container}
      portraitStyle={styles.portraitStyle}
      landscapeStyle={styles.landscapeStyle}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          📱 Mobile Orientation Detection
        </Text>
        <Text style={styles.subtitle}>
          Current: {orientation} | {screenWidth}x{screenHeight}
        </Text>
      </View>

      {/* Content Grid */}
      <OrientationGrid
        portraitColumns={1}
        landscapeColumns={2}
        gap={16}
        style={styles.contentGrid}
      >
        {/* Portrait Content */}
        {orientation === 'portrait' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📱 Portrait Mode</Text>
              <Text style={styles.cardText}>
                Vertical layout optimized for mobile phones. 
                Content stacks vertically for easy scrolling.
              </Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🎮 Games</Text>
              <Text style={styles.cardText}>
                Full-width game cards with large touch targets.
                Perfect for one-handed mobile use.
              </Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📚 Lessons</Text>
              <Text style={styles.cardText}>
                Vertical lesson cards with clear typography.
                Easy to read on mobile screens.
              </Text>
            </View>
          </>
        )}

        {/* Landscape Content */}
        {orientation === 'landscape' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🔄 Landscape Mode</Text>
              <Text style={styles.cardText}>
                Horizontal layout with side-by-side content.
                Maximizes screen width for better viewing.
              </Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🎮 Games</Text>
              <Text style={styles.cardText}>
                Compact game cards in a grid layout.
                More content visible at once.
              </Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📚 Lessons</Text>
              <Text style={styles.cardText}>
                Side-by-side lesson cards.
                Better for tablets and landscape phones.
              </Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>❓ Challenges</Text>
              <Text style={styles.cardText}>
                Horizontal challenge layout.
                More efficient use of screen space.
              </Text>
            </View>
          </>
        )}
      </OrientationGrid>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {orientation === 'portrait' 
            ? '📱 Rotate your device to see landscape mode!' 
            : '🔄 Rotate back to see portrait mode!'}
        </Text>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            {orientation === 'portrait' 
              ? 'Try Landscape Mode' 
              : 'Try Portrait Mode'}
          </Text>
        </TouchableOpacity>
      </View>
    </OrientationLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  portraitStyle: {
    flexDirection: 'column',
    padding: 16,
  },
  landscapeStyle: {
    flexDirection: 'row',
    padding: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  contentGrid: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
});
