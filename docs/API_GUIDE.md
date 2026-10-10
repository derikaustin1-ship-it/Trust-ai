# REST API Documentation Guide

The TRUSTIQ AI backend exposes versioned REST APIs under `/api/v1`.

Interactive Swagger OpenAPI documentation is available at `http://localhost:8000/api/v1/docs`.

## Key Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` — Create new user account
- `POST /api/v1/auth/login` — Authenticate and receive JWT token
- `GET /api/v1/auth/me` — Retrieve current user profile

### Dashboard & Analytics
- `GET /api/v1/dashboard/summary` — Overview metrics and recent decisions
- `GET /api/v1/analytics/overview` — Historical risk, action, and category analytics

### Assistant Pipeline
- `POST /api/v1/assistant/message` — Process prompt through 14-step decision pipeline
- `POST /api/v1/assistant/{decision_id}/feedback` — Submit rating and feedback

### Decision History & Human Review
- `GET /api/v1/decisions` — Search and filter decision audit logs
- `GET /api/v1/reviews` — Fetch human review queue cases
- `POST /api/v1/reviews/{review_id}/approve` — Approve escalated decision
- `POST /api/v1/reviews/{review_id}/reject` — Reject escalated decision

### Evaluation Laboratory
- `GET /api/v1/evaluation/datasets` — List benchmark datasets
- `POST /api/v1/evaluation/runs` — Trigger benchmark evaluation run
- `GET /api/v1/evaluation/runs/{run_id}/export` — Download CSV benchmark results
