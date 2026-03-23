# GAFAIG — PROJECT INDEX
Canonical File & System Map
Last Updated: 2026-03-22

---

# PURPOSE

This document provides a **complete map of the GAFAIG system**:

• where logic lives  
• which files are canonical  
• how components connect  
• what each file is responsible for  

This prevents:

• file confusion  
• duplicate logic  
• AI hallucinated paths  
• circular debugging  

---

# SYSTEM OVERVIEW

GAFAIG consists of:

1. Snowflake (deterministic governance engine)  
2. Query Layer (Next.js server functions)  
3. UI (Next.js App Router)  
4. Execution Scripts (manual testing only)  

---

# CORE DATA FLOW

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

# SNOWFLAKE FILES (CANONICAL)

## 🔵 SCORING

### File:
24_SP_SCORE_CASE_ENTERPRISE.sql  

### Contains:
SP_SCORE_CASE_ENTERPRISE  

### Purpose:
• calculates governance score  
• generates score snapshot inputs  
• deterministic scoring engine  

---

## 🔵 REGISTRY PUBLISH

### File:
25_PROCEDURES_APPROVAL.sql  

### Contains:
SP_PUBLISH_CASE_TO_REGISTRY_V3  

### Purpose:
• validates case approval  
• reads governance score  
• creates REGISTRY_SNAPSHOTS row  
• generates REGISTRY_ID  
• links REGISTRY_AI_SYSTEMS  

---

## 🔵 PUBLIC REGISTRY VIEWS

### File:
21_VIEWS_PUBLIC_REGISTRY.sql  

### Contains:

• V_REGISTRY_LATEST_APPROVED  
• V_REGISTRY_PUBLIC  
• V_REGISTRY_EXPORT_V1  

### Purpose:

V_REGISTRY_LATEST_APPROVED  
→ canonical registry state (1 row per case)

V_REGISTRY_PUBLIC  
→ public registry projection

V_REGISTRY_EXPORT_V1  
→ export-compatible dataset  

---

## 🔵 AI SYSTEMS VIEW

### File:
22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

### Contains:
V_REGISTRY_AI_SYSTEMS_PUBLIC  

### Purpose:

• joins AI systems to registry  
• exposes certification fields  
• provides UI-ready dataset  

---

# SNOWFLAKE TABLES (CORE)

• APPLICATIONS  
• VERIFICATION_CASES  
• FINDINGS  
• EVIDENCE  
• EVENTS  
• DECISIONS  
• REGISTRY_SNAPSHOTS  
• REGISTRY_AI_SYSTEMS  

---

# QUERY LAYER (NEXT.JS)

Location:

/lib/queries/

---

## 🔵 AI SYSTEMS QUERY

### File:
lib/queries/registry-ai-systems.ts  

### Functions:

• getRegistryAiSystemsPaginated()  
• getRegistryAiSystemsFilterOptions()  
• getRegistryAiSystemsSummaryStats()  

### Current Issue:

Incorrect mapping:

certifiedTier → r.TIER  
certifiedBand → r.BAND  
certifiedScore → r.SCORE  

### Required Fix:

certifiedTier → r.CERTIFIED_TIER  
certifiedBand → r.CERTIFIED_BAND  
certifiedScore → r.CERTIFIED_SCORE  
certifiedAt → r.CERTIFIED_AT  
decisionStatus → r.DECISION_STATUS  

---

# FRONTEND (NEXT.JS APP ROUTER)

Location:

/app/

---

## 🔵 PUBLIC REGISTRY LIST

Route:

/registry/ai-systems  

### Purpose:

• display all certified AI systems  
• filter / search capability  

---

## 🔵 PUBLIC REGISTRY DETAIL

Route:

/registry/ai-systems/[registryId]  

### Purpose:

• display system-level certification  
• show governance metadata  

---

## 🔵 ADMIN

Route:

/admin/  

### Key Pages:

• /admin/applications  
• /admin/verification/[caseId]  

---

# EXECUTION FILES (NON-CANONICAL)

## 🔴 RUN PIPELINE

Example:

99_RUN_PIPELINE.sql  

### Purpose:

• manual execution  
• debugging  
• validation  

### Rule:

NOT part of system logic  
May be deleted or recreated  

---

# FILE RESPONSIBILITY SUMMARY

| Layer        | File                                  | Responsibility |
|-------------|----------------------------------------|---------------|
| Scoring      | 24_SP_SCORE_CASE_ENTERPRISE.sql       | Score engine |
| Publish      | 25_PROCEDURES_APPROVAL.sql            | Registry write |
| Registry     | 21_VIEWS_PUBLIC_REGISTRY.sql          | Canonical registry state |
| AI Systems   | 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql | Public system surface |
| Query Layer  | registry-ai-systems.ts               | Data mapping to UI |
| UI           | /registry pages                      | Display only |

---

# CURRENT STATE

✔ Pipeline working  
✔ Registry publish working  
✔ Views stable  
✔ AI systems view stable  
✔ Certification fields present  

⚠ Query layer incorrect  
⚠ UI not showing certification correctly  

---

# NEXT TASK MAP

1. Fix query layer mappings  
2. Update UI to display certification  
3. Validate full flow  
4. Deploy to Vercel  

---

# NAVIGATION GUIDE

When debugging:

• registry data → V_REGISTRY_LATEST_APPROVED  
• system-level data → V_REGISTRY_AI_SYSTEMS_PUBLIC  
• scoring → SP_SCORE_CASE_ENTERPRISE  
• publish → SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

# CRITICAL RULE

If unsure:

→ trace data flow  
→ find correct view  
→ do not guess  

---

# END OF FILE