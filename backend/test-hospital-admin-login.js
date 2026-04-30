import { initFirebase, db } from './utils/firebase.js';
import bcrypt from 'bcrypt';

async function testHospitalAdminLogin() {
  try {
    // Initialize Firebase first
    await initFirebase();
    
    console.log('🔍 Testing Hospital Admin Credentials...\n');
    
    // Test all hospital admins
    const adminSnapshot = await db().collection('hospitalAdmins').get();
    
    if (adminSnapshot.empty) {
      console.log('❌ No hospital admins found');
      return;
    }
    
    console.log(`✅ Found ${adminSnapshot.size} hospital admin(s):\n`);
    
    for (const doc of adminSnapshot.docs) {
      const admin = doc.data();
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🆔 ID: ${doc.id}`);
      console.log(`🏥 Hospital ID: ${admin.hospitalId}`);
      console.log(`📊 Status: ${admin.status}`);
      console.log(`🔑 Has Password: ${admin.password ? 'YES' : 'NO'}`);
      console.log(`🔐 Is Partial Password: ${admin.isPartialPassword ? 'YES' : 'NO'}`);
      
      // Test common passwords
      const testPasswords = ['admin123', 'password', 'Admin@123', 'hospital123', '123456'];
      
      if (admin.password) {
        console.log('🧪 Testing common passwords...');
        for (const testPwd of testPasswords) {
          try {
            const match = await bcrypt.compare(testPwd, admin.password);
            if (match) {
              console.log(`✅ Password match found: "${testPwd}"`);
              break;
            }
          } catch (err) {
            console.log(`❌ Error testing password "${testPwd}":`, err.message);
          }
        }
      }
      
      console.log('---\n');
    }
    
    // Also check users collection for hospital users
    console.log('🔍 Checking users collection for hospital users...\n');
    
    const userSnapshot = await db().collection('users')
      .where('role', 'in', ['hospital_admin', 'admin', 'doctor', 'nurse'])
      .get();
    
    if (!userSnapshot.empty) {
      console.log(`✅ Found ${userSnapshot.size} hospital user(s):\n`);
      
      for (const doc of userSnapshot.docs) {
        const user = doc.data();
        console.log(`📧 Email: ${user.email}`);
        console.log(`🆔 ID: ${doc.id}`);
        console.log(`👤 Role: ${user.role}`);
        console.log(`🏥 Hospital ID: ${user.hospitalId || 'N/A'}`);
        console.log(`🔑 Has Password: ${user.passwordHash ? 'YES' : 'NO'}`);
        console.log('---\n');
      }
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error testing Hospital Admin:', error);
    process.exit(1);
  }
}

// Run the function
testHospitalAdminLogin();