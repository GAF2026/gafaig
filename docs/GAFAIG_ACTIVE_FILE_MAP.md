# GAFAIG_ACTIVE_FILE_MAP.md
Last Updated: 2026-04-15

## PURPOSE
This file is the **active execution map** of the GAFAIG platform. It defines the **files that matter right now** for building, debugging, and operating the system.

This is NOT a full repo tree.
This is the **live control + execution map**.

Snowflake is the source of truth.
Next.js only surfaces Snowflake outputs.

---

## 🚨 CRITICAL CONTROL FILES (LOAD FIRST — NON-OPTIONAL)

These are NOT documentation.

These are **system control files** and must be loaded at the start of every chat and treated as authoritative.

- docs/MASTER_STATE.md  
  → Canonical architecture (what exists, what is allowed)

- docs/CURRENT_FOCUS.md  
  → Execution state (what we are doing now)

- docs/ENGINEERING_RULES.md  
  → Hard rules (what must NEVER be broken)

- docs/CANONICAL_RUN_ORDER.md  
  → Deterministic system execution sequence  
  → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY → PUBLIC

Failure to follow these files results in:
- scoring failures  
- publish failures  
- silent data gaps  
- broken registry surfaces  

---

## 🧠 CORE SYSTEM PRINCIPLE

- Snowflake = **Truth Engine**
- Next.js = **Trust Surface**
- API Layer = **Transport only**
- No logic duplication outside Snowflake
- No scoring outside Snowflake
- No certification logic outside Snowflake

---

## 🔴 CURRENT PLATFORM STATE

### ✅ Working
- Public registry pages
- Explorer pages
- Verify pages
- Widget preview + embed
- Proof/signature system (API-based)

### ❌ Active Blocker
Canonical seed pipeline is broken at:

SCORING → PUBLISH

Specifically:
- `SP_SCORE_CASE_ENTERPRISE` runs but inserts 0 rows
- `V_GOVERNANCE_SCORE_CASE` does not return rebuilt cases
- `SP_PUBLISH_CASE_TO_REGISTRY_V3` produces no registry records

---

## 🧩 SNOWFLAKE — CORE EXECUTION FILES

### Registry Layer
- `21_VIEWS_PUBLIC_REGISTRY.sql`
  → Defines `CORE.V_REGISTRY_PUBLIC`

- `GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql`
  → Defines:
    - `CORE.REGISTRY_SNAPSHOTS`
    - `CORE.V_REGISTRY_LATEST_APPROVED`

- `GAFAIG - CORE.REGISTRY_PUBLISH.sql`
  → Contains:
    - `SP_PUBLISH_CASE_TO_REGISTRY_V3`
    - `SP_PUBLISH_CASE_TO_REGISTRY_V4`

---

### Scoring Layer (CRITICAL BLOCK AREA)

- `GAFAIG - Governance Scoring (Enterprise v1.2).sql`

- `CORE.SP_SCORE_CASE_ENTERPRISE`
  → Currently returns:
    - ok = true
    - rowsInserted = 0 ❌

- `CORE.V_GOVERNANCE_SCORE_CASE`
  → Required by publish
  → Currently missing rebuilt cases ❌

- Supporting Views:
  - `CORE.V_CASE_SCORE_ENTERPRISE`
  - `CORE.V_CASE_TIER_BAND`
  - `CORE.V_CASE_RENEWAL_STATUS`
  - `CORE.V_FINDING_UNMAPPED_CONTROLS`

---

### Score Storage (LIVE CONFIRMED)
- `CORE.CASE_SCORE_SNAPSHOTS_V2`

Key columns:
- CASE_ID
- MODEL_VERSION
- SCORE
- SUBSCORE_CONTROLS
- SUBSCORE_COVERAGE
- SUBSCORE_FRESHNESS
- SUBSCORE_OPERATIONAL
- TIER
- BAND
- RENEWAL_STATUS
- EVENTS_90D
- SCORED_AT
- CREATED_AT

⚠️ NOTE:
- `SNAPSHOT_AT` does NOT exist
- Prior seed logic was incorrect

---

## 🧩 SNOWFLAKE — VERIFIED LIVE TABLE SHAPES

### VERIFICATION_CASES
Key columns:
- CASE_ID (PK)
- ENTITY_NAME
- STATUS
- APPLICATION_ID
- ORG_ID
- CREATED_AT
- SUBMITTED_AT
- APPROVED_AT
- DECIDED_AT
- PRIORITY
- ASSIGNED_REVIEWER
- DECISION_SUMMARY

---

### VERIFICATION_FINDINGS (CRITICAL CORRECTION)

Correct schema:
- FINDING_ID
- CASE_ID
- CONTROL_ID ✅ (NOT RAW_CONTROL_ID)
- CONTROL_TITLE
- RESULT ✅ (NOT RESULT_RAW)
- RATIONALE
- SEVERITY
- EVIDENCE_IDS (ARRAY)
- CREATED_AT
- UPDATED_AT
- ORG_ID

