// config/firebase-admin.js
import admin from 'firebase-admin';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const serviceAccount = require('../service-account.json'); // No assert needed
console.log(serviceAccount)
// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId:serviceAccount.project_id,
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

// Initialize services
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

const auth = admin.auth(); // Define `auth` as a variable

// Export both the admin instance and services
// Export using ES Modules syntax
export {
  admin,
  auth, // Explicitly initialize auth
  db
};