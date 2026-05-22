# NGO Organization Integration System

## Overview
Complete integration of Projects, Tenders, Contracts, Impact Evaluation with Organization feature for professional NGO management.

## Architecture

### Data Flow
```
Organization (NGO)
    ├── Projects
    │   ├── Tenders
    │   │   └── Contracts
    │   ├── Impacts
    │   └── Evaluations
    ├── Branches
    ├── Field Sites
    └── Grants
```

## Collections

### 1. ngo_projects
- **organizationId**: Links to NGO organization
- **name**: Project name
- **description**: Project description
- **status**: planning | active | completed | cancelled
- **budget**: Project budget
- **startDate**: Project start date
- **endDate**: Project end date
- **location**: Project location
- **beneficiaries**: Number of beneficiaries
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

### 2. ngo_tenders
- **organizationId**: Links to NGO organization
- **projectId**: Links to project
- **title**: Tender title
- **description**: Tender description
- **status**: draft | published | closed | awarded
- **publishDate**: Publication date
- **closingDate**: Closing date
- **budget**: Tender budget
- **requirements**: Tender requirements
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

### 3. ngo_contracts
- **organizationId**: Links to NGO organization
- **projectId**: Links to project
- **tenderId**: Links to tender (optional)
- **contractNumber**: Unique contract number
- **vendor**: Vendor/contractor name
- **status**: draft | active | completed | terminated
- **value**: Contract value
- **startDate**: Contract start date
- **endDate**: Contract end date
- **terms**: Contract terms
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

### 4. ngo_impacts
- **organizationId**: Links to NGO organization
- **projectId**: Links to project
- **indicator**: Impact indicator name
- **baseline**: Baseline value
- **target**: Target value
- **actual**: Actual achieved value
- **measurementDate**: Date of measurement
- **notes**: Additional notes
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

### 5. ngo_evaluations
- **organizationId**: Links to NGO organization
- **projectId**: Links to project
- **type**: baseline | midterm | endline | impact
- **status**: pending | in-progress | completed
- **evaluator**: Evaluator name
- **startDate**: Evaluation start date
- **endDate**: Evaluation end date
- **findings**: Evaluation findings
- **recommendations**: Recommendations
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

## API Endpoints

### Projects
- `POST /api/v1/ngo/projects` - Create project
- `GET /api/v1/ngo/projects?organizationId=xxx` - Get all projects
- `GET /api/v1/ngo/projects/:id` - Get project by ID
- `PUT /api/v1/ngo/projects/:id` - Update project
- `DELETE /api/v1/ngo/projects/:id` - Delete project

### Tenders
- `POST /api/v1/ngo/tenders` - Create tender
- `GET /api/v1/ngo/tenders?organizationId=xxx&projectId=xxx` - Get tenders
- `GET /api/v1/ngo/tenders/:id` - Get tender by ID
- `PUT /api/v1/ngo/tenders/:id` - Update tender
- `DELETE /api/v1/ngo/tenders/:id` - Delete tender

### Contracts
- `POST /api/v1/ngo/contracts` - Create contract
- `GET /api/v1/ngo/contracts?organizationId=xxx&projectId=xxx` - Get contracts
- `GET /api/v1/ngo/contracts/:id` - Get contract by ID
- `PUT /api/v1/ngo/contracts/:id` - Update contract
- `DELETE /api/v1/ngo/contracts/:id` - Delete contract

### Impacts
- `POST /api/v1/ngo/impacts` - Create impact
- `GET /api/v1/ngo/impacts?organizationId=xxx&projectId=xxx` - Get impacts
- `GET /api/v1/ngo/impacts/:id` - Get impact by ID
- `PUT /api/v1/ngo/impacts/:id` - Update impact
- `DELETE /api/v1/ngo/impacts/:id` - Delete impact

### Evaluations
- `POST /api/v1/ngo/evaluations` - Create evaluation
- `GET /api/v1/ngo/evaluations?organizationId=xxx&projectId=xxx` - Get evaluations
- `GET /api/v1/ngo/evaluations/:id` - Get evaluation by ID
- `PUT /api/v1/ngo/evaluations/:id` - Update evaluation
- `DELETE /api/v1/ngo/evaluations/:id` - Delete evaluation

