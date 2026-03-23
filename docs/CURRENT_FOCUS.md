# GAFAIG — CURRENT FOCUS
Execution Control Document
Last Updated: 2026-03-22

---

# PRIMARY OBJECTIVE

Transition from:

"Engine exists and works"

→

"Global AI Registry is visible, trusted, and consumable"

---

# CURRENT PHASE

REGISTRY SURFACE COMPLETION

(Post-Engine Stabilization)

---

# WHAT IS COMPLETE (LOCKED — DO NOT TOUCH)

The following systems are WORKING and must NOT be modified:

• verification workflow (findings / evidence / events)  
• enterprise scoring engine (SP_SCORE_CASE_ENTERPRISE)  
• score snapshot system  
• registry publish procedure (SP_PUBLISH_CASE_TO_REGISTRY_V3)  
• registry snapshot system (REGISTRY_SNAPSHOTS)  
• V_REGISTRY_LATEST_APPROVED (canonical registry source)  
• V_REGISTRY_PUBLIC  
• V_REGISTRY_AI_SYSTEMS_PUBLIC  
• AI systems registry base query  
• /registry/ai-systems page loads  
• query registry layer structure  

---

# CRITICAL RULE

DO NOT:

• re-architect the platform  
• modify scoring logic  
• change snapshot behavior  
• rewrite working views  
• introduce new pipeline paths  

ALL WORK MUST:

• build forward from existing architecture  
• preserve deterministic flow  
• respect canonical views  

---

# CURRENT GAP (WHAT IS BROKEN)

The platform works end-to-end, BUT:

Certification data is NOT correctly surfaced in the UI.

Specifically:

• certifiedTier is mapped incorrectly  
• certifiedBand is mapped incorrectly  
• certifiedScore is mapped incorrectly  
• certifiedAt is missing  
• decisionStatus is missing  

The UI is showing:

→ SCORE / TIER / BAND  

Instead of:

→ CERTIFIED_* fields  

---

# ROOT CAUSE

Query layer is incorrectly mapped:

registry-ai-systems.ts is using:

r.TIER  
r.BAND  
r.SCORE  

Instead of:

r.CERTIFIED_TIER  
r.CERTIFIED_BAND  
r.CERTIFIED_SCORE  
r.CERTIFIED_AT  
r.DECISION_STATUS  

---

# ACTIVE TASK

## FIX QUERY LAYER (CRITICAL)

File:

lib/queries/registry-ai-systems.ts  

Must update mapping to:

certifiedTier → r.CERTIFIED_TIER  
certifiedBand → r.CERTIFIED_BAND  
certifiedScore → r.CERTIFIED_SCORE  
certifiedAt → r.CERTIFIED_AT  
decisionStatus → r.DECISION_STATUS  

---

# NEXT TASKS (ORDERED)

## 1. Fix Query Layer
Ensure UI receives correct certification data

---

## 2. Update Registry List Page

Route:

/registry/ai-systems  

Add:

• Certified Tier  
• Certified Band  
• Certified Score  
• Decision Status  

---

## 3. Update System Detail Page

Route:

/registry/ai-systems/[registryId]  

Add:

• Certification timestamp  
• Certification breakdown  
• Decision status  

---

## 4. Validate End-to-End Flow

Confirm:

CASE → SCORE → SNAPSHOT → REGISTRY → AI SYSTEMS → UI  

---

## 5. Deploy

Push to Vercel AFTER:

• query layer fixed  
• UI reflects certification  

---

# SUCCESS CRITERIA

The phase is complete when:

• certification fields display correctly in UI  
• registry pages reflect certified state  
• no fallback to raw SCORE/TIER/BAND  
• system is publicly interpretable  

---

# IMPORTANT CONTEXT

## Certification vs Raw Score

Raw fields:

• SCORE  
• TIER  
• BAND  

Certified fields (authoritative):

• CERTIFIED_SCORE  
• CERTIFIED_TIER  
• CERTIFIED_BAND  
• CERTIFIED_AT  
• DECISION_STATUS  

UI MUST use certified fields only.

---

# EXECUTION DISCIPLINE

• Always test via V_REGISTRY_AI_SYSTEMS_PUBLIC  
• Never query tables directly in UI  
• Never infer certification in frontend  
• Always trust Snowflake views  

---

# BLOCKERS

None.

System is stable.

---

# NEXT CHAT START POINT

"Fix query layer and surface certification in UI"

---

END OF FILE