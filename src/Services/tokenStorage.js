import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';
import { jwtDecode } from 'jwt-decode';

// Token'ı sakla
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error('Token saklama hatası:', error);
  }
};

// Token'ı al
export const getToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const asyncToken = await AsyncStorage.getItem('userToken');
  if (user) {
    const token = await user.getIdToken();
    const decodedToken = jwtDecode(token);
    console.log('Firebase Auth Token ==>:',token,"\n" ,"AsyncStorage token =======>:",decodedToken);
    return token;
  } else {
    console.log('No user is signed in.');
    return null;
  }
};

// Token'ı sil
export const removeToken = async () => {

  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.error('Token silme hatası:', error);
  }
};


export const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('userToken');
    console.log("AsyncStorage token =============>",value);
    if (value !== null) {
      return value;
      
    }
  } catch (e) {
    // error reading value
  }
};