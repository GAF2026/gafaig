# CURRENT_FOCUS.md
Last Updated: 2026-04-24

## PURPOSE
Defines the exact execution focus for GAFAIG with zero ambiguity.

No theory.
No re-architecture.
No drift.

---

## CURRENT SYSTEM POSITION

GAFAIG is in **production trust distribution phase**.

✔ Snowflake canonical pipeline complete  
✔ Registry snapshots working  
✔ Verification + signature system working  
✔ Phase 6 record model aligned (Snowflake → API → SDK → UI)  
✔ Badge API working  
✔ SDK working externally  
✔ Verification modal working externally  
✔ Production endpoints verified  

---

## 🔴 IMMEDIATE BLOCKER (STILL VALID — DO NOT SKIP)

### Fix Snowflake Run Order Failures

Files:
- 12_TABLES_PARTICIPANTS.sql  
- 15_TABLES_EVENTS.sql  

Why:
- Break deterministic rebuilds  
- Risk silent data corruption  

👉 MUST be fixed before any full rebuild.

---

## 🔑 CRITICAL RULE (LOCKED)

### ID PARITY RULE

All IDs:
- Generated ONLY in Snowflake  
- Never generated in API/UI/SDK  
- Passed through unchanged  

Violation = system corruption.

---

## 🎯 PRIMARY EXECUTION TARGET

# Phase 8 — Trust Surface Hardening + Production Lock

---

## EXECUTION PLAN (STRICT ORDER)

### STEP 1 — BADGE HARDENING

File:
public/sdk/gafaig.js

Objective:
- Badge must ALWAYS reflect:
  - lifecycleStatus
  - badgeEligible

Must:
- degrade to "Unavailable" if invalid
- never show Certified incorrectly

---

### STEP 2 — MODAL HARDENING

File:
public/widget/gafaig-verify.js

Objective:
- Modal must:
  - always load verify endpoint
  - never rely on badge data
  - fail safely if API fails

Add:
- loading state
- error state
- fallback messaging

---

### STEP 3 — SDK FAILURE HANDLING

File:
public/sdk/gafaig.js

Objective:
Handle:
- network failure
- invalid JSON
- missing fields

Must:
- never crash page
- return safe error object

---

### STEP 4 — VERIFY API LOCK

File:
app/api/verify/[registryId]/route.ts

Objective:
- Lock response contract

Must:
- always return:
  - record (full Phase 6)
  - proof
  - messageString

Must NOT:
- change field names
- remove fields

---

### STEP 5 — BADGE API LOCK

File:
app/api/badge/[registryId]/route.ts

Objective:
- Lock response contract

Must:
- respect lifecycleStatus
- respect badgeEligible

Must NOT:
- guess status
- override Snowflake truth

---

### STEP 6 — WIDGET FAIL-SAFE UX

File:
public/widget/gafaig.js (or equivalent)

Objective:
- If API fails:
  show:
  "Verification unavailable"

NOT:
- blank state
- broken UI

---

## 🧠 SYSTEM THINKING (LOCKED)

GAFAIG is:

- a verification system  
- a registry of certified records  
- a cryptographic trust layer  
- a Snowflake execution engine  

---

## 🔐 TRUST MODEL (LOCKED)

Trust comes from:

- Snowflake record  
- Signed payload  
- Public key verification  

NOT from:

- UI  
- SDK  
- badge  
- widget  

---

## ⚠️ DO NOT BREAK

- No computation outside Snowflake  
- No lifecycle logic outside Snowflake  
- No certification logic outside Snowflake  
- No ID generation outside Snowflake  
- Do not modify signed payload structure  

---

## 🧪 TEST (MANDATORY)

Test:

External page:
- badge loads
- modal opens
- SDK returns JSON

Verify page:
- signature valid
- payload verified

API:
- /api/badge/{id}
- /api/verify/{id}

---

## 🚀 DEPLOY FLOW

git add .
git commit -m "Phase 8: <description>"
git push origin main

---

## 📍 CURRENT STATE SUMMARY

✔ System aligned  
✔ External trust working  
✔ Production endpoints live  

🎯 NEXT FOCUS:

Harden trust surfaces.
Lock contracts.
Eliminate failure modes.

---

FINAL LINE

Do not add features.
Do not redesign.

Stabilize and lock the system.