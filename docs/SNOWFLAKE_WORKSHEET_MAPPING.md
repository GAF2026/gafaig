# GAFAIG — SNOWFLAKE_WORKSHEET_MAPPING.md
Snowflake Worksheet Map + Data Layer Mapping
Last Updated: 2026-03-31

---

# 🚨 SYSTEM RULE

Snowflake is the **ONLY source of truth**.

ALL SYSTEM LOGIC MUST RESIDE IN:

Snowflake → Views → Query Layer → API → UI

DO NOT:

• Move logic into API  
• Move logic into UI  
• Duplicate logic outside Snowflake  

---

# 🧠 PURPOSE OF THIS DOCUMENT

This file maps:

• Snowflake worksheets  
• SQL files  
• Tables  
• Views  
• Stored procedures  

To:

• System functionality  
• UI pages  
• API endpoints  

---

# 🌍 ENVIRONMENT

Snowflake Account:

GAFAIG1

Database:

GAFAIG_DB

Schema:

CORE

Warehouse:

GAFAIG_WH

Role:

GAFAIG_APP_ROLE

---

# 📊 CORE TABLES

## 1. APPLICATIONS

Purpose:

• Intake of entities requesting certification  

Used by:

• Admin UI  
• Verification workflow  

---

## 2. VERIFICATION_CASES

Purpose:

• Represents certification case  

Links:

• APPLICATION → CASE  

---

## 3. VERIFICATION_FINDINGS

Purpose:

• Individual findings within a case  

---

## 4. VERIFICATION_EVIDENCE

Purpose:

• Evidence supporting findings  

---

## 5. VERIFICATION_FINDING_EVIDENCE

Purpose:

• Join table between findings and evidence  

---

## 6. VERIFICATION_EVENTS

Purpose:

• Audit log of verification actions  

---

## 7. REGISTRY_SNAPSHOTS

Purpose:

• Immutable registry records  

Properties:

• Append-only  
• Each publish = new snapshot  
• No updates  

---

# 📈 CORE VIEWS

## 1. V_REGISTRY_LATEST_APPROVED

Purpose:

• Canonical source of truth for registry  

Logic:

• ROW_NUMBER() over APPROVED_AT  
• Returns latest approved record per case  

Used by:

• V_REGISTRY_PUBLIC  
• All public APIs  

---

## 2. V_REGISTRY_PUBLIC

Purpose:

• Public certification dataset  

Fields:

• REGISTRY_ID  
• APPLICATION_ID  
• CASE_ID  
• ENTITY_NAME  
• ENTITY_TYPE  
• COUNTRY  
• CERTIFIED_SCORE  
• CERTIFIED_TIER  
• CERTIFIED_BAND  
• DECISION_STATUS  
• CERTIFIED_AT  
• VALID_FROM  
• VALID_TO  

Used by:

• /api/verify  
• /registry pages  
• /badge  

---

## 3. V_REGISTRY_PUBLIC_SEARCH

Purpose:

• Search-optimized registry  

Adds:

• Normalized text  
• Search column (q)  

Used by:

• /api/registry/search  
• Explorer  

---

## 4. V_REGISTRY_AI_SYSTEMS_PUBLIC

Purpose:

• Public AI systems dataset  

Fields:

• SYSTEM_ID  
• REGISTRY_ID  
• SYSTEM_NAME  
• SYSTEM_TYPE  
• RISK_TIER  
• CERTIFIED_TIER  
• CERTIFIED_BAND  
• DEVELOPER_ORGANIZATION  

Used by:

• /registry/ai-systems  
• Explorer  

---

# 🧮 SCORING LAYER

## 1. V_GOVERNANCE_SCORE_CASE

Purpose:

• Deterministic scoring output  

Outputs:

• FINAL_SCORE  
• TIER  
• BAND  

---

## 2. ENTERPRISE SCORING VIEWS (if present)

Examples:

• V_CASE_SCORE_ENTERPRISE  
• V_CASE_TIER_BAND  
• V_CONTROL_SCORE_COMPONENTS  

Purpose:

• Advanced scoring model  

---

