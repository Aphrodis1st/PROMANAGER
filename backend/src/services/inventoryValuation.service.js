import { InventoryLedgerModel } from "../models/stock/inventoryLedger.model.js";

export const InventoryValuationService = {
  async consumeStockFIFO(productId, quantityToConsume) {
    const batches = await InventoryLedgerModel.findByProduct(productId);
    
    let remainingToConsume = quantityToConsume;
    let totalCost = 0;
    const consumedBatches = [];

    for (const batch of batches) {
      if (remainingToConsume <= 0) break;

      const consumeFromBatch = Math.min(batch.remainingQuantity, remainingToConsume);
      const costFromBatch = consumeFromBatch * batch.unitCost;

      totalCost += costFromBatch;
      remainingToConsume -= consumeFromBatch;

      const newRemainingQty = batch.remainingQuantity - consumeFromBatch;
      await InventoryLedgerModel.updateRemainingQuantity(batch.id, newRemainingQty);

      consumedBatches.push({
        batchId: batch.id,
        consumed: consumeFromBatch,
        unitCost: batch.unitCost,
        costFromBatch,
      });
    }

    if (remainingToConsume > 0) {
      throw new Error(`Insufficient stock. Short by ${remainingToConsume} units`);
    }

    return {
      totalCost,
      averageCost: totalCost / quantityToConsume,
      consumedBatches,
    };
  },

  async consumeStockLIFO(productId, quantityToConsume) {
    const batches = await InventoryLedgerModel.findByProduct(productId);
    batches.reverse();

    let remainingToConsume = quantityToConsume;
    let totalCost = 0;
    const consumedBatches = [];

    for (const batch of batches) {
      if (remainingToConsume <= 0) break;

      const consumeFromBatch = Math.min(batch.remainingQuantity, remainingToConsume);
      const costFromBatch = consumeFromBatch * batch.unitCost;

      totalCost += costFromBatch;
      remainingToConsume -= consumeFromBatch;

      const newRemainingQty = batch.remainingQuantity - consumeFromBatch;
      await InventoryLedgerModel.updateRemainingQuantity(batch.id, newRemainingQty);

      consumedBatches.push({
        batchId: batch.id,
        consumed: consumeFromBatch,
        unitCost: batch.unitCost,
        costFromBatch,
      });
    }

    if (remainingToConsume > 0) {
      throw new Error(`Insufficient stock. Short by ${remainingToConsume} units`);
    }

    return {
      totalCost,
      averageCost: totalCost / quantityToConsume,
      consumedBatches,
    };
  },

  async getInventoryValueFIFO(productId) {
    const batches = await InventoryLedgerModel.findByProduct(productId);
    
    let totalQuantity = 0;
    let totalValue = 0;

    for (const batch of batches) {
      totalQuantity += batch.remainingQuantity;
      totalValue += batch.remainingQuantity * batch.unitCost;
    }

    return {
      quantity: totalQuantity,
      value: totalValue,
      averageCost: totalQuantity > 0 ? totalValue / totalQuantity : 0,
    };
  },

  async getInventoryValueLIFO(productId) {
    const batches = await InventoryLedgerModel.findByProduct(productId);
    batches.reverse();
    
    let totalQuantity = 0;
    let totalValue = 0;

    for (const batch of batches) {
      totalQuantity += batch.remainingQuantity;
      totalValue += batch.remainingQuantity * batch.unitCost;
    }

    return {
      quantity: totalQuantity,
      value: totalValue,
      averageCost: totalQuantity > 0 ? totalValue / totalQuantity : 0,
    };
  },
};
