# Property Management System - Visual Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PROMANAGER - Property Management                  │
│                         Advanced Property System                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Module Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         13 CORE MODULES                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  1. 📊 Global Dashboard        │  8. 👷 Staff Management                 │
│     • Total Properties          │     • Staff List                        │
│     • Total Units               │     • Roles & Permissions               │
│     • Occupancy Rate            │     • Shift Schedules                   │
│     • Rent Collected            │     • Task Assignment                   │
│     • Pending Payments          │     • Performance Tracking              │
│     • Open Tickets              │                                         │
│     • Expiring Leases           │  9. 📈 Reports & Analytics              │
│     • Staff on Duty             │     • Revenue per Property              │
│                                 │     • Occupancy Trends                  │
│  2. 🏢 Properties Management    │     • Rent Collection                   │
│     • Properties List           │     • Maintenance Costs                 │
│     • Add/Edit/Delete           │     • Tenant Reports                    │
│     • Property Profiles         │     • Financial Summary                 │
│     • Buildings/Blocks          │     • Lease Expiry                      │
│     • Documents                 │     • Vacancy Analysis                  │
│     • Owner Assignment          │     • Custom Reports                    │
│                                 │                                         │
│  3. 🏠 Units/Rooms/Houses       │  10. 💬 Communication                   │
│     • Units List                │     • Send SMS/Email                    │
│     • Status Tracking           │     • Payment Reminders                 │
│     • Rent Price                │     • Announcements                     │
│     • Meter Readings            │     • In-app Messages                   │
│     • Unit History              │     • Bulk Messaging                    │
│     • Bulk Import               │                                         │
│                                 │  11. ⚙️ System Settings                 │
│  4. 👤 Tenants Management       │     • Roles & Permissions               │
│     • Tenants List              │     • Taxes & Currencies                │
│     • Tenant Profiles           │     • Payment Gateway                   │
│     • Documents                 │     • Invoice Templates                 │
│     • Check-in/Check-out        │     • Audit Logs                        │
│     • Communication             │                                         │
│     • History                   │  12. 👑 Owner Portal                    │
│                                 │     • View Properties                   │
│  5. 📝 Lease Management         │     • Revenue & Expenses                │
│     • Create Leases             │     • Download Statements               │
│     • Start/End Dates           │     • Approve Maintenance               │
│     • Rent Escalation           │     • Performance Metrics               │
│     • Renewal Reminders         │                                         │
│     • E-signature               │  13. 📱 Tenant Portal                   │
│     • Availability Calendar     │     • Pay Rent                          │
│                                 │     • Submit Maintenance                │
│  6. 💰 Billing & Payments       │     • View Lease                        │
│     • Auto Invoicing            │     • Upload Meter Readings             │
│     • Utilities Billing         │     • Download Receipts                 │
│     • Tenant Ledger             │     • View Announcements                │
│     • Payment History           │                                         │
│     • Receipts                  │                                         │
│     • Overdue Penalties         │                                         │
│     • Multiple Payment Methods  │                                         │
│                                 │                                         │
│  7. 🔧 Maintenance & Work Orders│                                         │
│     • Create Tickets            │                                         │
│     • Assign Technicians        │                                         │
│     • Priority Levels           │                                         │
│     • Status Tracking           │                                         │
│     • Cost Tracking             │                                         │
│     • Before/After Photos       │                                         │
│     • Preventive Maintenance    │                                         │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                              │
│                         (React + Tailwind)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Dashboard   │  │  Properties  │  │    Units     │             │
│  │    Pages     │  │    Pages     │  │    Pages     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Tenants    │  │    Leases    │  │   Billing    │             │
│  │    Pages     │  │    Pages     │  │    Pages     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Maintenance  │  │    Staff     │  │   Reports    │             │
│  │    Pages     │  │    Pages     │  │    Pages     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │Communication │  │   Settings   │  │   Portals    │             │
│  │    Pages     │  │    Pages     │  │    Pages     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP/REST API
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          BACKEND LAYER                               │
│                      (Node.js + Express)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    API ROUTES                                 │  │
│  │  /api/v1/property/properties                                 │  │
│  │  /api/v1/property/units                                      │  │
│  │  /api/v1/property/tenants                                    │  │
│  │  /api/v1/property/leases                                     │  │
│  │  /api/v1/property/billing                                    │  │
│  │  /api/v1/property/maintenance                                │  │
│  │  /api/v1/property/staff                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                  │                                   │
│                                  ▼                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    CONTROLLERS                                │  │
│  │  • property.controller.js                                    │  │
│  │  • unit.controller.js                                        │  │
│  │  • tenant.controller.js                                      │  │
│  │  • lease.controller.js                                       │  │
│  │  • billing.controller.js                                     │  │
│  │  • maintenance.controller.js                                 │  │
│  │  • staff.controller.js                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                  │                                   │
│                                  ▼                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      MODELS                                   │  │
│  │  • property.model.js                                         │  │
│  │  • unit.model.js                                             │  │
│  │  • tenant.model.js                                           │  │
│  │  • lease.model.js                                            │  │
│  │  • billing.model.js                                          │  │
│  │  • maintenance.model.js                                      │  │
│  │  • staff.model.js                                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Firebase SDK
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                │
│                      (Firebase Firestore)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ properties   │  │    units     │  │   tenants    │             │
│  │ collection   │  │ collection   │  │ collection   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   leases     │  │   property   │  │ maintenance  │             │
│  │ collection   │  │   Billing    │  │ collection   │             │
│  └──────────────┘  │ collection   │  └──────────────┘             │
│                    └──────────────┘                                 │
│                                                                      │
│  ┌──────────────┐                                                   │
│  │   property   │                                                   │
│  │    Staff     │                                                   │
│  │ collection   │                                                   │
│  └──────────────┘                                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────┐
│    User     │
│  Interface  │
└──────┬──────┘
       │
       │ 1. User Action (Create Property)
       ▼
