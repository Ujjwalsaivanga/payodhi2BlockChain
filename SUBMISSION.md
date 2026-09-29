# Payodhi — SIH 2026 Submission Document
## AI-Powered IPsec VPN Protocol Analyzer & Security Assessment Framework

- **Problem Statement ID:** SIH26160
- **Organization:** NTRO (National Technical Research Organisation)
- **Category:** Software
- **Theme:** Blockchain & Cybersecurity
- **Platform Name:** Payodhi (Payodhi-IPsec)
- **Team Size:** 6 Members

---

## 1. The Problem Context

National security and defense communication backbones overseen by organizations like **NTRO** depend fundamentally on IPsec VPN infrastructure. An IPsec tunnel is only as secure as the cryptographic parameters negotiated dynamically on the wire. Over years of deployment, these environments accumulate severe **cryptographic drift**:
- Deprecated IKEv1 tunnels using single DES, 3DES, and 1024-bit Diffie-Hellman operate side-by-side with modern IKEv2 tunnels.
- Network administrators lack continuous visibility into what ciphers are negotiated on the wire versus what security policies mandate.
- Attackers exploit proposal-stripping downgrade attacks (e.g., LOGJAM, SWEET32) without triggering traditional perimeter alarms.

The NTRO Problem Statement requires an **AI-powered framework** that:
1. Identifies the protocol and exact cryptographic suite of every active VPN session.
2. **Classifies the application traffic running inside the encrypted ESP tunnel** (VoIP, Video, Web, Chat, Email, ICMP) purely from side-channel metadata.
3. Scores each session against CVEs, RFC standards, and defense compliance baselines.
4. Generates a labeled dataset, an interactive operations prototype, and layered multi-format compliance reports.

---

## 2. What Payodhi Is

**Payodhi** is a passive-first, intelligence-driven IPsec security framework. Operating on live wire interfaces or raw PCAP/PCAPNG files, it:

1. **Reconstructs Full IKE State Deterministically:** Pure Python binary struct parsing of IKEv1 (Main / Aggressive / Quick Mode) and IKEv2 (IKE_SA_INIT / IKE_AUTH / CREATE_CHILD_SA) directly from wire bytes without external tools like Wireshark.
2. **Infers Encrypted Inner Traffic with AI:** Extracts 13 statistical flow features (packet size distribution, inter-arrival times, burstiness) and classifies opaque ESP payloads using a trained Random Forest / XGBoost ensemble (**Macro-F1: 0.98**).
3. **Assesses Compliance Across Multiple Standards:** Evaluates 18 security rules spanning RFC 8221/8247, NIST SP 800-77r1, DISA SRG v2r6, and Indian DST-NQM Post-Quantum directives, calculating an auditable 0–100 Risk Score.
4. **Reconciles Configuration vs. Wire:** Compares declared `swanctl.conf` / `ipsec.conf` policies against negotiated wire sessions to flag unauthorized drift.
5. **Streams Live Threat Intelligence:** Queries NVD CVEs, CISA Known Exploited Vulnerabilities (KEV), and strongSwan EUVD advisories for detected vendor implementations.
6. **Produces Layered Enterprise Compliance Deliverables:**
   - One-Page Executive PDF for senior command.
   - In-Depth Technical PDF with frame-level packet citations and confusion matrices.
   - **CycloneDX 1.6 Cryptographic Bill of Materials (CBOM)** for software supply-chain audits.
   - **ArcSight CEF Syslogs** streaming directly into Splunk, Elastic, or QRadar.
   - Syntax-checked, copy-paste remediation diffs for Cisco ASA, strongSwan, and Fortinet.

---

## 3. The 7-Stage End-to-End Pipeline

