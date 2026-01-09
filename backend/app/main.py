from fastapi import FastAPI
from app.routes.analyze import router as analyze_router
from app.routes.health import router as health_router
from app.keepalive import keep_alive
import asyncio
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    asyncio.create_task(keep_alive())
    yield
    # Shutdown (if needed)

app = FastAPI(
    title="Overload API",
    version="1.0.0",
    docs_url="/docs",
    description="AI-powered Python bug identification service",
    lifespan=lifespan
)

app.include_router(analyze_router)
app.include_router(health_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)