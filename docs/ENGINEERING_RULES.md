# GAFAIG — ENGINEERING RULES
Development Standards for Snowflake + Next.js + Registry Architecture

Last Updated: 2026-03-19

This document defines the engineering rules for the GAFAIG platform.

These rules ensure:

• deterministic governance verification  
• consistent data contracts across system layers  
• safe registry publication  
• predictable AI-assisted development  
• architecture continuity across chats and contributors  

These rules apply to all development work performed on the platform.

For platform architecture see:

docs/MASTER_STATE.md

For repository navigation see:

docs/PROJECT_INDEX.md

For current milestone see:

docs/CURRENT_FOCUS.md

---

# Core Principle

GAFAIG operates as deterministic trust infrastructure.

This means:

• governance scoring must be reproducible  
• registry outputs must be verifiable  
• identifiers must be deterministic  
• private evidence must remain protected  
• public surfaces must expose only controlled disclosures  

The platform is verification infrastructure — not a typical web application.

---

# Rule 1 — Snowflake Is the Source of Truth

All verification data originates in Snowflake.

Snowflake is authoritative for:

• verification cases  
• findings  
• evidence  
• events  
• scoring logic  
• scoring outputs  
• snapshots  
• registry publication  
• public registry views  
• AI systems registry views  
• admin intake views  

Application code must NEVER replicate scoring logic.

Schema:

GAFAIG_DB.CORE

---

# Rule 2 — Case-First Architecture (CRITICAL)

Canonical flow:

CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → SNAPSHOT → REGISTRY → AI SYSTEMS

IMPORTANT:

• VERIFICATION_CASES is the root object  
• all scoring originates from CASE_ID  
• applications are intake only  
• admin intake does NOT replace case workflow  
• application → case automation is NOT canonical  

Never bypass the case workflow.

---

# Rule 3 — Enterprise Scoring Engine Only

The ONLY valid scoring system is:

Enterprise Governance Scoring v1.0

Canonical objects:

• V_CASE_SCORE_ENTERPRISE  
• V_CASE_TIER_BAND  
• V_CASE_RENEWAL_STATUS  
• SP_SCORE_CASE_ENTERPRISE  

DO NOT USE:

• legacy scoring views  
• ad hoc calculations  
• frontend scoring logic  

---

# Rule 4 — Deterministic Scoring Is Mandatory

Given identical inputs, scoring must produce identical outputs.

Inputs:

• findings  
• evidence  
• evidence summaries  
• events  

Outputs:

• score  
• tier  
• band  
• renewal status  

Snapshots must persist results in:

CORE.CASE_SCORE_SNAPSHOTS_V2

No scoring in UI or API.

---

# Rule 5 — Snapshot-Based Registry Only

Registry pipeline:

CASE  
→ SCORE  
→ SNAPSHOT  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEW  

Publishing must use:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

NEVER:

• insert directly into registry tables  
• fabricate registry records  

---

# Rule 6 — Public Data Must Originate from Snapshots

Valid flow:

CASE → SNAPSHOT → REGISTRY → VIEW

Key views:

• V_REGISTRY_LATEST_APPROVED  
• V_REGISTRY_PUBLIC  
• V_PUBLIC_REGISTRY  
• V_PUBLIC_OVERSIGHT_SIGNAL  

If data bypasses snapshots, it is invalid.

---

# Rule 7 — AI Systems Must Align with Registry

AI systems must be linked to:

CASE_ID → REGISTRY_ID → PUBLIC REGISTRY

View:

• V_REGISTRY_AI_SYSTEMS_PUBLIC  

DO NOT:

• create orphan systems  
• insert systems without registry linkage  
• assume system metadata fields without verifying view schema  

---

# Rule 8 — Query Registry Is Mandatory

Location:

lib/queries/

Rules:

• all SQL must live in query layer  
• UI must NEVER contain SQL  
• API must call query functions OR canonical SQL (transitional only)  
• eliminate duplicate SQL across routes  

Purpose:

• prevent SQL duplication  
• eliminate drift  
• stabilize AI-assisted development  

---

# Rule 9 — View Purity Rule (CRITICAL)

SQL view files must contain ONLY:

• CREATE VIEW  
• GRANTS  

They must NOT contain:

• INSERT  
• UPDATE  
• DELETE  
• SELECT test queries  

This ensures:

• deterministic deployments  
• safe rebuilds  
• no hidden side effects  

---

# Rule 10 — Use Views, Not Tables

UI and API must read from views.

Views enforce:

• stable schema  
• access control  
• public-safe filtering  

Tables are storage only.

---

