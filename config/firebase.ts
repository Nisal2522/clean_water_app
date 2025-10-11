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
export const REPLICATE_API_TOKEN = 'r8_SnPa1WRjXIVw9QIQ17VDSb7znUHjzQd2hqvVJ';
export const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

// CORS Proxy for development (web only)
export const CORS_PROXY = 'https://corsproxy.io/?';
export const USE_CORS_PROXY = true; // Set to false for production

// Replicate Model Configurations
export const REPLICATE_AVATAR_MODEL = "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4";

// Service Selection - Only using Replicate now
export const AI_SERVICE = 'replicate';

