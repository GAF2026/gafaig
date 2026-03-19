# GAFAIG — PROJECT INDEX
Repository Architecture Map

Last Updated: 2026-03-19

This document provides a complete navigation index for the GAFAIG repository.

It allows contributors and AI assistants to understand the structure of the platform before proposing changes.

All development must respect:

docs/MASTER_STATE.md  
docs/ENGINEERING_RULES.md  
docs/CURRENT_FOCUS.md  

---

# Platform Overview

GAFAIG is a global AI governance registry powered by a deterministic verification engine.

The platform is composed of five major layers:

Snowflake Governance Engine  
↓  
Snapshot Layer  
↓  
Registry Publication Layer  
↓  
API / Query Layer  
↓  
Next.js UI  

Snowflake is the system of record.

---

# Canonical Architecture (IMPORTANT)

The system is case-first, not application-first.

Execution flow:

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ ENTERPRISE SCORING  
→ SCORE SNAPSHOT  
→ REGISTRY SNAPSHOT  
→ PUBLIC REGISTRY  
→ AI SYSTEMS REGISTRY  

All public data must originate from this pipeline.

---

# Repository Structure

app/  
lib/  
types/  
docs/  
sql/  

---

# Next.js Application Routes

## Public Pages

/  
/mission  
/framework  
/registry  
/registry/[registryId]  
/registry/ai-systems  
/registry/ai-systems/[registryId]  

---

## Registry Surfaces

/registry  
/registry/[registryId]  

Data sources:

CORE.V_REGISTRY_LATEST_APPROVED  
CORE.V_REGISTRY_PUBLIC  
CORE.V_PUBLIC_REGISTRY  
CORE.V_PUBLIC_OVERSIGHT_SIGNAL  

---

## AI Systems Registry (NEW)

/registry/ai-systems  
/registry/ai-systems/[registryId]  

Data source:

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

Purpose:

• expose system-level registry  
• link systems to entities and certification  
• extend registry visibility  

---

## Explorer (Public Analytics)

/explorer  
/explorer/organizations  
/explorer/systems  
/explorer/countries  
/explorer/map  

Data sources:

CORE.V_REGISTRY_LATEST_APPROVED  
CORE.V_PUBLIC_OVERSIGHT_SIGNAL  

---

# Admin Interface

/admin/login  
/admin/applications  
/admin/verification  
/admin/verification/[caseId]  
/admin/verification/[caseId]/score  
/admin/verification/[caseId]/evidence  
/admin/verification/[caseId]/findings  

These routes operate on:

VERIFICATION_CASES  
VERIFICATION_FINDINGS  
VERIFICATION_EVIDENCE  
VERIFICATION_EVENTS  

---

# API Routes

## Registry APIs

/api/registry  
/api/registry/search  

Sources:

CORE.V_REGISTRY_LATEST_APPROVED  
CORE.V_REGISTRY_PUBLIC  
CORE.V_PUBLIC_REGISTRY  

---

## AI Systems (via Query Layer)

No direct API required initially.

Frontend uses:

lib/queries/registry-ai-systems.ts  

---

## Verification Endpoint

/api/verify/[registryId]  

Returns:

• score  
• tier  
• band  
• renewal status  
• timestamp  

Source:

CORE.V_PUBLIC_OVERSIGHT_SIGNAL  

---

## Admin APIs

/api/admin/publish  

Calls:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

# Snowflake Database

GAFAIG_DB  
CORE  

---

# Core Snowflake Tables

Verification Engine:

VERIFICATION_CASES  
VERIFICATION_FINDINGS  
VERIFICATION_EVIDENCE  
VERIFICATION_EVENTS  

Link Tables:

VERIFICATION_FINDING_EVIDENCE  
FINDING_EVIDENCE_MAP  

AI / Evidence:

EVIDENCE_SUMMARIES  

Scoring:

CASE_SCORE_SNAPSHOTS_V2  

Registry:

REGISTRY_SNAPSHOTS  
REGISTRY_AI_SYSTEMS  

---

# Enterprise Scoring Engine (CANONICAL)

Tables:

SCORING_MODEL_VERSIONS  
CONTROL_CATALOG  
CONTROL_WEIGHTS  
SEVERITY_WEIGHTS  
SCORE_BANDS  

