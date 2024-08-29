import { getAuth } from 'firebase/auth';
import { ref, push, serverTimestamp, get, update } from 'firebase/database';
import { db } from './firebase-config'; // Import your Firebase configuration
import { fetchDepartmentEmployeeData } from './fetchDepartmentEmployees';

const sendMessage = async (message, requestId, request) => {
    if (!message.trim() || !requestId) {
        throw new Error('Message and RequestId are required');
    }

    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            throw new Error('Kullanıcı oturumu açılmamış.');
        }

        const userRef = ref(db, `Users/${user.uid}`);
        const userSnapshot = await get(userRef);

        if (!userSnapshot.exists()) {
            throw new Error('Kullanıcı bilgileri bulunamadı.');
        }

        const userData = userSnapshot.val();
        const PersonId = userData.PersonId;

        // Fetch department employee data
        const departmentEmployeeData = await fetchDepartmentEmployeeData();
        console.log(departmentEmployeeData);
        // Check if ResponsibleId is "Null" and DepartmentId matches
        if (request.ResponsiblePersonId === "null" && departmentEmployeeData.DepartmentId === request.DepartmentId && departmentEmployeeData.Permissions.Write === true) {
            // Update ResponsiblePersonId to the current user's PersonId
            const requestRef = ref(db, `Requests/${requestId}`);
            await update(requestRef, {
                ResponsiblePersonId: PersonId,

            });
            console.log('ResponsiblePersonId güncellendi.');
        }

        const requestRef = ref(db, `Requests/${requestId}`);
            await update(requestRef, {
                UpdatedTime: serverTimestamp(),

            });
        // Send the message
        const messagesRef = ref(db, 'Messages'); // Reference to the Messages node
        await push(messagesRef, {
            RequestId: requestId,
            Message: message,
            SenderPersonId: PersonId, // Use PersonId as SenderPersonId
            SendTime: serverTimestamp(), // Timestamp provided by Firebase
        });

        console.log('Mesaj başarıyla gönderildi.');
    } catch (error) {
        console.error('Mesaj gönderilirken hata:', error);
        throw error;
    }
};

export default sendMessage;
