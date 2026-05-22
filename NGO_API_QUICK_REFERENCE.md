# NGO System API Quick Reference

## Base URL
```
http://localhost:3001/api/v1/ngo
```

---

## 1. Organizations API

### Create Organization
```http
POST /organizations
Content-Type: application/json

{
  "name": "Global Aid Foundation",
  "registrationNumber": "NGO-2024-001",
  "type": "NGO",
  "legalStatus": "Registered",
  "taxId": "TAX-123456",
  "foundedDate": "2020-01-01",
  "mission": "Help communities worldwide",
  "vision": "A better world for all",
  "address": "123 Main St",
  "country": "USA",
  "phone": "+1234567890",
  "email": "info@globalaid.org",
  "website": "https://globalaid.org"
}
```

### Get All Organizations
```http
GET /organizations?status=active&type=NGO&country=USA
```

### Get Organization by ID
```http
GET /organizations/:id
```

### Get Organization Stats
```http
GET /organizations/:id/stats
```

### Update Organization
```http
PUT /organizations/:id
```

### Delete Organization
```http
DELETE /organizations/:id
```

---

## 2. Branches API

### Create Branch
```http
POST /branches
Content-Type: application/json

{
  "organizationId": "org123",
  "name": "East Africa Branch",
  "code": "EAB-001",
  "type": "regional",
  "address": "456 Branch St",
  "city": "Nairobi",
  "state": "Nairobi County",
  "country": "Kenya",
  "postalCode": "00100",
  "phone": "+254123456789",
  "email": "nairobi@globalaid.org",
  "managerId": "mgr123",
  "coordinates": { "lat": -1.286389, "lng": 36.817223 },
  "operatingHours": "Mon-Fri 8AM-5PM"
}
```

### Get All Branches
```http
GET /branches?organizationId=org123&status=active&type=regional
```

### Get Branches by Organization
```http
GET /branches/organization/:organizationId
```

---

## 3. Departments API

### Create Department
```http
POST /departments
Content-Type: application/json

{
  "organizationId": "org123",
  "branchId": "branch123",
  "name": "Programs Department",
  "code": "PROG-001",
  "description": "Manages all program activities",
  "headId": "emp123",
  "parentDepartmentId": null,
  "budget": 100000,
  "employeeCount": 15,
  "functions": ["Program Planning", "Implementation", "Monitoring"]
}
```

### Get Department Hierarchy
```http
GET /departments/hierarchy/:organizationId
```

### Get Departments by Branch
```http
GET /departments/branch/:branchId
```

---

## 4. Org Charts API

### Create Org Chart
```http
POST /org-charts
Content-Type: application/json

{
  "organizationId": "org123",
  "name": "2024 Organization Structure",
  "version": "1.0",
  "effectiveDate": "2024-01-01",
  "structure": { "type": "hierarchical", "layout": "top-down" },
  "positions": [],
  "relationships": [],
  "isActive": true
}
```

### Get Active Org Chart
```http
GET /org-charts/active/:organizationId
```

### Generate Org Chart from Structure
```http
GET /org-charts/generate/:organizationId
```

---

## 5. Roles API

### Create Role
```http
POST /roles
Content-Type: application/json

{
  "organizationId": "org123",
  "name": "Program Manager",
  "code": "PM-001",
  "description": "Manages program activities",
  "level": 3,
  "permissions": ["view_programs", "edit_programs", "approve_budgets"],
  "responsibilities": ["Program oversight", "Budget management"],
  "reportingTo": "role_director",
  "departmentId": "dept123",
  "isSystemRole": false
}
```

### Get Role Hierarchy
```http
GET /roles/hierarchy/:organizationId
```

### Assign Permissions
```http
PUT /roles/:id/permissions
Content-Type: application/json

{
  "permissions": ["view_programs", "edit_programs", "delete_programs"]
}
```

### Get Roles by Department
```http
GET /roles/department/:departmentId
```

---

## 6. Finance API

### Create Finance Record
```http
POST /finances
Content-Type: application/json

{
  "organizationId": "org123",
  "type": "income",
  "category": "donation",
  "amount": 50000,
  "currency": "USD",
  "date": "2024-01-15",
  "description": "Grant from XYZ Foundation",
  "projectId": "proj123",
  "departmentId": "dept123",
  "donorId": "donor123",
  "grantId": "grant123",
  "accountCode": "4000",
  "reference": "REF-2024-001",
  "paymentMethod": "bank_transfer",
  "status": "approved",
  "attachments": ["receipt.pdf"],
  "createdBy": "user123",
  "approvedBy": "admin123"
}
```

