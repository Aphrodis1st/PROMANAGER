import { initFirebase, db } from './utils/firebase.js';
import bcrypt from 'bcrypt';

async function testSuperAdminLogin() {
  try {
    // Initialize Firebase first
    await initFirebase();
    
    const email = 'ngiriyezadavid@gmail.com';
    const password = 'Supper@123';
    
    console.log('🔍 Searching for Super Admin user...');
    
    // Find user by email
    const userQuery = await db().collection('users').where('email', '==', email).get();
    
    if (userQuery.empty) {
      console.log('❌ No user found with email:', email);
      return;
    }
    
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    
    console.log('✅ User found!');
    console.log('📧 Email:', userData.email);
    console.log('👤 Role:', userData.role);
    console.log('🆔 User ID:', userDoc.id);
    console.log('📅 Created:', userData.createdAt?.toDate());
    
    // Test password
    const passwordMatch = await bcrypt.compare(password, userData.passwordHash);
    console.log('🔑 Password match:', passwordMatch ? '✅ YES' : '❌ NO');
    
    if (userData.role !== 'super_admin') {
      console.log('⚠️  User role is not super_admin, it is:', userData.role);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error testing Super Admin:', error);
    process.exit(1);
  }
}

// Run the function
testSuperAdminLogin();