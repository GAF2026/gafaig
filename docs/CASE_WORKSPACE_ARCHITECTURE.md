# CASE_WORKSPACE_ARCHITECTURE.md

Last Updated: 2026-06-27

# PURPOSE

This document defines the canonical Case Workspace Architecture for the Global Authority for AI Governance (GAFAIG).

The Case Workspace is the primary operational surface for applicants, GAFAIG operations reviewers, governance reviewers, certification authorities, and platform administrators.

The Case Workspace exists because repository pages alone do not answer the operational question:

What should this participant do next?

Repositories answer:

- Where is the information?
- What records exist?
- What has been persisted?
- What lifecycle visibility exists?

The Case Workspace answers:

- What is happening with this case?
- Who currently owns the case?
- Who is the case waiting on?
- What is the next required action?
- What blocks progress?
- What repository records support the current workflow state?
- What authority boundaries apply?

The Case Workspace is an operational guidance surface.

The Case Workspace does not create governance authority.

The Case Workspace does not create findings authority.

The Case Workspace does not create scoring authority.

The Case Workspace does not create decision authority.

The Case Workspace does not create certification authority.

The Case Workspace does not create publication authority.

The Case Workspace does not create registry authority.

Snowflake remains the source of truth.

Human governance authority remains supreme.

---

# DOCUMENT STATUS

This document is a canonical architecture document.

This document is not an implementation file.

This document is not a SQL execution file.

This document is not a UI component file.

This document is not an authorization grant.

This document defines the target architecture for the future Case Workspace implementation within the Operational Workflow Layer.

---

# RELATIONSHIP TO OTHER CANONICAL DOCUMENTS

This document is subordinate to:

- Constitutional governance authority
- Governance architecture
- Applicant Lifecycle architecture
- Repository Maturity doctrine
- OPERATIONAL_WORKFLOW_ARCHITECTURE.md
- OPERATIONAL_WORKFLOW_STATE_MACHINE.md

This document extends the Operational Workflow Layer by defining the case-centered operational surface that will consume workflow state and repository summaries.

This document must be synchronized with future updates to:

- CURRENT_FOCUS.md
- MASTER_STATE.md
- GAFAIG_CANONICAL_SUMMARY.md
- GAFAIG_ACTIVE_FILE_MAP.md
- GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
- ENGINEERING_RULES.md
- OPERATIONAL_WORKFLOW_ARCHITECTURE.md
- OPERATIONAL_WORKFLOW_STATE_MACHINE.md

---

# ARCHITECTURAL POSITION

Platform progression:

1. Constitutional Architecture
2. Governance Architecture
3. Applicant Lifecycle Architecture
4. Repository Maturity Layer
5. Operational Workflow Architecture
6. Operational Workflow State Machine
7. Case Workspace Architecture
8. Operational Workflow Layer Implementation
9. Repository Interaction Layer
10. Advanced Operational Automation

The Case Workspace is the first major operational user-experience layer above Repository Maturity.

The Repository Maturity Layer made repository data visible.

The Operational Workflow Layer makes the next action understandable.

The Case Workspace makes the workflow usable.

---

# CORE PRINCIPLE

The case is the unit of operational work.

Participants should not begin by choosing a repository.

Participants should begin by opening a case.

From the case, the platform should show:

- current state
- current owner
- waiting-on party
- next action
- blocking items
- supporting repository records
- timeline
- review status
- decision status
- certification status
- lifecycle status
- authority boundaries

The Case Workspace transforms the Applicant Portal and future Reviewer Portal from a collection of repository pages into an operational certification workspace.

---

# NON-AUTHORITY DECLARATION

The Case Workspace may display state.

The Case Workspace may summarize records.

The Case Workspace may guide navigation.

The Case Workspace may identify next actions.

The Case Workspace may show blocking items.

The Case Workspace may show owner responsibility.

The Case Workspace may link to repository records.

The Case Workspace may link to future upload or response actions.

The Case Workspace may not create governance findings.

The Case Workspace may not compute governance scores.

The Case Workspace may not approve or deny governance outcomes.

The Case Workspace may not issue certification.

The Case Workspace may not publish registry records.

The Case Workspace may not override Snowflake.

The Case Workspace may not bypass human governance authority.

---

# CASE-FIRST NAVIGATION MODEL

The canonical operational navigation model is:

Dashboard

↓

Cases

↓

Case Workspace

↓

Supporting Repository Panels

↓

Action Surface

Repositories remain available as supporting views.

Repositories are not the primary workflow navigation model.

The primary user question is not:

Which repository should I open?

The primary user question is:

What should I do next for this case?

---

# PRIMARY WORKSPACE OBJECTIVE

Every Case Workspace must make the following immediately visible:

