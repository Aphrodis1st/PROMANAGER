console.log('Loading backend/src/utils/firebase.js');
import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export const initFirebase = async (serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './firebase-service-account.json') => {
  let serviceAccount;
  
  // Try to use SERVICE_ACCOUNT_JSON environment variable first
  if (process.env.SERVICE_ACCOUNT_JSON) {
    console.log('Using Firebase service account from environment variable');
    try {
      serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
    } catch (err) {
      console.error('Failed to parse SERVICE_ACCOUNT_JSON:', err.message);
      throw new Error('Invalid SERVICE_ACCOUNT_JSON environment variable');
    }
  } else {
    // Fallback to file-based approach
    console.log('Current working directory:', process.cwd());
    try {
      const files = fs.readdirSync('.');
      console.log('Files in current directory:', files);
    } catch (err) {
      console.log('Could not list current directory:', err.message);
    }
    
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
      throw new Error('Firebase service account JSON missing. Set SERVICE_ACCOUNT_JSON environment variable or place firebase-service-account.json file');
    }
    
    console.log('Using Firebase service account from:', foundPath);
    serviceAccount = JSON.parse(fs.readFileSync(foundPath, 'utf8'));
  }

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
