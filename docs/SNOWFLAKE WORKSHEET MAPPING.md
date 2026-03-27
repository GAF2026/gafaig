# GAFAIG — Snowflake Worksheet Mapping
Execution Map of Worksheets → System Functions
Last Updated: 2026-03-25

---

# PURPOSE

This document maps Snowflake worksheets to:

• system components  
• execution roles  
• data flow stages  

This prevents:

• running incorrect scripts  
• modifying wrong layers  
• breaking canonical architecture  

---

# 🧠 HOW TO USE THIS DOCUMENT

When working in Snowflake:

1. Identify the task  
2. Locate the correct worksheet below  
3. Execute ONLY within that scope  

---

# 🔵 CORE EXECUTION WORKSHEETS (ACTIVE)

## Environment Setup

00_CORE_SETUP  
→ initializes roles, warehouse, database, schema  

01_REBUILD_ENVIRONMENT_CANONICAL  
→ full canonical rebuild (safe reset order)  

---

## Core Tables

11_TABLES_APPLICATIONS  
→ application intake layer  

12_TABLES_PARTICIPANTS  
→ entity / participant identity  

14_TABLES_EVIDENCE  
→ evidence storage  

14_TABLES_REGISTRY_AI_SYSTEMS  
→ AI systems registry  

16_TABLES_CASE_SCORE_SNAPSHOTS  
→ score snapshot storage  

17_TABLES_DECISIONS  
→ governance decisions  

18_TABLES_REGISTRY_ENTITIES  
→ registry entities  

---

## Core Views

21_VIEWS_PUBLIC_REGISTRY  
→ main registry output  

22_VIEWS_EXPLORER_STATS  
→ explorer analytics  

22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC  
→ AI systems public view  

GAFAIG - Public Registry Search  
→ normalized search  

GAFAIG - Public Registry Summary  
→ aggregated registry metrics  

---

## Core Scoring

GAFAIG - Governance Scoring (Enterprise v1.0)  
→ scoring engine logic  

24_SP_SCORE_CASE_ENTERPRISE  
→ scoring execution procedure  

---

## Core Publish (CRITICAL)

GAFAIG - CORE.REGISTRY_PUBLISH  

→ canonical publish procedure  
→ certification enforcement  
→ registry snapshot creation  

---

## Registry System

GAFAIG - True Global Registry  
→ registry architecture reference  

---

## Approval & Decision

25_PROCEDURES_APPROVAL  
→ approval workflow  

GAFAIG - Verify Decision + Registry  
→ decision + publish validation  

---

# 🟡 VALIDATION & DIAGNOSTICS

## Registry Validation

GAFAIG - Public Registry Diagnostics  
→ inspect registry outputs  

98_SMOKE_TEST_REGISTRY_PUBLIC_SURFACES  
→ validate UI-facing data  

98_DIAGNOSTICS_PUBLIC_VIEWS  
→ validate view integrity  

---

## System Diagnostics

99_ENVIRONMENT_DIAGNOSTICS  
→ overall environment health  

98_ENVIRONMENT_DIAGNOSTICS_REGISTRY  
→ registry-specific diagnostics  

---

## Pipeline Validation

GAFAIG - End-to-End Pipeline Smoke Test  
→ full system test  

GAFAIG - Verify Registry Publish  
→ publish validation  

GAFAIG - Verify Case Pipeline  
→ case flow validation  

GAFAIG - Trace Canonical Case Flow  
→ full pipeline tracing  

97_SMOKE_TEST_APPLICATION_TO_CASE  
→ intake → case conversion  

---

## Admin Diagnostics

GAFAIG - Admin Unified View Diagnostics  
→ admin view validation  

---

# 🟢 DEMO & DATA SEEDING

## Core Demo

GAFAIG - Canonical Demo Dataset  
→ base dataset  

GAFAIG - Canonical Demo Seed  
→ seed execution  

30_DEMO_ENTERPRISE_CONTROL_FRAMEWORK  
→ control framework  

---

## Multi-Entity / Multi-Case

GAFAIG - Canonical Multi-Case Pipeline Seed  
→ multi-case simulation  

GAFAIG - Canonical Multi-Entity Demo Seed  
→ multi-entity simulation  

---

## Decision Seeding

DATA_BACKFILL_DEMO_DECISIONS  
→ decision population  

31_DEMO_DECISIONS_SEEDING  
→ demo decision scenarios  

---

## Participants

33_DEMO_PARTICIPANTS_CURATED_SEED  
→ curated participant data  

