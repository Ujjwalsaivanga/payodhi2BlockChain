"""Seed payodhi.sqlite with pre-computed demo sessions from data/mock/sessions.json.

Run this script to immediately populate the database for instant SIH demo/presentation
without needing to capture or upload a PCAP file:

    python3 scripts/seed_demo_db.py
"""

import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

from api import store  # noqa: E402
from core.models import VPNSession  # noqa: E402
from core.anomalies import detect_anomalies  # noqa: E402

MOCK_PATH = REPO_ROOT / "data" / "mock" / "sessions.json"
DEFAULT_JOB_ID = "sih-demo-job-001"


def seed(job_id: str = DEFAULT_JOB_ID) -> int:
    if not MOCK_PATH.exists():
        print(f"Error: {MOCK_PATH} not found.", file=sys.stderr)
        return 1

    print(f"Initializing SQLite database at {store.db_path()}...")
    store.init_db()

    raw_sessions = json.loads(MOCK_PATH.read_text())
    sessions = [VPNSession.model_validate(s) for s in raw_sessions]

    print(f"Saving {len(sessions)} demo sessions under job '{job_id}'...")
    store.save_sessions(job_id, sessions, capture_file="sih_live_demo.pcap")

    events = detect_anomalies(sessions)
    print(f"Detected and storing {len(events)} anomaly events...")
    store.save_events(job_id, events)

    print("\n✅ Database seeded successfully!")
    print(f"  Sessions: {len(sessions)}")
    print(f"  Severities: {', '.join(s.security_assessment.overall_severity for s in sessions)}")
    print(f"  Database file: {store.db_path()}")
    print("\nYou can now start FastAPI (`uvicorn api.main:app --reload`) and Next.js frontend (`npm run dev`)")
    return 0


if __name__ == "__main__":
    raise SystemExit(seed())
