# GAFAIG — MASTER STATE
Authoritative Project Memory  
Last Updated: 2026-03-14

---

# Platform Overview

GAFAIG is the world’s first searchable AI governance registry.

It functions as global trust infrastructure that verifies organizations and AI systems against governance standards using deterministic scoring and verifiable evidence.

GAFAIG operates as a neutral global verification registry similar in role to:

• financial audit infrastructure  
• certificate authorities  
• regulatory registries  
• international standards bodies  

The platform provides two major layers:

1. Private verification engine
2. Public transparency registry

---

# System Architecture Overview

GAFAIG operates as a two-layer architecture.

PRIVATE LAYER  
Verification Engine

PUBLIC LAYER  
Global AI Governance Registry

The private layer evaluates governance compliance.  
The public layer provides transparent registry verification results.

---

# System Data Flow

The high-level governance verification lifecycle is:

Submission  
↓  
Application  
↓  
Participants  
↓  
Findings  
↓  
Evidence  
↓  
Events  
↓  
Scoring  
↓  
Decision  
↓  
Registry Publication  

Private verification data remains restricted.

Only controlled verification disclosures are published to the registry.

---

# Private Verification Engine

The private verification layer manages governance evaluation.

Verification workflow:

Findings → Evidence → Events → Scoring → Decision

Key characteristics:

• Snowflake-backed deterministic scoring engine  
• organization-isolated verification cases  
• stored procedures enforce least privilege  
• auditable SQL scoring logic  
• reproducible governance scoring  

Outputs:

• verification decision  
• governance tier classification  
• governance band classification  
• scoring breakdown  
• renewal trigger timeline  

Evidence and detailed findings are visible only to:

• authorized reviewers  
• regulators (when granted)  
• the verified organization

---

# Public Registry Layer

The public registry provides transparency without exposing private evidence.

Published registry information includes:

• organization name  
• AI system name  
• verification status  
• governance tier  
• governance band  
• standard version verified  
• verification timestamp  
• verification proof ID  

The registry defines what “Verified” means by linking to:

• governance standards  
• scoring methodology  
• verification framework  

---

# Strategic Positioning

GAFAIG is not simply:

• a scoring dashboard  
• an admin application  
• a compliance database  

GAFAIG is:

A global AI governance registry with enforceable verification logic.

This positions GAFAIG closer to:

• financial audit infrastructure  
• certificate authorities  
• regulatory registries  
• international standards bodies  

---

# Snowflake Architecture

GAFAIG uses Snowflake as the authoritative system of record for governance verification data and scoring logic.

The verification engine is implemented using deterministic SQL logic, stored procedures, and views within the Snowflake environment.

### Snowflake Environment

Account  
duglhtd-cm14952

Database  
GAFAIG_DB

Primary Schema  
CORE

Application Role  
GAFAIG_APP_ROLE

Warehouse  
GAFAIG_WH

Authentication  
Key-pair authentication

Application user  
GAFAIG_APP_USER

---

# Core Snowflake Tables

CORE.SUBMISSIONS  
Initial verification requests submitted by organizations.

CORE.APPLICATIONS  
Approved verification applications.

CORE.PARTICIPANTS  
Organizations or entities participating in verification.

CORE.FINDINGS  
Governance control findings associated with verification cases.

CORE.EVIDENCE  
Evidence artifacts supporting governance findings.

CORE.EVENTS  
Verification lifecycle events.

CORE.CASE_SCORE_SNAPSHOTS  
Recorded scoring outcomes for verification cases.

CORE.DECISIONS  
Final verification decisions.

CORE.REGISTRY_AI_SYSTEMS  
Registry records of verified AI systems.

---

# Core Snowflake Views

CORE.V_ADMIN_SUBMISSIONS  
Unified admin view used by the Admin Applications UI.

CORE.VERIFICATION_CASE_DETAIL  
Comprehensive verification case data view.

CORE.PUBLIC_REGISTRY  
Public registry view of verified organizations.

CORE.REGISTRY_AI_SYSTEMS_PUBLIC  
Public view of verified AI systems.

---

# Deterministic Governance Scoring Engine

GAFAIG uses a deterministic scoring engine implemented in Snowflake.

The scoring model evaluates governance compliance using four major components.

Controls Score  
Measures governance control implementation.

Coverage Score  
Measures coverage of governance domains.

Freshness Score  
Measures recency and maintenance of governance evidence.

Summaries Score  
Measures documentation completeness and reporting.

The deterministic scoring engine produces:

• overall governance score  
• governance tier classification  
• governance band classification  

These outputs are recorded in:

CORE.CASE_SCORE_SNAPSHOTS

---

# Registry Publication Engine

Verification outcomes are published to the public registry through controlled registry publishing logic.

Publication occurs when:

Verification status = APPROVED

The publication process writes registry records to:

CORE.REGISTRY_AI_SYSTEMS

Public registry views expose only approved verification records.

Private evidence and findings remain restricted to authorized roles.

---

# Repository Architecture