- Case identity
- Organization identity
- Current workflow stage
- Current owner
- Waiting-on party
- Next required action
- Blocking conditions
- Repository completeness
- Timeline activity
- Review visibility
- Decision visibility
- Certification visibility
- Authority boundary

A user should be able to open a case and understand its operational condition without opening separate repository pages first.

---

# VERSION 1 CASE WORKSPACE SCOPE

Version 1 Case Workspace shall focus on read-only operational guidance.

Version 1 shall not require new governance authority.

Version 1 shall not require new certification authority.

Version 1 shall not require registry publication changes.

Version 1 shall not require Repository Interaction Layer implementation.

Version 1 may link to existing repository pages.

Version 1 may use existing applicant APIs.

Version 1 may use shared applicant repository helpers.

Version 1 may use deterministic derived workflow state from Snowflake-backed records.

Version 1 should preserve fail-closed behavior.

---

# CANONICAL CASE WORKSPACE LAYOUT

The canonical Case Workspace layout is:

1. Case Header
2. Authority Boundary Banner
3. Workflow Summary Panel
4. Next Action Panel
5. Blocking Items Panel
6. Owner / Waiting-On Panel
7. Repository Summary Panel
8. Timeline Panel
9. Activity Feed Panel
10. Applicant Action Panel
11. Reviewer Action Panel
12. Governance Action Panel
13. Certification Action Panel
14. Administrator Action Panel
15. Evidence Panel
16. Artifact Panel
17. Request Panel
18. Information Request Panel
19. Deficiency Panel
20. Remediation Panel
21. Review Panel
22. Decision Panel
23. Certification Panel
24. Publication Panel
25. Lifecycle Panel
26. Audit History Panel
27. Related Links Panel

Not every participant sees every panel.

Panel visibility depends on role, organization scope, workflow state, and disclosure rules.

---

# CASE HEADER ARCHITECTURE

The Case Header is the persistent identity block for the workspace.

The Case Header displays:

- Case ID
- Request ID
- Application ID where available
- Organization name
- Organization ID where visible
- Applicant contact where visible
- Current workflow state
- Current workflow stage
- Current owner
- Waiting-on party
- Case status
- Last updated timestamp
- Repository activity count
- Certification status where available
- Decision status where available

The Case Header must be visible at the top of every Case Workspace.

The Case Header must not display governance-private data to unauthorized participants.

The Case Header must never imply certification, approval, or publication unless supported by authoritative Snowflake state.

---

# AUTHORITY BOUNDARY BANNER

Every Case Workspace must display an authority boundary statement.

For applicant-facing users, the banner should communicate:

This workspace provides operational visibility only.

For reviewer-facing users, the banner should communicate:

Workflow guidance does not replace authorized human governance review.

For governance users, the banner should communicate:

Governance authority remains controlled by constitutional execution and authorized human review.

For certification users, the banner should communicate:

Certification readiness is not certification issuance.

For administrators, the banner should communicate:

Administrative visibility does not create governance authority.

The authority banner should be concise but explicit.

---

# WORKFLOW SUMMARY PANEL

The Workflow Summary Panel displays:

- Current Stage
- Current State Code
- Current Owner
- Waiting On
- Next Required Action
- Estimated Completion
- Current Status
- Last Transition
- Allowed Next Transitions
- Blocking Conditions

The Workflow Summary Panel is the primary operational guidance panel.

The Workflow Summary Panel must use the Operational Workflow State Machine as its authority.

The Workflow Summary Panel must not infer governance outcome.

---

# NEXT ACTION PANEL

The Next Action Panel answers:

What should happen next?

The panel displays:

- Action label
- Action owner
- Action priority
- Action due date where available
- Action source
- Action reason
- Supporting repository records
- Link to action surface where available
- Link to supporting repository where action surface is not implemented

Example applicant next actions:

- Upload requested evidence
- Respond to information request
- Submit remediation package
- Review certification status
- Submit renewal materials
- Submit appeal materials

Example reviewer next actions:

- Review intake record
- Review uploaded evidence
- Issue information request
- Review applicant response
- Review remediation
- Route to governance review
- Review certification readiness

The Next Action Panel must be deterministic.

If no safe next action can be determined, it must show a fail-closed state.

---

# BLOCKING ITEMS PANEL

The Blocking Items Panel displays operational blockers.

Blocking item categories include:

- Missing application data
- Missing evidence
- Open information request
- Unanswered deficiency
- Missing remediation
- Unresolved organization identity
- Unavailable Snowflake source
- Authentication mismatch
- Authorization failure
- Governance review unavailable
- Certification metadata incomplete
- Publication authorization incomplete

Each blocker should display:

- blocker label
- blocker owner
- blocker severity
- source repository
- required resolution
- whether applicant-visible
- whether reviewer-visible

