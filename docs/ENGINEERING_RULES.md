# GAFAIG — ENGINEERING RULES
AI + Developer Execution Guardrails
Last Updated: 2026-03-24

---

# PURPOSE

This file exists to prevent:

• architecture drift  
• Snowflake / API / UI misalignment  
• AI-generated code errors  
• non-deterministic behavior  

These rules are MANDATORY.

---

# CORE PRINCIPLE

SNOWFLAKE IS THE SOURCE OF TRUTH

Everything must originate from:

Snowflake → Views → Query Layer → API → UI

NEVER the reverse.

---

# CANONICAL DATA FLOW (LOCKED)

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SNAPSHOT  
→ REGISTRY  
→ VIEWS  
→ API  
→ UI  

DO NOT CHANGE THIS FLOW.

---

# LAYER RESPONSIBILITIES

---

## 1. SNOWFLAKE (LOGIC LAYER)

Responsible for:

• all computation  
• all scoring  
• all joins  
• all normalization  
• all certification outputs  

Snowflake must output:

✔ final, deterministic values  
✔ no ambiguity  
✔ no missing dependencies  

---

## 2. QUERY LAYER (TRANSLATION ONLY)

Location:

lib/queries/

Responsible for:

• calling Snowflake  
• mapping column names → camelCase  
• SAFE fallback logic only  

NOT responsible for:

• business logic  
• computation  
• deriving new data (except fallback)

---

## 3. API LAYER (PASS-THROUGH)

Responsible for:

• returning query results  
• applying filters  
• formatting response  

NOT responsible for:

• data transformation  
• logic  
• calculations  

---

## 4. UI LAYER (DISPLAY ONLY)

Responsible for:

• rendering  
• layout  
• formatting  

NOT responsible for:

• logic  
• business rules  
• assumptions about data  

---

# CRITICAL RULES

---

## RULE 1 — NEVER REFERENCE NON-EXISTENT COLUMNS

Before using any field:

✔ verify it exists in Snowflake view

If not:

→ FIX THE VIEW  
→ NOT the UI  
→ NOT the API  

---

## RULE 2 — DO NOT INVENT DATA

Never create:

• fake timestamps  
• fake certification values  
• hardcoded tiers or scores  

If data is missing:

→ return NULL  
→ fix upstream  

---

## RULE 3 — DERIVED FIELDS BELONG IN VIEWS

Examples:

valid_from  
last_activity_at  

These MUST be defined in:

Snowflake views

NOT:

• API  
• UI  
• helper functions  

---

## RULE 4 — QUERY LAYER IS A CONTRACT

File:

lib/queries/registry.ts

This file defines:

what the UI receives

It must:

• only use real columns  
• normalize safely  
• never break schema  

---

## RULE 5 — NEVER DUPLICATE SQL

All SQL must live in:

lib/queries/

DO NOT:

• write SQL in pages  
• write SQL in API routes  
• duplicate queries  

---

## RULE 6 — ALWAYS USE COALESCE FOR TIMESTAMPS

Correct pattern:

COALESCE(PUBLISHED_AT, CERTIFIED_AT, APPROVED_AT)

This prevents:

• null failures  
• UI crashes  
• missing registry data  

---

## RULE 7 — DO NOT MODIFY WORKING SYSTEMS

DO NOT TOUCH:

• scoring engine  
• publish procedure  
• snapshot system  
• verification pipeline  

ONLY modify:

• registry views  
• query layer  
• API mapping  
• UI display  

---

## RULE 8 — CLEAR CACHE AFTER STRUCTURAL CHANGES

Whenever you change:

• query files  
• API routes  
• data structures  

Run:

Remove-Item -Recurse -Force .next  
npm run dev  

---

## RULE 9 — TEST AFTER EVERY CHANGE

You MUST test:

API:  
http://localhost:3000/api/registry?caseId=CASE-0001  

REGISTRY LIST:  
http://localhost:3000/registry  

REGISTRY DETAIL:  
http://localhost:3000/registry/[registryId]  

---

## RULE 10 — FIX ROOT CAUSE, NOT SYMPTOMS

If error appears:

WRONG:

• patch UI  
• hide field  
• hardcode values  

CORRECT:

• fix Snowflake view  
• fix query layer  

---

# COMMON FAILURE PATTERNS (AVOID)

---

## INVALID IDENTIFIER ERRORS

Cause:

UI/API referencing missing columns

Fix:

update Snowflake view

---

## UNDEFINED FUNCTION ERRORS

Cause:

query function not exported

Fix:

fix lib/queries file

---

## EMPTY UI DATA

Cause:

query mismatch or missing mapping

Fix:

verify query layer normalization

---

## DUPLICATE LOGIC

Cause:

logic in both SQL and JS

Fix:

keep logic ONLY in Snowflake

---

# GOLDEN RULE

IF DATA IS WRONG → FIX SNOWFLAKE

NOT:

• React  
• API  
• TypeScript  

---

# AI DEVELOPMENT SAFETY RULE

When generating code:

ALWAYS:

1. check Snowflake schema first  
2. verify column names  
3. ensure deterministic output  
4. avoid assumptions  

---

# FINAL CHECK BEFORE COMMIT

Before pushing:

✔ no SQL errors  
✔ no runtime errors  
✔ no missing fields  
✔ registry renders  
✔ API returns valid JSON  

---

# END STATE

System must be:

✔ deterministic  
✔ consistent  
✔ auditable  
✔ production-safe  

---

END OF ENGINEERING RULES