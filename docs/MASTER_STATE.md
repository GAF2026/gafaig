# GAFAIG — MASTER STATE
Canonical System Definition
Last Updated: 2026-03-22

---

# PLATFORM IDENTITY

GAFAIG — Global AI Governance Registry

GAFAIG is a deterministic AI governance engine + global registry.

It functions as:

• a certification authority  
• a registry of verified AI systems  
• a governance scoring engine  
• a public trust infrastructure layer  

---

# CORE PRINCIPLE

The system is case-driven and append-only.

NOT application-driven.

---

# CANONICAL DATA FLOW (LOCKED)

ALL DATA MUST FOLLOW:

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

# SYSTEM STATUS

## FULL PIPELINE OPERATIONAL

The following is confirmed working end-to-end:

• CASE creation  
• FINDINGS / EVIDENCE / EVENTS ingestion  
• Enterprise scoring engine  
• Score snapshot system  
• Registry publish procedure  
• Registry snapshot system  
• AI systems public view  
• Query layer integration  

---

# SNOWFLAKE ARCHITECTURE

Database: GAFAIG_DB  
Schema: CORE  

---

## CORE TABLES

• APPLICATIONS  
• VERIFICATION_CASES  
• FINDINGS  
• EVIDENCE  
• EVENTS  
• DECISIONS  
• REGISTRY_SNAPSHOTS  
• REGISTRY_AI_SYSTEMS  

---

## CORE PROCEDURES

• SP_SCORE_CASE_ENTERPRISE  
• SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

## CANONICAL VIEWS (SOURCE OF TRUTH)

### V_REGISTRY_LATEST_APPROVED

Guarantees:

• one row per CASE_ID  
• latest snapshot only  
• certification fields derived  

Includes:

• SCORE / TIER / BAND  
• CERTIFIED_SCORE  
• CERTIFIED_TIER  
• CERTIFIED_BAND  
• CERTIFIED_AT  
• DECISION_STATUS  
• RENEWAL_STATUS  

---

### V_REGISTRY_PUBLIC

Thin projection of:

V_REGISTRY_LATEST_APPROVED  

---

### V_REGISTRY_AI_SYSTEMS_PUBLIC

Joins:

REGISTRY_AI_SYSTEMS → V_REGISTRY_LATEST_APPROVED  

Guarantees:

• one row per AI system  
• registry-linked certification  
• no UPDATED_AT dependency  
• safe null handling  

Includes:

• SYSTEM metadata  
• ENTITY / ORG  
• SCORE / TIER / BAND  
• CERTIFIED_* fields  
• DECISION_STATUS  
• RENEWAL_STATUS  

---

# CERTIFICATION CONTRACT (LOCKED)

The following fields define trust:

CERTIFIED_SCORE  
CERTIFIED_TIER  
CERTIFIED_BAND  
CERTIFIED_AT  
DECISION_STATUS  
RENEWAL_STATUS  

These must:

• originate from REGISTRY_SNAPSHOTS  
• flow through V_REGISTRY_LATEST_APPROVED  
• propagate into AI SYSTEMS view  
• be consumed by UI  

---

# QUERY LAYER (NEXT.JS)

Location:

/lib/queries/

File:

registry-ai-systems.ts  

---

## CURRENT ISSUE (CRITICAL)

The query layer is incorrectly mapped:

certifiedTier → r.TIER  
certifiedBand → r.BAND  
certifiedScore → r.SCORE  
certifiedAt → null  
decisionStatus → null  

---

## REQUIRED FIX (NEXT STEP)

Must map:

certifiedTier → r.CERTIFIED_TIER  
certifiedBand → r.CERTIFIED_BAND  
certifiedScore → r.CERTIFIED_SCORE  
certifiedAt → r.CERTIFIED_AT  
decisionStatus → r.DECISION_STATUS  

---

# FRONTEND ROUTES

Public Registry:

/registry/ai-systems  
/registry/ai-systems/[registryId]  

Current state:

• data loads  
• certification not displayed correctly  

---

# CURRENT PHASE

REGISTRY SURFACE COMPLETION  

Transition:

Engine works → Registry is visible, trusted, and consumable  

---

# IMMEDIATE NEXT STEPS

1. FIX QUERY LAYER  
Update registry-ai-systems.ts to use CERTIFIED_* fields  

2. UPDATE UI  
Show certification fields in:

/registry/ai-systems  
/registry/ai-systems/[registryId]  

3. VERIFY FLOW  
Confirm:

score → snapshot → registry → AI systems → UI  

4. DEPLOY  
Push to Vercel after UI reflects certification  

---

# ENGINEERING RULES

DO NOT:

• re-architect pipeline  
• modify core flow  
• introduce new scoring logic  
• use APPLICATIONS as source of truth  

ALWAYS:

• treat views as contract  
• propagate fields forward  
• maintain append-only integrity  

---

# IMPORTANT DISCOVERY

Snowflake worksheets may retain:

• hidden compiled state  
• stale column references  

Example error:

invalid identifier 'UPDATED_AT'  

Resolution:

• do not reuse corrupted worksheets  
• use clean execution files  
• treat run scripts as disposable  

---

# EXECUTION SCRIPT POLICY

Files like:

99_RUN_PIPELINE.sql  

Are:

• not canonical  
• not trusted  
• manual only  

---

# SYSTEM STATE SUMMARY

✔ Governance engine working  
✔ Registry snapshot system working  
✔ Public registry views stable  
✔ AI systems view stable  
✔ Certification fields flowing  

⚠ UI not yet reflecting certification  

---

# NEXT CHAT START POINT

Continue from:

"Fix query layer and surface certification in UI"

---

# END STATE TARGET

GAFAIG becomes:

• global AI certification registry  
• publicly queryable trust layer  
• deterministic governance system  

---

END OF FILE