Blocking items must not expose private governance reasoning to unauthorized applicants.

---

# OWNER AND WAITING-ON PANEL

The Owner / Waiting-On Panel displays:

- current owner
- current waiting-on participant
- next responsible role
- escalation role where applicable
- time in current state where available
- overdue indicator where applicable

Canonical waiting-on values include:

- Applicant
- GAFAIG Operations Reviewer
- Governance Reviewer
- Certification Authority
- Platform Administrator
- Platform / System
- None

The panel must distinguish between owner and waiting-on.

A case may be owned by GAFAIG Operations but waiting on Applicant.

A case may be owned by Certification Authority but waiting on Platform publication readiness.

---

# REPOSITORY SUMMARY PANEL

The Repository Summary Panel displays the health of supporting repositories.

Repositories include:

- Evidence Repository
- Artifact Repository
- Request Repository
- Information Request Repository
- Deficiency Repository
- Remediation Repository
- Certification Repository
- Progress Repository
- Review Status
- Decision Status

Each repository summary displays:

- repository name
- record count
- latest record timestamp
- repository activity
- repository status
- whether action is required
- whether persisted records exist
- whether only placeholder records exist
- link to repository page

Repositories remain supporting surfaces.

They do not determine workflow authority by themselves.

---

# TIMELINE PANEL

The Timeline Panel displays chronological operational history.

Timeline event categories include:

- application submitted
- intake review started
- evidence requested
- evidence uploaded
- artifact uploaded
- information request issued
- applicant response submitted
- evidence validation started
- deficiency identified
- remediation requested
- remediation submitted
- remediation review started
- governance review started
- governance review completed
- decision pending
- decision issued
- certification ready
- certification issued
- publication pending
- published
- renewal pending
- expired
- appeal pending
- reinstatement pending
- case closed

Timeline events must be Snowflake-backed or deterministically derived from Snowflake-backed records.

Timeline must be read-only in Version 1.

Timeline must not fabricate governance outcomes.

---

# ACTIVITY FEED PANEL

The Activity Feed Panel displays operational activity in a human-readable sequence.

Activity feed differs from timeline:

- Timeline is canonical sequence.
- Activity feed is operationally useful recent activity.

Activity may include:

- latest evidence record
- latest artifact record
- latest request
- latest response
- latest remediation
- latest review status
- latest decision status
- latest certification status

Activity feed should prioritize recent and actionable events.

---

# ROLE-BASED WORKSPACE VISIBILITY

The workspace must adapt to role.

Applicant users see applicant-safe workflow and repository visibility.

Operations reviewers see operational review surfaces.

Governance reviewers see governance-authorized surfaces.

Certification authority users see certification surfaces.

Platform administrators see operational support surfaces.

Role-based visibility must be fail-closed.

---

# APPLICANT WORKSPACE SPECIFICATION

The Applicant Workspace must prioritize:

- next required applicant action
- current case stage
- waiting-on status
- open requests
- evidence requirements
- deficiencies
- remediation requirements
- certification visibility
- renewal visibility
- appeal or reinstatement visibility where applicable

Applicant workspace must not show:

- private reviewer notes
- governance-private deliberation
- scoring internals
- unpublished registry details
- confidential certification authority notes
- administrative-only diagnostics

---

# OPERATIONS REVIEWER WORKSPACE SPECIFICATION

The Operations Reviewer Workspace must prioritize:

- cases awaiting intake review
- cases awaiting evidence review
- applicant responses awaiting review
- open deficiencies
- remediation submissions
- workflow blockers
- case readiness for governance review
- repository completeness
- operational due dates

Operations reviewer workspace must not create governance decisions.

---

# GOVERNANCE REVIEWER WORKSPACE SPECIFICATION

The Governance Reviewer Workspace must prioritize:

- governance-ready cases
- supporting evidence
- operational history
- deficiency and remediation history
- decision readiness
- authority boundary
- human review requirement

Governance reviewer workspace must remain subordinate to constitutional authority.

---

# CERTIFICATION AUTHORITY WORKSPACE SPECIFICATION

The Certification Authority Workspace must prioritize:

- certification-ready cases
- favorable decision linkage
- certification metadata
- publication readiness
- renewal windows
- expiration risk
- suspension, revocation, appeal, reinstatement lifecycle

Certification authority workspace must not issue certification unless authorized implementation exists.

---

# PLATFORM ADMINISTRATOR WORKSPACE SPECIFICATION

The Platform Administrator Workspace must prioritize:

- blocked workflow states
- organization mapping failures
- authentication issues
- authorization failures
- failed source queries
- ambiguous state resolution
- overdue operational cases
- missing repository linkages
- platform integration issues

Administrative surfaces must preserve governance authority boundaries.

---

# WORKSPACE DATA CONTRACT

