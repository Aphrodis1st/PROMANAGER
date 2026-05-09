import React, { useEffect, useState } from 'react';
import { useStock } from '../../context/stockContext';
import { usePurchase } from '../../context/PurchaseContext';
import { useProduction } from '../../context/ProductionContext';

export default function AttachRawMaterials({ plan, onClose }) {
  const { productSettings, products } = useStock();
  const { purchases } = usePurchase();
  const { startCycle } = useProduction();

  const [rawMaterials, setRawMaterials] = useState([]);
  const [selected, setSelected] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Extract raw materials from multiple sources
  // -------------------------
  useEffect(() => {
    console.log('🔍 RawMaterialSelector - Data sources:', {
      productSettings: productSettings?.length || 0,
      products: products?.length || 0,
      purchases: purchases?.length || 0,
    });

    const materials = [];

    // Helper to check if item is raw material based on STORE CATEGORY
    const isRawMaterial = (storeCategory) => {
      if (!storeCategory) return false; // Don't include uncategorized
      
      const cat = String(storeCategory).toLowerCase().trim();
      
      // Exclude finished products
      if (cat.includes('finished') || cat.includes('final')) return false;
      
      // Include raw materials
      if (cat === 'raw materials' || cat === 'raw material') return true;
      if (cat.includes('raw') && cat.includes('material')) return true;
      if (cat.includes('raw') || cat.includes('material')) return true;
      
      return false;
    };

    // 1. From productSettings (inventory items with stock)
    if (Array.isArray(productSettings) && productSettings.length > 0) {
      console.log('📦 Processing productSettings...');
      productSettings.forEach((item, index) => {
        const qty = Number(item.currentStock || item.openingStock || 0);
        const storeCategory = item.storeCategory || '';
        
        console.log(`Checking: ${item.name}, storeCategory: "${storeCategory}", qty: ${qty}`);
        
        if (qty > 0 && isRawMaterial(storeCategory)) {
          const price = Number(item.costPrice || item.defaultBuyingPrice || item.buyingPrice || 0);
          const displayCategory = item.productCategory || item.storeCategory || 'Uncategorized';
          
          materials.push({
            id: item.id || `product-${index}`,
            productId: item.id,
            materialId: item.id,
            name: item.name || '-',
            category: displayCategory,
            available: qty,
            unit: item.unit || 'pcs',
            costPerUnit: price,
            totalValue: (qty * price).toFixed(2),
            source: 'productSettings',
          });
          console.log(`✅ Added: ${item.name} as raw material`);
        } else if (qty > 0) {
          console.log(`❌ Skipped: ${item.name} (not raw material, storeCategory: "${storeCategory}")`);
        }
      });
      console.log(`✅ Added ${materials.length} raw materials from productSettings`);
    }

    // 2. From products (if different from productSettings)
    if (Array.isArray(products) && products.length > 0) {
      console.log('📦 Processing products...');
      const beforeCount = materials.length;
      products.forEach((item, index) => {
        const qty = Number(item.quantity || item.currentStock || 0);
        const category = item.category || '';
        
        if (qty > 0 && isRawMaterial(category) && !materials.find(m => m.id === item.id)) {
          const price = Number(item.buyingPrice || item.costPrice || 0);
          materials.push({
            id: item.id || `prod-${index}`,
            productId: item.id,
            materialId: item.id,
            name: item.name || '-',
            category: category || 'Uncategorized',
            available: qty,
            unit: item.unit || 'pcs',
            costPerUnit: price,
            totalValue: (qty * price).toFixed(2),
            source: 'products',
          });
        }
      });
      console.log(`✅ Added ${materials.length - beforeCount} raw materials from products`);
    }

    // 3. From purchases (as fallback)
    if (Array.isArray(purchases) && purchases.length > 0) {
      console.log('📦 Processing purchases...');
      const beforeCount = materials.length;
      purchases.forEach((item, index) => {
        const qty = Number(item.quantity || 0);
        const category = item.storeCategory?.name || item.storeCategory || item.category || '';
        
        if (qty > 0 && isRawMaterial(category) && !materials.find(m => m.id === item.id)) {
          const price = Number(item.unitPrice || item.buyingPrice || 0);
          materials.push({
            id: item.id || `purchase-${index}`,
            productId: item.productId || item.id,
            materialId: item.productId || item.id,
            name: item.productName || item.name || '-',
            category: category || 'Uncategorized',
            available: qty,
            unit: item.unit || 'pcs',
            costPerUnit: price,
            totalValue: (qty * price).toFixed(2),
            source: 'purchases',
          });
        }
      });
      console.log(`✅ Added ${materials.length - beforeCount} raw materials from purchases`);
    }

    console.log('🎯 Total raw materials found:', materials.length);
    if (materials.length > 0) {
      console.log('📋 Sample material:', materials[0]);
    }
    
    setRawMaterials(materials);
  }, [productSettings, products, purchases]);

  // -------------------------
  // Handle selection toggle
  // -------------------------
  const toggleSelect = (material) => {
    setSelected((prev) =>
      prev.some((s) => s.id === material.id)
        ? prev.filter((s) => s.id !== material.id)
        : [...prev, material]
    );
  };

  // -------------------------
  // Handle quantity change
  // -------------------------
  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: Number(value) }));
  };

  // -------------------------
  // Compute total cost
  // -------------------------
  const totalCost = selected.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + qty * item.costPerUnit;
  }, 0);

  // -------------------------
  // Attach materials and start production cycle
  // -------------------------
  const handleAttachAndStart = async () => {
    if (selected.length === 0) return alert('⚠️ No materials selected!');
    
    const hasInvalidQuantities = selected.some(m => !quantities[m.id] || quantities[m.id] <= 0);
    if (hasInvalidQuantities) {
      return alert('⚠️ Please enter valid quantities for all selected materials!');
    }

    setLoading(true);

    try {
      const materialsUsed = selected.map((m) => ({
        materialId: m.materialId || m.productId,
        productId: m.productId,
        productName: m.name,
        materialName: m.name,
        quantity: quantities[m.id] || 0,
        qtyUsed: quantities[m.id] || 0,
        costPerUnit: m.costPerUnit,
        totalCost: (quantities[m.id] || 0) * m.costPerUnit,
      }));

      await startCycle({
        planId: plan.id,
        rawMaterials: materialsUsed,
        consumedMaterials: materialsUsed,
      });

      alert('✅ Raw materials attached and cycle started!');
      onClose();
    } catch (err) {
      console.error('❌ Failed to attach raw materials:', err);
      alert(`❌ Failed to start cycle: ${err.message || 'Check console for details'}`);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white relative'>
          <button
            className='absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors'
            onClick={onClose}
            disabled={loading}
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
          <h2 className='text-2xl font-bold mb-2'>
            Attach Raw Materials
          </h2>
          <p className='text-teal-100 text-sm'>
            Production Plan: <span className='font-semibold'>{plan?.planName || plan?.id}</span>
          </p>
        </div>

        {/* Content */}
        <div className='p-6 max-h-[70vh] overflow-y-auto'>
          {/* Info */}
          <div className='bg-blue-50 border border-blue-200 text-blue-700 p-4 mb-6 rounded-lg flex items-start gap-3'>
            <svg className='w-5 h-5 mt-0.5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
            </svg>
            <div>
              <p className='font-semibold'>Available Materials: {rawMaterials?.length || 0}</p>
              <p className='text-sm mt-1'>Select materials and enter quantities to attach to this production cycle.</p>
              {rawMaterials.length > 0 && (
                <p className='text-xs mt-1 text-blue-600'>✓ Materials loaded from inventory</p>
              )}
            </div>
          </div>

          {rawMaterials.length === 0 ? (
            <div className='text-center py-12 bg-gray-50 rounded-lg'>
              <svg className='w-16 h-16 mx-auto text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
              </svg>
              <p className='text-lg font-semibold text-gray-700 mb-2'>No materials available</p>
              <p className='text-sm text-gray-500 mb-4'>
                No inventory items found with available stock.
              </p>
              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto text-left'>
                <p className='text-sm font-semibold text-yellow-800 mb-2'>🔍 Troubleshooting:</p>
                <ul className='text-xs text-yellow-700 space-y-1'>
                  <li>• Check browser console (F12) for data source counts</li>
                  <li>• Verify inventory page shows items with stock &gt; 0</li>
                  <li>• Ensure items have cost/buying price set</li>
                  <li>• Try refreshing the page</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className='border border-gray-200 rounded-lg overflow-hidden'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-100 border-b border-gray-200'>
                  <tr>
                    <th className='px-4 py-3 text-left font-semibold text-gray-700'>Material</th>
                    <th className='px-4 py-3 text-left font-semibold text-gray-700'>Category</th>
                    <th className='px-4 py-3 text-right font-semibold text-gray-700'>Available</th>
                    <th className='px-4 py-3 text-center font-semibold text-gray-700'>Quantity</th>
                    <th className='px-4 py-3 text-right font-semibold text-gray-700'>Cost/Unit</th>
                    <th className='px-4 py-3 text-right font-semibold text-gray-700'>Total</th>
                    <th className='px-4 py-3 text-center font-semibold text-gray-700'>Select</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {rawMaterials.map((m, idx) => (
                    <tr key={m.id} className={`hover:bg-teal-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className='px-4 py-3 font-medium text-gray-900'>{m.name}</td>
                      <td className='px-4 py-3 text-gray-600'>
                        <span className='inline-block px-2 py-1 bg-gray-200 rounded text-xs'>{m.category}</span>
                      </td>
                      <td className='px-4 py-3 text-right text-gray-700'>
                        <span className='font-semibold'>{m.available}</span> {m.unit}
                      </td>
                      <td className='px-4 py-3'>
                        <input
                          type='number'
                          min='0'
                          max={m.available}
                          step='0.01'
                          className='border border-gray-300 w-28 px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-center'
                          value={quantities[m.id] || ''}
                          onChange={(e) => handleQuantityChange(m.id, e.target.value)}
                          placeholder='0'
                        />
                      </td>
                      <td className='px-4 py-3 text-right text-gray-700'>
                        {m.costPerUnit.toFixed(2)} RWF
                      </td>
                      <td className='px-4 py-3 text-right font-semibold text-gray-900'>
                        {((quantities[m.id] || 0) * m.costPerUnit).toFixed(2)} RWF
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <input
                          type='checkbox'
                          checked={selected.some((s) => s.id === m.id)}
                          onChange={() => toggleSelect(m)}
                          className='w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer'
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center'>
          <div className='space-y-1'>
            <p className='text-sm text-gray-600'>
              Materials Selected: <span className='font-bold text-gray-900'>{selected.length}</span>
            </p>
            <p className='text-lg font-bold text-teal-700'>
              Total Cost: {totalCost.toFixed(2)} RWF
            </p>
          </div>
          <div className='flex gap-3'>
            <button
              className='px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium'
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleAttachAndStart}
              className='px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2'
              disabled={loading || selected.length === 0}
            >
              {loading ? (
                <>
                  <svg className='animate-spin h-5 w-5' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                  Attach & Start Cycle
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
