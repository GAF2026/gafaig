# PUBLIC_OBSERVABILITY_RULES.md
Last Updated: 2026-05-07

## PURPOSE

This document defines the public observability rules for GAFAIG.

GAFAIG is deterministic global AI governance infrastructure. Public observability surfaces must help external stakeholders understand published governance footprint, certification lifecycle, renewal posture, public AI system disclosures, and governance continuity without exposing private governance execution.

This document governs future public observability pages, views, APIs, and UI surfaces including:

- /explorer
- /explorer/map
- /explorer/lifecycle
- /explorer/renewals
- /explorer/governance-signals
- /explorer/systems
- /explorer/organizations
- /explorer/countries
- /registry
- /verify
- public widgets
- public badges
- SDK/API public trust surfaces

---

# CORE PRINCIPLE

Public observability is allowed only when it is derived from explicitly published certification records.

Certification is private.

Publication is explicit.

Observability is public-safe projection only.

Snowflake is the source of truth.

API is pass-through only.

UI is display only.

Registry is append-only.

Proof verifies.

AI is advisory only.

Governance intelligence must NEVER override deterministic trust.

---

# PUBLIC OBSERVABILITY DEFINITION

Public observability means showing high-level, publication-safe governance signals derived from Snowflake-originated public trust records.

Allowed public observability includes:

- published certification counts
- certified record counts
- country-level public trust footprint
- organization-level public trust footprint
- disclosed public AI systems
- certification lifecycle status
- renewal status
- certification validity windows
- publication timestamps
- public verification eligibility
- badge eligibility
- public registry presence
- public proof availability
- public AI system metadata marked public

Public observability does NOT mean exposing private governance execution.

---

# WHAT MAY BE PUBLIC

The following may be exposed if derived from published public records:

## Certification Visibility

- Registry ID
- Registry Snapshot ID
- Entity Name
- Entity Type
- Country
- Certification Status
- Certified At
- Valid From
- Valid To
- Published At
- Lifecycle Status
- Renewal Status
- Visibility Status
- Verification Eligible
- Badge Eligible

## Public AI System Visibility

Only if marked public:

- System ID
- System Name
- System Type
- Intended Use
- Deployment Status
- Oversight Level
- Developer Organization
- Public Summary
- Display Order
- Registry ID
- Country
- Certification Status
- Lifecycle Status
- Renewal Status

## Geographic Observability

- Country
- Public record count
- Certified record count
- Organization count
- Public AI system count
- Last published activity
- Certification distribution by country

## Lifecycle Observability

- Active certifications
- Expired certifications
- Revoked certifications if supported
- Validity windows
- Certification continuity
- Lifecycle status by country
- Lifecycle status by organization

## Renewal Observability

- Renewal status
- Renewal due windows
- Active vs expired certifications
- Renewal visibility by country
- Renewal visibility by organization
- Public renewal posture

## Governance Signal Observability

Allowed public-safe signals:

- publication activity
- lifecycle transitions
- renewal posture
- public AI system disclosure density
- country-level public trust density
- organization-level public trust density
- certification continuity indicators

---

# WHAT MUST NEVER BE PUBLIC

The following must never be exposed on public observability surfaces:

- raw evidence
- evidence files
- internal findings
- reviewer notes
- reviewer names
- reviewer assignments
- internal scoring calculations
- score breakdowns
- certification tier
- certification band
- private risk scores
- drift scores
- AI-generated recommendations
- AI review outputs
- internal governance telemetry
- remediation task details
- private workflow events
- internal case state
- Application ID in public UI
- Case ID in public UI
- private participant data
- internal organization contacts
- internal decision rationale
- unpublished certification outcomes
- unpublished AI systems
- non-public registry snapshots

---

# PUBLICATION RULE

No public observability surface may show data unless it is tied to an explicitly published certification record.

Public visibility requires:

