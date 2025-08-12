import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Grid, List, ChevronRight } from 'lucide-react';
import { useCategories, usePhotos } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Portfolio = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // API hooks
  const { data: categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();
  const { data: photosData, loading: photosLoading, error: photosError, refetch: refetchPhotos } = usePhotos(selectedCategory === 'all' ? null : selectedCategory);

  const photos = photosData || [];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  if (categoriesLoading || photosLoading) {
    return <LoadingSpinner message="Chargement du portfolio..." />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-lime-100 via-white to-lime-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Camera className="w-12 h-12 text-black" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-black mb-6">
              Mon Portfolio
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Découvrez ma collection de photographies capturées avec passion. 
              Chaque image raconte une histoire unique et authentique.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and View Controls */}
      <section className="py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes les photos
              </button>
              {categories && categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
                aria-label="Vue grille"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
                aria-label="Vue liste"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-16 bg-lime-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-black text-center mb-12">
            Explorer par Catégorie
          </h2>
          
          {categoriesError ? (
            <ErrorMessage 
              message="Impossible de charger les catégories" 
              onRetry={refetchCategories}
            />
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/portfolio/${category.id}`}
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
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-black font-medium group-hover:text-lime-600 transition-colors">
                      <span>Voir la galerie</span>
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">Aucune catégorie disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Photos Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold text-black">
              {selectedCategory === 'all' 
                ? 'Toutes mes photos' 
                : categories?.find(cat => cat.id === selectedCategory)?.name
              }
            </h2>
            <span className="text-gray-600">
              {photos.length} photo{photos.length > 1 ? 's' : ''}
            </span>
          </div>

          {photosError ? (
            <ErrorMessage 
              message="Impossible de charger les photos" 
              onRetry={refetchPhotos}
            />
          ) : photos.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="group aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover-lift bg-gray-100"
                      style={{animationDelay: `${index * 0.05}s`}}
                    >
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-semibold text-lg mb-1">{photo.title}</h3>
                          <p className="text-sm text-lime-300 capitalize">
                            {categories?.find(cat => cat.id === photo.category)?.name || photo.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover-lift"
                      style={{animationDelay: `${index * 0.05}s`}}
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img
                            src={photo.image}
                            alt={photo.title}
                            className="w-full h-64 md:h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="md:w-2/3 p-6 flex flex-col justify-center">
                          <h3 className="text-2xl font-serif font-semibold text-black mb-2">
                            {photo.title}
                          </h3>
                          <p className="text-lime-600 font-medium capitalize mb-2">
                            {categories?.find(cat => cat.id === photo.category)?.name || photo.category}
                          </p>
                          <p className="text-gray-600 mb-4">
                            Capturée le {new Date(photo.date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          {photo.description && (
                            <p className="text-gray-700">{photo.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">Aucune photo dans cette sélection pour le moment.</p>
              <Link to="/contact" className="btn-primary mt-6">
                Me contacter pour un projet
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Portfolio;