from fastapi import FastAPI
from app.routes.analyze import router as analyze_router
from app.routes.health import router as health_router
from app.keepalive import keep_alive
import asyncio

app = FastAPI(
    title="Overload API",
    version="1.0.0",
    docs_url="/docs",
    description="AI-powered Python bug identification service"
)

app.include_router(analyze_router)
app.include_router(health_router)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(keep_alive())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)