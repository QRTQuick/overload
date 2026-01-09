import asyncio
import logging
import aiohttp
import os

logger = logging.getLogger(__name__)

async def keep_alive():
    """Keep-alive by pinging the health endpoint every 2 seconds"""
    # Get the service URL from environment or use localhost for development
    service_url = os.getenv("RENDER_EXTERNAL_URL", "http://localhost:8000")
    health_url = f"{service_url}/health"
    
    while True:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(health_url, timeout=aiohttp.ClientTimeout(total=5)) as response:
                    if response.status == 200:
                        logger.info(f"Keep-alive ping successful: {health_url}")
                        print(f"Keep-alive ping successful: {health_url}")
                    else:
                        logger.warning(f"Keep-alive ping failed with status {response.status}")
        except Exception as e:
            logger.error(f"Keep-alive ping error: {e}")
            print(f"Keep-alive ping error: {e}")
        
        await asyncio.sleep(2)