# MASTER_STATE.md
# GAFAIG — Global Authority for AI Governance
# Canonical System State
# Last Updated: 2026-04-12

---

## SYSTEM DEFINITION

GAFAIG is the world’s first deterministic, Snowflake-native AI governance registry.

The platform provides:
- A private verification engine (authoritative computation layer)
- A public registry (trust and transparency layer)

All certification outcomes are computed in Snowflake and surfaced publicly without exposing underlying evidence.

---

## CORE PRINCIPLE

Snowflake is the **single source of truth**.

All:
- scoring
- joins
- certification decisions
- registry outputs

must originate from Snowflake.

The API and UI are strictly read-only surfaces.

---

## CANONICAL DATA FLOW (LOCKED)

CASE  
→ FINDINGS  
→ EVIDENCE  
→ FINDING_EVIDENCE  
→ EVENTS  
→ SCORING  
→ DECISION  
→ REGISTRY_SNAPSHOT  
→ PUBLIC VIEWS  
→ API  
→ UI  

This flow is deterministic and append-only where applicable.

No stage may be skipped, re-ordered, or computed outside Snowflake.

---

## SYSTEM ARCHITECTURE

### 1. PRIVATE VERIFICATION ENGINE (Snowflake)

Location:
GAFAIG_DB.CORE

Primary Tables:
- VERIFICATION_CASES
- VERIFICATION_FINDINGS
- VERIFICATION_EVIDENCE
- VERIFICATION_FINDING_EVIDENCE
- VERIFICATION_EVENTS
- CASE_SCORE_SNAPSHOTS
- DECISIONS
- REGISTRY_SNAPSHOTS

Key Characteristics:
- Deterministic
- Append-only (snapshots)
- Case-first model
- No UI/API computation

---

### 2. PUBLIC REGISTRY LAYER

Primary Views:
- V_REGISTRY_LATEST_APPROVED
- V_REGISTRY_PUBLIC
- V_REGISTRY_PUBLIC_SEARCH
- V_REGISTRY_AI_SYSTEMS_PUBLIC

Public Fields:
- CERTIFIED_SCORE
- CERTIFIED_TIER
- CERTIFIED_BAND
- CERTIFIED_AT
- DECISION_STATUS

No evidence is exposed publicly.

---

### 3. API LAYER (Next.js)

Pattern:
Snowflake → Query Layer → API → UI

Endpoints:
- /api/registry
- /api/registry/search
- /api/verify/[registryId]
- /api/badge/[registryId]

Rules:
- No business logic
- No scoring
- No data transformation beyond mapping

---

### 4. UI LAYER (Next.js App Router)

Pages:
- /registry
- /registry/[registryId]
- /registry/ai-systems
- /explorer/*
- /widget-preview/[registryId]

Rules:
- Read-only
- No computation
- No direct table access

---

## DETERMINISTIC SCORING ENGINE

Canonical Source:
V_GOVERNANCE_SCORE_CASE

Outputs:
- FINAL_SCORE
- TIER
- BAND

Rules:
- Must originate in Snowflake
- Must not be recomputed in API/UI
- Must be tied to CASE_ID

---

## REGISTRY SNAPSHOT MODEL

Table:
CORE.REGISTRY_SNAPSHOTS

Characteristics:
- Append-only
- Immutable
- One snapshot per publish event
- REGISTRY_ID reused for same entity

Publishing Procedure:
SP_PUBLISH_CASE_TO_REGISTRY_V3 (canonical)

---

## AI SYSTEMS REGISTRY

Table:
CORE.REGISTRY_AI_SYSTEMS

Public View:
V_REGISTRY_AI_SYSTEMS_PUBLIC

Purpose:
- Link AI systems to certified registry entries
- Provide structured metadata for Explorer and Registry surfaces

---

## CANONICAL SEED STRATEGY (LOCKED)

Single source:
GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql

Purpose:
- Seed demo cases
- Rebuild full workflow
- Populate registry
- Validate system state

This file must:
- Be deterministic
- Be idempotent
- Use INSERT ... SELECT patterns
- Avoid temp tables
- Avoid session drift

---

## CURRENT SYSTEM STATE (2026-04-12)

### WORKING

- Registry pages rendering correctly
- Explorer pages rendering correctly
- AI systems registry rendering correctly
- Public views operational
- API endpoints operational
- Events table populated
- Canonical seed file executes without full failure

---

### ACTIVE ISSUE

Workflow layer incomplete:

- VERIFICATION_FINDINGS = 0
- VERIFICATION_EVIDENCE = 0
- VERIFICATION_FINDING_EVIDENCE = 0

- VERIFICATION_EVENTS = populated

This indicates failure in:
FINDINGS → EVIDENCE → FINDING_EVIDENCE reconstruction

---

## CURRENT FOCUS (LOCKED)

Fix canonical workflow rebuild inside:

GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql

Specifically:
- Deterministic INSERT patterns
- Correct VALUES → alias structure
- Proper CROSS JOIN usage
- No malformed WITH clauses
- No schema changes

---

## ENGINEERING RULES (ENFORCED)

- Do NOT re-architect
- Do NOT change schema
- Do NOT move logic to API/UI
- Do NOT introduce new seed files
- Do NOT introduce temp tables
- Do NOT rewrite working views
- Do NOT modify registry or explorer surfaces during data fixes

---

## SUCCESS CRITERIA

After running canonical seed:

VERIFICATION_FINDINGS = 25  
VERIFICATION_EVIDENCE = 25  
VERIFICATION_FINDING_EVIDENCE = 25  
VERIFICATION_EVENTS = 10  

Registry and Explorer must remain unchanged and functional.

---

## NEXT STEP

Complete deterministic workflow rebuild in canonical seed file and validate counts.

Once complete:
- Lock seed file as canonical
- Proceed to scoring + certification stabilization
- Continue registry enrichment

---

END OF FILE