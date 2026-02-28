import { db } from './firebase.js';

export const hospitalCollection = (hospitalId, collectionName) => {
  return db()
    .collection('hospitals')
    .doc(hospitalId)
    .collection(collectionName);
};