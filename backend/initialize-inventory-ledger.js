// Initialize existing inventory into the ledger system
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function initializeInventoryLedger() {
  console.log('🚀 Starting inventory ledger initialization...');

  try {
    const productsSnapshot = await db.collection('productSettings').get();
    const purchasesSnapshot = await db.collection('purchases').get();
    const finishedGoodsSnapshot = await db.collection('finishedGoods').get();

    console.log(`📦 Found ${productsSnapshot.size} products`);
    console.log(`📦 Found ${purchasesSnapshot.size} purchases`);
    console.log(`📦 Found ${finishedGoodsSnapshot.size} finished goods`);

    // Initialize opening stock for all products
    for (const doc of productsSnapshot.docs) {
      const product = doc.data();
      const openingStock = Number(product.openingStock) || 0;

      if (openingStock > 0) {
        const ledgerRef = db.collection('inventoryLedger').doc();
        await ledgerRef.set({
          id: ledgerRef.id,
          productId: doc.id,
          transactionType: 'OPENING',
          transactionId: doc.id,
          transactionDate: product.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          quantity: openingStock,
          unitCost: Number(product.defaultBuyingPrice) || 0,
          totalCost: openingStock * (Number(product.defaultBuyingPrice) || 0),
          remainingQuantity: openingStock,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`✅ Added opening stock for ${product.name}: ${openingStock} units`);
      }
    }

    // Initialize purchases
    for (const doc of purchasesSnapshot.docs) {
      const purchase = doc.data();
      const quantity = Number(purchase.quantity) || 0;
      const unitPrice = Number(purchase.unitPrice) || 0;

      if (quantity > 0 && purchase.productId) {
        const ledgerRef = db.collection('inventoryLedger').doc();
        await ledgerRef.set({
          id: ledgerRef.id,
          productId: purchase.productId,
          transactionType: 'PURCHASE',
          transactionId: doc.id,
          transactionDate: purchase.createdAt?.toDate?.()?.toISOString() || purchase.date || new Date().toISOString(),
          quantity: quantity,
          unitCost: unitPrice,
          totalCost: quantity * unitPrice,
          remainingQuantity: quantity,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`✅ Added purchase ledger entry: ${quantity} units @ ${unitPrice}`);
      }
    }

    // Initialize finished goods that were added to inventory
    for (const doc of finishedGoodsSnapshot.docs) {
      const fg = doc.data();
      const quantity = Number(fg.quantityProduced) || 0;
      const unitCost = Number(fg.unitCost) || 0;

      if (quantity > 0 && fg.productId && fg.addedToInventory) {
        const ledgerRef = db.collection('inventoryLedger').doc();
        await ledgerRef.set({
          id: ledgerRef.id,
          productId: fg.productId,
          transactionType: 'PRODUCTION',
          transactionId: doc.id,
          transactionDate: fg.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          quantity: quantity,
          unitCost: unitCost,
          totalCost: quantity * unitCost,
          remainingQuantity: quantity,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`✅ Added production ledger entry: ${quantity} units @ ${unitCost}`);
      }
    }

    console.log('✅ Inventory ledger initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing inventory ledger:', error);
    process.exit(1);
  }
}

initializeInventoryLedger();
