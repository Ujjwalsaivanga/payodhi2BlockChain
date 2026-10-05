# Railway Deployment Guide: Payodhi Full-Stack

This guide covers deploying the **Payodhi AI-Powered IPsec Protocol Analyzer & Security Framework** to [Railway](https://railway.app) so that **both the frontend and backend run seamlessly behind a single live URL**.

---

## 🚀 Option 1: 1-Click Unified Container (Recommended)

The repository is pre-configured with a multi-stage `Dockerfile` and `railway.json`. Railway will automatically build the Next.js static console and package it together with the FastAPI backend, pre-trained ML models, and SQLite demo database into a single high-performance production container.

### Step-by-Step Instructions:

1. **Push your code to GitHub**:
   Ensure your latest code is pushed to your GitHub repository (e.g. `main` branch).

2. **Login to Railway**:
   Go to [railway.app](https://railway.app) and sign in with GitHub.

3. **Create a New Project**:
   - Click **"New Project"** -> **"Deploy from GitHub repo"**.
   - Select your repository (`payodhi2BlockChain`).
   - Railway will detect the root `Dockerfile` and `railway.json` automatically.

4. **Add a Persistent Volume (Recommended)**:
   - In your Railway project canvas, click on your service.
   - Go to the **"Volumes"** tab.
   - Click **"Add Volume"**.
   - Set the mount path to:
     ```
     /var/lib/payodhi
     ```
   - This ensures analyzed PCAPs and generated PDF audit reports survive container restarts.

5. **Generate Your Live Public Domain**:
   - Go to the **"Settings"** tab of your service.
   - Under **"Networking"**, click **"Generate Domain"** (or attach a custom domain).
   - Railway will provide a public URL like:
     ```
     https://payodhi2blockchain-production.up.railway.app
     ```

6. **Click the Link and Enjoy! 🎉**:
   - Open your generated Railway domain in any browser.
   - **Frontend:** The full Defense SOC Console loads instantly at `/`.
   - **Pre-seeded Data:** 10+ realistic multi-vendor VPN sessions (IKEv1, IKEv2, 3DES, Post-Quantum vulnerable, Fortinet, Cisco, strongSwan) are immediately available.
   - **API & Docs:** Backend endpoints are available at `/api/...` and Swagger documentation is live at `/docs`.
   - **WebSocket:** Live streaming is fully operational at `/ws/live` and `/api/ws/live`.
   - **PDF Reports:** 1-page Executive Summary & In-Depth Technical Audit PDFs are ready for instant download.

---

## ⚙️ How It Works Under the Hood

| Component | Port / Path | Description |
|---|---|---|
| **Root URL (`/`)** | `${PORT}` | Next.js Defense SOC Console (Static Export) |
| **All Pages (`/sessions`, `/graph`, `/overview`, `/compare`, `/export`)** | Direct HTML fallback | Seamless client-side and server-side navigation |
| **Backend API (`/api/*` and `/*`)** | Same Origin | Zero CORS preflights; all API calls route to FastAPI |
| **Health Check (`/health`)** | HTTP 200 OK | Auto-monitored by Railway healthcheck |
| **Swagger UI (`/docs`)** | Interactive API | Full OpenAPI documentation of all 14 endpoints |
| **WebSocket (`/ws/live` & `/api/ws/live`)** | WSS Stream | Real-time session streaming with zero cross-origin configuration |
| **Database Auto-Seed** | Container Startup | Runs `python3 scripts/seed_demo_db.py` on boot |

---

## 🛠 Option 2: Two-Service Deployment (Separate Frontend & Backend)

If you specifically require two separate microservices on Railway:

### Service 1: Backend
1. In Railway, click **"+ New"** -> **"GitHub Repo"** -> choose repository.
2. Under **"Settings"** -> **"Build"**, keep Root Directory as `/`.
3. Generate Domain (e.g. `https://payodhi-backend.up.railway.app`).

### Service 2: Frontend
1. Click **"+ New"** -> **"GitHub Repo"** -> choose the same repository.
2. Under **"Settings"** -> **"Build"**:
   - Set **Root Directory** to: `frontend`
   - Set **Dockerfile Path** to: `Dockerfile`
3. Under **"Variables"**:
   - Set `NEXT_PUBLIC_API_BASE` to your backend URL (e.g. `https://payodhi-backend.up.railway.app`).
   - Set `BACKEND_URL` to `https://payodhi-backend.up.railway.app/`.
4. Generate Domain for the frontend service.

---

## 🔍 Verification Checklist

Once deployed on Railway, verify the following:
- [ ] Visit `https://<your-app>.up.railway.app/` -> Dashboard loads with active cards and charts.
- [ ] Visit `https://<your-app>.up.railway.app/sessions` -> Multi-vendor VPN sessions table renders.
- [ ] Click any session -> Slide-over drawer opens with RFC 7296 compliance, CVE alerts, and vendor remediation snippets.
- [ ] Visit `https://<your-app>.up.railway.app/graph` -> D3 interactive topology graph renders.
- [ ] Visit `https://<your-app>.up.railway.app/health` -> Returns `{"status":"ok","version":"1.0.0","parser_available":true}`.
- [ ] Visit `https://<your-app>.up.railway.app/docs` -> FastAPI Swagger interactive UI loads.
