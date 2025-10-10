import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// add: firebase imports
import { AI_SERVICE, auth, db, HUGGINGFACE_API_TOKEN, HUGGINGFACE_API_URL, REPLICATE_API_TOKEN, REPLICATE_API_URL, storage } from '@/config/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const { width, height } = Dimensions.get('window');

// Professional avatar options
const avatarOptions = [
  { id: 'child1', image: require('../../assets/images/avatar_child_1.png'), label: 'Child', category: 'children' },
  { id: 'child2', image: require('../../assets/images/avatar_child_2.png'), label: 'Child', category: 'children' },
  { id: 'child3', image: require('../../assets/images/avatar_child_3.png'), label: 'Child', category: 'children' },
  { id: 'animal1', image: require('../../assets/images/avatar_animal_1.png'), label: 'Dog', category: 'animals' },
  { id: 'animal2', image: require('../../assets/images/avatar_animal_2.png'), label: 'Cat', category: 'animals' },
  { id: 'animal3', image: require('../../assets/images/avatar_animal_3.png'), label: 'Rabbit', category: 'animals' },
  { id: 'character1', image: require('../../assets/images/avatar_hero_1.png'), label: 'Superhero', category: 'hero' },
  { id: 'character2', image: require('../../assets/images/avatar_hero_2.png'), label: 'Superhero', category: 'hero' },
  { id: 'character3', image: require('../../assets/images/avatar_hero_3.png'), label: 'Robot', category: 'hero' },
];

