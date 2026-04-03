# GAFAIG — SNOWFLAKE SQL FILE SUMMARY
Canonical SQL File Inventory & Responsibilities
Last Updated: 2026-04-03

---

# PURPOSE

This document provides:

• a complete inventory of Snowflake SQL files  
• the purpose of each file  
• what objects each file creates or modifies  
• how files relate to each other  

Use this to:

→ quickly identify where logic lives  
→ avoid duplication or confusion  
→ trace system behavior at the SQL level  

---

# CORE PRINCIPLE

All critical logic must exist in Snowflake.

SQL files define:

→ the engine  
→ the registry  
→ the public data layer  

---

# FILE GROUPING

SQL files are grouped into:

1. Bootstrap / Setup  
2. Verification Pipeline  
3. Scoring Engine  
4. Decision Layer  
5. Registry Layer  
6. Public Views  
7. Diagnostics / Testing  

---

# 1. BOOTSTRAP / SETUP FILES

---

## GAFAIG - Applications Setup & Grants (Archive - Early Bootstrap).sql

### Purpose
• initial system bootstrap  
• create APPLICATIONS table  
• assign permissions  

---

### Objects

CORE.APPLICATIONS  

---

### Notes

• legacy setup file  
• rarely modified  

---

---

# 2. VERIFICATION PIPELINE FILES

---

## GAFAIG - Canonical Case Pipeline Bootstrap (Archive).sql

### Purpose
• create core verification workflow  

---

### Objects

CORE.VERIFICATION_CASES  
CORE.VERIFICATION_FINDINGS  
CORE.VERIFICATION_EVIDENCE  
CORE.VERIFICATION_EVENTS  

---

---

## GAFAIG - Canonical Case Pipeline Write Test (Archive).sql

### Purpose
• test pipeline inserts  
• validate relationships  

---

---

# PIPELINE FLOW

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  

---

---

# 3. SCORING ENGINE FILES

---

## GAFAIG - Canonical Enterprise Engine Bootstrap (Archive).sql

### Purpose
• define deterministic scoring engine  

---

### Objects

SP_SCORE_CASE_ENTERPRISE  
V_CASE_SCORE_ENTERPRISE  
V_CASE_TIER_BAND  
V_CONTROL_SCORE_COMPONENTS  

---

---

## GAFAIG - Canonical Demo Dataset.sql

### Purpose
• seed demo data  
• support testing  

---

---

## GAFAIG - Canonical Demo Seed.sql

### Purpose
• populate initial dataset  
• simulate real workflow  

---

---

# ENGINE OUTPUT

FINAL_SCORE  
CERTIFIED_TIER  
CERTIFIED_BAND  

---

---

# 4. DECISION LAYER FILES

---

## Decision Logic (within engine / workflow files)

### Purpose
• persist certification outcome  

---

### Table

CORE.DECISIONS  

---

### Fields

DECISION_STATUS  
CERTIFICATION_TIER  
CERTIFICATION_BAND  
VALID_FROM  
VALID_TO  

---

---

# 5. REGISTRY LAYER FILES

---

## GAFAIG - Auto Publish From Case (Archive - Old 2-Arg Procedure).sql

### Purpose
• early publish logic  

---

### Status

• deprecated  

---

---

## Current Publish Procedure

SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

### Purpose

• publish certification to registry  
• generate registry ID  
• insert snapshot  

---

### Table

CORE.REGISTRY_SNAPSHOTS  

---

### Behavior

• append-only  
• immutable  
• historical record preserved  

---

---

# REGISTRY SNAPSHOT STRUCTURE

REGISTRY_ID  
CASE_ID  
APPLICATION_ID  
ENTITY_NAME  
ENTITY_TYPE  
COUNTRY  
CERTIFIED_TIER  
CERTIFIED_BAND  
DECISION_STATUS  
VALID_FROM  
VALID_TO  
CERTIFIED_AT  
CREATED_AT  

---

---

# 6. PUBLIC VIEW FILES

---

## V_REGISTRY_LATEST_APPROVED

### Purpose

• select latest approved snapshot per case  

---

### Logic

ROW_NUMBER() OVER (
  PARTITION BY CASE_ID
  ORDER BY APPROVED_AT DESC
)

---

---

## V_REGISTRY_PUBLIC

### Purpose

• primary public registry view  
• used by API + UI  

---

### Fields

REGISTRY_ID  
APPLICATION_ID  
CASE_ID  
ENTITY_NAME  
ENTITY_TYPE  
COUNTRY  
CERTIFIED_TIER  
CERTIFIED_BAND  
DECISION_STATUS  
VALID_FROM  
VALID_TO  
CERTIFIED_AT  

---

---

## V_REGISTRY_PUBLIC_SEARCH

### Purpose

• optimized search  
• normalized fields  

---

---

## V_REGISTRY_AI_SYSTEMS_PUBLIC

### Purpose

• expose AI systems  
• link systems to registry  

---

---

# 7. DIAGNOSTICS / TEST FILES

---

## GAFAIG - APP_ROLE Smoke.sql

### Purpose

• test permissions  
• validate access  

---

---

## GAFAIG - Admin Unified View Diagnostics.sql

### Purpose

• validate view outputs  
• debug system state  

---

---

# 8. INSERT PATTERN STANDARD

---

## Correct Pattern

SELECT ?, ?, ?, PARSE_JSON(?)

---

## Incorrect Pattern

VALUES (?, ?, ?, PARSE_JSON(?))

---

## Reason

• Snowflake parameter binding compatibility  

---

---

# 9. CRITICAL FIELD LOGIC

---

## Certification Status

Derived from:

CERTIFIED_AT IS NOT NULL  

---

## DO NOT USE

CERTIFICATION_STATUS (non-canonical)

---

---

# 10. REGISTRY ID LOGIC

---

## Format

GAFAIG-<hash>

---

## Rules

• generated during publish  
• immutable  
• reused on republish  

---

---

# EXECUTION DEPENDENCY ORDER

1. APPLICATIONS  
2. VERIFICATION_CASES  
3. FINDINGS  
4. EVIDENCE  
5. EVENTS  
6. SCORING ENGINE  
7. DECISIONS  
8. REGISTRY_SNAPSHOTS  
9. V_REGISTRY_LATEST_APPROVED  
10. V_REGISTRY_PUBLIC  
11. SEARCH + AI SYSTEM VIEWS  

---

---

# SYSTEM FLOW (SQL LEVEL)

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORE  
→ DECISION  
→ REGISTRY SNAPSHOT  
→ LATEST APPROVED VIEW  
→ PUBLIC VIEW  

---

---

# CONNECTION TO APPLICATION

Snowflake SQL  
→ sfQuery()  
→ API  
→ UI  

---

---

# CRITICAL RULES

DO NOT:

• duplicate logic outside Snowflake  
• compute certification in API/UI  
• modify registry snapshots  
• expose private data  

---

ALWAYS:

• use views as source  
• preserve determinism  
• maintain append-only registry  

---

---

# SUMMARY

These SQL files define:

→ the engine  
→ the registry  
→ the public data layer  

They are the foundation of GAFAIG.

Everything else depends on them.