# GAFAIG — SNOWFLAKE WORKSHEET MAPPING
Snowflake File & Execution Mapping
Last Updated: 2026-04-03

---

# PURPOSE

This document maps:

• Snowflake SQL files  
• worksheet responsibilities  
• object creation order  
• execution relationships  

Use this to:

→ locate SQL definitions quickly  
→ understand dependencies  
→ debug Snowflake layer safely  

---

# CORE PRINCIPLE

Snowflake is:

→ the single source of truth  

Everything must originate from:

• tables  
• views  
• stored procedures  

No logic is allowed outside Snowflake.

---

# ENVIRONMENT

Database:
GAFAIG_DB  

Schema:
CORE  

Warehouse:
GAFAIG_WH  

Role:
GAFAIG_APP_ROLE  

User:
GAFAIG1  

---

# WORKSHEET STRUCTURE

Snowflake worksheets are organized into:

1. Core Schema Setup  
2. Verification Pipeline  
3. Scoring Engine  
4. Registry Layer  
5. Public Views  
6. Diagnostics / Smoke Tests  

---

# 1. CORE SCHEMA SETUP

## Files

GAFAIG - Applications Setup & Grants (Archive - Early Bootstrap).sql  

---

## Purpose

• create APPLICATIONS table  
• initial permissions  

---

## Notes

• early bootstrap file  
• not actively modified  

---

# 2. VERIFICATION PIPELINE

## Files

GAFAIG - Canonical Case Pipeline Bootstrap (Archive).sql  
GAFAIG - Canonical Case Pipeline Write Test (Archive).sql  

---

## Tables Created

CORE.VERIFICATION_CASES  
CORE.VERIFICATION_FINDINGS  
CORE.VERIFICATION_EVIDENCE  
CORE.VERIFICATION_EVENTS  

---

## Purpose

• establish workflow pipeline  
• connect findings ↔ evidence ↔ events  

---

## Flow

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  

---

---

# 3. SCORING ENGINE

## Files

GAFAIG - Canonical Enterprise Engine Bootstrap (Archive).sql  
GAFAIG - Canonical Demo Dataset.sql  
GAFAIG - Canonical Demo Seed.sql  

---

## Objects

SP_SCORE_CASE_ENTERPRISE  
V_CASE_SCORE_ENTERPRISE  
V_CASE_TIER_BAND  
V_CONTROL_SCORE_COMPONENTS  

---

## Purpose

• deterministic scoring  
• tier + band assignment  
• enterprise scoring model  

---

## Rules

• deterministic  
• reproducible  
• no randomness  
• no external dependencies  

---

---

# 4. DECISION LAYER

## Tables

CORE.DECISIONS  

---

## Purpose

• store certification decisions  
• connect scoring → registry  

---

## Key Fields

DECISION_STATUS  
CERTIFICATION_TIER  
CERTIFICATION_BAND  
VALID_FROM  
VALID_TO  

---

---

# 5. REGISTRY LAYER

## Files

GAFAIG - Auto Publish From Case (Archive - Old 2-Arg Procedure).sql  

---

## Current Procedure

SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

## Tables

CORE.REGISTRY_SNAPSHOTS  

---

## Purpose

• append-only registry records  
• publish certification outcomes  

---

## Rules

• NO updates  
• NO deletes  
• append-only  

---

## Behavior

Each publish:

→ creates new snapshot  
→ preserves history  

---

---

# 6. REGISTRY VIEWS

## Core View

CORE.V_REGISTRY_LATEST_APPROVED  

---

### Purpose

• select latest approved snapshot  
• deduplicate registry  

---

### Logic

ROW_NUMBER() OVER (
  PARTITION BY CASE_ID
  ORDER BY APPROVED_AT DESC
)

---

---

## Public View

CORE.V_REGISTRY_PUBLIC  

---

### Purpose

• main public registry view  
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

## Search View

CORE.V_REGISTRY_PUBLIC_SEARCH  

---

### Purpose

• optimized search  
• normalized text fields  

---

---

## AI Systems View

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

### Purpose

• expose AI systems  
• link systems → registry  

---

---

# 7. DIAGNOSTICS / SMOKE TESTS

## Files

GAFAIG - APP_ROLE Smoke.sql  
GAFAIG - Admin Unified View Diagnostics.sql  

---

## Purpose

• validate permissions  
• confirm view outputs  
• debug issues  

---

---

# 8. INSERT / WRITE PATTERNS

## Important Fix

Use:

SELECT ?, ?, ?, PARSE_JSON(?)

NOT:

VALUES (?, ?, ?, PARSE_JSON(?))

---

## Reason

Snowflake parameter binding compatibility  

---

---

# 9. CASE NORMALIZATION

## Rule

caseId must be:

→ uppercase  

---

## Reason

• consistency across tables  
• prevents join issues  

---

---

# 10. REGISTRY ID GENERATION

## Format

GAFAIG-<hash>

---

## Behavior

• generated at publish  
• reused on republish  
• immutable  

---

---

# EXECUTION ORDER

1. Applications setup  
2. Verification pipeline tables  
3. Scoring engine  
4. Decision table  
5. Registry snapshot table  
6. Publish procedure  
7. Registry views  
8. Public views  
9. Diagnostics  

---

---

# DATA FLOW (SNOWFLAKE)

APPLICATION  
→ VERIFICATION_CASES  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ DECISIONS  
→ REGISTRY_SNAPSHOTS  
→ V_REGISTRY_LATEST_APPROVED  
→ V_REGISTRY_PUBLIC  

---

---

# CONNECTION TO APPLICATION

Snowflake  
→ sfQuery()  
→ API  
→ UI  

---

---

# CRITICAL RULES

DO NOT:

• move logic outside Snowflake  
• compute certification in API/UI  
• mutate registry snapshots  
• expose private evidence  

---

ALWAYS:

• use views as source  
• maintain deterministic outputs  
• preserve append-only behavior  

---

---

# TROUBLESHOOTING GUIDE

## If registry page fails

Check:

• V_REGISTRY_PUBLIC exists  
• Snowflake connection active  
• permissions correct  

---

## If verify API fails

Check:

• registryId exists  
• V_REGISTRY_PUBLIC query  
• signing function  

---

## If data missing

Check:

• publish procedure executed  
• DECISION_STATUS = approved/published  
• snapshot exists  

---

---

# SUMMARY

Snowflake layer is:

→ the engine  
→ the registry  
→ the source of truth  

Everything else depends on it.

No exceptions.