# GAFAIG — ENGINEERING RULES
Development Standards for Snowflake + Next.js + Registry Architecture

Last Updated: 2026-03-15

This document defines the engineering rules for the GAFAIG platform.

These rules exist to ensure:

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

GAFAIG must operate as **deterministic trust infrastructure**.

This means:

• governance scoring must be reproducible  
• registry outputs must be verifiable  
• identifiers must be deterministic  
• private evidence must remain protected  
• public surfaces must expose only controlled disclosures  

The platform is designed as **verification infrastructure**, not simply a web application.

---

# Rule 1 — Snowflake Is the Source of Truth

All verification data originates in Snowflake.

Snowflake is the authoritative system for:

• governance findings  
• verification evidence  
• verification events  
• scoring logic  
• decisions  
• snapshots  
• registry publication  
• public registry read models  

Application code must **never attempt to replicate scoring logic** outside Snowflake.

Snowflake schema:

```
GAFAIG_DB
CORE
```

---

# Rule 2 — Deterministic Governance Scoring

Governance scoring must remain deterministic.

The scoring engine must always produce the same results when run on the same evidence set.

Scoring dimensions:

```
Controls
Coverage
Freshness
Summaries
```

Scoring outputs may include:

```
governanceScore
governanceTier
governanceBand
finalScore
tier
band
```

Deterministic scoring outputs must be recorded in Snowflake-owned scoring and snapshot layers.

Examples include:

```
CORE.CASE_SCORE_SNAPSHOTS
CORE.REGISTRY_SNAPSHOTS
CORE.V_GOVERNANCE_SCORE_CASE
```

Application code must not calculate governance certification outcomes independently.

---

# Rule 3 — Registry Publication Must Be Controlled

Registry publication must never expose private verification evidence.

Registry records must contain **controlled disclosures only**.

Public registry fields may include:

• organization name  
• AI system name  
• registry identifier  
• verification status  
• governance tier  
• governance band  
• certification score  
• certification timestamp  
• verification proof ID  
• country  
• public summary  

Private evidence must remain restricted.

Registry publication currently flows through Snowflake-owned snapshot and public registry layers.

Examples include:

```
CORE.REGISTRY_SNAPSHOTS
CORE.V_REGISTRY_LATEST_APPROVED
CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_PUBLIC_SEARCH
CORE.REGISTRY_AI_SYSTEMS
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
```

Public registry publication logic must stay in Snowflake.

---

# Rule 4 — Every Cross-Layer Feature Must Use a Contract File

Any feature that crosses **Snowflake → API → UI** should use a TypeScript contract file whenever the payload is reused or user-facing.

Contract files define the canonical data structure used by the application.

Location:

```
types/contracts/
```

Examples:

```
types/contracts/registry-ai-system.ts
types/contracts/verification-proof.ts
types/contracts/admin-application.ts
types/contracts/verification-case.ts
```

Contract files should define:

• field names  
• field types  
• nullability  
• Snowflake column mapping  
• API usage  
• UI usage  

If a reusable contract file does not yet exist, create one before expanding the feature further.

---

# Rule 5 — Snowflake Column Names Must Be Mapped Explicitly

Snowflake uses uppercase SQL column names.

Application code uses camelCase.

Mappings must be explicit.

Example:

```
SNOWFLAKE COLUMN         APPLICATION FIELD
-----------------------------------------
REGISTRY_ID              registryId
AI_SYSTEM_NAME           aiSystemName
VERIFICATION_STATUS      verificationStatus
VERIFICATION_TIMESTAMP   verificationTimestamp
```

Mappings should be documented inside contract files or route mappers.

Do not pass raw uppercase Snowflake records directly into UI components.

---

# Rule 6 — UI Must Never Depend on Raw SQL Rows

UI components must never consume raw Snowflake row structures.

Instead:

```
Snowflake View
↓
API Route Mapper
↓
Contract Type
↓
UI Component
```

UI components should only use stable TypeScript-facing fields.

Server routes are responsible for:

• column mapping  
• null handling  
• formatting boundaries  
• public-safe filtering  
• compatibility with current Snowflake view definitions  

---

# Rule 7 — Registry Surfaces Must Remain Public-Safe

Public registry routes must never expose:

• verification evidence  
• internal findings  
• reviewer notes  
• internal governance scoring breakdowns  
• internal Snowflake payload variants  
• approval notes not explicitly designated public  

Public routes include examples such as:

```
/registry
/registry/ai-systems
/explorer
/explorer/organizations
/explorer/systems
/api/registry
/api/registry/search
/api/verify/[registryId]
```

These routes may expose only **controlled disclosures**.

---

# Rule 8 — Admin Surfaces Must Remain Protected

Admin functionality must always require authentication.

Admin routes include:

```
/admin/login
/admin/applications
/admin/verification
/admin/verification/[caseId]
/admin/verification/[caseId]/score
/api/admin/*
```

Authentication model:

Signed admin session cookies.

Session secrets stored in environment variables.

Admin routes may expose internal workflow data, but must still avoid leaking secrets or raw infrastructure credentials.

---

# Rule 9 — Identifier Formats Must Be Deterministic

Identifiers must remain consistent across:

• Snowflake  
• API routes  
• UI components  
• registry records  
• public verification endpoints  

Identifiers include:

```
CASE_ID
REGISTRY_ID
SNAPSHOT_ID
APPLICATION_ID
REQUEST_ID
VERIFICATION_ID
SYSTEM_ID
```

Definitions should live in canonical ID helpers such as:

```
types/ids.ts
lib/ids.ts
```

