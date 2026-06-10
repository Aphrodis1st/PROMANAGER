import { SalesModel } from '../../models/stock/sales.model.js';

export const CashierController = {
  completeSale: async (req, res) => {
    try {
      const { items, totalPrice, customerName, paymentMethod, paidAmount, change } = req.body;
      const userId = req.user?.id;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No items in cart' });
      }

      if (paidAmount < totalPrice) {
        return res.status(400).json({ error: 'Insufficient payment' });
      }

      const saleData = {
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          tax: item.tax,
          totalPrice: item.totalPrice,
        })),
        totalPrice,
        customerName,
        paymentMethod,
        paidAmount,
        change,
        userId,
        status: 'completed',
      };

      const saved = await SalesModel.create(saleData);
      
      res.status(201).json(saved);
    } catch (error) {
      console.error('Error completing sale:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getShiftSales: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user?.id;

      const allSales = await SalesModel.findAll();
      
      let sales = allSales.filter(sale => sale.userId === userId && sale.status === 'completed');
      
      if (startDate && endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        sales = sales.filter(sale => {
          const saleTime = new Date(sale.createdAt).getTime();
          return saleTime >= start && saleTime <= end;
        });
      }
      
      const totals = sales.reduce((acc, sale) => ({
        count: acc.count + 1,
        amount: acc.amount + (sale.totalPrice || 0),
        transactions: acc.transactions + 1,
      }), { count: 0, amount: 0, transactions: 0 });

      res.json({ sales, totals });
    } catch (error) {
      console.error('Error fetching shift sales:', error);
      res.status(500).json({ error: error.message });
    }
  },

  holdSale: async (req, res) => {
    try {
      const { items, totalPrice, customerName } = req.body;
      const userId = req.user?.id;

      const saleData = {
        items,
        totalPrice,
        customerName,
        userId,
        status: 'held',
        heldAt: new Date().toISOString(),
      };

      const saved = await SalesModel.create(saleData);
      res.status(201).json(saved);
    } catch (error) {
      console.error('Error holding sale:', error);
      res.status(500).json({ error: error.message });
    }
  },

  recallSale: async (req, res) => {
    try {
      const { saleId } = req.params;
      
      const sale = await SalesModel.findById(saleId);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      const updated = await SalesModel.update(saleId, { 
        status: 'recalled', 
        recalledAt: new Date().toISOString() 
      });

      res.json(updated);
    } catch (error) {
      console.error('Error recalling sale:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getHeldSales: async (req, res) => {
    try {
      const userId = req.user?.id;
      const allSales = await SalesModel.findAll();
      const sales = allSales.filter(sale => sale.userId === userId && sale.status === 'held');
      
      res.json(sales);
    } catch (error) {
      console.error('Error fetching held sales:', error);
      res.status(500).json({ error: error.message });
    }
  },

  generateReceipt: async (req, res) => {
    try {
      const { saleId } = req.params;
      
      const sale = await SalesModel.findById(saleId);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      const receiptContent = `
GBMA POS SYSTEM
========================================
Receipt #${sale.id}
Date: ${new Date(sale.createdAt).toLocaleString()}

ITEMS PURCHASED:
${sale.items.map(item => `
${item.productName}
  Qty: ${item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.totalPrice.toFixed(2)}
`).join('\n')}

========================================
Subtotal:        ${(sale.totalPrice - (sale.items.reduce((sum, i) => sum + (i.tax || 0), 0))).toFixed(2)}
Tax:             ${sale.items.reduce((sum, i) => sum + (i.tax || 0), 0).toFixed(2)}
Total:           ${sale.totalPrice.toFixed(2)}

Paid Amount:     ${sale.paidAmount.toFixed(2)}
Change:          ${sale.change.toFixed(2)}

Payment Method:  ${sale.paymentMethod}
Customer:        ${sale.customerName}
========================================
Thank you for your purchase!
      `;

      res.json({ receipt: receiptContent });
    } catch (error) {
      console.error('Error generating receipt:', error);
      res.status(500).json({ error: error.message });
    }
  },

  endShift: async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const userId = req.user?.id;

      const allSales = await SalesModel.findAll();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      const sales = allSales.filter(sale => {
        const saleTime = new Date(sale.createdAt).getTime();
        return sale.userId === userId && 
               sale.status === 'completed' && 
               saleTime >= start && 
               saleTime <= end;
      });

      const summary = {
        totalSales: sales.length,
        totalAmount: sales.reduce((sum, s) => sum + s.totalPrice, 0),
        byPaymentMethod: {},
      };

      sales.forEach(sale => {
        const method = sale.paymentMethod || 'Unknown';
        summary.byPaymentMethod[method] = (summary.byPaymentMethod[method] || 0) + sale.totalPrice;
      });

      res.json(summary);
    } catch (error) {
      console.error('Error ending shift:', error);
      res.status(500).json({ error: error.message });
    }
  },
};
