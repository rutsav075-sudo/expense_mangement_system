from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class RoleEnum(str, Enum):
    Employee = "Employee"
    Manager = "Manager"

class CategoryEnum(str, Enum):
    Groceries = "Groceries"
    Travel = "Travel"
    Meals = "Meals & Entertainment"
    Utilities = "Utilities"
    Software = "Software"
    Office = "Office Supplies"

class PaymentMethodEnum(str, Enum):
    UPI = "UPI"
    CreditCard = "Credit Card"
    DebitCard = "Debit Card"
    Cash = "Cash"
    BankTransfer = "Bank Transfer"

class LineItem(BaseModel):
    item: str
    price: float

class User(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: RoleEnum
    monthlyBudget: float = Field(ge=0.0)
    createdAt: datetime

class TransactionBase(BaseModel):
    userId: str
    amount: float = Field(gt=0.0)
    currency: str = "INR"
    category: str
    merchant: str
    date: str
    paymentMethod: str
    entryMethod: str = "MANUAL"
    receiptUrl: Optional[str] = None
    lineItems: Optional[List[LineItem]] = []
    isFlagged: bool = False
    flagReason: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: str
    
class ReceiptExtraction(BaseModel):
    merchant: str
    date: str
    total_amount: float
    category: str
    line_items: Optional[List[LineItem]] = []
