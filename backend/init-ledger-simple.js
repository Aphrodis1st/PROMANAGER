import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function initializeInventoryLedger() {
  console.log('🚀 Starting inventory ledger initialization...');

  try {
    const productsSnapshot = await db.collection('productSettings').get();
    const purchasesSnapshot = await db.collection('purchases').get();

    console.log(`📦 Found ${productsSnapshot.size} products`);
    console.log(`📦 Found ${purchasesSnapshot.size} purchases`);

    let openingCount = 0;
    let purchaseCount = 0;

    // Initialize opening stock for all products
    for (const doc of productsSnapshot.docs) {
      const product = doc.data();
      const openingStock = Number(product.openingStock) || 0;
      const defaultBuyingPrice = Number(product.defaultBuyingPrice) || 0;

      if (openingStock > 0) {
        const ledgerRef = db.collection('inventoryLedger').doc();
        await ledgerRef.set({
          id: ledgerRef.id,
          productId: doc.id,
          transactionType: 'OPENING',
          transactionId: doc.id,
          transactionDate: product.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          quantity: openingStock,
          unitCost: defaultBuyingPrice,
          totalCost: openingStock * defaultBuyingPrice,
          remainingQuantity: openingStock,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        openingCount++;
        console.log(`✅ Added opening stock for ${product.name}: ${openingStock} units @ ${defaultBuyingPrice}`);
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
        purchaseCount++;
        console.log(`✅ Added purchase ledger entry: ${quantity} units @ ${unitPrice}`);
      }
    }

    console.log(`\n✅ Inventory ledger initialization completed!`);
    console.log(`   - Opening stock entries: ${openingCount}`);
    console.log(`   - Purchase entries: ${purchaseCount}`);
    console.log(`   - Total entries: ${openingCount + purchaseCount}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing inventory ledger:', error);
    process.exit(1);
  }
}

initializeInventoryLedger();
