# GAFAIG — CURRENT FOCUS — 2026-04-10

## ACTIVE PHASE
Public Trust Surface Completion (CRITICAL)

This phase finalizes GAFAIG as a true trust infrastructure by aligning all public-facing surfaces with the canonical model:

PRIVATE = full verification engine (hidden)  
PUBLIC = certification outcome + trust explanation (visible)  

The platform must no longer present raw scores as the primary signal.  
All public surfaces must communicate **verified governance, not computed scoring**.

---

## PRIMARY OBJECTIVE

Transform GAFAIG from a “score display system” into a **trust signaling system**.

This means:

- Scores remain internal (Snowflake only)
- Public surfaces show:
  - Certification status
  - Tier / Band
  - Governance coverage (dimensions)
  - Signed verification proof

---

## CURRENT PRIORITY (LOCKED ORDER)

### 1) FIX SCORE BREAKDOWN FOUNDATION (SNOWFLAKE)

Status: IN PROGRESS

File:
GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql

Objectives:
- Normalize control-level scoring into governance dimensions
- Enforce canonical dimension count (5 ONLY)
- Remove REGEXP_LIKE (use LIKE)
- Fix TRY_CAST issues (strict numeric casting)
- Ensure required output columns:

  REQUIRED OUTPUT:
  - CASE_ID
  - DIMENSION
  - COMPONENT_NAME
  - COMPONENT_SCORE

  DIMENSION OUTPUT:
  - CASE_ID
  - DIMENSION
  - DIMENSION_SCORE
  - CONTROLS_COUNT

Rules:
- No exposure of raw scoring logic
- No exposure of evidence
- Must be derived from V_CONTROL_SCORE_COMPONENTS
- Must remain deterministic

BLOCKERS ADDRESSED:
✔ REGEXP_LIKE incompatibility  
✔ TRY_CAST numeric errors  
✔ Column naming mismatches  
✔ Dimension inconsistency (3 vs 5 vs 12)  

TARGET:
Stable, queryable public-safe explanation layer

---

### 2) BUILD API + QUERY LAYER (SCORE EXPLANATION)

Status: IN PROGRESS

Files:
- lib/queries/score-breakdown.ts
- /api/registry/[registryId]/score-breakdown/route.ts

Objectives:
- Pull from CORE.V_SCORE_DIMENSIONS_PUBLIC
- Resolve REGISTRY_ID → CASE_ID
- Return normalized JSON structure:

{
  registryId,
  dimensions: [
    { name, score, controls }
  ]
}

Rules:
- No computation
- No transformation beyond mapping
- Snowflake remains source of truth

---

### 3) UPDATE REGISTRY PAGE (TRUST ALIGNMENT)

Status: NEXT

File:
app/registry/[registryId]/page.tsx

Objectives:
- REMOVE emphasis on raw score
- ADD governance explanation section
- DISPLAY:

  “Certified and reviewed across 5 governance dimensions”

- Render dimension breakdown UI

DO NOT:
- Show control-level scoring
- Show internal metrics
- Show raw scoring formulas

---

### 4) UPDATE EXPLORER (CRITICAL FIX)

Status: IN PROGRESS

File:
app/explorer/page.tsx

Current Issue:
- Inconsistent dimension counts (3, 5, 12)

Fix:
- Enforce canonical 5 governance dimensions globally

Objectives:
- Replace:
  “Score: 90”

  WITH:

  “Reviewed across 5 governance dimensions”

- Show dimension coverage instead of score emphasis

---

### 5) VERIFY PAGE (CRYPTOGRAPHIC TRUST)

Status: READY

File:
app/verify/page.tsx

Objectives:
- Input: REGISTRY_ID
- Fetch:
  /api/verify/[registryId]

- Perform client-side verification using:
  tweetnacl (Ed25519)

- Validate:
  message + signature + public key

Outcome:
TRUE / FALSE verification status

---

### 6) BADGE + WIDGET (PORTABLE TRUST)

Status: READY

Endpoints:
- /api/badge/[registryId]
- /widget-preview/[registryId]

Objectives:
- Embed trust externally
- Provide verifiable certification signal
- Connect to verification endpoint

---

## CURRENT SYSTEM RISKS

1) DIMENSION DRIFT
- Different parts of system showing different counts
- MUST remain fixed at 5

2) PUBLIC/PRIVATE LEAKAGE
- Risk of exposing internal scoring logic
- MUST enforce strict separation

3) UI MISALIGNMENT
- Score-first messaging contradicts system design
- Must shift to certification-first messaging

---

## DEFINITION OF DONE (THIS PHASE)

✔ Score breakdown views compile and return correct schema  
✔ API returns dimension-level data  
✔ Registry page shows governance explanation  
✔ Explorer shows consistent 5-dimension coverage  
✔ No raw score emphasis on public pages  
✔ Verify page supports cryptographic validation  
✔ Badge + widget functional  
✔ All trust surfaces aligned with system identity  

---

## NEXT PHASE (AFTER COMPLETION)

Phase: External Trust Expansion

- 1-click verification snippet (Node + browser)
- Public developer documentation
- Registry adoption onboarding
- Ecosystem integrations

---

## ENGINEERING RULE REMINDER

- DO NOT re-architect  
- DO NOT move logic out of Snowflake  
- DO NOT expose private data  
- DO NOT compute scores in API/UI  
- ALWAYS enforce deterministic outputs  

---

## FINAL NOTE

We are no longer building features.

We are finalizing **trust infrastructure**.

Every change must reinforce:

GAFAIG = Verified AI Governance  
Not estimated. Not claimed. Verified.