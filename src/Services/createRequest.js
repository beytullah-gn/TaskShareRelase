import { getAuth } from 'firebase/auth';
import { ref, set, push,get} from 'firebase/database';
import { db } from './firebase-config';  // Firebase yapılandırma dosyanızdan import edin
import getCurrentLocation from './getCurrentLocation'; 

const createRequest = async (Details, DepartmentId, SubjectId, Message) => {
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

        // Yeni talep oluştur
        const requestRef = ref(db, 'Requests');
        const newRequestRef = push(requestRef);

        await set(newRequestRef, {
            Details,
            DepartmentId,
            SubjectId,
            SenderPersonId: PersonId,
            CreatedTime: new Date().toISOString(),
            UpdatedTime: new Date().toISOString(),
            Completed:false,
            ResponsiblePersonId:"null"
            
        });

        // Yeni mesaj oluştur
        const messageRef = ref(db, 'Messages');
        const newMessageRef = push(messageRef);

        await set(newMessageRef, {
            Message,
            RequestId: newRequestRef.key,
            SenderPersonId: PersonId,
            SendTime: new Date().toISOString(),
        });

        console.log('Talep ve mesaj başarıyla oluşturuldu.');
    } catch (error) {
        console.error('Talep ve mesaj oluşturulurken hata:', error);
    }
};

export default createRequest;