A future Case Workspace API should return:

- ok
- organization
- case
- workflow
- nextAction
- blockingItems
- repositorySummary
- timeline
- activity
- evidence
- artifacts
- requests
- informationRequests
- deficiencies
- remediation
- review
- decision
- certification
- publication
- lifecycle
- authorityBoundary
- links

The API must be Snowflake-backed.

The API must be role-aware.

The API must fail closed.

---

# CASE OBJECT CONTRACT

Case object fields:

- caseId
- requestId
- applicationId
- organizationId
- organizationName
- applicantEmail
- caseStatus
- source
- createdAt
- updatedAt

The case object identifies the operational container.

---

# WORKFLOW OBJECT CONTRACT

Workflow object fields:

- workflowState
- workflowStage
- currentOwner
- waitingOn
- nextRequiredAction
- estimatedCompletionAt
- blockingCount
- allowedTransitions
- stateSource
- authorityBoundary

The workflow object provides deterministic operational state.

---

# NEXT ACTION OBJECT CONTRACT

Next action object fields:

- actionId
- actionType
- actionLabel
- actionDescription
- ownerRole
- priority
- dueAt
- source
- repositorySupport
- href
- enabled
- authorityBoundary

Next action must be deterministic.

---

# BLOCKING ITEM OBJECT CONTRACT

Blocking item object fields:

- blockerId
- blockerType
- blockerLabel
- severity
- ownerRole
- source
- repository
- requiredResolution
- applicantVisible
- reviewerVisible
- createdAt

Blocking items must not expose unauthorized private information.

---

# REPOSITORY SUMMARY OBJECT CONTRACT

Repository summary fields:

- repositoryName
- repositoryType
- recordCount
- persistedRecordCount
- placeholderRecordCount
- latestActivityAt
- status
- actionRequired
- href

Repository summaries support workflow.

---

# TIMELINE EVENT OBJECT CONTRACT

Timeline event fields:

- eventId
- eventType
- eventLabel
- eventDescription
- occurredAt
- actorRole
- source
- repository
- visibility
- authorityBoundary

Timeline events must be deterministic.

---

# ACTIVITY OBJECT CONTRACT

Activity object fields:

- activityId
- activityType
- label
- description
- occurredAt
- source
- href
- priority

Activity is operationally useful recent history.

---

# WORKSPACE LINKS CONTRACT

Links object should include role-safe hrefs:

- dashboard
- cases
- caseWorkspace
- evidence
- artifacts
- requests
- informationRequests
- deficiencies
- remediation
- certifications
- progress
- reviewStatus
- decisionStatus
- registry where applicable
- adminVerification where authorized

---

# FAILURE STATES

The Case Workspace must handle:

- missing case
- unauthorized case
- missing organization
- Snowflake query failure
- ambiguous workflow state
- missing repository source
- unsupported role
- unavailable next action
- broken detail link

Failure display must be explicit.

Failure display must not leak private information.

---

# FAIL-CLOSED RULES

If applicant organization cannot be determined, do not show case.

If case cannot be scoped to applicant organization, do not show case.

If workflow state cannot be determined, show safe pending or hold state.

If governance authority is not available, do not show governance-private content.

If certification authority is not available, do not imply certification issuance.

If publication authority is not available, do not imply registry publication.

---

# WORKSPACE PRIORITY MODEL

When multiple conditions exist, the workspace should prioritize:

1. Access or authorization failure
2. Blocking operational issue
3. Applicant-required action
4. Reviewer-required action
5. Governance-review action
6. Certification-authority action
7. Publication-readiness action
8. Lifecycle monitoring
9. Closed state

Applicant-facing priority must emphasize applicant-owned next actions.

Reviewer-facing priority must emphasize reviewer-owned work.

Administrator-facing priority must emphasize exceptions and blocked cases.

---

# CASE WORKSPACE VERSION 1

Version 1 should implement:

- case header
- workflow summary
- next action panel
- repository summary
- timeline summary
- links to existing repositories
- authority boundary banner
- applicant-safe visibility
- reviewer-safe visibility where implemented

Version 1 should not require:

- cross-linking
- upload actions
- remediation submission actions
- certification issuance actions
- publication actions
- advanced automation

---

# CASE WORKSPACE VERSION 2

Version 2 may implement:

- repository interaction links
- upload actions
- response actions
- remediation submission actions
- richer timeline
- activity feed
- reviewer task lists
- assignment support
- cross-linking
- repository detail embedding

Version 2 remains subordinate to Operational Workflow Architecture.

---

# CASE WORKSPACE VERSION 3

Version 3 may implement:

- advanced automation
- notifications
- SLA tracking
- escalations
- reviewer collaboration
- applicant messaging
- operational analytics
- governance handoff automation where authorized

