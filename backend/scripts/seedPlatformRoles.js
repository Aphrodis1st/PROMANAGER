import dotenv from 'dotenv';
import { initFirebase } from '../utils/firebase.js';
import { seedSuperAdminRoleAndUser } from '../src/services/platformRoleSeed.service.js';

dotenv.config({ path: '.env' });

async function main() {
  try {
    await initFirebase();
    const result = await seedSuperAdminRoleAndUser();
    console.log('✅ SUPER_ADMIN role seeded');
    console.log('Role ID:', result.role.id);
    console.log('User ID:', result.userId);
    console.log('Email: superadmin@madsmart.com');
    console.log('Password: SuperAdmin123!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
