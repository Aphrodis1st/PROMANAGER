import { initFirebase, db } from './utils/firebase.js';
import bcrypt from 'bcrypt';

async function fixSuperAdminUser() {
  try {
    // Initialize Firebase first
    await initFirebase();
    
    const email = 'ngiriyezadavid@gmail.com';
    const password = 'Supper@123';
    
    console.log('🔍 Finding user to update...');
    
    // Find user by email
    const userQuery = await db().collection('users').where('email', '==', email).get();
    
    if (userQuery.empty) {
      console.log('❌ No user found with email:', email);
      return;
    }
    
    const userDoc = userQuery.docs[0];
    const userId = userDoc.id;
    
    console.log('✅ User found, updating...');
    
    // Hash the new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Update user with correct role and password
    await db().collection('users').doc(userId).update({
      role: 'super_admin',
      passwordHash: passwordHash,
      updatedAt: new Date()
    });
    
    console.log('✅ Super Admin user updated successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Role: super_admin');
    console.log('🆔 User ID:', userId);
    console.log('');
    console.log('🚀 You can now login at: http://localhost:5173/super-admin/login');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error updating Super Admin:', error);
    process.exit(1);
  }
}

// Run the function
fixSuperAdminUser();