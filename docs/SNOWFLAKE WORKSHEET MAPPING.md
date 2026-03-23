# GAFAIG — SNOWFLAKE WORKSHEET MAP
Canonical Worksheet Responsibilities
Last Updated: 2026-03-22

---

# PURPOSE

This document defines:

• every Snowflake worksheet  
• what each worksheet contains  
• what each worksheet controls  
• when each worksheet should be used  

This prevents:

• editing the wrong file  
• duplicate logic  
• circular debugging  
• breaking working systems  

---

# CORE PRINCIPLE

Each worksheet has ONE responsibility only.

DO NOT mix:

• procedures and views  
• scoring and registry logic  
• production logic and debug logic  

---

# SYSTEM DATA FLOW (REFERENCE)

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SNAPSHOT  
→ REGISTRY  
→ AI SYSTEMS VIEW  
→ UI  

---

# WORKSHEET GROUPS

---

# 01 — ARCHIVE / BOOTSTRAP

## Files

GAFAIG - Applications Setup & Grants (Archive)  
GAFAIG - Canonical Case Pipeline Bootstrap (Archive)  
GAFAIG - Canonical Case Pipeline Write Test (Archive)  
GAFAIG - Application Write Smoke (Archive)  

## Purpose

• initial schema setup  
• early pipeline testing  
• role grants  

## Status

ARCHIVED — DO NOT MODIFY

---

# 02 — SCORING ENGINE

## File

24_SP_SCORE_CASE_ENTERPRISE.sql  

## Contains

SP_SCORE_CASE_ENTERPRISE  

## Responsibility

• compute governance score  
• aggregate weighted subscores  
• insert score snapshots  
• enforce deterministic scoring  

## Input

• V_CONTROL_SCORE_COMPONENTS  
• V_CASE_OPERATIONAL_SCORE  

## Output

• CASE_SCORE_SNAPSHOTS_V2  

## Rule

Do not modify unless changing scoring model.

---

# 03 — GOVERNANCE SCORE VIEW

## File

Worksheet containing V_GOVERNANCE_SCORE_CASE  

## Responsibility

• expose FINAL_SCORE  
• expose TIER / BAND  
• serve as source for publish procedure  

## Rule

This is the authoritative score source for certification.

---

# 04 — REGISTRY PUBLISH ENGINE

## File

25_PROCEDURES_APPROVAL.sql  

## Contains

SP_PUBLISH_CASE_TO_REGISTRY_V3  

## Responsibility

• validate case approval  
• read governance score  
• generate REGISTRY_ID  
• insert REGISTRY_SNAPSHOTS  
• link REGISTRY_AI_SYSTEMS  

## Input

• V_GOVERNANCE_SCORE_CASE  
• VERIFICATION_CASES  

## Output

• REGISTRY_SNAPSHOTS  
• REGISTRY_AI_SYSTEMS  

## Rule

Append-only. Never update prior snapshots.

---

# 05 — REGISTRY CORE VIEWS

## File

21_VIEWS_PUBLIC_REGISTRY.sql  

## Contains

• V_REGISTRY_LATEST_APPROVED  
• V_REGISTRY_PUBLIC  
• V_REGISTRY_EXPORT_V1  

## Responsibility

V_REGISTRY_LATEST_APPROVED:

• one row per CASE_ID  
• latest snapshot  
• certification contract  

V_REGISTRY_PUBLIC:

• public-facing registry view  

V_REGISTRY_EXPORT_V1:

• export-compatible dataset  

## Rule

This is the canonical source of certification.

---

# 06 — AI SYSTEMS PUBLIC VIEW

## File

22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

## Contains

V_REGISTRY_AI_SYSTEMS_PUBLIC  

## Responsibility

• join AI systems to registry  
• propagate certification fields  
• provide UI-ready dataset  

## Input

• REGISTRY_AI_SYSTEMS  
• V_REGISTRY_LATEST_APPROVED  

## Output

• public system-level rows  

## Rule

No business logic. Projection only.

---

# 07 — ADMIN / DIAGNOSTICS

## File

GAFAIG - Admin Unified View.sql  

## Responsibility

• admin inspection  
• debugging  
• internal validation  

## Rule

Not used by UI  
Not a source of truth  

---

# 08 — DEMO / SEED DATA

## Files

GAFAIG - Canonical Demo Dataset.sql  
GAFAIG - Canonical Demo Seed.sql  

## Purpose

• generate test data  
• simulate pipeline  

## Rule

Safe to rerun.

---

# 09 — SMOKE TESTS / VALIDATION

## Files

GAFAIG - APP_ROLE Smoke.sql  
GAFAIG - Admin Unified View Diagnostics.sql  

## Purpose

• validate permissions  
• validate access  
• confirm queries work  

---

# 10 — EXECUTION SCRIPTS (NON-CANONICAL)

## Example

99_RUN_PIPELINE.sql  

## Purpose

• manual execution  
• debugging  
• pipeline testing  

## Rule

• NOT canonical  
• safe to delete  
• recreate anytime  

---

# DATA FLOW MAPPING

SP_SCORE_CASE_ENTERPRISE  
→ CASE_SCORE_SNAPSHOTS_V2  
→ V_GOVERNANCE_SCORE_CASE  
→ SP_PUBLISH_CASE_TO_REGISTRY_V3  
→ REGISTRY_SNAPSHOTS  
→ V_REGISTRY_LATEST_APPROVED  
→ V_REGISTRY_AI_SYSTEMS_PUBLIC  
→ Query Layer  
→ UI  

---

# CRITICAL DEPENDENCIES

Publish Procedure → V_GOVERNANCE_SCORE_CASE  
Registry Views → REGISTRY_SNAPSHOTS  
AI Systems View → V_REGISTRY_LATEST_APPROVED  
UI → V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

# SAFE EDIT GUIDE

Change scoring → 24_SP_SCORE_CASE_ENTERPRISE.sql  
Change publish logic → 25_PROCEDURES_APPROVAL.sql  
Change certification fields → 21_VIEWS_PUBLIC_REGISTRY.sql  
Change UI dataset → 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  
Debug system → Admin Unified View  

---

# FINAL RULE

If unsure:

→ trace the data flow  
→ identify the correct layer  
→ modify only that file  

---

END OF FILE