### Get Financial Summary
```http
GET /finances/summary/:organizationId?startDate=2024-01-01&endDate=2024-12-31
```

### Get Finances by Project
```http
GET /finances/project/:projectId
```

### Get All Finances with Filters
```http
GET /finances?organizationId=org123&type=income&status=approved&startDate=2024-01-01&endDate=2024-12-31
```

---

## 7. Audit API

### Create Audit
```http
POST /audits
Content-Type: application/json

{
  "organizationId": "org123",
  "auditType": "financial",
  "title": "Annual Financial Audit 2024",
  "description": "Comprehensive financial audit",
  "scope": "All financial transactions for 2024",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "auditorId": "auditor123",
  "auditorName": "John Auditor",
  "auditFirm": "ABC Auditors",
  "departmentId": "dept123",
  "projectId": "proj123",
  "findings": [],
  "recommendations": [],
  "riskLevel": "medium",
  "status": "scheduled",
  "reportUrl": "https://...",
  "attachments": [],
  "createdBy": "user123"
}
```

### Add Audit Finding
```http
POST /audits/:id/findings
Content-Type: application/json

{
  "title": "Missing documentation",
  "description": "Invoice #123 lacks supporting documents",
  "severity": "high",
  "recommendation": "Implement document checklist"
}
```

### Get Compliance Status
```http
GET /audits/compliance/:organizationId
```

### Get Audit Trail
```http
GET /audits/trail/history?organizationId=org123&entityType=project&entityId=proj123
```

---

## 8. Beneficial Owners API

### Create Beneficial Owner
```http
POST /beneficial-owners
Content-Type: application/json

{
  "organizationId": "org123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-01",
  "nationality": "USA",
  "idType": "passport",
  "idNumber": "P123456789",
  "ownershipPercentage": 25,
  "ownershipType": "direct",
  "position": "Board Member",
  "address": "123 Owner St",
  "country": "USA",
  "phone": "+1234567890",
  "email": "john.doe@email.com",
  "isPoliticallyExposed": false,
  "verificationStatus": "pending",
  "documents": ["id_copy.pdf", "proof_of_address.pdf"],
  "notes": "Founding member"
}
```

### Verify Beneficial Owner
```http
PUT /beneficial-owners/:id/verify
Content-Type: application/json

{
  "verifiedBy": "admin123"
}
```

### Get Ownership Structure
```http
GET /beneficial-owners/structure/:organizationId
```

### Get Politically Exposed Persons
```http
GET /beneficial-owners/pep/:organizationId
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "doc123",
    "name": "Example",
    ...
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Common Query Parameters

- `organizationId` - Filter by organization
- `status` - Filter by status (active, inactive, etc.)
- `type` - Filter by type
- `startDate` - Start date for date range
- `endDate` - End date for date range
- `departmentId` - Filter by department
- `projectId` - Filter by project
- `branchId` - Filter by branch

---

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `404` - Not Found
- `500` - Server Error
- `503` - Service Unavailable (Firebase initializing)

---

## Authentication

All endpoints require Firebase authentication token in the Authorization header:

```http
Authorization: Bearer <firebase-token>
```

---

## Testing with cURL

### Example: Create Organization
```bash
curl -X POST http://localhost:3001/api/v1/ngo/organizations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test NGO",
    "registrationNumber": "TEST-001",
    "country": "USA",
    "email": "test@ngo.org"
  }'
```

### Example: Get Financial Summary
```bash
curl -X GET "http://localhost:3001/api/v1/ngo/finances/summary/org123?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Postman Collection

Import these endpoints into Postman for easy testing:
1. Set base URL: `http://localhost:3001/api/v1/ngo`
2. Add Authorization header with Firebase token
3. Use the endpoints above

---

## Notes

- All dates should be in ISO 8601 format (YYYY-MM-DD)
- All amounts are numeric (no currency symbols)
- Arrays should be valid JSON arrays
- Objects should be valid JSON objects
- File attachments should be URLs or file paths

---

**Last Updated**: $(date)
**Version**: 1.0
