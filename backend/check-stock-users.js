import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'firebase-service-account.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function checkStockUsers() {
  try {
    console.log('🔍 Checking for stock users...\n');
    
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('❌ No users found in the database');
      process.exit(0);
    }
    
    console.log(`📊 Found ${usersSnapshot.size} total user(s)\n`);
    console.log('=' .repeat(80));
    
    usersSnapshot.forEach((doc, index) => {
      const user = doc.data();
      console.log(`\n👤 User #${index + 1}:`);
      console.log(`   🆔 ID: ${user.id || doc.id}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👨 Name: ${user.name}`);
      console.log(`   🎭 Role: ${user.role}`);
      console.log(`   🏢 Department: ${user.department || 'N/A'}`);
      console.log(`   📱 Phone: ${user.phone || 'N/A'}`);
      console.log(`   🟢 Status: ${user.status || 'N/A'}`);
      console.log(`   📅 Created: ${user.createdAt?.toDate?.() || 'N/A'}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('\n✅ Check complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking stock users:', error);
    process.exit(1);
  }
}

checkStockUsers();
