import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { initFirebase } from '../utils/firebase.js';
import { db } from '../utils/firebase.js';

dotenv.config();

async function createSpecificHospitalAdmin() {
  try {
    await initFirebase(process.env.SERVICE_ACCOUNT_PATH);
    
    const email = 'ngiriyezadavidadmh@gmail.com';
    const password = 'password123';
    const name = 'David Ngiriyeza';
    
    // Check if already exists
    const snapshot = await db().collection('hospitalAdmins')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      console.log('Hospital admin already exists:', email);
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Get first hospital
    const hospitalsSnapshot = await db().collection('hospitals').limit(1).get();
    const hospitalId = hospitalsSnapshot.docs[0].id;
    
    const adminDoc = await db().collection('hospitalAdmins').add({
      name,
      email,
      password: hashedPassword,
      hospitalId,
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      lastLogin: null
    });
    
    console.log('Hospital admin created:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Admin ID:', adminDoc.id);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createSpecificHospitalAdmin();