# LedgerMind AI

Enterprise expense management system with an AI-ready backend (FastAPI + Supabase) and a premium dark-mode React dashboard frontend (Next.js + TailwindCSS).

## Backend Setup

1. `cd backend`
2. Create and activate a virtual environment (`python -m venv venv`)
3. `pip install -r requirements.txt`
4. Copy `.env` template and fill in `SUPABASE_URL`, `SUPABASE_KEY` and `ADAPTION_API_KEY`
5. Run server: `uvicorn app.main:app --reload`
6. API Docs available at `http://localhost:8000/docs`

## Frontend Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Access dashboard at `http://localhost:3000`
