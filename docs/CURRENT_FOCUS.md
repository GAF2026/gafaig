# GAFAIG — CURRENT FOCUS
Execution Control Document
Last Updated: 2026-03-24

---

# PRIMARY OBJECTIVE

Complete the transition from:

"Engine exists"

→

"Global Registry is fully populated, consistent, and externally consumable"

---

# CURRENT PHASE

# REGISTRY ENRICHMENT — CERTIFICATION WIRING

This is a **critical stabilization phase**

We are NOT building new features.

We are ensuring:

• registry outputs are complete  
• Snowflake → API → UI alignment is exact  
• certification data is fully resolved  

---

# WHAT IS ALREADY COMPLETE (LOCKED — DO NOT TOUCH)

The following systems are WORKING:

• verification workflow (findings / evidence / events)  
• enterprise scoring engine (deterministic)  
• score snapshot system  
• registry publish procedure (SP_PUBLISH_CASE_TO_REGISTRY_V3)  
• registry snapshot system (append-only)  
• registry ID generation  
• V_REGISTRY_LATEST_APPROVED  
• V_REGISTRY_PUBLIC (base version exists)  
• API /api/registry  
• UI /registry page  
• UI /registry/[registryId] page  

---

# CURRENT PROBLEM (BLOCKING)

The system is failing due to:

## ❌ Missing / incorrect registry fields

Errors observed:

• invalid identifier VALID_FROM  
• invalid identifier LAST_ACTIVITY_AT  

---

# ROOT CAUSE

Mismatch between:

Snowflake view → API → UI

Specifically:

The UI expects **derived certification fields**
that are NOT present in Snowflake views.

---

# REQUIRED FIX STRATEGY (LOCKED)

## DO NOT ADD NEW TABLE COLUMNS

## DO NOT MODIFY PIPELINE

## DO NOT TOUCH ENGINE

---

## FIX MUST BE DONE HERE:

### 1. Snowflake View Layer (PRIMARY)

File:

21_VIEWS_PUBLIC_REGISTRY.sql

We must define derived fields:

---

### REQUIRED DERIVED FIELDS

valid_from =
  CERTIFIED_AT
  OR APPROVED_AT
  OR PUBLISHED_AT

last_activity_at =
  PUBLISHED_AT
  OR CERTIFIED_AT
  OR APPROVED_AT

---

### REQUIRED CERTIFICATION FIELDS

Ensure ALL exist:

• CERTIFIED_SCORE  
• CERTIFIED_TIER  
• CERTIFIED_BAND  
• CERTIFICATION_STATUS  

---

## 2. Query Layer (SECONDARY)

File:

lib/queries/registry.ts

Must:

• STOP referencing non-existent columns  
• ONLY map from existing Snowflake fields  
• derive missing values safely  

---

## 3. API Layer

File:

/api/registry/route.ts

Must:

• pass through normalized query output  
• NOT introduce transformations  

---

## 4. UI Layer

Pages:

/registry  
/registry/[registryId]

Must:

• rely ONLY on query layer  
• NOT assume missing fields  
• gracefully handle null values  

---

# CURRENT EXECUTION ORDER (STRICT)

Follow exactly:

### STEP 1
Fix Snowflake view

### STEP 2
Fix query layer

### STEP 3
Fix API

### STEP 4
Fix UI

### STEP 5
Clear .next and restart dev

---

# TESTING CHECKLIST (MANDATORY)

After each step, test:

---

## API

http://localhost:3000/api/registry?caseId=CASE-0001

Must return:

• ok: true  
• full registry record  
• NO SQL errors  

---

## REGISTRY LIST

http://localhost:3000/registry

Must:

• load without crash  
• show records  
• show score / tier / band  

---

## REGISTRY DETAIL

http://localhost:3000/registry/[registryId]

Must:

• load without crash  
• show certification fields  
• show timestamps  

---

# FAILURE CONDITIONS (DO NOT IGNORE)

If you see:

• SQL compilation error  
• invalid identifier  
• undefined function  
• page crash  

STOP and fix immediately

---

# CRITICAL ENGINEERING RULE

👉 THE VIEW DEFINES THE PLATFORM

Everything must align to:

V_REGISTRY_PUBLIC

---

# SUCCESS DEFINITION

The system is COMPLETE when:

✔ no SQL errors  
✔ no runtime errors  
✔ registry API stable  
✔ registry UI stable  
✔ certification fields visible  
✔ timestamps consistent  

---

# NEXT PHASE (AFTER COMPLETION)

Once stable:

→ Explorer enrichment  
→ AI systems linking  
→ certification verification endpoint hardening  
→ production deployment validation  

---

# FINAL REMINDER

This is NOT a feature phase.

This is a:

# SYSTEM STABILIZATION PHASE

Precision matters more than speed.

---

END OF CURRENT FOCUS