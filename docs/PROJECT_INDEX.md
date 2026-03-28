# GAFAIG — PROJECT INDEX
System Map & File Intelligence
Last Updated: 2026-03-27

---

# 🧠 PURPOSE

This document defines:

• full system structure  
• where logic lives  
• how files connect  
• what NOT to touch  

This is the **map of the entire GAFAIG system**.

---

# 🧱 CORE ARCHITECTURE

GAFAIG is a **two-layer system**:

## 1. PRIVATE ENGINE (Snowflake)

Handles:

• verification  
• evidence  
• scoring  
• certification  
• registry snapshots  

## 2. PUBLIC REGISTRY (Next.js + API)

Handles:

• read-only display  
• search  
• explorer  
• badge + verification endpoints  

---

# 🔄 EXECUTION FLOW (CANONICAL)

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SCORE SNAPSHOT  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEWS  
→ QUERY LAYER  
→ API  
→ UI  

---

# ❄️ SNOWFLAKE (SOURCE OF TRUTH)

Database: GAFAIG_DB  
Schema: CORE  

---

## 🔑 CORE TABLES

### Intake / Workflow

• APPLICATIONS  
• VERIFICATION_CASES  
• VERIFICATION_FINDINGS  
• VERIFICATION_FINDING_EVIDENCE  
• VERIFICATION_EVIDENCE  
• VERIFICATION_EVENTS  

---

### Scoring

• CONTROL_CATALOG  
• CONTROL_WEIGHTS  
• SEVERITY_WEIGHTS  
• SCORING_MODEL_VERSIONS  

---

### Output

• SCORE_SNAPSHOTS  
• REGISTRY_SNAPSHOTS (append-only, critical)  

---

## 📊 CORE VIEWS

### Scoring

• V_FINDING_NORMALIZED  
• V_CONTROL_SCORE_COMPONENTS  
• V_CASE_OPERATIONAL_SCORE  
• V_GOVERNANCE_SCORE_CASE  
• V_CASE_TIER_BAND  

---

### Registry

• V_REGISTRY_LATEST_APPROVED (canonical)  
• V_REGISTRY_PUBLIC  
• V_REGISTRY_PUBLIC_SEARCH  
• V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

## ⚙️ STORED PROCEDURES

### Scoring

• SP_SCORE_CASE_ENTERPRISE  

### Publishing

• SP_PUBLISH_CASE_TO_REGISTRY_V3 (canonical)  

---

# 🌐 NEXT.JS APPLICATION (APP ROUTER)

Root:

gafaig/

---

## 📂 APP DIRECTORY

app/

### Public Pages

• page.tsx → homepage  
• registry/page.tsx  
• registry/[registryId]/page.tsx  
• registry/ai-systems/page.tsx  
• registry/ai-systems/[systemId]/page.tsx  

---

### Explorer Pages

• explorer/page.tsx  
• explorer/countries/page.tsx  
• explorer/countries/[country]/page.tsx  
• explorer/map/page.tsx  
• explorer/organizations/page.tsx  
• explorer/systems/page.tsx  

---

### Organization Detail

• organizations/[registryId]/page.tsx  

---

### Admin Pages

• admin/login/page.tsx  
• admin/applications/page.tsx  
• admin/verification/[caseId]/findings/page.tsx  
• admin/verification/[caseId]/evidence/page.tsx  
• admin/verification/[caseId]/score/page.tsx  
• admin/verification/[caseId]/publish/page.tsx  

---

## 🔌 API ROUTES

app/api/

### Public

• registry/route.ts  
• registry/search/route.ts  
• registry/[registryId]/ai-systems/route.ts  
• badge/[registryId]/route.ts  
• verify/[registryId]/route.ts  

---

### Admin

• admin/login/route.ts  
• admin/logout/route.ts  
• admin/verification/findings/route.ts  
• admin/verification/events/route.ts  
• admin/verification/decisions/route.ts  
• admin/verification/[caseId]/summaries/route.ts  

---

# 🧱 QUERY LAYER

Location:

lib/

---

## Core File

lib/snowflake.ts  

### Current State

Primary:

• sfQuery()

Temporary compatibility (DO NOT EXPAND):

• executeQuery  
• snowflakeQuery  
• sfQueryResult  
• snowflakeCtx  

---

## Registry Queries

lib/queries/registry.ts  

### Responsibilities

• registry lookup  
• normalization  
• API consumption  

### Current Behavior

• uses REGISTRY_PUBLIC_READTHROUGH  
• fallback protection for registry lookups  

---

# 🧩 UI COMPONENTS

app/components/

Examples:

• PublicPageHero.tsx  
• buttons / cards / layout components  

---

# 🔐 AUTH SYSTEM

Files:

• middleware.ts  
• lib/auth/require.ts  
• lib/auth/session.ts  
• lib/auth/admin.ts  

---

# 🧠 KEY DESIGN RULES

## Snowflake First

ALL logic must live in Snowflake:

• scoring  
• joins  
• aggregation  
• certification  

---

## API = Pass-through

API must:

• call Snowflake  
• return data  

NOT:

• compute  
• transform  
• derive  

---

## UI = Display Only

UI must:

• render data  

NOT:

• calculate certification  
• compute scores  

---

## Registry = Immutable

• REGISTRY_SNAPSHOTS is append-only  
• NEVER update rows  
• NEVER overwrite history  

---

# ⚠️ CURRENT STATE (IMPORTANT)

## Working

• deployment  
• registry pages  
• badge API  
• verification API  
• publish pipeline  
• Snowflake connectivity  

---

## Recently Fixed

• removed legacy query wrapper pattern  
• standardized explorer pages to sfQuery  
• fixed Vercel build errors  
• resolved module import issues  

---

## Temporary Technical Debt

• compatibility exports in snowflake.ts  
• duplicated SQL in explorer pages  
• registry readthrough layer  

---

# 🔥 NEXT ACTION ZONES

## 1. Explorer Validation

Test:

• countries  
• map  
• organizations  
• systems  

---

## 2. Registry Integrity

Verify:

• registryId consistency  
• snapshot correctness  
• publish determinism  

---

## 3. Query Consolidation (NEXT PHASE)

• move SQL into query layer  
• remove duplication  
• standardize access  

---

## 4. Snowflake Layer Cleanup

• remove compatibility exports  
• enforce sfQuery only  

---

# 🧠 SYSTEM STATUS

GAFAIG is now:

✔ fully deployed  
✔ registry operational  
✔ API complete  
✔ UI complete  
✔ deterministic engine active  

Remaining:

→ runtime validation  
→ query consolidation  
→ technical debt cleanup  

---

# 📌 FINAL NOTE

This file is the **map of truth**.

If something is unclear in future chats:

→ refer here first  
→ do NOT guess  
→ do NOT re-architect  