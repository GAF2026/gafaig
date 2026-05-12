GAFAIG_APPLICATION_INTAKE_EXPANSION_PLAN.md

Last Updated: 2026-05-12

PURPOSE

This document defines the planned expansion strategy for the GAFAIG application intake system.

The purpose of this expansion is to allow GAFAIG to support:

small organizations
startups
universities
enterprises
multinational organizations
multi-division organizations
multi-jurisdiction organizations
organizations operating multiple AI systems
future governance topology expansion

WITHOUT:

alienating smaller applicants
forcing enterprise complexity on simple applicants
destabilizing the deterministic trust core
prematurely implementing full enterprise topology infrastructure

This document is a planning document only.

It does not authorize immediate implementation of full enterprise topology infrastructure.

CORE PRINCIPLE

The GAFAIG intake experience must remain:

Simple by default
Expandable when needed

The intake must not assume:

enterprise scale
multinational structure
governance complexity
multiple AI systems
multiple departments

Most applicants should be able to complete the application quickly with a minimal workflow.

Advanced structure should expand progressively only when required.

PRIMARY UX GOAL

The /apply experience must avoid:

enterprise intimidation

Small organizations, startups, labs, and independent AI organizations must not feel:

excluded
overwhelmed
unqualified
structurally incompatible

The intake experience should feel approachable while still supporting future enterprise governance complexity.

CURRENT STATE

The current GAFAIG intake model primarily supports:

Organization
→ Application
→ Verification Case
→ AI System
→ Certification

This model is sufficient for:

single organizations
single AI systems
single contacts
basic governance intake

The current architecture already supports future expansion because:

Snowflake is canonical
registry is append-only
AI systems are modeled separately
organizations are modeled separately
countries are modeled separately
lifecycle/renewal infrastructure exists
governance observability infrastructure exists
EXPANSION OBJECTIVES

The intake expansion should eventually support:

multiple AI systems
multiple contacts
departments
divisions
business units
subsidiaries
multiple jurisdictions
regional deployments
certification scope boundaries
future governance topology relationships

WITHOUT requiring those structures for standard applicants.

IMPLEMENTATION STRATEGY

The intake system should evolve progressively.

The correct order is:

1. Progressive UX expansion
2. Optional metadata support
3. Enterprise intake structure
4. Governance topology planning
5. Future topology implementation

NOT:

Immediate enterprise hierarchy implementation
PHASE 1 — PROGRESSIVE UX EXPANSION

Status:
Recommended near-term implementation.

Goal:
Allow advanced governance structure only when needed.

DEFAULT APPLICANT FLOW

The default intake flow should remain simple.

Recommended default sections:

Step 1 — Organization
Step 2 — Contact
Step 3 — AI System
Step 4 — Governance Scope
Step 5 — Review + Submit

Most applicants should complete the form without interacting with advanced governance structure.

DEFAULT REQUIRED FIELDS

Recommended minimum fields:

Organization Name
Organization Website
Country
Primary Contact Name
Primary Contact Email
AI System Name
AI System Purpose
Certification Scope

These fields should remain lightweight.

ADVANCED STRUCTURE SECTION

An expandable section should exist:

Advanced organization structure

Collapsed by default.

Recommended helper text:

Most applicants can leave this section closed.
Use this only if your organization needs to describe multiple teams, divisions, countries, AI systems, or certification boundaries.
ADVANCED STRUCTURE TRIGGER

Recommended question:

Does this application involve multiple departments, divisions, countries, AI systems, or governance boundaries?

○ No — single organization / single system
○ Yes — more complex organization structure

Only selecting “Yes” should expand advanced structure fields.

PHASE 2 — OPTIONAL METADATA EXPANSION

Status:
Safe future expansion.

This phase introduces optional metadata only.

No inheritance engines.
No topology propagation.
No governance graph logic.

OPTIONAL CONTACT TYPES

Future optional contacts:

Compliance Contact
Technical Contact
Security Contact
Legal Contact
Department Owner
Regional Contact
AI System Owner
Renewal Contact

Only primary contact should remain required initially.

OPTIONAL ORGANIZATIONAL FIELDS

Future optional fields:

Division Name
Department Name
Business Unit
Parent Organization
Subsidiary Name
Deployment Region
Jurisdiction Scope

These fields should remain optional metadata initially.

OPTIONAL AI SYSTEM EXPANSION

Future optional support:

Add another AI system

Each AI system may later include:

System Name
Purpose
Department
Deployment Region
Jurisdiction
Lifecycle State
Risk Category
Model Version
CERTIFICATION SCOPE MODEL

One of the most important future fields.

Recommended options:

○ One AI system
○ Multiple AI systems
○ One department / business unit
○ One country / regional deployment
○ Entire organization
○ Other / not sure

“Other / not sure” is important for reducing applicant friction.

ENTERPRISE UX RULES

Enterprise structure must never dominate the intake experience.

Advanced structure must:

remain optional
remain collapsed by default
use approachable language
avoid enterprise jargon
avoid governance overload
avoid topology terminology in early phases

Avoid:

Describe your governance hierarchy
Describe your enterprise topology
Describe inheritance boundaries

Prefer:

Does your organization have multiple teams, divisions, or AI systems involved?
SMALL ORGANIZATION UX RULES

The intake must remain welcoming for:

startups
small companies
labs
universities
nonprofits
independent AI organizations

The platform must avoid signaling that:

only large enterprises qualify
governance requires complex bureaucracy
multiple departments are expected

The intake should feel:

accessible

not:

enterprise-exclusive
ENTERPRISE TOPOLOGY PLANNING

The intake expansion prepares for future topology-aware governance.

Future governance structures may eventually support:

Enterprise
→ Legal Entity
→ Jurisdiction
→ Division
→ Department
→ AI System
→ Deployment
→ Model Version
→ Certification Scope

However:

This document does NOT authorize implementation of:

inheritance engines
governance propagation engines
topology graph systems
federation engines
jurisdiction propagation logic

Those belong to future phases.

CURRENT IMPLEMENTATION LIMIT

The current objective is:

collect optional structure metadata safely

NOT:

fully model enterprise governance topology

This distinction is critical.

WHY THIS APPROACH IS IMPORTANT

Implementing full enterprise topology infrastructure too early risks:

destabilizing deterministic trust logic
schema explosion
governance complexity explosion
enterprise overengineering
onboarding friction
certification ambiguity
operational instability

The deterministic trust core must remain protected.

AI LAYER ROLE

The AI governance layer may eventually assist with:

governance boundary detection
topology analysis
jurisdiction conflict detection
governance overlap detection
recertification propagation analysis
deployment relationship analysis
governance drift propagation

However:
AI remains advisory only.

AI does not:

certify
authorize publication
determine trust
override human governance
FUTURE IMPLEMENTATION TRIGGERS

Full topology implementation should occur only when:

enterprise customers require it operationally
multinational governance becomes common
cross-jurisdiction governance becomes necessary
governance inheritance becomes operationally necessary
federation requirements emerge
AI deployment complexity exceeds flat organization models
RECOMMENDED NEAR-TERM IMPLEMENTATION

Safe near-term additions:

1. Expandable advanced structure section
2. Multiple optional contacts
3. Optional division / department fields
4. Optional deployment region fields
5. Optional certification scope selection
6. Optional additional AI systems

These changes are relatively safe because they:

preserve deterministic trust
preserve append-only publication
preserve certification authority boundaries
avoid topology propagation complexity
NOT YET RECOMMENDED

Do NOT yet implement:

enterprise inheritance engines
governance propagation
certification graph logic
distributed governance orchestration
automatic recertification propagation
topology-aware lifecycle engines
jurisdiction inheritance engines
federation logic

These belong to later enterprise governance phases.

STRATEGIC DIRECTION

GAFAIG is evolving from:

static certification infrastructure

toward:

adaptive governance infrastructure

and eventually toward:

adaptive multi-jurisdiction governance topology infrastructure

This intake expansion is an early preparation layer for that future.

FINAL PRINCIPLE

The GAFAIG intake system must remain:

welcoming to simple applicants

while becoming:

capable of supporting enterprise governance complexity

without forcing enterprise complexity onto every applicant.

The deterministic trust core remains the priority.

END OF FILE