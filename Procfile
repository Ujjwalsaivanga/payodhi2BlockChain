web: sh -c "python3 scripts/seed_demo_db.py || true; exec uvicorn api.main:app --host 0.0.0.0 --port ${PORT:-8000}"
