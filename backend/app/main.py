from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routes import transactions, expenses, ai
from app.exceptions import AppException, app_exception_handler
import time
import uuid
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="LedgerMind AI")

# Configure CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["expenses"])
app.include_router(ai.router)

app.add_exception_handler(AppException, app_exception_handler)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    idem = str(uuid.uuid4())
    logger.info(f"rid={idem} start request path={request.url.path}")
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = (time.time() - start_time) * 1000
    formatted_process_time = '{0:.2f}'.format(process_time)
    logger.info(f"rid={idem} completed_in={formatted_process_time}ms status_code={response.status_code}")
    response.headers["X-Request-ID"] = idem
    return response

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