Version 3 must preserve constitutional governance authority.

---

# IMPLEMENTATION SEQUENCE

Recommended implementation order:

1. Shared workflow resolver
2. Case workspace API
3. Applicant case workspace page
4. Repository summary component
5. Workflow summary component
6. Next action component
7. Blocking items component
8. Timeline component
9. Reviewer workspace extension
10. Governance workspace extension
11. Certification workspace extension
12. Administrator workspace extension

---

# SHARED WORKFLOW RESOLVER

The shared workflow resolver should compute:

- workflowState
- workflowStage
- currentOwner
- waitingOn
- nextAction
- blockingItems
- allowedTransitions
- authorityBoundary

The resolver must consume Snowflake-backed records.

The resolver must not recompute governance.

---

# CASE WORKSPACE API

A future endpoint may be:

/api/applicant/cases/[caseId]/workspace

or a shared role-aware equivalent.

The endpoint should:

- require authorization
- resolve applicant session or role session
- load Snowflake-backed case data
- load repository records
- resolve workflow state
- return workspace contract
- fail closed

---

# APPLICANT CASE WORKSPACE PAGE

A future page may be:

/applicant/cases/[caseId]/workspace

or integrated into:

/applicant/cases/[caseId]

The page should:

- show case header
- show next action
- show repository summary
- show timeline
- show applicant-safe panels
- link to repositories
- preserve page layout system

---

# REVIEWER CASE WORKSPACE PAGE

A future reviewer workspace may exist under admin or operations routing.

It should:

- show reviewer next action
- show repository completeness
- show operational blockers
- show workflow transitions where authorized
- link to admin verification surfaces where appropriate

---

# COMPONENT MODEL

Future shared components:

- CaseHeader
- AuthorityBoundaryBanner
- WorkflowSummaryPanel
- NextActionPanel
- BlockingItemsPanel
- RepositorySummaryPanel
- TimelinePanel
- ActivityFeedPanel
- EvidencePanel
- ArtifactPanel
- RequestPanel
- DeficiencyPanel
- RemediationPanel
- ReviewPanel
- DecisionPanel
- CertificationPanel
- WorkspaceLinksPanel

Components must be presentational unless explicitly authorized otherwise.

---

# UI PRINCIPLES

The workspace should be calm, clear, and action-oriented.

Users should see:

- what happened
- what is happening
- what happens next
- who owns it
- what blocks it

Users should not have to decode internal governance or repository concepts.

Applicant copy should be plain-language.

Reviewer copy may be operationally precise.

Governance copy must preserve authority boundaries.

---

# PAGE LAYOUT RULES

The Case Workspace must follow the established GAFAIG Page Layout System.

It must preserve:

- hero layout
- summary card style
- repository card style
- action button style
- table style
- empty-state style
- error-state style

It must not introduce layout drift.

---

# SECURITY RULES

Applicant workspace must be organization-scoped.

Reviewer workspace must require authorized reviewer access.

Governance workspace must require governance authorization.

Certification workspace must require certification authority access.

Administrator workspace must require administrative access.

All workspace APIs must fail closed.

---

# SNOWFLAKE AUTHORITY

Snowflake remains authoritative for:

- cases
- applications
- evidence
- artifacts
- requests
- deficiencies
- remediation
- review status
- decision status
- certification status
- publication status
- registry state
- audit history

The Case Workspace may aggregate Snowflake state.

The Case Workspace may not replace Snowflake state.

---

# GOVERNANCE BOUNDARY

The Case Workspace may show:

- governance review pending
- governance review complete if authorized
- decision pending
- decision issued if authorized

The Case Workspace may not create:

- governance findings
- scoring outcomes
- governance decisions
- certification determinations
- registry publication

---

# CERTIFICATION BOUNDARY

The Case Workspace may show:

- certification not started
- certification ready
- certification issued
- renewal pending
- expiration pending
- suspended
- revoked
- appeal pending
- reinstatement pending

The Case Workspace may not issue or revoke certification.

---

# PUBLICATION BOUNDARY

The Case Workspace may show:

- publication not started
- publication pending
- publication deferred
- published

The Case Workspace may not publish registry records.

---

# AUDIT BOUNDARY

The Case Workspace may display audit history.

The Case Workspace must not alter audit history.

Audit records must remain append-only where applicable.

---

# RELATIONSHIP TO REPOSITORY INTERACTION LAYER

The Repository Interaction Layer remains deferred.

The Case Workspace prepares for Repository Interaction by defining where actions should appear.

Future Repository Interaction actions include:

- upload evidence
- upload artifacts
- respond to information request
- submit remediation
- submit renewal
- submit appeal
- submit reinstatement materials

The Case Workspace tells users when to use those actions.

The Repository Interaction Layer provides the actions.

