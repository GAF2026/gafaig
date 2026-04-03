# GAFAIG — MASTER STATE
Canonical System Definition
Last Updated: 2026-04-03

---

# SYSTEM IDENTITY

GAFAIG = Global Authority for AI Governance

GAFAIG is the world’s first:
→ searchable AI governance registry  
→ deterministic verification engine  
→ public trust infrastructure layer for AI governance certification  

This system is NOT:
• a dashboard  
• a reporting tool  
• a scoring UI  

This system IS:
→ trust infrastructure  
→ registry of record  
→ verification authority layer  

---

# CORE ARCHITECTURE

GAFAIG operates as a strict two-layer system:

## 1. PRIVATE VERIFICATION ENGINE (Snowflake-native)

Purpose:
• deterministic scoring
• controlled evaluation workflow
• private evidence + findings storage

Pipeline:
APPLICATION
→ VERIFICATION_CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ SCORE SNAPSHOT
→ DECISION

Rules:
• deterministic
• auditable
• reproducible
• NOT exposed publicly

---

## 2. PUBLIC REGISTRY (Next.js + Vercel)

Purpose:
• publish certification outcomes
• provide public trust visibility
• enable independent verification

Pipeline:
DECISION
→ REGISTRY SNAPSHOT (append-only)
→ V_REGISTRY_LATEST_APPROVED
→ V_REGISTRY_PUBLIC
→ API
→ UI
→ TRUST SURFACES

Rules:
• append-only
• no mutation
• derived from Snowflake only
• no business logic in API/UI

---

# DATA FLOW (CANONICAL)

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ SCORE SNAPSHOT
→ DECISION
→ REGISTRY SNAPSHOT
→ REGISTRY VIEWS
→ API
→ UI
→ TRUST SURFACES

---

# TRUST INFRASTRUCTURE LAYER (NEWLY COMPLETED)

GAFAIG now operates as a full trust infrastructure system.

## Public Trust Surfaces

1. Registry of Record
   → /registry
   → /registry/[registryId]

2. Verification API
   → /api/verify/[registryId]

3. Signed Proof Payload
   → proof.alg
   → proof.kid
   → proof.signature
   → proof.message
   → proof.messageString
   → proof.verificationKeyUrl

4. Public Key Endpoint
   → /api/.well-known/gafaig-public-key

5. Badge Endpoint
   → /badge/[registryId]

6. Embeddable Widget
   → public/widget/gafaig-widget.js

7. Verify Button UX
   → public/widget/gafaig-verify.js

8. QR Verification Path
   → QR → /verify → API → registry

9. Verification Guide
   → /verify

---

# CRITICAL SYSTEM RULES

## Snowflake is the source of truth
• ALL data originates from Snowflake  
• API does NOT compute  
• UI does NOT compute  

## No logic outside Snowflake
• no scoring in API  
• no certification logic in UI  
• no duplication of engine logic  

## Append-only registry
• REGISTRY_SNAPSHOTS immutable  
• latest state derived via views  
• no updates to published records  

## Certification source of truth
• CERTIFIED_SCORE → Snowflake  
• CERTIFIED_TIER → Snowflake  
• CERTIFIED_BAND → Snowflake  
• CERTIFIED_AT → Snowflake  
• DECISION_STATUS → Snowflake  

---

# KEY SNOWFLAKE OBJECTS

## Tables
CORE.VERIFICATION_CASES  
CORE.VERIFICATION_FINDINGS  
CORE.VERIFICATION_EVIDENCE  
CORE.VERIFICATION_EVENTS  
CORE.DECISIONS  
CORE.REGISTRY_SNAPSHOTS  

## Views
CORE.V_REGISTRY_LATEST_APPROVED  
CORE.V_REGISTRY_PUBLIC  
CORE.V_REGISTRY_PUBLIC_SEARCH  
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

## Engine
SP_SCORE_CASE_ENTERPRISE  
V_CASE_SCORE_ENTERPRISE  
V_CASE_TIER_BAND  

## Publish
SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

# APPLICATION LAYER

## Stack
Next.js (App Router)  
TypeScript  
Vercel hosting  

## Query Layer
lib/snowflake.ts  
lib/queries/*  

Rules:
• API = pass-through only  
• UI consumes API only  
• no direct Snowflake logic in UI  

---

# PUBLIC ROUTES

## Core
/  
/mission  
/framework  
/registry  
/registry/[registryId]  
/explorer  
/verify  

## Explorer
/explorer/countries  
/explorer/organizations  
/explorer/systems  
/explorer/map  

## APIs
/api/registry  
/api/verify/[registryId]  
/api/badge/[registryId]  

---

# CURRENT SYSTEM STATE

## Fully Working

✔ verification workflow  
✔ deterministic scoring engine  
✔ score snapshots  
✔ decision system  
✔ registry publish pipeline  
✔ registry snapshots (append-only)  
✔ V_REGISTRY_LATEST_APPROVED  
✔ V_REGISTRY_PUBLIC  
✔ registry UI  
✔ explorer UI  
✔ verification API (CORS enabled)  
✔ signed proof  
✔ public key endpoint  
✔ badge endpoint  
✔ widget (v1 locked)  
✔ verify modal UX  
✔ QR verification flow  

---

# HARDENING (RECENT)

✔ Removed dependency on fragile stats views  
✔ Standardized on V_REGISTRY_PUBLIC  
✔ Derived certification status from CERTIFIED_AT  
✔ Added try/catch to registry + explorer pages  
✔ Implemented graceful fallback UI  
✔ Prevented runtime crashes on Snowflake failure  

---

# CURRENT PHASE

Registry Completion → Trust Infrastructure Activation → Adoption Layer

---

# NEXT PHASE

Adoption + Integration Layer

Focus:
• Developers / Integrations page  
• Public embed documentation  
• Badge refinement  
• Explorer depth  
• AI systems trust surfaces  

---

# ENGINEERING DIRECTIVE

DO NOT:
• re-architect system  
• move logic outside Snowflake  
• expose private evidence  
• mutate registry snapshots  

ALWAYS:
• treat Snowflake as source of truth  
• maintain deterministic outputs  
• preserve append-only registry  
• ensure public trust surfaces remain verifiable  

---

# SYSTEM STATUS SUMMARY

GAFAIG is now:

→ a functioning AI governance registry  
→ a deterministic certification engine  
→ a public verification system  
→ a portable trust infrastructure layer  

This marks transition from:
“system exists”

→

“system can be relied upon externally”