import pytest

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_create_transaction_success(client):
    new_tx = {
        "userId": "user123",
        "amount": 150.0,
        "currency": "INR",
        "category": "Meals & Entertainment",
        "merchant": "Test Restaurant",
        "date": "2026-08-07",
        "paymentMethod": "Credit Card"
    }
    response = client.post("/api/transactions/", json=new_tx)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["amount"] == 150.0
    assert data["merchant"] == "Test Restaurant"

def test_create_transaction_negative_amount(client):
    new_tx = {
        "userId": "user123",
        "amount": -50.0, # Invalid amount
        "currency": "INR",
        "category": "Travel",
        "merchant": "Uber",
        "date": "2026-08-07",
        "paymentMethod": "Cash"
    }
    response = client.post("/api/transactions/", json=new_tx)
    assert response.status_code == 422 # Pydantic validation error

def test_list_transactions(client):
    response = client.get("/api/transactions/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
