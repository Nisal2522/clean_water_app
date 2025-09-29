import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary, uploadMultipleImages, SelectedImage } from '../../config/cloudinary';
import { cartoonifyImage } from '../../config/deepai';

const { width, height } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const itemSize = screenWidth / 4 - 20; // 4n grid with proper spacing

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
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<SelectedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingAll, setIsUploadingAll] = useState(false);
  const [cartoonifiedImage, setCartoonifiedImage] = useState<string | null>(null);
  const [isCartoonifying, setIsCartoonifying] = useState(false);

  // Child-friendly age options (6-10 years)
  const ageOptions = [
    { value: '6', label: '6 years old', emoji: '🧒' },
    { value: '7', label: '7 years old', emoji: '👦' },
    { value: '8', label: '8 years old', emoji: '👧' },
    { value: '9', label: '9 years old', emoji: '🧑' },
    { value: '10', label: '10 years old', emoji: '👨' },
  ];

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

  const handleUploadPhotos = async () => {
    try {
      // Request permission to access photo library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access photo library is required!');
        return;
      }

      // Show action sheet for image source selection
      Alert.alert(
        'Select Photos',
        'Choose how you want to add your photos (up to 4)',
        [
          { text: 'Photo Library', onPress: () => pickImages('library') },
          { text: 'Camera', onPress: () => pickImages('camera') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const pickImages = async (source: 'camera' | 'library') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
        allowsMultipleSelection: true,
        selectionLimit: 4,
      } as any);

      if (!result.canceled && result.assets) {
        const newImages: SelectedImage[] = result.assets.map((asset, index) => ({
          uri: asset.uri,
          name: `photo_${Date.now()}_${index}.jpg`,
          type: 'image/jpeg',
          uploading: false
        }));

        // Limit to 4 images total
        const updatedImages = [...uploadedImages, ...newImages].slice(0, 4);
        setUploadedImages(updatedImages);
        
        if (updatedImages.length > 0) {
          setSelectedAvatar('uploaded'); // Mark as uploaded images
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    
    if (updatedImages.length === 0) {
      setSelectedAvatar(''); // Clear selection if no images
    }
  };

  const uploadAllImages = async () => {
    if (uploadedImages.length === 0) {
      Alert.alert('No Images', 'Please select images first.');
      return;
    }

    setIsUploadingAll(true);
    
    try {
      const updatedImages = await uploadMultipleImages(uploadedImages);
      setUploadedImages(updatedImages);
      
      const successCount = updatedImages.filter(img => img.uploadedUrl).length;
      Alert.alert('Upload Complete', `Successfully uploaded ${successCount} out of ${uploadedImages.length} images.`);
    } catch (error) {
      console.error('Batch upload error:', error);
      Alert.alert('Upload Error', 'Failed to upload some images. Please try again.');
    } finally {
      setIsUploadingAll(false);
    }
  };

  const handleCartoonify = async () => {
    if (uploadedImages.length === 0) {
      Alert.alert('No Images', 'Please select an image first.');
      return;
    }

    // Use the first selected image for cartoonify
    const firstImage = uploadedImages[0];
    if (!firstImage.uri) {
      Alert.alert('No Image', 'Please select a valid image first.');
      return;
    }

    setIsCartoonifying(true);
    setCartoonifiedImage(null);

    try {
      const result = await cartoonifyImage(firstImage.uri);
      
      if (result.success && result.cartoonUrl) {
        setCartoonifiedImage(result.cartoonUrl);
        Alert.alert('Success', 'Your photo has been cartoonified!');
      } else {
        Alert.alert('Cartoonify Failed', result.error || 'Failed to cartoonify image. Please try another photo.');
      }
    } catch (error) {
      console.error('Cartoonify error:', error);
      Alert.alert('Error', 'Failed to cartoonify image. Please try again.');
    } finally {
      setIsCartoonifying(false);
    }
  };

  const handleAgeSelect = (selectedAge: string) => {
    setAge(selectedAge);
    setShowAgeModal(false);
  };

  const getSelectedAgeLabel = () => {
    const selectedAgeOption = ageOptions.find(option => option.value === age);
    return selectedAgeOption ? selectedAgeOption.label : 'Select your age';
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
      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Unified Profile Card */}
        <View style={styles.section}>
          {/* Title with Back Button */}
          <View style={styles.titleSection}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <View style={styles.centeredTitleSection}>
              <Text style={styles.title}>Create Your Profile</Text>
              <Text style={styles.subtitle}>Set up your account to get started</Text>
            </View>
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
            <Text style={styles.label}>How old are you? 👶</Text>
            <TouchableOpacity 
              style={styles.ageSelector}
              onPress={() => setShowAgeModal(true)}
            >
              <Text style={styles.ageSelectorText}>{getSelectedAgeLabel()}</Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
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
            <TouchableOpacity 
              onPress={handleUploadPhotos} 
              style={[styles.uploadSection, uploadedImages.length > 0 && styles.uploadedSection]}
              disabled={isUploading}
            >
              <Ionicons name="camera" size={24} color="#6B7280" />
              <Text style={styles.uploadText}>
                {uploadedImages.length > 0 ? `Upload Photos (${uploadedImages.length}/4)` : 'Upload Photos (up to 4)'}
              </Text>
            </TouchableOpacity>

            {/* Image Preview Grid */}
            {uploadedImages.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                <Text style={styles.previewTitle}>Selected Photos:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGrid}>
                  {uploadedImages.map((image, index) => (
                    <View key={index} style={styles.imagePreviewItem}>
                      <Image source={{ uri: image.uri }} style={styles.previewImage} />
                      {image.uploading && (
                        <View style={styles.uploadingOverlay}>
                          <ActivityIndicator size="small" color="#8B5CF6" />
                        </View>
                      )}
                      {image.uploadedUrl && (
                        <View style={styles.uploadedOverlay}>
                          <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                        </View>
                      )}
                      <TouchableOpacity 
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close-circle" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
                
                {/* Upload All Button */}
                <TouchableOpacity 
                  style={[styles.uploadAllButton, isUploadingAll && styles.uploadingButton]}
                  onPress={uploadAllImages}
                  disabled={isUploadingAll}
                >
                  {isUploadingAll ? (
                    <View style={styles.uploadingContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.uploadingText}>Uploading All...</Text>
                    </View>
                  ) : (
                    <Text style={styles.uploadAllText}>Upload All to Cloudinary</Text>
                  )}
                </TouchableOpacity>

                {/* Cartoonify Button */}
                <TouchableOpacity 
                  style={[styles.cartoonifyButton, isCartoonifying && styles.cartoonifyingButton]}
                  onPress={handleCartoonify}
                  disabled={isCartoonifying}
                >
                  {isCartoonifying ? (
                    <View style={styles.cartoonifyContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.cartoonifyText}>🤖 AI Processing...</Text>
                    </View>
                  ) : (
                    <Text style={styles.cartoonifyText}>🤖 AI Cartoon Avatar</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Original vs Cartoonified Comparison */}
            {(uploadedImages.length > 0 || cartoonifiedImage) && (
              <View style={styles.comparisonContainer}>
                <Text style={styles.comparisonTitle}>🤖 AI Avatar Transformation</Text>
                
                <View style={styles.imageComparison}>
                  {/* Original Image */}
                  <View style={styles.imageSection}>
                    <Text style={styles.imageLabel}>Original Photo</Text>
                    {uploadedImages.length > 0 && (
                      <Image 
                        source={{ uri: uploadedImages[0].uri }} 
                        style={styles.comparisonImage} 
                      />
                    )}
                  </View>

                  {/* Arrow */}
                  <View style={styles.arrowContainer}>
                    <Ionicons name="arrow-forward" size={24} color="#8B5CF6" />
                  </View>

                  {/* Cartoonified Image */}
                  <View style={styles.imageSection}>
                    <Text style={styles.imageLabel}>AI Cartoon Avatar</Text>
                    {cartoonifiedImage ? (
                      <View style={styles.cartoonContainer}>
                        <Image 
                          source={{ uri: cartoonifiedImage }} 
                          style={[styles.comparisonImage, styles.cartoonImage]} 
                        />
                        <View style={styles.cartoonOverlay}>
                          <Text style={styles.cartoonLabel}>🤖</Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                        <Text style={styles.placeholderText}>AI Cartoon will appear here</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
            
            {/* Generate Avatar Text */}
            <Text style={styles.generateText}>Generate your Avatar</Text>
          </View>

          {/* Create Profile Button */}
          <TouchableOpacity 
            onPress={handleSaveProfile}
            disabled={!name || !age || !selectedAvatar}
            style={[
              styles.createProfileButton,
              (!name || !age || !selectedAvatar) && styles.disabledButton
            ]}
          >
            <LinearGradient
              colors={(!name || !age || !selectedAvatar) ? ['#D1D5DB', '#9CA3AF'] : ['#8B5CF6', '#EC4899']}
              style={styles.createProfileButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[
                styles.createProfileButtonText,
                (!name || !age || !selectedAvatar) && styles.disabledButtonText
              ]}>
                Create Profile
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Age Selection Modal */}
      <Modal
        visible={showAgeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAgeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How old are you? 🎂</Text>
            <View style={styles.ageOptionsContainer}>
              {ageOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.ageOption,
                    age === option.value && styles.selectedAgeOption
                  ]}
                  onPress={() => handleAgeSelect(option.value)}
                >
                  <Text style={styles.ageOptionEmoji}>{option.emoji}</Text>
                  <Text style={styles.ageOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAgeModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  centeredTitleSection: {
    alignItems: 'center',
    flex: 1,
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
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  avatarSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
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
    paddingVertical: 14,
    fontSize: 16,
    color: '#000000',
    minHeight: 50,
  },
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 15,
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
    justifyContent: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  avatarOption: {
    width: itemSize,
    height: itemSize,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    margin: 5,
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
    fontSize: 24,
    marginBottom: 4,
  },
  avatarLabel: {
    fontSize: 10,
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
    minHeight: 60,
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
  createProfileButton: {
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 56,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  createProfileButtonGradient: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  createProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  ageSelector: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  ageSelectorText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  uploadedSection: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
    borderWidth: 2,
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadingText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  uploadedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadedImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  uploadedText: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '500',
  },
  imagePreviewContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  imageGrid: {
    marginBottom: 12,
  },
  imagePreviewItem: {
    position: 'relative',
    marginRight: 12,
    width: 100,
    height: 100,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  uploadAllButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  uploadingButton: {
    backgroundColor: '#9CA3AF',
  },
  uploadAllText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cartoonifyButton: {
    backgroundColor: '#EC4899',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 50,
    justifyContent: 'center',
  },
  cartoonifyingButton: {
    backgroundColor: '#9CA3AF',
  },
  cartoonifyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cartoonifyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  comparisonContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 200,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  imageComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  imageSection: {
    flex: 1,
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  comparisonImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
  },
  arrowContainer: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  cartoonContainer: {
    position: 'relative',
  },
  cartoonImage: {
    borderWidth: 3,
    borderColor: '#EC4899',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cartoonOverlay: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EC4899',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cartoonLabel: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxWidth: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  ageOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ageOption: {
    width: 80,
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedAgeOption: {
    borderColor: '#EC4899',
    backgroundColor: '#FDF2F8',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ageOptionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  ageOptionText: {
    fontSize: 10,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#EC4899',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
