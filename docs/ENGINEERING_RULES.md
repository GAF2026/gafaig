# GAFAIG — ENGINEERING RULES
Non-Negotiable System Constraints
Last Updated: 2026-04-03

---

# PURPOSE

This document defines the **immutable engineering rules** for GAFAIG.

These rules are:

• NOT suggestions  
• NOT guidelines  
• NOT optional  

They are **system constraints**.

Violating these rules breaks:

→ determinism  
→ trust integrity  
→ system credibility  

---

# CORE PRINCIPLE

GAFAIG is:

→ deterministic  
→ auditable  
→ verifiable  
→ infrastructure  

NOT:

→ a dashboard  
→ a scoring UI  
→ a flexible application  

---

# RULE 1 — SNOWFLAKE IS THE SOURCE OF TRUTH

ALL authoritative data must originate from:

→ Snowflake (GAFAIG_DB / CORE)

---

## REQUIRED

• scoring logic lives in Snowflake  
• certification logic lives in Snowflake  
• registry data originates in Snowflake  

---

## FORBIDDEN

• computing scores in API  
• computing certification in UI  
• duplicating logic outside Snowflake  

---

---

# RULE 2 — API IS PASS-THROUGH ONLY

API layer must:

→ read from Snowflake  
→ return structured response  

---

## ALLOWED

• parameter handling  
• mapping fields  
• formatting JSON  

---

## FORBIDDEN

• scoring logic  
• certification logic  
• transformation beyond mapping  

---

---

# RULE 3 — UI IS PRESENTATION ONLY

UI layer must:

→ display data  
→ not compute logic  

---

## ALLOWED

• formatting  
• layout  
• conditional rendering  

---

## FORBIDDEN

• scoring logic  
• certification logic  
• data mutation  
• direct Snowflake queries  

---

---

# RULE 4 — APPEND-ONLY REGISTRY

Registry must be:

→ immutable  
→ append-only  

---

## TABLE

CORE.REGISTRY_SNAPSHOTS  

---

## FORBIDDEN

• UPDATE  
• DELETE  

---

## REQUIRED

• insert new snapshot for changes  
• derive latest state via views  

---

---

# RULE 5 — USE VIEWS, NOT TABLES

Application must read from:

→ views  

NOT:

→ raw tables  

---

## PRIMARY VIEW

CORE.V_REGISTRY_PUBLIC  

---

## PURPOSE

• abstraction layer  
• stability  
• controlled schema  

---

---

# RULE 6 — CERTIFICATION IS DETERMINISTIC

Certification must:

→ always produce same output for same input  

---

## SOURCE

SP_SCORE_CASE_ENTERPRISE  
V_CASE_TIER_BAND  

---

## FORBIDDEN

• randomness  
• external dependencies  
• UI-based logic  

---

---

# RULE 7 — CERTIFICATION STATUS RULE

Certification is defined ONLY by:

CERTIFIED_AT IS NOT NULL  

---

## DO NOT USE

CERTIFICATION_STATUS (non-canonical)

---

---

# RULE 8 — NO PRIVATE DATA EXPOSURE

Public system must NEVER expose:

• evidence  
• findings  
• internal workflow  
• reviewer data  

---

## PUBLIC ONLY

• certification outcome  
• tier / band  
• validity  
• identifiers  

---

---

# RULE 9 — SIGNED PROOF MUST BE DETERMINISTIC

Verification proof must:

• be reproducible  
• match canonical record  
• be verifiable externally  

---

## STRUCTURE

proof:
• alg  
• kid  
• signature  
• signedAt  
• message  
• messageString  
• verificationKeyUrl  

---

---

# RULE 10 — PUBLIC KEY MUST VALIDATE PROOF

Endpoint:

/api/.well-known/gafaig-public-key  

---

## REQUIRED

• external systems can verify signature  
• key must match signing process  

---

---

# RULE 11 — QUERY LAYER IS MANDATORY

All Snowflake access must go through:

lib/snowflake.ts → sfQuery()

---

## FORBIDDEN

• direct Snowflake calls in API/UI  
• duplicated query logic  

---

---

# RULE 12 — CASE ID NORMALIZATION

caseId must always be:

→ uppercase  

---

## PURPOSE

• consistency  
• reliable joins  

---

---

# RULE 13 — REGISTRY ID IMMUTABILITY

REGISTRY_ID must:

• be generated at publish  
• never change  
• be reused on republish  

---

## FORMAT

GAFAIG-<hash>  

---

---

# RULE 14 — ERROR HANDLING

System must NEVER:

→ crash public pages  

---

## REQUIRED

• try/catch in pages  
• fallback UI  

---

## BEHAVIOR

If Snowflake fails:

• page still renders  
• show “Data unavailable”  
• maintain navigation  

---

---

# RULE 15 — NO RE-ARCHITECTURE

DO NOT:

• redesign system structure  
• move logic across layers  
• introduce new architecture patterns  

---

## ALWAYS

• extend existing system  
• respect current layering  

---

---

# RULE 16 — TRUST INFRASTRUCTURE PRIORITY

Every feature must support:

→ verifiability  
→ external validation  
→ trust portability  

---

## GOOD FEATURES

• verification API  
• widget  
• badge  
• proof  

---

## BAD FEATURES

• internal-only UI  
• non-verifiable displays  
• cosmetic-only additions  

---

---

# RULE 17 — SINGLE SOURCE CERTIFICATION FIELDS

The following fields must ONLY come from Snowflake:

• CERTIFIED_SCORE  
• CERTIFIED_TIER  
• CERTIFIED_BAND  
• CERTIFIED_AT  
• DECISION_STATUS  

---

---

# RULE 18 — NO STATE DRIFT

Application state must:

→ always reflect Snowflake  

---

## FORBIDDEN

• caching that changes meaning  
• stale derived values  
• client-side overrides  

---

---

# RULE 19 — DEPLOYMENT SAFETY

Before deployment:

• ensure queries are valid  
• ensure no breaking changes  
• ensure fallback handling exists  

---

---

# RULE 20 — SYSTEM IDENTITY MUST BE PRESERVED

GAFAIG must remain:

→ trust infrastructure  

NOT:

→ application layer product  
→ analytics dashboard  

---

---

# FINAL DIRECTIVE

If a change violates ANY of these rules:

→ DO NOT IMPLEMENT IT  

---

# SUMMARY

These rules enforce:

• determinism  
• integrity  
• verifiability  
• credibility  

They are the foundation of GAFAIG.

They are not optional.