from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid

# Photographer Model
class PhotographerBase(BaseModel):
    name: str
    bio: str
    experience: str
    location: str
    email: EmailStr
    phone: str

class PhotographerCreate(PhotographerBase):
    pass

class PhotographerUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    experience: Optional[str] = None
    location: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class Photographer(PhotographerBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Category Models
class CategoryBase(BaseModel):
    name: str
    description: str
    cover_image: Optional[str] = None
    order: int = 0
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class Category(CategoryBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Photo Models
class PhotoBase(BaseModel):
    title: str
    image: str  # Base64 encoded
    category: str  # Category ID
    date: datetime
    description: Optional[str] = None
    is_visible: bool = True
    order: int = 0

class PhotoCreate(PhotoBase):
    pass

class PhotoUpdate(BaseModel):
    title: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    is_visible: Optional[bool] = None
    order: Optional[int] = None

class Photo(PhotoBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Testimonial Models
class TestimonialBase(BaseModel):
    name: str
    text: str
    category: Optional[str] = None  # Related category
    is_visible: bool = True
    order: int = 0

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    text: Optional[str] = None
    category: Optional[str] = None
    is_visible: Optional[bool] = None
    order: Optional[int] = None

class Testimonial(TestimonialBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Contact Models
class ContactBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    category: Optional[str] = None
    message: str
    date: Optional[datetime] = None  # Preferred date
    status: str = "new"  # 'new', 'read', 'replied'

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    status: Optional[str] = None

class Contact(ContactBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Service Models
class ServiceBase(BaseModel):
    name: str
    description: str
    price: str
    duration: str
    is_active: bool = True
    order: int = 0

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    duration: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None

class Service(ServiceBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Response Models
class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class PaginatedResponse(BaseModel):
    success: bool = True
    data: List[dict]
    total: int
    page: int
    per_page: int
    total_pages: int