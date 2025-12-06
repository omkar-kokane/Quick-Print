import shutil
import os
import fitz  # PyMuPDF
from fastapi import APIRouter, UploadFile, File

router = APIRouter(
    prefix="/upload",
    tags=["upload"],
)

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"uploads/{file.filename}"
    
    # Save the file
    with open(file_location, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Count pages using PyMuPDF
    page_count = 1
    try:
        doc = fitz.open(file_location)
        page_count = doc.page_count
        doc.close()
    except Exception as e:
        print(f"Error counting pages: {e}")
        page_count = 1
    
    # Return URL and page count
    return {
        "url": f"http://localhost:8000/uploads/{file.filename}",
        "page_count": page_count
    }
