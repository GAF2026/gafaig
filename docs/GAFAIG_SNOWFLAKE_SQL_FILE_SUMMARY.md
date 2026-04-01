# GAFAIG — GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
Snowflake SQL File Inventory + Functional Summary
Last Updated: 2026-03-31

---

# 🚨 SYSTEM RULE

Snowflake SQL files define the **core execution logic of GAFAIG**.

DO NOT:

• Re-architect SQL layer  
• Move logic into API/UI  
• Duplicate logic outside Snowflake  

ALL SYSTEM TRUTH MUST LIVE IN SQL FILES + VIEWS.

---

# 🧠 PURPOSE OF THIS DOCUMENT

This file provides:

• Complete inventory of Snowflake SQL files  
• Functional grouping  
• How each file maps to system behavior  

---

# 📂 SQL FILE CATEGORIES

GAFAIG SQL files fall into 6 core categories:

1. Bootstrap / Setup  
2. Application + Case Creation  
3. Findings + Evidence  
4. Events  
5. Scoring  
6. Registry Publish  
7. Diagnostics / Validation  

---

# 🔵 1. BOOTSTRAP / SETUP

## Purpose

• Create schema  
• Create tables  
• Set permissions  
• Initialize system  

---

## Files

GAFAIG - Applications Setup & Grants.sql  
GAFAIG - Canonical Case Pipeline Bootstrap.sql  
GAFAIG - Canonical Enterprise Engine Bootstrap.sql  

---

## Notes

• Run once during initial setup  
• Defines system structure  

---

# 🟢 2. APPLICATION + CASE CREATION

## Purpose

• Insert applications  
• Create verification cases  

---

## Files

GAFAIG - Application Write.sql  
GAFAIG - Canonical Case Pipeline Write Test.sql  
GAFAIG - Canonical Demo Seed.sql  

---

## Tables Used

• APPLICATIONS  
• VERIFICATION_CASES  

---

## Notes

• Entry point into pipeline  
• Must follow canonical schema  

---

# 🟡 3. FINDINGS + EVIDENCE

## Purpose

• Populate verification data  
• Link findings to evidence  

---

## Files

GAFAIG - Findings Write.sql  
GAFAIG - Evidence Write.sql  
GAFAIG - Finding Evidence Mapping.sql  

---

## Tables Used

• VERIFICATION_FINDINGS  
• VERIFICATION_EVIDENCE  
• VERIFICATION_FINDING_EVIDENCE  

---

## Notes

• Core of verification logic  
• Evidence remains private  

---

# 🟠 4. EVENTS

## Purpose

• Track workflow actions  
• Provide audit trail  

---

## Files

GAFAIG - Events Insert.sql  
GAFAIG - Workflow Events.sql  

---

## Tables Used

• VERIFICATION_EVENTS  

---

## Notes

• Append-only  
• Critical for auditability  

---

# 🔴 5. SCORING

## Purpose

• Compute deterministic governance score  
• Assign certification tier and band  

---

## Files

GAFAIG - Score Case.sql  
GAFAIG - Enterprise Score Case.sql  

---

## Outputs

• FINAL_SCORE  
• TIER  
• BAND  

---

## Views

• V_GOVERNANCE_SCORE_CASE  
• Enterprise scoring views  

---

## Notes

• Deterministic  
• Must never be duplicated outside Snowflake  

---

# 🟣 6. REGISTRY PUBLISH

## Purpose

• Write certification to registry  
• Generate registry ID  
• Create immutable snapshot  

---

## Files

GAFAIG - Publish Case.sql  
GAFAIG - Auto Publish From Case.sql  

---

## Tables Used

• REGISTRY_SNAPSHOTS  

---

## Stored Procedures

• SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

## Notes

• Append-only  
• Core trust mechanism  

---

# ⚫ 7. DIAGNOSTICS / VALIDATION

## Purpose

• Validate system integrity  
• Debug pipeline  
• Smoke testing  

---

## Files

GAFAIG - Admin Unified View Diagnostics.sql  
GAFAIG - APP_ROLE Smoke.sql  
GAFAIG - Application Write Smoke.sql  

---

## Notes

• Used during development and testing  
• Not part of production flow  

---

# 🔗 SQL FILE → SYSTEM FLOW

## Full Pipeline Mapping

APPLICATION  
→ GAFAIG - Application Write.sql  

CASE  
→ GAFAIG - Canonical Case Pipeline  

FINDINGS  
→ GAFAIG - Findings Write.sql  

EVIDENCE  
→ GAFAIG - Evidence Write.sql  

EVENTS  
→ GAFAIG - Events Insert.sql  

SCORING  
→ GAFAIG - Score Case.sql  

REGISTRY  
→ GAFAIG - Publish Case.sql  

---

# 🌐 SQL → VIEW → API → UI

## SQL Layer

Tables + Procedures  

↓

## View Layer

• V_REGISTRY_LATEST_APPROVED  
• V_REGISTRY_PUBLIC  
• V_REGISTRY_PUBLIC_SEARCH  

↓

## Query Layer

lib/queries/*  

↓

## API Layer

/api/*  

↓

## UI Layer

/registry  
/badge  
/explorer  

---

# ⚠️ CRITICAL RULES

## DO NOT:

• Modify registry snapshots directly  
• Compute score outside SQL  
• Expose private data in public views  
• Add logic to API/UI  

---

## ALWAYS:

• Use views for public access  
• Keep SQL deterministic  
• Maintain append-only architecture  

---

# 🧠 DESIGN PRINCIPLE

SQL files define:

The **execution engine of GAFAIG**

Everything else is:

A projection of SQL-defined truth  

---

# 🚀 NEXT SQL WORK

## 1. Scoring Expansion

• Add new governance dimensions  
• Improve scoring granularity  

---

## 2. Registry Enrichment

• Normalize country fields  
• Improve entity mapping  

---

## 3. Explorer Support

• Create aggregation views  
• Add metrics views  

---

## 4. Performance

• Optimize query execution  
• Improve view performance  

---

# END OF SQL FILE SUMMARY