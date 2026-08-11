from fastapi import Request
from fastapi.responses import JSONResponse

class AppException(Exception):
    def __init__(self, name: str, status_code: int = 500, detail: str = ""):
        self.name = name
        self.status_code = status_code
        self.detail = detail

class DatabaseError(AppException):
    def __init__(self, detail: str = "A database error occurred."):
        super().__init__(name="DatabaseError", status_code=500, detail=detail)

class ValidationError(AppException):
    def __init__(self, detail: str = "Invalid input."):
        super().__init__(name="ValidationError", status_code=400, detail=detail)

async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.name, "detail": exc.detail},
    )
