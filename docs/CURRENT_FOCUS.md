# CURRENT_FOCUS.md

Last Updated: 2026-05-04

PURPOSE

This document defines the exact execution focus for GAFAIG (Global Authority for AI Governance) with zero ambiguity.

This document enforces:

Strict phase gating  
No re-architecture  
No drift  
No speculative work  

This document reflects ONLY what must be done next.

No theory.  
No abstraction.  
Execution only.  

---

CURRENT SYSTEM POSITION

GAFAIG is in:

Build Completion → Snowflake Validation → Pre-Distribution Readiness  

The system is functionally complete at the architectural level and has transitioned into:

Validation  
Hardening  
Contract lock  

---

WHAT IS WORKING

SNOWFLAKE

✔ Core tables established  
✔ Canonical pipeline defined  

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ DECISION  
→ REGISTRY  

✔ Registry snapshots working  
✔ Append-only enforcement working  
✔ Decision lifecycle implemented (VALID_FROM / VALID_TO)  
✔ CORE.V_REGISTRY_PUBLIC aligned to bounded validity  
✔ CORE.V_CASE_RENEWAL_STATUS working  
✔ SP_PUBLISH_CASE_TO_REGISTRY_V3 working  
✔ Deterministic payload foundation for messageString  

---

API

✔ /api/verify working  
✔ Ed25519 signing working  
✔ messageString contract enforced  
✔ Public key endpoint working  
✔ CORS enabled  

✔ /api/registry working  
✔ /api/search working  
✔ /api/badge working  

✔ API is pass-through only  

---

SDK / WIDGET

✔ SDK working externally  
✔ Widget rendering working  
✔ Widget verification working  
✔ Browser-side verification working  
✔ Fail-closed behavior implemented  
✔ CTA standardized: “Verify This Record”  

---

UI

✔ /registry page working  
✔ /registry/[registryId] working  
✔ /verify page working  
✔ /verify/[registryId] proof page working  
✔ /developers page aligned  
✔ Public terminology aligned  

✔ No Application ID exposed  
✔ No Case ID exposed  

---

CRYPTOGRAPHIC TRUST LAYER

✔ Fully operational  
✔ messageString deterministic  
✔ Signature validation reproducible  
✔ External verification passing (Node + Python)  
✔ Tamper test passing  

---

PRODUCTION

✔ Deployment working  
✔ Endpoints verified  
✔ Public key endpoint live  
✔ Widget functioning off-domain  

---

🟡 LOCAL (NOT DEPLOYED)

Homepage conversion improvements  
Explorer fixes (pending validation)  

---

🔴 IMMEDIATE BLOCKER — STEP ZERO (MANDATORY)

Fix Snowflake Run Order Failures

Files:

12_TABLES_PARTICIPANTS.sql  
15_TABLES_EVENTS.sql  

Impact:

Break deterministic rebuild  
Block full pipeline validation  
Risk silent corruption  

RULE:

This must be fixed BEFORE ANY further pipeline validation  

---

🔴 CURRENT BLOCKER — FINDINGS PIPELINE

Symptoms:

Findings count = 0 in admin UI  

Possible causes:

API route not returning inserted rows  
UI referencing outdated endpoint  
CaseId mismatch  
State not refreshing after POST  

Required outcome:

Finding created in Snowflake  
API returns inserted row  
UI reflects correct count  

RULE:

Findings pipeline must be fully operational before scoring validation  

---

🔴 CURRENT BLOCKER — EXPLORER (DEPLOYMENT BLOCKER)

Symptoms:

/explorer page fails  
Next.js build fails  
Production deployment blocked  

Root cause:

lib/queries/explorer.ts contract drift  
Missing exports  
Type mismatch with UI  
Mismatch with Snowflake public views  

Impact:

Explorer unavailable  
Homepage cannot be deployed  
Public trust surface incomplete  

Required action:

Restore full explorer query contract  

Ensure exports exist:

getExplorerData  
getExplorerCountries  
getExplorerOrganizations  
getExplorerSystems  

Ensure queries read ONLY from:

CORE.V_REGISTRY_PUBLIC  
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

RULE:

No scoring  
No private data  
No internal workflow exposure  

---

🔴 ACTIVE RISK — SCORE DEPENDENCY LEAK

Symptoms:

Rebuild failure referencing SCORE  

Likely cause:

View referencing:

SCORE  
V_CASE_SCORE_ENTERPRISE  
V_PUBLIC_OVERSIGHT_SIGNAL  

Required action:

Remove ALL score dependencies from public views  

RULE:

Score is PRIVATE  
Public views must NEVER depend on score  

---

🔑 CRITICAL RULE (LOCKED)

ID PARITY RULE

All IDs must be:

Generated ONLY in Snowflake  
Never generated in API/UI/SDK  
Passed through unchanged  

Applies to:

