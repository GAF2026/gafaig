# GAFAIG — MASTER STATE
Authoritative Project Memory
Last Updated: 2026-03-19

---

# Platform Overview

GAFAIG is the world’s first AI governance registry powered by a deterministic verification engine.

It functions as global trust infrastructure that verifies organizations using:

• governance controls  
• verifiable evidence  
• deterministic scoring  
• auditable decision logic  

GAFAIG operates as neutral global verification infrastructure similar in role to:

• financial audit infrastructure  
• certificate authorities  
• regulatory registries  
• international standards bodies  

The platform provides two major layers:

1. Private verification engine  
2. Public transparency registry  

---

# System Architecture Overview (CANONICAL)

GAFAIG operates as a two-layer architecture:

PRIVATE LAYER  
Deterministic Governance Engine (Snowflake-native)

PUBLIC LAYER  
Global AI Governance Registry

The private layer performs verification and scoring.  
The public layer exposes only the verified governance signal.

---

# Canonical Data Flow (LOCKED)

The authoritative GAFAIG architecture is:

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

IMPORTANT:

This is a case-first architecture.

NOT:

Submission → Application → Case (automatic)

That path exists for intake only and is NOT the core engine.

---

# Private Verification Engine (SOURCE OF TRUTH)

The verification engine is fully implemented in Snowflake.

Core workflow:

Findings → Evidence → Events → Scoring → Decision

Key characteristics:

• deterministic SQL-based scoring engine  
• organization-isolated verification cases  
• auditable and reproducible logic  
• no black-box scoring  
• full traceability from evidence → decision  

Outputs:

• governance score  
• governance tier  
• governance band  
• renewal status  
• scoring breakdown  

Evidence and detailed findings are restricted to:

• authorized reviewers  
• regulators (if granted)  
• verified organization  

---

# Enterprise Governance Scoring Engine (CANONICAL ENGINE)

GAFAIG uses Enterprise Governance Scoring v1.0.

Core principle:

GAFAIG evaluates organizational governance oversight — NOT AI system risk classification.

---

# Scoring Inputs

• Findings  
• Evidence  
• Evidence summaries  
• Events  

---

# Scoring Components

Each control is evaluated using:

1. Quality Score  
2. Coverage Score  
3. Freshness Score  
4. Operational Score  

---

# Scoring Formulas

Control Score =  
0.60 × Quality  
+ 0.25 × Coverage  
+ 0.15 × Freshness  

Case Score =  
0.65 × Controls  
+ 0.15 × Coverage  
+ 0.10 × Freshness  
+ 0.10 × Operational  

---

# Scoring Outputs

• SCORE (0–100)  
• TIER  
• BAND  
• RENEWAL_STATUS  

---

# Core Scoring Objects

Tables:

• SCORING_MODEL_VERSIONS  
• CONTROL_CATALOG  
• CONTROL_WEIGHTS  
• SEVERITY_WEIGHTS  
• SCORE_BANDS  

Views:

• V_CASE_SCORE_ENTERPRISE  
• V_CASE_TIER_BAND  
• V_CASE_RENEWAL_STATUS  
• V_PUBLIC_OVERSIGHT_SIGNAL  

Procedure:

• SP_SCORE_CASE_ENTERPRISE(P_CASE_ID)

---

# Snapshot Architecture

Table:

• CASE_SCORE_SNAPSHOTS_V2  

Snapshots are:

• immutable  
• reproducible  
• deterministic  

---

# Registry Publication Engine

Procedure:

• SP_PUBLISH_CASE_TO_REGISTRY_V3  

Pipeline:

Case  
→ Score Snapshot  
→ Registry Snapshot  
→ Latest Approved View  
→ Public Registry  

Core objects:

• REGISTRY_SNAPSHOTS  
• V_REGISTRY_LATEST_APPROVED  

---

# Public Registry Layer (CANONICAL)

Primary views:

• V_REGISTRY_PUBLIC  
• V_PUBLIC_REGISTRY  
• V_REGISTRY_EXPORT_V1  

Derived from:

