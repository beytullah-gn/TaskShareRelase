import { db } from './firebase-config';
import { ref, onValue } from 'firebase/database';

const fetchDepartmentSubjectsById = (departmentId, callback) => {
  const departmentSubjectsRef = ref(db, 'DepartmentSubjects');

  const handleValueChange = async (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const filteredSubjects = Object.keys(data)
        .filter(key => data[key].DepartmentId === departmentId)
        .map(key => ({ id: key, ...data[key] }));
      // Optionally, you can sort or process the filteredSubjects array here

      callback(filteredSubjects);
    } else {
      callback([]);
    }
  };

  const unsubscribe = onValue(departmentSubjectsRef, handleValueChange);
  return unsubscribe;
};

export default fetchDepartmentSubjectsById;
