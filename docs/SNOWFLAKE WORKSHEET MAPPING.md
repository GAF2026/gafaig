# GAFAIG — SNOWFLAKE WORKSHEET MAPPING
Execution Map of Snowflake Worksheets → System Behavior
Last Updated: 2026-03-24

---

# PURPOSE

This document maps:

• Snowflake worksheet names  
• what each worksheet does  
• how they connect together  
• where to modify logic safely  

This prevents:

• editing the wrong file  
• confusion between similar scripts  
• breaking the registry pipeline  

---

# CORE PRINCIPLE

Each worksheet controls a **specific layer** of GAFAIG.

DO NOT:

• mix responsibilities  
• duplicate logic  
• guess which file to edit  

---

# SYSTEM EXECUTION FLOW

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SNAPSHOT  
→ REGISTRY  
→ PUBLIC VIEW  

---

# WORKSHEET MAP (TOP TO BOTTOM)

---

## 1. DATA SEEDING / DEMO

---

DDL Snapshot - 2026-02-26.sql  
→ snapshot of schema state  
→ reference only (DO NOT MODIFY)

---

GAFAIG - Canonical Demo Dataset.sql  
→ seeds complete demo data across system  

---

GAFAIG - Canonical Demo Seed.sql  
→ inserts base entities:
  • participants  
  • applications  
  • cases  

---

## 2. CORE PIPELINE SETUP

---

GAFAIG - Canonical Case Pipeline Bootstrap.sql  
→ creates core tables:

• VERIFICATION_CASES  
• VERIFICATION_FINDINGS  
• VERIFICATION_EVIDENCE  
• VERIFICATION_EVENTS  

---

GAFAIG - Canonical Case Pipeline Write Test.sql  
→ test inserts into pipeline  
→ validates system flow  

---

## 3. APPLICATION / INTAKE

---

GAFAIG - Applications Setup & Grants.sql  
→ creates APPLICATIONS table  
→ applies permissions  

---

CORE.APPLICATIONS

Contains:

• APPLICATION_ID  
• COUNTRY  
• entity metadata  

---

## 4. PARTICIPANT LAYER

---

CORE.PARTICIPANTS

Contains:

• PARTICIPANT_ID  
• APPLICATION_ID  
• COUNTRY  
• ENTITY_TYPE  

---

Purpose:

→ bridge CASE → APPLICATION  
→ registry enrichment  

---

## 5. CASE LAYER

---

CORE.VERIFICATION_CASES

Contains:

• CASE_ID  
• PARTICIPANT_ID  
• ORG_ID  
• ENTITY_NAME  
• VERIFICATION_TYPE  

---

Purpose:

→ connects pipeline to registry  
→ join layer for enrichment  

---

## 6. VERIFICATION ENGINE

---

GAFAIG - CORE.V_GOVERNANCE_SCORE_CASE.sql  

CRITICAL VIEW

Computes:

• controls score  
• coverage score  
• freshness score  
• summaries score  
• final governance score  

---

This is the **source of truth for scoring**

---

## 7. CONFIGURATION

---

SCORING_CONFIG  
→ scoring weights  

SEVERITY_WEIGHTS  
→ severity multipliers  

---

## 8. REGISTRY SYSTEM

---

### SNAPSHOT TABLE

CORE.REGISTRY_SNAPSHOTS

Properties:

• append-only  
• immutable  
• generated via publish procedure  

Stores:

• score  
• tier  
• band  
• timestamps  
• payload  

---

### APPROVAL LOG

CORE.CASE_APPROVAL_LOG

Tracks:

• approval actions  
• actor  
• timestamps  

---

## 9. PUBLISH ENGINE

---

GAFAIG - CORE.REGISTRY_PUBLISH.sql

Contains:

SP_PUBLISH_CASE_TO_REGISTRY_V3

Responsibilities:

• reads from V_GOVERNANCE_SCORE_CASE  
• generates snapshot  
• inserts into REGISTRY_SNAPSHOTS  

---

IMPORTANT:

• deterministic  
• uses INSERT … SELECT  
• no JSON binding issues  

---

## 10. REGISTRY VIEWS (MOST IMPORTANT)

---

21_VIEWS_PUBLIC_REGISTRY.sql

Defines:

---

### V_REGISTRY_LATEST_APPROVED

Purpose:

• latest snapshot per CASE_ID  
• prevents duplicate registry rows  

---

### V_REGISTRY_PUBLIC

Purpose:

• canonical public registry  
• used by API + UI  

Contains:

• identity fields  
• certification fields  
• enrichment fields  
• timestamps  

---

### V_REGISTRY_EXPORT_V1

Purpose:

• export surface  
• identical to public view  

---

## 11. ENRICHMENT PATH (CRITICAL)

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

## 12. SEARCH LAYER (PLANNED)

---

V_REGISTRY_PUBLIC_SEARCH

Purpose:

• normalized search  
• substring matching  

---

## 13. AI SYSTEMS

---

CORE.REGISTRY_AI_SYSTEMS  
→ stores AI system metadata  

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  
→ filters public systems  

---

# FILE RESPONSIBILITY GUIDE

---

## MODIFY THIS WHEN:

---

### You need to change registry fields

→ 21_VIEWS_PUBLIC_REGISTRY.sql  

---

### You need to change scoring

→ CORE.V_GOVERNANCE_SCORE_CASE.sql  

---

### You need to change publish behavior

→ CORE.REGISTRY_PUBLISH.sql  

---

### You need to change data model

→ Bootstrap / setup files  

---

## NEVER MODIFY FOR UI BUGS:

• REGISTRY_SNAPSHOTS  
• publish procedure  
• scoring engine  

---

# DEBUG FLOW

---

If something breaks:

---

## Registry not showing data

1. Check REGISTRY_SNAPSHOTS  
2. Check V_REGISTRY_LATEST_APPROVED  
3. Check V_REGISTRY_PUBLIC  

---

## API errors

Check:

→ query layer  
→ column names  

---

## UI errors

Check:

→ query mapping  
→ null handling  

---

# TEST QUERIES

---

SELECT * FROM CORE.V_REGISTRY_PUBLIC LIMIT 10;

SELECT * FROM CORE.REGISTRY_SNAPSHOTS ORDER BY CREATED_AT DESC;

SELECT * FROM CORE.V_GOVERNANCE_SCORE_CASE WHERE CASE_ID = 'CASE-0001';

---

# CURRENT STATUS

✔ full pipeline working  
✔ publish working  
✔ registry views working  
✔ enrichment wired  
✔ certification logic implemented  

---

# NEXT PHASE

• search layer  
• explorer analytics  
• AI systems linking  

---

END OF SNOWFLAKE WORKSHEET MAPPING