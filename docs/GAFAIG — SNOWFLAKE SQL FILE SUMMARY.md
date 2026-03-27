# GAFAIG — Snowflake SQL File Summary
Canonical System File Mapping
Last Updated: 2026-03-25

---

# PURPOSE

This document maps all Snowflake SQL files into:

• ACTIVE (canonical, in use)  
• SUPPORT (used for diagnostics / validation)  
• SEED / DEMO (data generation)  
• ARCHIVE (DO NOT USE)  

This prevents:

• confusion  
• incorrect file usage  
• accidental system drift  

---

# 🔵 CORE CANONICAL FILES (ACTIVE — DO NOT REPLACE)

## Environment Setup

00_CORE_SETUP.sql  
01_REBUILD_ENVIRONMENT_CANONICAL.sql  

---

## Core Tables

11_TABLES_APPLICATIONS.sql  
12_TABLES_PARTICIPANTS.sql  
14_TABLES_EVIDENCE.sql  
14_TABLES_REGISTRY_AI_SYSTEMS.sql  
16_TABLES_CASE_SCORE_SNAPSHOTS.sql  
17_TABLES_DECISIONS.sql  
18_TABLES_REGISTRY_ENTITIES.sql  

---

## Core Views

21_VIEWS_PUBLIC_REGISTRY.sql  
22_VIEWS_EXPLORER_STATS.sql  
22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

GAFAIG - Public Registry Search.sql  
GAFAIG - Public Registry Summary.sql  
GAFAIG - Registry AI Systems (Public).sql  

---

## Core Engine & Scoring

GAFAIG - Governance Scoring (Enterprise v1.0).sql  
24_SP_SCORE_CASE_ENTERPRISE.sql  

---

## Core Publish System (CRITICAL)

GAFAIG - CORE.REGISTRY_PUBLISH.sql  

Contains:

• SP_PUBLISH_CASE_TO_REGISTRY_V4 (canonical)  
• SP_PUBLISH_CASE_TO_REGISTRY_V3 (wrapper)  

Role:

→ enforces certification logic  
→ inserts registry snapshots  
→ aligns engine + decision  

---

## Registry System

GAFAIG - True Global Registry.sql  
21_VIEWS_PUBLIC_REGISTRY.sql  

---

## Decision & Approval

25_PROCEDURES_APPROVAL.sql  
GAFAIG - Verify Decision + Registry.sql  

---

# 🟡 QUERY / VALIDATION / DIAGNOSTICS

## Diagnostics

GAFAIG - Admin Unified View Diagnostics.sql  
GAFAIG - Public Registry Diagnostics.sql  
98_DIAGNOSTICS_PUBLIC_VIEWS.sql  
98_ENVIRONMENT_DIAGNOSTICS_REGISTRY.sql  
99_ENVIRONMENT_DIAGNOSTICS.sql  

---

## Validation / Pipeline Tracing

GAFAIG - Trace Canonical Case Flow.sql  
GAFAIG - End-to-End Pipeline Smoke Test.sql  
97_SMOKE_TEST_APPLICATION_TO_CASE.sql  
98_SMOKE_TEST_REGISTRY_PUBLIC_SURFACES.sql  
GAFAIG - Verify Registry Publish.sql  
GAFAIG - Verify Case Pipeline.sql  

---

## Access / Security

GAFAIG - Security Grants.sql  
GAFAIG - APP_ROLE Smoke.sql  

---

## Normalization

GAFAIG - NORMALIZATION SUPPORT VIEW REBUILD.sql  

---

# 🟢 DEMO / DATA SEEDING

## Demo Data

GAFAIG - Canonical Demo Dataset.sql  
GAFAIG - Canonical Demo Seed.sql  
30_DEMO_ENTERPRISE_CONTROL_FRAMEWORK.sql  
33_DEMO_PARTICIPANTS_CURATED_SEED.sql  

---

## Multi-Entity / Multi-Case Seeds

GAFAIG - Canonical Multi-Case Pipeline Seed.sql  
GAFAIG - Canonical Multi-Entity Demo Seed.sql  

---

## Decision Seeding

DATA_BACKFILL_DEMO_DECISIONS.sql  
31_DEMO_DECISIONS_SEEDING.sql  

---

# 🟠 SUPPORT FILES (ACTIVE BUT NON-CORE)

## Registry & Explorer Support

GAFAIG - Registry AI Systems.sql  
GAFAIG - Admin Unified View.sql  

---

## Scoring Validation

