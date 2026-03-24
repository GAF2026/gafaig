# GAFAIG — MASTER STATE
Canonical Platform Definition
Last Updated: 2026-03-24

---

# PLATFORM IDENTITY

GAFAIG is the **world’s first searchable AI governance registry**.

It is **global trust infrastructure**, comparable to:

• financial audit systems  
• certificate authorities  
• regulatory registries  
• standards organizations  

GAFAIG is NOT:

• a dashboard  
• a scoring tool  
• a SaaS analytics app  

GAFAIG IS:

A **deterministic governance engine + public certification registry**

---

# CORE ARCHITECTURE (LOCKED)

Two-layer system:

## 1. PRIVATE VERIFICATION ENGINE (Snowflake)

Handles:

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ DECISION  

Properties:

• deterministic  
• reproducible  
• auditable  
• org-isolated  
• evidence never exposed publicly  

---

## 2. PUBLIC REGISTRY (Snowflake + Next.js)

Exposes:

• certification status  
• score / tier / band  
• timestamps  
• entity identity  
• registry ID  

NEVER exposes:

• evidence  
• reviewer notes  
• internal scoring logic  

---

# CANONICAL DATA FLOW (DO NOT CHANGE)

APPLICATION (intake only)

→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SNAPSHOT  
→ REGISTRY  
→ PUBLIC VIEWS  
→ API  
→ UI  

---

# SNOWFLAKE ARCHITECTURE

Account: GAFAIG1  
Database: GAFAIG_DB  
Schema: CORE  
Warehouse: GAFAIG_WH  

---

## CORE TABLES (ENGINE)

• VERIFICATION_CASES  
• VERIFICATION_FINDINGS  
• VERIFICATION_EVIDENCE  
• VERIFICATION_EVENTS  
• CASE_CONTROL_ATTESTATIONS  
• SCORING_CONFIG  
• SEVERITY_WEIGHTS  

---

## REGISTRY TABLES

• REGISTRY_SNAPSHOTS (append-only)  
• CASE_APPROVAL_LOG  

---

## KEY VIEWS

### ENGINE

• V_GOVERNANCE_SCORE_CASE  

---

### REGISTRY (CRITICAL)

• V_REGISTRY_LATEST_APPROVED  ← source of truth  
• V_REGISTRY_PUBLIC           ← UI/API source  
• V_REGISTRY_PUBLIC_SEARCH    ← search surface  
• V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

## PUBLISH ENGINE

Stored Procedure:

SP_PUBLISH_CASE_TO_REGISTRY_V3

Properties:

• deterministic snapshot creation  
• INSERT … SELECT (no JSON binding issues)  
• append-only  
• idempotent  

---

# CURRENT SYSTEM STATUS

## FULL PIPELINE — WORKING

✔ CASE → REGISTRY complete  
✔ scoring engine deterministic  
✔ publish pipeline working  
✔ snapshots created correctly  
✔ registry IDs generated  
✔ API responding  
✔ UI rendering  

---

## CURRENT GAP (ACTIVE WORK)

We are in:

# REGISTRY ENRICHMENT PHASE

Missing / being wired:

• certified_score normalization  
• certified_tier normalization  
• certified_band normalization  
• certification_status consistency  
• valid_from  
• valid_to  
• certified_at  
• last_activity_at  

---

# CRITICAL RULES (DO NOT BREAK)

DO NOT:

• re-architect system  
• change data flow  
• move logic out of Snowflake  
• expose evidence publicly  
• introduce non-deterministic logic  

ALWAYS:

• use Snowflake as source of truth  
• derive UI from views (not tables)  
• maintain deterministic outputs  
• keep registry append-only  

---

# VIEW CONTRACT (CRITICAL)

UI + API depend on:

V_REGISTRY_PUBLIC

This view MUST provide:

• REGISTRY_ID  
• APPLICATION_ID  
• CASE_ID  
• ENTITY_NAME  
• ENTITY_TYPE  
• COUNTRY  

• SCORE  
• TIER  
• BAND  

• CERTIFIED_SCORE  
• CERTIFIED_TIER  
• CERTIFIED_BAND  
• CERTIFICATION_STATUS  

• DECISION_STATUS  

• CERTIFIED_AT  
• APPROVED_AT  
• PUBLISHED_AT  

---

# IMPORTANT CURRENT ISSUE

The system is failing due to:

❌ missing columns in V_REGISTRY_PUBLIC

Errors seen:

• invalid identifier VALID_FROM  
• invalid identifier LAST_ACTIVITY_AT  

---

## ROOT CAUSE

UI/API expect derived fields:

• validFrom  
• lastActivityAt  

But Snowflake view does not define them.

---

## CORRECT ARCHITECTURE (LOCKED)

These fields MUST be DERIVED — NOT stored.

Mapping:

valid_from =
  CERTIFIED_AT
  OR APPROVED_AT
  OR PUBLISHED_AT

last_activity_at =
  PUBLISHED_AT
  OR CERTIFIED_AT
  OR APPROVED_AT

---

# NEXT EXECUTION PHASE

## PHASE: CERTIFICATION WIRING (IN PROGRESS)

Goal:

Make registry output **complete + stable**

---

## STEP ORDER (STRICT)

1. Fix Snowflake view (V_REGISTRY_PUBLIC)
2. Fix query layer (lib/queries/registry.ts)
3. Fix API routes
4. Fix UI components
5. Validate end-to-end

---

# REPOSITORY

GitHub:

GAF2026/gafaig

---

# FRONTEND

Framework:

Next.js (App Router, TypeScript)

---

## KEY ROUTES

### PUBLIC

/  
/mission  
/framework  
/registry  
/registry/[registryId]  
/registry/ai-systems  
/ai-systems/[systemId]  
/explorer  

---

### ADMIN

/admin/login  
/admin/applications  
/admin/verification/[caseId]/evidence  
/admin/verification/[caseId]/findings  
/admin/verification/[caseId]/score  

---

# API LAYER

## PUBLIC

/api/registry  
/api/registry/[registryId]  
/api/verify/[registryId]  

---

## ADMIN

/api/admin/login  
/api/admin/logout  
/api/admin/status  
/api/admin/submissions  
/api/admin/verification/*  
/api/admin/publish  

---

# QUERY LAYER

Location:

lib/queries/

Key file:

registry.ts

Purpose:

• single source of truth for SQL  
• prevents drift between UI and Snowflake  
• ensures deterministic outputs  

---

# DEPLOYMENT

Platform:

Vercel

Production:

https://www.gafaig.com

---

# LOCAL DEV

Start:

npm run dev

Clear cache:

Remove-Item -Recurse -Force .next

---

# CURRENT PRIORITY

👉 COMPLETE CERTIFICATION WIRING

We are NOT:

• adding features  
• redesigning UI  
• changing architecture  

We ARE:

• stabilizing registry output  
• aligning Snowflake → API → UI  
• ensuring all certification fields resolve  

---

# SUCCESS CONDITION

System must:

✔ return full registry record  
✔ no SQL errors  
✔ no missing fields  
✔ render in UI  
✔ match deterministic Snowflake output  

---

END OF MASTER STATE