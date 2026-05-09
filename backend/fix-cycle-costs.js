// Script to fix existing production cycles with missing material costs
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

async function fixCycleCosts() {
  console.log('🔧 Starting to fix production cycle costs...\n');

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

      // Calculate material cost from consumedMaterials
      const consumedMaterials = cycle.consumedMaterials || [];
      
      if (consumedMaterials.length === 0) {
        console.log(`   ⚠️  No consumed materials found, skipping`);
        skippedCount++;
        continue;
      }

      const materialCost = consumedMaterials.reduce((sum, material) => {
        // Try multiple ways to calculate cost
        let cost = 0;
        
        if (material.totalCost && material.totalCost > 0) {
          cost = material.totalCost;
        } else if (material.qtyUsed && material.unitCost) {
          cost = material.qtyUsed * material.unitCost;
        } else if (material.quantity && material.costPerUnit) {
          cost = material.quantity * material.costPerUnit;
        }
        
        console.log(`   Material: ${material.materialName || 'Unknown'}, qty: ${material.qtyUsed || material.quantity}, unitCost: ${material.unitCost || material.costPerUnit}, cost: ${cost}`);
        return sum + cost;
      }, 0);

      console.log(`   📊 Calculated material cost: ${materialCost}`);
      console.log(`   📋 Materials used: ${consumedMaterials.length}`);

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
        materialCost, // Also store at root level for easy access
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
fixCycleCosts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