Views:

V_CASE_SCORE_ENTERPRISE  
V_CASE_TIER_BAND  
V_CASE_RENEWAL_STATUS  
V_PUBLIC_OVERSIGHT_SIGNAL  

Procedure:

SP_SCORE_CASE_ENTERPRISE  

---

# Registry Layer

Views:

V_REGISTRY_LATEST_APPROVED  
V_REGISTRY_PUBLIC  
V_PUBLIC_REGISTRY  
V_REGISTRY_EXPORT_V1  

Procedure:

SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

# AI Systems Registry Layer

View:

V_REGISTRY_AI_SYSTEMS_PUBLIC  

Derived from:

REGISTRY_AI_SYSTEMS  
VERIFICATION_CASES  
REGISTRY_ENTITIES  
V_REGISTRY_PUBLIC  

Purpose:

• expose certified AI systems  
• enrich with entity + certification  
• align with registry pipeline  

---

# Snowflake View Usage Rules

Application must read from views only.

Primary views:

V_CASE_SCORE_ENTERPRISE  
V_CASE_TIER_BAND  
V_CASE_RENEWAL_STATUS  
V_REGISTRY_LATEST_APPROVED  
V_REGISTRY_PUBLIC  
V_PUBLIC_REGISTRY  
V_PUBLIC_OVERSIGHT_SIGNAL  
V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

# Query Registry Layer (CRITICAL)

Location:

lib/queries/

Purpose:

• centralize SQL  
• eliminate duplication  
• prevent drift  
• stabilize API + UI  

Examples:

lib/queries/registry-ai-systems.ts  

All data access must use this layer.

---

# Core Libraries

lib/snowflake.ts  
lib/queries/  
lib/auth/  
lib/ids.ts  

Responsibilities:

• Snowflake connection  
• query abstraction  
• authentication  
• deterministic IDs  

---

# Contract Types

Location:

types/contracts/  

Defines canonical structures between:

Snowflake → Query Layer → UI  

Examples:

registry.ts  
verification.ts  
aiSystems.ts  

---

# Deterministic Identifiers

CASE_ID  
FINDING_ID  
EVIDENCE_ID  
SNAPSHOT_ID  
REGISTRY_ID  
SYSTEM_ID  

Defined in:

types/ids.ts  

Identifiers must never be mutated in UI.

---

# Environment Variables

Local:

.env.local  

Production:

Vercel environment settings  

Examples:

GAFAIG_SESSION_SECRET  
GAFAIG_ADMIN_PASSWORD  
SNOWFLAKE_ACCOUNT  
SNOWFLAKE_USERNAME  
SNOWFLAKE_ROLE  
SNOWFLAKE_DATABASE  
SNOWFLAKE_SCHEMA  
SNOWFLAKE_WAREHOUSE  
SNOWFLAKE_PRIVATE_KEY  

---

# SQL Directory Structure (UPDATED)

sql/  
  active/  
    canonical pipeline files  
  archive/  
    legacy_pipeline/  
    diagnostics/  
    scratch/  

Rules:

• only run files in active/  
• archive is read-only reference  
• no mixed pipeline generations  

---

# Canonical Documentation

docs/MASTER_STATE.md  
docs/CURRENT_FOCUS.md  
docs/ENGINEERING_RULES.md  
docs/PROJECT_INDEX.md  
docs/CHANGELOG.md  

These define the authoritative platform state.

---

# Critical Development Rule

Before creating any new:

• page  
• API route  
• Snowflake object  
• query  
• helper  

You must:

1. Check this index  
2. Confirm it does not exist  
3. Extend existing architecture  

---

# Key Constraints

• Case-first architecture only  
• Enterprise scoring only  
• Snapshot pipeline required  
• No direct registry inserts  
• AI systems must link to registry  
• Snowflake is the source of truth  
• Public data must be snapshot-derived  
• Query layer required (no inline SQL)  

---

# Final Note

GAFAIG is not a typical application.

It is:

A deterministic governance engine + global registry system.

All development must reinforce:

• scoring integrity  
• registry correctness  
• data lineage  
• architectural consistency  