# GAFAIG — ENGINEERING RULES (CANONICAL) — 2026-04-10

## PURPOSE
This document defines the non-negotiable engineering rules governing the GAFAIG platform.

These rules ensure:
- Determinism
- Integrity
- Trust
- System stability

Violation of these rules breaks the system.

---

## CORE PRINCIPLE

SNOWFLAKE IS THE SOURCE OF TRUTH

- All computation happens in Snowflake
- All certification logic lives in Snowflake
- All scoring originates in Snowflake

IF IT IS NOT IN SNOWFLAKE → IT DOES NOT EXIST

---

## ARCHITECTURE RULES

### RULE 1 — TWO-LAYER SYSTEM (LOCKED)

PRIVATE LAYER (Snowflake)
- Full verification engine
- Findings, evidence, scoring, decisions

PUBLIC LAYER (API + UI)
- Read-only projection
- Certification outcomes only

NEVER mix these layers.

---

### RULE 2 — NO COMPUTATION OUTSIDE SNOWFLAKE

PROHIBITED:
- Scoring in API
- Scoring in UI
- Recomputing metrics in JavaScript
- Transforming certification logic in queries

ALLOWED:
- Mapping
- Formatting
- Rendering

---

### RULE 3 — APPEND-ONLY DATA MODEL

- No UPDATE statements for certification data
- No DELETE statements
- Only INSERT new records

All history must be preserved.

---

### RULE 4 — PROCEDURES CONTROL STATE

ALL state transitions MUST occur through stored procedures.

Examples:
- Create case → SP_CREATE_CASE_FROM_APPLICATION
- Score case → SP_SCORE_CASE_ENTERPRISE
- Approve case → approval procedure
- Publish → SP_PUBLISH_CASE_TO_REGISTRY

NEVER:
- Insert directly into decision tables from API
- Bypass procedures

---

### RULE 5 — VIEWS DEFINE PUBLIC TRUTH

Public data MUST come from views, NOT tables.

Examples:
- V_REGISTRY_PUBLIC
- V_REGISTRY_PUBLIC_SEARCH
- V_SCORE_DIMENSIONS_PUBLIC

NEVER:
- Query tables directly from API/UI

---

### RULE 6 — DETERMINISTIC IDENTIFIERS

All IDs MUST be:
- Uppercase
- Trimmed
- Deterministic

Formats:
- APPLICATION_ID → APP-XXXXXXXX
- CASE_ID → CASE-XXXXXXXX
- REGISTRY_ID → GAFAIG-XXXXXXXX

Always normalize:
UPPER(TRIM(value))

---

### RULE 7 — API LAYER IS THIN

API routes MUST:
- Fetch data from query layer
- Return structured JSON

API MUST NOT:
- Compute scores
- Apply business logic
- Modify data (except controlled admin routes)

---

### RULE 8 — QUERY LAYER IS THE ONLY DATA ACCESS POINT

All Snowflake access must go through:

lib/queries/*

NEVER:
- Query Snowflake directly inside API routes
- Query Snowflake inside UI components

---

### RULE 9 — UI IS PRESENTATION ONLY

UI must:
- Render data
- Display trust signals

UI must NOT:
- Compute scores
- Derive certification logic
- Transform governance models

---

### RULE 10 — PUBLIC VS PRIVATE DATA SEPARATION

NEVER expose:
- Findings
- Evidence
- Internal scoring components
- Control-level logic

ONLY expose:
- Certification status
- Tier / Band
- Certification timestamp
- Public-safe governance explanation

---

## SCORING RULES

### RULE 11 — SINGLE SOURCE OF SCORING

ONLY valid scoring source:

CORE.V_GOVERNANCE_SCORE_CASE

Outputs:
- FINAL_SCORE
- TIER
- BAND

NEVER:
- Recompute score elsewhere
- Override score in UI/API

---

### RULE 12 — SCORE SNAPSHOT REQUIRED

Scores must be persisted in:

CORE.CASE_SCORE_SNAPSHOTS

NEVER rely on transient computation.

---

### RULE 13 — DIMENSION NORMALIZATION (LOCKED)

All governance scoring MUST map to EXACTLY 5 dimensions:

1) Transparency  
2) Accountability  
3) Safety & Risk Management  
4) Human Oversight  
5) Data Governance  

NEVER:
- Show 3 dimensions
- Show 12 dimensions
- Change dimension definitions

---

### RULE 14 — PUBLIC TRUST MODEL

PUBLIC SURFACES MUST SHOW:

✔ Certification status  
✔ Tier / Band  
✔ Governance coverage (dimensions)  
✔ Signed proof  

PUBLIC SURFACES MUST NOT SHOW:

✘ Raw scoring internals  
✘ Control-level breakdown  
✘ Evidence  

---

## SNOWFLAKE ENGINEERING RULES

### RULE 15 — USE INSERT ... SELECT

For VARIANT / JSON:

ALWAYS:
INSERT INTO table
SELECT PARSE_JSON(...)

NEVER:
INSERT ... VALUES (PARSE_JSON(...))

---

### RULE 16 — USE :VARIABLE BINDING

Inside procedures:

CORRECT:
SELECT * FROM table WHERE id = :var

INCORRECT:
SELECT * FROM table WHERE id = var

---

### RULE 17 — CASTING RULES

- Avoid TRY_CAST misuse
- Use explicit numeric casting where required
- Ensure type compatibility

---

### RULE 18 — STRING MATCHING

DO NOT USE:
REGEXP_LIKE

USE:
LIKE

Reason:
- Simpler
- More stable in Snowflake procedures

---

### RULE 19 — VIEW STABILITY

Once a view is working:

DO NOT:
- Rewrite it unnecessarily
- Change column names without reason

Fix upstream logic instead.

---

## DEPLOYMENT RULES

### RULE 20 — NO PARTIAL DEPLOYS

Always deploy:
- Complete file updates
- Matching API + query + UI changes

---

### RULE 21 — VERIFY AFTER DEPLOY

Test:

- /registry  
- /registry/[id]  
- /explorer  
- /verify  
- API endpoints  

---

## SECURITY RULES

### RULE 22 — ADMIN ACCESS CONTROL

- Protect admin routes via middleware
- Require authenticated session
- Never expose admin endpoints publicly

---

### RULE 23 — ENVIRONMENT VARIABLES

- Store secrets in .env.local
- NEVER commit .env.local
- Use Vercel environment variables in production

---

## CRYPTOGRAPHIC TRUST RULES

### RULE 24 — SIGNED VERIFICATION

- All verification payloads must be signed
- Use Ed25519
- Public key exposed via:
  /api/.well-known/gafaig-public-key

---

### RULE 25 — CLIENT VERIFICATION

- Verification must be possible externally
- Use tweetnacl for signature validation

---

## FINAL SYSTEM RULE

DO NOT RE-ARCHITECT

- The system design is correct
- Fix implementation issues only
- Do not introduce new patterns
- Do not move logic out of Snowflake

---

## FINAL NOTE

GAFAIG is not a typical application.

It is a **trust infrastructure system**.

Every engineering decision must reinforce:

- Determinism  
- Verifiability  
- Transparency (public-safe)  
- Separation of concerns  

If a change weakens trust → it is incorrect.