import { getAuth } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { db } from './firebase-config';
import { getToken } from './tokenStorage';

export const fetchCurrentDepartment = async () => {
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
                throw new Error("Birden fazla aktif departman hatası.");
              } else if (activeDepartments.length === 0) {
                //throw new Error("Aktif departman yok.");;
                return null;
              } else {
                const departmentId = activeDepartments[0].DepartmentId;

                // Departments bilgilerini al
                const departmentsRef = ref(db, 'Departments');
                const departmentsSnapshot = await get(departmentsRef);

                if (departmentsSnapshot.exists()) {
                  const departmentsData = departmentsSnapshot.val();

                  // Departments objesinde DepartmentId'ye sahip olanı bul
                  for (const deptKey in departmentsData) {
                    if (departmentsData[deptKey].DepartmentId === departmentId) {
                      return departmentsData[deptKey]; // Eşleşen department verisini döndür
                    }
                  }
                  return null
                  //throw new Error("Departman bulunamadı.");
                } else {
                  return null
                  //throw new Error("Departman bilgileri bulunamadı.");
                }
              }
            } else {
              throw new Error("Departman çalışan bilgileri bulunamadı.");
            }
          } else if (personData.AccountType === 'Client') {
            return null;
          } else {
            throw new Error("Bilinmeyen hesap türü.");
          }
        } else {
          throw new Error("PersonId ile eşleşen kişi bulunamadı.");
        }
      } else {
        throw new Error("Persons verileri bulunamadı.");
      }
    } else {
      throw new Error("Kullanıcı bilgileri bulunamadı.");
    }
  } else {
    throw new Error("Kullanıcı oturumu açmamış veya token bulunamadı.");
  }

  return null;
};