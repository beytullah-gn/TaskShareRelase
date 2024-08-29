import { ref, set, push } from 'firebase/database';
import { db } from './firebase-config';  // Firebase yapılandırma dosyanızdan import edin

const addNewSubject = async (title, departmentId) => {
    try {
        // Yeni konu oluştur
        const subjectsRef = ref(db, 'DepartmentSubjects');
        const newSubjectRef = push(subjectsRef);

        await set(newSubjectRef, {
            Title: title,
            DepartmentId: departmentId
        });

        console.log('Yeni konu başarıyla eklendi.');
    } catch (error) {
        console.error('Yeni konu eklenirken hata:', error);
    }
};

export default addNewSubject;
