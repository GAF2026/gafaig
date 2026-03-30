# GAFAIG — API ROUTE MAPPING
Canonical API Layer Map
Last Updated: 2026-03-29

---

# PRINCIPLE

API LAYER IS A THIN PASS-THROUGH

API MUST:
• call Snowflake views or procedures
• return structured JSON
• NOT compute business logic
• NOT compute certification

ALL CERTIFICATION LOGIC EXISTS IN SNOWFLAKE

---

# BASE PATH

app/api/

---

# PUBLIC API ROUTES

---

## 1. REGISTRY LIST

Route:
/api/registry

Method:
GET

Source:
CORE.V_REGISTRY_PUBLIC

Query Params (optional):
• limit
• q (search string)
• country
• registryId
• caseId
• applicationId

Purpose:
→ Returns list of registry records

Used by:
• /registry page
• Explorer pages

---

## 2. REGISTRY SEARCH

Route:
/api/registry/search

Method:
GET

Source:
CORE.V_REGISTRY_PUBLIC_SEARCH

Query Params:
• q (search string)

Purpose:
→ Optimized search across registry fields

Notes:
• Uses normalized uppercase fields
• Uses concatenated search column (q)

---

## 3. REGISTRY AI SYSTEMS

Route:
/api/registry/[registryId]/ai-systems

Method:
GET

Source:
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Params:
• registryId (path)

Purpose:
→ Returns AI systems associated with a registry record

Used by:
• /registry/[registryId] page
• /registry/ai-systems page

---

## 4. VERIFY ENDPOINT

Route:
/api/verify/[registryId]

Method:
GET

Source:
CORE.V_REGISTRY_PUBLIC

Params:
• registryId (path)

Purpose:
→ Returns verification payload (proof JSON)

Response includes:
• registryId
• entityName
• certifiedScore
• certifiedTier
• certifiedBand
• certifiedAt
• decisionStatus
• validFrom
• validTo

Notes:
• May include signature metadata
• Must not expose internal/private data

Used by:
• /verify/[registryId] page
• badge route
• external verification

---

# ADMIN API ROUTES

---

## AUTH

---

### Login

Route:
/api/admin/login

Method:
POST

Purpose:
→ Authenticate admin user

---

### Logout

Route:
/api/admin/logout

Method:
POST

Purpose:
→ End admin session

---

### Status

Route:
/api/admin/status

Method:
GET

Purpose:
→ Check admin authentication state

---

## VERIFICATION WORKFLOW

---

### Findings

Route:
/api/admin/verification/findings

Method:
GET / POST

Purpose:
→ Retrieve or create findings

Tables:
CORE.VERIFICATION_FINDINGS

---

### Evidence Summary

Route:
/api/admin/verification/evidence/summary

Method:
GET

Purpose:
→ Summarize evidence for a case

Tables:
CORE.VERIFICATION_EVIDENCE

---

### Events

Route:
/api/admin/verification/events

Method:
POST

Purpose:
→ Insert verification events

Tables:
CORE.VERIFICATION_EVENTS

Important:
→ Use PARSE_JSON(?) when inserting JSON

---

### Decisions

Route:
/api/admin/verification/decisions

Method:
POST

Purpose:
→ Insert decision record

Tables:
CORE.DECISIONS

Important:
• normalize CASE_ID (uppercase)
• ensure valid decision status

---

# INTERNAL FLOW (IMPORTANT)

API DOES NOT DO THIS:

✘ scoring
✘ tier calculation
✘ certification logic
✘ aggregation

API ONLY DOES:

✔ call Snowflake view
✔ call Snowflake procedure
✔ return JSON

---

# DATA FLOW

Snowflake Tables
→ Snowflake Views
→ Query Layer (lib/queries)
→ API Routes
→ UI

---

# ERROR HANDLING

API must:

• return structured JSON:
  { ok: true, data: ... }
  { ok: false, error: ... }

• NOT throw raw SQL errors to client
• log internal errors safely

---

# SECURITY

Admin routes protected by:

middleware.ts

Protected paths:
• /admin/*
• /api/admin/*

Public routes:
• /api/registry
• /api/verify
• /api/registry/search

---

# KEY RULES

DO NOT:

• add business logic in API
• compute certification in API
• bypass Snowflake views
• mutate registry data directly

ALWAYS:

• read from canonical views
• write through procedures or tables upstream of scoring
• maintain deterministic pipeline

---

# PURPOSE

This file ensures:

• API layer remains thin and consistent
• no logic leaks outside Snowflake
• clear mapping between endpoints and data sources
• stability across system evolution

---