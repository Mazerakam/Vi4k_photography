from fastapi import FastAPI, APIRouter, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Optional, List, Dict, Any
import logging
import os
from pathlib import Path

# Import custom modules
from models import *
from database import db_manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
ROOT_DIR = Path(__file__).parent
from dotenv import load_dotenv
load_dotenv(ROOT_DIR / '.env')

# Lifespan manager for startup and shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await db_manager.connect()
        logger.info("Application started successfully")
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        raise
    
    yield
    
    # Shutdown
    await db_manager.disconnect()
    logger.info("Application shutdown")

# Create the main app
app = FastAPI(
    title="Portfolio Photographique API",
    description="API pour le portfolio photographique d'Alex Dubois",
    version="1.0.0",
    lifespan=lifespan
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ PHOTOGRAPHER ENDPOINTS ============

@api_router.get("/photographer", response_model=Dict[str, Any])
async def get_photographer():
    """Get photographer information"""
    try:
        photographer = await db_manager.get_documents("photographer", limit=1)
        if not photographer:
            raise HTTPException(status_code=404, detail="Photographer information not found")
        return {
            "success": True,
            "data": photographer[0]
        }
    except Exception as e:
        logger.error(f"Error getting photographer: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.put("/photographer", response_model=Dict[str, Any])
async def update_photographer(photographer_data: PhotographerUpdate):
    """Update photographer information"""
    try:
        # Get the first photographer (should be only one)
        photographers = await db_manager.get_documents("photographer", limit=1)
        if not photographers:
            raise HTTPException(status_code=404, detail="Photographer not found")
        
        photographer_id = photographers[0]['id']
        update_data = photographer_data.dict(exclude_unset=True)
        
        updated_photographer = await db_manager.update_document("photographer", photographer_id, update_data)
        if not updated_photographer:
            raise HTTPException(status_code=404, detail="Failed to update photographer")
        
        return {
            "success": True,
            "message": "Photographer information updated successfully",
            "data": updated_photographer
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating photographer: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ============ CATEGORIES ENDPOINTS ============

@api_router.get("/categories", response_model=Dict[str, Any])
async def get_categories(active_only: bool = Query(True)):
    """Get all categories"""
    try:
        filter_dict = {"is_active": True} if active_only else {}
        categories = await db_manager.get_documents(
            "categories", 
            filter_dict=filter_dict,
            sort=[("order", 1), ("name", 1)]
        )
        return {
            "success": True,
            "data": categories
        }
    except Exception as e:
        logger.error(f"Error getting categories: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/categories/{category_id}", response_model=Dict[str, Any])
async def get_category(category_id: str):
    """Get a specific category"""
    try:
        category = await db_manager.get_document("categories", category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return {
            "success": True,
            "data": category
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting category: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/categories", response_model=Dict[str, Any])
async def create_category(category_data: CategoryCreate):
    """Create a new category"""
    try:
        category_dict = category_data.dict()
        category_dict['id'] = f"category-{int(datetime.utcnow().timestamp())}"
        
        created_category = await db_manager.create_document("categories", category_dict)
        return {
            "success": True,
            "message": "Category created successfully",
            "data": created_category
        }
    except Exception as e:
        logger.error(f"Error creating category: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ============ PHOTOS ENDPOINTS ============

@api_router.get("/photos", response_model=Dict[str, Any])
async def get_photos(
    category: Optional[str] = Query(None),
    visible_only: bool = Query(True),
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100)
):
    """Get photos with optional filtering"""
    try:
        filter_dict = {}
        if category:
            filter_dict["category"] = category
        if visible_only:
            filter_dict["is_visible"] = True
        
        # Calculate skip for pagination
        skip = (page - 1) * per_page
        
        photos = await db_manager.get_documents(
            "photos",
            filter_dict=filter_dict,
            sort=[("order", 1), ("date", -1)],
            limit=per_page,
            skip=skip
        )
        
        total = await db_manager.count_documents("photos", filter_dict)
        total_pages = (total + per_page - 1) // per_page
        
        return {
            "success": True,
            "data": photos,
            "pagination": {
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": total_pages
            }
        }
    except Exception as e:
        logger.error(f"Error getting photos: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/photos/category/{category_id}", response_model=Dict[str, Any])
async def get_photos_by_category(category_id: str, visible_only: bool = Query(True)):
    """Get photos by category"""
    try:
        filter_dict = {"category": category_id}
        if visible_only:
            filter_dict["is_visible"] = True
        
        photos = await db_manager.get_documents(
            "photos",
            filter_dict=filter_dict,
            sort=[("order", 1), ("date", -1)]
        )
        
        return {
            "success": True,
            "data": photos
        }
    except Exception as e:
        logger.error(f"Error getting photos by category: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/photos", response_model=Dict[str, Any])
async def create_photo(photo_data: PhotoCreate):
    """Create a new photo"""
    try:
        photo_dict = photo_data.dict()
        photo_dict['id'] = f"photo-{int(datetime.utcnow().timestamp())}"
        
        created_photo = await db_manager.create_document("photos", photo_dict)
        return {
            "success": True,
            "message": "Photo created successfully",
            "data": created_photo
        }
    except Exception as e:
        logger.error(f"Error creating photo: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ============ TESTIMONIALS ENDPOINTS ============

@api_router.get("/testimonials", response_model=Dict[str, Any])
async def get_testimonials(visible_only: bool = Query(True)):
    """Get all testimonials"""
    try:
        filter_dict = {"is_visible": True} if visible_only else {}
        testimonials = await db_manager.get_documents(
            "testimonials",
            filter_dict=filter_dict,
            sort=[("order", 1), ("created_at", -1)]
        )
        return {
            "success": True,
            "data": testimonials
        }
    except Exception as e:
        logger.error(f"Error getting testimonials: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/testimonials", response_model=Dict[str, Any])
async def create_testimonial(testimonial_data: TestimonialCreate):
    """Create a new testimonial"""
    try:
        testimonial_dict = testimonial_data.dict()
        testimonial_dict['id'] = f"testimonial-{int(datetime.utcnow().timestamp())}"
        
        created_testimonial = await db_manager.create_document("testimonials", testimonial_dict)
        return {
            "success": True,
            "message": "Testimonial created successfully",
            "data": created_testimonial
        }
    except Exception as e:
        logger.error(f"Error creating testimonial: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ============ CONTACT ENDPOINTS ============

@api_router.post("/contact", response_model=Dict[str, Any])
async def create_contact(contact_data: ContactCreate):
    """Create a new contact message"""
    try:
        contact_dict = contact_data.dict()
        contact_dict['id'] = f"contact-{int(datetime.utcnow().timestamp())}"
        
        created_contact = await db_manager.create_document("contacts", contact_dict)
        return {
            "success": True,
            "message": "Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
            "data": created_contact
        }
    except Exception as e:
        logger.error(f"Error creating contact: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/contact", response_model=Dict[str, Any])
async def get_contacts(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """Get contact messages (admin endpoint)"""
    try:
        filter_dict = {}
        if status:
            filter_dict["status"] = status
        
        skip = (page - 1) * per_page
        
        contacts = await db_manager.get_documents(
            "contacts",
            filter_dict=filter_dict,
            sort=[("created_at", -1)],
            limit=per_page,
            skip=skip
        )
        
        total = await db_manager.count_documents("contacts", filter_dict)
        total_pages = (total + per_page - 1) // per_page
        
        return {
            "success": True,
            "data": contacts,
            "pagination": {
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": total_pages
            }
        }
    except Exception as e:
        logger.error(f"Error getting contacts: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ============ SERVICES ENDPOINTS ============

@api_router.get("/services", response_model=Dict[str, Any])
async def get_services(active_only: bool = Query(True)):
    """Get all services"""
    try:
        filter_dict = {"is_active": True} if active_only else {}
        services = await db_manager.get_documents(
            "services",
            filter_dict=filter_dict,
            sort=[("order", 1), ("name", 1)]
        )
        return {
            "success": True,
            "data": services
        }
    except Exception as e:
        logger.error(f"Error getting services: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/services", response_model=Dict[str, Any])
async def create_service(service_data: ServiceCreate):
    """Create a new service"""
    try:
        service_dict = service_data.dict()
        service_dict['id'] = f"service-{int(datetime.utcnow().timestamp())}"
        
        created_service = await db_manager.create_document("services", service_dict)
        return {
            "success": True,
            "message": "Service created successfully",
            "data": created_service
        }
    except Exception as e:
        logger.error(f"Error creating service: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ============ HEALTH CHECK ============

@api_router.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "success": True,
        "message": "Portfolio Photographique API is running",
        "timestamp": datetime.utcnow()
    }

# Include the router in the main app
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)