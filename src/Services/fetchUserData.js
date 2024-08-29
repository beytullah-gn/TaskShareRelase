import { getAuth } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { db } from './firebase-config';
import { getData } from './tokenStorage';

export const fetchUserData = async () => {
  const asyncToken = await getData();
  const auth = getAuth();
  const user = auth.currentUser;
  const firebaseToken = await user.getIdToken();

  if (user && asyncToken) {
    if(firebaseToken){
      const userRef = ref(db, 'Users/' + user.uid);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        return {
          ...userData,
          id: user.uid, // Kullanıcının eşsiz ID'sini ekleyin
        };
      }
    }
  }
 
  return null;
};