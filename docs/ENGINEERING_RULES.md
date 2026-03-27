# GAFAIG — ENGINEERING RULES
Non-Negotiable System Constraints
Last Updated: 2026-03-25

---

# CORE PRINCIPLE

Snowflake is the ONLY source of truth.

All certification, scoring, and registry outputs MUST originate from Snowflake.

---

# ARCHITECTURE RULE

The system is strictly layered:

Snowflake (truth)
→ Views
→ Query Layer
→ API
→ UI

NO LAYER may bypass the one before it.

---

# ABSOLUTE PROHIBITIONS

DO NOT:

• compute scores in API  
• compute scores in UI  
• derive certification in UI  
• override engine outputs anywhere  
• duplicate SQL logic across files  
• mutate historical records  
• update registry snapshots  
• introduce “temporary fixes” in frontend  
• hardcode values to “make UI look right”  
• create parallel data flows  

---

# ENGINE AUTHORITY RULE (CRITICAL)

The following fields MUST come ONLY from:

CORE.V_GOVERNANCE_SCORE_CASE

• FINAL_SCORE  
• TIER  
• BAND  

---

# CERTIFICATION RULE (UPDATED)

Certification is ENGINE-DETERMINED.

DECISIONS can:

• approve  
• reject  
• publish  

DECISIONS CANNOT:

• override score  
• override tier  
• override band  

---

## CORRECT MODEL

IF decision_status IN (approved, published, certified):

→ certified_score = engine score  
→ certified_tier = engine tier  
→ certified_band = engine band  

ELSE:

→ no certification  

---

# SNAPSHOT RULE

CORE.REGISTRY_SNAPSHOTS is:

• append-only  
• immutable  
• historical  

DO NOT:

• update rows  
• delete rows  
• “fix” data in place  

ALL changes must occur through:

→ new snapshot insertion  

---

# VIEW CONTRACT RULE

Views define the system contract.

Critical views:

• V_GOVERNANCE_SCORE_CASE  
• V_REGISTRY_LATEST_APPROVED  
• V_REGISTRY_PUBLIC  
• V_REGISTRY_PUBLIC_SEARCH  
• V_REGISTRY_AI_SYSTEMS_PUBLIC  

Rules:

• UI MUST consume views  
• API MUST consume views  
• NO direct table joins in UI/API  

---

# API RULES

API is a pass-through layer.

DO:

• call query layer  
• return Snowflake results  

DO NOT:

• compute values  
• reshape certification logic  
• infer missing fields  
• apply business rules  

---

# QUERY LAYER RULE

Location:

lib/queries/

Purpose:

• centralize SQL usage  
• prevent duplication  
• ensure consistency  

Rules:

• ALL queries go through query layer  
• NO inline SQL in API routes  
• NO inline SQL in UI  

---

# FRONTEND RULES

Frontend is a display layer ONLY.

DO:

• render data  
• format data  
• display status  

DO NOT:

• compute certification  
• apply business logic  
• derive tier/band/score  
• fix backend issues  

---

# DATA FLOW RULE

ALL data must follow:

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SNAPSHOT  
→ DECISION  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEWS  
→ API  
→ UI  

NO shortcuts allowed.

---

# NAMING RULES

Use canonical identifiers:

CASE_ID  
REGISTRY_ID  
APPLICATION_ID  

Formats:

CASE-0001  
GAFAIG-XXXXXXXX  

All comparisons must use:

TRIM + UPPER normalization

---

# SQL SAFETY RULES

When inserting JSON:

USE:

INSERT ... SELECT PARSE_JSON(?)

DO NOT:

INSERT ... VALUES (...)

---

# ERROR HANDLING RULE

Fail explicitly.

DO NOT:

• silently ignore errors  
• fallback to fake data  
• return partial certification  

---

# TESTING RULE

Before deploying any change:

✔ validate Snowflake query  
✔ validate API response  
✔ validate UI rendering  
✔ confirm no drift between layers  

---

# DEPLOYMENT RULE

System must:

• build clean (no TypeScript errors)  
• deploy clean (Vercel)  
• return consistent outputs  

---

# TRUST RULE (MOST IMPORTANT)

GAFAIG is trust infrastructure.

Therefore:

• outputs must be deterministic  
• outputs must be explainable  
• outputs must be consistent across all layers  

---

# IF SOMETHING LOOKS WRONG

DO NOT fix it in UI.

TRACE BACK:

UI → API → Query → View → Snapshot → Engine

Fix at the SOURCE.

---

# ENGINEERING PHILOSOPHY

Correctness > Convenience  
Determinism > Flexibility  
Integrity > Speed  

---

# FINAL RULE

If a change violates any rule in this file:

DO NOT IMPLEMENT IT.

---