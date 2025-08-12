from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from typing import Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        
    async def connect(self):
        """Connect to MongoDB"""
        try:
            mongo_url = os.environ.get('MONGO_URL')
            if not mongo_url:
                raise ValueError("MONGO_URL environment variable is not set")
            
            self.client = AsyncIOMotorClient(mongo_url)
            self.db = self.client[os.environ.get('DB_NAME', 'portfolio')]
            
            # Test the connection
            await self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
            # Initialize data if collections are empty
            await self.initialize_data()
            
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            logger.info("Disconnected from MongoDB")
    
    async def initialize_data(self):
        """Initialize the database with default data"""
        try:
            # Initialize photographer data
            photographer_count = await self.db.photographer.count_documents({})
            if photographer_count == 0:
                photographer_data = {
                    "id": "photographer-1",
                    "name": "Alex Dubois",
                    "bio": "Photographe passionné spécialisé dans la capture d'émotions authentiques. Mon approche artistique mélange spontanéité et composition soignée pour créer des images qui racontent votre histoire unique.",
                    "experience": "5+ années d'expérience",
                    "location": "Paris & région parisienne",
                    "email": "contact@alexdubois-photo.fr",
                    "phone": "+33 6 12 34 56 78",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                await self.db.photographer.insert_one(photographer_data)
                logger.info("Initialized photographer data")
            
            # Initialize categories
            categories_count = await self.db.categories.count_documents({})
            if categories_count == 0:
                categories_data = [
                    {
                        "id": "mariage",
                        "name": "Mariage",
                        "description": "Capturer les moments les plus précieux de votre journée spéciale",
                        "cover_image": "",
                        "order": 1,
                        "is_active": True,
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    },
                    {
                        "id": "nature",
                        "name": "Nature",
                        "description": "La beauté naturelle à travers mon objectif",
                        "cover_image": "",
                        "order": 2,
                        "is_active": True,
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    },
                    {
                        "id": "nourriture",
                        "name": "Nourritures",
                        "description": "Sublimer vos créations culinaires",
                        "cover_image": "",
                        "order": 3,
                        "is_active": True,
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                ]
                await self.db.categories.insert_many(categories_data)
                logger.info("Initialized categories data")
            
            # Initialize testimonials
            testimonials_count = await self.db.testimonials.count_documents({})
            if testimonials_count == 0:
                testimonials_data = [
                    {
                        "id": "testimonial-1",
                        "name": "Marie & Thomas",
                        "text": "Alex a su capturer l'essence de notre mariage avec une sensibilité artistique exceptionnelle. Chaque photo raconte notre histoire.",
                        "category": "mariage",
                        "is_visible": True,
                        "order": 1,
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    },
                    {
                        "id": "testimonial-2",
                        "name": "Restaurant La Belle Époque",
                        "text": "Les photos culinaires d'Alex subliment nos plats. Son œil artistique met parfaitement en valeur notre cuisine.",
                        "category": "nourriture",
                        "is_visible": True,
                        "order": 2,
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                ]
                await self.db.testimonials.insert_many(testimonials_data)
                logger.info("Initialized testimonials data")
            
            # Initialize services
            services_count = await self.db.services.count_documents({})
            if services_count == 0:
                services_data = [
                    {
                        "id": "service-1",
                        "name": "Photographie de Mariage",
                        "description": "Reportage complet de votre journée spéciale",
                        "price": "À partir de 1200€",
                        "duration": "Journée complète",
                        "is_active": True,
                        "order": 1,
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    },
                    {
                        "id": "service-2",
                        "name": "Séance Nature",
                        "description": "Capture de paysages et moments naturels",
                        "price": "À partir de 300€",
                        "duration": "2-3 heures",
                        "is_active": True,
                        "order": 2,
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    },
                    {
                        "id": "service-3",
                        "name": "Photographie Culinaire",
                        "description": "Mise en valeur de vos créations gastronomiques",
                        "price": "À partir de 400€",
                        "duration": "Demi-journée",
                        "is_active": True,
                        "order": 3,
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                ]
                await self.db.services.insert_many(services_data)
                logger.info("Initialized services data")
            
        except Exception as e:
            logger.error(f"Failed to initialize data: {e}")
            raise
    
    # Generic CRUD operations
    async def create_document(self, collection: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new document"""
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        result = await self.db[collection].insert_one(data)
        if result.inserted_id:
            return await self.get_document(collection, data['id'])
        return None
    
    async def get_document(self, collection: str, doc_id: str) -> Optional[Dict[str, Any]]:
        """Get a document by ID"""
        document = await self.db[collection].find_one({"id": doc_id})
        if document:
            document['_id'] = str(document['_id'])
        return document
    
    async def get_documents(
        self, 
        collection: str, 
        filter_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[List[tuple]] = None,
        limit: Optional[int] = None,
        skip: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """Get multiple documents with filters"""
        filter_dict = filter_dict or {}
        cursor = self.db[collection].find(filter_dict)
        
        if sort:
            cursor = cursor.sort(sort)
        if skip:
            cursor = cursor.skip(skip)
        if limit:
            cursor = cursor.limit(limit)
        
        documents = await cursor.to_list(length=None)
        for doc in documents:
            doc['_id'] = str(doc['_id'])
        return documents
    
    async def update_document(self, collection: str, doc_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a document"""
        update_data['updated_at'] = datetime.utcnow()
        result = await self.db[collection].update_one(
            {"id": doc_id}, 
            {"$set": update_data}
        )
        if result.matched_count > 0:
            return await self.get_document(collection, doc_id)
        return None
    
    async def delete_document(self, collection: str, doc_id: str) -> bool:
        """Delete a document"""
        result = await self.db[collection].delete_one({"id": doc_id})
        return result.deleted_count > 0
    
    async def count_documents(self, collection: str, filter_dict: Optional[Dict[str, Any]] = None) -> int:
        """Count documents in collection"""
        filter_dict = filter_dict or {}
        return await self.db[collection].count_documents(filter_dict)

# Global database manager instance
db_manager = DatabaseManager()