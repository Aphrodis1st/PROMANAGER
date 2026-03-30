#!/usr/bin/env node

/**
 * Reset Super Admin Created Hospital Admin Password
 * Run: node reset-super-admin-created.js
 */

import dotenv from 'dotenv';
import { initFirebase } from './utils/firebase.js';
import { HospitalAdmin } from './src/models/superAdmin/hospitalAdmin.model.js';

dotenv.config();

const ADMIN_EMAIL = 'ngiriyezadavidadmh@gmail.com';
const NEW_PASSWORD = 'HospitalAdmin@2024'; // Professional password

console.log('🔐 Resetting Super Admin Created Hospital Admin Password\n');
console.log('Email:', ADMIN_EMAIL);
console.log('New Password:', NEW_PASSWORD);
console.log('');

async function resetPassword() {
  try {
    // Initialize Firebase
    await initFirebase(process.env.SERVICE_ACCOUNT_PATH);
    
    // Find the admin by email
    console.log('🔍 Finding hospital admin...');
    const admin = await HospitalAdmin.getByEmail(ADMIN_EMAIL);
    
    if (!admin) {
      console.log('❌ Hospital admin not found with email:', ADMIN_EMAIL);
      process.exit(1);
    }
    
    console.log('✅ Found admin:');
    console.log('  ID:', admin.id);
    console.log('  Email:', admin.email);
    console.log('  Hospital ID:', admin.hospitalId);
    console.log('  Status:', admin.status);
    console.log('  Created:', admin.createdAt?.toDate?.() || admin.createdAt);
    
    // Reset password using super admin model
    console.log('\n🔄 Resetting password...');
    await HospitalAdmin.resetPassword(admin.id, NEW_PASSWORD);
    
    console.log('✅ Password reset successfully!\n');
    
    // Test login
    console.log('🧪 Testing login with new credentials...');
    
    const loginResponse = await fetch('http://localhost:5000/api/v1/hospital/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: NEW_PASSWORD
      })
    });
    
    const loginResult = await loginResponse.json();
    
    if (loginResponse.ok && loginResult.success) {
      console.log('✅ Login test successful!');
      console.log('Token received:', loginResult.token.substring(0, 50) + '...');
      console.log('Hospital:', loginResult.hospital.name);
      
      console.log('\n🎉 SUCCESS! You can now login with:');
      console.log(`📧 Email: ${ADMIN_EMAIL}`);
      console.log(`🔑 Password: ${NEW_PASSWORD}`);
      
    } else {
      console.log('❌ Login test failed:', loginResult.error);
      console.log('But password was reset. Try logging in manually.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPassword();