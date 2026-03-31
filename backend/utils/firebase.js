console.log('Loading backend/src/utils/firebase.js');
import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export const initFirebase = async (serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './firebase-service-account.json') => {
  // Try multiple possible paths for Railway deployment
  const possiblePaths = [
    serviceAccountPath,
    './firebase-service-account.json',
    './backend/firebase-service-account.json',
    '/app/firebase-service-account.json',
    '/app/backend/firebase-service-account.json'
  ];
  
  let foundPath = null;
  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      foundPath = path;
      break;
    }
  }
  
  if (!foundPath) {
    console.warn('Service account not found in any of these paths:', possiblePaths);
    throw new Error('Firebase service account JSON missing. Place it or set SERVICE_ACCOUNT_PATH in .env');
  }
  
  console.log('Using Firebase service account from:', foundPath);
  const serviceAccount = JSON.parse(fs.readFileSync(foundPath, 'utf8'));

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'e-pharmc.appspot.com', // 🔹 add your bucket name here
    });
    console.log('Firebase Admin initialized with Storage Bucket');
  } else {
    console.log('Firebase Admin already initialized');
  }
};

export const db = () => admin.firestore();
export default admin;
