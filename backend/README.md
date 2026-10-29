# DrGodly Pharmacy Assist — Backend (FastAPI + PostgreSQL)

Production-grade Python backend for DrGodly AI Clinical Counter Assist, providing deterministic clinical triage, CDSCO 2026 formulary validation, telephony webhooks, and tele-RMP referrals.

## Architecture

- **Runtime & Framework:** Python 3.10+ / FastAPI
- **Database:** PostgreSQL (with SQLAlchemy 2.0 Async + `asyncpg` / `aiosqlite`)
- **Schema Validation:** Pydantic v2 & OpenAPI 3.0
- **Standards:** HL7 FHIR R4, CDSCO 2026 Drugs & Cosmetics Act, DPDP Act 2023, Telemedicine Practice Guidelines 2020

---

## Directory Structure

```
backend/
├── app/
│   ├── main.py                     # FastAPI application entrypoint & middleware
│   ├── core/
│   │   ├── config.py               # Environment & database configuration
│   │   └── database.py             # SQLAlchemy async engine & sessionmaker
│   ├── models/
│   │   └── models.py               # PostgreSQL relational tables & Enums
│   ├── schemas/
│   │   └── schemas.py              # Pydantic request/response schemas
│   ├── services/
│   │   ├── clinical_engine.py      # Deterministic 4-level triage (RED/ORANGE/YELLOW/GREEN) & SBAR
│   │   ├── formulary_service.py    # CDSCO 2026 Schedule H/H1 & Pediatric FDC enforcement
│   │   ├── voice_service.py        # Telephony dialog turns & WhatsApp dispatch payloads
│   │   └── fhir_service.py         # HL7 FHIR R4 clinical bundle serialization
│   └── api/
│       └── v1/
│           ├── telephony.py        # Inbound webhook for counter QR calling
│           ├── encounters.py       # Clinical intake creation, queue & WhatsApp dispatch
│           ├── triage.py           # Pharmacist OTC dispense, referral & 108 emergency
│           ├── catalog.py          # CDSCO 2026 medication catalog & dispense verification
│           ├── doctors.py          # NMC-verified Tele-RMP directory & booking
│           └── qr.py               # Standee QR generator & scan counter analytics
├── database/
│   └── schema.sql                  # Canonical PostgreSQL DDL script
├── protocols/                      # 14+ Clinical decision JSON rule sets
├── pyproject.toml
└── requirements.txt
```

---

## Quickstart

### 1. Run with `uv` (Fastest, zero-config):

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

### 2. Run with standard `pip` & `python`:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## PostgreSQL Configuration

Set the environment variables in a `.env` file or export them:

```bash
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/drgodly_pharmacy
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=drgodly_pharmacy
```

---

## Interactive API Documentation

Once the server is running, open:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
- **OpenAPI JSON:** `http://localhost:8000/v1/openapi.json`
- **Health Check:** `http://localhost:8000/health`
