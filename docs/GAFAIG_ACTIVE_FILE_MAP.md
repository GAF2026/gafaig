# GAFAIG_ACTIVE_FILE_MAP.md

## Purpose
This document is the canonical active file inventory for the live GAFAIG platform. It lists the active Snowflake SQL files, Snowflake runtime objects, VS Code application files, and the interaction model that connects the private verification engine to the public trust record. This document excludes archive and legacy files unless they are still part of the active operating path.

## Core Operating Rule
GAFAIG operates through one locked chain:

Snowflake tables/views/procedures → VS Code query layer → API routes → UI pages/components

Snowflake is the source of truth. The VS Code application does not compute certification, score, governance tier, governance band, or certification status. It reads canonical Snowflake outputs and renders them.

---

## 1. Active Snowflake SQL files

### 1.1 `21_VIEWS_PUBLIC_REGISTRY.sql`
Purpose:
Builds the canonical public registry views used by the live platform.

Primary Snowflake objects:
- `CORE.V_REGISTRY_LATEST_APPROVED`
- `CORE.V_REGISTRY_PUBLIC`
- `CORE.V_REGISTRY_PUBLIC_SEARCH`

What it does:
- Produces the public registry projection used by registry list pages, registry detail pages, explorer, search, and verification.
- Normalizes and exposes only public-safe certification fields.

How it interacts:
- Read by `lib/queries/registry.ts`
- Read by `lib/queries/explorer.ts`
- Used by `app/api/registry/route.ts`
- Used by `app/api/registry/search/route.ts`
- Used by `app/api/verify/[registryId]/route.ts`

---

### 1.2 `CORE.REGISTRY_PUBLISH.sql`
Purpose:
Contains the canonical publishing procedure(s) that take approved internal case outcomes and publish them into the public registry snapshot layer.

Primary Snowflake objects:
- `CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3`
- possibly `CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4` if promoted in the live environment

What it does:
- Validates that a case is approved
- Reuses existing `REGISTRY_ID` when republishing
- Generates public registry snapshots
- Pushes approved certification records into the public trust layer

How it interacts:
- Reads approved case and decision outputs
- Writes into `CORE.REGISTRY_SNAPSHOTS`
- Feeds `CORE.V_REGISTRY_PUBLIC`

---

### 1.3 `GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql`
Purpose:
Defines and maintains the append-only registry snapshot layer.

Primary Snowflake object:
- `CORE.REGISTRY_SNAPSHOTS`

What it does:
- Stores public certification records as immutable snapshots
- Serves as the durable publication layer behind registry records

How it interacts:
- Written by publish procedures in `CORE.REGISTRY_PUBLISH.sql`
- Read by public registry views in `21_VIEWS_PUBLIC_REGISTRY.sql`

---

### 1.4 `14_TABLES_REGISTRY_AI_SYSTEMS.sql`
Purpose:
Defines the public systems table attached to registry records.

Primary Snowflake object:
- `CORE.REGISTRY_AI_SYSTEMS`

What it does:
- Stores public AI system metadata linked to registry records

How it interacts:
- Joined into the public systems view
- Read by `lib/queries/registry-ai-systems.ts`
- Used by `app/registry/ai-systems/page.tsx`
- Used by explorer systems surfaces

---

### 1.5 `Registry AI Systems Registry View.sql`
Purpose:
Defines the public-facing AI systems view.

Primary Snowflake object:
- `CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC`

What it does:
- Projects public AI systems data for display on the site

How it interacts:
- Read by `lib/queries/registry-ai-systems.ts`
- Used by public AI systems pages
- Supports explorer systems pages

Note:
This is the worksheet name repeatedly referenced in live platform work. If the exact canonical file name changes in workspace naming, this object remains the active runtime view.

---

### 1.6 `GAFAIG - Governance Scoring (Enterprise v1.0).sql`
Purpose:
Defines the deterministic enterprise governance scoring engine.

