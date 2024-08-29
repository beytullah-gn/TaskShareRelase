import { db } from './firebase-config'; 
import { ref, update } from 'firebase/database'; 

const updateRequestResponsiblePerson = (requestId, personId) => {
  const requestRef = ref(db, `Requests/${requestId}`);
  
  return update(requestRef, { ResponsiblePersonId: personId , UpdatedTime: new Date().toISOString() });
};

export default updateRequestResponsiblePerson;
