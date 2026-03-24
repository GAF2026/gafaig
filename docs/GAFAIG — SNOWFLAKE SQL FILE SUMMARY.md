# GAFAIG — SNOWFLAKE SQL FILE SUMMARY
Canonical Worksheet + Object Mapping
Last Updated: 2026-03-24

---

# PURPOSE

This document provides:

• full inventory of Snowflake SQL worksheets  
• mapping of each file → system function  
• execution order understanding  
• prevention of file confusion  

This is the **authoritative map of Snowflake logic**.

---

# SNOWFLAKE ENVIRONMENT

Account: GAFAIG1  
Database: GAFAIG_DB  
Schema: CORE  
Warehouse: GAFAIG_WH  

---

# CORE PRINCIPLE

Each SQL file has a **single responsibility**.

DO NOT:

• duplicate logic across files  
• guess where logic lives  
• modify the wrong worksheet  

---

# WORKSHEET GROUPING

---

## 1. ENGINE FOUNDATION

These define the verification system.

---

GAFAIG - Canonical Demo Dataset.sql  
→ Seeds demo data across system

GAFAIG - Canonical Demo Seed.sql  
→ Inserts initial entities, cases, participants

GAFAIG - Canonical Case Pipeline Bootstrap.sql  
→ Creates base tables:
  • VERIFICATION_CASES  
  • FINDINGS  
  • EVIDENCE  
  • EVENTS  

---

GAFAIG - Canonical Case Pipeline Write Test.sql  
→ Test insertions for pipeline validation

---

## 2. VERIFICATION ENGINE

These power scoring and evaluation.

---

GAFAIG - CORE.V_GOVERNANCE_SCORE_CASE.sql  
→ CRITICAL VIEW  
→ Computes:

• controls score  
• coverage score  
• freshness score  
• summaries score  
• final governance score  

→ Input to registry publish

---

GAFAIG - Demo Evidence Summaries.sql  
→ Creates summarized evidence records

---

## 3. CONFIGURATION

---

SCORING_CONFIG  
→ weight definitions

SEVERITY_WEIGHTS  
→ severity multipliers

---

## 4. APPLICATION / INTAKE LAYER

---

GAFAIG - Applications Setup & Grants.sql  
→ Creates APPLICATIONS table  
→ Grants access

---

CORE.APPLICATIONS

Fields include:

• APPLICATION_ID  
• COUNTRY  
• ENTITY metadata  

---

## 5. PARTICIPANT LAYER

---

CORE.PARTICIPANTS

Fields include:

• PARTICIPANT_ID  
• APPLICATION_ID  
• COUNTRY  
• ENTITY_TYPE  

---

Used for:

→ registry enrichment  
→ joining CASE → APPLICATION  

---

## 6. CASE LAYER

---

CORE.VERIFICATION_CASES

Fields include:

• CASE_ID  
• PARTICIPANT_ID  
• ORG_ID  
• ENTITY_NAME  
• VERIFICATION_TYPE  

---

This is the **bridge layer**:

CASE → PARTICIPANT → APPLICATION

---

## 7. REGISTRY SYSTEM (CRITICAL)

---

### SNAPSHOT TABLE

CORE.REGISTRY_SNAPSHOTS

Properties:

• append-only  
• immutable  
• created by publish procedure  

Stores:

• SCORE  
• TIER  
• BAND  
• timestamps  
• payload  

---

### APPROVAL LOG

CORE.CASE_APPROVAL_LOG

Tracks:

• approve  
• unapprove  
• actor  
• timestamps  

---

## 8. PUBLISH ENGINE

---

GAFAIG - CORE.REGISTRY_PUBLISH.sql

Contains:

SP_PUBLISH_CASE_TO_REGISTRY_V3

Responsibilities:

• read from V_GOVERNANCE_SCORE_CASE  
• generate snapshot  
• assign registry ID  
• insert into REGISTRY_SNAPSHOTS  

CRITICAL:

• deterministic  
• no JSON binding errors  
• uses INSERT … SELECT  

---

## 9. PUBLIC REGISTRY VIEWS (MOST IMPORTANT FILE)

---

21_VIEWS_PUBLIC_REGISTRY.sql

Creates:

---

### V_REGISTRY_LATEST_APPROVED

Purpose:

• selects latest snapshot per CASE_ID  
• prevents duplicates  

Implements:

ROW_NUMBER() OVER (
  PARTITION BY CASE_ID
  ORDER BY CREATED_AT DESC
)

---

### V_REGISTRY_PUBLIC

Purpose:

• canonical public registry surface  
• used by API + UI  

Contains:

• identity fields  
• certification fields  
• enrichment fields  
• timestamps  

---

### V_REGISTRY_EXPORT_V1

Purpose:

• export-ready dataset  
• identical to public view  

---

## 10. ENRICHMENT JOIN PATH (CRITICAL)

---

REGISTRY_SNAPSHOTS  
→ VERIFICATION_CASES  
→ PARTICIPANTS  

---

Provides:

• COUNTRY  
• APPLICATION_ID  
• ENTITY_TYPE  

---

## 11. SEARCH LAYER (PLANNED / PARTIAL)

---

V_REGISTRY_PUBLIC_SEARCH

Purpose:

• normalized search fields  
• substring matching  

Fields:

• registry_id_norm  
• entity_name_norm  
• country_norm  
• search blob  

---

## 12. AI SYSTEMS LAYER

---

CORE.REGISTRY_AI_SYSTEMS

Stores:

• system metadata  
• risk tier  
• oversight level  

---

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Filters:

• IS_PUBLIC = TRUE  

Used by:

/registry/ai-systems

---

# EXECUTION FLOW (SNOWFLAKE)

---

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING (V_GOVERNANCE_SCORE_CASE)  
→ PUBLISH (SP_PUBLISH_CASE_TO_REGISTRY)  
→ SNAPSHOT (REGISTRY_SNAPSHOTS)  
→ VIEW (V_REGISTRY_PUBLIC)  

---

# CRITICAL FILES (DO NOT BREAK)

---

21_VIEWS_PUBLIC_REGISTRY.sql  
→ defines registry contract  

CORE.REGISTRY_PUBLISH.sql  
→ defines publish behavior  

V_GOVERNANCE_SCORE_CASE.sql  
→ defines scoring  

---

# COMMON MISTAKES (AVOID)

---

❌ Editing wrong SQL file  
❌ Duplicating logic across worksheets  
❌ Assuming columns exist  
❌ Writing logic in UI instead of SQL  

---

# DEBUGGING GUIDE

---

If registry is wrong:

1. Check REGISTRY_SNAPSHOTS  
2. Check V_REGISTRY_LATEST_APPROVED  
3. Check V_REGISTRY_PUBLIC  
4. Check query layer  

---

# TEST QUERIES

---

SELECT * FROM CORE.V_REGISTRY_PUBLIC LIMIT 10;

SELECT * FROM CORE.REGISTRY_SNAPSHOTS ORDER BY CREATED_AT DESC;

SELECT * FROM CORE.V_GOVERNANCE_SCORE_CASE WHERE CASE_ID = 'CASE-0001';

---

# CURRENT STATUS

✔ publish working  
✔ snapshot working  
✔ registry view working  
✔ enrichment working  
✔ certification wiring implemented  

---

# NEXT PHASE

• search layer completion  
• explorer analytics  
• AI systems integration  

---

END OF SNOWFLAKE SQL FILE SUMMARY