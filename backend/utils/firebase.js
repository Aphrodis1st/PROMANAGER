console.log('Loading backend/src/utils/firebase.js');
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

export const initFirebase = async () => {
  let serviceAccount;
  
  // Try to use individual environment variables first (Railway-friendly)
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    console.log('Using Firebase service account from individual environment variables');
    
    // Handle private key formatting - Railway might mess up newlines
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // If the key doesn't have proper newlines, add them
    if (!privateKey.includes('\n')) {
      privateKey = privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
        .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----')
        .replace(/(.{64})/g, '$1\n')
        .replace(/\n\n/g, '\n');
    } else {
      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
      universe_domain: "googleapis.com"
    };
  } else {
    console.error('Firebase environment variables missing. Required: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
    throw new Error('Firebase service account environment variables missing');
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'e-pharmc.appspot.com',
    });
    console.log('Firebase Admin initialized with Storage Bucket');
  } else {
    console.log('Firebase Admin already initialized');
  }
};

export const db = () => admin.firestore();
export default admin;
