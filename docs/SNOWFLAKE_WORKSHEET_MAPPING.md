# GAFAIG — SNOWFLAKE WORKSHEET MAPPING
Canonical SQL File & Worksheet Intelligence
Last Updated: 2026-03-27

---

# 🧠 PURPOSE

Defines:

• what each Snowflake worksheet / SQL file does  
• how files relate to the system  
• where logic lives  
• what is safe vs unsafe to modify  

This prevents confusion when navigating Snowflake.

---

# ❄️ ENVIRONMENT

Account: GAFAIG1  
Database: GAFAIG_DB  
Schema: CORE  
Warehouse: GAFAIG_WH  

---

# 🔒 CORE PRINCIPLE

Snowflake is the **ONLY source of truth**.

ALL:

• scoring  
• certification  
• registry  
• aggregation  

MUST live here.

---

# 🧱 FILE CATEGORIES

---

## 1. CORE TABLE DEFINITIONS

Purpose:

• define persistent system state  

Key Tables:

• APPLICATIONS  
• VERIFICATION_CASES  
• VERIFICATION_FINDINGS  
• VERIFICATION_FINDING_EVIDENCE  
• VERIFICATION_EVIDENCE  
• VERIFICATION_EVENTS  
• SCORE_SNAPSHOTS  
• REGISTRY_SNAPSHOTS  

---

## 2. SCORING ENGINE FILES

---

### CONTROL STRUCTURE

Files:

• CONTROL_CATALOG.sql  
• CONTROL_WEIGHTS.sql  
• SEVERITY_WEIGHTS.sql  
• SCORING_MODEL_VERSIONS.sql  

Purpose:

• define scoring logic inputs  

---

### NORMALIZATION + SCORING

Files:

• V_FINDING_NORMALIZED.sql  
• V_FINDING_EVIDENCE_IDS.sql  
• V_CONTROL_EVIDENCE_FRESHNESS.sql  
• V_CONTROL_SCORE_COMPONENTS.sql  
• V_CASE_OPERATIONAL_SCORE.sql  
• V_GOVERNANCE_SCORE_CASE.sql  
• V_CASE_TIER_BAND.sql  

Purpose:

• transform raw findings into governance score  

---

### SCORING PROCEDURE

File:

• SP_SCORE_CASE_ENTERPRISE.sql  

Purpose:

• compute score  
• generate score snapshot  

---

## 3. REGISTRY SYSTEM FILES

---

### REGISTRY TABLE

File:

• REGISTRY_SNAPSHOTS.sql  

Purpose:

• append-only certification history  
• NEVER updated  

---

### REGISTRY VIEWS

Files:

• V_REGISTRY_LATEST_APPROVED.sql  
• V_REGISTRY_PUBLIC.sql  
• V_REGISTRY_PUBLIC_SEARCH.sql  
• V_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

Purpose:

• expose registry to API/UI  

---

### PUBLISH PROCEDURE

File:

• SP_PUBLISH_CASE_TO_REGISTRY_V3.sql  

Purpose:

• publish certification  
• create snapshot  
• reuse REGISTRY_ID  

---

### CRITICAL BEHAVIOR

• same CASE → same REGISTRY_ID  
• no duplicates allowed  
• append-only writes  
• deterministic output  

---

## 4. AI SYSTEMS FILES

---

Files:

• REGISTRY_AI_SYSTEMS.sql  
• V_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

Purpose:

• map systems to registry  
• expose systems publicly  

---

## 5. DEMO / SEED DATA

---

Files:

• Canonical Demo Dataset.sql  
• Canonical Demo Seed.sql  

Purpose:

• populate demo cases  
• enable UI testing  

---

## 6. ARCHIVE FILES (DO NOT USE)

---

Examples:

• Application Write Smoke (Archive).sql  
• Auto Publish From Case (Archive).sql  
• Canonical Case Pipeline Bootstrap (Archive).sql  
• Canonical Enterprise Engine Bootstrap (Archive).sql  

Purpose:

• historical development  
• reference only  

⚠️ DO NOT EXECUTE  
⚠️ DO NOT MODIFY  

---

# 🔄 FILE INTERCONNECTION

---

## SCORING FLOW

VERIFICATION_FINDINGS  
→ V_FINDING_NORMALIZED  
→ V_CONTROL_SCORE_COMPONENTS  
→ V_CASE_OPERATIONAL_SCORE  
→ V_GOVERNANCE_SCORE_CASE  
→ V_CASE_TIER_BAND  

---

## SNAPSHOT FLOW

SP_SCORE_CASE_ENTERPRISE  
→ SCORE_SNAPSHOTS  

---

## REGISTRY FLOW

SP_PUBLISH_CASE_TO_REGISTRY_V3  
→ REGISTRY_SNAPSHOTS  

---

## PUBLIC FLOW

REGISTRY_SNAPSHOTS  
→ V_REGISTRY_LATEST_APPROVED  
→ V_REGISTRY_PUBLIC  
→ API → UI  

---

# ⚠️ CURRENT STATE

## STABLE

• scoring engine  
• registry snapshots  
• publish procedure  
• public views  

---

## RECENTLY VALIDATED

• REGISTRY_ID reuse  
• append-only behavior  
• badge + registry alignment  

---

## TEMPORARY ADJUSTMENTS

• REGISTRY_PUBLIC_READTHROUGH used in app layer  
• protects against timing inconsistencies  

---

# 🔥 DO NOT MODIFY

• REGISTRY_SNAPSHOTS structure  
• V_REGISTRY_LATEST_APPROVED  
• SP_PUBLISH_CASE_TO_REGISTRY_V3  
• scoring views  

These are LOCKED.

---

# ⚠️ SAFE TO MODIFY (CAREFULLY)

• search view (V_REGISTRY_PUBLIC_SEARCH)  
• AI systems projection (if needed)  

ONLY if necessary and aligned with architecture.

---

# 🧠 DEBUGGING GUIDE

---

## If registry page fails:

Check:

• REGISTRY_SNAPSHOTS  
• V_REGISTRY_LATEST_APPROVED  
• V_REGISTRY_PUBLIC  

---

## If badge fails:

Check:

• registryId exists  
• V_REGISTRY_PUBLIC returns row  

---

## If explorer fails:

Check:

• V_REGISTRY_PUBLIC  
• V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

## If publish fails:

Check:

• SP_PUBLISH_CASE_TO_REGISTRY_V3  
• input caseId  
• scoring views  

---

# ▶️ NEXT PHASE

After validation:

• review readthrough layer necessity  
• optimize public views  
• ensure search performance  
• finalize Snowflake → API contract  

---

# 🧠 SUMMARY

Snowflake is:

✔ deterministic  
✔ authoritative  
✔ append-only  
✔ registry-backed  

All application behavior depends on it.