export default function AvatarScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [activeCategory, setActiveCategory] = useState('children');
  const [saving, setSaving] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSaveProfile = async () => {
    if (!name || !age || !selectedAvatar) {
      Alert.alert('Incomplete Profile', 'Please fill in all fields and select an avatar.');
      return;
    }
    
    const parsedAge = parseInt(String(age).trim(), 10);
    if (Number.isNaN(parsedAge) || parsedAge <= 0) {
      Alert.alert('Invalid Age', 'Please enter a valid age.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Not signed in', 'Please log in again.');
      router.replace('/login/login');
      return;
    }

    try {
      setSaving(true);
      
      const profileData: any = {
        name: name.trim(),
        age: parsedAge,
        avatarId: selectedAvatar,
        updatedAt: serverTimestamp(),
      };

      // If generated avatar is selected, save the image URL
      if (selectedAvatar === 'generated' && generatedAvatar) {
        profileData.generatedAvatarUrl = generatedAvatar;
        profileData.platform = Platform.OS; // Track which platform generated the avatar
      }

      await setDoc(
        doc(db, 'users', user.uid),
        {
          childProfile: profileData,
        },
        { merge: true }
      );
    router.replace('/student/dashboard');
    } catch (e: any) {
      const message = e?.message || 'Failed to save profile. Please try again.';
      Alert.alert('Save error', message);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleUploadPhoto = async () => {
    try {
      console.log('📸 Starting photo upload process...');
      
      // Request permission
      console.log('🔐 Requesting media library permissions...');
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('🔐 Permission result:', permissionResult);
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      console.log('📱 Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('📱 Image picker result:', result);

      if (!result.canceled && result.assets[0]) {
        console.log('📸 Image selected, starting upload...');
        await uploadAndGenerateAvatar(result.assets[0].uri);
      } else {
        console.log('❌ No image selected or picker canceled');
      }
    } catch (error) {
      console.error('❌ Error in handleUploadPhoto:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const convertImageToBase64 = async (imageUri: string): Promise<string> => {
    try {
      console.log('🔄 Converting image to base64...');
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          console.log('✅ Base64 conversion successful, length:', base64.length);
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error: any) {
      console.error('❌ Error converting to base64:', error);
      throw new Error(`Failed to convert image: ${error?.message || 'Unknown error'}`);
    }
  };

  const uploadAndGenerateAvatar = async (imageUri: string) => {
    console.log('🚀 Starting uploadAndGenerateAvatar with URI:', imageUri);
    console.log('🌐 Platform:', Platform.OS);
    
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ No authenticated user');
      Alert.alert('Not signed in', 'Please log in again.');
      return;
    }

    console.log('👤 User authenticated:', user.uid);

    try {
      setUploading(true);
      console.log('📤 Setting uploading state to true');
      
      let downloadURL: string;
      
      if (Platform.OS === 'web') {
        console.log('🌐 Web platform detected - converting to base64');
        // For web, convert image to base64 data URL for Replicate API
        downloadURL = await convertImageToBase64(imageUri);
        console.log('🔗 Using base64 data URL');
      } else {
        console.log('📱 Mobile platform detected - uploading to Firebase Storage');
        // Upload image to Firebase Storage for mobile
        console.log('🔥 Creating Firebase Storage reference...');
        const imageRef = ref(storage, `avatars/${user.uid}/${Date.now()}.jpg`);
        console.log('🔥 Storage reference created:', imageRef.fullPath);
        
        console.log('📥 Fetching image blob...');
        const response = await fetch(imageUri);
        console.log('📥 Fetch response status:', response.status);
        
        const blob = await response.blob();
        console.log('📥 Blob created, size:', blob.size, 'bytes');
        
        console.log('⬆️ Uploading to Firebase Storage...');
        await uploadBytes(imageRef, blob);
        console.log('✅ Upload completed successfully');
        
        console.log('🔗 Getting download URL...');
        downloadURL = await getDownloadURL(imageRef);
        console.log('🔗 Download URL obtained:', downloadURL);
      }
      
      // Generate cartoon avatar using Replicate API
      console.log('🎨 Starting cartoon generation...');
      await generateCartoonAvatar(downloadURL);
      
    } catch (error: any) {
      console.error('❌ Error in uploadAndGenerateAvatar:', error);
      console.error('❌ Error details:', {
        message: error?.message || 'Unknown error',
        code: error?.code || 'Unknown code',
        stack: error?.stack || 'No stack trace'
      });
      
      // Check if it's a CORS error
      if (error?.message?.includes('CORS') || error?.message?.includes('XMLHttpRequest')) {
        Alert.alert(
          'CORS Error', 
          'This feature works better on mobile devices. Please try on Android/iOS or use a different browser with CORS disabled.'
        );
      } else if (error?.message?.includes('Failed to fetch') || error?.name === 'AbortError') {
        Alert.alert(
          'Network Error', 
          'Failed to connect to the avatar generation service. Please check your internet connection and try again.'
        );
      } else {
        Alert.alert('Upload Error', `Failed to upload image: ${error?.message || 'Unknown error'}`);
      }
    } finally {
      console.log('🔄 Setting uploading state to false');
      setUploading(false);
    }
  };

  const generateCartoonAvatarWithHuggingFace = async (imageUrl: string) => {
    console.log('🤗 Using Hugging Face AI for cartoon generation');
    
    try {
      // Convert image to base64 for Hugging Face API
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      
      console.log('🤗 Sending request to Hugging Face...');
      
      const hfResponse = await fetch(`${HUGGINGFACE_API_URL}/runwayml/stable-diffusion-v1-5`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            image: base64,
            prompt: "cartoon avatar, cute character, animated style, colorful, friendly",
            negative_prompt: "realistic, photograph, dark, scary",
            num_inference_steps: 20,
            guidance_scale: 7.5
          }
        })
      });
      
      if (!hfResponse.ok) {
        throw new Error(`Hugging Face API error: ${hfResponse.status}`);
      }
      
      const result = await hfResponse.json();
      console.log('🤗 Hugging Face response:', result);
      
      if (result && result.length > 0) {
        // Convert base64 result to data URL
        const cartoonImage = `data:image/jpeg;base64,${result[0]}`;
        setGeneratedAvatar(cartoonImage);
        setSelectedAvatar('generated');
        console.log('✅ Hugging Face cartoon avatar created');
      } else {
        throw new Error('No image generated');
      }
      
    } catch (error: any) {
      console.error('❌ Hugging Face error:', error);
      throw error;
    }
  };

  const generateCartoonAvatarWithReplicate = async (imageUrl: string) => {
    console.log('🤖 Using Replicate AI for cartoon generation');
    
    try {
      // Create prediction
      console.log('🤖 Creating Replicate API prediction...');
      const requestBody = {
        version: "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
        input: {
          input_image: imageUrl,
          prompt: "cartoon avatar, cute character, animated style, colorful, friendly",
          negative_prompt: "realistic, photograph, dark, scary",
          num_steps: 20,
          style_strength_ratio: 20,
          num_outputs: 1,
          guidance_scale: 5,
          seed: -1,
          apply_watermark: false
        }
      };
      
      console.log('🤖 Request body:', JSON.stringify(requestBody, null, 2));
      console.log('🤖 Making API request to:', REPLICATE_API_URL);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(REPLICATE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      console.log('🤖 API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API request failed:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const prediction = await response.json();
      console.log('🤖 Prediction created:', prediction);
      
      // Poll for completion
      console.log('⏳ Starting polling for completion...');
      let result = prediction;
      let pollCount = 0;
      const maxPolls = 60; // 60 seconds max
      
      while (result.status !== 'succeeded' && result.status !== 'failed' && pollCount < maxPolls) {
        pollCount++;
        console.log(`⏳ Poll ${pollCount}/${maxPolls} - Status: ${result.status}`);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusController = new AbortController();
        const statusTimeoutId = setTimeout(() => statusController.abort(), 10000);
        
        const statusResponse = await fetch(`${REPLICATE_API_URL}/${result.id}`, {
          headers: {
            'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          },
          signal: statusController.signal
        });
        
        clearTimeout(statusTimeoutId);
        
        if (!statusResponse.ok) {
          console.error('❌ Status check failed:', statusResponse.status);
          throw new Error(`Status check failed: ${statusResponse.status}`);
        }
        
        result = await statusResponse.json();
        console.log(`⏳ Poll ${pollCount} result:`, result);
      }

      if (pollCount >= maxPolls) {
        throw new Error('Generation timeout - took too long');
      }

      if (result.status === 'succeeded' && result.output && result.output.length > 0) {
        console.log('✅ Generation succeeded! Output:', result.output);
        setGeneratedAvatar(result.output[0]);
        setSelectedAvatar('generated');
        console.log('✅ Avatar set successfully');
      } else {
        console.error('❌ Generation failed:', result);
        throw new Error(`Failed to generate avatar: ${result.error || 'Unknown error'}`);
      }
      
    } catch (error: any) {
      console.error('❌ Replicate API error:', error);
      throw error;
    }
  };

  const generateCartoonAvatar = async (imageUrl: string) => {
    console.log('🎨 Starting generateCartoonAvatar with URL:', imageUrl);
    console.log('🤖 AI Service:', AI_SERVICE);
    
    try {
      setGenerating(true);
      console.log('🎨 Setting generating state to true');
      
      // Route to appropriate AI service
      if (AI_SERVICE === 'huggingface') {
        console.log('🤗 Using Hugging Face AI service');
        await generateCartoonAvatarWithHuggingFace(imageUrl);
      } else if (AI_SERVICE === 'replicate') {
        console.log('🤖 Using Replicate AI service');
        await generateCartoonAvatarWithReplicate(imageUrl);
      } else {
        throw new Error(`Unknown AI service: ${AI_SERVICE}. Please set AI_SERVICE to 'huggingface' or 'replicate'`);
      }
      
    } catch (error: any) {
      console.error('❌ Error in generateCartoonAvatar:', error);
      console.error('❌ Error details:', {
        message: error?.message || 'Unknown error',
        code: error?.code || 'Unknown code',
        stack: error?.stack || 'No stack trace'
      });
      
      Alert.alert('AI Generation Error', `Failed to generate cartoon avatar: ${error?.message || 'Unknown error'}`);
    } finally {
      console.log('🔄 Setting generating state to false');
      setGenerating(false);
    }
  };

  const testFirebaseConnection = async () => {
    console.log('🧪 Testing Firebase Storage connection...');
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('❌ No user authenticated');
        Alert.alert('Test Failed', 'No user authenticated');
        return;
      }
      
      console.log('👤 User:', user.uid);
      console.log('🔥 Storage instance:', storage);
      console.log('🔥 Storage app:', storage.app);
      
      // Test creating a reference
      const testRef = ref(storage, `test/${user.uid}/test.txt`);
      console.log('🔥 Test reference created:', testRef.fullPath);
      
      Alert.alert('Test Success', 'Firebase Storage connection is working!');
    } catch (error: any) {
      console.error('❌ Firebase test failed:', error);
      Alert.alert('Test Failed', `Firebase error: ${error?.message || 'Unknown error'}`);
    }
  };

  const testBasicConnectivity = async () => {
    console.log('🌐 Testing basic internet connectivity...');
    try {
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        mode: 'cors'
      });
      
      console.log('🌐 Connectivity test result:', response.status);
      
      if (response.ok) {
        Alert.alert('Connectivity OK', 'Basic internet connection is working!');
      } else {
        Alert.alert('Connectivity Issue', `HTTP status: ${response.status}`);
      }
    } catch (error: any) {
      console.error('❌ Connectivity test failed:', error);
      Alert.alert('Connectivity Failed', `Cannot reach internet: ${error?.message || 'Unknown error'}`);
    }
  };

  const testReplicateAPI = async () => {
    console.log('🧪 Testing Replicate API connection...');
    try {
      console.log('🤖 API Token:', REPLICATE_API_TOKEN ? 'Present' : 'Missing');
      console.log('🤖 API URL:', REPLICATE_API_URL);
      console.log('🔧 AI Service:', AI_SERVICE);
      
      // Test basic connectivity first
      console.log('🌐 Testing basic connectivity...');
      const connectivityTest = await fetch('https://httpbin.org/get', {
        method: 'GET',
        mode: 'cors'
      });
      console.log('🌐 Connectivity test result:', connectivityTest.status);
      
      if (!connectivityTest.ok) {
        throw new Error('Basic internet connectivity failed');
      }
      
      // Test Replicate API with a simple request
      console.log('🤖 Testing Replicate API...');
      const response = await fetch(REPLICATE_API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        },
        mode: 'cors'
      });
      
      console.log('🤖 Test response status:', response.status);
      console.log('🤖 Test response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        Alert.alert('Test Success', 'Replicate API connection is working!');
      } else {
        const errorText = await response.text();
        console.log('🤖 Error response:', errorText);
        Alert.alert('Test Failed', `API returned status: ${response.status}\nError: ${errorText}`);
      }
    } catch (error: any) {
      console.error('❌ Replicate API test failed:', error);
      
      if (error?.message?.includes('Failed to fetch')) {
        Alert.alert(
          'Network Error', 
          `Cannot connect to Replicate API. Current AI Service: ${AI_SERVICE}.\n\nThis might be due to:\n• Network connectivity issues\n• CORS restrictions in development\n• Firewall blocking the request\n\nTry switching to a different AI service or test on a mobile device.`
        );
      } else {
        Alert.alert('Test Failed', `API error: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const categories = [
    { id: 'children', label: 'Child', color: '#4F46E5' },
      { id: 'animals', label: 'Animal', color: '#059669' },
      { id: 'hero', label: 'Hero', color: '#DC2626' }
  ];

  const filteredAvatars = avatarOptions.filter(avatar => avatar.category === activeCategory);

  return (
    <LinearGradient colors={['#C9D9F8', '#C9D9F8']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Unified Profile Card */}
        <View style={styles.section}>
          {/* Centered Title */}
          <View style={styles.centeredTitleSection}>
            <Text style={styles.title}>Create Your Profile</Text>
            <Text style={styles.subtitle}>Choose Your Superhero Avatar!</Text>
          </View>
          
          {/* Personal Information */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter Your Name Here"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter Your Age Here"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Avatar Selection */}
          <View style={styles.avatarSection}>
            <Text style={styles.avatarSectionTitle}>Pick Your Avatar</Text>
            
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
                  <Image source={avatar.image} style={styles.avatarImage} resizeMode="contain" />
                  <Text style={styles.avatarLabel}>{avatar.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Upload Option */}
            <TouchableOpacity 
              onPress={handleUploadPhoto} 
              style={styles.uploadSection}
              disabled={uploading || generating}
            >
              <Ionicons 
                name={uploading || generating ? "hourglass-outline" : "cloud-upload-outline"} 
                size={20} 
                color="#6B7280" 
              />
              <Text style={styles.uploadText}>
                {uploading ? 'Uploading...' : generating ? 'Generating Avatar...' : 'Upload Photo'}
              </Text>
            </TouchableOpacity>
            
            {/* Generate Avatar Text */}
            <Text style={styles.generateText}>Generate AI Cartoon Avatar</Text>
            {Platform.OS === 'web' && (
              <Text style={styles.platformNote}>
                💡 Note: On web, images are processed directly. For best results, try on mobile!
              </Text>
            )}
            
            {/* Debug Buttons - Remove after testing */}
            <TouchableOpacity 
              onPress={testFirebaseConnection} 
              style={[styles.uploadSection, { backgroundColor: '#FFE4E1', marginTop: 10 }]}
            >
              <Text style={[styles.uploadText, { color: '#DC143C' }]}>🧪 Test Firebase Connection</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={testReplicateAPI} 
              style={[styles.uploadSection, { backgroundColor: '#E1F5FE', marginTop: 5 }]}
            >
              <Text style={[styles.uploadText, { color: '#0277BD' }]}>🤖 Test Replicate API</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={testBasicConnectivity} 
              style={[styles.uploadSection, { backgroundColor: '#F3E5F5', marginTop: 5 }]}
            >
              <Text style={[styles.uploadText, { color: '#7B1FA2' }]}>🌐 Test Internet Connection</Text>
            </TouchableOpacity>
            
            {/* Generated Avatar Display */}
            {generatedAvatar && (
              <View style={styles.generatedAvatarContainer}>
                <Text style={styles.generatedAvatarTitle}>Your Generated Avatar</Text>
                <TouchableOpacity
                  onPress={() => setSelectedAvatar('generated')}
                  style={[
                    styles.generatedAvatarOption,
                    selectedAvatar === 'generated' && styles.selectedGeneratedAvatar
                  ]}
                >
                  <Image 
                    source={{ uri: generatedAvatar }} 
                    style={styles.generatedAvatarImage} 
                    resizeMode="cover" 
                  />
                  <Text style={styles.generatedAvatarLabel}>Generated Avatar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={handleSaveProfile}
          disabled={!name || !age || !selectedAvatar || saving}
          style={[
            styles.saveButton,
            (!name || !age || !selectedAvatar || saving) && styles.disabledButton
          ]}
        >
          <LinearGradient
            colors={(!name || !age || !selectedAvatar || saving) ? ['#D1D5DB', '#9CA3AF'] : ['#0B5ED7', '#0B5ED7']}
            style={styles.saveButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[
              styles.saveButtonText,
              (!name || !age || !selectedAvatar || saving) && styles.disabledButtonText
            ]}>
              {saving ? 'Saving…' : 'Save My Profile'}
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#374151',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    fontWeight: '700',
    color: '#111827',
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
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  categoryTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  activeCategoryTab: {
    borderColor: '#0B5ED7',
    shadowColor: '#0B5ED7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  activeCategoryTabText: {
    color: '#0B5ED7',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarOption: {
    width: (width - 100) / 3,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedAvatarOption: {
    borderColor: '#0B5ED7',
    backgroundColor: '#F8F5FF',
    shadowColor: '#0B5ED7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: '65%',
    height: '65%',
    marginBottom: 6,
    borderRadius: 6,
  },
  avatarEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  avatarLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  uploadSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  generateText: {
    fontSize: 12,
    color: '#111827',
    textAlign: 'center',
    marginTop: 6,
  },
  platformNote: {
    fontSize: 11,
    color: '#059669',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  generatedAvatarContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  generatedAvatarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  generatedAvatarOption: {
    width: (width - 100) / 3,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedGeneratedAvatar: {
    borderColor: '#0B5ED7',
    backgroundColor: '#F8F5FF',
    shadowColor: '#0B5ED7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  generatedAvatarImage: {
    width: '65%',
    height: '65%',
    marginBottom: 6,
    borderRadius: 6,
  },
  generatedAvatarLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 100,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  saveButton: {
    borderRadius: 12,
    shadowColor: '#0B5ED7',
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