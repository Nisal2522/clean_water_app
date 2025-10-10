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

const firebaseConfig = {
  apiKey: "AIzaSyClVKFpjid-dCfw4Oqx-0A2rY_NUFtJPgc",
  authDomain: "gameproject-f345b.firebaseapp.com",
  projectId: "gameproject-f345b",
  storageBucket: "gameproject-f345b.firebasestorage.app",
  messagingSenderId: "793337624143",
  appId: "1:793337624143:web:e4d42cffcb1559971a5c3a",
  measurementId: "G-WZBHSNWN1J"
};

// const firebaseConfig: FirebaseConfig = {
//   apiKey: extra.firebase?.apiKey ?? "AIzaSyClVKFpjid-dCfw4Oqx-0A2rY_NUFtJPgc",
//   authDomain: extra.firebase?.authDomain ?? "gameproject-f345b.firebaseapp.com",
//   projectId: extra.firebase?.projectId ?? "gameproject-f345b",
//   storageBucket: extra.firebase?.storageBucket ?? "gameproject-f345b.firebasestorage.app",
//   messagingSenderId: extra.firebase?.messagingSenderId ?? "793337624143",
//   appId: extra.firebase?.appId ?? "1:793337624143:web:e4d42cffcb1559971a5c3a"
// };
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
