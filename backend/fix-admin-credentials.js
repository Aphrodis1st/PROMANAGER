import { initFirebase, db } from './utils/firebase.js';
import bcrypt from 'bcrypt';

async function fixAdminCredentials() {
  try {
    // Initialize Firebase first
    await initFirebase();
    
    console.log('🔧 Fixing Admin Credentials...\n');
    
    // Define admin credentials to set
    const adminCredentials = [
      {
        email: 'ngiriyezadavidadmh@gmail.com',
        password: 'Admin@123'
      },
      {
        email: 'admin@hospital.com', 
        password: 'admin123'
      },
      {
        email: 'partial@hospital.com',
        password: 'partial123'
      }
    ];
    
    // Fix hospital admins
    console.log('🏥 Fixing Hospital Admin passwords...\n');
    
    for (const cred of adminCredentials) {
      try {
        // Find admin by email
        const adminSnapshot = await db().collection('hospitalAdmins')
          .where('email', '==', cred.email)
          .limit(1)
          .get();
        
        if (!adminSnapshot.empty) {
          const adminDoc = adminSnapshot.docs[0];
          const hashedPassword = await bcrypt.hash(cred.password, 10);
          
          await db().collection('hospitalAdmins').doc(adminDoc.id).update({
            password: hashedPassword,
            isPartialPassword: false,
            updatedAt: new Date()
          });
          
          console.log(`✅ Updated password for ${cred.email} -> ${cred.password}`);
        } else {
          console.log(`❌ Admin not found: ${cred.email}`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${cred.email}:`, error.message);
      }
    }
    
    // Fix users with hospital roles that don't have passwords
    console.log('\n👥 Fixing Hospital User passwords...\n');
    
    const userCredentials = [
      {
        email: 'ngiriyezadavidnus@gmail.com',
        password: 'Nurse@123'
      },
      {
        email: 'doctor@hospital.com',
        password: 'Doctor@123'
      }
    ];
    
    for (const cred of userCredentials) {
      try {
        // Find user by email
        const userSnapshot = await db().collection('users')
          .where('email', '==', cred.email)
          .limit(1)
          .get();
        
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          
          if (!userData.passwordHash) {
            const hashedPassword = await bcrypt.hash(cred.password, 10);
            
            await db().collection('users').doc(userDoc.id).update({
              passwordHash: hashedPassword,
              updatedAt: new Date()
            });
            
            console.log(`✅ Set password for ${cred.email} -> ${cred.password}`);
          } else {
            console.log(`ℹ️  ${cred.email} already has a password`);
          }
        } else {
          console.log(`❌ User not found: ${cred.email}`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${cred.email}:`, error.message);
      }
    }
    
    // Verify Super Admin
    console.log('\n🔐 Verifying Super Admin...\n');
    
    const superAdminEmail = 'ngiriyezadavid@gmail.com';
    const superAdminPassword = 'Supper@123';
    
    const superAdminSnapshot = await db().collection('users')
      .where('email', '==', superAdminEmail)
      .limit(1)
      .get();
    
    if (!superAdminSnapshot.empty) {
      const superAdminDoc = superAdminSnapshot.docs[0];
      const superAdminData = superAdminDoc.data();
      
      if (superAdminData.role === 'super_admin') {
        const passwordMatch = await bcrypt.compare(superAdminPassword, superAdminData.passwordHash);
        console.log(`✅ Super Admin verified: ${superAdminEmail} -> ${superAdminPassword} (${passwordMatch ? 'VALID' : 'INVALID'})`);
      } else {
        console.log(`❌ User ${superAdminEmail} is not a super_admin, role: ${superAdminData.role}`);
      }
    } else {
      console.log(`❌ Super Admin not found: ${superAdminEmail}`);
    }
    
    console.log('\n🎉 Credential fix completed!\n');
    
    // Print summary
    console.log('📋 CREDENTIAL SUMMARY:');
    console.log('======================');
    console.log('Super Admin:');
    console.log(`  Email: ${superAdminEmail}`);
    console.log(`  Password: ${superAdminPassword}`);
    console.log('');
    console.log('Hospital Admins:');
    adminCredentials.forEach(cred => {
      console.log(`  Email: ${cred.email}`);
      console.log(`  Password: ${cred.password}`);
    });
    console.log('');
    console.log('Hospital Users:');
    userCredentials.forEach(cred => {
      console.log(`  Email: ${cred.email}`);
      console.log(`  Password: ${cred.password}`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fixing credentials:', error);
    process.exit(1);
  }
}

// Run the function
fixAdminCredentials();