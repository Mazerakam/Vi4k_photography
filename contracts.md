# Contrats API - Portfolio Photographique

## Vue d'ensemble
Ce document définit les contrats API entre le frontend et backend du portfolio photographique d'Alex Dubois.

## Modèles de données

### Photographer
```javascript
{
  id: String,
  name: String,
  bio: String,
  experience: String,
  location: String,
  email: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Category
```javascript
{
  id: String,
  name: String,
  description: String,
  coverImage: String, // Base64 or URL
  order: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Photo
```javascript
{
  id: String,
  title: String,
  image: String, // Base64 encoded
  category: String, // Category ID
  date: Date,
  description: String,
  isVisible: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Testimonial
```javascript
{
  id: String,
  name: String,
  text: String,
  category: String, // Related category
  isVisible: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Contact
```javascript
{
  id: String,
  name: String,
  email: String,
  phone: String,
  subject: String,
  category: String,
  message: String,
  date: Date, // Preferred date
  status: String, // 'new', 'read', 'replied'
  createdAt: Date,
  updatedAt: Date
}
```

### Service
```javascript
{
  id: String,
  name: String,
  description: String,
  price: String,
  duration: String,
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Endpoints API

### Photographer Information
- `GET /api/photographer` - Récupérer les informations du photographe
- `PUT /api/photographer` - Mettre à jour les informations

### Categories
- `GET /api/categories` - Récupérer toutes les catégories actives
- `GET /api/categories/:id` - Récupérer une catégorie spécifique
- `POST /api/categories` - Créer une nouvelle catégorie
- `PUT /api/categories/:id` - Mettre à jour une catégorie
- `DELETE /api/categories/:id` - Supprimer une catégorie

### Photos
- `GET /api/photos` - Récupérer toutes les photos (avec filtres optionnels)
- `GET /api/photos/category/:categoryId` - Photos par catégorie
- `GET /api/photos/:id` - Récupérer une photo spécifique
- `POST /api/photos` - Ajouter une nouvelle photo
- `PUT /api/photos/:id` - Mettre à jour une photo
- `DELETE /api/photos/:id` - Supprimer une photo

### Testimonials
- `GET /api/testimonials` - Récupérer tous les témoignages visibles
- `POST /api/testimonials` - Ajouter un nouveau témoignage
- `PUT /api/testimonials/:id` - Mettre à jour un témoignage
- `DELETE /api/testimonials/:id` - Supprimer un témoignage

### Contact
- `POST /api/contact` - Envoyer un message de contact
- `GET /api/contact` - Récupérer tous les messages (admin)
- `PUT /api/contact/:id` - Mettre à jour le statut d'un message

### Services
- `GET /api/services` - Récupérer tous les services actifs
- `POST /api/services` - Ajouter un nouveau service
- `PUT /api/services/:id` - Mettre à jour un service
- `DELETE /api/services/:id` - Supprimer un service

## Données mock à remplacer

### mock.js - portfolioData.photographer
- Remplacer par API call : `GET /api/photographer`

### mock.js - portfolioData.categories
- Remplacer par API call : `GET /api/categories`

### mock.js - portfolioData.gallery
- Remplacer par API calls : 
  - `GET /api/photos` (toutes les photos)
  - `GET /api/photos/category/:categoryId` (par catégorie)

### mock.js - portfolioData.testimonials
- Remplacer par API call : `GET /api/testimonials`

### mock.js - portfolioData.services
- Remplacer par API call : `GET /api/services`

## Intégration Frontend

### Remplacement des imports mock
```javascript
// Avant
import portfolioData from '../mock';

// Après
import { usePhotographer, useCategories, usePhotos, useTestimonials, useServices } from '../hooks/api';
```

### Hooks API à créer
- `usePhotographer()` - Hook pour les données du photographe
- `useCategories()` - Hook pour les catégories
- `usePhotos(categoryId?)` - Hook pour les photos
- `useTestimonials()` - Hook pour les témoignages
- `useServices()` - Hook pour les services
- `useContact()` - Hook pour envoyer des messages

### Composants à modifier
1. **Header.jsx** - Aucune modification nécessaire
2. **Footer.jsx** - Utiliser `usePhotographer()` pour email/phone
3. **Home.jsx** - Remplacer tous les portfolioData par les hooks API
4. **Portfolio.jsx** - Utiliser `useCategories()` et `usePhotos()`
5. **CategoryGallery.jsx** - Utiliser `usePhotos(categoryId)`
6. **About.jsx** - Utiliser `usePhotographer()` et `useServices()`
7. **Contact.jsx** - Utiliser `useContact()` et `usePhotographer()`

## Gestion des images

### Stockage
- Images stockées en Base64 dans MongoDB
- Optimisation : compression automatique côté backend
- Format cible : JPEG, qualité 85%, max 1920px width

### Upload
- Upload via formulaire multipart
- Validation : formats JPG, PNG, WEBP
- Taille max : 5MB par image
- Conversion automatique en Base64

## Initialisation des données

### Données par défaut à insérer
1. **Photographe** - Informations d'Alex Dubois
2. **Catégories** - Mariage, Nature, Nourritures
3. **Photos d'exemple** - Quelques photos pour chaque catégorie
4. **Témoignages** - 2-3 témoignages clients
5. **Services** - Liste des prestations

## Sécurité et Validation

### Validation des données
- Tous les champs requis validés côté backend
- Sanitization des inputs pour éviter XSS
- Validation des formats d'email et téléphone
- Limitation de taille pour les textes

### Upload sécurisé
- Validation des types MIME
- Scan antivirus (optionnel)
- Limitation de taille stricte
- Nettoyage des métadonnées EXIF

## Performance

### Optimisations backend
- Indexation MongoDB sur les champs de recherche
- Pagination pour les listes importantes
- Cache pour les données fréquemment consultées
- Compression gzip des réponses API

### Optimisations frontend
- Lazy loading des images
- Mise en cache des appels API
- Loading states pendant les requêtes
- Error boundaries pour la gestion d'erreurs

## Gestion d'erreurs

### Codes d'erreur HTTP
- 200 : Succès
- 201 : Création réussie
- 400 : Données invalides
- 404 : Ressource non trouvée
- 500 : Erreur serveur

### Messages d'erreur frontend
- Messages utilisateur en français
- Fallbacks gracieux si API indisponible
- Retry automatique pour les erreurs réseau