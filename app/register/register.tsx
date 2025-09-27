import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width, height } = Dimensions.get('window');

// Responsive dimensions - Better for Samsung A04 and small screens
const isSmallScreen = height < 650;
const isMediumScreen = height >= 650 && height < 750;
const isLargeScreen = height >= 750;

// Responsive sizes - Optimized for smaller screens
const titleFontSize = isSmallScreen ? 18 : isMediumScreen ? 20 : 22;
const subtitleFontSize = isSmallScreen ? 12 : isMediumScreen ? 13 : 14;
const inputFontSize = isSmallScreen ? 14 : isMediumScreen ? 15 : 16;

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
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
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: titleFontSize }]}>Create Account</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.contentWrapper}>
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <IconSymbol name="person.badge.plus" size={32} color="white" />
            </View>
          </View>

          {/* Title */}
          <Text style={[styles.title, { fontSize: titleFontSize }]}>
            Join <Text style={styles.titleAccent}>Hygiene Heroes!</Text>
          </Text>
          
          <Text style={[styles.subtitle, { fontSize: subtitleFontSize }]}>
            Create your account to start your hygiene journey and become a superhero!
          </Text>

          {/* Registration Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={[styles.textInput, { fontSize: inputFontSize }]}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.textInput, { fontSize: inputFontSize }]}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.textInput, { fontSize: inputFontSize }]}
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
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

      {/* Register Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <LinearGradient
            colors={['#8b5cf6', '#ec4899']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={handleBackToLogin}>
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkAccent}>Sign In</Text>
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: isSmallScreen ? 12 : 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingTop: isSmallScreen ? 20 : 30,
  },
  contentWrapper: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: isSmallScreen ? 20 : 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: isSmallScreen ? 8 : 12,
  },
  titleAccent: {
    color: '#ec4899',
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 18 : 20,
    marginBottom: isSmallScreen ? 24 : 32,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: isSmallScreen ? 16 : 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: isSmallScreen ? 12 : 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingBottom: isSmallScreen ? 60 : 80,
  },
  registerButton: {
    width: '100%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
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
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLinkAccent: {
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
});
