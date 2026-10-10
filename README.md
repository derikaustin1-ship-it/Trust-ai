# TRUSTIQ AI

> **"AI that knows when to answer, verify, or ask for help."**

TRUSTIQ AI is an enterprise-grade, full-stack trust-aware AI agent platform that evaluates uncertainty in user requests, assesses operational risk, executes modular verification tools, asks clarifying questions when context is incomplete, and escalates high-risk cases to human review when automation is inappropriate.

---

## 🚀 Key Features

1. **Multi-Signal Confidence Estimation Engine**: Calculates normalized scores ($0-100$) combining evidence quality (25%), coverage (20%), verification outcomes (25%), model self-assessment (10%), historical accuracy (10%), and multi-sample agreement (10%).
2. **Independent Operational Risk Assessment**: Categorizes risk (Low, Medium, High, Critical). Critical risk policies prevent autonomous execution regardless of confidence.
3. **Modular Verification Pipeline**: Features safe AST arithmetic parsing (`125 * 8`), JSON schema validation, claim-to-evidence matching, and contradiction detection.
4. **Smart Policy Routing Engine**: Dynamically routes requests to `ANSWER`, `VERIFY`, `CLARIFY`, `SPECIALIST`, `ESCALATE`, or `DECLINE`.
5. **Specialist Agent Registry**: Dedicated agent profiles for Research, Code Review, Math Verification, General Knowledge, and Risk Review.
6. **Human Review Queue**: Role-based workflow for Reviewers and Administrators to inspect escalated cases, add notes, and approve/reject decisions.
7. **Evaluation Laboratory**: Offline benchmarking system comparing Baseline AI vs. TRUSTIQ AI across 10 benchmark scenarios with CSV export.
8. **Interactive Hackathon Scenario Presets**: 10 one-click quick-launch presets exercising every route without external API key requirements.
9. **Zero-Config Demo Provider**: Works 100% offline out-of-the-box using a deterministic demo LLM provider.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router v6, TanStack Query.
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, SQLAlchemy 2.0 (ORM), Alembic, Uvicorn, Pytest.
- **Database**: SQLite (default zero-config local setup, PostgreSQL production compatible).
- **Testing**: Pytest for backend unit/integration tests; Vitest & React Testing Library for frontend tests.

---

## 📁 Project Structure

```
trustiq-ai/
├── backend/
│   ├── app/
│   │   ├── api/ v1/ (auth, assistant, decisions, reviews, evaluation, analytics, agents, system)
│   │   ├── core/ (config, security/JWT, database)
│   │   ├── models/ (SQLAlchemy ORM schema definitions)
│   │   ├── schemas/ (Pydantic v2 request/response models)
│   │   ├── services/ (confidence_engine, risk_assessment, verification_engine, routing_engine, llm_provider, decision_pipeline, evaluation_service, seed_service)
│   │   └── main.py
│   ├── tests/ (Pytest test suite)
│   ├── alembic/ & alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/ (common, assistant, confidence, reviews, evaluation, analytics)
│   │   ├── pages/ (Landing, Login, Register, Dashboard, Assistant, Decisions, Reviews, Evaluation, Analytics, Agents, Settings, Docs)
│   │   ├── services/ (API client with JWT handling)
│   │   ├── context/ (AuthContext, ThemeContext)
│   │   └── types/ (TypeScript definitions)
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docs/ (ARCHITECTURE.md, CONFIDENCE_MODEL.md, EVALUATION_METHODOLOGY.md, SECURITY.md, API_GUIDE.md)
├── scripts/ (seed_db.py, start_dev.ps1)
└── README.md
```

---

## 💻 Windows Setup & Local Quickstart

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### Step 1: Clone & Configure Environment
Open Windows PowerShell in the project root (`d:\Trust ai`):

```powershell
# Copy environment configuration files
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

### Step 2: Set Up Backend Virtual Environment & Dependencies

```powershell
cd backend
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt
cd ..
```

### Step 3: Install Frontend Dependencies

```powershell
cd frontend
npm install
cd ..
```

### Step 4: Database Setup & Seeding

```powershell
# Run database seed command (creates demo accounts & benchmark data)
.\backend\venv\Scripts\python scripts/seed_db.py
```

### Step 5: Start Local Development Servers

```powershell
# Option A: Use automated PowerShell startup script
.\scripts\start_dev.ps1

# Option B: Manual Terminal Launch
# Terminal 1 (Backend):
cd backend
.\venv\Scripts\python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 (Frontend):
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔑 Demo Login Accounts

Convenient demo logins are available directly on the login page:

- **Standard User**: `user@trustiq.ai` / `password123`
- **Reviewer**: `reviewer@trustiq.ai` / `password123`
- **Admin**: `admin@trustiq.ai` / `password123`

---

## 🧪 Running Automated Tests

```powershell
# Run Backend Pytest Suite
cd backend
.\venv\Scripts\pytest tests -v

# Run Frontend Vitest Suite
cd frontend
npx vitest run
```

---

## 🎬 Hackathon Presentation Workflow

1. **Launch Landing Page** (`http://localhost:5173`): Show headline *"AI that knows when NOT to answer"* and interactive workflow visualization.
2. **Open AI Assistant** (`/assistant`): Click preset buttons for:
   - **Scenario A (Arithmetic)**: Shows AST math calculation ($125 \times 8 = 1000$) with verified badge.
   - **Scenario B (Missing Context)**: Asks user for missing GPA/major context.
   - **Scenario G (Financial Risk)**: Policy refuses automated execution for a $\$50,000$ trade.
   - **Scenario I (Human Escalation)**: Escalates medical diagnosis query to the Review Queue.
3. **Open Human Review Queue** (`/reviews`): Switch role to **Reviewer** and approve/reject the escalated medical case.
4. **Open Evaluation Lab** (`/evaluation`): Run benchmark evaluation comparing Baseline AI vs TRUSTIQ AI and export results to CSV.

---

## 📄 License & Documentation

For detailed technical specifications, inspect:
- [Architecture & Diagrams](file:///d:/Trust%20ai/docs/ARCHITECTURE.md)
- [Confidence Estimation Math](file:///d:/Trust%20ai/docs/CONFIDENCE_MODEL.md)
- [Evaluation Methodology](file:///d:/Trust%20ai/docs/EVALUATION_METHODOLOGY.md)
- [Security & Reliability](file:///d:/Trust%20ai/docs/SECURITY.md)
- [API Guide](file:///d:/Trust%20ai/docs/API_GUIDE.md)
