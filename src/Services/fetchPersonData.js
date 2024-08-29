import { getAuth } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { db } from './firebase-config';
import { getToken } from './tokenStorage';

export const fetchPersonData = async () => {
  const token = await getToken();
  const auth = getAuth();
  const user = auth.currentUser;

  if (user && token) {
    // Kullanıcı bilgilerini al
    const userRef = ref(db, 'Users/' + user.uid);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      const PersonId = userData.PersonId; // PersonId'yi al

      // Person bilgilerini al
      const Personref = ref(db, 'Persons');
      const PersonSnapshot = await get(Personref);

      if (PersonSnapshot.exists()) {
        const PersonData = PersonSnapshot.val();

        // Persons objesinde PersonId'ye sahip olanı bul
        for (const key in PersonData) {
          if (PersonData[key].PersonId === PersonId) {
            return PersonData[key]; // Eşleşen öğeyi döndür
          }
        }
      }
    }
  }

  return ["kullanici yok"];
};
