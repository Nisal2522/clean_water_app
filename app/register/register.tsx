import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width, height } = Dimensions.get('window');

// Responsive dimensions - Optimized for Samsung A04 and small screens
const isSmallScreen = height < 600;
const isMediumScreen = height >= 600 && height < 700;
const isLargeScreen = height >= 700;

// Responsive sizes - Optimized for Samsung A04
const titleFontSize = isSmallScreen ? 16 : isMediumScreen ? 18 : 20;
const subtitleFontSize = isSmallScreen ? 11 : isMediumScreen ? 12 : 13;
const inputFontSize = isSmallScreen ? 13 : isMediumScreen ? 14 : 15;

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Here you would typically make an API call to register the user
    Alert.alert('Success', 'Registration successful!', [
      { text: 'OK', onPress: () => router.push('/login/login') }
    ]);
  };

  const handleBackToLogin = () => {
    router.push('/login/login');
  };

  return (
    <LinearGradient
      colors={['#faf5ff', '#fce7f3']}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      {/* Status Bar Space */}
      <View style={styles.statusBar} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
          <IconSymbol name="chevron.left" size={20} color="#8b5cf6" />
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.contentWrapper}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={[styles.title, { fontSize: titleFontSize }]}>
              Join the <Text style={styles.titleAccent}>Hero Squad!</Text>
            </Text>
            <Text style={[styles.subtitle, { fontSize: subtitleFontSize }]}>
              Create your account to start your hygiene adventure
            </Text>
          </View>

          {/* Register Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Create Account</Text>
              <Text style={styles.cardDescription}>
                Fill in your details to become a Hygiene Hero
              </Text>
            </View>
            
            <View style={styles.cardContent}>
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <IconSymbol name="person" size={16} color="#8b5cf6" />
                  <Text style={styles.label}>Username</Text>
                </View>
                <TextInput
                  style={[styles.textInput, { fontSize: inputFontSize }]}
                  placeholder="Choose a hero name"
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <IconSymbol name="envelope" size={16} color="#ec4899" />
                  <Text style={styles.label}>Email</Text>
                </View>
                <TextInput
                  style={[styles.textInput, { fontSize: inputFontSize }]}
                  placeholder="hero@example.com"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <IconSymbol name="lock" size={16} color="#8b5cf6" />
                  <Text style={styles.label}>Password</Text>
                </View>
                <TextInput
                  style={[styles.textInput, { fontSize: inputFontSize }]}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <IconSymbol name="lock" size={16} color="#ec4899" />
                  <Text style={styles.label}>Confirm Password</Text>
                </View>
                <TextInput
                  style={[styles.textInput, { fontSize: inputFontSize }]}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Register Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <LinearGradient
            colors={['#8b5cf6', '#ec4899']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Create My Hero Account!</Text>
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
  header: {
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 8 : 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    color: '#8b5cf6',
    marginLeft: 6,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingTop: isSmallScreen ? 12 : 20,
  },
  contentWrapper: {
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? 12 : 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: isSmallScreen ? 4 : 6,
  },
  titleAccent: {
    color: '#ec4899',
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 18 : 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0,
  },
  cardHeader: {
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingTop: isSmallScreen ? 12 : 16,
    paddingBottom: isSmallScreen ? 6 : 8,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: isSmallScreen ? 12 : 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  cardContent: {
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingBottom: isSmallScreen ? 12 : 16,
  },
  inputContainer: {
    marginBottom: isSmallScreen ? 12 : 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: isSmallScreen ? 10 : 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonContainer: {
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingBottom: isSmallScreen ? 40 : 60,
  },
  registerButton: {
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
