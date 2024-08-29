import { db } from './firebase-config'; 
import { ref, update } from 'firebase/database';

const editSubjectById = async (id, newTitle) => {
  try {

    const subjectRef = ref(db, `DepartmentSubjects/${id}`);
    

    const updates = {
      Title: newTitle
    };

    await update(subjectRef, updates);

    console.log(`Başlık başarıyla güncellendi: ${newTitle}`);
  } catch (error) {
    console.error('Başlık güncellenirken bir hata oluştu:', error);
  }
};

export default editSubjectById;
