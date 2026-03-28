# GAFAIG — MASTER STATE
Canonical Architecture & Platform Memory
Last Updated: 2026-03-27

# 🧠 PLATFORM DEFINITION

GAFAIG (Global Authority for AI Governance) is the world’s first searchable AI governance registry powered by a deterministic verification engine.

It is global trust infrastructure analogous to:

• financial audit systems  
• certificate authorities  
• regulatory registries  
• standards bodies  

GAFAIG is NOT:

• a dashboard  
• a scoring tool  
• a simple database  

GAFAIG IS:

A deterministic governance engine + public registry system

# 🔒 CANONICAL DATA FLOW (LOCKED)

ALL DATA MUST FOLLOW THIS FLOW:

APPLICATION (intake only)  
→ CASE  
→ VERIFICATION_FINDINGS  
→ VERIFICATION_EVIDENCE  
→ VERIFICATION_EVENTS  
→ SCORING (deterministic)  
→ SCORE SNAPSHOT  
→ REGISTRY SNAPSHOT (append-only)  
→ PUBLIC VIEWS  
→ API  
→ UI  

# ❄️ SNOWFLAKE IS SOURCE OF TRUTH

ALL:

• joins  
• scoring  
• aggregation  
• certification state  
• registry projection  

MUST happen in Snowflake.

❌ NO frontend-derived data  
❌ NO API business logic  
❌ NO UI transformations of certification  

# 🧮 SCORING ENGINE (ENTERPRISE v1.0)

Deterministic (NO ML)

Inputs:

• VERIFICATION_FINDINGS  
• VERIFICATION_FINDING_EVIDENCE  
• VERIFICATION_EVIDENCE (freshness)  
• CONTROL_CATALOG  
• CONTROL_WEIGHTS  
• SEVERITY_WEIGHTS  

Outputs:

• V_GOVERNANCE_SCORE_CASE  
• V_CASE_TIER_BAND  
• V_CASE_SCORE_ENTERPRISE  

Execution:

• SP_SCORE_CASE_ENTERPRISE  

# 📦 REGISTRY SYSTEM (LOCKED)

## Core Table

CORE.REGISTRY_SNAPSHOTS  
→ append-only  
→ never updated  
→ never overwritten  

## Canonical View

V_REGISTRY_LATEST_APPROVED  
→ latest approved snapshot per case  

## Public Views

• V_REGISTRY_PUBLIC  
• V_REGISTRY_PUBLIC_SEARCH  
• V_REGISTRY_AI_SYSTEMS_PUBLIC  

These power ALL:

• registry pages  
• explorer  
• API  

# 📤 PUBLISH SYSTEM (CRITICAL)

Canonical Procedure:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  

(extended internally to V4 logic where needed)

## Guaranteed Behavior

• REUSES existing REGISTRY_ID for a case  
• NEVER creates duplicate registry IDs  
• INSERTS append-only snapshot  
• aligns AI systems to registry  
• pulls score from V_GOVERNANCE_SCORE_CASE  

# 🆔 REGISTRY ID RULE (LOCKED)

• Format: GAFAIG-XXXXXXXX  
• Deterministic per CASE  
• Same CASE → same REGISTRY_ID forever  
• No duplicates allowed  

# 🧩 PUBLIC CONTRACT (CRITICAL)

Registry fields exposed:

• registryId  
• applicationId  
• caseId  
• entityName  
• entityType  
• country  
• certifiedTier  
• certifiedBand  
• certifiedScore  
• certificationStatus  
• decisionStatus  
• certifiedAt  
• validFrom  
• validTo  
• lastActivityAt  

# 🔌 API LAYER (PASS-THROUGH ONLY)

Pattern:

Snowflake → Query Layer → API → UI  

NO:

• scoring in API  
• joins in API  
• fallback logic  

# 🧱 QUERY LAYER

Primary interface:

lib/snowflake.ts → sfQuery()

## CURRENT STATE (IMPORTANT)

Temporary compatibility exports exist:

• executeQuery  
• snowflakeQuery  
• sfQueryResult  
• snowflakeCtx  

⚠️ Transitional only  
→ Long-term: standardize ONLY on sfQuery

# 📂 REGISTRY QUERY LAYER

Primary file:

lib/queries/registry.ts  

## CURRENT STATE

Uses:

REGISTRY_PUBLIC_READTHROUGH  

Reason:

• ensures reliable lookup  
• protects against snapshot/view timing issues  

⚠️ Future decision required:

• keep readthrough layer  
OR  
• revert fully to V_REGISTRY_PUBLIC  

# 🌐 PUBLIC ROUTES

## Registry

• /registry  
• /registry/[registryId]  
• /registry/ai-systems  
• /registry/ai-systems/[systemId]  

## Explorer

• /explorer  
• /explorer/countries  
• /explorer/countries/[country]  
• /explorer/map  
• /explorer/organizations  
• /explorer/systems  

## API

• /api/registry  
• /api/registry/search  
• /api/registry/[registryId]/ai-systems  
• /api/badge/[registryId]  
• /api/verify/[registryId]  

# 🏷 BADGE SYSTEM

Route:

/api/badge/[registryId]

Behavior:

• fetch registry row  
• determine badge via tier / band / score  
• optional override via badgeImageUrl  
• redirect → image  

# 🔐 AUTH SYSTEM

Admin routes protected via:

• middleware.ts  
• requireAdmin()  

Session:

• GAFAIG_SESSION_SECRET  
• cookie-based auth  

# 🚀 DEPLOYMENT

Platform:

Vercel  

Production:

https://www.gafaig.com  

## CURRENT STATUS

✔ Build successful  
✔ Deployment stable  
✔ Explorer + registry compiling  
✔ Snowflake connected  

# ⚠️ CURRENT STATE SUMMARY

## WORKING

• registry page  
• badge API  
• publish pipeline  
• registry snapshots  
• Snowflake connectivity  
• Vercel deployment  
• explorer pages compile  

## PARTIALLY VERIFIED

• explorer pages (some load, some need testing)  
• country + system aggregations  

## KNOWN TEMPORARY AREAS

• compatibility exports in snowflake.ts  
• readthrough registry layer  
• duplicated SQL across explorer pages  

# 🔥 CRITICAL RULES (DO NOT BREAK)

• DO NOT re-architect  
• DO NOT move logic to frontend  
• DO NOT compute certification outside Snowflake  
• DO NOT mutate registry snapshots  
• DO NOT generate new registry IDs for same case  

# ▶️ NEXT PHASE

Registry Surface Completion → Explorer Validation → Query Consolidation  

Immediate goals:

1. Validate ALL explorer routes  
2. Confirm runtime data correctness  
3. Remove legacy query wrapper patterns  
4. Consolidate query layer  
5. Normalize Snowflake access (sfQuery only)  

# 🧠 SYSTEM STATUS

GAFAIG is now:

✔ a working deterministic governance engine  
✔ a functioning global registry  
✔ deployed infrastructure  
✔ API-complete  
✔ UI-complete (pending validation pass)