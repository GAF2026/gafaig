# GAFAIG — ENGINEERING RULES
Non-Negotiable Development Constraints
Last Updated: 2026-03-29

---

# CORE PRINCIPLE

GAFAIG IS A DETERMINISTIC GOVERNANCE ENGINE

NOT:
• a frontend app
• a dashboard
• a flexible data playground

IT IS:
• a certification system
• a registry authority
• a trust infrastructure

---

# PRIMARY RULE

SNOWFLAKE IS THE SOURCE OF TRUTH

ALL:
• scoring
• certification
• aggregation
• joins
• business logic

MUST EXIST IN SNOWFLAKE

---

# DATA FLOW (LOCKED)

CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ SCORE SNAPSHOT
→ REGISTRY SNAPSHOT
→ PUBLIC VIEWS
→ API
→ UI

NO SHORTCUTS
NO BYPASSES

---

# ABSOLUTE PROHIBITIONS

DO NOT:

• compute certification in UI
• compute certification in API
• derive score outside Snowflake
• insert directly into REGISTRY_SNAPSHOTS
• bypass SP_PUBLISH_CASE_TO_REGISTRY_V3
• bypass SP_SCORE_CASE_ENTERPRISE
• create parallel pipelines
• duplicate logic across layers
• manually override scoring outputs

---

# REQUIRED PATTERNS

ALWAYS:

• use Snowflake views as truth
• use stored procedures for execution steps
• maintain append-only snapshot model
• use query layer between API and Snowflake
• normalize identifiers (UPPERCASE caseId, etc.)

---

# API RULES

API IS A PASS-THROUGH LAYER

API MUST:

• call Snowflake views or procedures
• return structured JSON
• not transform business logic

API MUST NOT:

• compute scores
• compute tiers/bands
• join complex datasets
• store derived data

---

# UI RULES

UI IS PRESENTATION ONLY

UI MUST:

• display API data
• format for readability

UI MUST NOT:

• compute certification
• compute scores
• join datasets
• hardcode business values

---

# DATABASE RULES

---

## APPEND-ONLY MODEL

NEVER:

• update registry snapshots
• overwrite scoring history

ALWAYS:

• insert new rows
• preserve history

---

## IDENTIFIERS

ALL IDs MUST BE:

• normalized (UPPERCASE)
• deterministic where required

Examples:

CASE-0001
GAFAIG-XXXXXXXX

---

## JSON / VARIANT HANDLING

WHEN inserting JSON:

• use PARSE_JSON(?)  
• prefer INSERT ... SELECT over VALUES when needed  

---

# SCORING ENGINE RULES

SCORING MUST BE:

• deterministic
• explainable
• control-based

NO:

• machine learning
• probabilistic scoring
• hidden weights

---

# REGISTRY RULES

---

## ENTRY INTO REGISTRY

ONLY via:

SP_PUBLISH_CASE_TO_REGISTRY_V3

NEVER:

• direct INSERT into REGISTRY_SNAPSHOTS

---

## CERTIFICATION SOURCE

ALL certification fields come from:

CORE.V_GOVERNANCE_SCORE_CASE

AND propagate through:

V_REGISTRY_LATEST_APPROVED
→ V_REGISTRY_PUBLIC

---

# SEEDING RULES

ONLY ONE CANONICAL SEED SYSTEM

MUST:

• follow full pipeline
• include complete control structure
• generate valid scoring rows

DO NOT:

• use backfill scripts
• maintain multiple seed versions
• insert directly into registry

---

# ERROR HANDLING

WHEN ERRORS OCCUR:

DO NOT:

• patch UI
• patch API
• bypass logic

INSTEAD:

• trace back to Snowflake
• fix at data or view level
• validate pipeline integrity

---

# DEVELOPMENT WORKFLOW

---

## LOCAL

npm run dev

---

## DEPLOY

git add .
git commit -m "message"
git push origin main

→ Vercel auto-deploy

---

# VALIDATION CHECKPOINTS

---

## AFTER SCORING

SELECT * FROM CORE.V_GOVERNANCE_SCORE_CASE;

SELECT * FROM CORE.V_CASE_TIER_BAND;

---

## AFTER PUBLISH

SELECT * FROM CORE.V_REGISTRY_PUBLIC;

---

## AFTER AI SYSTEMS

SELECT * FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC;

---

# ANTI-PATTERNS

DO NOT:

• fix issues in UI instead of Snowflake
• duplicate scoring logic
• hardcode demo values in frontend
• skip steps in pipeline
• create temporary workarounds that bypass system

---

# KEY INSIGHT

IF SOMETHING LOOKS WRONG IN UI:

IT IS NOT A UI PROBLEM

IT IS:

→ a data problem
→ a view problem
→ a pipeline problem

---

# FINAL RULE

DO NOT RE-ARCHITECT

The system is already correct.

ALL WORK MUST:

• respect existing architecture
• extend it properly
• not break deterministic flow

---

# PURPOSE

This file ensures:

• architectural integrity
• deterministic behavior
• consistency across all layers
• long-term system stability

---