GAFAIG - Scoring Model v1.sql  
GAFAIG - Scoring Smoke Test.sql  

---

## Pipeline / Verification

GAFAIG - Verification Workflow.sql  
GAFAIG - Verification Case Pipeline.sql  

---

## Misc Utilities

GAFAIG - Control Alias Seed.sql  

---

# 🔴 ARCHIVE FILES (DO NOT USE)

These files represent:

• legacy architecture  
• deprecated pipelines  
• incorrect logic  
• early bootstrap attempts  

---

## Legacy Pipeline / Engine

GAFAIG - Deterministic Governance Scoring Engine v1.0 (Archive).sql  
GAFAIG - Governance Scoring (Archive - Legacy).sql  

---

## Legacy Case Flow

GAFAIG - Canonical Case Pipeline Bootstrap (Archive).sql  
GAFAIG - Canonical Case Pipeline Write Test (Archive).sql  
GAFAIG - Canonical Verification Case Write (Archive).sql  
GAFAIG - Canonical Verification Case Write v2 (Archive).sql  

---

## Legacy Triggers

GAFAIG - Canonical Event Trigger (Archive).sql  
GAFAIG - Canonical Event Trigger v2 (Archive).sql  
GAFAIG - Canonical Submission Trigger (Archive).sql  

---

## Legacy Registry

GAFAIG - CORE.REGISTRY_SNAPSHOTS (Archive - Pre-Canonical).sql  
GAFAIG - Demo Registry Dataset (Archive - Legacy Demo Seed).sql  

---

## Legacy Environment / Debug

GAFAIG - Applications Setup & Grants (Archive - Early Bootstrap).sql  
GAFAIG - Fix Verification Cases Access (Archive - Debug Only).sql  
GAFAIG - GET_DDL Export (Archive - Schema Snapshot).sql  

---

## Legacy Investigation Files

GAFAIG - Identify True Write Table (Archive).sql  
GAFAIG - Identify Verification Case Write Path (Archive).sql  
GAFAIG - Inspect Events Schema (Archive).sql  
GAFAIG - Find Case Creation Mechanism (Archive).sql  

---

## Legacy Migration

GAFAIG - Migration - Snapshot Tier Band Backfill (Archive).sql  

---

## Legacy Demo

GAFAIG - Demo Evidence Summaries (Archive - UI Seed).sql  

---

## Legacy Auto Publish

GAFAIG - Auto Publish From Case (Archive - Old 2-Arg Procedure).sql  

---

## Legacy Grants

GAFAIG - Grants (Archive - Admin Submissions Access).sql  
23_GRANTS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

---

## Legacy Rebuild

01_REBUILD_ENVIRONMENT (Archive - Legacy Rebuild Order).sql  

---

## Legacy Tables

10_TABLES_SUBMISSIONS.sql  
13_TABLES_FINDINGS.sql  
15_TABLES_EVENTS.sql  

---

## Legacy Views

20_VIEWS_VERIFICATION_CASE_DETAIL.sql  

---

## Legacy Sync

40_PARTICIPANTS_AUTOSYNC.sql  

---

# ⚪ UNCLASSIFIED / UNUSED

Untitled.sql  
Untitled 1.sql  

These should be:

→ deleted or ignored  

---

# 🧠 CRITICAL FILES (MOST IMPORTANT)

If only 5 files matter, they are:

1. GAFAIG - CORE.REGISTRY_PUBLISH.sql  
2. CORE.V_GOVERNANCE_SCORE_CASE (from scoring engine)  
3. 21_VIEWS_PUBLIC_REGISTRY.sql  
4. 22_VIEWS_EXPLORER_STATS.sql  
5. 24_SP_SCORE_CASE_ENTERPRISE.sql  

---

# SYSTEM FLOW (FILE LEVEL)

Scoring:

→ GAFAIG - Governance Scoring (Enterprise v1.0).sql  
→ 24_SP_SCORE_CASE_ENTERPRISE.sql  
→ V_GOVERNANCE_SCORE_CASE  

Publishing:

→ GAFAIG - CORE.REGISTRY_PUBLISH.sql  

Registry:

→ 21_VIEWS_PUBLIC_REGISTRY.sql  

Explorer:

→ 22_VIEWS_EXPLORER_STATS.sql  

---

# FINAL RULE

If unsure which file to use:

→ DO NOT GUESS  
→ USE THIS DOCUMENT  

---

# END STATE

A fully mapped Snowflake system with:

• zero ambiguity  
• deterministic certification  
• clean separation of logic  
• stable registry outputs  

---