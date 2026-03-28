# GAFAIG — CURRENT FOCUS
Execution Control Document
Last Updated: 2026-03-27

---

# 🎯 PRIMARY OBJECTIVE

Complete transition from:

"System compiles and deploys"

→

"Global AI Governance Registry is fully validated, consistent, and production-grade"

---

# 📍 CURRENT PHASE

Registry Surface Completion → Explorer Validation

(Post-Deployment Stabilization)

---

# ✅ WHAT IS COMPLETE (LOCKED — DO NOT TOUCH)

The following systems are WORKING and must NOT be modified:

• verification workflow (findings / evidence / events)  
• deterministic enterprise scoring engine  
• score snapshot system  
• registry snapshot system (append-only)  
• publish procedure (SP_PUBLISH_CASE_TO_REGISTRY_V3)  
• registry ID reuse logic (no duplicates)  
• V_REGISTRY_LATEST_APPROVED  
• V_REGISTRY_PUBLIC  
• V_REGISTRY_AI_SYSTEMS_PUBLIC  
• registry UI pages  
• badge API (/api/badge/[registryId])  
• verification API (/api/verify/[registryId])  
• Snowflake connection (key-pair auth)  
• Vercel deployment pipeline  

---

# ⚠️ CURRENT REALITY

## SYSTEM STATE

✔ Deploying successfully  
✔ Compiling successfully  
✔ Core registry functioning  
✔ Badge + verification endpoints working  

⚠️ Explorer pages:

• compile successfully  
• NOT fully validated at runtime  
• some pages load, some need testing  

---

# 🔥 CURRENT WORK (ACTIVE)

## 1. Explorer Page Validation (PRIMARY TASK)

Test ALL explorer routes end-to-end:

• /explorer  
• /explorer/countries  
• /explorer/countries/[country]  
• /explorer/map  
• /explorer/organizations  
• /explorer/systems  

For each page confirm:

• loads without error  
• data appears  
• counts are correct  
• links resolve  
• no empty or broken states  

---

## 2. Registry Verification (CRITICAL)

Confirm for known registryId:

• /registry/[registryId] loads  
• /api/badge/[registryId] returns image redirect  
• /api/verify/[registryId] returns signed JSON  

---

## 3. Data Integrity Checks

Verify:

• registryId matches across:
  - REGISTRY_SNAPSHOTS  
  - V_REGISTRY_PUBLIC  
  - UI  

• no duplicate registry IDs  
• publish reuses same ID  
• certified fields populated correctly  

---

# 🧱 CURRENT TECHNICAL STATE

## Snowflake Access Layer

Primary:

sfQuery()

Temporary compatibility layer exists:

• executeQuery  
• snowflakeQuery  
• sfQueryResult  
• snowflakeCtx  

⚠️ These are temporary and should NOT be expanded further

---

## Registry Query Layer

File:

lib/queries/registry.ts  

Current behavior:

• uses REGISTRY_PUBLIC_READTHROUGH  
• ensures stable lookup  

⚠️ Needs future decision:

• keep readthrough  
OR  
• revert to V_REGISTRY_PUBLIC  

---

## Explorer Pages

Recently fixed:

• removed sfQueryResult usage  
• removed .ok / .rows / .error patterns  
• converted to direct sfQuery  

⚠️ Current issue:

• duplicated SQL across pages  
• no shared query layer yet  

---

# ❗ CURRENT RISKS

• explorer pages may silently fail at runtime  
• data aggregation inconsistencies  
• duplicate SQL logic across UI  
• temporary compatibility layer becoming permanent  

---

# 🚫 DO NOT DO

• DO NOT re-architect  
• DO NOT move logic to frontend  
• DO NOT introduce new query abstractions  
• DO NOT change Snowflake views  
• DO NOT modify scoring  
• DO NOT modify publish pipeline  

---

# ▶️ NEXT STEPS (STRICT ORDER)

## STEP 1 — TESTING

User tests all pages listed above

→ Identify which pages fail  
→ Capture exact behavior  

---

## STEP 2 — FIXES

Fix ONLY:

• runtime errors  
• missing data bindings  
• incorrect queries  

NO architectural changes  

---

## STEP 3 — STABILIZATION

Once all pages load correctly:

• confirm consistent data  
• confirm registry linkage  
• confirm explorer aggregation  

---

## STEP 4 — CLEANUP (NEXT PHASE)

After validation:

• remove compatibility exports from snowflake.ts  
• consolidate queries into query layer  
• eliminate duplicated SQL  
• standardize on sfQuery  

---

# 🧠 SUCCESS CRITERIA

System is considered stable when:

✔ all explorer pages load  
✔ registry pages load  
✔ badge + verify APIs work  
✔ no runtime errors  
✔ data is consistent across UI and Snowflake  
✔ no duplicate registry IDs  
✔ publish behaves deterministically  

---

# 🔄 CURRENT STATE SUMMARY

You are NOT building anymore.

You are:

→ validating  
→ stabilizing  
→ confirming correctness  

---

# 🚀 NEXT CHAT START POINT

Continue with:

1. testing explorer pages  
2. reporting which pages fail  
3. fixing issues incrementally  

DO NOT restart architecture  
DO NOT introduce new patterns  

Continue from THIS state exactly.