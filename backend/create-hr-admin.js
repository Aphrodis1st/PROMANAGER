const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createHRAdmin() {
  try {
    // First, create an organization
    const orgRef = await db.collection('hr_organizations').add({
      name: 'Demo Company',
      location: 'New York, USA',
      industry: 'Technology',
      status: 'active',
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Organization created with ID:', orgRef.id);

    // Create HR Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminRef = await db.collection('hrAdmins').add({
      email: 'hradmin@demo.com',
      password: hashedPassword,
      firstName: 'HR',
      lastName: 'Admin',
      phone: '+1234567890',
      position: 'HR Manager',
      organizationId: orgRef.id,
      status: 'active',
      isActive: true,
      isPartialPassword: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ HR Admin created with ID:', adminRef.id);
    console.log('\n📧 Login Credentials:');
    console.log('Email: hradmin@demo.com');
    console.log('Password: admin123');
    console.log('Organization ID:', orgRef.id);
    console.log('\n🚀 You can now login at: http://localhost:5173/hr/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createHRAdmin();
