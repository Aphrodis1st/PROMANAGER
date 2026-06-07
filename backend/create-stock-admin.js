import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { initFirebase, db } from './utils/firebase.js';

dotenv.config({ path: '.env.development' });

const ADMIN_EMAIL = process.env.STOCK_ADMIN_EMAIL || 'stock.admin@gbma.tech';
const ADMIN_PASSWORD = process.env.STOCK_ADMIN_PASSWORD || 'GbmaAdmin123!';

async function createOrUpdateStockAdmin() {
  await initFirebase();

  const users = db().collection('users');
  const existing = await users.where('email', '==', ADMIN_EMAIL).limit(1).get();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const now = new Date();

  const adminData = {
    name: 'Stock Admin',
    email: ADMIN_EMAIL,
    passwordHash,
    role: 'ADMIN',
    department: 'Stock Management',
    phone: null,
    status: 'OFFLINE',
    updatedAt: now,
  };

  if (existing.empty) {
    const doc = await users.add({
      ...adminData,
      createdAt: now,
    });
    console.log(`Created stock admin: ${ADMIN_EMAIL}`);
    console.log(`User ID: ${doc.id}`);
    return;
  }

  const doc = existing.docs[0];
  await doc.ref.update(adminData);
  console.log(`Updated stock admin: ${ADMIN_EMAIL}`);
  console.log(`User ID: ${doc.id}`);
}

createOrUpdateStockAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to create/update stock admin:', error);
    process.exit(1);
  });
