import { ref, get, update } from 'firebase/database';
import { db } from './firebase-config';

// Verilen DepartmentId'ye sahip departmanı ve altındaki tüm departmanları ve çalışanları aktif olmayan olarak günceller
export const deactivateDepartmentAndEmployees = async (departmentId) => {
  const departmentsRef = ref(db, 'Departments');
  const departmentEmployeesRef = ref(db, 'DepartmentEmployees');

  // Recursive fonksiyon: Hiyerarşiyi güncelle
  const deactivateHierarchy = async (parentId) => {
    try {
      const departmentsSnapshot = await get(departmentsRef);
      const employeesSnapshot = await get(departmentEmployeesRef);
      
      if (departmentsSnapshot.exists()) {
        const departmentsData = departmentsSnapshot.val();
        const employeesData = employeesSnapshot.exists() ? employeesSnapshot.val() : {};
        
        // Bu parentId'ye sahip tüm departmanları bul
        const departments = Object.values(departmentsData).filter(department => department.ParentDepartment === parentId);

        // Bu departmanları güncelle
        for (const department of departments) {
          if (department && department.DepartmentId && department.Active === true) {
            // Departmanın Active özelliğini false yap
            await update(ref(db, `Departments/${department.DepartmentId}`), { Active: false });

            // Bu departman için çalışanları güncelle
            for (const [employeeId, employee] of Object.entries(employeesData)) {
              if (employee.DepartmentId === department.DepartmentId) {
                await update(ref(db, `DepartmentEmployees/${employeeId}`), { Active: false });
              }
            }

            // Alt departmanları güncelle
            await deactivateHierarchy(department.DepartmentId);
          }
        }
      } else {
        console.log('No departments found.');
      }
    } catch (error) {
      console.error('Error deactivating department hierarchy:', error);
    }
  };

  // İlk olarak verilen departmentId'yi güncelle
  try {
    const departmentSnapshot = await get(ref(db, `Departments/${departmentId}`));
    if (departmentSnapshot.exists()) {
      const departmentData = departmentSnapshot.val();
      if (departmentData && departmentData.Active === true) {
        await update(ref(db, `Departments/${departmentId}`), { Active: false });

        // Bu departmanın çalışanlarını güncelle
        const employeesSnapshot = await get(departmentEmployeesRef);
        const employeesData = employeesSnapshot.exists() ? employeesSnapshot.val() : {};
        for (const [employeeId, employee] of Object.entries(employeesData)) {
          if (employee.DepartmentId === departmentId) {
            await update(ref(db, `DepartmentEmployees/${employeeId}`), { Active: false });
          }
        }

        // Hiyerarşiyi başlat
        await deactivateHierarchy(departmentId);
      } else {
        console.log('Department is already inactive or not found.');
      }
    } else {
      console.log('Department not found.');
    }
  } catch (error) {
    console.error('Error fetching initial department:', error);
  }
};
