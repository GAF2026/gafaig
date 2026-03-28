# GAFAIG — SNOWFLAKE SQL FILE SUMMARY
Canonical SQL File Inventory & Purpose
Last Updated: 2026-03-27

---

# 🧠 PURPOSE

This document provides:

• a complete inventory of Snowflake SQL files  
• what each file does  
• how files are grouped  
• what is active vs archive  

This prevents confusion when navigating Snowflake worksheets.

---

# ❄️ ENVIRONMENT

Database: GAFAIG_DB  
Schema: CORE  
Warehouse: GAFAIG_WH  

---

# 🔒 CORE RULE

Only **ACTIVE files** define the system.

Archive files are **reference only**.

---

# 🧱 ACTIVE SQL FILES

---

## 🟦 1. TABLE DEFINITIONS

These define persistent data structures.

• CORE.APPLICATIONS.sql  
• CORE.VERIFICATION_CASES.sql  
• CORE.VERIFICATION_FINDINGS.sql  
• CORE.VERIFICATION_FINDING_EVIDENCE.sql  
• CORE.VERIFICATION_EVIDENCE.sql  
• CORE.VERIFICATION_EVENTS.sql  
• CORE.SCORE_SNAPSHOTS.sql  
• CORE.REGISTRY_SNAPSHOTS.sql  
• CORE.REGISTRY_AI_SYSTEMS.sql  

---

## 🟩 2. SCORING ENGINE

---

### Inputs

• CORE.CONTROL_CATALOG.sql  
• CORE.CONTROL_WEIGHTS.sql  
• CORE.SEVERITY_WEIGHTS.sql  
• CORE.SCORING_MODEL_VERSIONS.sql  

---

### Processing Views

• CORE.V_FINDING_NORMALIZED.sql  
• CORE.V_FINDING_EVIDENCE_IDS.sql  
• CORE.V_CONTROL_EVIDENCE_FRESHNESS.sql  
• CORE.V_CONTROL_SCORE_COMPONENTS.sql  
• CORE.V_CASE_OPERATIONAL_SCORE.sql  
• CORE.V_GOVERNANCE_SCORE_CASE.sql  
• CORE.V_CASE_TIER_BAND.sql  

---

### Execution

• CORE.SP_SCORE_CASE_ENTERPRISE.sql  

---

## 🟨 3. REGISTRY SYSTEM

---

### Table

• CORE.REGISTRY_SNAPSHOTS.sql  

---

### Views

• CORE.V_REGISTRY_LATEST_APPROVED.sql  
• CORE.V_REGISTRY_PUBLIC.sql  
• CORE.V_REGISTRY_PUBLIC_SEARCH.sql  
• CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

---

### Publish Procedure

• CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3.sql  

---

## 🟪 4. AI SYSTEMS

• CORE.REGISTRY_AI_SYSTEMS.sql  
• CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

---

## 🟧 5. DEMO / SEED

• GAFAIG - Canonical Demo Dataset.sql  
• GAFAIG - Canonical Demo Seed.sql  

---

# 🧊 ARCHIVE SQL FILES (DO NOT USE)

These exist for history only.

---

## Bootstrap / Early System

• GAFAIG - Applications Setup & Grants (Archive - Early Bootstrap).sql  
• GAFAIG - Canonical Case Pipeline Bootstrap (Archive).sql  
• GAFAIG - Canonical Enterprise Engine Bootstrap (Archive).sql  

---

## Old Procedures

• GAFAIG - Auto Publish From Case (Archive - Old 2-Arg Procedure).sql  

---

## Test / Smoke

• GAFAIG - Application Write Smoke (Archive).sql  
• GAFAIG - Canonical Case Pipeline Write Test (Archive).sql  

---

## Diagnostics

• GAFAIG - Admin Unified View Diagnostics.sql  

---

# 🔄 SYSTEM FLOW (FILE-LEVEL)

---

## SCORING

VERIFICATION_FINDINGS  
→ V_FINDING_NORMALIZED  
→ V_CONTROL_SCORE_COMPONENTS  
→ V_CASE_OPERATIONAL_SCORE  
→ V_GOVERNANCE_SCORE_CASE  
→ V_CASE_TIER_BAND  

---

## SNAPSHOT

SP_SCORE_CASE_ENTERPRISE  
→ SCORE_SNAPSHOTS  

---

## REGISTRY

SP_PUBLISH_CASE_TO_REGISTRY_V3  
→ REGISTRY_SNAPSHOTS  

---

## PUBLIC

REGISTRY_SNAPSHOTS  
→ V_REGISTRY_LATEST_APPROVED  
→ V_REGISTRY_PUBLIC  
→ V_REGISTRY_PUBLIC_SEARCH  
→ V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

# ⚠️ CURRENT STATE

## STABLE

• scoring engine  
• registry system  
• publish pipeline  
• public views  

---

## VALIDATED

• registry ID reuse  
• append-only behavior  
• deterministic certification  

---

## TEMPORARY PATTERNS

• REGISTRY_PUBLIC_READTHROUGH (app-layer helper)  
• used to stabilize registry lookup  

---

# 🔥 DO NOT MODIFY

• CORE.REGISTRY_SNAPSHOTS  
• CORE.V_REGISTRY_LATEST_APPROVED  
• CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  
• scoring views  

These are LOCKED.

---

# ⚠️ MODIFY WITH CAUTION

• CORE.V_REGISTRY_PUBLIC_SEARCH  
• CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

# 🧠 DEBUGGING MAP

---

## Registry issues

Check:

• REGISTRY_SNAPSHOTS  
• V_REGISTRY_LATEST_APPROVED  
• V_REGISTRY_PUBLIC  

---

## Badge issues

Check:

• registryId exists  
• V_REGISTRY_PUBLIC returns row  

---

## Explorer issues

Check:

• V_REGISTRY_PUBLIC  
• V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

## Publish issues

Check:

• SP_PUBLISH_CASE_TO_REGISTRY_V3  
• scoring views  

---

# ▶️ NEXT PHASE

• validate explorer outputs  
• optimize search performance  
• consolidate query usage  
• finalize Snowflake → API contract  

---

# 🧠 SUMMARY

These SQL files define the **entire GAFAIG system**.

Everything else (API, UI) is just a projection of this layer.