• V_REGISTRY_LATEST_APPROVED (SOURCE OF TRUTH)

---

# AI Systems Registry Layer (NEW — CANONICAL)

The platform now includes a full AI systems registry.

Primary view:

• V_REGISTRY_AI_SYSTEMS_PUBLIC  

Architecture:

REGISTRY_AI_SYSTEMS  
→ VERIFICATION_CASES  
→ REGISTRY_ENTITIES  
→ V_REGISTRY_PUBLIC  

This produces:

• system-level registry records  
• linked entity metadata  
• certification data  

---

# Snowflake Architecture

Snowflake is the system of record.

All logic exists in:

• tables  
• views  
• stored procedures  

No governance logic exists in the frontend.

---

# Snowflake Environment

Account: GAFAIG1  
Database: GAFAIG_DB  
Schema: CORE  
Warehouse: GAFAIG_WH  

Roles:

• GAFAIG_APP_ROLE  
• GAFAIG_PUBLISHER  
• GAFAIG_PUBLIC_READER  

---

# Core Snowflake Tables

Verification:

• VERIFICATION_CASES  
• VERIFICATION_FINDINGS  
• VERIFICATION_EVIDENCE  
• VERIFICATION_EVENTS  

Linking:

• VERIFICATION_FINDING_EVIDENCE  
• FINDING_EVIDENCE_MAP  

Scoring:

• CASE_SCORE_SNAPSHOTS_V2  

Registry:

• REGISTRY_SNAPSHOTS  
• REGISTRY_AI_SYSTEMS  

---

# Critical Architecture Rules (STRICT)

1. Case-first architecture  
All logic starts with CASE_ID.

2. Snapshot-based registry  
No live scoring in registry.

3. Query registry required  
No inline SQL in UI or routes.

4. ID normalization required  
Use TRIM / UPPER for joins.

5. View purity rule  
View files contain ONLY:
• CREATE VIEW  
• GRANTS  

NO:
• INSERT  
• UPDATE  
• SELECT tests  

---

# Repository Architecture

GitHub: GAF2026/gafaig  

Stack:

• Next.js (App Router)  
• TypeScript  
• Snowflake  
• Vercel  

---

# Query Registry (CRITICAL)

Location:

lib/queries/

Purpose:

• centralize SQL  
• eliminate duplication  
• prevent AI SQL errors  
• stabilize frontend  

---

# Application Routes (UPDATED)

Public:

/registry  
/registry/ai-systems  
/registry/ai-systems/[registryId]  

---

# Frontend Architecture

Pattern:

Page → Query Layer → Snowflake View  

No direct SQL in pages.

---

# Deployment

Production:

https://www.gafaig.com  

Pipeline:

Local → GitHub → Vercel → Production  

---

# Current Platform Status

GAFAIG now has:

• deterministic enterprise scoring engine  
• verification workflow schema  
• evidence linkage system  
• event-based scoring  
• snapshot system (v2)  
• registry publish pipeline  
• public registry views  
• AI systems registry  
• Next.js registry UI  
• query registry layer  

---

# Current Phase

Surface the Engine → Registry Completion

---

# Immediate Next Steps

1. Add system detail page (completed)  
2. Add search / filtering to registry  
3. Add verification API  
4. Connect intake → case creation  
5. Expand demo dataset  

---

# Project Philosophy

GAFAIG is not a dashboard.

It is:

A global AI governance registry backed by deterministic verification logic.

---

# New Chat Starter Block

Please treat docs/MASTER_STATE.md as the canonical architecture for GAFAIG.

Repository:
GAF2026/gafaig

Platform:
GAFAIG — Global AI Governance Registry

Production:
https://www.gafaig.com

Architecture:
Snowflake-native deterministic governance engine (Enterprise v1.0)

Core Flow:
Case → Findings → Evidence → Events → Scoring → Snapshot → Registry

Snowflake:
GAFAIG_DB / CORE

Current Phase:
Surface the Engine

State:
AI systems registry + public registry fully wired

Rules:
Do not re-architect. Continue from current system.