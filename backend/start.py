"""
FastAPI development server startup script for Elevia Financial Intelligence Platform
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    # Note: If you need to change the working directory, uncomment and update this:
    # import os
    # os.chdir("/path/to/your/elevia-platform/backend")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )