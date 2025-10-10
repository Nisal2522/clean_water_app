import Constants from 'expo-constants';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as { firebase?: Partial<FirebaseConfig> };

const firebaseConfig: FirebaseConfig = {
  apiKey: extra.firebase?.apiKey ?? '',
  authDomain: extra.firebase?.authDomain ?? '',
  projectId: extra.firebase?.projectId ?? '',
  storageBucket: extra.firebase?.storageBucket ?? '',
  messagingSenderId: extra.firebase?.messagingSenderId ?? '',
  appId: extra.firebase?.appId ?? '',
};
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth with React Native AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);

// AI Service Configuration
export const REPLICATE_API_TOKEN = 'your_replicate_token_here';
export const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

// Alternative AI Services
export const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
export const HUGGINGFACE_API_TOKEN = 'your_huggingface_token_here'; // You'll need to get this from Hugging Face

// Service Selection
export const AI_SERVICE = 'huggingface'; // Options: 'replicate', 'huggingface'