---

# RELATIONSHIP TO CROSS-LINKING

Repository cross-linking remains future work.

The Case Workspace may display repository summaries without full graph navigation.

Future cross-linking may connect:

- evidence to request
- evidence to artifact
- artifact to certification
- remediation to deficiency
- review to decision
- certification to publication

Cross-linking must not be treated as existing until implemented.

---

# RELATIONSHIP TO UNIFIED TIMELINE

The Case Workspace may introduce a timeline summary in Version 1.

A full unified case timeline may arrive later.

Timeline must preserve deterministic source relationships.

Timeline must not invent events.

---

# RELATIONSHIP TO NOTIFICATIONS

Notifications are future advanced operational automation.

The Case Workspace may expose notification-ready states.

It should not require notification infrastructure in Version 1.

---

# RELATIONSHIP TO ASSIGNMENTS

Assignment management is future operational capability.

The Case Workspace may display current owner.

It should not require full assignment infrastructure in Version 1.

---

# RELATIONSHIP TO SLA TRACKING

SLA tracking is future operational capability.

The Case Workspace may display due dates where available.

It should not invent due dates.

It should not create SLA authority without defined policy.

---

# RELATIONSHIP TO PUBLIC REGISTRY

The Case Workspace may link to public registry records where authorized and published.

The Case Workspace must not treat unpublished certification as public registry state.

---

# RELATIONSHIP TO APPLICANT PORTAL

The Applicant Portal becomes workflow-guided.

Existing repository pages remain.

The case workspace becomes the preferred entry point.

Applicant repository pages remain useful for browsing records.

---

# RELATIONSHIP TO ADMIN PORTAL

The Admin Portal may eventually host reviewer and administrator case workspaces.

Existing admin verification pages remain authoritative for current administrative workflows.

The Case Workspace should not replace existing admin authority without implementation review.

---

# RELATIONSHIP TO GOVERNANCE EXECUTION

Governance execution remains separate.

The Case Workspace may display governance readiness.

The Case Workspace must not advance governance execution without authorized governance mechanisms.

---

# RELATIONSHIP TO DOCUMENTATION SYNCHRONIZATION

Future documentation synchronization should record:

- Case Workspace Architecture established
- Operational Workflow Layer active
- Repository Interaction Layer deferred
- Case-first navigation model adopted
- Repository pages remain supporting operational surfaces

Do not document implementation completion until implemented.

---

# ENGINEERING CONSTRAINTS

Do not re-architect.

Do not modify constitutional authority.

Do not modify governance authority.

Do not move decision authority into UI.

Do not move certification authority into UI.

Do not move registry authority into UI.

Reuse shared repository helpers.

Reuse established applicant page layout.

Maintain Snowflake source of truth.

Maintain fail-closed behavior.

---

# IMPLEMENTATION READINESS CHECKLIST

Before implementation begins:

- OPERATIONAL_WORKFLOW_ARCHITECTURE.md exists
- OPERATIONAL_WORKFLOW_STATE_MACHINE.md exists
- CASE_WORKSPACE_ARCHITECTURE.md exists
- Repository Maturity Layer is build-verified
- Applicant APIs use shared repository layer
- duplicate helper audit is clean
- Applicant Portal pages render successfully
- implementation scope is limited to workflow guidance

---

# VERSION 1 COMPLETION CRITERIA

Case Workspace Version 1 is complete when:

- a user can open a case workspace
- the case header displays
- workflow summary displays
- next action displays
- repository summary displays
- timeline summary displays
- applicant-safe visibility is enforced
- no governance authority is created
- no certification authority is created
- no registry authority is created
- build passes successfully

---

# FINAL DOCTRINE

The Case Workspace is the operational center of the GAFAIG platform.

Repositories remain the operational data layer.

Workflow remains the operational guidance layer.

Governance remains constitutionally controlled.

Certification remains authority-controlled.

Publication remains explicitly authorized.

Snowflake remains the source of truth.

Human governance authority remains supreme.

# APPENDIX A — PANEL CONTRACT MATRIX

## A.1 — Case Header Panel Contract

The Case Header Panel is a canonical workspace section.

Required responsibilities:

- case identity
- organization identity
- current state
- owner
- last updated
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.2 — Workflow Summary Panel Contract

The Workflow Summary Panel is a canonical workspace section.

Required responsibilities:

- current stage
- waiting on
- next action
- blocking items
- allowed transitions
- state source

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.3 — Repository Summary Panel Contract

The Repository Summary Panel is a canonical workspace section.

Required responsibilities:

- record counts
- persisted records
- placeholder records
- latest activity
- repository health
- navigation links

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.4 — Timeline Panel Contract

The Timeline Panel is a canonical workspace section.

Required responsibilities:

