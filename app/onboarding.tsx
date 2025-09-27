import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Responsive dimensions
const isSmallScreen = height < 700;
const isMediumScreen = height >= 700 && height < 800;
const isLargeScreen = height >= 800;

// Responsive sizes
const imageSize = isSmallScreen ? 140 : isMediumScreen ? 160 : 192;
const titleFontSize = isSmallScreen ? 20 : isMediumScreen ? 22 : 24;
const subtitleFontSize = isSmallScreen ? 14 : isMediumScreen ? 15 : 16;

export default function OnboardingScreen1() {
  const handleNext = () => {
    router.push('/onboarding-2');
  };

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
                    source={require('@/assets/images/handwash1.jpeg')}
                    style={[styles.heroImage, { borderRadius: (imageSize - 16) / 2 }]}
                    resizeMode="cover"
                  />
                </View>
            {/* Decorative elements */}
            <View style={styles.decorativeElement1} />
            <View style={styles.decorativeElement2} />
          </View>

          {/* Content */}
          <View style={styles.textContainer}>
                <Text style={[styles.title, { fontSize: titleFontSize }]}>
                  Welcome to <Text style={styles.titleAccent}>Hygiene Heroes!</Text>
                </Text>
                
                <Text style={[styles.subtitle, { fontSize: subtitleFontSize }]}>
                  Join our amazing adventure to learn about staying clean and healthy! 
                  Become a superhero by practicing good hygiene habits every day.
                </Text>

            {/* Progress indicators */}
            <View style={styles.progressContainer}>
              <View style={styles.progressDot} />
              <View style={styles.progressDotInactive} />
              <View style={styles.progressDotInactive} />
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
            <Text style={styles.buttonText}>Let's Start the Adventure! →</Text>
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
    marginBottom: isSmallScreen ? 16 : 24,
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
    top: -4,
    right: -4,
    width: 32,
    height: 32,
    backgroundColor: '#fbbf24',
    borderRadius: 16,
  },
  decorativeElement2: {
    position: 'absolute',
    bottom: -8,
    left: -8,
    width: 24,
    height: 24,
    backgroundColor: '#f472b6',
    borderRadius: 12,
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
    marginBottom: isSmallScreen ? 12 : 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
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
