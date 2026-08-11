from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models import TransactionCreate, TransactionUpdate, TransactionResponse
from app.database import get_supabase
import uuid
import datetime

router = APIRouter()

# Dependency to get db
def get_db():
    try:
        return get_supabase()
    except Exception as e:
        # In a real app we would halt if DB is down, but for MVP without creds we'll mock.
        return None

# Mock DB for initial development if Supabase isn't configured yet
mock_db = {
    "1": {
        "id": "1",
        "userId": "demo-user",
        "amount": 150.00,
        "currency": "USD",
        "category": "Travel",
        "merchant": "Delta Airlines",
        "date": "2024-01-15",
        "paymentMethod": "Corporate Card",
        "entryMethod": "Auto",
        "isFlagged": False,
        "receiptUrl": None,
        "lineItems": None,
        "flagReason": None
    },
    "2": {
        "id": "2",
        "userId": "demo-user",
        "amount": 45.50,
        "currency": "USD",
        "category": "Meals & Entertainment",
        "merchant": "Starbucks",
        "date": "2024-01-18",
        "paymentMethod": "Personal Card",
        "entryMethod": "Manual",
        "isFlagged": True,
        "receiptUrl": None,
        "lineItems": None,
        "flagReason": "Weekend charge"
    },
    "3": {
        "id": "3",
        "userId": "demo-user",
        "amount": 299.99,
        "currency": "USD",
        "category": "Software",
        "merchant": "AWS",
        "date": "2024-01-20",
        "paymentMethod": "Corporate Card",
        "entryMethod": "Auto",
        "isFlagged": False,
        "receiptUrl": None,
        "lineItems": None,
        "flagReason": None
    },
    "4": {
        "id": "4",
        "userId": "demo-user",
        "amount": 12.00,
        "currency": "USD",
        "category": "Meals & Entertainment",
        "merchant": "Uber Eats",
        "date": "2024-01-21",
        "paymentMethod": "Corporate Card",
        "entryMethod": "Auto",
        "isFlagged": False,
        "receiptUrl": None,
        "lineItems": None,
        "flagReason": None
    }
}

@router.post("/", response_model=TransactionResponse)
async def create_transaction(transaction: TransactionCreate, db=Depends(get_db)):
    # Simple validation handled by Pydantic (amount > 0)
    
    new_tx = transaction.model_dump()
    # Add id if using mock
    new_tx["id"] = str(uuid.uuid4())
    
    if db:
        # Supabase insertion
        try:
            data, count = db.table("transactions").insert(new_tx).execute()
            return data[1][0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # Fallback mock insertion
        mock_db[new_tx["id"]] = new_tx
        return new_tx

@router.get("/", response_model=List[TransactionResponse])
async def list_transactions(db=Depends(get_db)):
    if db:
        try:
            data, count = db.table("transactions").select("*").execute()
            return data[1]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        return list(mock_db.values())

@router.get("/{tx_id}", response_model=TransactionResponse)
async def get_transaction(tx_id: str, db=Depends(get_db)):
    if db:
        try:
            data, count = db.table("transactions").select("*").eq("id", tx_id).execute()
            if not data[1]:
                raise HTTPException(status_code=404, detail="Transaction not found")
            return data[1][0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        if tx_id not in mock_db:
            raise HTTPException(status_code=404, detail="Transaction not found")
        return mock_db[tx_id]

@router.put("/{tx_id}", response_model=TransactionResponse)
async def update_transaction(tx_id: str, transaction: TransactionUpdate, db=Depends(get_db)):
    update_data = transaction.model_dump()
    if db:
        try:
            data, count = db.table("transactions").update(update_data).eq("id", tx_id).execute()
            if not data[1]:
                raise HTTPException(status_code=404, detail="Transaction not found")
            return data[1][0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        if tx_id not in mock_db:
            raise HTTPException(status_code=404, detail="Transaction not found")
        updated_tx = {**mock_db[tx_id], **update_data}
        mock_db[tx_id] = updated_tx
        return updated_tx

@router.delete("/{tx_id}")
async def delete_transaction(tx_id: str, db=Depends(get_db)):
    if db:
        try:
            data, count = db.table("transactions").delete().eq("id", tx_id).execute()
            return {"status": "success"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        if tx_id in mock_db:
            del mock_db[tx_id]
            return {"status": "success"}
        raise HTTPException(status_code=404, detail="Transaction not found")
