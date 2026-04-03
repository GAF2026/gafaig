# GAFAIG — PROJECT INDEX
System Map & Navigation Reference
Last Updated: 2026-04-03

---

# PURPOSE

This document provides a complete index of:

• system architecture layers  
• Snowflake components  
• API routes  
• UI routes  
• VS Code file structure  
• trust infrastructure surfaces  

Use this file to quickly locate:

→ where logic lives  
→ where data originates  
→ how components connect  

---

# SYSTEM OVERVIEW

GAFAIG is structured as:

1. Snowflake (source of truth)  
2. Query Layer (controlled access)  
3. API Layer (pass-through)  
4. UI Layer (presentation only)  
5. Trust Infrastructure Layer (external verification)  

---

# LAYER 1 — SNOWFLAKE (SOURCE OF TRUTH)

## Database
GAFAIG_DB

## Schema
CORE

---

## Core Tables

CORE.APPLICATIONS  
CORE.VERIFICATION_CASES  
CORE.VERIFICATION_FINDINGS  
CORE.VERIFICATION_EVIDENCE  
CORE.VERIFICATION_EVENTS  
CORE.DECISIONS  
CORE.REGISTRY_SNAPSHOTS  

---

## Core Views

CORE.V_REGISTRY_LATEST_APPROVED  
→ latest approved snapshot per case  

CORE.V_REGISTRY_PUBLIC  
→ primary public registry projection  

CORE.V_REGISTRY_PUBLIC_SEARCH  
→ search-optimized registry view  

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  
→ public AI systems registry  

---

## Engine Views

V_CASE_SCORE_ENTERPRISE  
V_CASE_TIER_BAND  
V_CONTROL_SCORE_COMPONENTS  

---

## Stored Procedures

SP_SCORE_CASE_ENTERPRISE  
→ deterministic scoring  

SP_PUBLISH_CASE_TO_REGISTRY_V3  
→ publish registry snapshot  

---

# LAYER 2 — QUERY LAYER

## Location
lib/queries/

## Purpose
• centralize all Snowflake queries  
• prevent duplication  
• enforce consistency  

---

## Key Files

lib/snowflake.ts  
→ connection + sfQuery()  

lib/queries/registry.ts  
→ registry queries  

lib/queries/explorer.ts  
→ explorer queries  

lib/queries/registry-ai-systems.ts  
→ AI systems queries  

---

# LAYER 3 — API LAYER

## Rules

• no business logic  
• no scoring  
• no transformation beyond mapping  
• pass-through only  

---

## Routes

### Registry API
/api/registry  
→ list/search registry  

/api/registry/search  
→ search endpoint  

---

### Verification API
/api/verify/[registryId]  
→ verification response  
→ returns record + proof  

---

### Badge API
/api/badge/[registryId]  
→ badge rendering  

---

### Public Key
/api/.well-known/gafaig-public-key  
→ verification key endpoint  

---

# LAYER 4 — UI LAYER (NEXT.JS)

## Core Pages

/  
→ homepage  

/mission  
→ system purpose  

/framework  
→ governance model  

/registry  
→ registry listing  

/registry/[registryId]  
→ registry detail  

/explorer  
→ explorer landing  

/verify  
→ verification guide  

/demo  
→ demo surface  

---

## Explorer Subpages

/explorer/countries  
/explorer/organizations  
/explorer/systems  
/explorer/map  

---

## Admin (Internal)

/admin/login  
/admin/applications  
/admin/verification/[caseId]/evidence  
/admin/verification/[caseId]/findings  
/admin/verification/[caseId]/score  
/admin/verification/[caseId]/publish  
/admin/verification/[caseId]/decisions  

---

# LAYER 5 — TRUST INFRASTRUCTURE

## Public Trust Surfaces

### Registry of Record
/registry  
/registry/[registryId]  

---

### Verification
/api/verify/[registryId]  
/verify  

---

### Proof
Signed payload (API response)

---

### Public Key
/api/.well-known/gafaig-public-key  

---

### Badge
/badge/[registryId]  

---

### Widget
public/widget/gafaig-widget.js  

---

### Verify Button
public/widget/gafaig-verify.js  

---

### QR Path
QR → /verify → API  

---

# VS CODE FILE STRUCTURE (HIGH LEVEL)

gafaig/

├─ app/  
│  ├─ _components/  
│  │  ├─ SiteNav.tsx  
│  │  ├─ SiteFooter.tsx  
│  │  ├─ PublicPageHero.tsx  
│  │  ├─ PublicButtonLink.tsx  
│  │  
│  ├─ api/  
│  │  ├─ registry/  
│  │  ├─ verify/[registryId]/route.ts  
│  │  ├─ badge/[registryId]/route.ts  
│  │  ├─ .well-known/gafaig-public-key/route.ts  
│  │  
│  ├─ registry/  
│  │  ├─ page.tsx  
│  │  ├─ [registryId]/page.tsx  
│  │  
│  ├─ explorer/  
│  │  ├─ page.tsx  
│  │  ├─ countries/  
│  │  ├─ organizations/  
│  │  ├─ systems/  
│  │  ├─ map/  
│  │  
│  ├─ verify/  
│  │  ├─ page.tsx  
│  │  
│  ├─ framework/  
│  ├─ mission/  
│  ├─ demo/  
│  ├─ page.tsx  
│  
├─ lib/  
│  ├─ snowflake.ts  
│  ├─ crypto/verify-signing.ts  
│  ├─ queries/  
│  
├─ public/  
│  ├─ widget/  
│  │  ├─ gafaig-widget.js  
│  │  ├─ gafaig-verify.js  
│  
├─ docs/  
│  ├─ MASTER_STATE.md  
│  ├─ CURRENT_FOCUS.md  
│  ├─ CHANGELOG.md  
│  ├─ PROJECT_INDEX.md  
│  ├─ API_ROUTE_MAPPING.md  
│  ├─ UI_COMPONENT_MAPPING.md  
│  ├─ SNOWFLAKE_WORKSHEET_MAPPING.md  
│  ├─ GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md  
│  ├─ GAFAIG_VS_CODE_File_Tree.md  
│  ├─ ENGINEERING_RULES.md  

---

# KEY CONNECTIONS

## Registry Page
app/registry/page.tsx  
→ queries V_REGISTRY_PUBLIC  
→ links to registry detail  

---

## Registry Detail
app/registry/[registryId]/page.tsx  
→ single record view  
→ trust surfaces  

---

## Explorer
app/explorer/page.tsx  
→ aggregates from V_REGISTRY_PUBLIC  

---

## Verify API
app/api/verify/[registryId]/route.ts  
→ Snowflake query  
→ proof generation  

---

## Widget
public/widget/gafaig-widget.js  
→ calls verify API  
→ renders trust surface  

---

# DATA FLOW SUMMARY

Snowflake (truth)
→ Views  
→ Query Layer  
→ API  
→ UI  
→ Trust Surfaces  
→ External Usage  

---

# SYSTEM PRINCIPLE

Everything resolves back to:

→ Snowflake  
→ canonical registry record  

No exceptions.

---

# USAGE

Use this document to:

• locate files quickly  
• understand data origin  
• trace execution paths  
• debug architecture issues  
• onboard new workstreams  

---

# STATUS

The system is:

✔ complete  
✔ structured  
✔ stable  
✔ externally verifiable  

Next focus:

→ adoption and integration