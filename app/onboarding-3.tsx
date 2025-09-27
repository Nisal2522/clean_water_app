import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width, height } = Dimensions.get('window');

// Responsive dimensions
const isSmallScreen = height < 700;
const isMediumScreen = height >= 700 && height < 800;
const isLargeScreen = height >= 800;

// Responsive sizes
const imageSize = isSmallScreen ? 120 : isMediumScreen ? 140 : 160;
const titleFontSize = isSmallScreen ? 20 : isMediumScreen ? 22 : 24;
const subtitleFontSize = isSmallScreen ? 14 : isMediumScreen ? 15 : 16;
const powerFontSize = isSmallScreen ? 13 : isMediumScreen ? 14 : 16;

export default function OnboardingScreen3() {
  const handleNext = () => {
    router.push('/login/login');
  };

  const powers = [
    { icon: "🛡️", text: "Protection from germs", color: "#3b82f6" },
    { icon: "❤️", text: "Healthy body & mind", color: "#ef4444" },
    { icon: "⭐", text: "Confidence & happiness", color: "#f59e0b" }
  ];

  return (
    <LinearGradient
      colors={['#faf5ff', '#fce7f3']}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      {/* Status Bar Space */}
      <View style={styles.statusBar} />
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.contentWrapper}>
          {/* Hero Image */}
          <View style={styles.imageContainer}>
            <View style={[styles.imageWrapper, { width: imageSize, height: imageSize, borderRadius: imageSize / 2 }]}>
              <Image
                source={require('@/assets/images/child.jpeg')}
                style={[styles.heroImage, { borderRadius: (imageSize - 16) / 2 }]}
                resizeMode="cover"
              />
            </View>
            {/* Decorative elements */}
            <View style={styles.decorativeElement1}>
              <IconSymbol size={16} name="star.fill" color="white" />
            </View>
            <View style={styles.decorativeElement2}>
              <IconSymbol size={12} name="heart.fill" color="white" />
            </View>
          </View>

          {/* Content */}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { fontSize: titleFontSize }]}>
              You're a <Text style={styles.titleAccent}>Hygiene Hero!</Text>
            </Text>
            
            <Text style={[styles.subtitle, { fontSize: subtitleFontSize }]}>
              Congratulations! You now have all the knowledge to become a true Hygiene Hero. 
              Use your new superpowers to stay healthy and help others too!
            </Text>

            {/* Powers List */}
            <View style={styles.powersContainer}>
              {powers.map((power, index) => (
                <View key={index} style={styles.powerItem}>
                  <View style={[styles.powerIcon, { backgroundColor: power.color }]}>
                    <Text style={styles.powerIconText}>{power.icon}</Text>
                  </View>
                      <Text style={[styles.powerText, { fontSize: powerFontSize }]}>{power.text}</Text>
                </View>
              ))}
            </View>

            {/* Progress indicators */}
            <View style={styles.progressContainer}>
              <View style={styles.progressDotInactive} />
              <View style={styles.progressDotInactive} />
              <View style={styles.progressDot} />
            </View>
          </View>
        </View>
      </View>

      {/* Next Button - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <LinearGradient
            colors={['#8b5cf6', '#ec4899']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Start My Hero Journey! →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    minHeight: height,
  },
  statusBar: {
    height: 48,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: isSmallScreen ? 20 : 24,
    paddingTop: isSmallScreen ? 40 : 60,
    paddingBottom: isSmallScreen ? 20 : 32,
  },
  contentWrapper: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: isSmallScreen ? 16 : 20,
  },
  imageWrapper: {
    backgroundColor: '#8b5cf6',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  decorativeElement1: {
    position: 'absolute',
    top: -8,
    right: -4,
    width: 32,
    height: 32,
    backgroundColor: '#fbbf24',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeElement2: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    width: 28,
    height: 28,
    backgroundColor: '#ef4444',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 4 : 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 26 : isMediumScreen ? 28 : 32,
    marginBottom: isSmallScreen ? 12 : 16,
  },
  titleAccent: {
    color: '#ec4899',
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 20 : isMediumScreen ? 22 : 24,
    marginBottom: isSmallScreen ? 16 : 20,
  },
  powersContainer: {
    width: '100%',
    marginBottom: isSmallScreen ? 16 : 20,
  },
  powerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: isSmallScreen ? 10 : 12,
    paddingVertical: isSmallScreen ? 8 : 10,
    borderRadius: 8,
    marginBottom: isSmallScreen ? 6 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  powerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  powerIconText: {
    fontSize: 16,
  },
  powerText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  progressDotInactive: {
    width: 8,
    height: 8,
    backgroundColor: '#d1d5db',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: isSmallScreen ? 20 : 24,
    paddingBottom: isSmallScreen ? 80 : 120,
  },
  button: {
    width: '100%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
