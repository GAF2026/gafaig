# GAFAIG — CHANGELOG.md
System Evolution Log
Last Updated: 2026-03-31

---

# 🚀 VERSION: VERIFICATION INFRASTRUCTURE COMPLETE

This release marks the transition of GAFAIG from a functioning registry system to a **cryptographically verifiable trust infrastructure**.

---

# 🧱 CORE SYSTEM (STABLE)

## Verification Pipeline (LOCKED)

Completed full deterministic pipeline:

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SCORE SNAPSHOT  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEWS  

Status:

✔ Fully operational  
✔ Snowflake-native  
✔ Deterministic and reproducible  

---

## Registry System

### Implemented

• CORE.REGISTRY_SNAPSHOTS (append-only)  
• CORE.V_REGISTRY_LATEST_APPROVED (latest certified record)  
• CORE.V_REGISTRY_PUBLIC (public certification surface)  
• CORE.V_REGISTRY_PUBLIC_SEARCH (search-optimized view)  

Status:

✔ Immutable registry  
✔ No mutation of records  
✔ One canonical public state per case  

---

## Publish Workflow

• Stored procedure-based publish flow  
• Registry ID generation working  
• Re-publish creates new snapshot  

Status:

✔ Stable  
✔ Production-ready  

---

# 🌐 API LAYER

## Verification Endpoint

### /api/verify/[registryId]

Implemented:

• Fetches certification from V_REGISTRY_PUBLIC  
• Returns structured record  
• Returns cryptographic proof object  

Proof includes:

• Canonical message  
• Signature  
• Algorithm  
• Timestamp  

Status:

✔ Working  
✔ Production-ready  

---

## Public Key Endpoint

### /api/.well-known/gafaig-public-key

Implemented:

• Exposes public verification key  
• Returns:
  - kid
  - publicKeyPem  

Status:

✔ Working  
✔ Required for external verification  

---

# 🔐 CRYPTOGRAPHY UPGRADE

## Migration Completed

From:

HMAC (shared secret)

→

To:

Ed25519 (asymmetric signing)

---

## Key Infrastructure

### Private Key

• Stored in environment variable  
• Server-side only  
• Not exposed  

### Public Key

• Served via well-known endpoint  
• Used for external verification  

---

## Signing Model

• Canonical JSON message  
• UTF-8 encoding  
• Detached signature  
• Ed25519 signing  

Status:

✔ Implemented  
✔ Verified working  

---

# 🧾 BADGE SURFACE

## /badge/[registryId]

Rebuilt certification badge surface:

### Improvements

• Layout scaled to match registry pages  
• Responsive container sizing  
• Fixed overflow issues  
• Fixed pill alignment  
• Fixed spacing and padding  
• Added verification endpoint display  
• Added certification metadata footer  

### Fixes

• Tier/Band overflow resolved  
• Valid To overflow resolved  
• Country text containment fixed  
• Grid alignment corrected  

Status:

✔ Production-ready  
✔ Consistent with registry UI  

---

# 📄 REGISTRY DETAIL PAGE

## /registry/[registryId]

### Improvements

• Certification summary clarity  
• Trust panel enhancements  
• Badge + verification integration  
• Data consistency with Snowflake  

Status:

✔ Stable  
✔ Ready for verification UX upgrade  

---

# 🔍 EXPLORER (PHASE 1 COMPLETE)

## Pages Implemented

• /explorer  
• /explorer/countries  
• /explorer/organizations  
• /explorer/systems  
• /explorer/map  

### Improvements

• Clean production UI  
• Registry-driven data  
• Navigation consistency  
• Layout alignment with platform  

Status:

✔ Phase 1 complete  
✔ Phase 2 pending (filters + analytics)  

---

# 🏠 PUBLIC PAGES (REWRITTEN)

## Updated Pages

• Home  
• Framework  
• Registry  
• Demo  
• Mission  

### Improvements

• Clear positioning of GAFAIG as trust infrastructure  
• Consistent language across platform  
• Removed ambiguity (not a dashboard)  
• Strengthened narrative  

Status:

✔ Production-ready  

---

# 🔐 ADMIN SYSTEM

## Admin Pages

• /admin/login  
• /admin/applications  

### Improvements

• Cleaned UI  
• Simplified messaging  
• Improved alignment with verification workflow  

Status:

✔ Functional  
✔ Internal-facing  

---

# 🧩 QUERY LAYER

## Enforcement

• All queries routed through lib/queries  
• Removed inline SQL from API routes  
• Standardized Snowflake access  

Status:

✔ Enforced  
✔ Stable  

---

# ⚙️ INFRASTRUCTURE

## Deployment

• Vercel (production)  
• GitHub (source control)  

## Runtime

• Next.js App Router  
• TypeScript  
• Snowflake backend  

Status:

✔ Stable  
✔ Production deployment working  

---

# 🧪 BUG FIXES (THIS RELEASE)

• Fixed badge layout overflow issues  
• Fixed pill alignment issues  
• Fixed verification endpoint 500 error  
• Fixed missing verification route handling  
• Fixed JSON proof endpoint  
• Fixed public key endpoint routing  
• Fixed folder structure issue (.well-known path)  
• Fixed registry layout inconsistencies  

---

# ⚠️ KNOWN GAPS

## Verification UX

• No clear “Verify this certification” UI yet  
• No user-facing verification explanation  
• No embedded verification workflow  

---

## External Verification

• No official SDK or scripts yet  
• No public documentation  

---

## Key Management

• No key rotation yet  
• Single key only  
• No versioning (kid lifecycle incomplete)  

---

## Explorer Phase 2

• No filters  
• No aggregations  
• No metrics  
• No trends  

---

# 🚀 NEXT RELEASE TARGET

## VERIFICATION UX + EXTERNAL TRUST LAYER

### Goals

• Add verification UI to registry page  
• Add developer verification examples  
• Add trust explanation layer  
• Enable third-party verification  

---

# 🧠 STRATEGIC TRANSITION

GAFAIG has moved from:

"A working registry"

→

To:

"A verifiable trust infrastructure"

Next step:

→ Make that trust **visible, usable, and adoptable globally**

---

# END OF CHANGELOG