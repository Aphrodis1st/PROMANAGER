import { initFirebase, db } from './utils/firebase.js';
import bcrypt from 'bcrypt';

async function createSuperAdmin() {
  try {
    // Initialize Firebase first
    await initFirebase();
    
    const email = 'superadmin@madsmart.com';
    const password = 'SuperAdmin123!';
    const role = 'super_admin';
    
    // Check if super admin already exists
    const existingUser = await db().collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      console.log('⚠️  Super Admin user already exists with this email!');
      console.log('📧 Email:', email);
      console.log('🔑 Password:', password);
      console.log('🚀 You can login at: http://localhost:5173/super-admin/login');
      process.exit(0);
    }
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create super admin user data
    const superAdminData = {
      email: email,
      passwordHash: passwordHash,
      role: role,
      name: 'Super Administrator',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };
    
    // Add to Firestore users collection
    const userRef = await db().collection('users').add(superAdminData);
    
    console.log('✅ Super Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Role:', role);
    console.log('🆔 User ID:', userRef.id);
    console.log('');
    console.log('🚀 You can now login at: http://localhost:5173/super-admin/login');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error);
    process.exit(1);
  }
}

// Run the function
createSuperAdmin();