### Integration Endpoints
- `GET /api/v1/ngo/integration/organization/:organizationId/overview` - Get complete organization overview
- `GET /api/v1/ngo/integration/project/:projectId/details` - Get project with all related data
- `GET /api/v1/ngo/integration/tender/:tenderId/details` - Get tender with contracts
- `POST /api/v1/ngo/integration/link/tender-to-project` - Link tender to project
- `POST /api/v1/ngo/integration/link/contract-to-tender-project` - Link contract to tender and project
- `POST /api/v1/ngo/integration/link/impact-to-project` - Link impact to project
- `POST /api/v1/ngo/integration/link/evaluation-to-project` - Link evaluation to project

## Usage Examples

### 1. Create a Project
```javascript
POST /api/v1/ngo/projects
{
  "organizationId": "org123",
  "name": "Clean Water Initiative",
  "description": "Providing clean water to rural communities",
  "status": "planning",
  "budget": 50000,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "location": "Rural District A",
  "beneficiaries": 5000
}
```

### 2. Create a Tender for Project
```javascript
POST /api/v1/ngo/tenders
{
  "organizationId": "org123",
  "projectId": "proj456",
  "title": "Water Pump Installation",
  "description": "Installation of 10 water pumps",
  "status": "published",
  "publishDate": "2024-02-01",
  "closingDate": "2024-02-28",
  "budget": 20000,
  "requirements": "Experience in water systems required"
}
```

### 3. Create Contract from Tender
```javascript
POST /api/v1/ngo/contracts
{
  "organizationId": "org123",
  "projectId": "proj456",
  "tenderId": "tender789",
  "contractNumber": "CNT-2024-001",
  "vendor": "ABC Water Solutions",
  "status": "active",
  "value": 18000,
  "startDate": "2024-03-01",
  "endDate": "2024-06-30",
  "terms": "Payment in 3 installments"
}
```

### 4. Track Impact
```javascript
POST /api/v1/ngo/impacts
{
  "organizationId": "org123",
  "projectId": "proj456",
  "indicator": "Access to clean water",
  "baseline": 20,
  "target": 80,
  "actual": 65,
  "measurementDate": "2024-06-30",
  "notes": "Good progress, on track"
}
```

### 5. Create Evaluation
```javascript
POST /api/v1/ngo/evaluations
{
  "organizationId": "org123",
  "projectId": "proj456",
  "type": "midterm",
  "status": "completed",
  "evaluator": "Dr. Jane Smith",
  "startDate": "2024-06-01",
  "endDate": "2024-06-15",
  "findings": "Project is meeting objectives",
  "recommendations": "Increase community engagement"
}
```

### 6. Get Organization Overview
```javascript
GET /api/v1/ngo/integration/organization/org123/overview

Response:
{
  "success": true,
  "data": {
    "projects": [...],
    "tenders": [...],
    "contracts": [...],
    "impacts": [...],
    "evaluations": [...]
  }
}
```

### 7. Get Project Details with All Related Data
```javascript
GET /api/v1/ngo/integration/project/proj456/details

Response:
{
  "success": true,
  "data": {
    "project": {...},
    "tenders": [...],
    "contracts": [...],
    "impacts": [...],
    "evaluations": [...]
  }
}
```

## Integration Benefits

1. **Centralized Management**: All project-related data linked to organization
2. **Traceability**: Track from tender to contract to impact
3. **Reporting**: Easy generation of comprehensive reports
4. **Compliance**: Maintain audit trail for donors
5. **Impact Measurement**: Link impacts directly to projects
6. **Evaluation**: Systematic evaluation linked to projects

## File Structure

```
backend/src/
├── models/ngo/
│   ├── project.model.js
│   ├── tender.model.js
│   ├── contract.model.js
│   ├── impact.model.js
│   └── evaluation.model.js
├── controllers/ngo/
│   ├── project.controller.js
│   ├── tender.controller.js
│   ├── contract.controller.js
│   ├── impact.controller.js
│   ├── evaluation.controller.js
│   └── integration.controller.js
├── routes/ngo/
│   ├── project.routes.js
│   ├── tender.routes.js
│   ├── contract.routes.js
│   ├── impact.routes.js
│   ├── evaluation.routes.js
│   ├── integration.routes.js
│   └── operations.routes.js
└── services/
    └── ngoIntegration.service.js
```

## Next Steps

1. Create frontend components for each module
2. Implement role-based access control
3. Add document upload for contracts and evaluations
4. Create dashboard with analytics
5. Add notification system for tender deadlines
6. Implement approval workflows
7. Add reporting and export features
