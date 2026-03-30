import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { initFirebase } from '../utils/firebase.js';
import { db } from '../utils/firebase.js';

dotenv.config();

async function createPartialPasswordAdmin() {
  try {
    // Initialize Firebase
    await initFirebase(process.env.SERVICE_ACCOUNT_PATH);
    
    const email = 'partial@hospital.com';
    const partialPassword = 'Test1234'; // This will be the partial password
    const firstName = 'Partial';
    const lastName = 'Admin';
    
    // Check if hospital admin already exists
    const snapshot = await db().collection('hospitalAdmins')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      console.log('Hospital admin already exists:', email);
      // Update existing admin to have partial password
      const adminDoc = snapshot.docs[0];
      const hashedPassword = await bcrypt.hash(partialPassword, 10);
      
      await db().collection('hospitalAdmins').doc(adminDoc.id).update({
        password: hashedPassword,
        isPartialPassword: true,
        requirePasswordChange: true,
        updatedAt: new Date()
      });
      
      console.log('Updated existing admin to have partial password');
      console.log('Email:', email);
      console.log('Partial Password:', partialPassword);
      console.log('Admin ID:', adminDoc.id);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(partialPassword, 10);
    
    // Get first hospital
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
    
    // Create hospital admin with partial password
    const adminDoc = await db().collection('hospitalAdmins').add({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      hospitalId,
      role: 'admin',
      status: 'active',
      isPartialPassword: true,
      requirePasswordChange: true,
      createdAt: new Date(),
      lastLogin: null
    });
    
    console.log('Hospital admin with partial password created successfully:');
    console.log('Email:', email);
    console.log('Partial Password:', partialPassword);
    console.log('Admin ID:', adminDoc.id);
    console.log('Hospital ID:', hospitalId);
    console.log('');
    console.log('You can now login with these credentials and will be prompted to complete the password.');
    
  } catch (error) {
    console.error('Error creating hospital admin with partial password:', error);
  }
}

createPartialPasswordAdmin();