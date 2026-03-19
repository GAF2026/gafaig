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

This phase exposes the **enterprise governance scoring engine** through the public registry and AI systems registry.

The platform has transitioned from:

internal verification infrastructure

to:

deterministic governance engine → global registry system → AI systems surface

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

• This is a **case-first architecture**  
• Applications/submissions are NOT the core engine  
• Registry data must originate from scoring + snapshot pipeline  

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
Query Layer (Next.js)  
↓  
Frontend UI  

Snowflake is the system of record.

---

# Primary Objectives (UPDATED)

1. Validate Enterprise Scoring Pipeline  
2. Connect Scoring → Registry Publishing  
3. Stabilize Public Registry Views  
4. Stabilize AI Systems Registry  
5. Complete Verification API  
6. Enforce Full Snapshot Data Alignment  

---

# Objective 1 — Validate Enterprise Scoring Pipeline

Core procedure:

CORE.SP_SCORE_CASE_ENTERPRISE

Core views:

CORE.V_CASE_SCORE_ENTERPRISE  
CORE.V_CASE_TIER_BAND  
CORE.V_CASE_RENEWAL_STATUS  

Goal:

Ensure canonical case (CASE-ENT-0001):

• produces deterministic score  
• produces tier + band  
• produces renewal status  
• writes snapshot to CASE_SCORE_SNAPSHOTS_V2  

This is the foundation of the entire platform.

---

# Objective 2 — Connect Scoring → Registry Publishing

Procedure:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Pipeline:

Verification Case  
↓  
Enterprise Score  
↓  
Score Snapshot  
↓  
Registry Snapshot  
↓  
Latest Approved Record  
↓  
Public Registry  

Key objects:

CORE.CASE_SCORE_SNAPSHOTS_V2  
CORE.REGISTRY_SNAPSHOTS  
CORE.V_REGISTRY_LATEST_APPROVED  
CORE.V_PUBLIC_OVERSIGHT_SIGNAL  

Goal:

All registry records MUST originate from:

Enterprise scoring → snapshot → publish

---

# Objective 3 — Public Registry Surfaces

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

---

# Objective 4 — AI Systems Registry (NEW PRIORITY)

Routes:

/registry/ai-systems  
/registry/ai-systems/[registryId]

Data source:

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

Goal:

• expose system-level registry surface  
• link systems → entities → certification  
• ensure system data aligns with registry pipeline  

---

# Objective 5 — Verification API

Endpoint:

/api/verify/[registryId]

Example:

/api/verify/GAFAIG-00000001

Response:

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

---

# Objective 6 — Data Alignment (CRITICAL)

All data MUST follow:

CASE  
→ SCORING  
→ SNAPSHOT  
→ REGISTRY  
→ AI SYSTEMS VIEW  

NOT:

manual inserts into registry or system tables

---

# Known Issue (RESOLVED DIRECTION)

Previous demo data:

Inserted directly into:

CORE.REGISTRY_AI_SYSTEMS

This caused:

• mismatched registry data  
• orphan systems  
• inconsistent UI  

Correct model:

All systems must link to:

CASE_ID → REGISTRY → PUBLIC VIEW  

---

# Current Priority Areas

Snowflake:

• enterprise scoring views  
• snapshot table (CASE_SCORE_SNAPSHOTS_V2)  
• registry publish procedure  
• AI systems public view  

API:

• /api/registry  
• /api/verify  
• /api/admin/publish  

Frontend:

• /registry  
• /registry/[registryId]  
• /registry/ai-systems  
• /registry/ai-systems/[registryId]  

Query Layer:

• lib/queries (MANDATORY)  

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
• system detail page implemented  

Critical discoveries:

• case-first architecture confirmed  
• snapshot pipeline is mandatory  
• ID normalization required  
• dual evidence mapping required  
• legacy scoring deprecated  
• view purity rule required  

---

# Near-Term Execution Plan

1. Validate CASE-ENT-0001 scoring  
2. Publish case to registry  
3. Confirm registry output  
4. Confirm AI systems linkage  
5. Add search + filtering to registry UI  
6. Expand demo dataset through pipeline only  

---

# Important Rules (STRICT)

1. Do not re-architect the system  
2. Always use enterprise scoring engine  
3. All registry data must come from snapshots  
4. Never expose private evidence  
5. Always use query registry (no inline SQL)  
6. Always normalize IDs (TRIM / UPPER)  
7. Views must contain only CREATE VIEW + GRANTS  

Identifiers:

CASE_ID  
FINDING_ID  
EVIDENCE_ID  
SNAPSHOT_ID  
REGISTRY_ID  
SYSTEM_ID  

---

# Development Workflow

1. Update Snowflake objects  
2. Validate via SQL  
3. Validate via query layer  
4. Validate via frontend  
5. Commit  
6. Deploy (Vercel)  

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
Registry + AI systems fully wired

Rules:
Do not re-architect.
Continue from snapshot-based registry architecture only.