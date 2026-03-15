# GAFAIG — CURRENT DEVELOPMENT FOCUS

Last Updated: 2026-03-15

This document defines the **active development milestone** for the GAFAIG platform.

AI assistants and developers should prioritize work described in this document before making unrelated changes.

For full platform architecture see:

docs/MASTER_STATE.md

For repository navigation see:

docs/PROJECT_INDEX.md

For engineering standards see:

docs/ENGINEERING_RULES.md

---

# Current Development Phase

Surface the Engine

This phase exposes the GAFAIG governance verification engine through public registry surfaces.

The platform is transitioning from:

internal verification infrastructure

to

global AI governance registry.

---

# Platform Layers Involved In This Phase

```
Snowflake Governance Engine
↓
Registry Snapshot Publishing
↓
Public Registry Views
↓
API Surfaces
↓
Explorer + Registry UI
```

Snowflake remains the **system of record**.

---

# Primary Objectives

1. Stabilize Registry Publication Pipeline  
2. Expose Public Verification Endpoint  
3. Complete Global AI Systems Registry  
4. Complete Public Registry Search  
5. Surface Registry Data in Explorer  

---

# Objective 1 — Stabilize Registry Publication Pipeline

Registry publication is triggered through the admin verification workflow.

Admin route:

```
/admin/verification/[caseId]/score
```

Admin API:

```
/api/admin/publish
```

Snowflake procedure:

```
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3
```

Publishing flow:

```
Verification case
↓
Governance score snapshot
↓
Registry snapshot
↓
Latest approved registry record
↓
Public registry projection
```

Key Snowflake objects:

```
CORE.REGISTRY_SNAPSHOTS
CORE.V_REGISTRY_LATEST_APPROVED
CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_PUBLIC_SEARCH
```

Goal:

Ensure publishing always produces a valid public registry record.

---

# Objective 2 — Public Verification Endpoint

Allow third parties to verify GAFAIG certification.

API endpoint:

```
/api/verify/[registryId]
```

Example:

```
/api/verify/GAFAIG-00000001
```

Expected response:

• registry identifier  
• organization name  
• certification tier  
• governance band  
• certification score  
• certification timestamp  

Purpose:

Enable:

• verification badges  
• registry proof links  
• third-party verification  

Data source:

```
CORE.V_REGISTRY_PUBLIC
```

---

# Objective 3 — Global AI Systems Registry

Create a public searchable registry of verified AI systems.

Route:

```
/registry/ai-systems
```

Registry should display:

• AI system name  
• developer organization  
• risk tier  
• oversight level  
• governance certification tier  
• governance band  
• certification timestamp  

Snowflake table:

```
CORE.REGISTRY_AI_SYSTEMS
```

Public view:

```
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
```

---

# Objective 4 — Public Registry Search

Allow users to search the global AI governance registry.

API endpoint:

```
/api/registry/search
```

Search fields may include:

• registry identifier  
• organization name  
• country  
• AI system name  
• certification tier  

Primary Snowflake view:

```
CORE.V_REGISTRY_PUBLIC_SEARCH
```

This view powers:

• registry explorer  
• search APIs  
• public registry surfaces  

---

# Objective 5 — Explorer Integration

The explorer provides public analytics on the GAFAIG registry.

Primary route:

```
/explorer
```

Explorer surfaces include:

```
/explorer/organizations
/explorer/systems
/explorer/countries
/explorer/map
```

Explorer aggregates public registry signals.

Primary data sources:

```
CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
```

Metrics include:

• certified organizations  
• disclosed AI systems  
• countries represented  
• certification tier distribution  
• system risk distribution  
• oversight distribution  

---

# Current Priority Areas

Developers and AI assistants should focus on:

Frontend:

```
app/registry/
app/registry/ai-systems/
app/explorer/
```

API routes:

```
app/api/admin/publish
app/api/registry/
app/api/verify/
```

Snowflake registry layer:

```
CORE.REGISTRY_SNAPSHOTS
CORE.V_REGISTRY_LATEST_APPROVED
CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_PUBLIC_SEARCH
CORE.REGISTRY_AI_SYSTEMS
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
```

---

# Work Completed Recently

Major infrastructure milestones achieved:

• deterministic governance scoring engine  
• verification workflow schema implemented  
• registry snapshot publishing procedure created  
• public registry projection views implemented  
• explorer analytics page implemented  
• admin verification scoring interface completed  
• admin publish endpoint connected to Snowflake  
• registry identifier generation operational  
• public registry search view implemented  

The full publish pipeline now operates across:

```
Snowflake → API → UI
```

---

# Near-Term Goals

Complete the remaining public registry surfaces.

Priority tasks:

1. Complete `/registry/ai-systems` UI  
2. Implement `/registry/organizations` surface  
3. Implement `/registry/[registryId]` certification page  
4. Finalize `/api/verify/[registryId]` endpoint  
5. Ensure registry search API stability  

---

# Important Rules

All development must follow the engineering standards defined in:

```
docs/ENGINEERING_RULES.md
```

Key rules include:

1. Do not re-architect the Snowflake schema.
2. Do not expose private verification evidence.
3. Public routes must expose only controlled disclosures.
4. Identifiers must remain deterministic.

Identifiers include:

```
CASE_ID
REGISTRY_ID
SNAPSHOT_ID
APPLICATION_ID
SYSTEM_ID
```

Identifier definitions live in:

```
types/ids.ts
```

---

# Development Workflow

Typical development cycle:

1. Modify code in VS Code  
2. Run local development server  
3. Test route locally  
4. Verify Snowflake view output  
5. Commit working change  
6. Push to GitHub  
7. Verify Vercel deployment  

---

# Starting a New Chat

When beginning a new GAFAIG development chat, paste this starter block:

```
Please treat docs/MASTER_STATE.md as the canonical architecture and platform memory for GAFAIG.

Use docs/PROJECT_INDEX.md as the repository map.

Use docs/CURRENT_FOCUS.md as the active development milestone.

Use docs/ENGINEERING_RULES.md as the implementation guardrails.

Repository:
GAF2026/gafaig

Platform:
GAFAIG — Global AI Governance Registry

Production:
https://www.gafaig.com

Snowflake:
GAFAIG_DB / CORE schema

Current Phase:
Surface the Engine

Do not re-architect the platform.
Continue development from the current architecture.
```

This ensures AI assistants align with the existing system before proposing changes.