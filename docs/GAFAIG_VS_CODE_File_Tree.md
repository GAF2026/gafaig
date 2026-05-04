# GAFAIG_VS_CODE_File_Tree.md

Last Updated: 2026-05-04

PURPOSE

This file documents the current VS Code file structure for the GAFAIG platform. It reflects the active Next.js application, API routes, query layer, crypto layer, SDK/widget surfaces, external verification tests, Snowflake SQL coordination files, and documentation files.

This file must remain aligned with:

GitHub repo: GAF2026/gafaig  
Vercel project: gafaig-vercel  
Production domain: https://www.gafaig.com  

Snowflake database: GAFAIG_DB  
Snowflake schema: CORE  

GAFAIG = Global Authority for AI Governance.

GAFAIG is a deterministic Snowflake-executed governance verification system that publishes independently verifiable public certification records.

---

CORE SYSTEM ENFORCEMENT

GAFAIG enforces:

Snowflake = Source of Truth  
API = Pass-through only  
UI = Display only  
Registry = Append-only  
IDs = Generated only in Snowflake  

Violation of these rules creates system drift and can corrupt the public trust layer.

---

REGISTRY IMMUTABILITY RULE

The following registry tables are append-only:

CORE.REGISTRY_SNAPSHOTS  
CORE.REGISTRY_AI_SYSTEMS  

Never:

DELETE from registry tables  
INSERT into registry tables directly  
UPDATE registry tables manually  
Mutate published registry snapshots  

Only allowed registry write path:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(...)

Registry state must be reset only through the full canonical rebuild process.

---

SEED FILE RULE

GAFAIG uses exactly ONE canonical seed file only.

Active canonical seed file:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql  

Strict rules:

Do not create additional seed files  
Do not split seed logic  
Do not create expansion seed files  
Do not create parallel seed systems  

Seed data exists only to:

Test pipeline  
Populate UI  
Validate registry / verify / widget / SDK  

---

ROOT STRUCTURE

gafaig/
├── app/
├── components/
├── lib/
├── types/
├── public/
├── docs/
├── external-tests/
├── styles/
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md

---

APP DIRECTORY (NEXT.JS APP ROUTER)

app/

Structure:

├── layout.tsx  
├── globals.css  
├── page.tsx  
├── mission/  
├── framework/  
├── developers/  
├── public-key/  
├── registry/  
├── explorer/  
├── verify/  
├── widget-preview/  
├── badge-preview/  
├── badge/  
├── demo/  
├── certification/  
│ ├── page.tsx  
│ ├── apply/  
│ └── renewal/  
├── apply/  
│ ├── page.tsx  
│ └── ApplyForm.tsx  
├── admin/  
├── api/  

---

HOMEPAGE

app/page.tsx

Current state:

✔ Messaging aligned to GAFAIG identity  
✔ Eyebrow: Global Authority for AI Governance  
✔ Title: AI governance, independently verifiable  
✔ Description aligned to certification + cryptographic proof  
✔ CTA hierarchy:

Start Free Certification  
Verify a Record  
Explore Registry  

✔ Dual audience positioning (organizations + public)  
✔ Production-aligned  

---

CERTIFICATION PAGE

app/certification/page.tsx

Purpose:

Explain certification  
Drive users to /apply  
Explain lifecycle  

Current state:

✔ Structurally complete  
🟡 Requires conversion optimization rewrite  

---

APPLY PAGE

app/apply/page.tsx  
app/apply/ApplyForm.tsx  

Purpose:

Public intake  
Start verification workflow  

Current state:

✔ Functional  
✔ Snowflake-driven ID generation  
✔ Aligned with deterministic pipeline  

Position in funnel:

Homepage → Certification → Apply  

---

REGISTRY (PUBLIC TRUST LAYER)

app/registry/page.tsx

Current state:

✔ PUBLIC CERTIFICATION REGISTRY  
✔ Clean layout aligned to system  
✔ No Application ID exposed  
✔ No Case ID exposed  

Labels:

Verify This Record  
Open Certification Record  
View Proof JSON  

---

REGISTRY DETAIL

app/registry/[registryId]/page.tsx

Current state:

✔ PUBLIC CERTIFICATION RECORD  
✔ Trust surface aligned  

