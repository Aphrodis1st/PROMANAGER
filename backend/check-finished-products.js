// check-finished-products.js
// Run this script to check which products have storeCategory = "Finished Products"

import { initFirebase, db } from './utils/firebase.js';

async function checkFinishedProducts() {
  console.log('\n🔍 Checking Finished Products in Database...\n');
  
  try {
    await initFirebase();
    const firestore = db();
    
    // Get all productSettings
    const productsSnapshot = await firestore.collection('productSettings').get();
    console.log(`📦 Total products in productSettings: ${productsSnapshot.size}\n`);
    
    const finishedProducts = [];
    const allProducts = [];
    
    productsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      allProducts.push({
        id: doc.id,
        name: data.name,
        storeCategory: data.storeCategory || 'NOT SET',
        productCategory: data.productCategory || 'NOT SET',
        currentStock: data.currentStock || 0,
        openingStock: data.openingStock || 0
      });
      
      if (data.storeCategory === 'Finished Products') {
        finishedProducts.push({
          id: doc.id,
          name: data.name,
          storeCategory: data.storeCategory,
          productCategory: data.productCategory,
          currentStock: data.currentStock,
          openingStock: data.openingStock
        });
      }
    });
    
    console.log('='.repeat(70));
    console.log('✅ FINISHED PRODUCTS (storeCategory = "Finished Products")');
    console.log('='.repeat(70));
    
    if (finishedProducts.length === 0) {
      console.log('\n❌ No products found with storeCategory = "Finished Products"\n');
    } else {
      console.log(`\n✅ Found ${finishedProducts.length} finished products:\n`);
      
      finishedProducts.forEach((p, index) => {
        console.log(`${index + 1}. 📦 ${p.name}`);
        console.log(`   ID: ${p.id}`);
        console.log(`   Store Category: "${p.storeCategory}"`);
        console.log(`   Product Category: "${p.productCategory}"`);
        console.log(`   Current Stock: ${p.currentStock}`);
        console.log(`   Opening Stock: ${p.openingStock}`);
        console.log('');
      });
    }
    
    console.log('='.repeat(70));
    console.log('📊 CATEGORY BREAKDOWN');
    console.log('='.repeat(70));
    
    const categoryCount = {};
    allProducts.forEach(p => {
      const cat = p.storeCategory;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    console.log('\nProducts by storeCategory:');
    Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('🔍 SAMPLE PRODUCTS (first 5)');
    console.log('='.repeat(70) + '\n');
    
    allProducts.slice(0, 5).forEach((p, index) => {
      console.log(`${index + 1}. ${p.name}`);
      console.log(`   Store Category: "${p.storeCategory}"`);
      console.log(`   Product Category: "${p.productCategory}"`);
      console.log(`   Stock: ${p.currentStock}`);
      console.log('');
    });
    
    console.log('='.repeat(70));
    console.log('💡 RECOMMENDATIONS');
    console.log('='.repeat(70));
    
    if (finishedProducts.length === 0) {
      console.log('\n⚠️  No finished products found!');
      console.log('   Run: node fix-finished-products-category.js');
    } else {
      console.log(`\n✅ ${finishedProducts.length} finished products are correctly categorized`);
      console.log('   They should appear in the inventory "Finished Products" tab');
      console.log('\n📝 Next steps:');
      console.log('   1. Go to http://localhost:5173/stock/inventory');
      console.log('   2. Click "Refresh" button');
      console.log('   3. Click "Finished Products" tab');
      console.log('   4. You should see the products listed above');
    }
    
    console.log('\n' + '='.repeat(70) + '\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the script
checkFinishedProducts();
