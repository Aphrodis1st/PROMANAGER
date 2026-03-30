import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { initFirebase } from '../utils/firebase.js';
import { db } from '../utils/firebase.js';

dotenv.config();

async function createPartialPasswordUser() {
  try {
    // Initialize Firebase
    await initFirebase(process.env.SERVICE_ACCOUNT_PATH);
    
    const email = 'doctor@hospital.com';
    const partialPassword = 'Doc1234'; // This will be the partial password
    const firstName = 'Dr. John';
    const lastName = 'Smith';
    const role = 'doctor';
    
    // Check if user already exists
    const snapshot = await db().collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      console.log('User already exists:', email);
      // Update existing user to have partial password
      const userDoc = snapshot.docs[0];
      const hashedPassword = await bcrypt.hash(partialPassword, 10);
      
      await db().collection('users').doc(userDoc.id).update({
        password: hashedPassword,
        isPartialPassword: true,
        requirePasswordChange: true,
        updatedAt: new Date()
      });
      
      console.log('Updated existing user to have partial password');
      console.log('Email:', email);
      console.log('Partial Password:', partialPassword);
      console.log('User ID:', userDoc.id);
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
      console.log('No hospital found. Please create a hospital first.');
      return;
    }
    
    // Create regular user (doctor) with partial password
    const userDoc = await db().collection('users').add({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      hospitalId,
      role,
      userType: 'staff',
      departmentId: null,
      phone: '+1234567890',
      isActive: true,
      isPartialPassword: true,
      requirePasswordChange: true,
      createdAt: new Date(),
      createdBy: 'system'
    });
    
    console.log('Regular user with partial password created successfully:');
    console.log('Email:', email);
    console.log('Partial Password:', partialPassword);
    console.log('Role:', role);
    console.log('User ID:', userDoc.id);
    console.log('Hospital ID:', hospitalId);
    console.log('');
    console.log('This user can now login with these credentials and will be prompted to complete the password.');
    console.log('Note: This is a regular user (doctor), not a hospital admin.');
    
  } catch (error) {
    console.error('Error creating user with partial password:', error);
  }
}

createPartialPasswordUser();