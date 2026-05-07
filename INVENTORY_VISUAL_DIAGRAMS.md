# 📊 INVENTORY SYSTEM - VISUAL DIAGRAMS

## Complete Visual Guide to Inventory Flow

---

## 🔄 Main Inventory Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPLETE INVENTORY SYSTEM FLOW                    │
└─────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   SUPPLIER   │
                         └──────┬───────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   PURCHASE INVOICE    │
                    │  (Pending → Approved) │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   PAYMENT PROCESSED   │
                    └───────────┬───────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────────┐
        │   RAW MATERIALS INVENTORY INCREASES (+)       │
        │   Dr. Inventory    Cr. Accounts Payable       │
        └───────────────┬───────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────────────┐
        │         PRODUCTION CYCLE STARTS               │
        │   Raw Materials Consumed (-)                  │
        │   Dr. WIP    Cr. Raw Materials Inventory      │
        └───────────────┬───────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────────────┐
        │       PRODUCTION CYCLE COMPLETES              │
        │   Finished Goods Created (+)                  │
        │   Dr. Finished Goods    Cr. WIP               │
        └───────────────┬───────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────────────┐
        │   FINISHED GOODS INVENTORY INCREASES (+)      │
        │   Ready for Sale                              │
        └───────────────┬───────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────────────┐
        │              SALE CREATED                     │
        │   Finished Goods Inventory Decreases (-)      │
        │   Dr. COGS    Cr. Finished Goods Inventory    │
        │   Dr. A/R     Cr. Revenue                     │
        └───────────────┬───────────────────────────────┘
                        │
                        ▼
                    ┌───────────┐
                    │  CUSTOMER │
                    └───────────┘
```

---

## 📦 Inventory Categories Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    INVENTORY CATEGORIES                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐
│   RAW MATERIALS     │         │  FINISHED PRODUCTS  │
│                     │         │                     │
│  • Flour            │         │  • Bread            │
│  • Sugar            │         │  • Cakes            │
│  • Eggs             │         │  • Pastries         │
│  • Milk             │         │  • Cookies          │
│                     │         │                     │
│  Store Category:    │         │  Store Category:    │
│  "Raw Materials"    │         │  "Finished Products"│
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           │                               │
           ▼                               ▼
    ┌──────────────┐              ┌──────────────┐
    │  PURCHASES   │              │    SALES     │
    │  Increase    │              │  Decrease    │
    │  Inventory   │              │  Inventory   │
    └──────┬───────┘              └──────┬───────┘
           │                               │
           │                               │
           ▼                               ▼
    ┌──────────────┐              ┌──────────────┐
    │  PRODUCTION  │              │   REVENUE    │
    │  Consumes    │              │  Generated   │
    │  Raw Mat.    │              │              │
    └──────────────┘              └──────────────┘
```

---

## 💰 Sales Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SALES PROCESS FLOW                          │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │  Select Product │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  INVENTORY INFORMATION DISPLAY          │
    │  ┌───────────────────────────────────┐  │
    │  │ Opening Stock:        100 units   │  │
    │  │ Purchases:           +50 units    │  │
    │  │ Production:          +30 units    │  │
    │  │ Sales:               -60 units    │  │
    │  │ ─────────────────────────────────  │  │
    │  │ Available Stock:     120 units    │  │
    │  │ Stock Value:         RWF 240,000  │  │
    │  │ Status: ✅ IN STOCK               │  │
    │  └───────────────────────────────────┘  │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────┐
    │  Enter Quantity │ ◄─── Validation: Qty ≤ Available Stock
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Add to Cart    │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Complete Sale  │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  INVENTORY AUTOMATICALLY REDUCED        │
    │  Available Stock: 120 → 110 units       │
    │  (if 10 units sold)                     │
    └─────────────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  JOURNAL ENTRY CREATED                  │
    │  Dr. Accounts Receivable    RWF 20,000  │
    │      Cr. Revenue                20,000  │
    │  Dr. Cost of Goods Sold         10,000  │
    │      Cr. Inventory              10,000  │
    └─────────────────────────────────────────┘
