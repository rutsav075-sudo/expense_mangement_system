import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    # In a real app we'd override the get_db dependency here to return a mock DB
    # or point to a test database. For now, since we have the mock fallback in 
    # transactions.py when db is None or errors out, this will use the mock memory DB.
    with TestClient(app) as client:
        yield client
