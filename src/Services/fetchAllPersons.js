import { db } from './firebase-config'; // Firebase yapılandırma dosyasını içe aktar
import { ref, get } from 'firebase/database'; // Firebase database fonksiyonlarını içe aktar

const fetchAllPersons = async () => {
  const personsRef = ref(db, 'Persons'); // Persons düğümüne referans oluştur
  try {
    const snapshot = await get(personsRef); // Verileri çek
    const data = snapshot.val(); // Verileri al
    if (data) {
      const personsArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key] // Her bir kişiyi id ve verileriyle birlikte diziye ekle
      }));
      return personsArray; // Verileri dizi olarak döndür
    } else {
      return []; // Veri yoksa boş dizi döndür
    }
  } catch (error) {
    console.error("Error fetching persons: ", error); // Hata durumunda konsola yazdır
    return []; // Hata durumunda boş dizi döndür
  }
};

export default fetchAllPersons; // Fonksiyonu dışa aktar
