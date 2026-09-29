# Antigravity Rule: SIH 26160 Build Plan & Cross-Check Protocol
## Payodhi: AI-Powered IPsec VPN Protocol Analyzer & Security Assessment Framework

- **Problem Statement ID:** SIH26160
- **Organization:** NTRO (National Technical Research Organisation)
- **Theme:** Blockchain & Cybersecurity
- **Platform Name:** Payodhi (Payodhi-IPsec)
- **Team Size:** 6 Members

---

## Single Source of Truth
Whenever planning, coding, reviewing, or generating artifacts, Antigravity MUST ALWAYS cross-reference:
- [`docs/SIH_MASTER_BUILD_PLAN.md`](file:///Users/vangaujjwalsai/payodhi2BlockChain/docs/SIH_MASTER_BUILD_PLAN.md)
- [`SIH26160_LLD.md`](file:///Users/vangaujjwalsai/payodhi2BlockChain/SIH26160_LLD.md)
- [`DEMO_SCRIPT.md`](file:///Users/vangaujjwalsai/payodhi2BlockChain/DEMO_SCRIPT.md)

---

## Core Operational Directives

### 1. Brand & Naming Discipline
- **Rule:** Never use or leak external Git repository names. Exclusively use **Payodhi** (or **Payodhi-IPsec**, **Payodhi**, or **SIH 26160**).

### 2. Dual-Path Execution (Never-Fail Hackathon Principle)
In hackathons (especially SIH judging rounds), live packet capture on unknown host machines or air-gapped auditor laptops often fails due to missing root/sudo privileges, missing `tshark`, or Wireshark interface locks.
- **Rule:** Antigravity MUST NEVER break the fixture/mock fallback mode (`data/mock/sessions.json`, `scripts/seed_demo_db.py`).
- If raw capture dependencies are missing or fail, the system must seamlessly fall back to realistic, pre-computed session graphs.
- Use `python3 scripts/seed_demo_db.py` to ensure the local SQLite database is instantly ready to show a populated dashboard upon fresh startup.

### 3. 6-Member Team Ownership Map
When implementing or adjusting features, tag which team member owns the area:
- **Member 1 (Lead & Architecture):** `api/`, `core/pipeline.py`, Docker, SQLite store, WebSocket streaming.
- **Member 2 (Ingestion & Protocol Engine):** `core/ingestion/`, `core/ike_parser/`, PCAP stream parsing, IKE/ESP frame validators.
- **Member 3 (AI/ML & Encrypted Flow Classifier):** `core/flow/`, `core/classifiers/`, `models/`, flow feature statistics, ML confusion matrix.
- **Member 4 (Security Compliance & Threat Engine):** `core/rules/`, `core/intel/`, `core/config/`, RFC 8221/8247, NIST SP 800-77r1, DISA, CISA KEV, vendor remediation generation.
- **Member 5 (Frontend UI/UX & Data Viz):** `frontend/src/`, D3 Peer Graph, Session Drilldown, Spectrum bar, live WebSocket animation.
- **Member 6 (Reporting, SIEM & Demo Lead):** `reporting/`, `core/pq/`, `DEMO_SCRIPT.md`, 12-slide pitch deck, executive/technical PDF export, CycloneDX CBOM, judge Q&A.

### 4. Problem Statement Observability Honesty
Do NOT attempt to invent impossible passive observables. Be transparent as praised by NTRO evaluators:
- Transport vs Tunnel mode is NOT observable at T0 passive wire without endpoint kernel (VICI/XFRM).
- IKE_AUTH credentials are encrypted; peer auth detection uses Vendor ID and proposal heuristics, not decrypted keys.
- ESP payload is opaque; traffic classification uses flow side-channels (packet size distribution, IAT, burstiness).

### 5. Code Quality & Modularity
- Preserve the canonical `VPNSession` schema defined in [`core/models.py`](file:///Users/vangaujjwalsai/payodhi2BlockChain/core/models.py).
- Keep the REST API contract defined in [`api/main.py`](file:///Users/vangaujjwalsai/payodhi2BlockChain/api/main.py).
- Ensure all frontend components in `frontend/src/` communicate seamlessly via [`frontend/src/lib/api.ts`](file:///Users/vangaujjwalsai/payodhi2BlockChain/frontend/src/lib/api.ts).
