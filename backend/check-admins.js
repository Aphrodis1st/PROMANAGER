#!/usr/bin/env node

/**
 * Check Hospital Admins in Database
 * Run: node check-admins.js
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './firebase-service-account.json';

console.log('🔍 Checking Hospital Admins in Database\n');
console.log('Service Account Path:', serviceAccountPath);
console.log('File exists:', fs.existsSync(serviceAccountPath));

try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  const app = initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore(app);

  console.log('\n📋 Fetching hospital admins...\n');

  const snapshot = await db.collection('hospitalAdmins').get();
  
  if (snapshot.empty) {
    console.log('❌ No hospital admins found in database');
  } else {
    console.log(`✅ Found ${snapshot.size} hospital admin(s):\n`);
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Email: ${data.email}`);
      console.log(`Name: ${data.firstName} ${data.lastName}`);
      console.log(`Role: ${data.role}`);
      console.log(`Status: ${data.status}`);
      console.log(`Hospital ID: ${data.hospitalId}`);
      console.log(`Password Hash: ${data.password ? data.password.substring(0, 20) + '...' : 'N/A'}`);
      console.log('---\n');
    });
  }

  // Also check hospitals
  console.log('📋 Fetching hospitals...\n');
  const hospitalSnapshot = await db.collection('hospitals').get();
  
  if (hospitalSnapshot.empty) {
    console.log('❌ No hospitals found in database');
  } else {
    console.log(`✅ Found ${hospitalSnapshot.size} hospital(s):\n`);
    
    hospitalSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Name: ${data.name}`);
      console.log(`Status: ${data.status}`);
      console.log('---\n');
    });
  }

  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
