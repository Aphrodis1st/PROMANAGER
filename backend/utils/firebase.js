console.log('Loading backend/src/utils/firebase.js');
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Clean environment variables (remove quotes if present)
const cleanEnvVar = (value) => {
  if (!value) return value;
  return value.replace(/^["']|["']$/g, '');
};

export const initFirebase = async () => {
  let serviceAccount;
  
  // Try to use individual environment variables first (Railway-friendly)
  const projectId = cleanEnvVar(process.env.FIREBASE_PROJECT_ID);
  const privateKeyRaw = cleanEnvVar(process.env.FIREBASE_PRIVATE_KEY);
  const clientEmail = cleanEnvVar(process.env.FIREBASE_CLIENT_EMAIL);
  
  if (projectId && privateKeyRaw && clientEmail) {
    console.log('Using Firebase service account from individual environment variables');
    
    // Handle private key formatting - Railway might mess up newlines
    let privateKey = privateKeyRaw;
    
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
      project_id: projectId,
      private_key_id: cleanEnvVar(process.env.FIREBASE_PRIVATE_KEY_ID),
      private_key: privateKey,
      client_email: clientEmail,
      client_id: cleanEnvVar(process.env.FIREBASE_CLIENT_ID),
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${clientEmail}`,
      universe_domain: "googleapis.com"
    };
  } else {
    console.error('Firebase environment variables missing. Required: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
    throw new Error('Firebase service account environment variables missing');
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: cleanEnvVar(process.env.FIREBASE_STORAGE_BUCKET) || 'e-pharmc.appspot.com',
    });
    console.log('Firebase Admin initialized with Storage Bucket');
  } else {
    console.log('Firebase Admin already initialized');
  }
};

export const db = () => admin.firestore();
export default admin;
