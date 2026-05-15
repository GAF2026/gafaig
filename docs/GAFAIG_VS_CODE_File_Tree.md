# GAFAIG_VS_CODE_File_Tree.md

Last Updated: 2026-05-14

PURPOSE

This document defines the canonical VS Code repository structure and public governance trust architecture layout for GAFAIG (Global Authority for AI Governance).

GAFAIG is a deterministic global AI governance infrastructure platform and governance trust distribution infrastructure that enables organizations, AI systems, regulators, enterprises, governments, research institutions, universities, laboratories, non-profits, technology providers, and governance stakeholders to manage, evaluate, certify, publish, verify, monitor, observe, and coordinate AI governance outcomes through Snowflake-originated public governance trust surfaces and cryptographic verification infrastructure.

GAFAIG additionally operates as:

* communication layer infrastructure
* governance trust distribution infrastructure
* public accountability infrastructure

This document defines:

canonical VS Code architecture
Next.js structure
API structure
public governance trust surfaces
SDK/widget structure
governance infrastructure surfaces
verification surfaces
AI governance observability surfaces
governance simulation surfaces
deployment structure
canonical ownership boundaries

Snowflake remains the ONLY source of truth.

Everything outside Snowflake is projection, presentation, distribution, or verification infrastructure.

GLOBAL POSITIONING EVOLUTION (CRITICAL)

GAFAIG has evolved beyond the earlier framing of:

"registry platform"

The platform must now be consistently positioned as:

deterministic global AI governance infrastructure

AND:

public accountability infrastructure for artificial intelligence

This evolution reflects the expansion of GAFAIG into:

deterministic certification infrastructure
governance execution infrastructure
governance intelligence infrastructure
governance observability infrastructure
governance simulation infrastructure
remediation orchestration infrastructure
append-only publication infrastructure
cryptographic public governance trust infrastructure
independent verification infrastructure
global governance coordination infrastructure
communication layer infrastructure
governance trust distribution infrastructure
public accountability infrastructure

CRITICAL:

This positioning evolution must NOT weaken:

Snowflake-first execution
deterministic trust guarantees
publication control
append-only registry behavior
proof.messageString verification enforcement
cryptographic verification integrity
fail-closed verification behavior
AI advisory-only boundaries

CORE SYSTEM RULES

Snowflake is the source of truth.

API is pass-through only.

UI is display only.

Registry is append-only.

Certification is private.

Publication is explicit.

Verification uses proof.messageString only.

AI is advisory only.

Humans approve.

Snowflake decides.

Registry publishes.

Proof verifies.

Simulation is operational only.

Governance intelligence must NEVER override deterministic trust.

REPOSITORY ROOT

Canonical repository:

gafaig/

GitHub repository:

GAF2026/gafaig

Production deployment:

