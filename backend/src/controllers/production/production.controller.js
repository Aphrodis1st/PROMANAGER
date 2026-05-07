import { ProductionPlanModel } from "../../models/production/productionPlan.model.js";
import { ProductionCycleModel } from "../../models/production/productionCycle.model.js";
import { QualityInspectionModel } from "../../models/production/qualityInspection.model.js";
import { FinishedGoodModel } from "../../models/production/finishedGood.model.js";
import { MaterialConsumptionModel } from "../../models/production/materialConsumption.model.js";
import { ProductionCounterModel } from "../../models/production/productionCounter.model.js";
import { ProductModel } from "../../models/stock/product.model.js";
import { ProductSettingModel } from "../../models/stock/productSetting.model.js";
import JournalModel from "../../models/stock/journal.model.js";
import { PurchaseModel } from "../../models/stock/purchase.model.js";
import admin from "firebase-admin";

export const ProductionController = {
  // --- 🧩 PLANS ---
  async createPlan(req, res) {
    try {
      // Generate sequential plan number
      const planCode = await ProductionCounterModel.getNextPlanNumber();
      console.log("Generated plan number:", planCode);

      const plan = await ProductionPlanModel.create({
        ...req.body,
        planCode,
      });
      res.status(201).json({ success: true, data: { plan } });
    } catch (err) {
      console.error("❌ Error creating plan:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async listPlans(req, res) {
    try {
      const plans = await ProductionPlanModel.findAll();
      res.json({ success: true, data: { plans } });
    } catch (err) {
      console.error("❌ Error listing plans:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getPlan(req, res) {
    try {
      const { id } = req.params;
      const plan = await ProductionPlanModel.findById(id);
      if (!plan)
        return res.status(404).json({ success: false, error: "Plan not found" });

      const cycles = await ProductionCycleModel.findByPlan(id);
      res.json({ success: true, data: { plan, cycles } });
    } catch (err) {
      console.error("❌ Error getting plan:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async updatePlan(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!id)
        return res.status(400).json({ success: false, error: "Plan ID is required" });
      if (!data || Object.keys(data).length === 0)
        return res.status(400).json({ success: false, error: "Update data is empty" });

      const existingPlan = await ProductionPlanModel.findById(id);
      if (!existingPlan)
        return res.status(404).json({ success: false, error: `Plan with ID ${id} not found` });

      const updated = await ProductionPlanModel.update(id, data);
      res.json({ success: true, data: { plan: updated } });
    } catch (err) {
      console.error("❌ Error in updatePlan:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async approvePlan(req, res) {
    try {
      const { id } = req.params;
      const plan = await ProductionPlanModel.findById(id);
      if (!plan)
        return res.status(404).json({ success: false, error: `Plan with ID ${id} not found` });

      if (plan.status === "approved")
        return res.status(400).json({ success: false, error: "Plan is already approved" });

      const updatedPlan = await ProductionPlanModel.update(id, { status: "approved" });
      res.json({ success: true, data: { plan: updatedPlan } });
    } catch (err) {
      console.error("❌ Error approving plan:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // --- ⚙️ CYCLES ---
  async listCycles(req, res) {
    try {
      const cycles = await ProductionCycleModel.findAll();
      res.json({ success: true, data: { cycles } });
    } catch (err) {
      console.error("❌ Error fetching cycles:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async startCycle(req, res) {
    console.log("🟢 startCycle called with body:", req.body);
    try {
      const { planId, plannedQtyOverride, consumedMaterials } = req.body;

      if (!planId) {
        console.error("❌ planId is required");
        return res.status(400).json({ success: false, error: "planId is required" });
      }

      const plan = await ProductionPlanModel.findById(planId);
      console.log("Fetched plan:", plan);

      if (!plan)
        return res.status(404).json({ success: false, error: "Plan not found" });

      if (plan.status !== "approved")
        return res.status(400).json({ success: false, error: "Plan must be approved to start a cycle" });

      if (!plan.finishedProductId)
        return res.status(400).json({ success: false, error: "Finished product not set for this plan" });

      // Generate sequential cycle/batch number
      const batchNo = await ProductionCounterModel.getNextCycleNumber();
      console.log("Generated cycle/batch number:", batchNo);

      const produceQty = plannedQtyOverride || plan.plannedQty;
      console.log("Produce quantity:", produceQty);

      const consumptionList = [];

      if (Array.isArray(consumedMaterials) && consumedMaterials.length > 0) {
        console.log("Using frontend-provided raw materials:", consumedMaterials);
        for (const item of consumedMaterials) {
          console.log("Processing raw material item:", item);

          // --- Try fetching from multiple sources ---
          let product = null;
          let source = null;

          // 1. Try productSettings (inventory)
          product = await ProductSettingModel.findById(item.materialId || item.productId);
          if (product) {
            source = "productSettings";
            console.log(`✅ Found in productSettings: ${item.productName}`);
          }

          // 2. Try products
          if (!product) {
            product = await ProductModel.findById(item.materialId || item.productId);
            if (product) {
              source = "product";
              console.log(`✅ Found in products: ${item.productName}`);
            }
          }

          // 3. Try purchases
          if (!product) {
            product = await PurchaseModel.findById(item.materialId || item.productId);
            if (product) {
              source = "purchase";
              console.log(`✅ Found in purchases: ${item.productName}`);
            }
          }

          if (!product) {
            console.error(`❌ Product not found in any collection: ${item.productName}`);
            return res.status(400).json({
              success: false,
              error: `Raw material "${item.productName}" not found in inventory, products, or purchases`,
            });
          }

          const qtyUsed = item.quantity || item.qtyUsed || 0;
          console.log(`Quantity to use: ${qtyUsed}, Source: ${source}`);

          // --- Adjust stock based on source ---
          try {
            if (source === "productSettings") {
              console.log(`Adjusting stock in productSettings for ${item.productName}`);
              await ProductSettingModel.adjustStock(product.id, -qtyUsed);
            } else if (source === "product") {
              console.log(`Adjusting stock in products for ${item.productName}`);
              await ProductModel.adjustStock(product.id, -qtyUsed);
            } else if (source === "purchase") {
              console.log(`Adjusting stock in purchases for ${item.productName}`);
              await PurchaseModel.adjustStock(product.id, -qtyUsed);
            }
          } catch (stockError) {
            console.error(`❌ Stock adjustment failed for ${item.productName}:`, stockError);
            return res.status(400).json({
              success: false,
              error: `Insufficient stock for ${item.productName}. ${stockError.message}`,
            });
          }

          const unitCost = item.costPerUnit || product.costPrice || product.defaultBuyingPrice || 0;
          const entry = {
            materialId: product.id,
            materialName: item.materialName || item.productName,
            qtyUsed,
            unitCost,
            totalCost: qtyUsed * unitCost,
          };
          consumptionList.push(entry);
          await MaterialConsumptionModel.create({ cycleId: planId, ...entry });
        }
      } else {
        console.log("No frontend raw materials provided, calculating from BOM");
        for (const item of plan.bom) {
          const product = await ProductModel.findById(item.materialId);
          const requiredQty = item.qtyPerUnit * produceQty;

          if (!product || product.currentStock < requiredQty)
            return res.status(400).json({ success: false, error: `Insufficient ${item.materialName} for production` });

          await ProductModel.adjustStock(item.materialId, -requiredQty);

          const entry = {
            materialId: item.materialId,
            materialName: item.materialName,
            qtyUsed: requiredQty,
            unitCost: product.costPrice,
            totalCost: requiredQty * product.costPrice,
          };
          consumptionList.push(entry);
          await MaterialConsumptionModel.create({ cycleId: planId, ...entry });
        }
      }

      const totalMaterialCost = consumptionList.reduce((sum, c) => sum + c.totalCost, 0);
      console.log("Total material cost:", totalMaterialCost);

      const cycle = await ProductionCycleModel.create({
        planId,
        batchNo,
        consumedMaterials: consumptionList,
        costSummary: { materialCost: totalMaterialCost },
      });

      await ProductionPlanModel.update(planId, { status: "in_progress" });
      console.log("Cycle started successfully:", cycle);

      res.status(201).json({ success: true, data: { cycle } });
    } catch (err) {
      console.error("❌ Error starting cycle:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },


async completeCycle(req, res) {
  console.log("🟢 completeCycle called with:", req.body);

  try {
    const { cycleId, producedQty, laborCost = 0, overheadCost = 0, consumedMaterials = [] } = req.body;

    if (!cycleId || !producedQty) {
      return res
        .status(400)
        .json({ success: false, error: "cycleId and producedQty are required" });
    }

    // --- Fetch cycle ---
    console.log("Fetching cycle...");
    const cycle = await ProductionCycleModel.findById(cycleId);
    if (!cycle)
      return res
        .status(404)
        .json({ success: false, error: `Cycle ${cycleId} not found` });
    console.log("Cycle found:", cycle);

    // --- Fetch plan ---
    console.log("Fetching plan...");
    const plan = await ProductionPlanModel.findById(cycle.planId);
    if (!plan)
      return res
        .status(404)
        .json({ success: false, error: `Plan ${cycle.planId} not found` });
    console.log("Plan found:", plan);

    // --- Fetch or create finished product ---
    console.log("Fetching finished product...");
    let finishedProduct = await ProductSettingModel.findById(plan.finishedProductId);
    let productSource = "productSettings";

    if (!finishedProduct) {
      console.log("Not found in productSettings, checking products...");
      finishedProduct = await ProductModel.findById(plan.finishedProductId);
      productSource = "products";
    }

    if (!finishedProduct) {
      console.log(
        `Finished product not found (${plan.finishedProductId}), creating in productSettings...`
      );
      finishedProduct = await ProductSettingModel.create({
        name: plan.finishedProductName,
        currentStock: 0,
        openingStock: 0,
        defaultBuyingPrice: 0,
        defaultSellingPrice: 0,
        type: "Product",
        status: "Active",
        storeCategory: "Finished Products",
        productCategory: "Finished Products",
      });
      productSource = "productSettings";
      console.log("Finished product created in productSettings:", finishedProduct);
    } else if (productSource === "productSettings" && !finishedProduct.storeCategory) {
      // Update existing product to set storeCategory if missing
      await ProductSettingModel.update(finishedProduct.id, {
        storeCategory: "Finished Products",
        productCategory: finishedProduct.productCategory || "Finished Products",
      });
      finishedProduct.storeCategory = "Finished Products";
      console.log("Updated product with storeCategory: Finished Products");
    }

    // --- Calculate total material cost from frontend-provided consumedMaterials ---
    const materialCost = consumedMaterials.reduce(
      (sum, c) => sum + (c.totalCost || 0),
      0
    );
    const totalCost = materialCost + laborCost + overheadCost;
    const costPerUnit = producedQty > 0 ? totalCost / producedQty : 0;

    // --- Adjust stock for finished product ---
    if (productSource === "productSettings") {
      await ProductSettingModel.adjustStock(finishedProduct.id, producedQty);
      console.log(
        `Stock adjusted in productSettings for finished product (${finishedProduct.name}): +${producedQty}`
      );
    } else {
      await ProductModel.adjustStock(finishedProduct.id, producedQty);
      console.log(
        `Stock adjusted in products for finished product (${finishedProduct.name}): +${producedQty}`
      );
    }

    // --- Create Finished Goods record ---
    const fg = await FinishedGoodModel.create({
      cycleId,
      planId: plan.id,
      productId: finishedProduct.id,
      productName: finishedProduct.name,
      quantityProduced: producedQty,
      unitCost: costPerUnit,
      totalCost,
      materialCost,
      laborCost,
      overheadCost,
    });
    console.log("Finished Good created:", fg);

    // --- Update Production Cycle with full cost info ---
    const updatedCycle = await ProductionCycleModel.update(cycleId, {
      producedQty,
      quantityCompleted: producedQty,
      status: "completed",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      costSummary: {
        materialCost,
        laborCost,
        overheadCost,
        totalCost,
        costPerUnit,
      },
      consumedMaterials, // persist frontend-sent rawMaterials
    });
    console.log("Cycle updated to completed with cost details:", updatedCycle);

    // --- Create Journal Entry ---
    await JournalModel.create({
      date: admin.firestore.Timestamp.now(),
      description: `Production completed for ${finishedProduct.name}`,
      lines: [
        {
          accountName: "Finished Goods Inventory",
          type: "debit",
          amount: totalCost,
        },
        {
          accountName: "Raw Materials / WIP",
          type: "credit",
          amount: totalCost,
        },
      ],
      source: { type: "production", id: cycleId },
      reference: plan.planCode,
      meta: { rawMaterials: consumedMaterials }, // include frontend-provided raw materials
    });
    console.log("Journal entry created");

    res.json({
      success: true,
      message: "Production cycle completed successfully",
      data: {
        finishedGood: fg,
        cycle: updatedCycle,
        totalCost,
        costPerUnit,
        materialCost,
        laborCost,
        overheadCost,
      },
    });
  } catch (err) {
    console.error("❌ Error completing cycle:", err);
    res.status(500).json({ success: false, error: err.message });
  }
},

  // --- 🔍 QUALITY INSPECTION ---
  async createInspection(req, res) {
    try {
      const inspection = await QualityInspectionModel.create(req.body);
      res.status(201).json({ success: true, data: { inspection } });
    } catch (err) {
      console.error("❌ Error creating inspection:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async listFinishedGoods(req, res) {
    try {
      const finishedGoods = await FinishedGoodModel.findAll();
      res.json({ success: true, data: { finishedGoods } });
    } catch (err) {
      console.error("❌ Error listing finished goods:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getInspections(req, res) {
    try {
      const { cycleId } = req.query;
      const inspections = await QualityInspectionModel.findByCycle(cycleId);
      res.json({ success: true, data: { inspections } });
    } catch (err) {
      console.error("❌ Error getting inspections:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // --- 📊 REPORTS ---
  async getProductionSummary(req, res) {
    try {
      const cycles = await ProductionCycleModel.findAll();
      const summary = cycles.map((c) => ({
        planId: c.planId,
        producedQty: c.producedQty,
        totalCost: c.costSummary?.totalCost || 0,
        status: c.status,
      }));
      res.json({ success: true, data: { summary } });
    } catch (err) {
      console.error("❌ Error generating summary:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // --- 📦 MIGRATE FINISHED GOODS TO INVENTORY ---
  async migrateToInventory(req, res) {
    console.log("🟢 migrateToInventory called with:", req.body);
    try {
      const { cycleId } = req.body;

      if (!cycleId) {
        return res.status(400).json({ success: false, error: "cycleId is required" });
      }

      // Find the cycle
      const cycle = await ProductionCycleModel.findById(cycleId);
      if (!cycle) {
        return res.status(404).json({ success: false, error: "Cycle not found" });
      }

      if (cycle.status !== "completed") {
        return res.status(400).json({ success: false, error: "Only completed cycles can be migrated to inventory" });
      }

      // Find the finished good record
      const finishedGoods = await FinishedGoodModel.findByCycle(cycleId);
      if (!finishedGoods || finishedGoods.length === 0) {
        return res.status(404).json({ success: false, error: "Finished good record not found" });
      }

      const finishedGood = finishedGoods[0];

      // Check if already migrated
      if (finishedGood.addedToInventory) {
        return res.status(400).json({ success: false, error: "This finished good has already been migrated to inventory" });
      }

      // Find the product in productSettings
      let product = await ProductSettingModel.findById(finishedGood.productId);
      let productSource = "productSettings";
      
      if (!product) {
        // Try to find in products collection
        product = await ProductModel.findById(finishedGood.productId);
        productSource = "products";
        
        if (!product) {
          return res.status(404).json({ success: false, error: "Product not found in inventory" });
        }
      }

      // Ensure the product has the correct storeCategory
      if (productSource === "productSettings") {
        if (!product.storeCategory || product.storeCategory !== "Finished Products") {
          await ProductSettingModel.update(product.id, {
            storeCategory: "Finished Products",
            productCategory: product.productCategory || "Finished Products",
          });
          console.log(`Updated product ${product.name} with storeCategory: Finished Products`);
        }
      }

      // Update the finished good record
      await FinishedGoodModel.update(finishedGood.id, {
        addedToInventory: true,
        migratedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create journal entry for the migration
      await JournalModel.create({
        date: admin.firestore.Timestamp.now(),
        description: `Finished goods migrated to inventory: ${finishedGood.productName}`,
        lines: [
          {
            accountName: "Finished Goods Inventory",
            type: "debit",
            amount: finishedGood.totalCost,
          },
          {
            accountName: "Production Account",
            type: "credit",
            amount: finishedGood.totalCost,
          },
        ],
        source: { type: "production_migration", id: cycleId },
        reference: cycle.batchNo,
        meta: { 
          productId: finishedGood.productId,
          productName: finishedGood.productName,
          quantity: finishedGood.quantityProduced,
          unitCost: finishedGood.unitCost,
        },
      });

      console.log("✅ Finished good migrated to inventory successfully");

      res.json({
        success: true,
        message: "Finished good migrated to inventory successfully",
        data: {
          finishedGood: {
            ...finishedGood,
            addedToInventory: true,
          },
          product,
        },
      });
    } catch (err) {
      console.error("❌ Error migrating to inventory:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
