import asyncio
import logging

logger = logging.getLogger(__name__)

async def keep_alive():
    while True:
        await asyncio.sleep(50)
        logger.info("Overload API alive")
        print("Overload API alive")