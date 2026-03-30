#!/usr/bin/env node

/**
 * Test Password Hashing
 * Run: node test-password.js
 */

import bcrypt from 'bcryptjs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './firebase-service-account.json';

console.log('🔐 Testing Password Hashing\n');

try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  const app = initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore(app);

  // Get the admin
  const snapshot = await db.collection('hospitalAdmins')
    .where('email', '==', 'admin@hospital.com')
    .limit(1)
    .get();

  if (snapshot.empty) {
    console.log('❌ Admin not found');
    process.exit(1);
  }

  const adminDoc = snapshot.docs[0];
  const admin = adminDoc.data();

  console.log('Admin Email:', admin.email);
  console.log('Stored Hash:', admin.password.substring(0, 30) + '...\n');

  // Test different passwords
  const testPasswords = [
    'password123',
    'admin123',
    'password',
    '123456',
    'admin@hospital.com'
  ];

  console.log('Testing passwords:\n');

  for (const pwd of testPasswords) {
    try {
      const isValid = await bcrypt.compare(pwd, admin.password);
      console.log(`"${pwd}": ${isValid ? '✅ MATCH' : '❌ no match'}`);
    } catch (error) {
      console.log(`"${pwd}": ❌ Error - ${error.message}`);
    }
  }

  console.log('\n💡 Tip: If none match, you may need to reset the password');
  console.log('To set a new password, run: node reset-admin-password.js\n');

  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
