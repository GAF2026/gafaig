# GAFAIG_ACTIVE_FILE_MAP.md
Date: 2026-04-22

## Purpose

This file is the active execution map for GAFAIG (Global Authority for AI Governance). It identifies the current canonical files that matter most for system integrity, production behavior, and next-step execution. It is not a full file tree. It is the active map of files that govern the live platform and its stabilized state.

## Core System Rule

Snowflake is the source of truth.

All governance computation, scoring, approval state, renewal state, publish eligibility, registry publication, and public trust projection must originate in Snowflake. The app, API, and UI are consumers of canonical Snowflake views and procedures. They must not invent or recompute trust logic.

## Current Platform State

The Snowflake-backed public trust surface is stabilized.

Working and validated:
- public registry view filtered to approved/current records only
- explorer stats restored from Snowflake
- registry page aligned to canonical layout system
- explorer pages aligned (organizations, countries, systems, root)
- verify page aligned and fully connected to trust surface
- widget preview aligned and operational
- admin pages aligned to unified shell system
- API registry + explorer + verify routes stabilized
- decision lifecycle supports approve, revoke, re-approve
- renewal/publishability layer gates publication correctly
- revoked records excluded from public registry view

Still under active review:
- explorer systems must strictly use canonical public systems view
- registry AI systems pages must not leak workflow-level data
- final registry integrity validation across all surfaces

---

## Canonical Snowflake Workflow Chain

APPLICATION  
→ VERIFICATION_CASES  
→ VERIFICATION_FINDINGS  
→ VERIFICATION_EVIDENCE  
→ VERIFICATION_EVENTS  
→ V_GOVERNANCE_SCORE_CASE  
→ CASE_SCORE_SNAPSHOTS  
→ DECISIONS  
→ V_CASE_RENEWAL_STATUS  
→ SP_PUBLISH_CASE_TO_REGISTRY_V3  
→ REGISTRY_SNAPSHOTS  
→ V_REGISTRY_PUBLIC  
→ V_REGISTRY_AI_SYSTEMS_PUBLIC  
→ API  
→ UI  

---

## Active Snowflake Files

### Workflow / Core Tables
- 11_TABLES_APPLICATIONS.sql
- 12_TABLES_PARTICIPANTS.sql (NOTE: previously had errors, must be validated)
- 15_TABLES_EVENTS.sql (NOTE: previously had errors, must be validated)
- 16_TABLES_CASE_SCORE_SNAPSHOTS.sql
- 17_TABLES_DECISIONS.sql
- 18_TABLES_REGISTRY_ENTITIES.sql

### Public / Registry Views
- 21_VIEWS_PUBLIC_REGISTRY.sql
- 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
- 22_VIEWS_EXPLORER_STATS.sql
- 26_VIEWS_CASE_RENEWAL_STATUS.sql

### Procedures
- 23_SP_CREATE_CASE_FROM_APPLICATION.sql
- 24_SP_SCORE_CASE_ENTERPRISE.sql
- 25_PROCEDURES_APPROVAL.sql
- GAFAIG - CORE.REGISTRY_PUBLISH.sql

### Canonical Scoring Engine
- GAFAIG - Governance Scoring (Enterprise v1.2).sql

---

## Snowflake Objects (Canonical)

### Tables
- CORE.APPLICATIONS
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.VERIFICATION_FINDING_EVIDENCE
- CORE.VERIFICATION_EVENTS
- CORE.CASE_SCORE_SNAPSHOTS
- CORE.DECISIONS
- CORE.REGISTRY_SNAPSHOTS
- CORE.REGISTRY_AI_SYSTEMS

### Views
- CORE.V_GOVERNANCE_SCORE_CASE
- CORE.V_CASE_RENEWAL_STATUS
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- CORE.V_EXPLORER_STATS
- CORE.V_SCORE_DIMENSIONS_PUBLIC
- CORE.V_PUBLIC_OVERSIGHT_SIGNAL

### Procedures
- CORE.SP_CREATE_CASE_FROM_APPLICATION
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.APPROVE_CASE_V1
- CORE.UNAPPROVE_CASE_V1
- CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

---

## Snowflake Governance Rules (Locked)

### Score Source of Truth
CORE.V_GOVERNANCE_SCORE_CASE is the ONLY source for:
- FINAL_SCORE
- CERTIFIED_TIER
- CERTIFIED_BAND
- renewal propagation
- publish eligibility

### Decision Lifecycle Rule
- one active row per case (VALID_TO IS NULL)
- historical rows closed
- latest row governs trust state

### Renewal Rule
CORE.V_CASE_RENEWAL_STATUS determines:
- RENEWAL_STATUS
- IS_CURRENTLY_VALID
- IS_PUBLISHABLE

### Publish Rule
SP_PUBLISH_CASE_TO_REGISTRY_V3 must gate on lifecycle validity, NOT workflow status.

### Public Registry Rule
CORE.V_REGISTRY_PUBLIC must:
- use latest snapshot
- use latest APPROVED decision
- exclude revoked/expired records

### Public Systems Rule
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC is the ONLY allowed source for:
- explorer systems
- registry AI systems UI

---

## Active VS Code / App Files

### Query Layer
- lib/queries/registry.ts
- lib/queries/explorer.ts

### API Routes
- app/api/registry/route.ts
- app/api/registry/search/route.ts
- app/api/verify/[registryId]/route.ts
- app/api/explorer/route.ts
- app/api/.well-known/gafaig-public-key/route.ts
- app/api/badge/[registryId]/route.ts

---

## Public Pages (Aligned – Phase 1 Complete)

### Core Pages
- app/page.tsx
- app/mission/page.tsx
- app/framework/page.tsx
- app/demo/page.tsx
- app/developers/page.tsx

### Registry
- app/registry/page.tsx
- app/registry/[registryId]/page.tsx

### AI Systems
- app/registry/ai-systems/page.tsx
- app/registry/ai-systems/[systemId]/page.tsx

### Explorer
- app/explorer/page.tsx
- app/explorer/organizations/page.tsx
- app/explorer/countries/page.tsx
- app/explorer/systems/page.tsx

### Verify
- app/verify/page.tsx
- app/verify/[registryId]/page.tsx

### Widget
- app/widget-preview/[registryId]/page.tsx

---

## Admin Pages (Aligned – Phase 1 Complete)

### Core
- app/admin/login/page.tsx
- app/admin/applications/page.tsx
- app/admin/participants/page.tsx

### Verification
- app/admin/verification/page.tsx
- app/admin/verification/[caseId]/page.tsx
- app/admin/verification/[caseId]/findings/page.tsx
- app/admin/verification/[caseId]/score/page.tsx
- app/admin/verification/[caseId]/publish/page.tsx

---

## Shared UI System (Canonical)

Located in:
- app/_components/

Key files:
- PublicPageHero.tsx
- PublicButtonLink.tsx
- PublicButton.tsx
- SiteHeader.tsx

---

## Layout System (Now Canonical)

Defined in:
- PAGE_LAYOUT_SYSTEM.md
- PUBLIC_PAGE_TEMPLATE_MAP.md
- PUBLIC_PAGE_AUDIT.md

### Locked Rules
- max width: 1180px
- px-6 horizontal padding
- consistent hero usage
- section-based stacking
- no page-specific layout overrides

---

## Trust / Crypto Layer

### Files
- lib/crypto/verify-signing.ts

### Endpoints
- /api/verify/[registryId]
- /api/.well-known/gafaig-public-key

### Algorithm
- Ed25519

### Proof Contract
- alg
- kid
- signature
- signedAt
- verificationKeyUrl
- message
- messageString

---

## Widget System

### Files
- public/widget/gafaig-widget.js
- public/widget/gafaig-verify.js

### Usage
- external embed
- driven by /api/verify

---

## Recently Stabilized Files

### Snowflake
- 16_TABLES_CASE_SCORE_SNAPSHOTS.sql
- 24_SP_SCORE_CASE_ENTERPRISE.sql
- 25_PROCEDURES_APPROVAL.sql
- 26_VIEWS_CASE_RENEWAL_STATUS.sql
- GAFAIG - CORE.REGISTRY_PUBLISH.sql
- 21_VIEWS_PUBLIC_REGISTRY.sql

### App
- lib/queries/explorer.ts
- lib/queries/registry.ts
- app/api/registry/route.ts
- app/api/explorer/route.ts
- all explorer pages
- all registry pages
- all verify pages

---

## Files to Watch Next

### Snowflake
- 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
- 21_VIEWS_PUBLIC_REGISTRY.sql
- GAFAIG - CORE.REGISTRY_PUBLISH.sql

### App
- lib/queries/explorer.ts
- app/explorer/systems/page.tsx
- app/registry/ai-systems/page.tsx

---

## Files NOT Allowed as Public Truth Sources

- CORE.REGISTRY_AI_SYSTEMS (raw)
- CORE.VERIFICATION_CASES (workflow state)
- UI-derived lifecycle logic
- API-derived scoring logic

---

## Current Stable Production Checkpoint

- Post Phase 1 UI alignment
- Snowflake registry stabilized
- Explorer + Registry + Verify unified
- Widget system live and aligned

---

## Current Remaining Focus

1. Final registry integrity validation
2. Ensure systems explorer purity (public-only)
3. Validate no revoked leakage
4. Maintain strict Snowflake → API → UI flow

---

## Execution Rule (Critical)

Always fix in this order:

1. Snowflake (views / procedures)
2. Query layer
3. API
4. UI

Never reverse this order.

---

## Final Reminder

GAFAIG is now a Snowflake-governed public trust infrastructure.

Everything must remain anchored to:
- deterministic lifecycle control
- append-only registry publication
- canonical public views
- zero UI/API recomputation of trust