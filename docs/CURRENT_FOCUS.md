# GAFAIG — CURRENT FOCUS
Execution Control Document
Last Updated: 2026-03-25

---

# PRIMARY OBJECTIVE

Complete the transition from:

"System works internally"

→

"Global registry is authoritative, consistent, and externally trusted"

---

# CURRENT PHASE

Registry Enrichment (Post-Engine Stabilization)

---

# WHAT IS LOCKED (DO NOT TOUCH)

The following systems are COMPLETE and MUST NOT be modified:

• verification workflow (cases → findings → evidence → events)  
• deterministic scoring engine (V_GOVERNANCE_SCORE_CASE)  
• score snapshot system  
• registry publish procedure (SP_PUBLISH_CASE_TO_REGISTRY_V4 / V3 wrapper)  
• registry snapshot table (append-only)  
• V_REGISTRY_LATEST_APPROVED (canonical source of truth)  
• V_REGISTRY_PUBLIC  
• V_REGISTRY_PUBLIC_SEARCH  
• V_REGISTRY_AI_SYSTEMS_PUBLIC  
• query layer (lib/queries)  
• API pass-through architecture  
• public registry UI pages  

---

# CRITICAL SYSTEM RULE

DO NOT:

• re-architect  
• introduce frontend logic  
• duplicate Snowflake logic  
• override engine outputs  
• mutate snapshots  

---

# MAJOR FIX COMPLETED (2026-03-25)

Certification inconsistency resolved.

Previous issue:

• DECISIONS table could override engine tier/band ❌  
• registry showed inconsistent certification outputs ❌  

Resolution:

• ENGINE is now the single source of truth for:
  - score
  - tier
  - band

• DECISIONS now only control:
  - approval status
  - publish authorization

Result:

• deterministic certification  
• no conflicting outputs  
• registry integrity restored  

---

# CURRENT SYSTEM TRUTH MODEL

Certification logic:

IF decision_status IN (approved, published, certified):

→ certified_score = engine score  
→ certified_tier = engine tier  
→ certified_band = engine band  

ELSE:

→ no certification  

---

# ACTIVE DEVELOPMENT AREAS

## 1. EXPLORER DATA INTEGRITY

Ensure Explorer reflects true registry state.

Verify:

• record counts  
• certified vs non-certified  
• country distribution  
• tier distribution  
• band distribution  

Source:

CORE.V_REGISTRY_PUBLIC  
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

---

## 2. REGISTRY DATA COMPLETENESS

Ensure all required fields are consistently populated:

• certifiedScore  
• certifiedTier  
• certifiedBand  
• certifiedAt  
• decisionStatus  
• validFrom  
• validTo  
• country  
• entityType  

---

## 3. COUNTRY NORMALIZATION

Problem:

• inconsistent country values across records  

Goal:

• standardized country mapping  
• consistent explorer grouping  

---

## 4. CERTIFICATION DISTRIBUTION VALIDATION

Ensure:

• tier distribution is meaningful  
• band distribution reflects actual scoring  
• no artificial inflation from legacy data  

---

## 5. VERIFY ENDPOINT VALIDATION

Endpoint:

/api/verify/[registryId]

Must return:

• registryId  
• entity  
• certification status  
• score  
• tier  
• band  
• signed payload  

Goal:

• deterministic verification  
• external trust surface  

---

## 6. UI CONSISTENCY (PUBLIC LAYER)

Ensure all public pages are aligned:

• homepage  
• mission  
• framework  
• demo  
• registry  
• registry detail  
• explorer  

Rules:

• consistent layout  
• consistent typography  
• consistent spacing  
• no page-specific hacks  

---

# VALIDATION CHECKLIST

Before moving forward, confirm:

✔ publish → registry snapshot is correct  
✔ registry view reflects engine outputs  
✔ API returns correct certification data  
✔ UI displays correct certification data  
✔ explorer metrics match registry  

---

# TESTING FLOW

Use canonical test case:

CASE-0001

Steps:

1. Run:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3('CASE-0001');

2. Validate:

SELECT * FROM CORE.V_REGISTRY_PUBLIC WHERE CASE_ID = 'CASE-0001';

3. Check:

/api/registry  
/api/verify/[registryId]  

4. Confirm UI:

/registry  
/registry/[registryId]  
/explorer  

---

# SUCCESS CRITERIA

The system is considered correct when:

• registry shows engine-aligned certification  
• no mismatch between score and tier  
• explorer reflects real data  
• verification endpoint is accurate  
• UI is consistent across all pages  

---

# NEXT PHASE (AFTER COMPLETION)

Global Registry Expansion

• increase dataset coverage  
• onboard real organizations  
• expand AI systems registry  
• enhance explorer analytics  

---

# EXECUTION DIRECTIVE

Continue forward.

Do not revisit completed systems.

Do not introduce new architecture.

Only enrich and validate the registry layer.

---