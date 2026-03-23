# GAFAIG — UI COMPONENT MAP
Canonical UI Structure & Responsibilities
Last Updated: 2026-03-22

---

# PURPOSE

This document defines:

• all major UI routes  
• key components per route  
• data sources for each component  
• mapping between UI and API/query layer  

This prevents:

• UI pulling wrong data  
• duplicate rendering logic  
• inconsistent certification display  
• confusion between pages  

---

# CORE PRINCIPLE

UI is a **pure rendering layer**

It must:

• display data only  
• not compute certification  
• not infer governance logic  
• rely entirely on API/query layer  

---

# DATA FLOW

Snowflake  
→ Query Layer  
→ API Route  
→ UI Component  

---

# PUBLIC UI ROUTES

## 1. /registry/ai-systems

### Purpose
Display all registered AI systems globally.

---

### Data Source

API:
`/api/registry/ai-systems`

Query:
`CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC`

---

### Key Components

#### RegistryPage (page.tsx)

Top-level container.

Responsibilities:

• fetch data  
• pass to child components  
• manage loading state  

---

#### RegistryTable / RegistryGrid

Displays list of systems.

Columns:

• System Name  
• Organization (ENTITY_NAME)  
• Registry ID  
• Certified Tier  
• Certified Band  
• Certified Score  
• Decision Status  

---

#### RegistryFilters

Optional filtering UI.

Future fields:

• country  
• tier  
• band  

---

#### RegistrySummaryStats

Top-level metrics:

• total systems  
• total organizations  
• total countries  

---

### Required Field Mapping

UI must use:

certifiedTier → CERTIFIED_TIER  
certifiedBand → CERTIFIED_BAND  
certifiedScore → CERTIFIED_SCORE  
certifiedAt → CERTIFIED_AT  
decisionStatus → DECISION_STATUS  

---

## 2. /registry/ai-systems/[registryId]

### Purpose
Display details for a specific registry entry.

---

### Data Source

API:
`/api/registry/ai-systems/[registryId]`

Query:
`CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC`

---

### Key Components

#### RegistryDetailPage

Top-level page.

Responsibilities:

• fetch system(s) by REGISTRY_ID  
• pass to detail components  

---

#### RegistryHeader

Displays:

• System Name  
• Registry ID  
• Organization  
• Verification Type  

---

#### CertificationPanel

Core certification display.

Fields:

• Certified Tier  
• Certified Band  
• Certified Score  
• Certified At  
• Decision Status  

---

#### SystemMetadataPanel

Displays:

• Intended Use  
• System Type  
• Deployment Status  
• Risk Tier  
• Oversight Model  
• Evaluation Protocol  

---

#### GovernanceSummary

Optional future component:

• breakdown of score  
• subscores  
• events  

---

# ADMIN UI ROUTES

## 3. /admin/applications

### Purpose
View intake applications.

---

### Components

#### ApplicationsTable

Displays:

• application ID  
• entity  
• status  

---

## 4. /admin/verification/[caseId]

### Purpose
Case-level verification workflow.

---

### Components

#### FindingsPanel

• create/update findings  

#### EvidencePanel

• attach evidence  

#### EventsPanel

• track events  

#### DecisionPanel

• approve / reject case  

#### ScorePanel

• display score  

---

## 5. /admin/verification/[caseId]/score

### Purpose
Score inspection.

---

### Components

#### ScoreBreakdown

Displays:

• subscores  
• weighted calculations  

---

# COMPONENT RESPONSIBILITY RULES

## DO

• display data passed from API  
• format values for readability  
• handle loading / empty states  

---

## DO NOT

• compute certification  
• derive score logic  
• infer tier/band  
• modify backend data  

---

# CERTIFICATION DISPLAY RULE

UI must ONLY display:

CERTIFIED_SCORE  
CERTIFIED_TIER  
CERTIFIED_BAND  
CERTIFIED_AT  
DECISION_STATUS  

Never display raw SCORE/TIER/BAND as certification.

---

# ERROR PREVENTION

## Common mistake

Using:

r.TIER  
r.BAND  
r.SCORE  

Instead of:

r.CERTIFIED_TIER  
r.CERTIFIED_BAND  
r.CERTIFIED_SCORE  

---

# STATE MANAGEMENT

Minimal state required:

• loading  
• error  
• data  

No derived governance state in frontend.

---

# FUTURE COMPONENTS

## Certification Badge

Visual indicator:

• Certified  
• Not Certified  

---

## Registry Search

Search by:

• system name  
• organization  
• registry ID  

---

## Public Verification Widget

Embeddable component using:

`/api/verify/[registryId]`

---

# CURRENT PRIORITY

Fix UI to correctly display certification fields from query layer.

---

# SUCCESS CRITERIA

• Registry list shows certified fields  
• Detail page shows certification breakdown  
• No fallback to raw score fields  
• UI reflects true registry state  

---

# FINAL RULE

UI reflects truth — it does not create truth.

---

END OF FILE