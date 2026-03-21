# GAFAIG — CURRENT DEVELOPMENT FOCUS

Last Updated: 2026-03-19

This document defines the active development milestone for the GAFAIG platform.

AI assistants and developers must prioritize work described in this document before making unrelated changes.

For full platform architecture see:

docs/MASTER_STATE.md

For repository navigation see:

docs/PROJECT_INDEX.md

For engineering standards see:

docs/ENGINEERING_RULES.md

---

# Current Development Phase

Surface the Engine → Registry Completion

This phase exposes the enterprise governance scoring engine through the public registry, AI systems registry, and core admin workflow surfaces.

The platform has transitioned from:

internal verification infrastructure

to:

deterministic governance engine → global registry system → AI systems surface → reviewer workflow surface

---

# Canonical Execution Model (LOCKED)

All development must follow this architecture:

Case  
↓  
Findings  
↓  
Evidence  
↓  
Events  
↓  
Enterprise Scoring Engine  
↓  
Score Snapshot  
↓  
Registry Snapshot  
↓  
Public Registry  
↓  
AI Systems Registry  

IMPORTANT:

• This is a case-first architecture  
• Applications/submissions are NOT the core engine  
• Registry data must originate from scoring + snapshot pipeline  
• Intake/admin surfaces may exist independently, but they do not replace case-first governance execution  

---

# Platform Layers Involved

Snowflake Governance Engine  
↓  
Score Snapshots (deterministic)  
↓  
Registry Publishing  
↓  
Public Registry Views  
↓  
AI Systems Registry Views  
↓  
Admin Intake Views  
↓  
Query Layer (Next.js)  
↓  
Frontend UI  

Snowflake is the system of record.

---

# Primary Objectives (UPDATED)

1. Stabilize Public Registry Views  
2. Stabilize AI Systems Registry  
3. Stabilize Admin Applications Workflow  
4. Connect Intake → Case Creation  
5. Complete Verification API  
6. Enforce Full Snapshot Data Alignment  

---

# Objective 1 — Public Registry Stabilization

Routes:

/registry  
/registry/[registryId]

API:

/api/registry  
/api/registry/search

Data sources:

CORE.V_REGISTRY_LATEST_APPROVED  
CORE.V_REGISTRY_PUBLIC  
CORE.V_PUBLIC_REGISTRY  

Goal:

• eliminate direct table reads  
• ensure registry reflects snapshot pipeline only  
• keep registry detail route stable against column drift  
• ensure homepage registry metrics reflect public registry outputs correctly  

Status:

Public registry surfaces are operational.

---

# Objective 2 — AI Systems Registry Stabilization

Routes:

/registry/ai-systems  
/registry/ai-systems/[systemId]

Supporting registry record route:

 /registry/[registryId]

Canonical data source:

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

Architecture:

REGISTRY_AI_SYSTEMS  
→ VERIFICATION_CASES  
→ REGISTRY_ENTITIES  
→ V_REGISTRY_PUBLIC  

Frontend:

Next.js + Query Registry pattern

Query layer:

lib/queries/registry-ai-systems.ts  
lib/queries/registry.ts  

Goal:

• expose system-level registry surface  
• link systems → entities → certification  
• ensure system data aligns with registry pipeline  
• prevent UI breakage from speculative column references  
• keep detail route resolved by SYSTEM_ID  
• keep registry record route resolved by REGISTRY_ID  

Status:

AI systems listing and detail routes are operational locally.
Public registry record pages are operational locally.

Critical implementation rule:

Only reference columns that actually exist in CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC.
Do not assume optional governance metadata fields exist unless explicitly verified.

---

# Objective 3 — Admin Applications Workflow Stabilization

Routes:

/admin/applications

API:

/api/admin/applications

Canonical view:

CORE.V_ADMIN_SUBMISSIONS

Purpose:

• provide reviewer-facing intake visibility  
• support filtering by search, status, and page size  
• stabilize admin application list independently from registry layer  

Current compatibility contract for V_ADMIN_SUBMISSIONS:

• REQUEST_ID  
• ORGANIZATION_NAME  
• ORG_NAME  
• EMAIL  
• CONTACT_EMAIL  
• SOURCE  
• SOURCE_TABLE  
• TYPE  
• STATUS  
• CREATED_AT  
• UPDATED_AT  

Goal:

• keep admin applications page functional in local and production  
• ensure API queries map exactly to view columns  
• avoid direct table assumptions inside frontend pages  
• maintain compatibility aliases needed by existing admin UI  

Status:

Admin applications page and API are operational locally after introducing the canonical compatibility view.

Important note:

This admin intake surface is a reviewer workflow surface only.
It is not the governance engine and must not replace case-first execution.

---

# Objective 4 — Connect Intake → Case Creation

Target direction:

Submission / intake record  
↓  
Reviewer validation / triage  
↓  
Verification case creation  
↓  
Case-first governance pipeline  

Goal:

• connect admin applications intake to canonical CASE_ID creation  
• preserve intake as a feeder layer only  
• ensure no registry publication bypasses scoring + snapshots  

This remains the next major backend workflow milestone.

---

# Objective 5 — Verification API

Endpoint:

/api/verify/[registryId]

Example:

/api/verify/GAFAIG-00000001

Response target:

