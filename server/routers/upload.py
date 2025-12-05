import shutil
import os
from fastapi import APIRouter, UploadFile, File

router = APIRouter(
    prefix="/upload",
    tags=["upload"],
)

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return local URL (assuming server runs on localhost:8000)
    return {"url": f"http://localhost:8000/uploads/{file.filename}"}