GitHub Repository

GAF2026/gafaig

The GAFAIG repository contains the web application, Snowflake SQL architecture, governance scoring engine logic, and documentation for the global AI governance registry.

The platform is built using:

Next.js  
TypeScript  
Snowflake  
Vercel

---

# High-Level Project Structure

The repository is organized into several major directories.

components/  
Reusable React UI components used across the platform.

docs/  
Permanent project documentation and architecture reference.

lib/  
Core application logic including Snowflake connectivity, authentication logic, and registry helpers.

sql/  
Snowflake database architecture and registry schema.

types/  
TypeScript type definitions used across the application.

---

# Core Application Libraries

lib/

Contains the core runtime logic used by the GAFAIG application.

Key modules include:

auth/  
Admin authentication and session management.

http/  
HTTP request helpers.

registry/  
Registry API helpers and URL construction.

email/  
Notification and email delivery utilities.

constants/  
Shared constants used throughout the application.

---

# Type Definitions

types/

TypeScript type definitions used across the platform.

Examples:

registry.ts  
Defines registry object structures and types.

env.d.ts  
Defines environment variable types.

ids.ts  
Defines identifier formats used throughout the platform.

---

# Deterministic Identifier Model

GAFAIG identifiers must remain deterministic across:

• Snowflake  
• Next.js application  
• Public registry  

Examples:

CASE_ID  
REGISTRY_ID  
VERIFICATION_ID  

Identifier definitions are maintained in:

types/ids.ts

---

# Snowflake SQL Architecture

sql/

Contains the SQL architecture used to create the governance verification engine.

Subdirectories include:

core/  
Core Snowflake objects.

registry/  
Registry publishing logic.

migrations/  
Database migration scripts.

security/  
Role grants and access control logic.

demo/  
Demo data seeding scripts.

---

# Deployment Architecture

GAFAIG is deployed as a web application hosted on Vercel with Snowflake as the authoritative backend.

Production URL

https://www.gafaig.com

Hosting Platform

Vercel

Vercel Project

gafaig-vercel

GitHub Repository

GAF2026/gafaig

---

# Deployment Flow

Local development  
→ Git commit  
→ GitHub push  
→ Vercel build and deployment  
→ Production site update

This means the GitHub repository is the source code origin, and Vercel is the deployment surface for the public application.

---

# Runtime Architecture

Frontend  
Next.js application

Backend data layer  
Snowflake

Hosting  
Vercel

Authentication  
Signed admin session cookie

Environment model  
Local `.env.local` for development  
Vercel environment variables for production

---

# Environment Variables

### Vercel Environment Variables

GAFAIG_ADMIN_DEMO_PASSWORD  
NEXT_PUBLIC_DEMO_PASSWORD  
GAFAIG_SESSION_SECRET  
GAFAIG_ADMIN_PASSWORD  
SNOWFLAKE_PRIVATE_KEY  
SNOWFLAKE_USERNAME  
SNOWFLAKE_USER  
GAFAIG_VERIFY_SIGNING_SECRET  
SNOWFLAKE_ACCOUNT  
SNOWFLAKE_WAREHOUSE  
SNOWFLAKE_DATABASE  
SNOWFLAKE_SCHEMA  
SNOWFLAKE_ROLE  

### Local Environment Variables (.env.local)

GAFAIG_SESSION_SECRET  
GAFAIG_ADMIN_PASSWORD  
GAFAIG_ADMIN_DEMO_PASSWORD  
NEXT_PUBLIC_DEMO_PASSWORD  
SNOWFLAKE_ACCOUNT  
SNOWFLAKE_USERNAME  
SNOWFLAKE_WAREHOUSE  
SNOWFLAKE_DATABASE  
SNOWFLAKE_SCHEMA  
SNOWFLAKE_ROLE  
SNOWFLAKE_PRIVATE_KEY_PATH  
NODE_ENV  
NEXT_PUBLIC_SITE_URL  

---

# Routes and URL Map

GAFAIG includes public platform pages, public registry surfaces, admin routes, and API routes.

### Public Pages

/  
Homepage

/mission  
Public mission and purpose of GAFAIG.

/framework  
Public explanation of the governance framework and standards logic.

/registry  
Public registry landing surface.

/registry/ai-systems  
Public searchable registry of AI systems.

---

### Admin Pages

/admin/login  
Admin login surface.

/admin/applications  
Admin applications dashboard.

/admin/verification  
Admin verification cases index.

/admin/verification/[caseId]  
Verification case detail page.

/admin/verification/[caseId]/score  
Verification score detail page.

/admin/verification/[caseId]/evidence  
Verification evidence page.

/admin/verification/[caseId]/findings  
Verification findings page.

---

### API Routes

/api/admin/verification  
Admin verification API surface.

/api/registry/search  
Public registry search API.

/api/verify/[id]  
Verification or proof lookup API.

/api/registry/ai-systems  
Public AI systems registry API.

---

# Snowflake Worksheet Inventory

