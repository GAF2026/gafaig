# GAFAIG — API ROUTE MAPPING
Canonical Mapping of API Endpoints → System Behavior
Last Updated: 2026-03-24

---

# PURPOSE

This document defines:

• all API routes  
• their purpose  
• their data source  
• how they connect to Snowflake  
• how they connect to UI  

This is the authoritative API contract layer.

---

# CORE PRINCIPLE

API LAYER = PASS-THROUGH

API routes:

• DO NOT compute logic  
• DO NOT transform data  
• DO NOT invent fields  

Flow must always be:

Snowflake → Query Layer → API → UI

---

# ROOT API DIRECTORY

app/api/

---

# PUBLIC API ROUTES

---

## /api/registry

File:

app/api/registry/route.ts

Purpose:

Returns list of registry records.

Data Source:

lib/queries/registry.ts

Functions:

getRegistryRecords()  
searchRegistryRecords()

Snowflake Source:

GAFAIG_DB.CORE.V_REGISTRY_PUBLIC

Query Parameters:

• limit  
• q  
• country  
• registryId  
• caseId  
• applicationId  

Response:

{
  ok: true,
  rows: [],
  total: number,
  limit: number,
  filters: {}
}

Used By:

• /registry  
• /explorer  
• search UI  

---

## /api/registry/[registryId]

Handled via:

lib/queries/registry.ts

Function:

getRegistryByRegistryId()

Purpose:

Fetch a single registry record.

Snowflake Source:

V_REGISTRY_PUBLIC

Used By:

• /registry/[registryId]

---

## /api/verify/[registryId]

File:

app/api/verify/[registryId]/route.ts

Purpose:

Public verification endpoint.

Enables:

• external validation  
• registry trust verification  
• machine-readable proof  

Data Source:

V_REGISTRY_PUBLIC

Response:

{
  ok: true,
  registryId: "...",
  verified: true,
  record: {},
  proof: {
    alg: "...",
    signature: "...",
    message: "...",
    signedAt: "..."
  }
}

Rules:

• must be deterministic  
• must match registry view exactly  
• no hidden transformations  

Used By:

• registry detail page  
• external consumers  

---

# ADMIN API ROUTES

---

## /api/admin/login

File:

app/api/admin/login/route.ts

Purpose:

• authenticate admin  
• create session  

---

## /api/admin/logout

Purpose:

• destroy session  

---

## /api/admin/status

Purpose:

• check authentication state  

---

## /api/admin/submissions

Purpose:

• fetch application intake data  

---

## /api/admin/verification/findings

Purpose:

• CRUD for findings  

---

## /api/admin/verification/evidence

Purpose:

• manage evidence  

---

## /api/admin/verification/[caseId]/summaries

Purpose:

• manage summaries  

---

## /api/admin/verification/[caseId]/publish

CRITICAL ROUTE

Purpose:

Triggers registry publish.

Flow:

API  
→ Snowflake  
→ SP_PUBLISH_CASE_TO_REGISTRY_V3  
→ REGISTRY_SNAPSHOTS  
→ V_REGISTRY_PUBLIC  

Response:

{
  ok: true,
  registryId: "...",
  snapshotId: "...",
  tier: "...",
  band: "...",
  score: number
}

Used By:

• /admin/verification/[caseId]/score  

---

# QUERY LAYER DEPENDENCY

All public APIs depend on:

lib/queries/registry.ts

Functions:

• getRegistryRecords()  
• searchRegistryRecords()  
• getRegistryByRegistryId()  

Responsibilities:

• execute SQL  
• map Snowflake fields  
• normalize output  

---

# SNOWFLAKE DEPENDENCIES

Primary View:

V_REGISTRY_PUBLIC

Supporting View:

V_REGISTRY_LATEST_APPROVED

Source Table:

REGISTRY_SNAPSHOTS

---

# DATA FLOW

Snowflake  
→ V_REGISTRY_PUBLIC  
→ lib/queries/registry.ts  
→ API  
→ UI  

---

# COMMON FAILURE CASES

---

Invalid Identifier Error

Cause:

API references non-existent column

Fix:

Update Snowflake view  
Update query layer  

---

Undefined Function Error

Cause:

Missing export in query layer

Fix:

Export function in registry.ts  

---

Empty Response

Cause:

Query mismatch or filters incorrect

Fix:

Validate SQL  
Validate mapping  

---

# TEST ENDPOINTS

---

Local:

http://localhost:3000/api/registry?caseId=CASE-0001  

http://localhost:3000/api/verify/[registryId]  

---

Production:

https://www.gafaig.com/api/registry  

https://www.gafaig.com/api/verify/[registryId]  

---

# SUCCESS CRITERIA

✔ API returns valid JSON  
✔ no SQL errors  
✔ fields match Snowflake  
✔ UI renders correctly  

---

# NEXT PHASE

• search endpoint improvements  
• filtering enhancements  
• analytics endpoints  

---

END OF API ROUTE MAPPING