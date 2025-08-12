import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Camera, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCategories, usePhotosByCategory } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CategoryGallery = () => {
  const { categoryId } = useParams();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // API hooks
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: photos, loading: photosLoading, error: photosError, refetch: refetchPhotos } = usePhotosByCategory(categoryId);

  const category = categories?.find(cat => cat.id === categoryId);

  const openLightbox = (photoIndex) => {
    setLightboxIndex(photoIndex);
    setSelectedPhoto(photos[photoIndex]);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigateLightbox = (direction) => {
    if (!photos || photos.length === 0) return;
    
    const newIndex = direction === 'next' 
      ? (lightboxIndex + 1) % photos.length
      : (lightboxIndex - 1 + photos.length) % photos.length;
    
    setLightboxIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox('next');
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
  };

  useEffect(() => {
    if (selectedPhoto) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhoto, lightboxIndex]);

  if (categoriesLoading || photosLoading) {
    return <LoadingSpinner message="Chargement de la galerie..." />;
  }

  if (categoriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Impossible de charger les catégories" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Catégorie non trouvée</h1>
          <Link to="/portfolio" className="btn-primary">
            Retour au Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative py-20 bg-gradient-to-br from-lime-100 via-white to-lime-50">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-gray-600 mb-8">
            <Link to="/portfolio" className="hover:text-black transition-colors flex items-center">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Portfolio
            </Link>
            <span>/</span>
            <span className="text-black font-medium">{category.name}</span>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-black mb-6">
              {category.name}
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {category.description}
            </p>
            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>{photos ? photos.length : 0} photo{photos && photos.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {photosError ? (
            <ErrorMessage 
              message="Impossible de charger les photos de cette catégorie" 
              onRetry={refetchPhotos}
            />
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift cursor-pointer bg-gray-100"
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="font-semibold text-lg mb-2">{photo.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-lime-300">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(photo.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
                Galerie en cours de création
              </h2>
              <p className="text-gray-600 mb-8">
                Cette section sera bientôt enrichie avec de nouvelles photos.
              </p>
              <Link to="/contact" className="btn-primary">
                Me contacter pour un projet
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 bg-lime-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-black text-center mb-12">
            Découvrir d'autres univers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories
              ?.filter(cat => cat.id !== categoryId)
              .map((cat, index) => (
                <Link
                  key={cat.id}
                  to={`/portfolio/${cat.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="aspect-video bg-gradient-to-br from-lime-100 to-lime-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-16 h-16 text-black/60 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-semibold text-black mb-2 group-hover:text-lime-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-gray-600">{cat.description}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-6xl max-h-full" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Buttons */}
            {photos && photos.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white">
              <h3 className="text-xl font-semibold mb-2">{selectedPhoto.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-lime-300">
                <span className="capitalize">{category.name}</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(selectedPhoto.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                {photos && photos.length > 1 && (
                  <span>{lightboxIndex + 1} / {photos.length}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryGallery;