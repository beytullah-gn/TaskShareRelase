import { db } from './firebase-config'; // Firebase yapılandırma dosyasını içe aktar
import { ref, get } from 'firebase/database'; // Firebase database fonksiyonlarını içe aktar

const fetchDepartmentById = async (departmentId) => {
  const departmentRef = ref(db, `Departments/${departmentId}`); 
  try {
    const snapshot = await get(departmentRef); 
    const data = snapshot.val(); 
    if (data) {
      return { id: departmentId, ...data }; 
    } else {
      return null; 
    }
  } catch (error) {
    console.error("Error fetching Department: ", error); 
    return null; 
  }
};

export default fetchDepartmentById;
