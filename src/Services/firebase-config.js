import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import Constants from 'expo-constants';


const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.apiKey,
  authDomain: Constants.expoConfig.extra.authDomain,
  databaseURL: Constants.expoConfig.extra.databaseURL,
  projectId: Constants.expoConfig.extra.projectId,
  storageBucket: Constants.expoConfig.extra.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
  appId: Constants.expoConfig.extra.appId,
  measurementId: Constants.expoConfig.extra.measurementId
};

// Firebase'i başlatın
const app = firebase.apps.length ? firebase.app() : initializeApp(firebaseConfig);

// AsyncStorage ile birlikte Firebase Auth'u başlatın
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Veritabanı ve Depolama referanslarını alın
const db = getDatabase(app);
const storage = getStorage(app);

export { db, storage, auth, firebase };
