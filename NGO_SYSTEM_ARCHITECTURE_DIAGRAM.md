# NGO System Architecture - Visual Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NGO MANAGEMENT SYSTEM                                │
│                     http://localhost:5173/ngo                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      NGODashboard.jsx                                 │  │
│  │                  (Main Dashboard Component)                           │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────┬──────────────────────┬─────────────────────────┐  │
│  │                     │                      │                         │  │
│  │  ServiceControl     │  GISFieldOperations  │  NGOSettings           │  │
│  │  Center.jsx         │  .jsx                │  Controller.jsx        │  │
│  │                     │                      │                         │  │
│  │  • Service Registry │  • GPS Mapping       │  • Feature Controls    │  │
│  │  • Health Monitor   │  • Field Sites       │  • Allow/Restrict      │  │
│  │  • Permissions      │  • Beneficiaries     │  • Clear/Reset         │  │
│  │  • Audit Trail      │  • Field Visits      │  • System Settings     │  │
│  │                     │                      │                         │  │
│  └─────────────────────┴──────────────────────┴─────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Requests
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         server.js                                     │  │
│  │                    (Express Server)                                   │  │
│  │                                                                        │  │
│  │  Port: 3001                                                           │  │
│  │  CORS: http://localhost:5173                                          │  │
│  │  Firebase: Initialized                                                │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────┬──────────────────────┬─────────────────────────┐  │
│  │                     │                      │                         │  │
│  │  Super Admin        │  NGO Operations      │  Firebase               │  │
│  │  Routes             │  Routes              │  Middleware             │  │
│  │                     │                      │                         │  │
│  │  /super-admin/ngos  │  /ngo/*              │  requireFirebase()      │  │
│  │                     │                      │                         │  │
│  │  • Create NGO       │  • Branches          │  • Auth Check           │  │
│  │  • List NGOs        │  • Field Sites       │  • Service Ready        │  │
│  │  • Update NGO       │  • Field Visits      │  • Error Handling       │  │
│  │  • Delete NGO       │  • Grants            │                         │  │
│  │  • Status           │  • Donor Reports     │                         │  │
│  │  • Features         │  • Beneficiaries     │                         │  │
│  │                     │  • GPS Locations     │                         │  │
│  │                     │  • Service Health    │                         │  │
│  │                     │  • Chart of Accounts │                         │  │
│  │                     │  • Bank Accounts     │                         │  │
│  │                     │  • Payments          │                         │  │
│  │                     │  • Journal Entries   │                         │  │
│  │                     │  • Beneficial Owners │                         │  │
│  │                     │  • Contracts         │                         │  │
│  │                     │  • Storages          │                         │  │
│  │                     │  • Tenders           │                         │  │
│  │                     │  • Projects          │                         │  │
│  │                     │  • Impacts           │                         │  │
│  │                     │  • Evaluations       │                         │  │
│  │                     │  • Church Operations │                         │  │
│  │                     │  • Communication     │                         │  │
│  │                     │  • Reports           │                         │  │
│  │                     │                      │                         │  │
│  └─────────────────────┴──────────────────────┴─────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         CONTROLLERS                                   │  │
│  │                                                                        │  │
│  │  ngo.controller.js                                                    │  │
│  │                                                                        │  │
│  │  • createNGO()                                                        │  │
│  │  • getAllNGOs()                                                       │  │
│  │  • getNGO()                                                           │  │
│  │  • updateNGO()                                                        │  │
│  │  • updateNGOStatus()                                                  │  │
│  │  • updateNGOFeatures()                                                │  │
│  │  • softDeleteNGO()                                                    │  │
│  │  • hardDeleteNGO()                                                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                           MODELS                                      │  │
│  │                                                                        │  │
│  │  ngo.model.js                                                         │  │
│  │                                                                        │  │
│  │  • NGO Class                                                          │  │
│  │  • create()                                                           │  │
│  │  • getAll()                                                           │  │
│  │  • getById()                                                          │  │
│  │  • update()                                                           │  │
│  │  • softDelete()                                                       │  │
│  │  • hardDelete()                                                       │  │
│  │  • updateStatus()                                                     │  │
│  │  • updateFeatures()                                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Firestore Operations
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATABASE LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      Firebase Firestore                               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        COLLECTIONS                                   │   │
│  │                                                                       │   │
│  │  • ngos                    - NGO/Church organizations                │   │
│  │  • ngo_branches            - Headquarters, regional, church branches │   │
│  │  • ngo_field_sites         - GPS project locations                  │   │
│  │  • ngo_field_visits        - Field visit logs                       │   │
│  │  • ngo_grants              - Grant management                       │   │
│  │  • ngo_donor_reports       - Financial donor reports                │   │
│  │  • ngo_beneficiaries       - Beneficiary tracking                   │   │
│  │  • ngo_chart_of_accounts   - GL accounts                            │   │
│  │  • ngo_bank_accounts       - Bank accounts                          │   │
│  │  • ngo_payments            - Payment vouchers                       │   │
│  │  • ngo_journal_entries     - Journal entries                        │   │
│  │  • ngo_beneficial_owners   - KYC register                           │   │
│  │  • ngo_contracts           - Contract register                      │   │
│  │  • ngo_storages            - Document repositories                  │   │
│  │  • ngo_tenders             - Procurement tenders                    │   │
│  │  • ngo_projects            - Project portfolio                      │   │
│  │  • ngo_impacts             - Impact indicators                      │   │
│  │  • ngo_evaluations         - Evaluations                            │   │
│  │  • ngo_offerings           - Church offerings                       │   │
│  │  • ngo_pastoral_visits     - Pastoral visits                        │   │
│  │  • ngo_attendance          - Church attendance                      │   │
│  │  • ngo_members             - Church members                         │   │
│  │  • ngo_programs            - Programs                               │   │
│  │  • ngo_donors              - Donors                                 │   │
│  │  • ngo_volunteers          - Volunteers                             │   │
│  │  • ngo_distributions       - Distribution tracking                  │   │
│  │  • ngo_announcements       - Announcements                          │   │
│  │  • ngo_sms                 - SMS messages                           │   │
│  │  • ngo_whatsapp            - WhatsApp messages                      │   │
│  │  • ngo_email_campaigns     - Email campaigns                        │   │
│  │  • ngo_notifications       - Notifications                          │   │
│  │  • ngo_reports             - Reports                                │   │
│  │  • ngo_field_reports       - Field reports                          │   │
│  │  • ngo_compliance_reports  - Compliance reports                     │   │
│  │  • ngo_permissions         - Permissions                            │   │
│  │  • ngo_documents           - Documents                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW DIAGRAM                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Action (Frontend)                                                     │
│         │                                                                    │
│         ▼                                                                    │
│  React Component (NGODashboard.jsx)                                         │
│         │                                                                    │
│         ▼                                                                    │
│  HTTP Request (Axios/Fetch)                                                 │
│         │                                                                    │
│         ▼                                                                    │
│  Express Route (/api/v1/ngo/*)                                              │
│         │                                                                    │
│         ▼                                                                    │
│  Firebase Middleware (requireFirebase)                                      │
│         │                                                                    │
│         ▼                                                                    │
│  Controller Function (ngo.controller.js)                                    │
│         │                                                                    │
│         ▼                                                                    │
│  Model Method (ngo.model.js)                                                │
│         │                                                                    │
│         ▼                                                                    │
│  Firestore Operation (db().collection().add/get/update/delete)              │
│         │                                                                    │
│         ▼                                                                    │
│  Response (JSON)                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  React Component Update (State)                                             │
│         │                                                                    │
│         ▼                                                                    │
│  UI Render (Display Data)                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      SERVICE INTEGRATION DIAGRAM                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                    ┌─────────────────────────┐                              │
│                    │  Service Control Center │                              │
│                    │  (Unified Management)   │                              │
│                    └─────────────────────────┘                              │
│                              │                                               │
│              ┌───────────────┼───────────────┐                              │
│              │               │               │                              │
│              ▼               ▼               ▼                              │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│    │   Finance   │  │     GIS     │  │     HR      │                      │
│    │   Service   │  │   Service   │  │   Service   │                      │
│    └─────────────┘  └─────────────┘  └─────────────┘                      │
│         │                │                │                                 │
│         ▼                ▼                ▼                                 │
│    • Budgets        • Branches       • Staff                               │
│    • Grants         • Field Sites    • Departments                         │
│    • Payroll        • Visits         • Org Chart                           │
│    • Donor Reports  • Beneficiaries  • Permissions                         │
│    • Bank Accounts  • GPS Mapping    • Documents                           │
│    • Payments                                                               │
│    • Journal Entries                                                        │
│                                                                              │
│              ┌───────────────┼───────────────┐                              │
│              │               │               │                              │
│              ▼               ▼               ▼                              │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│    │   Church    │  │ Procurement │  │Communication│                      │
│    │   Service   │  │   Service   │  │   Service   │                      │
│    └─────────────┘  └─────────────┘  └─────────────┘                      │
│         │                │                │                                 │
│         ▼                ▼                ▼                                 │
│    • Church Branches • Relief Stock  • Announcements                       │
│    • Offerings       • Purchases     • SMS                                 │
│    • Pastoral Visits • Distribution  • WhatsApp                            │
│    • Attendance      • Suppliers     • Email                               │
│    • Members         • Inventory     • Notifications                       │
│                                                                              │
│                    ┌─────────────────────────┐                              │
│                    │   Projects & Programs   │                              │
│                    │        Service          │                              │
│                    └─────────────────────────┘                              │
│                              │                                               │
│                              ▼                                               │
│                    • Programs                                                │
│                    • Donors                                                  │
│                    • Beneficiaries                                           │
│                    • Volunteers                                              │
│                    • Reports                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    ORGANIZATION HIERARCHY DIAGRAM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                    ┌─────────────────────────┐                              │
│                    │     Organization        │                              │
│                    │  (NGO / Church)         │                              │
│                    │                         │                              │
│                    │  • Name                 │                              │
│                    │  • Registration No      │                              │
│                    │  • Tax ID               │                              │
│                    │  • Address              │                              │
│                    │  • Currency             │                              │
│                    │  • Language             │                              │
│                    └─────────────────────────┘                              │
│                              │                                               │
│              ┌───────────────┼───────────────┐                              │
│              │               │               │                              │
│              ▼               ▼               ▼                              │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│    │ Headquarters│  │  Regional   │  │   Church    │                      │
│    │   Branch    │  │   Office    │  │   Branch    │                      │
│    └─────────────┘  └─────────────┘  └─────────────┘                      │
│         │                │                │                                 │
│         ▼                ▼                ▼                                 │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│    │ Departments │  │ Departments │  │ Departments │                      │
│    │             │  │             │  │             │                      │
│    │ • Finance   │  │ • Programs  │  │ • Pastoral  │                      │
│    │ • HR        │  │ • Field Ops │  │ • Youth     │                      │
│    │ • Admin     │  │ • M&E       │  │ • Worship   │                      │
│    └─────────────┘  └─────────────┘  └─────────────┘                      │
│         │                │                │                                 │
│         ▼                ▼                ▼                                 │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│    │    Staff    │  │    Staff    │  │    Staff    │                      │
│    │             │  │             │  │             │                      │
│    │ • Director  │  │ • Field Off │  │ • Pastor    │                      │
│    │ • Manager   │  │ • M&E Off   │  │ • Deacon    │                      │
│    │ • Officer   │  │ • Driver    │  │ • Volunteer │                      │
│    └─────────────┘  └─────────────┘  └─────────────┘                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         PERMISSION FLOW DIAGRAM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                    ┌─────────────────────────┐                              │
│                    │    Permission Catalog   │                              │
│                    │                         │                              │
│                    │  • organization         │                              │
│                    │  • projects             │                              │
│                    │  • donors               │                              │
│                    │  • beneficiaries        │                              │
│                    │  • volunteers           │                              │
│                    │  • church               │                              │
│                    │  • finance              │                              │
│                    │  • grants               │                              │
│                    │  • gis                  │                              │
│                    │  • reports              │                              │
│                    │  • hr                   │                              │
│                    │  • payroll              │                              │
│                    │  • procurement          │                              │
│                    │  • inventory            │                              │
│                    └─────────────────────────┘                              │
│                              │                                               │
│                              ▼                                               │
│                    ┌─────────────────────────┐                              │
│                    │        Roles            │                              │
│                    │                         │                              │
│                    │  • NGO Administrator    │                              │
│                    │  • Finance Officer      │                              │
│                    │  • Field Officer        │                              │
│                    │  • Church Leader        │                              │
│                    │  • Report Viewer        │                              │
│                    └─────────────────────────┘                              │
│                              │                                               │
│              ┌───────────────┼───────────────┐                              │
│              │               │               │                              │
│              ▼               ▼               ▼                              │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│    │   Staff     │  │  Branches   │  │ Departments │                      │
│    │ Assignment  │  │ Assignment  │  │ Assignment  │                      │
│    └─────────────┘  └─────────────┘  └─────────────┘                      │
│         │                │                │                                 │
│         └────────────────┴────────────────┘                                 │
│                          │                                                   │
│                          ▼                                                   │
│                    ┌─────────────────────────┐                              │
│                    │   Access Control        │                              │
│                    │                         │                              │
│                    │  • Organization Level   │                              │
│                    │  • Branch Level         │                              │
│                    │  • Department Level     │                              │
│                    │  • Staff Level          │                              │
│                    │  • Custom Scope         │                              │
│                    └─────────────────────────┘                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            SYSTEM STATUS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ✅ Backend Models:        COMPLETE                                         │
│  ✅ Backend Controllers:   COMPLETE                                         │
│  ✅ Backend Routes:        COMPLETE                                         │
│  ✅ Server Integration:    COMPLETE                                         │
│  ✅ Frontend Pages:        COMPLETE                                         │
│  ✅ Frontend Components:   COMPLETE                                         │
│  ✅ Routing:               COMPLETE                                         │
│  ✅ Data Persistence:      COMPLETE                                         │
│  ✅ Service Integration:   COMPLETE                                         │
│  ✅ Multi-Organization:    COMPLETE                                         │
│  ✅ Finance System:        COMPLETE                                         │
│  ✅ GIS Operations:        COMPLETE                                         │
│  ✅ Permissions:           COMPLETE                                         │
│  ✅ Documentation:         COMPLETE                                         │
│                                                                              │
│  🚀 SYSTEM STATUS: FULLY OPERATIONAL                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Last Updated**: 2026-01-20
**Version**: 1.0.0
**Status**: ✅ Production Ready
