import { db } from './firebase-config';
import { ref, get } from 'firebase/database';

const fetchDepartments = async () => {
  const departmentsRef = ref(db, 'Departments');
  try {
    const snapshot = await get(departmentsRef);
    const data = snapshot.val();
    if (data) {
      const departmentsArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })).filter(department => department.Active); // Filter to include only active departments
      return departmentsArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching departments: ", error);
    return [];
  }
};

export default fetchDepartments;