# Rule 11 — UI Must Never Use Raw Snowflake Rows

Data flow:

Snowflake View  
→ Query Layer / API  
→ TypeScript Mapping  
→ UI  

Never expose raw Snowflake column names.

---

# Rule 12 — Explicit Column Mapping Required

Snowflake: UPPERCASE  
Frontend: camelCase  

Example:

REGISTRY_ID → registryId  
SYSTEM_ID → systemId  
CASE_ID → caseId  

Always map explicitly.

---

# Rule 13 — ID Normalization Is Required

All joins must normalize identifiers:

TRIM()  
UPPER()

Example:

TRIM(UPPER(a.CASE_ID)) = TRIM(UPPER(b.CASE_ID))

Prevents silent failures.

---

# Rule 14 — Dual Evidence Mapping Must Be Maintained

Tables:

• VERIFICATION_FINDING_EVIDENCE  
• FINDING_EVIDENCE_MAP  

Rule:

• write to both  
• do not consolidate yet  

---

# Rule 15 — Public Surfaces Must Be Safe

Public routes:

/registry  
/registry/ai-systems  
/api/registry  
/api/verify/[registryId]  

Must NOT expose:

• evidence  
• findings  
• internal scoring logic  
• reviewer notes  

Only expose:

• approved registry data  
• oversight signal outputs  

---

# Rule 16 — Admin Surfaces Must Be Protected

Routes:

/admin/*  
/api/admin/*  

Require authentication.

Never expose:

• credentials  
• internal Snowflake structures  
• privileged data  

Admin surfaces include:

• /admin/applications  

---

# Rule 17 — Admin Intake Is NOT the Core Engine

Admin intake (applications) is:

• a reviewer workflow surface  
• a staging layer  

It is NOT:

• the governance engine  
• a registry source  

Constraints:

• must read from V_ADMIN_SUBMISSIONS  
• must not publish directly to registry  
• must not bypass scoring pipeline  

---

# Rule 18 — Deterministic Identifiers Only

Identifiers:

CASE_ID  
FINDING_ID  
EVIDENCE_ID  
SNAPSHOT_ID  
REGISTRY_ID  
SYSTEM_ID  
REQUEST_ID  

Defined in:

types/ids.ts  

Do not mutate identifiers in UI or API.

---

# Rule 19 — Environment Variables Only

Secrets must use:

.env.local  
Vercel environment config  

Never hardcode:

• database credentials  
• API keys  
• tokens  

---

# Rule 20 — Full Pipeline Validation Required

Every change must validate:

1. Snowflake logic  
2. snapshot created  
3. registry snapshot created  
4. public view resolves  
5. query/API layer returns correct data  
6. UI renders correctly  
7. production behaves identically to local  

---

# Rule 21 — No Duplicate Architecture

Before creating anything new:

• check Snowflake objects  
• check query layer  
• check existing routes  

Extend existing systems.

Do not fork architecture.

---

# Rule 22 — No Speculative Schema Usage (CRITICAL)

Do NOT reference columns unless verified in Snowflake.

Required workflow:

1. inspect view in Snowflake  
2. confirm column exists  
3. then use in query/UI  

Prevents:

• runtime crashes  
• broken pages  
• production regressions  

---

# Rule 23 — AI Must Not Re-Architect

AI assistants must:

• follow MASTER_STATE.md  
• follow CURRENT_FOCUS.md  
• follow ENGINEERING_RULES.md  

AI must NOT:

• invent new architecture  
• bypass Snowflake  
• introduce alternate pipelines  
• fabricate schema  

---

# Rule 24 — Docs Must Stay Synchronized

Always update together:

docs/MASTER_STATE.md  
docs/CURRENT_FOCUS.md  
docs/ENGINEERING_RULES.md  
docs/PROJECT_INDEX.md  

Use full-file replacements.

---

# Rule 25 — New Chats Must Be Re-Anchored

At start of every new chat:

Re-establish:

• MASTER_STATE.md  
• CURRENT_FOCUS.md  
• ENGINEERING_RULES.md  

---

# Development Workflow

1. Review canonical docs  
2. Confirm architecture path  
3. Modify Snowflake or query/API layer  
4. Validate in Snowflake  
5. Validate API/query layer  
6. Validate UI locally  
7. Commit  
8. Push to GitHub  
9. Deploy via Vercel  
10. Validate production  
11. Update docs  

---

# Final Principle

GAFAIG is global governance infrastructure.

Engineering decisions must prioritize:

• determinism  
• auditability  
• registry integrity  
• reproducibility  
• controlled disclosure  
• architecture consistency  