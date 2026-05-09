# Production Cycle Material Cost Fix Guide

## Problem
Material costs showing as $0.00 in production cycles.

## Root Cause
Raw materials in your inventory don't have cost/buying prices set.

## Solution

### Option 1: Set Buying Prices in Inventory (RECOMMENDED)
1. Go to **Stock Management** → **Product Settings**
2. Find your raw materials (Water, Sugar, Ginger, Pineapple, etc.)
3. For each material, click **Edit**
4. Set the **Buying Price** or **Cost Price** field
5. Save the changes

### Option 2: Run the Fix Script (For Existing Cycles)
After setting the buying prices in inventory:

1. Open Command Prompt in the project folder
2. Run: `fix-cycle-costs.bat`
3. The script will recalculate all cycle costs using current inventory prices

### Option 3: Create New Cycles
Once you've set the buying prices in inventory:
1. Create a new production plan
2. Start a new cycle
3. Attach raw materials - they will now have correct costs
4. Complete the cycle - all costs will be calculated correctly

## How It Works

### When Starting a Cycle:
1. You select raw materials from inventory
2. System fetches the **cost price** from each material
3. Calculates: `Material Cost = Quantity × Cost Price`
4. Stores this in the cycle

### When Completing a Cycle:
1. You enter **Labor Cost** and **Overhead Cost**
2. System calculates: `Total Cost = Material Cost + Labor Cost + Overhead Cost`
3. Calculates: `Cost Per Unit = Total Cost ÷ Produced Quantity`

## Example

If you have:
- Pineapple: 50 kg @ 1,000 RWF/kg = 50,000 RWF
- Water: 100 L @ 10 RWF/L = 1,000 RWF
- Sugar: 40 kg @ 500 RWF/kg = 20,000 RWF
- **Material Cost = 71,000 RWF**

Then add:
- Labor Cost: 5,000 RWF
- Overhead Cost: 2,000 RWF
- **Total Cost = 78,000 RWF**

If you produced 300 liters:
- **Cost Per Unit = 78,000 ÷ 300 = 260 RWF/liter**

## Important Notes

✅ **Always set buying prices** for raw materials before starting production cycles
✅ **Material costs are locked** when you start a cycle (based on prices at that time)
✅ **Labor and overhead costs** are added when you complete the cycle
✅ The system tracks costs professionally for accounting and profitability analysis

## Need Help?

If material costs are still showing as zero:
1. Check that raw materials have **Store Category = "Raw Materials"**
2. Verify the **Buying Price** or **Cost Price** is set and > 0
3. Check browser console (F12) for any errors
4. Run the fix script after setting prices

---

**Professional Production Cost Tracking System**
- Material Cost: From inventory prices
- Labor Cost: Manual entry
- Overhead Cost: Manual entry  
- Total Cost: Automatically calculated
- Cost Per Unit: Automatically calculated
