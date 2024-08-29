import { getAuth } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase-config';
import { getToken } from './tokenStorage';
import { fetchPersonData } from './fetchPersonData';
import { fetchDepartmentEmployeeData } from './fetchDepartmentEmployees';
import fetchPersonById from './fetchPersonById'; // Assuming this is a function to fetch person by ID
import fetchDepartmentById from './fetchDepartmentById'; // Assuming this is a function to fetch department by ID

export const fetchRequests = async (callback) => {
  const token = getToken();
  const auth = getAuth();
  const user = auth.currentUser;

  if (user && token) {
    try {
      // Fetch person data to get the PersonId
      const personData = await fetchPersonData(user.uid);
      const personId = personData?.PersonId;

      if (!personId) {
        console.log("Person verisi bulunamadı.");
        callback([]);
        return;
      }

      // Fetch department data to check if the user is part of a department
      const departmentEmployeeData = await fetchDepartmentEmployeeData();
      const departmentId = departmentEmployeeData?.DepartmentId;

      const requestsRef = ref(db, 'Requests');

      // Attach a real-time listener
      onValue(requestsRef, async (snapshot) => {
        if (!snapshot.exists()) {
          console.log("Requests verisi bulunamadı.");
          callback([]);
          return;
        }

        const requestsData = snapshot.val();
        const filteredMessages = [];

        for (const key in requestsData) {
          const request = requestsData[key];
          const isSender = request.SenderPersonId === personId;
          const isResponsible = request.ResponsiblePersonId === personId;
          const isResponsibleNullAndInDepartment = request.ResponsiblePersonId === "null"
            && request.DepartmentId === departmentId
            && departmentEmployeeData?.Permissions?.Write;

          // Include the request if the user is the sender, responsible, or eligible by department
          if (isSender || isResponsible || isResponsibleNullAndInDepartment) {
            // Fetch the sender's name and department name
            const senderPerson = await fetchPersonById(request.SenderPersonId);
            const department = await fetchDepartmentById(request.DepartmentId);

            // Convert CreatedTime and UpdatedTime to Turkish time
            const createdTime = new Date(request.CreatedTime).toLocaleString("tr-TR", {
              timeZone: "Europe/Istanbul",
            });
            const updatedTime = new Date(request.UpdatedTime).toLocaleString("tr-TR", {
              timeZone: "Europe/Istanbul",
            });

            filteredMessages.push({
              id: key,
              ...request,
              senderName: senderPerson ? `${senderPerson.Name} ${senderPerson.Surname}` : 'Unknown Sender',
              departmentName: department ? department.DepartmentName : 'Unknown Department',
              createdTime,
              updatedTime,
            });
          }
        }

        // Sort requests by UpdatedTime, most recent first
        filteredMessages.sort((a, b) => new Date(b.UpdatedTime) - new Date(a.UpdatedTime));

        callback(filteredMessages);
      });
    } catch (error) {
      console.error("Veri alınırken hata oluştu: ", error);
      callback([]);
    }
  } else {
    console.log("Kullanıcı oturumu açmamış veya token bulunamadı.");
    callback([]);
  }
};
