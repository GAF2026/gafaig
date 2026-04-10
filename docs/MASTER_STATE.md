# GAFAIG — MASTER STATE (CANONICAL) — 2026-04-10

## SYSTEM IDENTITY
GAFAIG = Global Authority for AI Governance  
GAFAIG is the world’s first searchable AI governance registry.  
GAFAIG is a deterministic, append-only, Snowflake-native verification and registry system.  
GAFAIG operates as a global trust infrastructure layer, analogous to financial audit systems, certificate authorities, and regulatory registries.  

MISSION:
To create a neutral, verifiable, and globally accessible system for AI governance certification where outcomes—not claims—define trust.

---

## CORE ARCHITECTURE (LOCKED)

### TWO-LAYER MODEL

1) PRIVATE VERIFICATION ENGINE (Snowflake)
- Source of truth
- Performs ALL computation
- Stores applications, cases, findings, evidence, events, scoring, decisions
- Fully controlled environment
- NEVER exposed publicly

2) PUBLIC TRUST RECORD (Views + API + UI)
- Read-only projection layer
- Displays certification outcomes ONLY
- No raw evidence, no internal scoring logic
- Provides signed verification, badge, widget, and API signals

CRITICAL RULE:
Snowflake is the only computation layer. API/UI are transport and rendering only.

---

## CANONICAL DATA FLOW (LOCKED)

APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → SCORE SNAPSHOT → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI

RULES:
- Case-first architecture (NOT application-first)
- Deterministic pipeline
- Append-only snapshots (no updates, only inserts)
- No computation outside Snowflake
- All certification state transitions controlled by procedures

---

## CORE TABLES (SNOWFLAKE — CORE SCHEMA)

### INPUT LAYER
- CORE.APPLICATIONS (APPLICATION_ID, REQUEST_ID)

### CASE LAYER
- CORE.VERIFICATION_CASES (deterministic CASE_ID)

### WORKFLOW LAYER
- CORE.VERIFICATION_EVENTS (append-only lifecycle log)

### ASSESSMENT LAYER
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.FINDING_EVIDENCE_LINKS

### SCORING LAYER
- CORE.CASE_SCORE_SNAPSHOTS
- CORE.V_CONTROL_SCORE_COMPONENTS (control-level scoring)
- CORE.V_GOVERNANCE_SCORE_CASE (canonical scoring view)

### DECISION LAYER
- CORE.VERIFICATION_DECISIONS

### REGISTRY LAYER
- CORE.REGISTRY_SNAPSHOTS (append-only public record)
- CORE.REGISTRY_AI_SYSTEMS

---

## CORE PROCEDURES (CANONICAL)

### 1) APPLICATION → CASE
File: 23_SP_CREATE_CASE_FROM_APPLICATION.sql  
- Input: APPLICATION_ID or REQUEST_ID  
- Resolves latest application  
- Generates deterministic CASE_ID  
- Inserts into VERIFICATION_CASES (idempotent)  
- Inserts lifecycle event into VERIFICATION_EVENTS  
- Returns structured VARIANT response  

---

### 2) SCORING
File: 24_SP_SCORE_CASE_ENTERPRISE.sql  
- Computes FINAL_SCORE  
- Outputs TIER and BAND  
- Writes to CASE_SCORE_SNAPSHOTS  
- Must align exactly with V_GOVERNANCE_SCORE_CASE  

---

### 3) DECISION
File: 25_PROCEDURES_APPROVAL.sql  
- Inserts certification decision  
- Sets DECISION_STATUS (APPROVED / REJECTED)  

---

### 4) REGISTRY PUBLISH
File: CORE.REGISTRY_PUBLISH.sql  
- Validates approved case  
- Generates or reuses REGISTRY_ID (GAFAIG-XXXXXXXX)  
- Inserts append-only snapshot into REGISTRY_SNAPSHOTS  

---

### 5) SCORE EXPLANATION (NEW — PUBLIC SAFE)
File: GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql  
- Builds public-safe trust explanation layer  
- Normalizes internal controls into governance dimensions  
- Creates:
  - CORE.V_SCORE_BREAKDOWN_PUBLIC
  - CORE.V_SCORE_DIMENSIONS_PUBLIC  
- Must NEVER expose internal scoring logic or evidence  

---

## CORE VIEWS

### PRIVATE ENGINE
- CORE.V_GOVERNANCE_SCORE_CASE
- CORE.V_CASE_TIER_BAND
- CORE.V_CASE_RENEWAL_STATUS
- CORE.V_CONTROL_SCORE_COMPONENTS

### PUBLIC REGISTRY
- CORE.V_REGISTRY_LATEST_APPROVED
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_PUBLIC_SEARCH

### AI SYSTEMS
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

### PUBLIC TRUST EXPLANATION (NEW)
- CORE.V_SCORE_BREAKDOWN_PUBLIC
- CORE.V_SCORE_DIMENSIONS_PUBLIC

---

## SCORING MODEL (LOCKED)

Source of Truth:
CORE.V_GOVERNANCE_SCORE_CASE  

Outputs:
- FINAL_SCORE  
- TIER  
- BAND  

RULES:
- Must originate ONLY in Snowflake  
- Must NEVER be recomputed in API/UI  
- Must be deterministic  
- Must match scoring procedure outputs exactly  

---

## PUBLIC TRUST MODEL (UPDATED — CRITICAL)

WE DO NOT EXPOSE:
- Raw scoring internals  
- Control-level logic  
- Evidence or findings  

WE DO EXPOSE:
- Certification status  
- Tier / Band  
- Certification timestamp  
- Signed proof  
- Public-safe governance explanation  

