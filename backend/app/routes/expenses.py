from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import ReceiptExtraction

router = APIRouter()

@router.post("/parse-receipt", response_model=ReceiptExtraction)
async def parse_receipt(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type.")
    
    contents = await file.read()
    
    # TODO: Connect to Adaption SDK or Vision LLM in the future.
    # Currently returning a mock structured response.
    
    return ReceiptExtraction(
        merchant="Mock Merchant",
        date="2026-08-07T12:00:00Z",
        total_amount=150.00,
        category="Meals & Entertainment",
        line_items=[
            {"item": "Mock Item 1", "price": 100.00},
            {"item": "Mock Item 2", "price": 50.00}
        ]
    )