- chronological events
- source records
- visibility
- timestamps
- actor role
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.5 — Next Action Panel Contract

The Next Action Panel is a canonical workspace section.

Required responsibilities:

- action owner
- action reason
- priority
- due date
- link target
- fail-closed state

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.6 — Blocking Items Panel Contract

The Blocking Items Panel is a canonical workspace section.

Required responsibilities:

- blocker severity
- blocker owner
- required resolution
- source repository
- visibility
- created timestamp

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.7 — Evidence Panel Contract

The Evidence Panel is a canonical workspace section.

Required responsibilities:

- evidence records
- file metadata
- submission metadata
- status
- links
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.8 — Artifacts Panel Contract

The Artifacts Panel is a canonical workspace section.

Required responsibilities:

- artifact records
- version
- preservation status
- file metadata
- links
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.9 — Requests Panel Contract

The Requests Panel is a canonical workspace section.

Required responsibilities:

- open requests
- responses
- due dates
- response status
- links
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.10 — Deficiencies Panel Contract

The Deficiencies Panel is a canonical workspace section.

Required responsibilities:

- deficiency status
- response required
- description
- due date
- remediation linkage
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.11 — Remediation Panel Contract

The Remediation Panel is a canonical workspace section.

Required responsibilities:

- remediation record
- deficiency linkage
- review pending
- submitted at
- status
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.12 — Review Panel Contract

The Review Panel is a canonical workspace section.

Required responsibilities:

- review stage
- review status
- reviewer type
- estimated completion
- repository activity
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.13 — Decision Panel Contract

The Decision Panel is a canonical workspace section.

Required responsibilities:

- decision status
- decision outcome
- issued flag
- certification readiness
- issued at
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.14 — Certification Panel Contract

The Certification Panel is a canonical workspace section.

Required responsibilities:

- certification status
- validity
- renewal
- publication
- lifecycle
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.15 — Publication Panel Contract

The Publication Panel is a canonical workspace section.

Required responsibilities:

- publication status
- registry status
- consent
- eligibility
- proof
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

## A.16 — Audit History Panel Contract

The Audit History Panel is a canonical workspace section.

Required responsibilities:

- event source
- actor
- timestamp
- visibility
- immutability
- authority boundary

Implementation constraints:

- must consume Snowflake-backed data where available
- must fail closed if required data is unavailable
- must respect role-based visibility
- must preserve organization scope for applicant users
- must not create governance authority
- must not create certification authority
- must not create publication authority
- must not create registry authority

Version 1 behavior:

- may render read-only summary state
- may link to existing repository surfaces
- may display placeholders where persisted records do not exist
- must not imply future Repository Interaction features exist

Future behavior:

- may support direct actions after Repository Interaction Layer implementation
- may support richer cross-linking after Repository Cross-Linking implementation
- may support notifications after Advanced Operational Automation implementation

# APPENDIX B — ROLE WORKSPACE MATRIX

## B.1 — Applicant Workspace View

The Applicant workspace view must present only the information appropriate to that participant.

Core visible elements:

- Case Header
- Authority Boundary
- Workflow Summary
- Next Action
- Blocking Items
- Repository Summary
- Timeline

Role-specific priorities:

- actions waiting on applicant
- open requests
- missing evidence
- deficiencies
- remediation requirements
- certification visibility

Visibility restrictions:

- must not expose unauthorized governance-private information
- must not expose unauthorized administrative diagnostics
- must not expose records outside the authorized scope
- must fail closed when role authorization is uncertain

## B.2 — GAFAIG Operations Reviewer Workspace View

The GAFAIG Operations Reviewer workspace view must present only the information appropriate to that participant.

Core visible elements:

- Case Header
- Authority Boundary
- Workflow Summary
- Next Action
- Blocking Items
- Repository Summary
- Timeline

Role-specific priorities:

- intake review
- evidence review
- response review
- deficiency review
- remediation review
- governance handoff readiness

Visibility restrictions:

- must not expose unauthorized governance-private information
- must not expose unauthorized administrative diagnostics
- must not expose records outside the authorized scope
- must fail closed when role authorization is uncertain

## B.3 — Governance Reviewer Workspace View

The Governance Reviewer workspace view must present only the information appropriate to that participant.

Core visible elements:

- Case Header
- Authority Boundary
- Workflow Summary
- Next Action
- Blocking Items
- Repository Summary
- Timeline

Role-specific priorities:

- governance-ready cases
- supporting evidence
- remediation history
- decision readiness
- authority boundary

Visibility restrictions:

- must not expose unauthorized governance-private information
- must not expose unauthorized administrative diagnostics
- must not expose records outside the authorized scope
- must fail closed when role authorization is uncertain

## B.4 — Certification Authority Workspace View

The Certification Authority workspace view must present only the information appropriate to that participant.