```

---

## 🛒 Purchase Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PURCHASE PROCESS FLOW                         │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │ Select Supplier │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Select Product  │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Enter Quantity  │
    │ Enter Price     │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Add to Invoice  │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Submit Invoice  │
    │ Status: PENDING │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Approve Invoice │
    │ Status: APPROVED│
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Pay Invoice    │
    │ Status: PAID    │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  INVENTORY AUTOMATICALLY INCREASED      │
    │  Stock: 100 → 150 units                 │
    │  (if 50 units purchased)                │
    └─────────────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  JOURNAL ENTRY CREATED                  │
    │  Dr. Inventory              RWF 50,000  │
    │      Cr. Accounts Payable       50,000  │
    └─────────────────────────────────────────┘
```

---

## 🏭 Production Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCTION PROCESS FLOW                        │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────────────┐
    │ Create Production   │
    │      Plan           │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │ Define Finished     │
    │    Product          │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │ Add Raw Materials   │
    │   (BOM - Bill of    │
    │    Materials)       │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │  Approve Plan       │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────────────────────────┐
    │  START PRODUCTION CYCLE                 │
    │  ┌───────────────────────────────────┐  │
    │  │ Raw Materials Consumed:           │  │
    │  │ • Flour:    -10 kg                │  │
    │  │ • Sugar:    -5 kg                 │  │
    │  │ • Eggs:     -20 units             │  │
    │  └───────────────────────────────────┘  │
    └──────────┬──────────────────────────────┘
               │
               ▼
    ┌─────────────────────────────────────────┐
    │  RAW MATERIALS INVENTORY REDUCED        │
    │  Flour:  100 kg → 90 kg                 │
    │  Sugar:  50 kg → 45 kg                  │
    │  Eggs:   200 → 180 units                │
    └──────────┬──────────────────────────────┘
               │
               ▼
    ┌─────────────────────┐
    │  Production in      │
    │    Progress         │
    │  (Work in Progress) │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────────────────────────┐
    │  COMPLETE PRODUCTION CYCLE              │
    │  ┌───────────────────────────────────┐  │
    │  │ Finished Goods Produced:          │  │
    │  │ • Bread: 50 loaves                │  │
    │  │                                   │  │
    │  │ Costs:                            │  │
    │  │ • Material Cost:  RWF 30,000      │  │
    │  │ • Labor Cost:     RWF 10,000      │  │
    │  │ • Overhead Cost:  RWF 5,000       │  │
    │  │ ─────────────────────────────────  │  │
    │  │ • Total Cost:     RWF 45,000      │  │
    │  │ • Cost per Unit:  RWF 900         │  │
    │  └───────────────────────────────────┘  │
    └──────────┬──────────────────────────────┘
               │
               ▼
    ┌─────────────────────┐
    │ Migrate to Inventory│
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────────────────────────┐
    │  FINISHED GOODS INVENTORY INCREASED     │
    │  Bread: 100 loaves → 150 loaves         │
    └─────────────────────────────────────────┘
               │
               ▼
    ┌─────────────────────────────────────────┐
    │  JOURNAL ENTRY CREATED                  │
    │  Dr. Finished Goods Inv.    RWF 45,000  │
    │      Cr. Raw Materials          30,000  │
    │      Cr. Labor Cost             10,000  │
    │      Cr. Overhead Cost           5,000  │
    └─────────────────────────────────────────┘
```

---

## 📊 Inventory Report Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    INVENTORY REPORT STRUCTURE                    │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  Product: Bread (Finished Product)                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Opening Stock (Start of Period):           100 loaves          │
│                                                                  │
│  + Purchases (if any):                      +0 loaves           │
│                                                                  │
│  + Production (Manufactured):               +50 loaves          │
│                                                                  │
│  - Sales (Sold to Customers):               -60 loaves          │
│                                                                  │
│  - Damaged/Adjustments:                     -0 loaves           │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│  = Closing Stock (End of Period):           90 loaves           │
│                                                                  │
│  ─────────────────────────────────────────────────────────────── │
│                                                                  │
│  Unit Price:                                RWF 2,000           │
│  Opening Value:                             RWF 200,000         │
│  Closing Value:                             RWF 180,000         │
│                                                                  │
│  Reorder Level:                             50 loaves           │
│  Status:                                    ✅ IN STOCK         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Formula: Closing = Opening + Purchases + Production - Sales - Damaged
         90 = 100 + 0 + 50 - 60 - 0 ✅
```

---

## 🎯 Stock Status Indicators

