from supabase import create_client, Client
from app.config import settings

def get_supabase() -> Client:
    # If credentials are empty (e.g. for initial MVP without a real db), we could return a mock or handle it.
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise ValueError("Supabase credentials are not set in .env")
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