---

### VERIFICATION_EVIDENCE
- EVIDENCE_ID
- CASE_ID
- EVIDENCE_TYPE
- TITLE
- DESCRIPTION
- SOURCE_URL
- STORAGE_REF
- SUBMITTED_BY
- SUBMITTED_AT
- CREATED_AT
- UPDATED_AT
- ORG_ID

---

### DECISIONS
- DECISION_ID
- APPLICATION_ID
- SNAPSHOT_ID
- DECISION_STATUS
- CERTIFICATION_TIER
- CERTIFICATION_BAND
- VALID_FROM
- VALID_TO
- DECISION_NOTES
- CREATED_AT
- CASE_ID

---

## 🧩 DEMO SEED FILES (ACTIVE)

- `GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql`
  → Primary seed file (currently broken at scoring)

- `GAFAIG - MULTI-CASE DEMO SCORE + PUBLISH + VALIDATION.sql`
  → Diagnostic + validation execution file

- `GAFAIG - CANONICAL_RUN_ORDER.sql`
  → Required execution order reference

---

## 🧩 NEXT.JS TRUST SURFACE FILES

### Registry
- `app/registry/page.tsx`
- `app/registry/[registryId]/page.tsx`
- `app/registry/ai-systems/page.tsx`

---

### Explorer
- `app/explorer/page.tsx`
- `app/explorer/organizations/page.tsx`
- `app/explorer/systems/page.tsx`
- `app/explorer/countries/page.tsx`

---

### Verify
- `app/verify/page.tsx`
- `app/verify/[registryId]/page.tsx`

---

### Widget
- `app/widget-preview/[registryId]/page.tsx`
- `public/widget/gafaig-widget.js` ⚠️ DO NOT BREAK

---

## 🧩 API LAYER

### Verification
- `app/api/verify/[registryId]/route.ts`
  → Generates signed proof payload

- `app/api/.well-known/gafaig-public-key/route.ts`
  → Public key endpoint

---

### Registry / Explorer
- `app/api/registry/route.ts`
- `app/api/registry/search/route.ts`
- `app/api/badge/[registryId]/route.ts`

---

## 🧩 QUERY LAYER

- `lib/queries/registry.ts`
- `lib/queries/explorer.ts`
- `lib/queries/registry-ai-systems.ts`

Rule:
These must NEVER compute truth.
They only pass Snowflake results through.

---

## 🧩 CRYPTO / SIGNING

- `lib/crypto/verify-signing.ts`

Handles:
- Ed25519 signing
- Signature verification
- Key ID management

---

## 🧩 TYPE CONTRACTS

- `types/registry.ts`

Includes:
- registry responses
- verify response
- proof object

---

## ⚠️ DO NOT BREAK FILES

These are highly sensitive:

- public/widget/gafaig-widget.js
- app/api/verify/[registryId]/route.ts
- app/api/.well-known/gafaig-public-key/route.ts
- lib/crypto/verify-signing.ts
- GAFAIG - CORE.REGISTRY_PUBLISH.sql
- GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql
- 21_VIEWS_PUBLIC_REGISTRY.sql

---

## 🔥 ROOT CAUSE (CURRENT FAILURE)

The system is failing because:

1. Seed data loads ✅  
2. Findings + evidence exist ✅  
3. Decisions exist ✅  
4. Events exist ✅  
5. Scoring runs but produces 0 rows ❌  
6. Publish sees no score → produces nothing ❌  

This is NOT a UI problem.
This is NOT a schema problem anymore.

This is a:
→ **SCORING INPUT CONTRACT FAILURE**

---

## 🎯 NEXT EXECUTION TARGET

Focus ONLY on:

- `SP_SCORE_CASE_ENTERPRISE`
- `V_GOVERNANCE_SCORE_CASE`

We must determine:

- What exact inputs they require
- Why rebuilt cases are not being picked up
- Whether event/state/structure mismatch is blocking scoring

---

## 🧭 NEW CHAT STARTER

Use this EXACT block in next chat:

“This is the continuation chat for building GAFAIG. Load MASTER_STATE.md, CURRENT_FOCUS.md, ENGINEERING_RULES.md, CANONICAL_RUN_ORDER.md, and GAFAIG_ACTIVE_FILE_MAP.md as canonical system context. Do not re-architect anything. Snowflake is the source of truth. We are blocked in SCORING → PUBLISH. The seed loads but does not appear in V_GOVERNANCE_SCORE_CASE, so publish produces nothing. Focus only on diagnosing SP_SCORE_CASE_ENTERPRISE and its required inputs.”

---

## SUMMARY

- Frontend trust surface is working
- Proof/signature system is working
- Data loads into Snowflake correctly
- System fails at scoring layer
- Publish fails because scoring fails
- The only priority now is fixing scoring visibility into V_GOVERNANCE_SCORE_CASE