```
┌─────────────────────────────────────────────────────────────────┐
│                    STOCK STATUS INDICATORS                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  🟢 IN STOCK (Green)                                         │
│  ─────────────────────────────────────────────────────────── │
│  Current Stock > Reorder Level                               │
│  Example: 90 units > 50 units (reorder level)                │
│  Action: Normal operations, no action needed                 │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  🟠 LOW STOCK (Orange)                                       │
│  ─────────────────────────────────────────────────────────── │
│  Current Stock ≤ Reorder Level                               │
│  Example: 45 units ≤ 50 units (reorder level)                │
│  Action: ⚠️ REORDER IMMEDIATELY                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  🔴 OUT OF STOCK (Red)                                       │
│  ─────────────────────────────────────────────────────────── │
│  Current Stock = 0                                            │
│  Example: 0 units                                             │
│  Action: ❌ CANNOT SELL - URGENT REORDER REQUIRED            │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 Transaction Safety Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  TRANSACTION SAFETY MECHANISM                    │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │  User Initiates │
    │  Sale (10 units)│
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  CHECK: Available Stock?                │
    │  Current Stock: 5 units                 │
    │  Requested: 10 units                    │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  ❌ VALIDATION FAILED                   │
    │  Insufficient Stock!                    │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  TRANSACTION BLOCKED                    │
    │  Error Message: "Only 5 units available"│
    │  Sale NOT Created                       │
    │  Inventory NOT Changed                  │
    └─────────────────────────────────────────┘

    ═══════════════════════════════════════════

    ┌─────────────────┐
    │  User Initiates │
    │  Sale (3 units) │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  CHECK: Available Stock?                │
    │  Current Stock: 5 units                 │
    │  Requested: 3 units                     │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  ✅ VALIDATION PASSED                   │
    │  Sufficient Stock!                      │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  CREATE SALE RECORD                     │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  UPDATE INVENTORY                       │
    │  5 units → 2 units                      │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  CREATE JOURNAL ENTRY                   │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │  ✅ TRANSACTION COMPLETE                │
    │  Sale Created Successfully              │
    │  Inventory Updated                      │
    │  Accounting Records Created             │
    └─────────────────────────────────────────┘
```

---

## 📱 User Interface Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE NAVIGATION                     │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │  STOCK DASHBOARD │
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   INVENTORY     │ │     SALES       │ │   PURCHASES     │
│                 │ │                 │ │                 │
│ • Dashboard     │ │ • Create Sale   │ │ • Create Invoice│
│ • All Items     │ │ • Cart System   │ │ • Approve       │
│ • Raw Materials │ │ • Stock Check   │ │ • Pay           │
│ • Finished Goods│ │ • Invoice View  │ │ • History       │
│ • Reports       │ │ • History       │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   PRODUCTION     │
                    │                  │
                    │ • Plans          │
                    │ • Cycles         │
                    │ • Finished Goods │
                    │ • Migration      │
                    └──────────────────┘
```

---

## 🎓 Learning Path

```
┌─────────────────────────────────────────────────────────────────┐
│                    RECOMMENDED LEARNING PATH                     │
└─────────────────────────────────────────────────────────────────┘

    Day 1: Understanding
    ┌─────────────────────────────────────────┐
    │ 1. Read INVENTORY_QUICK_REFERENCE.md    │
    │ 2. Explore Inventory Dashboard          │
    │ 3. Review this Visual Diagrams file     │
    └─────────────────────────────────────────┘
                    │
                    ▼
    Day 2: Basic Operations
    ┌─────────────────────────────────────────┐
    │ 1. Create a test purchase               │
    │ 2. Verify inventory increase            │
    │ 3. Create a test sale                   │
    │ 4. Verify inventory decrease            │
    └─────────────────────────────────────────┘
                    │
                    ▼
    Day 3: Advanced Features
    ┌─────────────────────────────────────────┐
    │ 1. Test production cycle                │
    │ 2. Generate inventory reports           │
    │ 3. Review journal entries               │
    └─────────────────────────────────────────┘
                    │
                    ▼
    Week 1: Mastery
    ┌─────────────────────────────────────────┐
    │ 1. Complete testing checklist           │
    │ 2. Train team members                   │
    │ 3. Set up real products                 │
    │ 4. Go live!                             │
    └─────────────────────────────────────────┘
```

---

**Remember**: 
- 🟢 Purchases = Inventory UP ⬆️
- 🔴 Sales = Inventory DOWN ⬇️
- 🏭 Production = Raw Materials DOWN ⬇️, Finished Goods UP ⬆️

**Visual Guide Complete!** 📊✅
