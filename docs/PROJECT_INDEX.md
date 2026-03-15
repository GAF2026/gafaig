# GAFAIG — PROJECT INDEX
Repository Architecture Map

Last Updated: 2026-03-15

This document provides a complete navigation index for the GAFAIG repository.

It allows contributors and AI assistants to understand the structure of the platform before proposing changes.

All development must respect the architecture defined in:

docs/MASTER_STATE.md

Engineering standards are defined in:

docs/ENGINEERING_RULES.md

Current milestone work is tracked in:

docs/CURRENT_FOCUS.md

---

# Platform Overview

GAFAIG is a global AI governance registry and verification infrastructure.

The platform is composed of four major layers:

```
Snowflake Verification Engine
↓
Registry Publication Layer
↓
API Surface
↓
Next.js UI Surfaces
```

Snowflake is the system of record.

---

# Repository Structure

```
app/
api/
lib/
types/
docs/
```

---

# Next.js Application Routes

## Public Pages

```
/
/mission
/framework
/registry
/explorer
```

---

## Explorer

Public analytics explorer.

```
/explorer
/explorer/organizations
/explorer/systems
/explorer/countries
/explorer/map
```

Data sources:

```
CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
```

---

## Registry Pages

Public registry surfaces.

```
/registry
/registry/ai-systems
/registry/organizations
/registry/[registryId]
```

---

# Admin Interface

```
/admin/login
/admin/applications
/admin/verification
/admin/verification/[caseId]
/admin/verification/[caseId]/score
```

These routes connect the private verification engine to the public registry.

---

# API Routes

## Verification Endpoint

Public verification endpoint.

```
/api/verify/[registryId]
```

Returns certification metadata for a registry record.

---

## Registry APIs

```
/api/registry/search
```

Search interface for registry explorer.

---

## Admin APIs

```
/api/admin/publish
```

Triggers Snowflake registry publication.

---

# Snowflake Database

```
GAFAIG_DB
CORE
```

---

# Core Snowflake Tables

```
CORE.APPLICATIONS
CORE.PARTICIPANTS
CORE.FINDINGS
CORE.EVIDENCE
CORE.EVENTS
CORE.CASE_SCORE_SNAPSHOTS
CORE.DECISIONS
CORE.REGISTRY_AI_SYSTEMS
```

---

# Snowflake Registry Views

These power the public registry.

```
CORE.V_REGISTRY_LATEST_APPROVED
CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_PUBLIC_SEARCH
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
```

---

# Snowflake Admin Views

Used by the admin interface.

```
CORE.V_ADMIN_SUBMISSIONS
CORE.V_VERIFICATION_CASE_DETAIL
CORE.V_GOVERNANCE_SCORE_CASE
```

---

# Snowflake Procedures

Registry publication and workflow procedures.

Examples include:

```
SP_PUBLISH_CASE_TO_REGISTRY_V3
APPROVE_CASE_V1
UNAPPROVE_CASE_V1
```

These procedures control publication into the public registry.

---

# Contract Types

Location:

```
types/contracts/
```

These files define canonical data contracts between:

```
Snowflake
API
UI
```

Examples:

```
registry-ai-system.ts
verification-proof.ts
verification-case.ts
admin-application.ts
```

---

# Core Libraries

```
lib/snowflake.ts
lib/auth/
lib/ids.ts
```

These utilities provide:

• Snowflake connectivity  
• authentication helpers  
• deterministic identifier utilities  

---

# Environment Variables

Configured locally:

```
.env.local
```

Configured in production:

```
Vercel environment settings
```

Examples include:

```
GAFAIG_SESSION_SECRET
GAFAIG_ADMIN_PASSWORD
SNOWFLAKE_ACCOUNT
SNOWFLAKE_USERNAME
SNOWFLAKE_ROLE
SNOWFLAKE_DATABASE
SNOWFLAKE_SCHEMA
SNOWFLAKE_PRIVATE_KEY
```

---

# Canonical Documentation

```
docs/MASTER_STATE.md
docs/PROJECT_INDEX.md
docs/CURRENT_FOCUS.md
docs/ENGINEERING_RULES.md
docs/CHANGELOG.md
```

These documents define the authoritative state of the platform.

---

# Development Rule

Before creating new routes, APIs, or database objects:

1. Check this index.
2. Confirm the functionality does not already exist.
3. Extend existing architecture where possible.

This prevents duplicate surfaces and architecture drift.