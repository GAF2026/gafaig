# GAFAIG — MASTER STATE
Canonical Architecture & Platform Memory
Last Updated: 2026-03-25

---

# SYSTEM IDENTITY

GAFAIG = Global Authority for AI Governance

GAFAIG is the world’s first **searchable AI governance registry** powered by a **deterministic verification engine**.

It is designed as **global trust infrastructure**, analogous to:

• financial audit systems  
• certificate authorities  
• regulatory registries  
• standards organizations  

---

# CORE PRINCIPLE

GAFAIG is NOT:

• a dashboard  
• a scoring tool  
• a data viewer  

GAFAIG IS:

→ a deterministic governance engine  
→ a certification system  
→ a global public registry  

---

# ARCHITECTURE (LOCKED)

Two-layer system:

1) PRIVATE LAYER (Snowflake)
   → deterministic verification engine

2) PUBLIC LAYER (Next.js / Vercel)
   → registry + explorer + verification surface

---

# CANONICAL DATA FLOW (NON-NEGOTIABLE)

ALL DATA MUST FOLLOW:

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SCORE SNAPSHOT  
→ DECISION  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEWS  
→ API  
→ UI  

---

# SOURCE OF TRUTH

Snowflake is the ONLY source of truth.

Rules:

• No business logic in frontend  
• No derived certification in API  
• No UI overrides  
• No duplicated logic across layers  

---

# ENGINE (DETERMINISTIC)

Primary scoring view:

CORE.V_GOVERNANCE_SCORE_CASE

Outputs:

• FINAL_SCORE  
• TIER  
• BAND  

This is the ONLY valid source for:

• governance score  
• governance tier  
• governance band  

---

# CERTIFICATION MODEL (CRITICAL — UPDATED)

Certification is now **STRICTLY ENGINE-ALIGNED**

RULE:

ENGINE → determines certification outcome  
DECISION → authorizes publication  

---

## FINAL CERTIFICATION LOGIC

| Field | Source |
|------|--------|
| SCORE | ENGINE |
| TIER | ENGINE |
| BAND | ENGINE |
| CERTIFIED_SCORE | ENGINE (if approved) |
| CERTIFIED_TIER | ENGINE (if approved) |
| CERTIFIED_BAND | ENGINE (if approved) |
| DECISION_STATUS | DECISIONS table |

---

## CRITICAL RULE

DECISIONS:

• can APPROVE or REJECT  
• CANNOT override score / tier / band  

---

# PUBLISH PIPELINE

Procedure:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4  
(wrapper: V3)

Responsibilities:

1. Validate case is APPROVED  
2. Pull ENGINE outputs (score/tier/band)  
3. Pull DECISION status  
4. Derive certification (ONLY if approved)  
5. Insert append-only snapshot  
6. Maintain registry identity  
7. Align AI systems  

---

# REGISTRY STORAGE

Table:

CORE.REGISTRY_SNAPSHOTS

Rules:

• append-only  
• no updates  
• immutable historical record  

---

# REGISTRY VIEWS (PUBLIC CONTRACT)

CORE.V_REGISTRY_LATEST_APPROVED  
→ canonical latest snapshot per case

CORE.V_REGISTRY_PUBLIC  
→ main registry surface

CORE.V_REGISTRY_PUBLIC_SEARCH  
→ normalized search layer

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  
→ AI system disclosures

---

# API LAYER (PASS-THROUGH ONLY)

Pattern:

Snowflake → Views → Query Layer → API → UI

Rules:

• No business logic in API  
• No score computation in API  
• No certification logic in API  

---

## Key Routes

/api/registry  
/api/registry/search  
/api/registry/[registryId]  
/api/registry/[registryId]/ai-systems  
/api/verify/[registryId]

Admin:

/api/admin/verification/*  
/api/admin/decisions  
/api/admin/events  

---

# QUERY LAYER

Location:

lib/queries/

Purpose:

• eliminate SQL duplication  
• enforce view usage  
• stabilize API contracts  

---

# FRONTEND (NEXT.JS)

Framework:

Next.js App Router  
TypeScript  
Deployed via Vercel  

---

## Public Routes

/  
/mission  
/framework  
/demo  
/registry  
/registry/[registryId]  
/registry/ai-systems  
/explorer  

---

## UI PRINCIPLES

• UI is a reflection layer ONLY  
• No computed certification in UI  
• No fallback logic in UI  
• All data comes from API → Snowflake  

---

# AUTH SYSTEM

Middleware-protected:

/admin/*  
/api/admin/*  

Session-based auth:

• GAFAIG_SESSION_SECRET  
• GAFAIG_ADMIN_PASSWORD  

---

# IDENTIFIERS

Case:
CASE-0001

Registry:
GAFAIG-XXXXXXXX

Evidence:
EVD-XXXXXXXX

---

# SYSTEM STATUS (CURRENT)

✅ Verification workflow — COMPLETE  
✅ Evidence system — COMPLETE  
✅ Event system — COMPLETE  
✅ Scoring engine — COMPLETE  
✅ Score snapshots — COMPLETE  
✅ Publish procedure — COMPLETE  
✅ Registry snapshots — COMPLETE  
✅ Public registry views — COMPLETE  
✅ API layer — STABLE  
✅ UI pages — STABLE  
✅ Explorer — STABLE  

---

# RECENT CRITICAL FIX (2026-03-25)

✔ Fixed certification inconsistency

Before:

DECISIONS could override engine outputs ❌

After:

ENGINE is authoritative  
DECISIONS only authorize publication ✅

Impact:

• deterministic certification  
• no conflicting outputs  
• global trust alignment  

---

# CURRENT PHASE

Registry Enrichment (Post-Engine Stabilization)

---

# NEXT OBJECTIVES

1. Explorer accuracy
   → ensure metrics reflect registry truth

2. Certification distribution
   → real tier/band distribution

3. Country normalization
   → consistent geo mapping

4. Verification proof standardization
   → /api/verify cryptographic alignment

---

# ENGINEERING RULES (ENFORCED)

DO NOT:

• re-architect system  
• move logic into frontend  
• duplicate SQL across layers  
• override engine outputs  
• mutate snapshots  

ALWAYS:

• use Snowflake views  
• maintain append-only data  
• enforce deterministic outputs  
• keep API thin  
• keep UI passive  

---

# MENTAL MODEL

GAFAIG is:

NOT a product  
NOT a dashboard  

GAFAIG is:

→ a global certification authority  
→ a governance verification system  
→ a public trust registry  

---

# END STATE

When complete, GAFAIG becomes:

The global standard for verifying AI governance.
