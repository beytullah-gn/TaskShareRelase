import { db } from './firebase-config'; // Firebase yapılandırma dosyasını içe aktar
import { ref, get } from 'firebase/database'; // Firebase database fonksiyonlarını içe aktar

const fetchPersonById = async (personId) => {
  const personRef = ref(db, `Persons/${personId}`); // Belirli bir kişi için referans oluştur
  try {
    const snapshot = await get(personRef); // Verileri çek
    const data = snapshot.val(); // Verileri al
    if (data) {
      return { id: personId, ...data }; // Verileri id ile birlikte döndür
    } else {
      return null; // Veri yoksa null döndür
    }
  } catch (error) {
    console.error("Error fetching person: ", error); // Hata durumunda konsola yazdır
    return null; // Hata durumunda null döndür
  }
};

export default fetchPersonById;// Fonksiyonu dışa aktar
