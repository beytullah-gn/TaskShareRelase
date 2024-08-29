import { Alert } from 'react-native';
import { db } from './firebase-config'; 
import { ref, update, get } from 'firebase/database'; 

const markAsCompleted = async (requestId) => {
  try {
    const requestRef = ref(db, `Requests/${requestId}`);
    
    // Fetch current status
    const snapshot = await get(requestRef);
    if (snapshot.exists()) {
      const request = snapshot.val();
      const currentStatus = request.Completed;

      // Toggle the status
      const newStatus = !currentStatus;

      // Update the request with the new status
      await update(requestRef, { Completed: newStatus });
      
      // Show success alert
      Alert.alert("Başarıyla güncellendi", `Görev durumu ${newStatus ? 'tamamlandı' : 'tamamlanmadı'}.`);
    } else {
      Alert.alert("Hata", "İstek bulunamadı.");
    }
  } catch (error) {
    console.error("Error updating request:", error);
    Alert.alert("Hata", "Görev durumu güncellenirken bir hata oluştu.");
  }
};

export default markAsCompleted;
