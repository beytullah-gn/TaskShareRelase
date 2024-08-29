import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set,update,push } from 'firebase/database';
import { saveToken } from '../Services/tokenStorage';

const auth = getAuth();
const db = getDatabase();

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken(); // Token'ı al
    saveToken(token);

    // Token'ı Realtime Database'de saklamak için ayrı bir işlem başlatın
    setTimeout(async () => {
      const userRef = ref(db, `Users/${user.uid}/AuthToken`);
      await set(userRef, { token });
    }, 0);

    return { user, token };
  } catch (error) {
    throw new Error(error.message);
  }
};
