// api/services/firestore.js
const { db } = require('../config/firebase-admin');

const getDocument = async (collection, docId) => {
  const docRef = db.collection(collection).doc(docId);
  const docSnap = await docRef.get();
  
  if (!docSnap.exists) {
    throw new Error('Document not found');
  }
  
  return { id: docSnap.id, ...docSnap.data() };
};

module.exports = { getDocument };