Core visible elements:

- Case Header
- Authority Boundary
- Workflow Summary
- Next Action
- Blocking Items
- Repository Summary
- Timeline

Role-specific priorities:

- certification readiness
- decision linkage
- publication readiness
- renewal
- expiration
- suspension and revocation pathways

Visibility restrictions:

- must not expose unauthorized governance-private information
- must not expose unauthorized administrative diagnostics
- must not expose records outside the authorized scope
- must fail closed when role authorization is uncertain

## B.5 — Platform Administrator Workspace View

The Platform Administrator workspace view must present only the information appropriate to that participant.

Core visible elements:

- Case Header
- Authority Boundary
- Workflow Summary
- Next Action
- Blocking Items
- Repository Summary
- Timeline

Role-specific priorities:

- blocked states
- access failures
- organization mapping failures
- source query failures
- ambiguous workflow states
- operational exceptions

Visibility restrictions:

- must not expose unauthorized governance-private information
- must not expose unauthorized administrative diagnostics
- must not expose records outside the authorized scope
- must fail closed when role authorization is uncertain

# APPENDIX C — STATE TO WORKSPACE PRESENTATION MATRIX

## C.1 — APPLICATION_SUBMITTED

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.2 — APPLICATION_INCOMPLETE

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.3 — APPLICATION_HOLD

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.4 — INTAKE_REVIEW

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.5 — EVIDENCE_REVIEW

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.6 — INFORMATION_REQUEST

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.7 — APPLICANT_RESPONSE

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.8 — EVIDENCE_VALIDATION

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.9 — DEFICIENCY_IDENTIFIED

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.10 — REMEDIATION_REQUIRED

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.11 — REMEDIATION_SUBMITTED

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.12 — REMEDIATION_REVIEW

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.13 — GOVERNANCE_REVIEW

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.14 — DECISION_PENDING

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.15 — DECISION_ISSUED

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.16 — CERTIFICATION_READY

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.17 — CERTIFICATION_ISSUED

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.18 — PUBLICATION_PENDING

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.19 — PUBLISHED

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.20 — CERTIFICATION_ACTIVE

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.21 — RENEWAL_PENDING

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.22 — EXPIRATION_PENDING

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.23 — EXPIRED

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.24 — SUSPENSION_PENDING

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.25 — SUSPENDED

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.26 — REVOCATION_PENDING

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.27 — REVOKED

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.28 — APPEAL_PENDING

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.29 — REINSTATEMENT_PENDING

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

## C.30 — CASE_CLOSED

Workspace presentation requirements:

- display state code in workflow summary
- display human-readable stage label
- display current owner
- display waiting-on participant
- display next required action
- display supporting repository summary
- display relevant timeline events
- display authority boundary

Fail-closed behavior:

- if required source data is unavailable, show a safe unresolved workflow condition
- do not infer governance decision
- do not infer certification issuance
- do not infer publication

# APPENDIX D — IMPLEMENTATION GUARDRAILS

## D.1 — Guardrail

Do not re-architect constitutional authority.

## D.2 — Guardrail

Do not move governance authority into workspace components.

## D.3 — Guardrail

Do not move certification authority into workspace components.

## D.4 — Guardrail

Do not move registry publication authority into workspace components.

## D.5 — Guardrail

Do not bypass Snowflake-backed state.

## D.6 — Guardrail

Do not expose applicant data across organizations.

## D.7 — Guardrail

Do not duplicate repository helper logic.

## D.8 — Guardrail

Do not create direct upload actions before Repository Interaction Layer implementation.

## D.9 — Guardrail

Do not treat repository cross-linking as implemented until implemented.

## D.10 — Guardrail

Do not treat unified timeline as complete until implemented.

## D.11 — Guardrail

Do not treat workflow guidance as governance determination.

## D.12 — Guardrail

Do not treat certification readiness as certification issuance.

## D.13 — Guardrail

Do not treat publication readiness as registry publication.

# APPENDIX E — FINAL COMPLETION DOCTRINE

- The Case Workspace is complete when a participant can open a case and understand what must happen next without inspecting every repository.
- The Case Workspace is complete when every visible next action is role-appropriate.
- The Case Workspace is complete when every workflow state is sourced from Snowflake-backed records or safe deterministic absence.
- The Case Workspace is complete when every authority boundary is explicit.
- The Case Workspace is complete when repository data supports workflow rather than replacing workflow.
- The Case Workspace is complete when applicants, reviewers, governance reviewers, certification authorities, and administrators each receive their own safe operational view.
- The Case Workspace is complete when fail-closed behavior is preserved.
- The Case Workspace is complete when Snowflake remains the source of truth.
- The Case Workspace is complete when human governance authority remains supreme.

END OF FILE