# ⚙️ STORED PROCEDURES

## 1. SP_PUBLISH_CASE_TO_REGISTRY_V3 (or latest)

Purpose:

• Publish certification to registry  

Steps:

1. Validate case  
2. Generate or reuse REGISTRY_ID  
3. Insert into REGISTRY_SNAPSHOTS  
4. Mark as approved  

---

## 2. SCORING PROCEDURE (if present)

Example:

SP_SCORE_CASE_ENTERPRISE  

Purpose:

• Compute deterministic score  

---

# 🧾 CANONICAL WORKSHEETS (BY FUNCTION)

Below are the key worksheet categories and what they contain.

---

## 🔵 BOOTSTRAP / SETUP

Examples:

• Applications Setup & Grants  
• Canonical Pipeline Bootstrap  

Purpose:

• Initial schema setup  
• Permissions  
• Table creation  

---

## 🟢 APPLICATION + CASE CREATION

Examples:

• Application Write  
• Case Pipeline Write  

Purpose:

• Insert APPLICATIONS  
• Insert VERIFICATION_CASES  

---

## 🟡 FINDINGS + EVIDENCE

Examples:

• Findings Write  
• Evidence Write  
• Finding-Evidence Mapping  

Purpose:

• Populate verification data  

---

## 🟠 EVENTS

Examples:

• Events Insert  
• Workflow Events  

Purpose:

• Track verification lifecycle  

---

## 🔴 SCORING

Examples:

• Score Case  
• Enterprise Scoring  

Purpose:

• Generate FINAL_SCORE  
• Assign TIER and BAND  

---

## 🟣 REGISTRY PUBLISH

Examples:

• Publish Case  
• Auto Publish  

Purpose:

• Insert into REGISTRY_SNAPSHOTS  
• Create public record  

---

## ⚫ VALIDATION / DIAGNOSTICS

Examples:

• Smoke Tests  
• Diagnostics  
• Admin Views  

Purpose:

• Validate system integrity  
• Debug pipeline  

---

# 🔗 SYSTEM → WORKSHEET MAPPING

## Application Flow

APPLICATIONS  
→ Worksheet: Application Write  

---

## Case Creation

VERIFICATION_CASES  
→ Worksheet: Case Pipeline  

---

## Findings + Evidence

VERIFICATION_FINDINGS  
VERIFICATION_EVIDENCE  
→ Worksheets: Findings / Evidence  

---

## Events

VERIFICATION_EVENTS  
→ Worksheet: Events  

---

## Scoring

V_GOVERNANCE_SCORE_CASE  
→ Worksheet: Score Case  

---

## Registry Publish

REGISTRY_SNAPSHOTS  
→ Worksheet: Publish Case  

---

## Public Views

V_REGISTRY_PUBLIC  
→ Derived view (no direct write)  

---

# 🌐 WORKSHEET → UI MAPPING

## Registry Pages

Source:

V_REGISTRY_PUBLIC  

---

## Badge

Source:

V_REGISTRY_PUBLIC  

---

## Verification API

Source:

V_REGISTRY_PUBLIC  

---

## Explorer

Source:

V_REGISTRY_PUBLIC_SEARCH  
V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

# ⚠️ CRITICAL RULES

## DO NOT:

• Write directly to views  
• Modify REGISTRY_SNAPSHOTS  
• Compute scores outside scoring views  
• Expose private evidence in public views  

---

## ALWAYS:

• Use views as API source  
• Keep logic in Snowflake  
• Maintain append-only registry  

---

# 🧠 DESIGN PRINCIPLE

Snowflake is:

The **deterministic engine of truth**

Everything else is:

A projection of that truth

---

# 🚀 NEXT SNOWFLAKE WORK

## 1. Certification Enrichment

• Improve country normalization  
• Improve organization mapping  

---

## 2. Scoring Expansion

• Add more governance dimensions  
• Expand enterprise scoring  

---

## 3. Registry Optimization

• Performance tuning  
• Indexing strategies  

---

## 4. Explorer Data Layer

• Aggregation views  
• Metrics views  

---

# END OF SNOWFLAKE WORKSHEET MAPPING