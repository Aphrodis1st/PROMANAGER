import dotenv from 'dotenv';
import { initFirebase } from '../utils/firebase.js';
import { createUser, getUserByEmail, hashPassword } from '../src/models/user.model.js';

dotenv.config();

async function createSuperAdmin() {
  try {
    // Initialize Firebase
    await initFirebase(process.env.SERVICE_ACCOUNT_PATH);
    
    const email = 'superadmin@madsmart.com';
    const password = 'SuperAdmin123!';
    const name = 'Super Administrator';
    
    // Check if super admin already exists
    const existing = await getUserByEmail(email);
    if (existing) {
      console.log('Super admin already exists:', existing.email);
      return;
    }
    
    // Create super admin user
    const passwordHash = await hashPassword(password);
    const superAdmin = await createUser({
      name,
      email,
      passwordHash,
      phone: '+1234567890',
      role: 'super_admin'
    });
    
    console.log('Super admin created successfully:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('ID:', superAdmin.id);
    console.log('Role:', superAdmin.role);
    
  } catch (error) {
    console.error('Error creating super admin:', error);
  }
}

createSuperAdmin();