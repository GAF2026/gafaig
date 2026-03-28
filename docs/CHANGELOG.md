# GAFAIG — CHANGELOG

---

## 2026-03-27

### 🚀 Deployment Stabilization (CRITICAL MILESTONE)
- Achieved successful production deployment on Vercel after resolving multiple TypeScript and module errors.
- Eliminated legacy query wrapper pattern (`sfQueryResult`, `.ok`, `.rows`, `.error`) across explorer and organization pages.
- Standardized runtime queries to use `sfQuery()` as the canonical Snowflake access method.
- Restored full build pipeline integrity (`npm run build` passes successfully).

---

### 🧠 Snowflake Query Layer Compatibility (TEMPORARY STABILIZATION)
- Introduced temporary compatibility exports in `lib/snowflake.ts`:
  - `executeQuery`
  - `snowflakeQuery`
  - `sfQueryResult`
  - `snowflakeCtx`
- Purpose:
  - prevent widespread refactor during deployment stabilization
  - allow legacy files to compile
- Marked as **temporary scaffolding** to be removed in post-validation cleanup.

---

### 📦 Registry System Stability
- Confirmed deterministic registry ID reuse:
  - Same CASE → same REGISTRY_ID
  - No duplicate registry IDs created during republish
- Verified publish procedure (`SP_PUBLISH_CASE_TO_REGISTRY_V3`) correctly:
  - inserts append-only snapshots
  - aligns AI systems
  - pulls from canonical scoring view
- Registry snapshots confirmed append-only and immutable.

---

### 🏷 Badge API Stabilization
- Fixed `/api/badge/[registryId]`:
  - corrected registry lookup issues
  - implemented fallback logic for:
    - tier
    - band
    - score
  - added optional `badgeImageUrl` override support
- Confirmed proper redirect behavior (307 → badge image).

---

### 🔍 Registry Query Layer Adjustment
- Updated `lib/queries/registry.ts` to use:
  - `REGISTRY_PUBLIC_READTHROUGH`
- Purpose:
  - eliminate inconsistent reads from snapshot timing
  - ensure stable registry lookups
- Marked for future architectural decision (readthrough vs direct view).

---

### 🌐 Explorer Pages Refactor (CRITICAL FIX)
Refactored all explorer-related pages to remove legacy query wrapper usage:

Updated pages:

- `/app/explorer/countries/page.tsx`
- `/app/explorer/countries/[country]/page.tsx`
- `/app/explorer/map/page.tsx`
- `/app/explorer/organizations/page.tsx`
- `/app/explorer/systems/page.tsx`
- `/app/organizations/[registryId]/page.tsx`

Changes:

- replaced `sfQueryResult` with `sfQuery`
- removed `.ok`, `.rows`, `.error` patterns
- enforced direct array return from Snowflake queries
- eliminated TypeScript build errors across explorer system

---

### 🧱 Query Layer Direction Clarified
- Established `sfQuery()` as the single future standard.
- Identified need to:
  - consolidate duplicated SQL queries
  - move repeated logic into shared query modules
- Deferred until after runtime validation phase.

---

### ⚠️ Temporary Technical Debt (INTENTIONAL)
Accepted for deployment stabilization:

- compatibility exports in `lib/snowflake.ts`
- duplicated SQL across explorer pages
- readthrough registry layer usage

These are explicitly marked for removal in next phase.

---

### 📊 System Status (Post-Deployment)

✔ Build passes  
✔ Deployment stable  
✔ Registry pages functional  
✔ Badge + verification APIs working  
✔ Snowflake connectivity stable  

⚠ Explorer pages:
- compile successfully
- require runtime validation

---

### 🎯 Transition to Validation Phase
System moved from:

"Fix build errors"

→

"Validate runtime behavior"

Next focus:

- test all explorer routes
- confirm data integrity
- ensure registry consistency across UI and Snowflake

---

## PRIOR STATE (SUMMARY)

### Core Architecture
- Established canonical deterministic pipeline:
  CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → SNAPSHOT → REGISTRY

### Scoring Engine
- Implemented Enterprise Governance Scoring (v1.0)
- Deterministic scoring only (no ML)

### Registry System
- Append-only snapshot architecture
- Public projection via Snowflake views

### API Layer
- Pass-through architecture enforced
- No business logic outside Snowflake

### UI
- Registry and explorer surfaces implemented
- Query layer abstraction introduced

---

# 🔥 CURRENT POSITION

GAFAIG is now:

✔ deployed  
✔ operational  
✔ query-stable  
✔ registry-consistent  

Remaining work:

→ runtime validation  
→ query consolidation  
→ cleanup of temporary compatibility layer  