Identifiers must never be regenerated or reformatted in UI code.

If a Snowflake view or procedure owns ID generation, application code must display that value exactly as returned.

---

# Rule 10 — SQL Views Must Power Application Data

The application should read primarily from **Snowflake views**, not raw tables.

Views enforce:

• schema stability  
• data filtering  
• access control  
• public-safe outputs  
• compatibility across API and UI layers  

Examples include:

```
CORE.V_ADMIN_SUBMISSIONS
CORE.V_VERIFICATION_CASE_DETAIL
CORE.V_GOVERNANCE_SCORE_CASE
CORE.V_REGISTRY_LATEST_APPROVED
CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_PUBLIC_SEARCH
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
```

Tables may be written by procedures, but application reads should prefer views whenever practical.

---

# Rule 11 — Environment Variables Must Not Be Hardcoded

Secrets and credentials must always be stored in environment variables.

Local development:

```
.env.local
```

Production:

```
Vercel environment settings
```

Key variables may include:

```
GAFAIG_SESSION_SECRET
GAFAIG_ADMIN_PASSWORD
GAFAIG_ADMIN_DEMO_PASSWORD
SNOWFLAKE_ACCOUNT
SNOWFLAKE_USER
SNOWFLAKE_USERNAME
SNOWFLAKE_ROLE
SNOWFLAKE_DATABASE
SNOWFLAKE_SCHEMA
SNOWFLAKE_WAREHOUSE
SNOWFLAKE_PRIVATE_KEY_PATH
SNOWFLAKE_PRIVATE_KEY_PASSPHRASE
GAFAIG_VERIFY_SIGNING_SECRET
```

Secrets must never be committed to the repository.

Keys shown during debugging should be rotated.

---

# Rule 12 — Changes Must Be Logged

Major changes must be recorded in:

```
docs/CHANGELOG.md
```

Examples:

• schema changes  
• registry architecture updates  
• scoring logic updates  
• deployment changes  
• environment configuration changes  
• public API changes  

---

# Rule 13 — AI Development Must Respect Platform Architecture

AI assistants must follow the repository documentation hierarchy.

Architecture reference:

```
docs/MASTER_STATE.md
```

Repository navigation:

```
docs/PROJECT_INDEX.md
```

Active milestone:

```
docs/CURRENT_FOCUS.md
```

AI assistants must not re-architect the system unless explicitly instructed.

AI assistants must extend the current platform rather than invent parallel structures.

---

# Rule 14 — Before Proposing New Files or Routes, Check Existing Architecture

Before proposing or creating any new page, API route, SQL object, or helper file:

• check whether the functionality already exists  
• check whether an adjacent file should be extended instead  
• check whether the route is already present in the repo map  
• check whether Snowflake already has a view or procedure for the task  

Do not duplicate pages or APIs when an existing route already serves the purpose.

Prefer:

```
extend existing file
```

over:

```
create parallel replacement
```

unless a true new surface is required.

---

# Rule 15 — Snapshot Publishing and Public Registry Are Separate Layers

Publishing a case may involve multiple Snowflake layers:

```
score snapshot
↓
latest approved snapshot
↓
public registry projection
↓
public search view
↓
API / UI surface
```

Do not assume a successful publish procedure automatically means the public registry projection is complete unless the public registry view confirms it.

Application code should treat these as distinct read/write layers and verify the public projection explicitly when needed.

---

# Rule 16 — Public Projection Must Be Verified After Snowflake Changes

When modifying Snowflake procedures or views related to registry publication, verify all of the following:

• the procedure executes successfully  
• the snapshot row is created  
• the latest approved view resolves the case  
• the public registry view resolves the case  
• the public search view resolves the case  
• the Next.js API reflects the new row  
• the UI shows the registry identifier  

A change is not complete until the full projection path is verified end to end.

---

# Rule 17 — Use Full-File Replacements for Canonical Docs and Critical Files

When updating canonical docs or core implementation files during guided development, prefer **full-file replacements** over partial insertions.

This applies especially to:

```
docs/MASTER_STATE.md
docs/PROJECT_INDEX.md
docs/CURRENT_FOCUS.md
docs/ENGINEERING_RULES.md
core API routes
core Snowflake SQL files
```

This reduces drift, conflicting fragments, and incomplete merges.

---

# Rule 18 — Project Memory Must Be Re-Anchored at the Start of New Chats

New chats do not automatically have access to repository files.

At the start of a new GAFAIG chat, re-anchor the project by explicitly stating that these docs are canonical:

```
docs/MASTER_STATE.md
docs/PROJECT_INDEX.md
docs/CURRENT_FOCUS.md
docs/ENGINEERING_RULES.md
```

The project starter block should instruct contributors and AI assistants to:

• treat those docs as canonical  
• continue from the current architecture  
• avoid re-architecture  
• keep Snowflake as source of truth  
• protect private evidence  
• use deterministic identifiers consistently  

---

# Development Workflow

Typical development cycle:

1. Review canonical docs before proposing changes  
2. Confirm whether the target route / file / object already exists  
3. Modify code in VS Code or Snowflake worksheets  
4. Run local development server  
5. Test route or Snowflake object locally  
6. Verify the full cross-layer path  
7. Commit working change  
8. Push to GitHub  
9. Verify Vercel deployment  
10. Update changelog and canonical docs when appropriate  

---

# Final Principle

GAFAIG is designed to operate as **global AI governance infrastructure**.

Engineering decisions must prioritize:

• determinism  
• transparency  
• registry integrity  
• reproducible governance verification  
• controlled public disclosure  
• architectural continuity