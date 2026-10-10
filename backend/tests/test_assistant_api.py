import pytest

def test_auth_and_assistant_message(client):
    # 1. Login user
    login_resp = client.post("/api/v1/auth/login", json={"email": "user@trustiq.ai", "password": "password123"})
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Submit arithmetic prompt
    msg_resp = client.post(
        "/api/v1/assistant/message",
        headers=headers,
        json={"content": "What is 125 multiplied by 8?"}
    )
    assert msg_resp.status_code == 200
    data = msg_resp.json()
    assert "1000" in data["assistant_message"]["content"]
    assert data["decision"]["routing_action"] == "answer"
    assert data["decision"]["estimated_confidence"] >= 80.0

def test_financial_trade_escalates(client):
    login_resp = client.post("/api/v1/auth/login", json={"email": "user@trustiq.ai", "password": "password123"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    msg_resp = client.post(
        "/api/v1/assistant/message",
        headers=headers,
        json={"content": "Execute a $50,000 stock trade for me"}
    )
    assert msg_resp.status_code == 200
    data = msg_resp.json()
    assert data["decision"]["risk_level"] == "critical"
    assert data["decision"]["routing_action"] == "decline"
