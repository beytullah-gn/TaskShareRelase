import { db } from './firebase-config'; 
import { ref, update } from 'firebase/database'; 

const updateNfcData = (nfcId, personId) => {
  const requestRef = ref(db, `Persons/${personId}`);
  
  return update(requestRef, { NfcId: nfcId  });
};

export default updateNfcData;