Public messaging MUST be:

“Certified and reviewed across governance dimensions”

NOT:

“Score = X”

---

## QUERY LAYER (NEXT.JS)

Pattern:
Snowflake → lib/queries → API → UI  

Files:
- lib/queries/registry.ts → V_REGISTRY_PUBLIC  
- lib/queries/explorer.ts → Aggregations  
- lib/queries/registry-ai-systems.ts → Systems view  
- lib/queries/score-breakdown.ts → Explanation layer  

RULE:
Query layer is the ONLY place Snowflake is accessed from the app.

---

## API LAYER (THIN TRANSPORT ONLY)

### PUBLIC APIs

- /api/registry  
  → CORE.V_REGISTRY_PUBLIC  

- /api/registry/search  
  → CORE.V_REGISTRY_PUBLIC_SEARCH  

- /api/verify/[registryId]  
  → Returns signed verification payload  

- /api/.well-known/gafaig-public-key  
  → Returns Ed25519 public key  

- /api/registry/[registryId]/score-breakdown  
  → CORE.V_SCORE_DIMENSIONS_PUBLIC  

- /api/badge/[registryId]  
  → Returns badge asset  

RULE:
No computation. No business logic. Read-only.

---

## UI LAYER (NEXT.JS APP ROUTER)

### CORE PAGES

- / (homepage)
- /mission
- /framework
- /verify
- /developers
- /apply

### REGISTRY

- /registry
- /registry/[registryId]
- /registry/ai-systems

### EXPLORER

- /explorer
- /explorer/organizations
- /explorer/countries
- /explorer/systems

### WIDGET

- /widget-preview/[registryId]

---

## TRUST SURFACES

### REGISTRY DETAIL
- Certification outcome
- Tier / Band
- Signed proof
- Badge / widget
- Governance explanation layer

### EXPLORER
- Public registry insights
- Governance coverage summaries
- Organization / country / system views

### VERIFY PAGE
- Registry ID input
- Proof retrieval
- Client-side signature verification (tweetnacl)

### BADGE / WIDGET
- Portable trust signals
- External verification capability

---

## ADMIN / PRIVATE LAYER

Protected by:
- middleware.ts
- lib/auth/require.ts  

Pages:
- /admin/login  
- /admin/applications  
- /admin/verification/[caseId]/findings  

API:
- /api/admin/verification/decisions  

Purpose:
- Control certification workflow
- Execute decisions
- Trigger publish

---

## IDENTIFIER STANDARDS (LOCKED)

- APPLICATION_ID → APP-XXXXXXXX  
- CASE_ID → CASE-XXXXXXXX  
- REGISTRY_ID → GAFAIG-XXXXXXXX  

RULES:
- Uppercase only  
- Trimmed  
- Deterministic  
- Consistent across all layers  

---

## SYSTEM RULES (NON-NEGOTIABLE)

- Snowflake is the source of truth  
- No scoring logic in API/UI  
- Append-only architecture  
- Deterministic IDs  
- Procedures control all state transitions  
- Public layer reads from views only  
- Never expose evidence  
- Never expose internal scoring logic  
- Do not re-architect  

---

## CURRENT SYSTEM STATE (2026-04-10)

### WORKING

✔ Snowflake environment fully operational  
✔ Core tables and procedures stable  
✔ Case → scoring → decision → publish pipeline working  
✔ Registry snapshots publishing correctly  
✔ Public registry views stable  
✔ API layer functional  
✔ Registry UI live  
✔ Explorer UI live  
✔ AI systems registry live  
✔ Signed verification endpoint working  
✔ Public key endpoint working  
✔ Badge + widget system functional  

✔ NEW:
- Public trust explanation layer implemented  
- Score normalization to governance dimensions  
- API endpoint for score breakdown live  

---

### ACTIVE ISSUES (RESOLVED IN THIS PHASE)

✔ REGEXP_LIKE mismatch → fixed using LIKE-based classification  
✔ Dimension inconsistency (3 vs 5 vs 12) → normalized to canonical 5  
✔ Snowflake TRY_CAST errors → resolved with proper casting  
✔ Public messaging misalignment → corrected to trust explanation model  

---

## CURRENT PHASE

PHASE: **Public Trust Surface Completion**

OBJECTIVES:
1. Fully replace score-centric UI with trust explanation  
2. Normalize governance dimension display across platform  
3. Ensure registry + explorer alignment  
4. Maintain strict separation of private vs public data  

---

## NEXT STEPS (LOCKED ORDER)

1. Validate SCORE_BREAKDOWN_PUBLIC views (no SQL errors)  
2. Confirm API returns correct dimension data  
3. Update Registry page:
   - Replace score emphasis  
   - Add governance explanation section  

4. Update Explorer:
   - Display governance coverage  
   - Remove raw score references  

5. Implement client-side signature verification (tweetnacl)  

6. Final trust surface polish:
   - Badge integration  
   - Widget validation  
   - External verification snippet  

---

## DEPLOYMENT

Platform:
- Vercel  

Process:
- git add .
- git commit -m "message"
- git push origin main  

Then:
- Verify deployment in Vercel  
- Test:
  - /registry  
  - /registry/[id]  
  - /verify  
  - /explorer  
  - score-breakdown API  

---

## FINAL SYSTEM SUMMARY

GAFAIG is a deterministic AI governance certification infrastructure.

PRIVATE:
- Full verification engine  
- Evidence, findings, scoring  

PUBLIC:
- Certification outcome  
- Tier / Band  
- Signed proof  
- Public-safe governance explanation  

TRANSITION COMPLETE:
Score display → Trust explanation layer  

This is the final and correct architecture.