Labels:

Verify This Record  
Open Full Proof Page  
Proof JSON  
Widget Preview  
Proof API  
Certification Record  

✔ No internal IDs exposed  

---

VERIFY TOOL

app/verify/page.tsx  
app/verify/VerifyClient.tsx  

Current state:

✔ Deterministic verification flow  
✔ Uses messageString only  
✔ Loads latest certified record (example)  

Labels:

Verify This Record  
Open full proof page  
View Proof JSON  
Open Certification Record  

---

VERIFY PROOF PAGE

app/verify/[registryId]/page.tsx

Current state:

✔ PUBLIC PROOF RECORD  
✔ Signature validation surface  
✔ Full proof display  

Labels:

View Proof JSON  
Certification Record  
Open Certification Record  
Copy Proof JSON  

✔ No internal IDs exposed  

---

EXPLORER

app/explorer/

Status:

🟡 Restored but requires validation  

Must:

Use CORE.V_REGISTRY_PUBLIC  
Use CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  
Remain null-safe  
Expose no workflow internals  

---

DEVELOPERS PAGE

app/developers/page.tsx

Current state:

✔ SDK-first install model  
✔ Advanced section separated  
✔ Public key button styled correctly  

Must:

Promote SDK as canonical path  
Reinforce messageString verification  
Avoid reconstruction patterns  

---

LIB DIRECTORY

lib/

├── queries/  
│ ├── registry.ts  
│ └── explorer.ts  
├── crypto/  
├── snowflake.ts  
├── auth/  

---

QUERY LAYER

registry.ts → stable  
explorer.ts → must match Snowflake views exactly  

Rules:

No business logic  
No certification derivation  
Pass-through only  

---

API LAYER

app/api/

✔ Fully aligned with Snowflake  
✔ Pass-through only  
✔ No logic  

Routes:

/api/registry  
/api/verify/[registryId]  
/api/badge/[registryId]  
/api/explorer  
/api/.well-known/gafaig-public-key  

---

CRYPTO LAYER

lib/crypto/verify-signing.ts  

✔ Ed25519 signing  
✔ messageString enforced  
✔ External verification validated  

---

TYPES

types/registry.ts  

✔ Public contract enforced  
✔ Proof structure defined  

---

SDK + WIDGET

/public/sdk/gafaig.v1.js  
/public/widget/gafaig-widget.v1.js  

✔ Browser verification  
✔ Fail-closed enforced  
✔ messageString-only validation  

---

EXTERNAL TESTS

external-tests/

verify-gafaig-node.js  
verify-gafaig-python.py  
verify-gafaig-tamper.js  

✔ Signature validation  
✔ Tamper detection  

---

DOCUMENTATION

docs/

MASTER_STATE.md  
CURRENT_FOCUS.md  
ENGINEERING_RULES.md  
GAFAIG_ACTIVE_FILE_MAP.md  
GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md  
GAFAIG_VS_CODE_File_Tree.md  
CANONICAL_RUN_ORDER.md  
VERIFICATION_SIGNATURE_CONTRACT.md  
VERIFIED_DEFINITION.md  
VERSIONING.md  

---

SQL FILES

✔ Canonical pipeline established  
✔ Registry publish enforced  
✔ Decision lifecycle bounded  
✔ Validation runner created  

---

ENVIRONMENT

.env.local  

✔ Snowflake config  
✔ Signing keys  
✔ Runtime variables  

---

DEPLOYMENT

Vercel:

gafaig-vercel  

Production:

https://www.gafaig.com  

Status:

🟢 Deployable  
🟡 Pending Snowflake validation phase  

---

CURRENT STATE SUMMARY

✔ Public pages fully aligned  
✔ Registry + proof + verify consistent  
✔ Widget + SDK operational  
✔ Verification protocol complete  
✔ No internal data leakage  

🟡 Explorer validation pending  
🟡 Snowflake pipeline validation pending  
🟡 Multi-case stress testing pending  

---

END STATE

VS Code layer:

Thin projection layer  
No trust computation  
Fully aligned with Snowflake  

GAFAIG becomes:

Verifiable registry  
Cryptographic trust system  
Production-grade platform  
Global AI governance infrastructure  

---

END OF FILE