---

# 🟠 SUPPORT WORKSHEETS

## Explorer / Registry Support

GAFAIG - Registry AI Systems  
→ AI system data  

GAFAIG - Admin Unified View  
→ admin consolidated view  

---

## Scoring Support

GAFAIG - Scoring Model v1  
→ scoring reference  

GAFAIG - Scoring Smoke Test  
→ scoring validation  

---

## Verification Flow

GAFAIG - Verification Workflow  
→ workflow reference  

GAFAIG - Verification Case Pipeline  
→ case pipeline  

---

## Normalization

GAFAIG - NORMALIZATION SUPPORT VIEW REBUILD  
→ normalization layer rebuild  

---

## Security

GAFAIG - Security Grants  
→ access control  

GAFAIG - APP_ROLE Smoke  
→ role validation  

---

# 🔴 ARCHIVE WORKSHEETS (DO NOT RUN)

These are deprecated and MUST NOT be used.

---

## Legacy Engine

GAFAIG - Deterministic Governance Scoring Engine v1.0 (Archive)  
GAFAIG - Governance Scoring (Archive - Legacy)  

---

## Legacy Pipeline

GAFAIG - Canonical Case Pipeline Bootstrap (Archive)  
GAFAIG - Canonical Case Pipeline Write Test (Archive)  
GAFAIG - Canonical Verification Case Write (Archive)  
GAFAIG - Canonical Verification Case Write v2 (Archive)  

---

## Legacy Triggers

GAFAIG - Canonical Event Trigger (Archive)  
GAFAIG - Canonical Event Trigger v2 (Archive)  
GAFAIG - Canonical Submission Trigger (Archive)  

---

## Legacy Registry

GAFAIG - CORE.REGISTRY_SNAPSHOTS (Archive - Pre-Canonical)  
GAFAIG - Demo Registry Dataset (Archive - Legacy Demo Seed)  

---

## Legacy Environment

GAFAIG - Applications Setup & Grants (Archive)  
GAFAIG - Fix Verification Cases Access (Archive)  
GAFAIG - GET_DDL Export (Archive)  

---

## Legacy Investigation

GAFAIG - Identify True Write Table (Archive)  
GAFAIG - Identify Verification Case Write Path (Archive)  
GAFAIG - Inspect Events Schema (Archive)  
GAFAIG - Find Case Creation Mechanism (Archive)  

---

## Legacy Migration

GAFAIG - Migration - Snapshot Tier Band Backfill (Archive)  

---

## Legacy Demo

GAFAIG - Demo Evidence Summaries (Archive)  

---

## Legacy Auto Publish

GAFAIG - Auto Publish From Case (Archive)  

---

## Legacy Grants

GAFAIG - Grants (Archive)  
23_GRANTS_REGISTRY_AI_SYSTEMS_PUBLIC  

---

## Legacy Rebuild

01_REBUILD_ENVIRONMENT (Archive)  

---

## Legacy Tables

10_TABLES_SUBMISSIONS  
13_TABLES_FINDINGS  
15_TABLES_EVENTS  

---

## Legacy Views

20_VIEWS_VERIFICATION_CASE_DETAIL  

---

## Legacy Sync

40_PARTICIPANTS_AUTOSYNC  

---

# ⚪ UNUSED

Untitled  
Untitled 1  

→ ignore or delete  

---

# 🧠 CRITICAL WORKSHEETS

If only a few matter, use:

1. GAFAIG - CORE.REGISTRY_PUBLISH  
2. GAFAIG - Governance Scoring (Enterprise v1.0)  
3. 24_SP_SCORE_CASE_ENTERPRISE  
4. 21_VIEWS_PUBLIC_REGISTRY  
5. 22_VIEWS_EXPLORER_STATS  

---

# EXECUTION FLOW (WORKSHEET LEVEL)

Scoring:

→ Governance Scoring (Enterprise v1.0)  
→ SP_SCORE_CASE_ENTERPRISE  

Publishing:

→ CORE.REGISTRY_PUBLISH  

Registry:

→ VIEWS_PUBLIC_REGISTRY  

Explorer:

→ VIEWS_EXPLORER_STATS  

---

# FINAL RULE

Always execute within the correct worksheet context.

If unsure:

→ STOP  
→ REFER TO THIS FILE  

---

# END STATE

A fully controlled Snowflake execution environment with:

• zero ambiguity  
• deterministic execution  
• stable registry outputs  

---