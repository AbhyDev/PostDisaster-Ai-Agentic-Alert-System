"""
FastAPI Application for PostDisaster System
Provides endpoints for satellite image analysis and disaster response
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import shutil
from pathlib import Path
import json
from typing import Optional

# Import our modules
from satellite import analyze_city_image
from postdisaster_system import analyze_city_from_image_and_run_crew, city_map, run_disaster_analysis

app = FastAPI(
    title="PostDisaster AI System",
    description="AI-powered disaster response analysis using satellite images and CrewAI",
    version="1.0.0"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "PostDisaster AI System API",
        "version": "1.0.0",
        "endpoints": {
            "analyze_image": "/analyze-image/",
            "analyze_city": "/analyze-city/{city_id}",
            "get_cities": "/cities/",
            "complete_analysis": "/complete-analysis/"
        }
    }

@app.get("/cities/")
async def get_cities():
    """Get list of available cities"""
    return {
        "cities": city_map,
        "total_cities": len(city_map),
        "status": "success"
    }

@app.post("/analyze-image/")
async def analyze_image_endpoint(file: UploadFile = File(...)):
    """
    Analyze uploaded satellite image to identify city
    
    Args:
        file: Uploaded image file
        
    Returns:
        JSON response with detected city information
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Analyze the image
        city_number = analyze_city_image(str(file_path))
        
        if city_number:
            response = {
                "success": True,
                "city_number": city_number,
                "city_name": city_map[city_number],
                "message": f"Successfully identified {city_map[city_number]}",
                "filename": file.filename,
                "available_cities": city_map
            }
        else:
            response = {
                "success": False,
                "city_number": 1,
                "city_name": city_map[1],
                "message": "Could not identify city, using default (Seabrook City)",
                "filename": file.filename,
                "available_cities": city_map
            }
        
        # Clean up uploaded file
        os.remove(file_path)
        
        return JSONResponse(content=response)
        
    except Exception as e:
        # Clean up file if it exists
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
            
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.get("/analyze-city/{city_id}")
async def analyze_city_endpoint(city_id: int):
    """
    Run disaster analysis for a specific city
    
    Args:
        city_id: City ID (1-5)
        
    Returns:
        JSON response with disaster analysis results
    """
    try:
        if city_id not in city_map:
            raise HTTPException(status_code=400, detail=f"Invalid city_id. Must be between 1 and {len(city_map)}")
        
        print(f"Running disaster analysis for city {city_id}: {city_map[city_id]}")
        
        # Run CrewAI analysis
        crew_results = run_disaster_analysis(city_id)
        
        response = {
            "success": True,
            "city_id": city_id,
            "city_name": city_map[city_id],
            "disaster_analysis": crew_results,
            "message": f"Disaster analysis completed for {city_map[city_id]}"
        }
        
        return JSONResponse(content=response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running disaster analysis: {str(e)}")

@app.post("/complete-analysis/")
async def complete_analysis_endpoint(file: UploadFile = File(...)):
    """
    Complete workflow: Upload image -> Analyze city -> Run disaster analysis
    
    Args:
        file: Uploaded satellite image
        
    Returns:
        JSON response with complete analysis results
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"Processing complete analysis for: {file.filename}")
        
        # Run complete analysis
        results = analyze_city_from_image_and_run_crew(str(file_path))
        
        # Add filename to results
        results["filename"] = file.filename
        
        # Clean up uploaded file
        os.remove(file_path)
        
        return JSONResponse(content=results)
        
    except Exception as e:
        # Clean up file if it exists
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
            
        raise HTTPException(status_code=500, detail=f"Error in complete analysis: {str(e)}")

@app.get("/test-analysis/")
async def test_analysis():
    """
    Test endpoint using the default Baytown image
    """
    try:
        print("Running test analysis with default Baytown image...")
        
        # Use the default Baytown image path
        default_image = r"D:\All Projects\Site uploaded\PostDisaster-Ai-Agentic-Alert-System\Dummy Cities\Baytown.png"
        
        if not os.path.exists(default_image):
            return {
                "success": False,
                "message": "Default test image not found",
                "image_path": default_image
            }
        
        # Run complete analysis
        results = analyze_city_from_image_and_run_crew(default_image)
        results["test_mode"] = True
        results["image_path"] = default_image
        
        return JSONResponse(content=results)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in test analysis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("Starting PostDisaster AI System API...")
    print("Available endpoints:")
    print("- GET  /: API information")
    print("- GET  /cities/: List available cities")
    print("- POST /analyze-image/: Analyze uploaded image")
    print("- GET  /analyze-city/{city_id}: Run disaster analysis for specific city")
    print("- POST /complete-analysis/: Complete workflow (image + analysis)")
    print("- GET  /test-analysis/: Test with default Baytown image")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)