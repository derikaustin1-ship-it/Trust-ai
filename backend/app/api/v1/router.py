from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.conversations import router as conversations_router
from app.api.v1.assistant import router as assistant_router
from app.api.v1.decisions import router as decisions_router
from app.api.v1.reviews import router as reviews_router
from app.api.v1.evaluation import router as evaluation_router
from app.api.v1.agents import router as agents_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.system import router as system_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(conversations_router)
api_router.include_router(assistant_router)
api_router.include_router(decisions_router)
api_router.include_router(reviews_router)
api_router.include_router(evaluation_router)
api_router.include_router(agents_router)
api_router.include_router(analytics_router)
api_router.include_router(system_router)