• registry ID  
• organization name  
• score  
• tier  
• band  
• renewal status  
• timestamp  

Data source:

CORE.V_PUBLIC_OVERSIGHT_SIGNAL  

Purpose:

• third-party verification  
• certification badges  
• trust validation  

This endpoint remains an active near-term milestone.

---

# Objective 6 — Data Alignment (CRITICAL)

All data MUST follow:

CASE  
→ SCORING  
→ SNAPSHOT  
→ REGISTRY  
→ AI SYSTEMS VIEW  

NOT:

manual inserts into registry or system tables as a production pattern

Additional rule:

Admin intake may store and display submission rows, but public governance surfaces must still come from the snapshot-based registry pipeline.

---

# Known Issue History (IMPORTANT CONTEXT)

Previous AI systems problems were caused by:

• direct speculative queries against columns not present in V_REGISTRY_AI_SYSTEMS_PUBLIC  
• registry detail and systems detail routes resolving the wrong identifier type  
• duplicated or drifting Snowflake query logic  
• old public registry assumptions bleeding into the AI systems layer  

Previous admin applications problems were caused by:

• production depending on a missing or incompatible submissions view  
• mismatched column expectations such as TYPE, ORG_NAME, CONTACT_EMAIL, SOURCE_TABLE  
• frontend/API expecting aliases not present in the underlying Snowflake source  

Correct model:

• registry routes use canonical public views  
• AI systems routes use canonical AI systems public view  
• admin applications route uses canonical V_ADMIN_SUBMISSIONS compatibility view  
• frontend depends on query layer or API only, never ad hoc SQL in pages  

---

# Current Priority Areas

Snowflake:

• registry publish procedure  
• public registry views  
• AI systems public view  
• admin submissions compatibility view  
• intake-to-case bridge objects  

API:

• /api/registry  
• /api/verify  
• /api/admin/applications  
• future /api/admin/publish  

Frontend:

• /registry  
• /registry/[registryId]  
• /registry/ai-systems  
• /registry/ai-systems/[systemId]  
• /admin/applications  

Query Layer:

• lib/queries (MANDATORY)  
• no speculative SQL fragments  
• no duplicated inline SQL in route/page code  

---

# Work Completed (UPDATED)

Major milestones:

• enterprise governance scoring engine implemented  
• deterministic scoring procedure deployed  
• snapshot architecture (v2) implemented  
• verification workflow stabilized  
• evidence linkage system working  
• event-based scoring implemented  
• registry publishing pipeline operational  
• public registry views implemented  
• query registry abstraction implemented  
• AI systems registry view created  
• AI systems frontend page implemented  
• AI systems detail page implemented  
• registry detail route corrected to resolve by REGISTRY_ID  
• AI systems detail route corrected to resolve by SYSTEM_ID  
• admin applications page stabilized locally  
• canonical V_ADMIN_SUBMISSIONS compatibility view created and validated  
• live homepage governance footprint reviewed against production state  

Critical discoveries:

• case-first architecture confirmed  
• snapshot pipeline is mandatory  
• ID normalization required  
• query registry is mandatory  
• speculative Snowflake columns break the UI quickly  
• compatibility views are necessary where legacy UI contracts still exist  
• local success does not guarantee production success until deployed  

---

# Immediate Execution Plan

1. Commit and deploy the current local fixes to Vercel  
2. Verify production routes:
   • /registry  
   • /registry/[registryId]  
   • /registry/ai-systems  
   • /registry/ai-systems/[systemId]  
   • /admin/applications  
3. Confirm homepage live governance footprint after deployment  
4. Confirm production admin applications page reads V_ADMIN_SUBMISSIONS correctly  
5. Continue with intake → case creation  
6. Continue with verification API  

---

# Important Rules (STRICT)

1. Do not re-architect the system  
2. Always use enterprise scoring engine for governance outputs  
3. All public registry data must come from snapshots  
4. Never expose private evidence  
5. Always use query registry or API layer, never inline SQL in pages  
6. Always normalize IDs using TRIM / UPPER where appropriate  
7. Views must contain only CREATE VIEW + GRANTS  
8. Do not reference unverified Snowflake columns  
9. Intake/admin workflow is not the core engine  
10. Registry and AI systems routes must use the correct identifier type  

Identifiers:

CASE_ID  
FINDING_ID  
EVIDENCE_ID  
SNAPSHOT_ID  
REGISTRY_ID  
SYSTEM_ID  
REQUEST_ID  

---

# Development Workflow

1. Update Snowflake objects  
2. Validate via SQL  
3. Validate via API/query layer  
4. Validate via frontend locally  
5. Commit  
6. Push  
7. Deploy (Vercel)  
8. Re-validate production  

---

# Starting a New Chat

Paste this:

Please treat docs/MASTER_STATE.md as canonical architecture.

Use docs/CURRENT_FOCUS.md as the active milestone.

Use docs/ENGINEERING_RULES.md as guardrails.

Repository:
GAF2026/gafaig

Platform:
GAFAIG — Global AI Governance Registry

Production:
https://www.gafaig.com

Snowflake:
GAFAIG_DB / CORE

Current Phase:
Surface the Engine → Registry Completion

State:
Registry + AI systems + admin applications operational locally

Rules:
Do not re-architect.
Continue from snapshot-based registry architecture only.