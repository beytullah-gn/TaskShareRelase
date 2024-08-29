import { ref, get } from 'firebase/database';
import { db } from './firebase-config';

export const fetchDepartmentEmployeeDataByPersonId = async (PersonId) => {
  if (!PersonId) {
    throw new Error("PersonId parametresi gereklidir.");
  }

  // Tüm Persons verilerini al
  const personsRef = ref(db, 'Persons');
  const personsSnapshot = await get(personsRef);

  if (personsSnapshot.exists()) {
    const personsData = personsSnapshot.val();
    let personData = null;

    // PersonId'yi arayıp eşleşeni bul
    for (const key in personsData) {
      if (personsData[key].PersonId === PersonId) {
        personData = personsData[key];
        break;
      }
    }

    if (personData) {
      // AccountType'ı kontrol et
      if (personData.AccountType === 'Employee') {
        // DepartmentEmployees içindeki EmployeeId'yi kontrol et
        const deptRef = ref(db, 'DepartmentEmployees');
        const deptSnapshot = await get(deptRef);

        if (deptSnapshot.exists()) {
          const deptData = deptSnapshot.val();
          let activeDepartments = [];

          for (const key in deptData) {
            const employee = deptData[key];
            if (employee.EmployeeId === personData.PersonId && employee.Active === true) {
              activeDepartments.push(employee);
            }
          }

          // Hata yakalama
          if (activeDepartments.length > 1) {
            throw new Error("Birden fazla aktif departman bulundu.");
          } else if (activeDepartments.length === 0) {
            return null;
          } else {
            return activeDepartments[0]; // Tek aktif olan departmanı döndür
          }
        } else {
          throw new Error("Departman bilgileri bulunamadı.");
        }
      } else if (personData.AccountType === 'Client') {
        return ;
      } else {
        throw new Error("Bilinmeyen hesap türü.");
      }
    } else {
      throw new Error("PersonId ile eşleşen kişi bulunamadı.");
    }
  } else {
    throw new Error("Persons verileri bulunamadı.");
  }
};