```sql
PUBLISHED = TRUE

or projection from a canonical public view that already enforces explicit publication, such as:

CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
CORE.V_REGISTRY_STATS_BY_COUNTRY
LIFECYCLE RULE

Lifecycle status may be shown publicly only as a high-level public trust state.

Allowed lifecycle labels:

active
expired
revoked
suspended
pending renewal
renewed
archived

Lifecycle status must be derived from Snowflake.

UI must not calculate lifecycle status independently except for display formatting of Snowflake-provided values.

RENEWAL RULE

Renewal status may be shown publicly only as a certification continuity signal.

Allowed renewal exposure:

renewal status
renewal due category
renewal completed category
expired status
active status

Do not expose:

internal renewal workflow
reviewer notes
remediation tasks
evidence requirements
internal renewal scoring
private renewal communications
GOVERNANCE SIGNAL RULE

Governance signals must be aggregate, public-safe, and publication-derived.

Allowed:

public certification activity
public lifecycle activity
public renewal posture
public AI system disclosure count
public country-level footprint
public organization-level footprint

Not allowed:

private AI risk intelligence
private drift intelligence
private findings
private remediation details
private monitoring outputs
internal operational logs
AI SYSTEM DISCLOSURE RULE

Public AI system pages must show only systems explicitly marked public.

AI system visibility requires:

IS_PUBLIC = TRUE

and the system must be linked to a published certification record.

Do not infer, generate, rename, or fabricate system names.

Do not use organization names as system names.

If no public system name exists, show count-based disclosure only.

API RULE

Public APIs must remain pass-through surfaces.

APIs may project canonical Snowflake public views.

APIs must not:

calculate trust
derive certification
reconstruct proof
infer lifecycle state from private data
expose unpublished records
expose internal identifiers in public UI contracts unless required for machine proof continuity
UI RULE

UI is display only.

UI may format:

dates
labels
counts
table layout
cards
navigation

UI must not compute:

certification
lifecycle validity
renewal status
trust state
verification state
proof validity
governance risk
drift status
VERIFICATION RULE

Public observability does not replace cryptographic verification.

Any public trust claim must resolve to:

registry record
verify endpoint
proof.messageString
signature
public key

Verification must use proof.messageString only.

Do not reconstruct signed payloads from JSON fields.

OBSERVABILITY PAGE RULES
/explorer

Main public trust surface.

May show:

public record count
published certification count
organization count
country count
public AI system count
latest published records
/explorer/map

Geographic public observability surface.

May show:

country distribution
public certification counts
country-level activity
last published activity
/explorer/systems

Public AI system disclosure surface.

May show:

public system name
organization
country
certification status
lifecycle status
public system type
public intended use

Only if system is public.

/explorer/lifecycle

Future lifecycle observability surface.

May show:

active records
expired records
revoked records
renewal due categories
validity windows
lifecycle distribution
/explorer/renewals

Future renewal observability surface.

May show:

renewal status
renewal due windows
expired certifications
renewed certifications
renewal footprint by organization/country
/explorer/governance-signals

Future public governance signals surface.

May show:

aggregate public governance activity
publication activity
lifecycle activity
renewal posture
public AI system disclosure density

Must not show private governance intelligence.

SNOWFLAKE VIEW RULE

Every public observability surface must be backed by a canonical Snowflake view.

Future observability views should include:

23_VIEWS_LIFECYCLE_PUBLIC.sql
24_VIEWS_RENEWAL_PUBLIC.sql
25_VIEWS_OBSERVABILITY_PUBLIC.sql

These views must be score-blind and publication-controlled.

CHANGE MANAGEMENT

Before exposing a new observability field publicly:

Confirm the source is Snowflake.
Confirm it is derived from published public records.
Confirm it does not expose private workflow state.
Confirm it does not expose Application ID or Case ID in public UI.
Confirm it does not expose score, tier, band, evidence, findings, or reviewer material.
Confirm UI is display-only.
Confirm API is pass-through only.
Confirm verification still resolves to proof.messageString.
FINAL PRINCIPLE

Public observability must make GAFAIG more transparent without making private governance execution public.

GAFAIG public observability exists to show:

what has been published
what is certified
what is active
what is expired
what is disclosed
what can be verified

It must never expose:

how private evidence was reviewed
how internal findings were evaluated
how scoring internals were calculated
how reviewers worked
how private governance intelligence operated

The public sees published trust.

Snowflake decides.

Registry publishes.

Proof verifies.

END OF FILE