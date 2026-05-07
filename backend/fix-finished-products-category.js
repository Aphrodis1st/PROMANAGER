// fix-finished-products-category.js
// Run this script to fix existing finished products that don't have storeCategory set

import { initFirebase, db } from './utils/firebase.js';
import admin from 'firebase-admin';

async function fixFinishedProductsCategory() {
  console.log('🔧 Starting to fix finished products categories...\n');

  try {
    // Initialize Firebase
    await initFirebase();
    const firestore = db();

    // Get all finished goods
    const finishedGoodsSnapshot = await firestore.collection('finishedGoods').get();
    console.log(`📦 Found ${finishedGoodsSnapshot.size} finished goods records\n`);

    let updatedCount = 0;
    let alreadyCorrectCount = 0;
    let notFoundCount = 0;

    for (const fgDoc of finishedGoodsSnapshot.docs) {
      const fg = fgDoc.data();
      console.log(`\n📝 Processing: ${fg.productName} (Product ID: ${fg.productId})`);

      // Find the product in productSettings
      const productDoc = await firestore.collection('productSettings').doc(fg.productId).get();

      if (!productDoc.exists) {
        console.log(`   ❌ Product not found in productSettings`);
        notFoundCount++;
        continue;
      }

      const product = productDoc.data();
      console.log(`   Current storeCategory: "${product.storeCategory || 'NOT SET'}"`);
      console.log(`   Current productCategory: "${product.productCategory || 'NOT SET'}"`);
      console.log(`   Current stock: ${product.currentStock || 0}`);

      // Check if needs update
      if (product.storeCategory === 'Finished Products' && 
          product.productCategory === 'Finished Products') {
        console.log(`   ✅ Already correct - no update needed`);
        alreadyCorrectCount++;
        continue;
      }

      // Update the product
      await firestore.collection('productSettings').doc(fg.productId).update({
        storeCategory: 'Finished Products',
        productCategory: 'Finished Products',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`   ✅ UPDATED to storeCategory: "Finished Products"`);
      updatedCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY:');
    console.log('='.repeat(60));
    console.log(`Total finished goods: ${finishedGoodsSnapshot.size}`);
    console.log(`✅ Updated: ${updatedCount}`);
    console.log(`✓  Already correct: ${alreadyCorrectCount}`);
    console.log(`❌ Not found: ${notFoundCount}`);
    console.log('='.repeat(60));
    console.log('\n✨ Done! You can now check the inventory page.\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the script
fixFinishedProductsCategory();