Primary Snowflake objects:
- `CORE.V_GOVERNANCE_SCORE_CASE`
- `CORE.SP_SCORE_CASE_ENTERPRISE`
- often related:
  - `CORE.V_CASE_SCORE_ENTERPRISE`
  - `CORE.V_CONTROL_SCORE_COMPONENTS`
  - `CORE.V_CASE_TIER_BAND`
  - `CORE.V_CASE_RENEWAL_STATUS`

What it does:
- Computes deterministic governance scoring
- Produces certified score / tier / band
- Supplies score components for internal engine and public-safe explanation layer

How it interacts:
- Feeds decisions
- Feeds publication layer
- `CORE.V_CONTROL_SCORE_COMPONENTS` is used by the public-safe explanation layer in `GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql`

---

### 1.7 `16_TABLES_CASE_SCORE_SNAPSHOTS.sql`
Purpose:
Defines score snapshot storage.

Primary Snowflake object:
- score snapshot table(s) for case scoring persistence

What it does:
- Preserves scoring state over time
- Supports deterministic history and certification state continuity

How it interacts:
- Written by scoring procedures
- Read by decisioning and publication flows as needed

---

### 1.8 `17_TABLES_DECISIONS.sql`
Purpose:
Defines governance certification decision storage.

Primary Snowflake object:
- decision table(s), including `CORE.VERIFICATION_DECISIONS` or equivalent live decision table

What it does:
- Stores approved / rejected certification decisions
- Acts as the final private decision gate before publication

How it interacts:
- Reads score outputs
- Feeds publish procedures

---

### 1.9 `GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql`
Purpose:
Defines the canonical public-safe trust explanation layer.

Primary Snowflake objects:
- `CORE.SP_REBUILD_SCORE_BREAKDOWN_PUBLIC()`
- `CORE.V_SCORE_BREAKDOWN_PUBLIC`
- `CORE.V_SCORE_DIMENSIONS_PUBLIC`

What it does:
- Projects internal score components into a public-safe governance explanation layer
- Normalizes score components into canonical public governance dimensions
- Supports public review scope messaging without exposing internal scoring mechanics

How it interacts:
- Reads `CORE.V_REGISTRY_PUBLIC`
- Reads `CORE.V_CONTROL_SCORE_COMPONENTS`
- Feeds `app/api/registry/[registryId]/score-breakdown/route.ts`
- Feeds registry trust explanation UI
- Feeds explorer review-scope summaries

---

## 2. Core active Snowflake runtime objects

### 2.1 `CORE.APPLICATIONS`
Purpose:
Application intake layer for certification.

### 2.2 `CORE.VERIFICATION_CASES`
Purpose:
Case-first workflow table for the private verification engine.

### 2.3 `CORE.VERIFICATION_EVENTS`
Purpose:
Workflow and evidence/event progression storage.

### 2.4 `CORE.VERIFICATION_DECISIONS`
Purpose:
Decision state storage for approved/rejected certification outcomes.

### 2.5 `CORE.VERIFICATION_FINDINGS`
Purpose:
Structured reviewer findings.

### 2.6 `CORE.VERIFICATION_EVIDENCE`
Purpose:
Evidence linked to findings and case workflow.

### 2.7 `CORE.REGISTRY_SNAPSHOTS`
Purpose:
Append-only public publication layer.

### 2.8 `CORE.REGISTRY_AI_SYSTEMS`
Purpose:
Public AI systems data linked to registry records.

### 2.9 `CORE.V_GOVERNANCE_SCORE_CASE`
Purpose:
Canonical governance score output for a case.

### 2.10 `CORE.V_CONTROL_SCORE_COMPONENTS`
Purpose:
Control-level scoring components used by the scoring engine and public-safe explanation layer.

### 2.11 `CORE.V_REGISTRY_PUBLIC`
Purpose:
Canonical public registry projection used throughout the site.

### 2.12 `CORE.V_REGISTRY_PUBLIC_SEARCH`
Purpose:
Public registry search projection.

### 2.13 `CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC`
Purpose:
Canonical public systems projection.

### 2.14 `CORE.V_SCORE_BREAKDOWN_PUBLIC`
Purpose:
Public-safe control/component explanation projection.

