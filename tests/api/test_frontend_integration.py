"""Test integrated frontend serving and /api prefix routing."""

from fastapi.testclient import TestClient
from api.main import app, FRONTEND_DIR

client = TestClient(app)


def test_api_prefix_routing_health():
    resp_direct = client.get("/health")
    assert resp_direct.status_code == 200
    assert resp_direct.json()["status"] == "ok"

    resp_prefixed = client.get("/api/health")
    assert resp_prefixed.status_code == 200
    assert resp_prefixed.json()["status"] == "ok"


def test_api_prefix_routing_sessions():
    resp_direct = client.get("/sessions", headers={"accept": "application/json"})
    assert resp_direct.status_code == 200
    assert isinstance(resp_direct.json(), list)

    resp_prefixed = client.get("/api/sessions")
    assert resp_prefixed.status_code == 200
    assert isinstance(resp_prefixed.json(), list)


def test_api_prefix_model_metrics():
    resp = client.get("/api/model/metrics")
    assert resp.status_code == 200
    data = resp.json()
    assert "model_version" in data or "accuracy" in data


def test_frontend_pages_served():
    if not (FRONTEND_DIR.is_dir() and (FRONTEND_DIR / "index.html").is_file()):
        return

    # Root HTML for browser
    resp_root = client.get("/", headers={"accept": "text/html,application/xhtml+xml"})
    assert resp_root.status_code == 200
    assert "text/html" in resp_root.headers.get("content-type", "")

    # Sessions HTML for browser
    resp_sessions = client.get("/sessions", headers={"accept": "text/html,application/xhtml+xml"})
    assert resp_sessions.status_code == 200
    assert "text/html" in resp_sessions.headers.get("content-type", "")

    # Other Next.js pages
    for page in ["graph", "overview", "compare", "export", "live"]:
        resp = client.get(f"/{page}")
        assert resp.status_code == 200
        assert "text/html" in resp.headers.get("content-type", "")


def test_api_root_for_json_clients():
    resp = client.get("/", headers={"accept": "application/json"})
    assert resp.status_code == 200
    assert resp.json().get("service") == "Payodhi IPsec Analyzer API"
