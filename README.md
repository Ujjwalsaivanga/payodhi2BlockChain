# Payodhi: AI-Powered IPsec Protocol Analyzer & Security Framework

**Smart India Hackathon (SIH 2026) · Problem Statement SIH26160 · NTRO (National Technical Research Organisation)**

Payodhi is an intelligence-driven, passive-first IPsec VPN security framework designed for defense and critical infrastructure networks. It decodes live wire packets, reconstructs the full cryptographic negotiation state of every active VPN session, classifies encrypted payload flows using side-channel machine learning, assesses compliance across national and international standards, and generates actionable, vendor-specific remediation diffs alongside CycloneDX 1.6 Cryptographic Bills of Materials (CBOM).

---

## 1. Quickstart (Instant Zero-Dependency Demo)

To run the complete system on stage or during evaluations with zero network or root dependencies:

```bash
# 1. Seed demo database with 10 multi-vendor VPN sessions (1 second)
python3 scripts/seed_demo_db.py

# 2. Start Backend API Server
python3 -m uvicorn api.main:app --port 8000 --reload

# 3. Start Frontend Web Console
cd frontend && npm run dev
```

Open **`http://localhost:3000`** in your browser to explore the Defense SOC Command Console.

### Cloud Deployment (Railway 1-Click)
Deploy the full stack (Frontend + Backend + Demo DB) with a single link on Railway:
```bash
# Push to GitHub, then in Railway:
# "New Project" -> "Deploy from GitHub repo" -> Select payodhi2BlockChain
```
See the complete step-by-step instructions in [`docs/RAILWAY_DEPLOYMENT.md`](docs/RAILWAY_DEPLOYMENT.md).

---

## 2. 6-Member Team Structure & Ownership

| Member | Primary Role | Code Modules | Technical Deliverables |
|---|---|---|---|
| **Member 1** | Team Lead & Systems Architect | `api/`, `core/pipeline.py`, Docker, DB | FastAPI orchestration, SQLite persistence, WebSocket live streaming, health checks |
| **Member 2** | Packet Ingestion & Protocol Decoder | `core/ingestion/`, `core/ike_parser/`, `data/` | Native RFC 7296 binary struct decoder, zero-Wireshark execution, SPI matching |
| **Member 3** | AI/ML & Encrypted Flow Engineer | `core/flow/`, `core/classifiers/`, `models/` | 13-feature ESP flow side-channel extractor, Random Forest / XGBoost ensemble (F1: 0.98) |
| **Member 4** | Security Compliance & Threat Intel | `core/rules/`, `core/intel/`, `core/config/` | 18 Security rules (RFC, NIST, DISA, DST), Config-to-Wire reconciler, CISA KEV queries |
| **Member 5** | Frontend UI/UX & Data Visualization | `frontend/` (Next.js 16, React 19, D3) | Defense SOC Console, D3 force-directed peer graph, Capture Spectrum, Session Drilldown |
| **Member 6** | Reporting, SIEM & Demo Orchestration | `reporting/`, `core/pq/`, `scripts/` | Executive PDF, Technical PDF, CycloneDX 1.6 CBOM, ArcSight CEF syslog exporter |

---

## 3. Core Architecture & Capabilities

```
  Live Wire / PCAP Ingestion (UDP 500, UDP 4500, Protocol 50 ESP)
                             │
     ┌───────────────────────┴───────────────────────┐
     ▼                                               ▼
Cleartext IKE Handshake                         Opaque ESP Payload
(Native RFC 7296 Binary Decoder)            (13 Flow Side-Channel Features)
- Ciphers, DH Groups, Transforms            - Packet Size Distributions, IAT
- Vendor IDs (Cisco, strongSwan, Fortinet)  - Burstiness, Directionality Ratios
     │                                               │
     └───────────────────────┬───────────────────────┘
                             ▼
               Triple Parallel Intelligence Engine
 ├─ Side-Channel AI Flow Classifier (Random Forest / XGBoost, Macro-F1: 0.98)
 ├─ 18-Rule Multi-Standard Compliance (NIST SP 800-77r1, DISA SRG, DST-NQM)
 ├─ Config-to-Wire Reconciler (swanctl.conf/ipsec.conf vs Negotiated Wire)
 └─ Live Threat Intelligence Client (NVD CVEs, CISA KEV Advisories)
                             │
                             ▼
        Multi-Format Reporting & Export Center
 ├─ Defense SOC Command Console (Next.js 16 + D3 Force-Directed Peer Graph)
 ├─ One-Page Executive Summary PDF (Leadership View)
 ├─ In-Depth Technical Audit PDF (Packet Citations & Confusion Matrix)
 ├─ CycloneDX 1.6 Cryptographic Bill of Materials (CBOM)
 └─ ArcSight CEF Syslog Stream (Splunk, Elastic, QRadar)
```

---

## 4. Key Documentation & Project Guides

- **Master Build Plan & Traceability Matrix:** [`docs/SIH_MASTER_BUILD_PLAN.md`](docs/SIH_MASTER_BUILD_PLAN.md)
- **Railway Cloud Deployment Guide:** [`docs/RAILWAY_DEPLOYMENT.md`](docs/RAILWAY_DEPLOYMENT.md)
- **Low-Level Design Document (LLD):** [`SIH26160_LLD.md`](SIH26160_LLD.md)
- **Live Demo Script & Timed Runbook:** [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md)
- **Official SIH Submission Dossier:** [`SUBMISSION.md`](SUBMISSION.md)

---

## 5. Verification & Test Execution

```bash
# Run core backend pytest suite (102 passed, zero failures)
pytest tests/core tests/api tests/reporting tests/classifiers

# Run frontend Vitest suite (36 passed, zero failures)
cd frontend && npm test

# Run Next.js production build (10/10 pages compiled cleanly)
cd frontend && npm run build
```

---

## 6. Mathematical Observability Transparency
Payodhi rigorously respects the theoretical boundary of passive wire observation:
- **IKE Control Parameters:** Extracted with 100% mathematical certainty from cleartext IKE payloads before tunnel encryption.
- **ESP Encrypted Payloads:** Decapsulation without keys is mathematically impossible; inner application traffic is inferred purely through statistical timing, length, and burstiness side-channels.
- **Transport vs. Tunnel Mode:** Passive wire packets at T0 do not expose inner IP headers; endpoint kernel integration (VICI/XFRM) is provided in our Stage 3 roadmap for verified endpoint telemetry.