APPLICATION_ID  
CASE_ID  
REGISTRY_ID  
FINDING_ID  
EVIDENCE_ID  
EVENT_ID  

Violation = system corruption  

---

🔐 GLOBAL TRUST INVARIANTS (LOCKED)

These MUST be enforced during all work:

Verification MUST use proof.messageString only  
Verification MUST NOT use JSON fields  
Verification MUST NOT reconstruct payloads  
Field order MUST remain deterministic  
Signature validates authenticity  
Lifecycle defines trust state  
ANY failure → NOT TRUSTED  
Widgets MUST fail closed  

---

🎯 PRIMARY EXECUTION TARGET

Complete:

Snowflake Validation Phase  

Then:

System Hardening  
Contract Lock  
Production Stability  

Then ONLY:

Distribution Activation  

---

EXECUTION PLAN (STRICT ORDER)

STEP 0 — FIX SNOWFLAKE RUN ORDER  

Files:

12_TABLES_PARTICIPANTS.sql  
15_TABLES_EVENTS.sql  

Objective:

Restore deterministic rebuild  

---

STEP 1 — VALIDATE CORE PIPELINE  

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  

Ensure:

All joins valid  
No orphaned records  
All IDs consistent  

---

STEP 2 — FIX FINDINGS PIPELINE  

Ensure:

Insert → API → UI flow working  

---

STEP 3 — RESTORE EXPLORER  

Fix:

Query layer  
API route  
UI pages  

Unblock deployment  

---

STEP 4 — VALIDATE SCORING  

Ensure:

CORE.V_GOVERNANCE_SCORE_CASE correct  
Snapshots created correctly  

---

STEP 5 — VALIDATE DECISIONS  

Ensure:

VALID_FROM / VALID_TO correct  
No overlap  
Correct lifecycle states  

---

STEP 6 — VALIDATE REGISTRY  

Ensure:

Append-only  
Correct publish behavior  
Correct snapshot linkage  

---

STEP 7 — VALIDATE PUBLIC VIEWS  

CORE.V_REGISTRY_PUBLIC  
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

Ensure:

One row per CASE_ID  
No score leakage  
Correct contract  

---

STEP 8 — VALIDATE API  

Ensure:

Pass-through only  
No recomputation  
Correct mapping  

---

STEP 9 — VALIDATE SDK / WIDGET  

Ensure:

Fail-closed  
Correct verification  
No trust computation  

---

STEP 10 — RUN CANONICAL VALIDATION RUNNER  

File:

99_RUN_CANONICAL_PIPELINE.sql  

Ensure:

Full system integrity  
No drift  

---

🧠 SYSTEM THINKING (LOCKED)

GAFAIG is:

A verification system  
A registry  
A cryptographic trust layer  
A Snowflake execution engine  

---

🔐 TRUST MODEL (LOCKED)

Trust comes from:

Snowflake record  
messageString  
signature  
public key  

NOT from:

UI  
SDK  
badge  
widget  

---

⚠️ DO NOT BREAK

No computation outside Snowflake  
No lifecycle logic outside Snowflake  
No certification logic outside Snowflake  
No ID generation outside Snowflake  
Do not modify signed payload structure  
Do not change messageString format  
Do not verify from JSON  

---

🧪 TEST (MANDATORY)

Explorer:

/explorer loads  
countries page loads  
organizations page loads  
systems page loads  

Verify:

Signature validation works  
messageString used only  

---

🚀 DEPLOY FLOW (BLOCKED UNTIL EXPLORER FIX)

git add .  
git commit -m "Explorer fix + validation alignment"  
git push origin main  
vercel --prod  

---

📍 CURRENT STATE SUMMARY

✔ Core system architecture complete  
✔ Verification protocol complete  
✔ SDK + UI aligned  
✔ Public trust layer operational  

🔴 Snowflake run-order fix required  
🔴 Findings pipeline issue active  
🔴 Explorer broken (deployment blocker)  
🔴 Score dependency leak risk  

---

🚫 DISTRIBUTION PLAN STATUS (LOCKED)

Distribution plan EXISTS  
Distribution is NOT ACTIVE  

Activation requires:

✔ Explorer working  
✔ Full system validated  
✔ Seed dataset stable  
✔ UI polished  
✔ Production stable  

---

🚀 FUTURE PHASE (LOCKED — DO NOT START)

30-DAY EXECUTION PLAN (POST-BUILD)

Goal:

Onboard first 5 organizations  

Strategy:

Free certification  
Real records  
Public proof  

Channels:

LinkedIn  
Direct outreach  
Developer API  

---

🎯 NEXT FOCUS

Fix Snowflake run order  
Fix findings pipeline  
Fix explorer  
Validate system  
Stabilize platform  

ONLY THEN:

Deploy homepage  
Activate distribution  

---

FINAL LINE

Do not start outreach.  
Do not start promotion.  

Finish the system.

END OF FILE