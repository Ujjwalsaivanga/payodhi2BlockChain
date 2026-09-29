# Payodhi — Recorded Demo Script & Presentation Runbook
## SIH 26160: AI-Powered IPsec VPN Protocol Analyzer & Security Assessment Framework

**Total Timing ≈ 3:20.** About 1:15 on architecture & logic, 2:05 live in the Defense SOC Console.

**Before Presentation / Recording:**
1. Populate database: `python3 scripts/seed_demo_db.py`
2. Start backend: `python3 -m uvicorn api.main:app --port 8000`
3. Start frontend: `cd frontend && npm run dev`
4. Browser open at <http://localhost:3000>
5. Keep `data/pcaps/demo_capture.pcap` or `data/pcaps/real_pcaps/` ready to upload.

Spoken lines are quoted. Actions in brackets. Timings are cumulative.

---

# Part 1 — Architecture & Core Strategy (0:00 – 1:20)

## 0:00 — 0:15 · Cold Open
> "Every defense and enterprise organization relies on IPsec VPNs as their primary boundary encryption. Almost nobody can tell you what cipher they actually negotiated on the wire right now.
>
> Payodhi takes passive packet captures and gives you an auditable, cryptographic breakdown of your entire VPN estate — zero agents, zero private keys, nothing installed on gateways."

---

## 0:15 — 0:40 · The 7-Stage Pipeline
> "Seven stages, engineered by our 6-member team. Our multi-stack lab testbed generates authentic ground truth. A hand-written native RFC 7296 binary struct decoder reads the cleartext control exchange without Wireshark.
>
> Then our triple parallel engine executes — protocol analysis, side-channel flow classification, and an 18-rule multi-standard security assessment — converging into one unified, auditable session record."

---

## 0:40 — 1:00 · The Two-AI Formulation & Observability Honesty
> "Here is our core architectural decision:
>
> Identifying the crypto is **not** machine learning. IKE handshakes negotiate in cleartext before the tunnel exists; the ciphers, Diffie-Hellman groups, and vendor IDs are right there in the bytes. We decode them with 100% mathematical precision.
>
> We reserve AI/ML for the genuinely hard problem: classifying what application traffic is flowing *inside* the encrypted ESP tunnel. That payload is opaque, but application behaviors leak metadata: packet size distributions, inter-arrival times, and burstiness."

---

## 1:00 — 1:20 · Ground Truth Dataset & Side-Channel Model
> "Because no public dataset exists for IPsec ESP side-channels, we built our own 144-cell multi-stack testbed and produced over 300 labeled PCAPs across diverse protocols.
>
> Our side-channel classifier achieves a **macro-F1 score of 0.98 on held-out captures**, accurately separating VoIP, Video, Web, Chat, Email, and ICMP."

---

# Part 2 — Live SOC Console Walkthrough (1:20 – 3:20)

## 1:20 — 1:35 · Real-Time Posture & Capture Spectrum
[Switch to browser at `http://localhost:3000`.]

> "Here is the Payodhi Defense SOC Console. The top bar immediately shows our DEFCON status and the estate Capture Spectrum — three critical, one high, two clean.
>
> The session table displays the complete cryptographic breakdown: negotiated ciphers, Diffie-Hellman groups, PFS state, and the AI-predicted inner traffic with confidence scores."

---

## 1:35 — 2:20 · Deep Session Drilldown & Automated Vendor Fixes
[Click the top CRITICAL row — DES-CBC / MODP1024 (`sess-002`).]

> "Drilling into this critical tunnel reveals DES-CBC with MODP1024 — that's LOGJAM (CVE-2015-4000) and SWEET32 (CVE-2016-2183), mapped directly against NIST SP 800-77r1 and DISA guidelines.
>
> But finding a flaw is only half the battle. Payodhi fingerprints the implementation via IKE Vendor IDs — Cisco ASA, strongSwan, Fortinet — and provides the **exact, syntax-checked copy-paste configuration diff** to remediate the vulnerability.
>
> Below it, auditors can inspect the 13 side-channel flow metrics and exact packet frame citations to verify every anomaly in Wireshark."

---

## 2:20 — 2:45 · Interactive D3 Peer Topology Graph
[Click **Peers** tab. Drag a node.]

> "Here is our interactive D3 force-directed peer topology map. Each node represents a VPN gateway, dynamically coloured by its **worst-case** session severity.
>
> If a gateway runs nineteen compliant tunnels and one weak DES tunnel, the node flags red, immediately showing security teams where boundary compromise exists. Clicking any peer isolates its active links."

---

## 2:45 — 3:05 · Multi-Standard Overview & Threat Matrix
[Click **Overview** tab.]

> "Our Overview aggregates estate-wide posture: risk score distribution, traffic composition, and a 2D Likelihood × Impact Threat Matrix. Every metric is driven by our auditable scoring engine."

---

## 3:05 — 3:20 · Multi-Format Export Center & Conclusion
[Click **Export** tab. Show download buttons.]

> "For enterprise and defense interoperability, Payodhi exports four compliance artifacts with a single click:
> 1. One-Page Executive Summary PDF for leadership.
> 2. Deep Technical Audit Report with packet citations and confusion matrix.
> 3. CycloneDX 1.6 Cryptographic Bill of Materials (CBOM) for post-quantum software supply-chain compliance.
> 4. ArcSight CEF Syslogs streaming directly into Splunk, Elastic, or QRadar.
>
> From passive capture, to native RFC 7296 decoding, to encrypted flow AI, multi-standard threat scoring, and vendor remediation — that is Payodhi. We are ready for your questions."

---

# Presentation & Recording Directives

- **Instant Fallback Guarantee:** If physical network access is restricted on stage, `scripts/seed_demo_db.py` ensures the entire dashboard is live, responsive, and pre-populated.
- **Drag Peer Nodes:** Moving nodes in the D3 peer graph visually proves it is an active force simulation rather than a static chart.
- **Highlight the Remediation Diff:** Evaluators look for actionable value; pausing on the Cisco/strongSwan configuration diff demonstrates immediate operational ROI.