| Stage | Component | Technical Functionality |
|---|---|---|
| **0** | `testbed/` | 8 multi-stack strongSwan profiles (P01–P08) generating ground truth over a Cartesian matrix: ciphers (AES-GCM, AES-CBC, 3DES) × DH groups (2, 5, 14, 19, 20) × PFS on/off × IPv4/IPv6 × 6 traffic classes. |
| **1** | `core/ingestion/` | Stream ingestion for UDP 500, UDP 4500, and IP protocol 50 (ESP) / 51 (AH). Handles NAT-T Non-ESP markers and extracts bidirectional flow streams. |
| **2** | `core/ike_parser/` | Native RFC 7296 binary struct decoder. Unpacks SA, Proposal, Transform, Key Exchange, Nonce, Vendor ID, and Traffic Selector payloads with 100% precision. |
| **3** | `core/flow/` | 13-feature flow side-channel extractor: packet size distribution (mean, variance, percentiles), inter-arrival timing, burst models, and directionality ratios. |
| **4a** | `core/classifiers/` | Structural fallback classifier recovering DH group and ciphers from message geometry when headers are truncated. |
| **4b** | `core/classifiers/` | Encrypted flow side-channel classifier (Random Forest / XGBoost ensemble) predicting inner application traffic (VoIP, Video, Web, Chat, Email, ICMP). |
| **4c** | `core/rules/` | 18-rule compliance engine evaluating against RFC, NIST, DISA, and DST-NQM baselines with automated CVSS penalty deductions. |
| **4d** | `core/config/` | Config-to-Wire reconciler analyzing `swanctl.conf` / `ipsec.conf` against actual negotiated wire parameters. |
| **4e** | `core/intel/` | Live threat intelligence client querying NVD, CISA KEV, and vendor security advisories. |
| **5** | `reporting/` | Multi-format artifact generator: Executive PDF, Technical PDF, CycloneDX 1.6 CBOM, and ArcSight CEF syslog exporter. |
| **6** | `frontend/` | Defense SOC Command Console (Next.js 16 + React 19 + Tailwind + D3) with DEFCON status, Capture Spectrum, force-directed peer graph, and session drilldowns. |

---

## 4. Competitive Differentiation & Defensive Moat

| Capability | Legacy Tools (`ike-scan`, Wireshark) | Policy Linters (Tufin, AlgoSec) | Payodhi |
|---|---|---|---|
| **Passive Wire Decoding** | Manual packet-by-packet (Wireshark) | None (static config only) | **Automated native RFC 7296 binary parsing** |
| **Encrypted Flow AI** | None | None | **13-feature side-channel classifier (F1: 0.98)** |
| **Config vs Wire Drift** | None | Policy only, no wire correlation | **Automated config-to-wire reconciliation** |
| **Post-Quantum CBOM** | None | None | **CycloneDX 1.6 Cryptographic BOM export** |
| **Live Threat Intel** | None | None | **CISA KEV, NVD CVE, and EUVD live queries** |
| **Vendor Remediation** | None | Generic recommendations | **Exact copy-paste diffs (Cisco, strongSwan, Fortinet)** |
| **SIEM Integration** | PCAP export only | Proprietary syslog | **Standard ArcSight CEF & JSON streaming** |

---

## 5. Quantitative Verification Metrics

- **Pipeline Test Suite:** 102 core backend unit tests passing with zero failures.
- **Frontend Test Suite:** 36 Vitest component and logic tests passing in 848ms.
- **Next.js Production Build:** 10 / 10 static pages compiled cleanly with zero TypeScript errors.
- **Encrypted Flow Classifier:** Macro-F1 score of **0.9801** on held-out captures.
- **Seeding Performance:** Database initialized with 10 realistic multi-vendor sessions in under 1 second via `python3 scripts/seed_demo_db.py`.

---

## 6. Mathematical Observability Transparency

In alignment with defense evaluation standards, Payodhi explicitly documents the boundary between passive observation and endpoint telemetry:
1. **Cleartext Control vs. Opaque Payload:** IKE negotiates cryptographic parameters in cleartext payloads before the tunnel is established. We decode these with 100% mathematical precision.
2. **Encrypted Flow Side-Channels:** ESP payloads cannot be decrypted passively without private keys. Our AI classifies traffic solely from packet length distributions, inter-arrival intervals, and burstiness.
3. **Transport vs. Tunnel Mode:** At passive wire vantage T0, determining internal IP encapsulation requires endpoint kernel introspection. Our Stage 3 roadmap details the VICI/XFRM agent for endpoint telemetry.

---

## 7. Deliverables & Compliance Verification

1. **Working Prototype:** Fully functional on `http://localhost:8000` (FastAPI) and `http://localhost:3000` (Next.js Defense Console).
2. **Instant Demo Fallback:** Pre-seeded realistic sessions in `data/mock/sessions.json` accessible via `python3 scripts/seed_demo_db.py`.
3. **Multi-Format Exports:** Executive PDF, Technical Report, CycloneDX 1.6 CBOM, and ArcSight CEF logs verified and downloadable via API.
4. **Authentic Dataset & Profiles:** 8 strongSwan lab profiles (P01–P08) and 300+ labeled PCAP captures.
5. **Team Workload Distribution:** 6-member team ownership mapped to code modules and a 12-slide presentation deck.
