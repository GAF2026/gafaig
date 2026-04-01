# GAFAIG — CURRENT_FOCUS.md
Execution Control Document
Last Updated: 2026-03-31

---

# 🎯 PRIMARY OBJECTIVE

Transition GAFAIG from:

"Verification infrastructure exists"

→

"Global, externally verifiable trust system for AI governance"

---

# 📍 CURRENT PHASE

Verification Infrastructure Complete → Trust UX + External Verification Layer

---

# 🧠 STRATEGIC INTENT

Make GAFAIG:

• Cryptographically verifiable  
• Externally consumable  
• Developer-friendly  
• Regulator-ready  
• Instantly understandable as trust infrastructure  

---

# ✅ WHAT IS COMPLETE (DO NOT TOUCH)

The following systems are WORKING and LOCKED:

• Verification pipeline (application → case → findings → evidence → events)  
• Deterministic scoring engine (Snowflake-native)  
• Score snapshot system  
• Registry snapshot system (append-only)  
• Publish procedure (registry writes working)  
• V_REGISTRY_LATEST_APPROVED (source of truth)  
• V_REGISTRY_PUBLIC (public certification view)  
• Registry UI (/registry + detail pages)  
• Badge surface (/badge/[registryId]) — layout fixed  
• Verification API (/api/verify/[registryId]) — working  
• Public key endpoint (/api/.well-known/gafaig-public-key) — working  
• Ed25519 asymmetric signing — implemented  
• Explorer Phase 1 (landing + pages)  

---

# ⚠️ CRITICAL RULES

DO NOT:

• Re-architect the system  
• Move logic out of Snowflake  
• Compute scores in API/UI  
• Modify registry snapshot behavior  
• Expose private verification evidence  

ALL logic must remain:

Snowflake → Views → Query Layer → API → UI  

---

# 🚨 CURRENT GAP

The system is:

✔ Technically complete  
❌ Not yet *understandable or usable* externally  

---

# 🔧 ACTIVE WORKSTREAMS

## 1. VERIFICATION UX (TOP PRIORITY)

Goal:

Make every certification instantly verifiable by any user.

### Required:

• Add “Verify this certification” section to registry detail page  
• Add clear explanation of what verification means  
• Add copyable verification endpoint  
• Add public key reference  
• Add signature explanation  

---

## 2. EXTERNAL VERIFICATION FLOW

Goal:

Allow developers, regulators, and third parties to verify GAFAIG certifications independently.

### Required:

• Provide example verification script (Node.js)  
• Provide example verification script (Python)  
• Document verification steps clearly  
• Ensure payload + signature format is stable  

---

## 3. TRUST SURFACE STANDARDIZATION

Goal:

Make GAFAIG certification surfaces consistent and authoritative.

### Required:

• Align registry detail trust panel with badge surface  
• Ensure consistent terminology:
  - Certified
  - Verified
  - Published
• Ensure all certification fields display correctly:
  - Tier
  - Band
  - Validity
  - Timestamp  

---

## 4. KEY MANAGEMENT (NEXT STEP)

Goal:

Production-grade cryptographic key lifecycle.

### Required:

• Introduce multiple keys (kid support)  
• Enable key rotation  
• Maintain backward verification compatibility  

---

## 5. PROOF STANDARDIZATION

Goal:

Define GAFAIG as a formal verification standard.

### Required:

• Formal proof schema definition  
• Optional JWS-compatible format  
• Canonical message contract enforcement  

---

## 6. EXPLORER PHASE 2

Goal:

Make registry data explorable and analytically useful.

### Required:

• Filters:
  - Country
  - Tier
  - Band  
• Aggregations:
  - Counts
  - Distributions  
• Metrics:
  - Certifications over time  
• Map improvements  

---

# 🧪 VALIDATION CHECKLIST (MANDATORY)

After each change, verify:

## Registry

• /registry loads  
• /registry/[registryId] loads correctly  

## Verification

• /api/verify/[registryId] returns valid JSON  
• Signature is present  
• Message payload is correct  

## Public Key

• /api/.well-known/gafaig-public-key loads  
• Returns kid + PEM  

## Badge

• /badge/[registryId] renders correctly  
• Layout is contained and responsive  

## Explorer

• All explorer pages load  
• Data is consistent with registry  

---

# 🧠 DESIGN PRINCIPLE

Every GAFAIG page must answer:

"Can I trust this certification?"

If the answer is not obvious:

→ The page is incomplete

---

# 🚀 NEXT EXECUTION STEP

Start with:

👉 Registry Detail Page — Verification Section

Then:

👉 External Verification Example (Node.js)

---

# END OF CURRENT FOCUS