Vercel
[https://www.gafaig.com](https://www.gafaig.com)

CANONICAL APPLICATION STRUCTURE

gafaig/
├── app/
├── lib/
├── public/
├── types/
├── docs/
├── scripts/
├── styles/
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md

APP DIRECTORY

Purpose:

public governance trust surfaces
verification surfaces
informational pages
governance presentation surfaces

Rules:

UI only
no trust computation
no certification logic
no proof reconstruction

APP ROUTES

HOMEPAGE
app/page.tsx

Purpose:

public positioning
governance infrastructure presentation
public governance trust infrastructure messaging

Template:

INFORMATIONAL

MISSION PAGE
app/mission/page.tsx

Purpose:

governance mission presentation
deterministic public governance trust positioning

Template:

INFORMATIONAL

FRAMEWORK PAGE
app/framework/page.tsx

Purpose:

governance execution model presentation
publication separation explanation
trust lifecycle explanation

Template:

INFORMATIONAL

DEVELOPERS PAGE
app/developers/page.tsx

Purpose:

SDK/widget integration guidance
proof verification guidance
verification endpoint guidance

Template:

INFORMATIONAL

Rules:

no trust computation examples
verification must use messageString only

APPLY PAGE
app/apply/page.tsx

Purpose:

governance application intake UI

Rules:

intake only
no scoring logic
no certification logic

REGISTRY INDEX
app/registry/page.tsx

Purpose:

public certification registry browsing

Template:

INDEX / LIST

Rules:

public governance trust surfaces only
no unpublished records
no governance telemetry

REGISTRY DETAIL PAGE
app/registry/[registryId]/page.tsx

Purpose:

public certification surface display
public governance trust + verification display

Template:

DETAIL / RECORD

Rules:

no internal workflow leakage
no Application ID display
no Case ID display
verification uses proof.messageString only

VERIFY PAGE
app/verify/[registryId]/page.tsx

Purpose:

deterministic cryptographic verification

Template:

DETAIL / RECORD

Rules:

fail-closed
messageString only
no reconstructed payload verification

Operational UI terminology:

Public Certification Surface
View Proof JSON
Verify This Record
Open Full Proof Page

Deprecated terminology:

Raw Verification JSON
Registry Record
Open JSON

EXPLORER INDEX
app/explorer/page.tsx

Purpose:

governance ecosystem exploration
public governance aggregation

Template:

INDEX / LIST

Rules:

public-safe only
no governance telemetry leakage

EXPLORER COUNTRIES
app/explorer/countries/page.tsx

Purpose:

country-level governance aggregation

Template:

INDEX / LIST

EXPLORER ORGANIZATIONS
app/explorer/organizations/page.tsx

Purpose:

organization-level governance exploration

Template:

INDEX / LIST

EXPLORER SYSTEMS
app/explorer/systems/page.tsx

Purpose:

public AI governance system exploration

Template:

INDEX / LIST

Rules:

public-safe only
publication-controlled only

AI SYSTEM DETAIL PAGE
app/registry/ai-systems/[systemId]/page.tsx

Purpose:

public AI system certification display

Template:

DETAIL / RECORD

Rules:

no private telemetry
no unpublished records

PUBLIC COMPONENTS

PUBLIC HERO
app/_components/PublicPageHero.tsx

Purpose:

canonical hero shell

Rules:

required for all public pages
no custom hero implementations

PUBLIC BUTTONS
app/_components/PublicButtonLink.tsx

Purpose:

canonical public button system

Rules:

required for public CTA consistency

API DIRECTORY

Purpose:

deterministic projection layer
public governance trust distribution
cryptographic verification

Rules:

pass-through only
no trust recomputation
no certification logic
no publication logic
no ID generation

REGISTRY API
app/api/registry/route.ts

Purpose:

public registry distribution

Rules:

projection only
publication-controlled only

Data source:

CORE.V_REGISTRY_PUBLIC

VERIFY API
app/api/verify/[registryId]/route.ts

Purpose:

deterministic proof generation
cryptographic verification contract

Rules:

fail-closed
messageString only
no payload reconstruction

Outputs:

canonical proof object
signature
messageString
verification metadata

BADGE API
app/api/badge/[registryId]/route.ts

Purpose:

verification badge distribution

Rules:

public-safe only
verification-backed only

PUBLIC KEY API
app/api/.well-known/gafaig-public-key/route.ts

Purpose:

Ed25519 public key distribution

Rules:

public verification support only
no private key exposure

Current active contract:

alg: Ed25519
kid: gafaig-ed25519-2026-01

LIB DIRECTORY

Purpose:

Snowflake integration
projection queries
deterministic serialization support

Rules:

no trust authority
no scoring logic outside Snowflake

LIB QUERIES
lib/queries/

Purpose:

canonical Snowflake query layer

Rules:

read-only projections
public-safe only where applicable

LIB VERIFICATION
lib/verification/

Purpose:

deterministic verification support

Rules:

no payload reconstruction
no alternate verification logic
must use messageString only

TYPES DIRECTORY

Purpose:

canonical API/type alignment

Rules:

type contracts must mirror Snowflake public views
no fabricated fields
no UI-only trust fields

PUBLIC DIRECTORY

Purpose:

SDKs
widgets
public assets
verification scripts

SDK STRUCTURE
public/sdk/

Operational files:

gafaig.js
gafaig.v1.js

Rules:

fail-closed
no local trust computation
no reconstructed payload verification

SDKs are part of the governance trust distribution infrastructure.

They function as:

* portable governance verification surfaces
* governance trust distribution surfaces
* external governance trust signaling infrastructure

SDK verification MUST use:

/api/verify/[registryId]
proof.messageString

WIDGET STRUCTURE
public/widget/

Operational files:

gafaig-widget.js
gafaig-widget.v1.js
gafaig-verify.js
gafaig-verify.v1.js

Rules:

fail-closed
verification-backed only
no trust inference from host page
no reconstructed payload verification

Widgets are part of the governance trust distribution infrastructure.

They function as:

* portable governance verification surfaces
* governance trust distribution surfaces
* external governance trust signaling infrastructure

Widgets MUST:

call verify API
use proof.messageString
display lifecycle state correctly

DOCUMENTATION DIRECTORY

docs/

Purpose:

canonical governance documentation
architecture governance
verification + governance trust contract governance

Operational files:

ENGINEERING_RULES.md
MASTER_STATE.md
CURRENT_FOCUS.md
VERIFIED_DEFINITION.md
VERIFICATION_SIGNATURE_CONTRACT.md
VERSIONING.md
CANONICAL_RUN_ORDER.md
PAGE_LAYOUT_SYSTEM.md
PUBLIC_PAGE_TEMPLATE_MAP.md
PUBLIC_PAGE_AUDIT.md
GAFAIG_CANONICAL_SUMMARY.md
GAFAIG_ACTIVE_FILE_MAP.md
GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
GAFAIG_VS_CODE_File_Tree.md

Rules:

canonical synchronization required
no conflicting operational definitions

PAGE LAYOUT GOVERNANCE

Canonical visual governance defined by:

PAGE_LAYOUT_SYSTEM.md
PUBLIC_PAGE_TEMPLATE_MAP.md
PUBLIC_PAGE_AUDIT.md

All public pages MUST:

share canonical visual shell
use assigned template only
avoid cross-template drift

CANONICAL VISUAL SHELL

Required shell:

<main className="mx-auto max-w-[1180px] px-6 py-10">
  <div className="space-y-8">

Rules:

required globally
no custom shell systems

PUBLIC GOVERNANCE TRUST DATA SOURCES

Public governance trust surfaces may ONLY derive from:

CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
CORE.V_REGISTRY_LATEST_APPROVED

API/UI/SDK/widgets MUST NEVER:

compute trust
compute certification
compute lifecycle
fabricate public fields

AI GOVERNANCE UI RULES

AI governance systems may:

observe
recommend
analyze
simulate
coordinate

AI governance systems must NEVER:

certify
publish
mutate proof state
override deterministic trust
expose private governance telemetry publicly

GOVERNANCE OBSERVABILITY SURFACES

Future observability surfaces may include:

governance dashboards
governance analytics APIs
timeline visualization UI
simulation dashboard UI
governance coordination surfaces

Rules:

operational only
no trust authority
no certification authority
no publication authority

GOVERNANCE SIMULATION SURFACES

Future simulation surfaces may include:

governance stress testing dashboards
drift visualization systems
trust decay analysis
operational governance forecasting

Rules:

NON-DESTRUCTIVE
append-safe
operational only

Simulation systems MUST NEVER:

mutate certification
mutate publication
mutate registry state
mutate proof state

COMMUNICATION LAYER ARCHITECTURE

GAFAIG now operates simultaneously across:

Layer 1:
Public Human Narrative

Audience:

* citizens
* consumers
* workers
* humanity

Focus:

* accountability
* governance visibility
* public understanding
* public legitimacy

Future domain:
theglobalauthorityforaigovernance.com

Layer 2:
Institutional Governance Infrastructure

Audience:

* enterprises
* regulators
* governments
* governance professionals

Focus:

* governance operations
* certification surfaces
* governance observability
* public governance trust infrastructure

Primary domain:
gafaig.com

Layer 3:
Developer / Verification Infrastructure

Audience:

* developers
* integrators
* auditors

Focus:

* proof.messageString
* Ed25519
* SDKs
* APIs
* cryptographic verification

Narrative legitimacy is now considered:
critical infrastructure.

PUBLIC ACCOUNTABILITY INFRASTRUCTURE

GAFAIG is evolving into public accountability infrastructure for artificial intelligence.

The registry is NOT the platform itself.

The registry is:
the visible public governance trust manifestation layer.

The long-term objective is:
machine-verifiable human accountability for artificial intelligence systems.

Public accountability infrastructure requires:

* deterministic source-of-truth governance records
* publication-controlled certification surfaces
* append-only registry behavior
* cryptographic verification
* public governance legitimacy
* governance visibility
* verification portability
* governance trust distribution

CURRENT EXECUTION STATE

WORKING

Operational:

deterministic verification
append-only publication
governance intelligence
governance simulations
governance observability
governance timelines
remediation orchestration
public proof infrastructure
verification SDKs/widgets
fail-closed verification
communication layer architecture
narrative infrastructure stabilization
governance trust distribution infrastructure
public accountability infrastructure
governance legitimacy infrastructure

Validated successfully in Snowflake and Vercel deployment flows.

PREVIOUS CRITICAL BLOCKER (HISTORICAL CONTEXT)

Earlier in the GAFAIG build process, the following files were identified as canonical rebuild blockers:

12_TABLES_PARTICIPANTS.sql
15_TABLES_EVENTS.sql

These files previously required alignment to preserve:

deterministic rebuild ordering
downstream dependency integrity
canonical pipeline stability

The platform has since evolved beyond that earlier stabilization phase into:

governance intelligence
governance simulations
governance observability
remediation orchestration
public governance trust infrastructure
cryptographic verification hardening
global AI governance infrastructure expansion

Future canonical rebuild validation remains important before major infrastructure expansion, but these files should NOT be treated as unresolved blockers unless active compile/runtime failures reappear during Snowflake validation.

DEPLOYMENT STRUCTURE

Production:

Vercel

Repository:

GitHub

Canonical deployment flow:
GitHub
→ Vercel
→ Production

Rules:

production reflects main branch only
no deployment-side trust logic
no deployment-side scoring logic

FINAL PRINCIPLE

Snowflake decides.

API projects.

UI displays.

Registry publishes only explicit public governance trust surfaces.

Proof verifies.

Everything else is deterministic projection.

END OF FILE
