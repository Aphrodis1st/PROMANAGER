#!/usr/bin/env node

/**
 * Reset Admin Password
 * Run: node reset-admin-password.js
 */

import bcrypt from 'bcryptjs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './firebase-service-account.json';
const NEW_PASSWORD = 'admin@123'; // Change this to your desired password

console.log('🔐 Resetting Admin Password\n');
console.log('New Password:', NEW_PASSWORD);
console.log('');

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
  console.log('Found admin:', adminDoc.id);
  console.log('Email:', adminDoc.data().email);

  // Hash new password
  console.log('\n🔄 Hashing new password...');
  const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
  console.log('Hash:', hashedPassword.substring(0, 30) + '...');

  // Update password
  console.log('\n📝 Updating password in database...');
  await db.collection('hospitalAdmins').doc(adminDoc.id).update({
    password: hashedPassword,
    passwordResetAt: new Date(),
    passwordResetBy: 'admin-script'
  });

  console.log('✅ Password updated successfully!\n');
  console.log('You can now login with:');
  console.log(`Email: admin@hospital.com`);
  console.log(`Password: ${NEW_PASSWORD}\n`);

  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
