from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from backend.routes.agent_routes import router as agent_router
from backend.routes.alert_routes import router as alert_router


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("neuroguardian")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 NeuroGuardian backend starting...")
    yield
    logger.info("🛑 NeuroGuardian backend shutting down...")


app = FastAPI(
    title="NeuroGuardian AI Agent",
    version="1.0",
    lifespan=lifespan
)

# CORS (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(agent_router)
app.include_router(alert_router)


@app.get("/")
def health():
    return {
        "status": "running",
        "service": "NeuroGuardian AI backend"
    }