# GAFAIG — API ROUTE MAP
Canonical Route Responsibilities
Last Updated: 2026-03-22

---

# PURPOSE

This document defines:

• every API route  
• what each route is responsible for  
• which Snowflake/query-layer objects it must use  
• how data flows from backend to UI  

This prevents:

• duplicate SQL  
• broken data contracts  
• routing confusion  
• UI calling incorrect sources  

---

# CORE PRINCIPLE

API routes are transport + orchestration layers.

They must:

• call query layer functions OR procedures  
• never embed business logic  
• never duplicate Snowflake view logic  
• never compute certification  

---

# LAYER FLOW

Frontend  
→ API Route  
→ Query Layer / Procedure  
→ Snowflake View / Table  

---

# PUBLIC API ROUTES

## /api/registry/ai-systems

### Purpose
Return full public dataset of AI systems.

### Canonical Source
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

### Query File
lib/queries/registry-ai-systems.ts

### Required Fields
SYSTEM_ID  
REGISTRY_ID  
CASE_ID  
SYSTEM_NAME  
ENTITY_NAME  
ORG_ID  
VERIFICATION_TYPE  
SCORE  
TIER  
BAND  
CERTIFIED_SCORE  
CERTIFIED_TIER  
CERTIFIED_BAND  
CERTIFIED_AT  
DECISION_STATUS  
RENEWAL_STATUS  

### Rule
This is the primary dataset powering the registry UI.

---

## /api/registry/ai-systems/[registryId]

### Purpose
Return AI systems filtered by registry ID.

### Canonical Source
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

### Rule
Must return same certification fields as list route.

---

## /api/verify/[registryId]

### Purpose
Public verification endpoint.

### Canonical Source
CORE.V_REGISTRY_LATEST_APPROVED  
or  
CORE.V_REGISTRY_PUBLIC  

### Output Fields
REGISTRY_ID  
CASE_ID  
ENTITY_NAME  
VERIFICATION_TYPE  
CERTIFIED_SCORE  
CERTIFIED_TIER  
CERTIFIED_BAND  
CERTIFIED_AT  
DECISION_STATUS  
RENEWAL_STATUS  

### Rule
Used for external validation of certification.

---

# ADMIN API ROUTES

## /api/admin/applications

### Purpose
Return application intake data.

### Source
APPLICATIONS table / intake layer

### Rule
Not part of governance truth.

---

## /api/admin/applications/[requestId]

### Purpose
Return specific application.

### Source
APPLICATIONS table

---

## /api/admin/verification/findings

### Purpose
Create/update findings.

### Source
FINDINGS + verification workflow

---

## /api/admin/verification/decisions

### Purpose
Store approval status.

### Source
DECISIONS layer

---

## /api/admin/verification/[caseId]/score

### Purpose
Return score for admin.

### Source
SP_SCORE_CASE_ENTERPRISE  
or  
V_GOVERNANCE_SCORE_CASE  

### Rule
Admin-only inspection.

---

## /api/admin/verification/publish

### Purpose
Trigger registry publish.

### Procedure
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

### Rule
ONLY path that writes to REGISTRY_SNAPSHOTS.

---

# QUERY LAYER CONTRACT

## File
lib/queries/registry-ai-systems.ts

### Must Map

certifiedTier → r.CERTIFIED_TIER  
certifiedBand → r.CERTIFIED_BAND  
certifiedScore → r.CERTIFIED_SCORE  
certifiedAt → r.CERTIFIED_AT  
decisionStatus → r.DECISION_STATUS  

### Must NOT Map

certifiedTier → r.TIER  
certifiedBand → r.BAND  
certifiedScore → r.SCORE  

---

# ROUTE RESPONSIBILITY SUMMARY

/api/registry/ai-systems  
→ public list  
→ uses V_REGISTRY_AI_SYSTEMS_PUBLIC  

/api/registry/ai-systems/[registryId]  
→ system detail  
→ uses V_REGISTRY_AI_SYSTEMS_PUBLIC  

/api/verify/[registryId]  
→ certification verification  
→ uses V_REGISTRY_LATEST_APPROVED  

/api/admin/applications  
→ intake list  

/api/admin/applications/[requestId]  
→ intake detail  

/api/admin/verification/findings  
→ findings workflow  

/api/admin/verification/decisions  
→ approval workflow  

/api/admin/verification/[caseId]/score  
→ score inspection  

/api/admin/verification/publish  
→ publish to registry  

---

# RULES

1. Public routes use public views only  
2. Admin routes may use internal tables  
3. Never duplicate SQL from views  
4. Never compute certification in API  
5. Always use CERTIFIED_* fields  

---

# DEBUGGING ORDER

1. Verify Snowflake view  
2. Verify query layer mapping  
3. Verify API route  
4. Verify UI  

---

# CURRENT PRIORITY

Fix query layer mapping so UI reflects certification correctly.

---

END OF FILE