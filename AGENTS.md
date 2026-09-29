# Project Guidelines: SIH26160 IPsec Protocol Analyzer & Security Framework

## Overview
This repository contains the complete implementation for **Smart India Hackathon (SIH) Problem Statement 26160** (NTRO - National Technical Research Organisation):
**AI-Powered IPsec VPN Protocol Analyzer & Security Assessment Framework**.

- **Master Build Plan & Traceability:** [`docs/SIH_MASTER_BUILD_PLAN.md`](file:///Users/vangaujjwalsai/payodhi2BlockChain/docs/SIH_MASTER_BUILD_PLAN.md)
- **Low-Level Design (LLD):** [`SIH26160_LLD.md`](file:///Users/vangaujjwalsai/payodhi2BlockChain/SIH26160_LLD.md)
- **Demo Script:** [`DEMO_SCRIPT.md`](file:///Users/vangaujjwalsai/payodhi2BlockChain/DEMO_SCRIPT.md)
- **Submission Document:** [`SUBMISSION.md`](file:///Users/vangaujjwalsai/payodhi2BlockChain/SUBMISSION.md)

## Team Structure (6 Members)
- **Sanju:** Member 1 — Systems Architect & Ingestion Pipeline (`api/`, `core/pipeline.py`)
- **Vasi:** Member 2 — Packet Ingestion & RFC 7296 Protocol Decoder (`core/ingestion/`, `core/ike_parser/`)
- **Gopi:** Member 3 — AI/ML Flow Classifier & Side-Channel Engine (`core/flow/`, `core/classifiers/`, `models/`)
- **Geeta:** Member 4 — Security Compliance, Threat Rules & Vendor Remediation (`core/rules/`)
- **Siri:** Member 5 — Frontend UI/UX, D3 Topology & Interactive Dashboard (`frontend/`)
- **Ujjwal:** Member 6 — Team Lead, Defense Reporting Suite & Presentation (`reporting/`, `docs/`)

## Quickstart for Hackathon Judges & Developers
1. **Seed Demo DB (Instant zero-dependency demo):**
   ```bash
   python3 scripts/seed_demo_db.py
   ```
2. **Start Backend API:**
   ```bash
   uvicorn api.main:app --reload --port 8000
   ```
3. **Start Frontend Web App:**
   ```bash
   cd frontend && npm run dev
   ```
   Open `http://localhost:3000` in browser.

## Antigravity Pair-Programming Directives
- **Always Cross-Check:** Check [`docs/SIH_MASTER_BUILD_PLAN.md`](file:///Users/vangaujjwalsai/payodhi2BlockChain/docs/SIH_MASTER_BUILD_PLAN.md) before implementing changes.
- **Maintain Never-Fail Demo Fallback:** Never break `data/mock/sessions.json` or fixture mode.
- **Focus on Presentation Impact:** Prioritize clear visuals, CVE citations, and vendor remediation snippets that impress SIH evaluators.
