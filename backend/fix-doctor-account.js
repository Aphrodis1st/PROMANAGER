import { initFirebase, db } from './utils/firebase.js';
import bcrypt from 'bcrypt';

async function fixDoctorAccount() {
  try {
    // Initialize Firebase first
    await initFirebase();
    
    console.log('🔧 Fixing Doctor Account...\n');
    
    const doctorEmail = 'doctor@hospital.com';
    
    // Find doctor by email
    const userSnapshot = await db().collection('users')
      .where('email', '==', doctorEmail)
      .limit(1)
      .get();
    
    if (userSnapshot.empty) {
      console.log('❌ Doctor not found:', doctorEmail);
      return;
    }
    
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('📧 Doctor found:', doctorEmail);
    console.log('🆔 ID:', userDoc.id);
    console.log('🔐 Is Partial Password:', userData.isPartialPassword);
    console.log('🔑 Has Password Hash:', userData.passwordHash ? 'YES' : 'NO');
    
    // Update to remove partial password flag
    await db().collection('users').doc(userDoc.id).update({
      isPartialPassword: false,
      updatedAt: new Date()
    });
    
    console.log('✅ Fixed doctor account - removed partial password flag');
    
    // Test password
    if (userData.passwordHash) {
      const testPassword = 'Doctor@123';
      const passwordMatch = await bcrypt.compare(testPassword, userData.passwordHash);
      console.log(`🧪 Password test: ${testPassword} -> ${passwordMatch ? 'VALID' : 'INVALID'}`);
    }
    
    console.log('\n🎉 Doctor account fixed!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fixing doctor account:', error);
    process.exit(1);
  }
}

// Run the function
fixDoctorAccount();