┌─────────────┐
│   React     │
│  Component  │
└──────┬──────┘
       │
       │ 2. API Call (POST /api/v1/property/properties)
       ▼
┌─────────────┐
│   Express   │
│   Router    │
└──────┬──────┘
       │
       │ 3. Route to Controller
       ▼
┌─────────────┐
│ Controller  │
│  Function   │
└──────┬──────┘
       │
       │ 4. Call Model Function
       ▼
┌─────────────┐
│    Model    │
│  Function   │
└──────┬──────┘
       │
       │ 5. Firebase Operation
       ▼
┌─────────────┐
│  Firebase   │
│  Firestore  │
└──────┬──────┘
       │
       │ 6. Return Data
       ▼
┌─────────────┐
│  Response   │
│   to User   │
└─────────────┘
```

## User Roles & Access

```
┌────────────────────────────────────────────────────────────────┐
│                      USER ROLES                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👑 SUPER ADMIN                                                 │
│     • Full system access                                        │
│     • Manage all properties                                     │
│     • System configuration                                      │
│                                                                 │
│  🏢 PROPERTY OWNER                                              │
│     • View owned properties                                     │
│     • Revenue reports                                           │
│     • Approve maintenance                                       │
│                                                                 │
│  👨‍💼 PROPERTY MANAGER                                            │
│     • Manage properties                                         │
│     • Manage tenants                                            │
│     • Create leases                                             │
│     • Generate invoices                                         │
│     • Manage maintenance                                        │
│                                                                 │
│  💰 ACCOUNTANT                                                  │
│     • View billing                                              │
│     • Generate reports                                          │
│     • Process payments                                          │
│                                                                 │
│  🔧 MAINTENANCE STAFF                                           │
│     • View assigned tickets                                     │
│     • Update ticket status                                      │
│     • Add photos/notes                                          │
│                                                                 │
│  👤 TENANT                                                      │
│     • View lease                                                │
│     • Pay rent                                                  │
│     • Submit maintenance                                        │
│     • View announcements                                        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Integration with Existing Systems

```
┌─────────────────────────────────────────────────────────────────┐
│              PROMANAGER ECOSYSTEM INTEGRATION                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │    Stock     │◄────►│   Property   │◄────►│   Hospital   │ │
│  │  Management  │      │  Management  │      │  Management  │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
│         ▲                      ▲                      ▲         │
│         │                      │                      │         │
│         │              ┌───────┴───────┐              │         │
│         │              │               │              │         │
│         │              ▼               ▼              │         │
│         │      ┌──────────────┐ ┌──────────────┐     │         │
│         └─────►│      HR      │ │   Pharmacy   │◄────┘         │
│                │  Management  │ │  Management  │               │
│                └──────────────┘ └──────────────┘               │
│                                                                  │
│                    Shared Services:                             │
│                    • Authentication                             │
│                    • Currency System                            │
│                    • Reporting Engine                           │
│                    • Notification Service                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADVANCED FEATURES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔄 Real-time Sync        📊 Advanced Analytics                 │
│  • Live data updates      • Revenue tracking                    │
│  • Instant notifications  • Occupancy trends                    │
│                           • Custom reports                       │
│                                                                  │
│  💳 Multi-Payment         📱 Mobile Responsive                  │
│  • Cash                   • Desktop                             │
│  • Bank Transfer          • Tablet                              │
│  • Mobile Money           • Smartphone                          │
│  • Card Payment                                                 │
│                                                                  │
│  🔐 Security              🌍 Multi-Currency                     │
│  • Role-based access      • USD, EUR, GBP                       │
│  • Audit logs             • KES, and more                       │
│  • Data encryption        • Auto conversion                     │
│                                                                  │
│  📤 Export Options        🤖 Automation                         │
│  • PDF reports            • Auto invoicing                      │
│  • Excel exports          • Payment reminders                   │
│  • Bulk operations        • Lease renewals                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT STACK                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Frontend (Port 5173)                                           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  React + Vite + Tailwind CSS                           │    │
│  │  http://localhost:5173/property                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           │ API Calls                            │
│                           ▼                                      │
│  Backend (Port 3001)                                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Node.js + Express                                     │    │
│  │  http://localhost:3001/api/v1/property/*              │    │
│  └────────────────────────────────────────────────────────┘    │
│                           │                                      │
│                           │ Firebase SDK                         │
│                           ▼                                      │
│  Database (Cloud)                                               │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Firebase Firestore                                    │    │
│  │  • properties, units, tenants, leases                  │    │
│  │  • billing, maintenance, staff                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**System Status:** ✅ Fully Operational  
**Version:** 1.0.0  
**Last Updated:** January 2025
