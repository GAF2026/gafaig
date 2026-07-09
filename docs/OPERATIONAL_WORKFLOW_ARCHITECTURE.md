# OPERATIONAL_WORKFLOW_ARCHITECTURE.md

Last Updated: 2026-06-27

# PURPOSE

This document defines the canonical Operational Workflow Layer for the
Global Authority for AI Governance (GAFAIG).

The Operational Workflow Layer exists to guide human participants
through deterministic operational processes while preserving the
constitutional governance model.

The Operational Workflow Layer:

-   does not create governance authority
-   does not create findings authority
-   does not create scoring authority
-   does not create decision authority
-   does not create certification authority
-   does not create publication authority
-   does not create registry authority

Snowflake remains the source of truth.

Human governance authority remains supreme.

------------------------------------------------------------------------

# POSITION WITHIN THE PLATFORM

Platform Architecture:

1.  Constitutional Architecture
2.  Governance Architecture
3.  Applicant Lifecycle Architecture
4.  Repository Maturation Layer
5.  Operational Workflow Layer
6.  Repository Interaction Layer
7.  Advanced Operational Automation

Repository Maturity provides operational visibility.

Operational Workflow provides operational guidance.

Repository Interaction enables users to perform workflow actions.

------------------------------------------------------------------------

# DESIGN PRINCIPLES

1.  Workflow guides humans.
2.  Workflow consumes deterministic Snowflake state.
3.  Workflow never recomputes governance.
4.  Workflow never bypasses constitutional authority.
5.  Workflow is fail-closed.
6.  Workflow is organization-scoped where applicable.
7.  Repository pages support workflow; they do not define workflow.
8.  Every workflow stage has one clearly identified owner.
9.  Every workflow stage exposes a deterministic next action.
10. Every workflow transition is auditable.

------------------------------------------------------------------------

# OPERATIONAL PARTICIPANTS

## Applicant

Responsible for:

-   submitting applications
-   responding to information requests
-   uploading evidence
-   submitting remediation
-   reviewing certification status
-   renewing certifications

## GAFAIG Operations Reviewer

Responsible for:

-   intake review
-   evidence review
-   repository validation
-   information request issuance
-   deficiency issuance
-   remediation review

## Governance Reviewer

Responsible for governance review only.

## Certification Authority

Responsible for certification issuance following governance approval.

## Platform Administrator

Responsible for operational administration, monitoring, routing, and
platform support.

------------------------------------------------------------------------

# CANONICAL OPERATIONAL STAGES

1.  Application Submitted
2.  Intake Review
3.  Evidence Review
4.  Information Request
5.  Applicant Response
6.  Evidence Validation
7.  Deficiency
8.  Remediation
9.  Remediation Review
10. Governance Review
11. Decision
12. Certification
13. Publication
14. Renewal
15. Expiration
16. Appeal
17. Reinstatement

Each stage has:

-   current owner
-   current status
-   next required action
-   completion criteria
-   transition criteria

------------------------------------------------------------------------

# NEXT ACTION ENGINE

Every case SHALL expose:

-   Current Stage
-   Current Owner
-   Next Required Action
-   Waiting On
-   Blocking Items
-   Estimated Completion

The platform SHALL always answer:

"What should this participant do next?"

Workflow guidance replaces repository-first navigation.

------------------------------------------------------------------------

# CASE WORKSPACE

The case becomes the primary operational workspace.

Primary navigation:

Dashboard

↓

My Cases

↓

Case Workspace

Within the Case Workspace:

-   Timeline
-   Current Stage
-   Next Action
-   Repository Summary
-   Evidence
-   Artifacts
-   Requests
-   Information Requests
-   Deficiencies
-   Remediation
-   Review
-   Decision
-   Certification
-   History

Repositories remain supporting operational surfaces.

------------------------------------------------------------------------

# REPOSITORY RELATIONSHIP

Version 1 Repository Maturity remains authoritative.

Repositories provide:

-   workflow visibility
-   persisted records
-   lifecycle visibility

Workflow determines navigation and user guidance.

------------------------------------------------------------------------

# WORKFLOW TRANSITIONS

Transitions occur only through deterministic operational events.

Examples:

-   Evidence uploaded
-   Information request issued
-   Response submitted
-   Deficiency issued
-   Remediation submitted
-   Review completed
-   Governance review completed
-   Decision recorded
-   Certification issued
-   Publication authorized

Workflow never changes governance authority.

------------------------------------------------------------------------

# SNOWFLAKE AUTHORITY

Snowflake remains the source of truth.

Operational Workflow consumes Snowflake data.

Operational Workflow never creates governance outcomes.

Operational Workflow never replaces deterministic governance execution.

------------------------------------------------------------------------

# APPLICANT EXPERIENCE

Applicants should always know:

-   what stage their case is in
-   what action is required
-   who currently owns the case
-   whether they are waiting on GAFAIG
-   whether GAFAIG is waiting on them

Applicants should never have to determine workflow by navigating
repositories.

------------------------------------------------------------------------

# REVIEWER EXPERIENCE

Reviewers should always know:

-   which case requires attention
-   what action is required
-   what repositories support the review
-   whether blocking conditions exist

------------------------------------------------------------------------

# ENGINEERING RULES

Do not re-architect constitutional governance.

Do not compute governance outcomes in the workflow layer.

Do not duplicate Snowflake state.

Maintain fail-closed behavior.

Maintain organization-scoped visibility.

Preserve deterministic governance.

------------------------------------------------------------------------

# IMPLEMENTATION ROADMAP

Completed:

-   Constitutional Architecture
-   Governance Architecture
-   Applicant Lifecycle
-   Repository Maturity Layer

Current Implementation Era:

Operational Workflow Layer

Future:

Repository Interaction Layer

Future:

Advanced Operational Automation

------------------------------------------------------------------------

# SUCCESS CRITERIA

The Operational Workflow Layer is considered complete when:

-   every participant has a deterministic workflow
-   every case exposes a next action
-   repositories function as supporting operational surfaces
-   workflow navigation replaces repository-first navigation
-   no constitutional or governance authority has been modified

END OF FILE
