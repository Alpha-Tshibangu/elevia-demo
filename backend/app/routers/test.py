from fastapi import APIRouter

router = APIRouter()

@router.get("/mock-data")
async def get_mock_data():
    return {
        "message": "FastAPI backend is working!",
        "data": {
            "organizations": [{"id": "1", "name": "Test Org"}],
            "reports": [{"id": "1", "title": "Test Report"}],
            "status": "success"
        }
    }