### 2.15 `CORE.V_SCORE_DIMENSIONS_PUBLIC`
Purpose:
Public-safe normalized governance-dimension explanation view.

### 2.16 `CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3` / `V4`
Purpose:
Publish approved case outcomes to the public registry.

### 2.17 `CORE.SP_REBUILD_SCORE_BREAKDOWN_PUBLIC()`
Purpose:
Rebuild public trust explanation views.

---

## 3. Active VS Code runtime files

## 3.1 Global app shell and layout

### `app/layout.tsx`
Purpose:
Root wrapper for all public pages.

What it does:
- Loads the global page shell
- Injects header/footer
- Establishes the main app wrapper and root layout structure

How it interacts:
- Loads `app/_components/SiteHeader.tsx`
- Loads `app/_components/SiteFooter.tsx`
- Works with `app/globals.css`

---

### `app/globals.css`
Purpose:
Global styling system for the GAFAIG public interface.

What it does:
- Sets foundational typography, spacing, and global theme rules

---

### `app/_components/SiteHeader.tsx`
Purpose:
Top navigation for the public platform.

### `app/_components/SiteFooter.tsx`
Purpose:
Footer and lower navigation shell.

### `app/_components/PublicPageHero.tsx`
Purpose:
Canonical hero block used across public pages.

### `app/_components/PublicButtonLink.tsx`
Purpose:
Canonical public action link button.

### `app/_components/PublicButton.tsx`
Purpose:
Canonical public button component.

---

## 3.2 Snowflake connection layer

### `lib/snowflake.ts`
Purpose:
Canonical Snowflake query adapter.

What it does:
- Exposes `sfQuery()`
- Handles application runtime access to Snowflake

How it interacts:
- Used by query layer files
- Used by API routes
- Serves as the single canonical database adapter

---

## 3.3 Query layer

### `lib/queries/registry.ts`
Purpose:
Registry query layer.

What it does:
- Reads registry list/detail/search projections from public Snowflake views

How it interacts:
- Reads `CORE.V_REGISTRY_PUBLIC`
- Reads `CORE.V_REGISTRY_PUBLIC_SEARCH`
- Used by `app/api/registry/route.ts`
- Used by registry pages and related API consumers

---

### `lib/queries/explorer.ts`
Purpose:
Explorer query layer.

What it does:
- Reads and aggregates explorer metrics
- Provides recent public record data, organizations, countries, systems summaries, and public scope aggregates

How it interacts:
- Reads public registry views
- Used by `app/api/explorer/route.ts` if present in current runtime
- Used by `app/explorer/page.tsx`
- Used by `app/explorer/organizations/page.tsx`
- Used by `app/explorer/countries/page.tsx`
- Supports explorer surfaces

---

### `lib/queries/registry-ai-systems.ts`
Purpose:
Public AI systems query layer.

What it does:
- Reads `CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC`

How it interacts:
- Used by `app/registry/ai-systems/page.tsx`
- Used by explorer systems surfaces

---

### `lib/queries/score-breakdown.ts`
Purpose:
Public trust explanation query layer.

What it does:
- Reads:
  - `CORE.V_SCORE_DIMENSIONS_PUBLIC`
  - `CORE.V_SCORE_BREAKDOWN_PUBLIC`

How it interacts:
- Used by `app/api/registry/[registryId]/score-breakdown/route.ts`
- Supports registry detail explanation layer
- Supports explorer public review scope summaries

Note:
If the exact file does not yet exist under this exact name, this is the canonical query-layer slot for the active score explanation feature.

---

## 3.4 Public API routes

### `app/api/registry/route.ts`
Purpose:
Public registry list endpoint.

What it does:
- Returns public registry records for list/browse surfaces

How it interacts:
- Uses `lib/queries/registry.ts`

---

### `app/api/registry/search/route.ts`
Purpose:
Public registry search endpoint.

What it does:
- Returns search results from public registry search projections

How it interacts:
- Uses registry search view via query layer

---

### `app/api/verify/[registryId]/route.ts`
Purpose:
Public signed verification endpoint.

What it does:
- Resolves a public registry record by registry ID
- Returns:
  - `record`
  - `proof`
  - `message`
  - `messageString`
  - `signature`
  - `verificationKeyUrl`

How it interacts:
- Reads `CORE.V_REGISTRY_PUBLIC`
- Uses verification key metadata
- Feeds `/verify`
- Feeds registry signed proof panel
- Feeds external verification flow

---

### `app/api/.well-known/gafaig-public-key/route.ts`
Purpose:
Public verification key route.

What it does:
- Serves the Ed25519 public key used to verify GAFAIG proof signatures

How it interacts:
- Referenced by `app/api/verify/[registryId]/route.ts`
- Used by `/verify`
- Used by external verification scripts

---

### `app/api/registry/[registryId]/score-breakdown/route.ts`
Purpose:
Public trust explanation endpoint.

What it does:
- Returns public-safe governance dimension explanation for a given registry record

How it interacts:
- Reads score explanation query layer
- Reads:
  - `CORE.V_SCORE_DIMENSIONS_PUBLIC`
  - `CORE.V_SCORE_BREAKDOWN_PUBLIC`

---

### `app/api/badge/[registryId]/route.ts`
Purpose:
Badge image endpoint.

What it does:
- Generates or resolves the public badge image for a registry record

How it interacts:
- Used by registry detail page
- Used by embed/badge/widget flows

---

## 3.5 Public UI pages

### `app/page.tsx`
Purpose:
Homepage.

What it does:
- Frames the public GAFAIG trust architecture
- Presents mission, private engine, public trust record, and explorer framing

---

### `app/mission/page.tsx`
Purpose:
Mission page.

What it does:
- Explains why GAFAIG exists
- Frames independent verification and public trust

---

### `app/framework/page.tsx`
Purpose:
Framework page.

What it does:
- Explains the verification framework and private/public separation

---

### `app/verify/page.tsx`
Purpose:
Verification page.

What it does:
- Lets users verify a registry ID
- Uses the public verification endpoint
- Supports signed proof review and client-side validation flow

How it interacts:
- Calls `/api/verify/[registryId]`
- Uses the public key route
- Interfaces with client-side verification logic

---

### `app/developers/page.tsx`
Purpose:
Developer-facing integration page.

What it does:
- Explains how to use GAFAIG public verification surfaces and trust infrastructure

---

### `app/apply/page.tsx`
Purpose:
Public application landing page.

What it does:
- Presents the application/certification entry path

---

### `app/apply/ApplyForm.tsx`
Purpose:
Public application form component.

What it does:
- Handles application form submission UI and flow

---

### `app/registry/page.tsx`
Purpose:
Public registry list page.

What it does:
- Shows public registry records
- Supports browse/filter public registry experience

How it interacts:
- Reads registry API/query outputs

---

### `app/registry/[registryId]/page.tsx`
Purpose:
Dynamic public registry detail page.

What it does:
- Shows a single public certification record
- Displays:
  - certification outcome
  - status / score / tier / band
  - signed proof
  - verification flow
  - trust explanation layer
  - badge/embed/widget surfaces

How it interacts:
- Calls `/api/verify/[registryId]`
- Calls `/api/registry/[registryId]/score-breakdown`
- Uses badge route
- Uses widget preview
- Uses registry components

---

### `app/registry/ai-systems/page.tsx`
Purpose:
Public AI systems registry page.

What it does:
- Lists public AI systems linked to registry records

---

### `app/explorer/page.tsx`
Purpose:
Explorer landing page.

What it does:
- Shows public counts, public record summaries, and review scope summaries

---

### `app/explorer/organizations/page.tsx`
Purpose:
Explorer organizations page.

What it does:
- Lists public organizations represented in the registry

---

### `app/explorer/countries/page.tsx`
Purpose:
Explorer countries page.

What it does:
- Lists public country-level registry visibility

---

### `app/explorer/systems/page.tsx`
Purpose:
Explorer systems page.

What it does:
- Lists public AI systems surfaced through the registry

---

### `app/widget-preview/[registryId]/page.tsx`
Purpose:
Widget preview page.

What it does:
- Previews embeddable public trust widget surfaces for a registry record

---

## 3.6 Registry and explorer UI components

### `components/registry/RegistryCertificationSummary.tsx`
Purpose:
Registry detail certification summary panel.

### `components/registry/RegistryHeaderPanel.tsx`
Purpose:
Registry detail header and record summary panel.

### `components/registry/RegistryVerificationPanel.tsx`
Purpose:
Registry detail signed proof / verification panel.

### `components/ui/StatusChip.tsx`
Purpose:
Canonical status chip UI.

### `app/components/CopyButton.tsx`
Purpose:
Copy interaction component for proof strings, signatures, and embed snippets.

Note:
If the exact path differs slightly in the current repo, the active copy button component occupies this role in the runtime surface.

---

## 3.7 Widget and trust distribution files

### `public/widget/gafaig-verify.js`
Purpose:
Public verification helper script for external usage.

### `public/widget/gafaig-widget.js`
Purpose:
Public embeddable widget script.

What they do:
- Power portable trust surfaces
- Support badge/widget distribution outside the GAFAIG site

How they interact:
- Referenced by registry detail embed surfaces
- Used by public distribution snippets

---

## 3.8 Admin/private runtime files

### `middleware.ts`
Purpose:
Global request/session gatekeeping.

### `lib/auth/require.ts`
Purpose:
Admin access enforcement helper.

### `app/admin/login/page.tsx`
Purpose:
Admin login page.

### `app/admin/applications/page.tsx`
Purpose:
Admin application list/review page.

### `app/admin/verification/[caseId]/findings/page.tsx`
Purpose:
Findings management page for private reviewer workflow.

### `app/api/admin/verification/decisions/route.ts`
Purpose:
Decision read/write API for the private certification workflow.

Note:
Additional admin/private files may exist in the repo, but the files above are confirmed active participants in the live operating flow discussed during the current build.

---

## 4. Interaction model: how the active files work together

### 4.1 Private certification engine path
1. Public applications enter through `app/apply/page.tsx` and `app/apply/ApplyForm.tsx`
2. Data flows into Snowflake private workflow tables:
   - `CORE.APPLICATIONS`
   - `CORE.VERIFICATION_CASES`
3. Reviewer/admin flow manages:
   - findings
   - evidence
   - events
   - decisions
4. Enterprise scoring engine computes outputs through:
   - `GAFAIG - Governance Scoring (Enterprise v1.0).sql`
   - `CORE.V_GOVERNANCE_SCORE_CASE`
   - `CORE.V_CONTROL_SCORE_COMPONENTS`
5. Decision layer finalizes certification
6. Publish layer writes public snapshots via:
   - `CORE.REGISTRY_PUBLISH.sql`
   - `CORE.REGISTRY_SNAPSHOTS`

---

### 4.2 Public registry path
1. Public views are defined by `21_VIEWS_PUBLIC_REGISTRY.sql`
2. Query layer files read those canonical views:
   - `lib/queries/registry.ts`
   - `lib/queries/explorer.ts`
   - `lib/queries/registry-ai-systems.ts`
3. API routes expose those outputs
4. Public pages render those outputs

---

### 4.3 Verification path
1. `app/api/verify/[registryId]/route.ts` resolves the public record from `CORE.V_REGISTRY_PUBLIC`
2. It builds the signed proof payload
3. It references the public key served by `app/api/.well-known/gafaig-public-key/route.ts`
4. `/verify` and registry detail pages render and validate the proof
5. External consumers can fetch the proof and public key and verify the signature

---

### 4.4 Public-safe trust explanation path
1. `GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql` builds:
   - `CORE.V_SCORE_BREAKDOWN_PUBLIC`
   - `CORE.V_SCORE_DIMENSIONS_PUBLIC`
