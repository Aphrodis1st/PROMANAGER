// Test script to create hospital users for testing unified login
import bcrypt from 'bcrypt';
import admin from 'firebase-admin';

// Initialize Firebase Admin (adjust path to your service account key)
const serviceAccount = {
  // Add your Firebase service account credentials here
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Add your Firebase project config
  });
}

const db = admin.firestore();

async function createTestUsers() {
  try {
    // Test Hospital Admin with partial password
    const adminPassword = await bcrypt.hash('admin123', 10);
    await db.collection('hospitalAdmins').add({
      email: 'admin@testhospital.com',
      password: adminPassword,
      isPartialPassword: true,
      firstName: 'Hospital',
      lastName: 'Administrator',
      hospitalId: 'test-hospital-id',
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Created hospital admin with partial password');

    // Test Doctor with partial password
    const doctorPassword = await bcrypt.hash('doctor123', 10);
    await db.collection('users').add({
      email: 'doctor@testhospital.com',
      password: doctorPassword,
      isPartialPassword: true,
      firstName: 'Dr. John',
      lastName: 'Smith',
      hospitalId: 'test-hospital-id',
      role: 'doctor',
      userType: 'staff',
      department: 'Cardiology',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Created doctor with partial password');

    // Test Nurse with full password
    const nursePassword = await bcrypt.hash('nurse123456', 10);
    await db.collection('users').add({
      email: 'nurse@testhospital.com',
      password: nursePassword,
      isPartialPassword: false,
      firstName: 'Jane',
      lastName: 'Doe',
      hospitalId: 'test-hospital-id',
      role: 'nurse',
      userType: 'staff',
      department: 'Emergency',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Created nurse with full password');

    console.log('\n🎉 Test users created successfully!');
    console.log('\nTest credentials:');
    console.log('Hospital Admin: admin@testhospital.com / admin123 (partial)');
    console.log('Doctor: doctor@testhospital.com / doctor123 (partial)');
    console.log('Nurse: nurse@testhospital.com / nurse123456 (full)');
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
  }
}

createTestUsers();