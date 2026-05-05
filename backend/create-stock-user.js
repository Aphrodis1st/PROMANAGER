import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'firebase-service-account.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function createStockUser() {
  try {
    const email = 'ngiriyezadavidmanager@gmail.com';
    const password = 'Admin@12345';
    const name = 'David Manager';
    const role = 'ADMIN';
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user document
    const userRef = db.collection('users').doc();
    await userRef.set({
      id: userRef.id,
      name: name,
      email: email,
      passwordHash: passwordHash,
      role: role,
      department: 'Management',
      phone: '+250788000000',
      status: 'OFFLINE',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Stock user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Role:', role);
    console.log('🆔 User ID:', userRef.id);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating stock user:', error);
    process.exit(1);
  }
}

createStockUser();
