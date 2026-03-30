#!/usr/bin/env node

/**
 * Test Super Admin Created Hospital Admin
 * Run: node test-super-admin-created.js
 */

import bcrypt from 'bcryptjs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './firebase-service-account.json';
const ADMIN_EMAIL = 'ngiriyezadavidadmh@gmail.com';

console.log('🔐 Testing Super Admin Created Hospital Admin\n');
console.log('Email:', ADMIN_EMAIL);

try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  const app = initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore(app);

  // Get the admin
  const snapshot = await db.collection('hospitalAdmins')
    .where('email', '==', ADMIN_EMAIL)
    .limit(1)
    .get();

  if (snapshot.empty) {
    console.log('❌ Admin not found');
    process.exit(1);
  }

  const adminDoc = snapshot.docs[0];
  const admin = adminDoc.data();

  console.log('Admin ID:', adminDoc.id);
  console.log('Email:', admin.email);
  console.log('Role:', admin.role);
  console.log('Status:', admin.status);
  console.log('Hospital ID:', admin.hospitalId);
  console.log('Created At:', admin.createdAt?.toDate?.() || admin.createdAt);
  console.log('Stored Hash:', admin.password.substring(0, 30) + '...\n');

  // Test common passwords that might be used by super admin
  const testPasswords = [
    'password123',
    'admin123',
    'hospital123',
    'ngiriyezadavidadmh@gmail.com',
    'david123',
    'admin@123',
    '123456',
    'password',
    'admin',
    'hospital',
    'superadmin123',
    'david@123'
  ];

  console.log('Testing possible passwords:\n');

  let foundPassword = null;
  for (const pwd of testPasswords) {
    try {
      const isValid = await bcrypt.compare(pwd, admin.password);
      console.log(`"${pwd}": ${isValid ? '✅ MATCH!' : '❌ no match'}`);
      if (isValid) {
        foundPassword = pwd;
        break;
      }
    } catch (error) {
      console.log(`"${pwd}": ❌ Error - ${error.message}`);
    }
  }

  if (foundPassword) {
    console.log(`\n🎉 PASSWORD FOUND: ${foundPassword}`);
    console.log('\n📋 Login Credentials:');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${foundPassword}`);
    
    // Test login
    console.log('\n🧪 Testing login with found credentials...');
    
    const loginResponse = await fetch('http://localhost:5000/api/v1/hospital/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: foundPassword
      })
    });
    
    const loginResult = await loginResponse.json();
    
    if (loginResponse.ok && loginResult.success) {
      console.log('✅ Login test successful!');
      console.log('Token received:', loginResult.token.substring(0, 50) + '...');
      console.log('Admin name:', loginResult.admin.firstName || 'N/A', loginResult.admin.lastName || 'N/A');
      console.log('Hospital:', loginResult.hospital.name);
    } else {
      console.log('❌ Login test failed:', loginResult.error);
    }
    
  } else {
    console.log('\n❌ No matching password found.');
    console.log('💡 The password might be custom. You may need to:');
    console.log('1. Check super admin logs for the generated password');
    console.log('2. Reset the password using super admin');
    console.log('3. Or contact the person who created this admin');
  }

  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}