The following worksheet files represent the Snowflake buildout and operational scripts used for GAFAIG.

### Core and Governance Worksheets

DDL Snapshot - 2026-02-26.sql  
GAFAIG - Admin Unified View.sql  
GAFAIG - APP_ROLE Smoke.sql  
GAFAIG - CORE.REGISTRY_PUBLISH.sql  
GAFAIG - Demo Evidence Summaries.sql  
GAFAIG - GET_DDL Export.sql  
GAFAIG - Governance Scoring (Enterprise v1.0).sql  
GAFAIG - Governance Scoring.sql  
GAFAIG - Grants.sql  
GAFAIG - Migration - Snapshot Tier Band Backfill.sql  
GAFAIG - Registry AI Systems Backfill.sql  
GAFAIG - Registry AI Systems Registry View.sql  
GAFAIG - Scoring Model v1.0 + Registry.sql  
GAFAIG - Security Grants.sql  
GAFAIG - Applications Setup & Grants.sql  
GAFAIG - Core Setup.sql  
GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql  
GAFAIG - Verification Workflow Schema (Draft).sql  
GAFAIG - Verification Workflow Schema.sql  
GAFAIG - Deterministic Governance Scoring Engine v1.0.sql  
GAFAIG - Public Registry Search View.sql  
GAFAIG - Public Registry Surface.sql  
GAFAIG - True Global Registry Identity.sql  

---

### Environment Setup Worksheets

00_CORE_SETUP.sql  
01_REBUILD_ENVIRONMENT.sql  

---

### Table Build Worksheets

10_TABLES_SUBMISSIONS.sql  
11_TABLES_APPLICATIONS.sql  
12_TABLES_PARTICIPANTS.sql  
13_TABLES_FINDINGS.sql  
14_TABLES_EVIDENCE.sql  
14_TABLES_REGISTRY_AI_SYSTEMS.sql  
15_TABLES_EVENTS.sql  
16_TABLES_CASE_SCORE_SNAPSHOTS.sql  
17_TABLES_DECISIONS.sql  

---

### View Build Worksheets

20_VIEWS_VERIFICATION_CASE_DETAIL.sql  
21_VIEWS_PUBLIC_REGISTRY.sql  
22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

---

### Public Access and Grant Worksheets

23_GRANTS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  
24_GRANTS_AND_DIAGNOSTICS_PUBLIC_VIEWS.sql  

---

### Demo Data Worksheets

30_DEMO_DATA_SEEDING.sql  
31_DEMO_DECISIONS_SEEDING.sql  
32_DEMO_REGISTRY_AI_SYSTEMS_SEED.sql  
33_DEMO_PARTICIPANTS_CURATED_SEED.sql  

---

### Automation and Diagnostics Worksheets

40_PARTICIPANTS_AUTOSYNC.sql  
98_ENVIRONMENT_DIAGNOSTICS_REGISTRY.sql  
99_ENVIRONMENT_DIAGNOSTICS.sql  

---

# Current Platform Status

GAFAIG is currently operating as a working platform with a Snowflake-backed verification engine and a Next.js application deployed to Vercel.

Production URL

https://www.gafaig.com

The platform includes both the verification engine and the public-facing registry surfaces.

---

# Work Completed (Recent Phase)

### Public Platform

• homepage updated  
• mission page implemented  
• governance framework page implemented  
• registry landing page implemented  
• AI systems registry page implemented  

### Verification Engine

• deterministic governance scoring engine implemented  
• verification workflow schema implemented  
• case scoring snapshots implemented  
• decision model implemented  

### Registry Infrastructure

• registry AI systems table created  
• public registry views created  
• registry publication logic implemented  

### Admin Surfaces

• admin login flow implemented  
• admin applications dashboard implemented  
• verification case workflows implemented  

### Security and Hardening

• signed admin session cookies  
• Snowflake role-based access model  
• scoped application user privileges  
• view and stored procedure access control  

### Deployment

• GitHub repository operational  
• Vercel deployment connected  
• production site running  

---

# Current Development Phase

Surface the Engine

The current phase focuses on exposing the registry and verification infrastructure to the public platform.

Key objectives:

• global AI system registry  
• certification publish automation  
• public verification proof lookup  
• verification badge system  

---

# Next Major Features

### Global AI Registry

/registry/ai-systems

### Certification Publish Automation

Automatically publish approved verification results into the public registry.

### Verification Badge API

Example endpoint:

/api/verify/[verification_id]

### Registry Search

Public search interface for AI systems.

---

# Project Philosophy

GAFAIG is designed as neutral global trust infrastructure.

The goal is not simply governance scoring.

The goal is to create:

A global registry of verified AI governance.

This allows organizations and AI systems to prove governance compliance in a transparent and auditable way.

---

# New Chat Starter Block

When starting a new development chat for GAFAIG, paste the following:

Please treat `docs/MASTER_STATE.md` as the canonical architecture and platform memory for GAFAIG.

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

Do not re-architect the platform. Continue development from the current architecture.