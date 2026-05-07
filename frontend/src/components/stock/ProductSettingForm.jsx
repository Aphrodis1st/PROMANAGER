import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const ProductSettingForm = ({ initialData, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    type: "Product",
    mainOrSub: "Main Store",
    storeLocation: "",
    locationGroup: "",
    storeCategory: "Warehouse",
    productCategory: "Raw Materials",
    name: "",
    quality: "High",
    tax: 0,
    taxId: "",
    taxGroupId: "",
    taxExempt: false,
    openingStock: 0,
    reorderLevel: 0,
    unit: "Piece",
    status: "Draft",
    // Pricing & Defaults
    defaultSellingPrice: 0,
    defaultBuyingPrice: 0,
    defaultDiscount: 0,
    defaultDiscountType: "Percentage", // Percentage or Fixed
    // Tracking fields
    trackBatchNumber: false,
    trackSerialNumber: false,
    trackExpiryDate: false,
    trackWarranty: false,
    defaultWarrantyPeriod: "",
    defaultWarrantyUnit: "Months",
    defaultShelfLife: "", // For expiry calculation
    defaultShelfLifeUnit: "Months",
  });

  const storeOptions = ["Main Store", "Sub Store", "Add New"];
  const locationGroups = ["Group A", "Group B", "Group C", "Add New"];
  const typeOptions = ["Product", "Service"];
  const storeCategories = ["Online", "Warehouse", "Retail Store", "Add New"];
  const productCategories = ["Raw Materials", "Finished Products", "Food", "Drink", "Equipment", "Electronics", "Service Categories", "Add New"];
  const qualityOptions = ["High", "Medium", "Low"];
  const statusOptions = ["Draft", "Active", "Inactive"];
  const unitOptions = ["Piece", "Kg", "Gram", "Liter", "Meter", "Pack", "Box", "Bottle", "Case", "Carton", "Dozen"];
  const warrantyUnitOptions = ["Days", "Months", "Years"];
  const discountTypeOptions = ["Percentage", "Fixed"];

  const [newStore, setNewStore] = useState("");
  const [newLocationGroup, setNewLocationGroup] = useState("");
  const [newStoreCategory, setNewStoreCategory] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [taxes, setTaxes] = useState([]);
  const [taxGroups, setTaxGroups] = useState([]);

  useEffect(() => {
    fetchTaxes();
    fetchTaxGroups();
  }, []);

  const fetchTaxes = async () => {
    try {
      const token = localStorage.getItem('stockToken');
      const res = await axios.get(`${API_URL}/stock/taxes/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaxes(res.data || []);
    } catch (err) {
      console.error('Error fetching taxes:', err);
    }
  };

  const fetchTaxGroups = async () => {
    try {
      const token = localStorage.getItem('stockToken');
      const res = await axios.get(`${API_URL}/stock/taxes/groups/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaxGroups(res.data?.filter(g => g.isActive) || []);
    } catch (err) {
      console.error('Error fetching tax groups:', err);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "rgba(255,255,255,0.7)",
      transition: "0.25s ease",
      "& fieldset": {
        borderColor: "rgba(0,0,0,0.15)",
      },
      "&:hover fieldset": {
        borderColor: "#0d9488",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0d9488",
        boxShadow: "0 0 0 2px rgba(13,148,136,0.15)",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0d9488",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNew = (type) => {
    if (type === "mainOrSub" && newStore) {
      storeOptions.push(newStore);
      setFormData((prev) => ({ ...prev, mainOrSub: newStore }));
      setNewStore("");
    } else if (type === "locationGroup" && newLocationGroup) {
      locationGroups.push(newLocationGroup);
      setFormData((prev) => ({ ...prev, locationGroup: newLocationGroup }));
      setNewLocationGroup("");
    } else if (type === "storeCategory" && newStoreCategory) {
      storeCategories.push(newStoreCategory);
      setFormData((prev) => ({ ...prev, storeCategory: newStoreCategory }));
      setNewStoreCategory("");
    } else if (type === "productCategory" && newProductCategory) {
      productCategories.push(newProductCategory);
      setFormData((prev) => ({ ...prev, productCategory: newProductCategory }));
      setNewProductCategory("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="max-w-5xl mx-auto p-10"
      style={{
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(14px)",
        borderRadius: "24px",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.06)",
      }}
    >
      {/* HEADER */}
      <h2 className="text-2xl font-bold text-gray-800 mb-10 flex items-center gap-3">
        <div className="w-2 h-8 rounded-full bg-teal-600"></div>
        {initialData ? "Edit Product Setting" : "Add Product or Service"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-14">

        {/* ==================== SECTION 1 ==================== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            General Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">

            {/* Type */}
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type"
                sx={inputStyle}
              >
                {typeOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Store */}
            <FormControl fullWidth>
              <InputLabel>Store</InputLabel>
              <Select
                name="mainOrSub"
                value={formData.mainOrSub}
                onChange={handleChange}
                label="Store"
                sx={inputStyle}
              >
                {storeOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.mainOrSub === "Add New" && (
              <div className="flex gap-3 mt-2 col-span-2">
                <TextField
                  size="small"
                  placeholder="New store"
                  value={newStore}
                  onChange={(e) => setNewStore(e.target.value)}
                  className="flex-1"
                  sx={inputStyle}
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleAddNew("mainOrSub")}
                  sx={{
                    bgcolor: "#0d9488",
                    "&:hover": { bgcolor: "#14b8a6" },
                    borderRadius: "10px",
                  }}
                >
                  Add
                </Button>
              </div>
            )}

            {/* Store Location */}
            <TextField
              fullWidth
              name="storeLocation"
              label="Store Location"
              value={formData.storeLocation}
              onChange={handleChange}
              placeholder="e.g., Kigali Main Store"
              sx={inputStyle}
            />

            {/* Location Group */}
            <FormControl fullWidth>
              <InputLabel>Location Group</InputLabel>
              <Select
                name="locationGroup"
                value={formData.locationGroup}
                onChange={handleChange}
                label="Location Group"
                sx={inputStyle}
              >
                {locationGroups.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.locationGroup === "Add New" && (
              <div className="flex gap-3 mt-2 col-span-2">
                <TextField
                  size="small"
                  placeholder="New location group"
                  value={newLocationGroup}
                  onChange={(e) => setNewLocationGroup(e.target.value)}
                  className="flex-1"
                  sx={inputStyle}
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleAddNew("locationGroup")}
                  sx={{
                    bgcolor: "#0d9488",
                    "&:hover": { bgcolor: "#14b8a6" },
                    borderRadius: "10px",
                  }}
                >
                  Add
                </Button>
              </div>
            )}

            {/* Store Category */}
            <FormControl fullWidth>
              <InputLabel>Store Category</InputLabel>
              <Select
                name="storeCategory"
                value={formData.storeCategory}
                onChange={handleChange}
                label="Store Category"
                sx={inputStyle}
              >
                {storeCategories.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.storeCategory === "Add New" && (
              <div className="flex gap-3 mt-2 col-span-2">
                <TextField
                  size="small"
                  placeholder="New store category"
                  value={newStoreCategory}
                  onChange={(e) => setNewStoreCategory(e.target.value)}
                  className="flex-1"
                  sx={inputStyle}
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleAddNew("storeCategory")}
                  sx={{
                    bgcolor: "#0d9488",
                    "&:hover": { bgcolor: "#14b8a6" },
                    borderRadius: "10px",
                  }}
                >
                  Add
                </Button>
              </div>
            )}

            {/* Product Category */}
            <FormControl fullWidth>
              <InputLabel>Product Category</InputLabel>
              <Select
                name="productCategory"
                value={formData.productCategory}
                onChange={handleChange}
                label="Product Category"
                sx={inputStyle}
              >
                {productCategories.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.productCategory === "Add New" && (
              <div className="flex gap-3 mt-2 col-span-2">
                <TextField
                  size="small"
                  placeholder="New product category"
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="flex-1"
                  sx={inputStyle}
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleAddNew("productCategory")}
                  sx={{
                    bgcolor: "#0d9488",
                    "&:hover": { bgcolor: "#14b8a6" },
                    borderRadius: "10px",
                  }}
                >
                  Add
                </Button>
              </div>
            )}

          </div>

          {/* Category Guide */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Category Selection Guide
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Raw Materials:</strong> Items used in production (e.g., Steel, Cotton, Flour)</p>
              <p><strong>Finished Products:</strong> Items produced from raw materials (e.g., Juice, Furniture, Clothing)</p>
              <p><strong>Other Categories:</strong> For retail or service items</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {/* ==================== SECTION 2 ==================== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Product Details
          </h3>

          <TextField
            fullWidth
            name="name"
            label="Product / Service Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product or service name"
            required
            multiline
            rows={4}
            sx={inputStyle}
          />

        </div>

        <div className="h-px bg-gray-200" />

        {/* ==================== SECTION 3 ==================== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Pricing & Defaults
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Set default prices and discounts. These will auto-fill in sales but can be modified.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Default Buying Price */}
            <TextField
              fullWidth
              name="defaultBuyingPrice"
              label="Default Buying Price"
              type="number"
              value={formData.defaultBuyingPrice}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
              sx={inputStyle}
              helperText="Cost price for purchases"
            />

            {/* Default Selling Price */}
            <TextField
              fullWidth
              name="defaultSellingPrice"
              label="Default Selling Price"
              type="number"
              value={formData.defaultSellingPrice}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
              sx={inputStyle}
              helperText="Suggested retail price"
            />

            {/* Default Discount */}
            <TextField
              fullWidth
              name="defaultDiscount"
              label="Default Discount"
              type="number"
              value={formData.defaultDiscount}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
              sx={inputStyle}
              helperText="Default discount amount"
            />

            {/* Discount Type */}
            <FormControl fullWidth>
              <InputLabel>Discount Type</InputLabel>
              <Select
                name="defaultDiscountType"
                value={formData.defaultDiscountType}
                onChange={handleChange}
                label="Discount Type"
                sx={inputStyle}
              >
                {discountTypeOptions.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Tax */}
            <TextField
              fullWidth
              type="number"
              name="tax"
              label="Tax (%) - Legacy"
              value={formData.tax}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
              sx={inputStyle}
              helperText="Legacy tax percentage (use Tax Configuration below for professional setup)"
            />

          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {/* ==================== SECTION: TAX CONFIGURATION ==================== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Tax Configuration
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Configure professional tax settings for this product. Select a tax or tax group, or mark as tax exempt.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Tax Exempt Checkbox */}
            <div className="col-span-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.taxExempt}
                    onChange={(e) => {
                      const isExempt = e.target.checked;
                      setFormData({
                        ...formData,
                        taxExempt: isExempt,
                        taxId: isExempt ? "" : formData.taxId,
                        taxGroupId: isExempt ? "" : formData.taxGroupId,
                      });
                    }}
                    sx={{
                      color: '#0d9488',
                      '&.Mui-checked': {
                        color: '#0d9488',
                      },
                    }}
                  />
                }
                label={
                  <span className="font-medium text-gray-800">
                    Tax Exempt Product
                    <span className="block text-xs text-gray-500 mt-1">
                      Check this if the product is exempt from all taxes
                    </span>
                  </span>
                }
              />
            </div>

            {!formData.taxExempt && (
              <>
                {/* Individual Tax Selection */}
                <FormControl fullWidth>
                  <InputLabel>Select Tax</InputLabel>
                  <Select
                    name="taxId"
                    value={formData.taxId}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        taxId: e.target.value,
                        taxGroupId: e.target.value ? "" : formData.taxGroupId,
                      });
                    }}
                    label="Select Tax"
                    sx={inputStyle}
                  >
                    <MenuItem value="">
                      <em>No Tax</em>
                    </MenuItem>
                    {taxes.map((tax) => (
                      <MenuItem key={tax.id} value={tax.id}>
                        {tax.taxName} ({tax.taxCode}) - {tax.calculationType === 'Percentage' ? `${tax.rate}%` : `$${tax.fixedAmount}`}
                      </MenuItem>
                    ))}
                  </Select>
                  <span className="text-xs text-gray-500 mt-1">
                    Select a single tax to apply to this product
                  </span>
                </FormControl>

                {/* Tax Group Selection */}
                <FormControl fullWidth>
                  <InputLabel>Or Select Tax Group</InputLabel>
                  <Select
                    name="taxGroupId"
                    value={formData.taxGroupId}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        taxGroupId: e.target.value,
                        taxId: e.target.value ? "" : formData.taxId,
                      });
                    }}
                    label="Or Select Tax Group"
                    sx={inputStyle}
                    disabled={!!formData.taxId}
                  >
                    <MenuItem value="">
                      <em>No Tax Group</em>
                    </MenuItem>
                    {taxGroups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.groupName} ({group.taxIds?.length || 0} taxes)
                      </MenuItem>
                    ))}
                  </Select>
                  <span className="text-xs text-gray-500 mt-1">
                    Select a tax group for multiple taxes (e.g., VAT + Excise)
                  </span>
                </FormControl>

                {/* Tax Summary Display */}
                {(formData.taxId || formData.taxGroupId) && (
                  <div className="col-span-2 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tax Configuration Applied
                    </h4>
                    {formData.taxId && (
                      <div className="text-sm text-gray-700">
                        {(() => {
                          const tax = taxes.find(t => t.id === formData.taxId);
                          return tax ? (
                            <div>
                              <strong>{tax.taxName}</strong> ({tax.taxCode})<br />
                              Type: {tax.taxType}<br />
                              Rate: {tax.calculationType === 'Percentage' ? `${tax.rate}%` : `$${tax.fixedAmount} fixed`}<br />
                              Price Type: {tax.priceType}
                            </div>
                          ) : 'Tax not found';
                        })()}
                      </div>
                    )}
                    {formData.taxGroupId && (
                      <div className="text-sm text-gray-700">
                        {(() => {
                          const group = taxGroups.find(g => g.id === formData.taxGroupId);
                          return group ? (
                            <div>
                              <strong>{group.groupName}</strong><br />
                              Includes {group.taxIds?.length || 0} taxes<br />
                              <span className="text-xs text-gray-600">Multiple taxes will be applied to this product</span>
                            </div>
                          ) : 'Tax group not found';
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {formData.taxExempt && (
              <div className="col-span-2 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <h4 className="font-medium text-orange-800 mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Tax Exempt Product
                </h4>
                <p className="text-sm text-orange-700">
                  This product is marked as tax exempt. No taxes will be applied during sales or purchases.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {/* ==================== SECTION 4 ==================== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Stock & Inventory
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Quality */}
            <FormControl fullWidth>
              <InputLabel>Quality Grade</InputLabel>
              <Select
                name="quality"
                value={formData.quality}
                onChange={handleChange}
                label="Quality Grade"
                sx={inputStyle}
              >
                {qualityOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Opening Stock */}
            <TextField
              fullWidth
              name="openingStock"
              label="Opening Stock"
              type="number"
              value={formData.openingStock}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              sx={inputStyle}
            />

            {/* Reorder Level */}
            <TextField
              fullWidth
              name="reorderLevel"
              label="Reorder Level"
              type="number"
              value={formData.reorderLevel}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              sx={inputStyle}
            />

            {/* Unit */}
            <FormControl fullWidth>
              <InputLabel>Unit of Measurement</InputLabel>
              <Select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                label="Unit of Measurement"
                sx={inputStyle}
              >
                {unitOptions.map((u) => (
                  <MenuItem key={u} value={u}>{u}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
                sx={inputStyle}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>

          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {/* ==================== SECTION 4: TRACKING SETTINGS ==================== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Product Tracking Settings
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Enable tracking for specific product attributes. These will be required when purchasing or selling this product.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Track Batch Number */}
            <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-400 transition-colors">
              <input
                type="checkbox"
                id="trackBatchNumber"
                name="trackBatchNumber"
                checked={formData.trackBatchNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, trackBatchNumber: e.target.checked }))}
                className="mt-1 w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
              <div className="flex-1">
                <label htmlFor="trackBatchNumber" className="font-medium text-gray-800 cursor-pointer">
                  Track Batch Number
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Require batch number for inventory tracking and traceability
                </p>
              </div>
            </div>

            {/* Track Serial Number */}
            <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-400 transition-colors">
              <input
                type="checkbox"
                id="trackSerialNumber"
                name="trackSerialNumber"
                checked={formData.trackSerialNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, trackSerialNumber: e.target.checked }))}
                className="mt-1 w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
              <div className="flex-1">
                <label htmlFor="trackSerialNumber" className="font-medium text-gray-800 cursor-pointer">
                  Track Serial Number
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Require unique serial number for each unit (ideal for electronics, equipment)
                </p>
              </div>
            </div>

            {/* Track Expiry Date */}
            <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-400 transition-colors">
              <input
                type="checkbox"
                id="trackExpiryDate"
                name="trackExpiryDate"
                checked={formData.trackExpiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, trackExpiryDate: e.target.checked }))}
                className="mt-1 w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
              <div className="flex-1">
                <label htmlFor="trackExpiryDate" className="font-medium text-gray-800 cursor-pointer">
                  Track Expiration Date
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Require expiry date (essential for food, medicine, perishables)
                </p>
              </div>
            </div>

            {/* Track Warranty */}
            <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-400 transition-colors">
              <input
                type="checkbox"
                id="trackWarranty"
                name="trackWarranty"
                checked={formData.trackWarranty}
                onChange={(e) => setFormData(prev => ({ ...prev, trackWarranty: e.target.checked }))}
                className="mt-1 w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
              <div className="flex-1">
                <label htmlFor="trackWarranty" className="font-medium text-gray-800 cursor-pointer">
                  Track Warranty
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Require warranty information for products with guarantees
                </p>
              </div>
            </div>

          </div>

          {/* Default Shelf Life (for expiry calculation) */}
          {formData.trackExpiryDate && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Default Shelf Life
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  name="defaultShelfLife"
                  label="Shelf Life Duration"
                  type="number"
                  value={formData.defaultShelfLife}
                  onChange={handleChange}
                  placeholder="e.g., 6"
                  inputProps={{ min: 0 }}
                  sx={inputStyle}
                />
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="defaultShelfLifeUnit"
                    value={formData.defaultShelfLifeUnit}
                    onChange={handleChange}
                    label="Unit"
                    sx={inputStyle}
                  >
                    {warrantyUnitOptions.map((u) => (
                      <MenuItem key={u} value={u}>{u}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Expiry date will be auto-calculated from purchase date + shelf life
              </p>
            </div>
          )}

          {/* Default Warranty Period */}
          {formData.trackWarranty && (
            <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Default Warranty Period
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  name="defaultWarrantyPeriod"
                  label="Warranty Duration"
                  type="number"
                  value={formData.defaultWarrantyPeriod}
                  onChange={handleChange}
                  placeholder="e.g., 12"
                  inputProps={{ min: 0 }}
                  sx={inputStyle}
                />
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="defaultWarrantyUnit"
                    value={formData.defaultWarrantyUnit}
                    onChange={handleChange}
                    label="Unit"
                    sx={inputStyle}
                  >
                    {warrantyUnitOptions.map((u) => (
                      <MenuItem key={u} value={u}>{u}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                This will be the default warranty period when purchasing this product
              </p>
            </div>
          )}
        </div>

        {/* ==================== BUTTONS ==================== */}
        <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">

          <Button
            variant="outlined"
            onClick={onCancel}
            startIcon={<CancelIcon />}
            size="large"
            sx={{
              minWidth: 140,
              height: 48,
              borderRadius: "12px",
              borderColor: "rgb(209 213 219)",
              color: "rgb(55 65 81)",
              fontWeight: 500,
              "&:hover": {
                borderColor: "rgb(156 163 175)",
                bgcolor: "rgb(243 244 246)",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={<SaveIcon />}
            size="large"
            sx={{
              minWidth: 140,
              height: 48,
              borderRadius: "12px",
              fontWeight: 600,
              background: "linear-gradient(135deg, #0d9488, #14b8a6)",
              boxShadow: "0 4px 14px rgba(13,148,136,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #0f9e93, #1cc3b1)",
                boxShadow: "0 4px 20px rgba(13,148,136,0.4)",
              },
              "&:disabled": {
                bgcolor: "grey.400",
              },
            }}
          >
            {initialData ? "Update" : "Save"}
          </Button>
        </div>

      </form>
    </div>
  );
};

export default ProductSettingForm;
