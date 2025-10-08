import { signUp } from '@/config/auth';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const isSmallScreen = height < 600;
const isMediumScreen = height >= 600 && height < 700;
const isLargeScreen = height >= 700;

const titleFontSize = 28;
const subtitleFontSize = 16;
const inputFontSize = 15;

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async () => {
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

    try {
      setLoading(true);
      await signUp(formData.email, formData.password, formData.username);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Registered successfully', ToastAndroid.SHORT);
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/child_profile/child_profile');
      }, 1200);
    } catch (e: any) {
      const message = e?.message || 'Registration failed. Please try again.';
      Alert.alert('Sign up error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image source={require('@/assets/images/logo2.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appTitle}>Hygiene Heroes</Text>
        <Text style={styles.appSubtitle}>Keep clean, stay healthy!</Text>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Welcome To Hygiene Heroes</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.textInput, { fontSize: inputFontSize }]}
              placeholder="Enter your name here"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.textInput, { fontSize: inputFontSize }]}
              placeholder="Enter your email here"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.textInput, { fontSize: inputFontSize }]}
              placeholder="Enter your password here"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.textInput, { fontSize: inputFontSize }]}
              placeholder="Confirm your password here"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry
              placeholderTextColor="#9ca3af"
            />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
            <Text style={styles.registerButtonText}>{loading ? 'Registering…' : 'Register'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBackToLogin} style={styles.loginLinkContainer}>
            <Text style={styles.loginLink}>Already have account? Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C9D9F8',
    alignItems: 'center',
  },
  scroll: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
  appTitle: {
    fontSize: titleFontSize,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: subtitleFontSize,
    color: '#374151',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  registerButton: {
    marginTop: 8,
    backgroundColor: '#0B5ED7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  loginLinkContainer: {
    marginTop: 14,
    alignItems: 'center',
  },
  loginLink: {
    color: '#0B5ED7',
    fontSize: 14,
    fontWeight: '600',
  },
});