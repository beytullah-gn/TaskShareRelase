import { ref, get } from 'firebase/database';
import { db } from './firebase-config';
import fetchPersonById from './fetchPersonById';

export const fetchEligiblePersons = async (departmentId, currentPersonId) => {
  try {
    const departmentEmployeesRef = ref(db, 'DepartmentEmployees');
    const snapshot = await get(departmentEmployeesRef);

    if (snapshot.exists()) {
      const employeesData = snapshot.val();
      const eligibleEmployees = [];

      for (const key in employeesData) {
        const employee = employeesData[key];
        if (
          employee.DepartmentId === departmentId &&
          employee.Permissions.Write === true &&
          employee.Active === true &&
          employee.EmployeeId !== currentPersonId
        ) {
          const personData = await fetchPersonById(employee.EmployeeId);
          eligibleEmployees.push(personData);
        }
      }

      return eligibleEmployees;
    } else {
      console.log("No department employees found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching eligible persons: ", error);
    return [];
  }
};
