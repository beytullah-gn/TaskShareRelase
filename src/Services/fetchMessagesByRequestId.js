import { db } from './firebase-config';
import { ref, onValue } from 'firebase/database';
import fetchPersonById from './fetchPersonById'; // Import fetchPersonById

const fetchMessagesByRequestId = (requestId, callback) => {
  const messagesRef = ref(db, 'Messages');

  const handleValueChange = async (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const filteredMessages = Object.keys(data)
        .filter(key => data[key].RequestId === requestId)
        .map(async key => {
          const message = { id: key, ...data[key] };
          // Fetch sender details
          const senderData = await fetchPersonById(message.SenderPersonId);
          message.senderName = `${senderData.Name} ${senderData.Surname}`;
          return message;
        });

      const resolvedMessages = await Promise.all(filteredMessages);

      // Sort messages by SendTime, with the newest at the top
      resolvedMessages.sort((a, b) => new Date(b.SendTime) - new Date(a.SendTime));

      callback(resolvedMessages);
    } else {
      callback([]);
    }
  };

  const unsubscribe = onValue(messagesRef, handleValueChange);
  return unsubscribe;
};

export default fetchMessagesByRequestId;
