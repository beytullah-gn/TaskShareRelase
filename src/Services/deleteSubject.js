import { ref, remove } from 'firebase/database';
import { db } from "../Services/firebase-config"; // Bu yolu güncel konumunuza göre değiştirin

export const deleteSubject = async (id) => {
  try {
    // ID'ye sahip konu için referansı al
    const subjectRef = ref(db, `DepartmentSubjects/${id}`);
    
    // Veriyi sil
    await remove(subjectRef);
    
    console.log('Konu başarıyla silindi.');
  } catch (error) {
    console.error('Konu silinirken bir hata oluştu:', error);
  }
};

