# GAFAIG — CURRENT FOCUS
Execution Control Document
Last Updated: 2026-03-29

---

# PRIMARY OBJECTIVE

Complete the transition from:

"Engine exists"

→

"Global AI governance registry is fully populated, trusted, and externally consumable"

---

# CURRENT PHASE

Registry Enrichment (Post-Engine Stabilization)

---

# WHAT IS ALREADY COMPLETE (DO NOT TOUCH)

The following systems are WORKING and LOCKED:

• verification workflow (cases / findings / evidence / events)
• deterministic enterprise scoring engine (v1)
• score snapshot system (append-only)
• publish procedure (SP_PUBLISH_CASE_TO_REGISTRY_V3)
• registry snapshot system (append-only)
• V_REGISTRY_LATEST_APPROVED (source of truth)
• V_REGISTRY_PUBLIC (public contract)
• V_REGISTRY_AI_SYSTEMS_PUBLIC (AI systems projection)
• /registry page (list)
• /registry/[registryId] page (detail)
• /registry/ai-systems pages
• query registry layer (Snowflake → API → UI)
• verification endpoint (/api/verify/[registryId])

DO NOT:
• modify working scoring logic
• rewrite registry views
• bypass publish procedure
• introduce UI-level logic

---

# CURRENT GAP

The system is correct but not yet fully expressive.

Gaps:

• Only one canonical certified case (CASE-0001)
• Multi-case demo expansion not yet successfully scoring/publishing
• Explorer surfaces not yet rich (limited entities/countries)
• Registry lacks realistic distribution of certification states
• Demo dataset fragmentation (multiple legacy seed files)
• No enforced single canonical seeding system

---

# ACTIVE WORKSTREAMS

## 1. CANONICAL MULTI-CASE EXPANSION

Goal:
→ Introduce multiple organizations into registry while preserving canonical architecture

Target cases:

• CASE-0001 → Certified (flagship)
• CASE-0002 → Not Certified (Anthropic)
• CASE-0003 → Not Certified (Google DeepMind)
• CASE-0004 → Not Certified (Microsoft)
• CASE-0005 → Not Certified (NVIDIA)

Requirements:

• MUST produce governance score row (V_GOVERNANCE_SCORE_CASE)
• MUST pass through SP_SCORE_CASE_ENTERPRISE
• MUST publish via SP_PUBLISH_CASE_TO_REGISTRY_V3
• MUST NOT insert directly into registry tables

Current blocker:

• expansion cases failing to produce governance score rows
• error: "No governance score row found for case"

Resolution direction:

→ align expansion seed with full control structure used by CASE-0001
→ ensure findings + evidence satisfy scoring view requirements

---

## 2. CANONICAL SEED CONSOLIDATION

Goal:
→ ONE source of truth seeding system

Required state:

• ONE canonical seed for CASE-0001 (certified)
• ONE canonical expansion seed (multi-case)
• ALL legacy seed files deprecated

Actions:

• remove or archive:
  - DEMO seeds
  - BACKFILL scripts
  - legacy expansion attempts

• enforce deterministic rebuild from:
  CASE → FINDINGS → EVIDENCE → EVENTS → SCORE → PUBLISH

---

## 3. REGISTRY DATA COMPLETION

Goal:
→ Ensure all public contract fields populate consistently

Fields to validate:

• certifiedScore
• certifiedTier
• certifiedBand
• certifiedAt
• decisionStatus
• certificationStatus
• validFrom / validTo
• lifecycleStatus
• renewalStatus
• country normalization

Source:

→ CORE.V_REGISTRY_PUBLIC (ONLY)

---

## 4. EXPLORER ENRICHMENT

Goal:
→ Transform explorer into meaningful global surface

Current state:

• limited to single entity
• minimal distribution

Target state:

• multiple organizations
• multiple countries (US + UK minimum)
• multiple AI systems
• meaningful distribution of:
  - tier
  - risk
  - oversight

Sources:

• V_REGISTRY_PUBLIC
• V_REGISTRY_AI_SYSTEMS_PUBLIC

---

## 5. VERIFICATION UX (TRUST SURFACE)

Goal:
→ Make verification endpoint production-grade

Endpoint:

/api/verify/[registryId]

Enhancements:

• signed payload clarity
• certification metadata visibility
• lifecycle state visibility
• trust messaging ("Certified by GAFAIG")

Constraint:

• NO logic outside Snowflake
• API is presentation only

---

## 6. DEMO NARRATIVE (EXTERNAL READINESS)

Goal:
→ Turn GAFAIG into a compelling, explainable system

Narrative must communicate:

• how certification works
• why deterministic scoring matters
• why registry is trustworthy
• difference between certified vs non-certified entities

Surfaces:

• /demo
• /demo-script

---

# CRITICAL RULE

DO NOT:

• re-architect system
• change scoring engine assumptions
• introduce frontend-derived data
• bypass canonical pipeline
• create parallel data paths

---

# SUCCESS CRITERIA

The phase is complete when:

• multiple cases successfully score and publish
• registry shows mixed certification states
• explorer shows multiple entities and countries
• all registry fields populate consistently
• only canonical seed files exist
• verification endpoint reflects real certification state

---

# EXECUTION PRIORITY

1. Fix multi-case scoring (BLOCKER)
2. Re-run publish for expansion cases
3. Attach AI systems post-publish
4. Validate registry + explorer surfaces
5. Consolidate seed system
6. Polish verification UX
7. Finalize demo narrative

---

# KEY INSIGHT

The system is not broken.

The issue is:

→ expansion data does not satisfy scoring engine requirements

Solution is NOT to bypass logic.

Solution is to:

→ align data with deterministic scoring expectations

---

# FINAL STATE TARGET

GAFAIG operates as:

→ a deterministic certification engine
→ producing verifiable registry outputs
→ across multiple real-world entities
→ with a clean, single-source data pipeline

---