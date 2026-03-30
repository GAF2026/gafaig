# GAFAIG — SNOWFLAKE WORKSHEET MAPPING
Canonical Snowflake File + Worksheet Map
Last Updated: 2026-03-29

---

# PURPOSE

This document maps:

• Snowflake SQL files (VS Code)
• Snowflake Worksheets (UI)
• Tables, Views, and Procedures they define

Goal:
→ eliminate confusion about where logic lives
→ ensure deterministic execution flow
→ maintain single source of truth

---

# SNOWFLAKE ENVIRONMENT

Account:
GAFAIG1

Database:
GAFAIG_DB

Schema:
CORE

Warehouse:
GAFAIG_WH

---

# EXECUTION ORDER (CRITICAL)

ALL FILES MUST FOLLOW THIS ORDER:

1. TABLES
2. VIEWS
3. SCORING ENGINE
4. PROCEDURES
5. SEED FILES

DO NOT RUN OUT OF ORDER

---

# 1. TABLES (FOUNDATION)

These define the core data model.

---

## TABLE FILES

01_TABLES_CASES.sql
→ CORE.VERIFICATION_CASES

02_TABLES_FINDINGS.sql
→ CORE.VERIFICATION_FINDINGS

03_TABLES_EVIDENCE.sql
→ CORE.VERIFICATION_EVIDENCE

04_TABLES_FINDING_EVIDENCE.sql
→ CORE.VERIFICATION_FINDING_EVIDENCE

05_TABLES_EVENTS.sql
→ CORE.VERIFICATION_EVENTS

---

## SCORING + DECISION TABLES

16_TABLES_SCORE_SNAPSHOTS.sql
→ CORE.CASE_SCORE_SNAPSHOTS_V2

17_TABLES_DECISIONS.sql
→ CORE.DECISIONS

---

## REGISTRY TABLES

18_TABLES_REGISTRY_SNAPSHOTS.sql
→ CORE.REGISTRY_SNAPSHOTS

19_TABLES_REGISTRY_AI_SYSTEMS.sql
→ CORE.REGISTRY_AI_SYSTEMS

---

# 2. VIEWS (CANONICAL LOGIC LAYER)

ALL BUSINESS LOGIC LIVES HERE

---

## SCORING VIEWS

20_VIEWS_SCORING.sql

Defines:

• CORE.V_GOVERNANCE_SCORE_CASE
→ deterministic governance score

• CORE.V_CASE_TIER_BAND
→ tier + band mapping

---

## REGISTRY VIEWS

21_VIEWS_PUBLIC_REGISTRY.sql

Defines:

• CORE.V_REGISTRY_LATEST_APPROVED
→ latest approved snapshot per case

• CORE.V_REGISTRY_PUBLIC
→ public registry contract

• CORE.V_REGISTRY_PUBLIC_SEARCH
→ search projection

---

## AI SYSTEMS VIEW

22_VIEWS_REGISTRY_AI_SYSTEMS.sql

Defines:

• CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

IMPORTANT:
→ must join to V_REGISTRY_PUBLIC (NOT latest view directly)
→ ensures certification fields propagate correctly

---

# 3. SCORING ENGINE

---

## FILE

30_SCORING_ENGINE_ENTERPRISE.sql

Defines:

• CONTROL_CATALOG
• CONTROL_WEIGHTS
• SEVERITY_WEIGHTS
• SCORING_MODEL_VERSIONS

• supporting scoring views:
  - V_FINDING_NORMALIZED
  - V_CONTROL_SCORE_COMPONENTS
  - V_CASE_OPERATIONAL_SCORE

Purpose:

→ deterministic, control-based governance scoring

RULE:
→ NO ML
→ FULLY EXPLAINABLE

---

# 4. PROCEDURES (EXECUTION LAYER)

---

## SCORE PROCEDURE

40_PROC_SCORE_CASE_ENTERPRISE.sql

Defines:

CORE.SP_SCORE_CASE_ENTERPRISE(caseId)

Purpose:

→ compute governance score
→ generate score snapshot
→ populate scoring views

---

## PUBLISH PROCEDURE

41_PROC_PUBLISH_CASE.sql

Defines:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(caseId)

Purpose:

→ validate approved case
→ pull governance score
→ create registry snapshot (append-only)
→ generate registry_id
→ align AI systems

CRITICAL:

→ ONLY way data enters registry
→ DO NOT INSERT INTO REGISTRY_SNAPSHOTS DIRECTLY

---

# 5. SEED FILES (DATA GENERATION)

---

## CANONICAL CERTIFIED CASE

GAFAIG - FINAL_CANONICAL_CASE_0001_SEED.sql

Creates:

• CASE-0001
• full findings (12 controls)
• full evidence set
• events
• scoring
• decision
• publish
• AI systems

Result:

→ certified record
→ Score = 100
→ Tier = Certified
→ Band = A

---

## MULTI-CASE EXPANSION

GAFAIG - FINAL_CANONICAL_MULTI_CASE_EXPANSION.sql
GAFAIG - FINAL_CANONICAL_MULTI_CASE_EXPANSION_V2.sql

Purpose:

→ add additional organizations:
  • CASE-0002 (Anthropic)
  • CASE-0003 (Google DeepMind)
  • CASE-0004 (Microsoft)
  • CASE-0005 (NVIDIA)

Requirement:

→ MUST produce governance score row
→ MUST publish via procedure

Current issue:

→ expansion cases failing scoring
→ requires alignment with full control structure

---

## LEGACY FILES (DEPRECATED)

DO NOT USE:

• DEMO_SEED.sql
• CANONICAL_DEMO_SEED.sql
• DATA_BACKFILL_DEMO_DECISIONS.sql
• ARCHIVE seed files

Reason:

→ cause inconsistent registry state
→ bypass canonical pipeline

---

# WORKSHEET USAGE (SNOWFLAKE UI)

---

## Recommended Worksheets

Create named worksheets:

1. GAFAIG - TABLES
→ run all table files

2. GAFAIG - VIEWS
→ run all view files

3. GAFAIG - SCORING ENGINE
→ run scoring engine file

4. GAFAIG - PROCEDURES
→ run procedure files

5. GAFAIG - SEED (CANONICAL)
→ run CASE-0001 seed

6. GAFAIG - SEED (EXPANSION)
→ run multi-case expansion

---

# VALIDATION QUERIES

---

## SCORE VALIDATION

SELECT * FROM CORE.V_GOVERNANCE_SCORE_CASE;

SELECT * FROM CORE.V_CASE_TIER_BAND;

---

## REGISTRY VALIDATION

SELECT * FROM CORE.V_REGISTRY_PUBLIC;

---

## AI SYSTEMS VALIDATION

SELECT * FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC;

---

## CASE VALIDATION

SELECT * FROM CORE.VERIFICATION_CASES;

---

# CRITICAL RULES

DO NOT:

• skip scoring step
• skip publish step
• insert directly into registry tables
• use multiple seed systems

ALWAYS:

• follow execution order
• use procedures
• validate views after each step
• maintain append-only model

---

# KEY INSIGHT

Snowflake is not just storage.

It is:

→ the execution engine
→ the scoring system
→ the certification authority

Everything else (API + UI) is a projection layer.

---

# PURPOSE OF THIS FILE

This file ensures:

• clear mapping between SQL files and system behavior
• correct execution order
• no confusion across worksheets
• continuity across development sessions

---