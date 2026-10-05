# Stage 1: Build the Next.js Defense Console static export
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
ENV NEXT_PUBLIC_API_BASE=/api
RUN npm run build

# Stage 2: Payodhi unified runtime: FastAPI + tshark + weasyprint + Stage 4 ML models + Defense Console
FROM python:3.11-slim

# tshark backs pyshark (Stage 1); pango and cairo back weasyprint (Stage 5).
# DEBIAN_FRONTEND keeps tshark's "should non-root capture?" prompt from hanging
# the build -- the answer is no, this container only reads uploaded files.
ENV DEBIAN_FRONTEND=noninteractive PYTHONUNBUFFERED=1
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        tshark \
        libpango-1.0-0 \
        libpangoft2-1.0-0 \
        libcairo2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY core ./core
COPY api ./api
COPY reporting ./reporting
COPY data/mock ./data/mock
# The trained Stage 4b/4a artifacts. Without these the container falls back to
# an untrained classifier: every session reports traffic type "Other" at zero
# confidence and the technical report loses its confusion matrix.
COPY models ./models
COPY scripts ./scripts

# Copy compiled frontend static export from Stage 1 into /app/frontend/out
COPY --from=frontend-builder /app/frontend/out ./frontend/out

# The database and rendered reports live on a volume, not in the image.
ENV PAYODHI_DB=/var/lib/payodhi/payodhi.sqlite \
    PAYODHI_REPORT_DIR=/var/lib/payodhi/reports
RUN mkdir -p /var/lib/payodhi/reports

EXPOSE 8000
CMD ["sh", "-c", "python3 scripts/seed_demo_db.py || true; exec uvicorn api.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