2. `app/api/registry/[registryId]/score-breakdown/route.ts` exposes that layer publicly
3. Registry detail and Explorer read that explanation layer to describe governance review scope without exposing internal private scoring mechanics

---

## 5. Active vs non-active rule

### Active and canonical
The files and Snowflake objects listed in this document are part of the active operating path of the live GAFAIG platform.

### Not active by default
Any file or worksheet labeled:
- Archive
- Legacy
- old procedure
- backfill-only
- pre-v2
is not considered part of the active operating path unless explicitly promoted into the canonical runtime chain.

---

## 6. Short canonical operating map

### Snowflake active canonical objects
- `CORE.APPLICATIONS`
- `CORE.VERIFICATION_CASES`
- `CORE.VERIFICATION_EVENTS`
- `CORE.VERIFICATION_DECISIONS`
- `CORE.VERIFICATION_FINDINGS`
- `CORE.VERIFICATION_EVIDENCE`
- `CORE.REGISTRY_SNAPSHOTS`
- `CORE.REGISTRY_AI_SYSTEMS`
- `CORE.V_GOVERNANCE_SCORE_CASE`
- `CORE.V_CONTROL_SCORE_COMPONENTS`
- `CORE.V_REGISTRY_PUBLIC`
- `CORE.V_REGISTRY_PUBLIC_SEARCH`
- `CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC`
- `CORE.V_SCORE_BREAKDOWN_PUBLIC`
- `CORE.V_SCORE_DIMENSIONS_PUBLIC`
- `CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3` / `V4`
- `CORE.SP_REBUILD_SCORE_BREAKDOWN_PUBLIC()`

### VS Code active public runtime files
- `app/layout.tsx`
- `app/globals.css`
- `app/_components/SiteHeader.tsx`
- `app/_components/SiteFooter.tsx`
- `app/_components/PublicPageHero.tsx`
- `app/_components/PublicButtonLink.tsx`
- `app/_components/PublicButton.tsx`
- `lib/snowflake.ts`
- `lib/queries/registry.ts`
- `lib/queries/explorer.ts`
- `lib/queries/registry-ai-systems.ts`
- `lib/queries/score-breakdown.ts`
- `app/api/registry/route.ts`
- `app/api/registry/search/route.ts`
- `app/api/verify/[registryId]/route.ts`
- `app/api/.well-known/gafaig-public-key/route.ts`
- `app/api/registry/[registryId]/score-breakdown/route.ts`
- `app/api/badge/[registryId]/route.ts`
- `app/page.tsx`
- `app/mission/page.tsx`
- `app/framework/page.tsx`
- `app/verify/page.tsx`
- `app/developers/page.tsx`
- `app/apply/page.tsx`
- `app/apply/ApplyForm.tsx`
- `app/registry/page.tsx`
- `app/registry/[registryId]/page.tsx`
- `app/registry/ai-systems/page.tsx`
- `app/explorer/page.tsx`
- `app/explorer/organizations/page.tsx`
- `app/explorer/countries/page.tsx`
- `app/explorer/systems/page.tsx`
- `app/widget-preview/[registryId]/page.tsx`
- `components/registry/RegistryCertificationSummary.tsx`
- `components/registry/RegistryHeaderPanel.tsx`
- `components/registry/RegistryVerificationPanel.tsx`
- `components/ui/StatusChip.tsx`
- `app/components/CopyButton.tsx`
- `public/widget/gafaig-verify.js`
- `public/widget/gafaig-widget.js`
- `middleware.ts`
- `lib/auth/require.ts`
- `app/admin/login/page.tsx`
- `app/admin/applications/page.tsx`
- `app/admin/verification/[caseId]/findings/page.tsx`
- `app/api/admin/verification/decisions/route.ts`

---

## 7. Platform summary
GAFAIG operates as a private verification engine plus a public trust record. The private side manages intake, findings, evidence, events, scoring, and decisions in Snowflake. The public side publishes only approved certification outcomes through canonical registry views, signed proof, verification endpoints, badge/widget distribution, and public-safe governance explanation layers. The VS Code application is a thin rendering and transport layer over the Snowflake source of truth.