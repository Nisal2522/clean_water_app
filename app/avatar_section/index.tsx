import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Professional avatar options
const avatarOptions = [
  { id: 'child1', emoji: '👦', label: 'Child', category: 'children' },
  { id: 'child2', emoji: '👧', label: 'Child', category: 'children' },
  { id: 'child3', emoji: '🧒', label: 'Child', category: 'children' },
  { id: 'animal1', emoji: '🐶', label: 'Dog', category: 'animals' },
  { id: 'animal2', emoji: '🐱', label: 'Cat', category: 'animals' },
  { id: 'animal3', emoji: '🐰', label: 'Rabbit', category: 'animals' },
  { id: 'character1', emoji: '🦸‍♂️', label: 'Superhero', category: 'characters' },
  { id: 'character2', emoji: '🦸‍♀️', label: 'Superhero', category: 'characters' },
  { id: 'character3', emoji: '🤖', label: 'Robot', category: 'characters' },
];

export default function AvatarScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [activeCategory, setActiveCategory] = useState('children');

  const handleSaveProfile = () => {
    if (!name || !age || !selectedAvatar) {
      Alert.alert('Incomplete Profile', 'Please fill in all fields and select an avatar.');
      return;
    }
    
    const profile = { name, age, avatar: selectedAvatar };
    console.log('Profile created:', profile);
    router.replace('/(tabs)');
  };

  const handleBack = () => {
    router.back();
  };

  const handleUploadPhoto = () => {
    Alert.alert('Photo Upload', 'Photo upload feature will be available soon.');
  };

  const categories = [
    { id: 'children', label: 'Children', color: '#4F46E5' },
    { id: 'animals', label: 'Animals', color: '#059669' },
    { id: 'characters', label: 'Characters', color: '#DC2626' }
  ];

  const filteredAvatars = avatarOptions.filter(avatar => avatar.category === activeCategory);

  return (
    <LinearGradient
      colors={['#FCE7F3', '#FBCFE8', '#F9A8D4']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Unified Profile Card */}
        <View style={styles.section}>
          {/* Centered Title */}
          <View style={styles.centeredTitleSection}>
            <Text style={styles.title}>Create Your Profile</Text>
            <Text style={styles.subtitle}>Set up your account to get started</Text>
          </View>
          
          {/* Personal Information */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
                  value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
                  value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Avatar Selection */}
          <View style={styles.avatarSection}>
            <Text style={styles.avatarSectionTitle}>Choose Your Avatar</Text>
            
              {/* Category Tabs */}
            <View style={styles.categoryTabs}>
                {categories.map((category) => (
                <TouchableOpacity
                    key={category.id}
                  onPress={() => setActiveCategory(category.id)}
                  style={[
                    styles.categoryTab,
                    activeCategory === category.id && styles.activeCategoryTab
                  ]}
                >
                  <Text style={[
                    styles.categoryTabText,
                    activeCategory === category.id && styles.activeCategoryTabText
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
                ))}
            </View>

              {/* Avatar Grid */}
            <View style={styles.avatarGrid}>
                {filteredAvatars.map((avatar) => (
                <TouchableOpacity
                    key={avatar.id}
                  onPress={() => setSelectedAvatar(avatar.id)}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar.id && styles.selectedAvatarOption
                  ]}
                >
                  <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                  <Text style={styles.avatarLabel}>{avatar.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Upload Option */}
            <TouchableOpacity onPress={handleUploadPhoto} style={styles.uploadSection}>
              <Ionicons name="camera" size={24} color="#6B7280" />
              <Text style={styles.uploadText}>Upload Photo</Text>
            </TouchableOpacity>
            
            {/* Generate Avatar Text */}
            <Text style={styles.generateText}>Generate your Avatar</Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={handleSaveProfile}
          disabled={!name || !age || !selectedAvatar}
          style={[
            styles.saveButton,
            (!name || !age || !selectedAvatar) && styles.disabledButton
          ]}
        >
          <LinearGradient
            colors={(!name || !age || !selectedAvatar) ? ['#D1D5DB', '#9CA3AF'] : ['#8B5CF6', '#EC4899']}
            style={styles.saveButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[
              styles.saveButtonText,
              (!name || !age || !selectedAvatar) && styles.disabledButtonText
            ]}>
              Create Profile
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  centeredTitleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  avatarSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeCategoryTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    opacity: 0.7,
  },
  activeCategoryTabText: {
    color: '#000000',
    opacity: 1,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarOption: {
    width: (width - 80) / 3,
    aspectRatio: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedAvatarOption: {
    borderColor: '#EC4899',
    backgroundColor: '#FDF2F8',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  avatarLabel: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
  },
  uploadSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
    borderWidth: 2,
    borderColor: '#E9D5FF',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  generateText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 100,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButton: {
    borderRadius: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
});