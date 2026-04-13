# GAFAIG SNOWFLAKE SQL FILE SUMMARY

DATE: 2026-04-13

This document defines all canonical Snowflake SQL files used to build and operate the GAFAIG verification engine and public registry.

Snowflake is the single source of truth for GAFAIG.

All governance scoring, certification decisions, and registry outputs are computed in Snowflake.

----------------------------------------
CORE PRINCIPLES
----------------------------------------

- Snowflake computes ALL truth
- Application layer does NOT compute logic
- Registry is append-only
- Views are canonical interfaces
- Stored procedures control mutation

----------------------------------------
DATABASE CONFIGURATION
----------------------------------------

Account: GAFAIG1  
Database: GAFAIG_DB  
Schema: CORE  
Warehouse: GAFAIG_WH  

----------------------------------------
TABLES (CORE DATA MODEL)
----------------------------------------

----------------------------------------
VERIFICATION ENGINE TABLES
----------------------------------------

GAFAIG - CORE.VERIFICATION_CASES.sql  
- Root verification object  
- Contains case metadata  
- Primary key: CASE_ID  

GAFAIG - CORE.VERIFICATION_FINDINGS.sql  
- Stores control-level findings  
- Linked to CASE_ID  

GAFAIG - CORE.VERIFICATION_EVIDENCE.sql  
- Stores supporting evidence  
- Private, not exposed publicly  

GAFAIG - CORE.VERIFICATION_FINDING_EVIDENCE.sql  
- Join table linking findings to evidence  

GAFAIG - CORE.VERIFICATION_EVENTS.sql  
- Audit trail of actions  
- Append-only  

----------------------------------------
SCORING TABLES
----------------------------------------

GAFAIG - 16_TABLES_CASE_SCORE_SNAPSHOTS.sql  
- Stores scoring snapshots  
- Append-only  

GAFAIG - 17_TABLES_DECISIONS.sql  
- Stores final certification decisions  
- Linked to CASE_ID  

----------------------------------------
REGISTRY TABLES
----------------------------------------

GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql  
- Public registry snapshots  
- Append-only  
- Core output of GAFAIG  

GAFAIG - 14_TABLES_REGISTRY_AI_SYSTEMS.sql  
- Stores AI system metadata  
- Linked to REGISTRY_ID  

----------------------------------------
DIMENSION / CONTROL TABLES
----------------------------------------

GAFAIG - CANONICAL_DIMENSION_SYSTEM.sql  
- Defines governance dimensions  
- Used in scoring  

----------------------------------------
VIEWS (CANONICAL OUTPUT LAYER)
----------------------------------------

----------------------------------------
REGISTRY VIEWS
----------------------------------------

21_VIEWS_PUBLIC_REGISTRY.sql  

Includes:

V_REGISTRY_LATEST_APPROVED  
- Latest approved snapshot per CASE_ID  
- Uses ROW_NUMBER()  

V_REGISTRY_PUBLIC  
- Canonical public registry view  
- Used by all UI + APIs  

V_REGISTRY_PUBLIC_SEARCH  
- Search-optimized registry view  
- Includes normalized fields  

----------------------------------------
AI SYSTEM VIEWS
----------------------------------------

V_REGISTRY_AI_SYSTEMS_PUBLIC  
- Public AI systems view  
- Joins registry + system metadata  
- Used by explorer and registry pages  

----------------------------------------
SCORING VIEWS
----------------------------------------

GAFAIG - Governance Scoring (Enterprise v1.0).sql  

Includes:

V_GOVERNANCE_SCORE_CASE  
- Final deterministic score output  
- Source of:
  - FINAL_SCORE  
  - TIER  
  - BAND  

V_CASE_TIER_BAND  
- Tier and band classification  

V_CASE_RENEWAL_STATUS  
- Certification validity status  

V_CONTROL_SCORE_COMPONENTS  
- Detailed scoring breakdown  

----------------------------------------
STORED PROCEDURES
----------------------------------------

----------------------------------------
SCORING PROCEDURES
----------------------------------------

SP_SCORE_CASE_ENTERPRISE  
- Executes full scoring pipeline  
- Populates scoring snapshots  

----------------------------------------
PUBLISHING PROCEDURES
----------------------------------------

GAFAIG - CORE.REGISTRY_PUBLISH.sql  

Includes:

SP_PUBLISH_CASE_TO_REGISTRY_V3  
- Primary publish procedure  
- Validates case  
- Generates or reuses REGISTRY_ID  
- Inserts registry snapshot  

SP_PUBLISH_CASE_TO_REGISTRY_V4  
- Variant of publish logic  
- Used in newer workflows  

----------------------------------------
SEED / DEMO DATA
----------------------------------------

GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql  
- Seeds demo organizations  
- Seeds demo cases  
- Seeds findings and evidence  

----------------------------------------
UTILITY FILES
----------------------------------------

GAFAIG - SECURITY_ROW_ACCESS_POLICIES.sql  
- Defines row-level access policies  

REGISTRY_ID_RESOLUTION.sql  
- Defines deterministic ID generation  

VERIFICATION_SIGNATURE_CONTRACT.sql  
- Defines verification payload structure  

----------------------------------------
IMPORTANT SQL RULES
----------------------------------------

----------------------------------------
VARIABLE BINDING
----------------------------------------

- Always use :variable syntax inside Snowflake scripting  
- Never interpolate directly  

----------------------------------------
INSERT RULES
----------------------------------------

- Prefer INSERT ... SELECT  
- Avoid INSERT ... VALUES when using VARIANT  

----------------------------------------
APPEND-ONLY RULE
----------------------------------------

- Never update registry snapshots  
- Never delete registry data  
- Always insert new rows  

----------------------------------------
VIEW RULE
----------------------------------------

- UI must use views only  
- Never query base tables directly  

----------------------------------------
ERROR PREVENTION
----------------------------------------

Common issues to avoid:

- Invalid identifier (e.g., UPDATED_AT not existing)  
- JSON binding errors  
- Missing column mismatches  

----------------------------------------
CANONICAL FILE ORDER (EXECUTION)
----------------------------------------

1. Dimension system  
2. Core tables (verification)  
3. Scoring tables  
4. Registry tables  
5. Views  
6. Stored procedures  
7. Seed data  

----------------------------------------
RELATIONSHIP TO APPLICATION
----------------------------------------

Snowflake → Views → Query Layer → API → UI  

- Snowflake handles logic  
- Query layer fetches  
- API transports  
- UI renders  

----------------------------------------
CURRENT STATE
----------------------------------------

COMPLETED:
- Full verification pipeline  
- Deterministic scoring engine  
- Registry snapshot system  
- Public registry views  
- AI systems registry  

STABLE:
- V_REGISTRY_PUBLIC  
- V_GOVERNANCE_SCORE_CASE  
- SP_PUBLISH_CASE_TO_REGISTRY_V3  

ACTIVE:
- Alignment with UI trust surfaces  
- Validation of external API usage  

----------------------------------------
FINAL PRINCIPLE
----------------------------------------

Snowflake defines reality.

The application reflects it.

Never reverse that relationship.