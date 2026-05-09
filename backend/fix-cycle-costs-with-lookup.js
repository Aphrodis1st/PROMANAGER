// Script to fix production cycles by looking up material costs from inventory
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'firebase-service-account.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function fixCycleCostsWithInventoryLookup() {
  console.log('🔧 Starting to fix production cycle costs with inventory lookup...\n');

  try {
    // Get all production cycles
    const cyclesSnapshot = await db.collection('productionCycles').get();
    
    if (cyclesSnapshot.empty) {
      console.log('❌ No production cycles found');
      return;
    }

    console.log(`📦 Found ${cyclesSnapshot.size} production cycles\n`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const doc of cyclesSnapshot.docs) {
      const cycle = doc.data();
      const cycleId = doc.id;

      console.log(`\n🔍 Checking cycle: ${cycleId}`);
      console.log(`   Product: ${cycle.productName || 'Unknown'}`);
      console.log(`   Status: ${cycle.status || 'Unknown'}`);

      // Check if material cost is missing or zero
      const currentMaterialCost = cycle.costSummary?.materialCost || 0;
      
      if (currentMaterialCost > 0) {
        console.log(`   ✅ Material cost already set: ${currentMaterialCost}`);
        skippedCount++;
        continue;
      }

      // Get consumed materials
      const consumedMaterials = cycle.consumedMaterials || [];
      
      if (consumedMaterials.length === 0) {
        console.log(`   ⚠️  No consumed materials found, skipping`);
        skippedCount++;
        continue;
      }

      console.log(`   📋 Processing ${consumedMaterials.length} materials...`);

      // Calculate material cost by looking up from inventory
      let materialCost = 0;
      const updatedMaterials = [];

      for (const material of consumedMaterials) {
        const materialId = material.materialId || material.productId;
        const qtyUsed = material.qtyUsed || material.quantity || 0;
        let unitCost = material.unitCost || material.costPerUnit || 0;

        console.log(`   🔎 Material: ${material.materialName}, ID: ${materialId}, Qty: ${qtyUsed}, Current Cost: ${unitCost}`);

        // If unitCost is 0 or undefined, look it up from inventory
        if (!unitCost || unitCost === 0) {
          // Try productSettings first
          const productSettingDoc = await db.collection('productSettings').doc(materialId).get();
          if (productSettingDoc.exists) {
            const productData = productSettingDoc.data();
            unitCost = productData.costPrice || productData.defaultBuyingPrice || productData.buyingPrice || 0;
            console.log(`      ✅ Found cost in productSettings: ${unitCost}`);
          }

          // Try products collection if still not found
          if (!unitCost || unitCost === 0) {
            const productDoc = await db.collection('products').doc(materialId).get();
            if (productDoc.exists) {
              const productData = productDoc.data();
              unitCost = productData.costPrice || productData.buyingPrice || 0;
              console.log(`      ✅ Found cost in products: ${unitCost}`);
            }
          }

          // Try purchases collection as last resort
          if (!unitCost || unitCost === 0) {
            const purchaseDoc = await db.collection('purchases').doc(materialId).get();
            if (purchaseDoc.exists) {
              const purchaseData = purchaseDoc.data();
              unitCost = purchaseData.unitPrice || purchaseData.buyingPrice || 0;
              console.log(`      ✅ Found cost in purchases: ${unitCost}`);
            }
          }
        }

        const totalCost = qtyUsed * unitCost;
        materialCost += totalCost;

        updatedMaterials.push({
          ...material,
          unitCost,
          totalCost,
        });

        console.log(`      💰 Final: ${qtyUsed} × ${unitCost} = ${totalCost}`);
      }

      console.log(`   📊 Total material cost: ${materialCost}`);

      // Update the cycle with correct costs
      const laborCost = cycle.costSummary?.laborCost || 0;
      const overheadCost = cycle.costSummary?.overheadCost || 0;
      const totalCost = materialCost + laborCost + overheadCost;
      const producedQty = cycle.producedQty || cycle.quantityCompleted || 0;
      const costPerUnit = producedQty > 0 ? totalCost / producedQty : 0;

      const updatedCostSummary = {
        materialCost,
        laborCost,
        overheadCost,
        totalCost,
        costPerUnit
      };

      await db.collection('productionCycles').doc(cycleId).update({
        costSummary: updatedCostSummary,
        consumedMaterials: updatedMaterials, // Update with costs
        materialCost, // Also store at root level
        updatedAt: new Date()
      });

      console.log(`   ✅ Updated cost summary:`, updatedCostSummary);
      fixedCount++;
    }

    console.log('\n\n📊 Summary:');
    console.log(`   ✅ Fixed: ${fixedCount} cycles`);
    console.log(`   ⏭️  Skipped: ${skippedCount} cycles`);
    console.log(`   📦 Total: ${cyclesSnapshot.size} cycles`);
    console.log('\n✅ Done!');

  } catch (error) {
    console.error('❌ Error fixing cycle costs:', error);
    throw error;
  }
}

// Run the script
fixCycleCostsWithInventoryLookup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
