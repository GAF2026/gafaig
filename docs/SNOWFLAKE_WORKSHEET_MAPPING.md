# GAFAIG — SNOWFLAKE WORKSHEET MAPPING
Canonical SQL File & Worksheet Map
Last Updated: 2026-04-06

---

# OVERVIEW

This document maps all Snowflake SQL worksheets/files to their purpose within GAFAIG.

STRICT RULE:
→ Snowflake is the single source of truth  
→ All scoring, certification, and registry logic lives here  
→ Next.js NEVER computes trust  

---

# CORE DATABASE

DATABASE:
GAFAIG_DB

SCHEMA:
CORE

WAREHOUSE:
GAFAIG_WH

---

# CORE SYSTEM WORKSHEETS (ACTIVE)

## 1. TABLE DEFINITIONS

### GAFAIG – TABLES: VERIFICATION CORE

Creates:

CORE.VERIFICATION_CASES  
CORE.FINDINGS  
CORE.EVIDENCE  
CORE.VERIFICATION_EVENTS  

PURPOSE:
→ foundational verification pipeline  

---

### GAFAIG – TABLES: SCORING

Creates:

CORE.CASE_SCORE_SNAPSHOTS  

PURPOSE:
→ store deterministic scoring outputs  

---

### GAFAIG – TABLES: DECISIONS

Creates:

CORE.DECISIONS  

PURPOSE:
→ final certification decisions  

---

### GAFAIG – TABLES: REGISTRY

Creates:

CORE.REGISTRY_SNAPSHOTS  

PURPOSE:
→ append-only registry records  

RULE:
→ NEVER UPDATE  
→ INSERT ONLY  

---

### GAFAIG – TABLES: AI SYSTEMS

Creates:

CORE.REGISTRY_AI_SYSTEMS  

PURPOSE:
→ metadata for AI systems linked to registry  

---

## 2. VIEWS (PUBLIC LAYER)

### GAFAIG – VIEWS: REGISTRY LATEST

Creates:

V_REGISTRY_LATEST_APPROVED  

PURPOSE:
→ latest approved snapshot per CASE_ID  

METHOD:
→ ROW_NUMBER() partition logic  

---

### GAFAIG – VIEWS: REGISTRY PUBLIC

Creates:

V_REGISTRY_PUBLIC  

PURPOSE:
→ canonical public registry view  

FIELDS:
• certified_score  
• certified_tier  
• certified_band  
• decision_status  
• entity fields  

RULE:
→ THIS IS THE MAIN PUBLIC SOURCE  

---

### GAFAIG – VIEWS: REGISTRY SEARCH

Creates:

V_REGISTRY_PUBLIC_SEARCH  

PURPOSE:
→ search-optimized registry  

FEATURES:
• *_norm fields (uppercase normalization)  
• concatenated q column  

---

### GAFAIG – VIEWS: AI SYSTEMS PUBLIC

Creates:

V_REGISTRY_AI_SYSTEMS_PUBLIC  

PURPOSE:
→ public AI systems view  

JOINS:
→ registry data + system metadata  

---

## 3. SCORING ENGINE

### GAFAIG – GOVERNANCE SCORING (ENTERPRISE)

Defines:

V_GOVERNANCE_SCORE_CASE  

PURPOSE:
→ deterministic scoring calculation  

OUTPUT:
• FINAL_SCORE  
• TIER  
• BAND  

RULE:
→ ONLY source of score  

---

### GAFAIG – STORED PROCEDURE: SCORE

SP_SCORE_CASE_ENTERPRISE  

PURPOSE:
→ execute scoring  

INPUT:
CASE_ID  

OUTPUT:
→ writes to CASE_SCORE_SNAPSHOTS  

---

## 4. REGISTRY PUBLISH

### GAFAIG – REGISTRY PUBLISH

Defines:

SP_PUBLISH_CASE_TO_REGISTRY_V3  

PURPOSE:
→ publish certification to registry  

LOGIC:
• validate case exists  
• validate decision exists  
• reuse REGISTRY_ID if exists  
• generate new if not  
• insert into REGISTRY_SNAPSHOTS  

RULE:
→ append-only  

---

## 5. DEMO / SEED DATA

### GAFAIG – CANONICAL DEMO SEED

PURPOSE:
→ seed initial organizations and cases  

---

### GAFAIG – CANONICAL DEMO DATASET

PURPOSE:
→ populate demo environment  

---

## 6. DIAGNOSTICS / DEBUG

### GAFAIG – ADMIN UNIFIED VIEW DIAGNOSTICS

PURPOSE:
→ debug joins across tables  

---

### GAFAIG – APP ROLE SMOKE

PURPOSE:
→ verify permissions  

---

### GAFAIG – APPLICATION WRITE SMOKE

PURPOSE:
→ test application inserts  

---

---

# EXECUTION ORDER (IMPORTANT)

When rebuilding system:

1. TABLES (core)
2. TABLES (scoring, decisions, registry)
3. TABLES (AI systems)
4. VIEWS (latest)
5. VIEWS (public)
6. VIEWS (search)
7. SCORING VIEW
8. STORED PROCEDURE (score)
9. STORED PROCEDURE (publish)
10. SEED DATA

---

# CRITICAL RULES

## 1. APPEND-ONLY REGISTRY

CORE.REGISTRY_SNAPSHOTS:

• NEVER UPDATE  
• NEVER DELETE  
• ONLY INSERT  

---

## 2. DETERMINISTIC SCORING

• scoring must always produce same result  
• no randomness  
• no UI influence  

---

## 3. VARIABLE BINDING

Use:

:variable  

NOT:

${variable}  

---

## 4. JSON INSERTS

USE:

INSERT INTO table  
SELECT PARSE_JSON(?)  

NOT:

VALUES (PARSE_JSON(?))  

---

## 5. NO UI LOGIC IN SQL

• SQL defines truth  
• UI only reads  

---

# COMMON ISSUES (RESOLVED)

## INVALID IDENTIFIER (e.g. UPDATED_AT)

CAUSE:
→ column mismatch  

FIX:
→ align view definitions  

---

## VARIANT INSERT ERRORS

CAUSE:
→ incorrect VALUES usage  

FIX:
→ use INSERT ... SELECT  

---

## DUPLICATE REGISTRY IDS

CAUSE:
→ publish logic  

FIX:
→ reuse existing REGISTRY_ID  

---

# RELATIONSHIP MAP

VERIFICATION_CASES  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING VIEW  
→ SCORE SNAPSHOT  
→ DECISIONS  
→ REGISTRY_SNAPSHOTS  
→ V_REGISTRY_LATEST_APPROVED  
→ V_REGISTRY_PUBLIC  
→ API  
→ UI  

---

# FINAL SUMMARY

Snowflake is:

• the verification engine  
• the scoring engine  
• the certification authority  
• the registry source  

Everything else is:

→ presentation  
→ transport  
→ integration  

---

# FINAL RULE

If it affects:

• score  
• certification  
• registry  

It MUST be implemented in Snowflake.