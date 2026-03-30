# GAFAIG — SNOWFLAKE SQL FILE SUMMARY
Complete SQL File Inventory + Purpose Map
Last Updated: 2026-03-29

---

# PURPOSE

This document provides:

• full list of Snowflake SQL files  
• purpose of each file  
• how files relate to the GAFAIG system  
• which files are active vs deprecated  

Goal:
→ eliminate confusion  
→ ensure correct execution order  
→ maintain single canonical system  

---

# EXECUTION ORDER (CRITICAL)

ALL FILES MUST BE RUN IN THIS ORDER:

1. TABLES  
2. VIEWS  
3. SCORING ENGINE  
4. PROCEDURES  
5. SEEDS  

---

# 1. TABLE FILES

---

## CORE PIPELINE TABLES

01_TABLES_CASES.sql  
→ creates CORE.VERIFICATION_CASES  
→ root of entire pipeline  

02_TABLES_FINDINGS.sql  
→ creates CORE.VERIFICATION_FINDINGS  
→ control-level evaluation layer  

03_TABLES_EVIDENCE.sql  
→ creates CORE.VERIFICATION_EVIDENCE  
→ evidence objects  

04_TABLES_FINDING_EVIDENCE.sql  
→ creates CORE.VERIFICATION_FINDING_EVIDENCE  
→ mapping between findings and evidence  

05_TABLES_EVENTS.sql  
→ creates CORE.VERIFICATION_EVENTS  
→ audit/event trail  

---

## SCORING + DECISION TABLES

16_TABLES_SCORE_SNAPSHOTS.sql  
→ creates CORE.CASE_SCORE_SNAPSHOTS_V2  
→ append-only scoring history  

17_TABLES_DECISIONS.sql  
→ creates CORE.DECISIONS  
→ certification decisions  

---

## REGISTRY TABLES

18_TABLES_REGISTRY_SNAPSHOTS.sql  
→ creates CORE.REGISTRY_SNAPSHOTS  
→ append-only registry output  

19_TABLES_REGISTRY_AI_SYSTEMS.sql  
→ creates CORE.REGISTRY_AI_SYSTEMS  
→ AI systems linked to registry  

---

# 2. VIEW FILES (LOGIC LAYER)

ALL BUSINESS LOGIC LIVES HERE

---

## SCORING VIEWS

20_VIEWS_SCORING.sql  

Defines:

• CORE.V_GOVERNANCE_SCORE_CASE  
→ deterministic governance score  

• CORE.V_CASE_TIER_BAND  
→ tier + band classification  

---

## REGISTRY VIEWS

21_VIEWS_PUBLIC_REGISTRY.sql  

Defines:

• CORE.V_REGISTRY_LATEST_APPROVED  
→ latest approved snapshot per case  

• CORE.V_REGISTRY_PUBLIC  
→ canonical public registry contract  

• CORE.V_REGISTRY_PUBLIC_SEARCH  
→ search-optimized view  

---

## AI SYSTEMS VIEW

22_VIEWS_REGISTRY_AI_SYSTEMS.sql  

Defines:

• CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

IMPORTANT:

→ must join to V_REGISTRY_PUBLIC  
→ NOT directly to snapshots  
→ ensures certification propagation  

---

# 3. SCORING ENGINE FILE

30_SCORING_ENGINE_ENTERPRISE.sql  

Defines:

• CONTROL_CATALOG  
• CONTROL_WEIGHTS  
• SEVERITY_WEIGHTS  
• SCORING_MODEL_VERSIONS  

• supporting views:
  - V_FINDING_NORMALIZED  
  - V_CONTROL_SCORE_COMPONENTS  
  - V_CASE_OPERATIONAL_SCORE  

Purpose:

→ deterministic scoring engine  
→ no ML, fully explainable  

---

# 4. PROCEDURE FILES

---

## SCORE PROCEDURE

40_PROC_SCORE_CASE_ENTERPRISE.sql  

Defines:

CORE.SP_SCORE_CASE_ENTERPRISE(caseId)  

Purpose:

→ compute governance score  
→ create score snapshot  
→ populate scoring views  

---

## PUBLISH PROCEDURE

41_PROC_PUBLISH_CASE.sql  

Defines:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(caseId)  

Purpose:

→ validate case approval  
→ pull governance score  
→ insert registry snapshot  
→ generate registry_id  
→ align AI systems  

CRITICAL:

→ ONLY entry point into registry  

---

# 5. SEED FILES

---

## CANONICAL CERTIFIED SEED

GAFAIG - FINAL_CANONICAL_CASE_0001_SEED.sql  

Creates:

• CASE-0001  
• full 12-control findings  
• complete evidence set  
• events  
• scoring  
• decision  
• publish  
• AI systems  

Result:

→ certified flagship record  

---

## MULTI-CASE EXPANSION

GAFAIG - FINAL_CANONICAL_MULTI_CASE_EXPANSION.sql  
GAFAIG - FINAL_CANONICAL_MULTI_CASE_EXPANSION_V2.sql  

Purpose:

→ expand registry with multiple entities  

Targets:

• CASE-0002 (Anthropic)  
• CASE-0003 (Google DeepMind)  
• CASE-0004 (Microsoft)  
• CASE-0005 (NVIDIA)  

Requirement:

→ MUST produce governance score row  
→ MUST follow full control structure  

Current status:

→ initial versions failed due to:
  • insufficient scoring inputs  
  • Snowflake ARRAY_CONSTRUCT limitation  

---

# 6. LEGACY / ARCHIVE FILES

DO NOT USE

---

Examples:

GAFAIG - DEMO_SEED.sql  
GAFAIG - CANONICAL_DEMO_SEED.sql  
GAFAIG - DATA_BACKFILL_DEMO_DECISIONS.sql  
GAFAIG - AUTO_PUBLISH_ARCHIVE.sql  
GAFAIG - CANONICAL_PIPELINE_BOOTSTRAP.sql  

Reason:

→ bypass canonical flow  
→ create duplicate registry entries  
→ inconsistent data states  

---

# SYSTEM RELATIONSHIP MAP

SQL FILES → TABLES / VIEWS / PROCEDURES  

↓

SNOWFLAKE (EXECUTION LAYER)  

↓

QUERY LAYER (lib/queries)  

↓

API ROUTES  

↓

UI  

---

# CRITICAL RULES

DO NOT:

• run files out of order  
• insert directly into registry tables  
• bypass scoring procedure  
• maintain multiple seed systems  

ALWAYS:

• use canonical seed files  
• validate views after execution  
• maintain append-only model  
• ensure scoring precedes publish  

---

# VALIDATION CHECKPOINTS

---

## AFTER SCORING

SELECT * FROM CORE.V_GOVERNANCE_SCORE_CASE;  

SELECT * FROM CORE.V_CASE_TIER_BAND;  

---

## AFTER PUBLISH

SELECT * FROM CORE.V_REGISTRY_PUBLIC;  

---

## AFTER AI SYSTEMS

SELECT * FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC;  

---

# KEY INSIGHT

The SQL layer is not just schema.

It is:

→ the governance engine  
→ the certification logic  
→ the registry authority  

Everything else is a projection layer.

---

# PURPOSE OF THIS FILE

This file ensures:

• complete visibility into SQL layer  
• clear file responsibilities  
• correct execution order  
• no duplication or confusion  

---