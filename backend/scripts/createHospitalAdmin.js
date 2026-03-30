import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { initFirebase } from '../utils/firebase.js';
import { db } from '../utils/firebase.js';

dotenv.config();

async function createHospitalAdmin() {
  try {
    // Initialize Firebase
    await initFirebase(process.env.SERVICE_ACCOUNT_PATH);
    
    const email = 'admin@hospital.com';
    const password = 'HospitalAdmin123!';
    const name = 'Hospital Administrator';
    
    // Check if hospital admin already exists
    const snapshot = await db().collection('hospitalAdmins')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      console.log('Hospital admin already exists:', email);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // First, let's check if there are any hospitals
    const hospitalsSnapshot = await db().collection('hospitals').limit(1).get();
    let hospitalId = null;
    
    if (!hospitalsSnapshot.empty) {
      hospitalId = hospitalsSnapshot.docs[0].id;
      console.log('Using existing hospital ID:', hospitalId);
    } else {
      // Create a test hospital
      const hospitalDoc = await db().collection('hospitals').add({
        name: 'Test Hospital',
        location: 'Test City',
        email: 'test@hospital.com',
        phone: '+1234567890',
        status: 'active',
        subscriptionPlan: 'basic',
        features: ['appointments', 'billing'],
        createdAt: new Date()
      });
      hospitalId = hospitalDoc.id;
      console.log('Created test hospital with ID:', hospitalId);
    }
    
    // Create hospital admin
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
    
    console.log('Hospital admin created successfully:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Admin ID:', adminDoc.id);
    console.log('Hospital ID:', hospitalId);
    
  } catch (error) {
    console.error('Error creating hospital admin:', error);
  }
}

createHospitalAdmin();