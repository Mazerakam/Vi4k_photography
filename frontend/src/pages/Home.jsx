import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Camera, Heart, Sparkles } from 'lucide-react';
import { useCategories, useTestimonials } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // API hooks
  const { data: categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories();
  const { data: testimonials, loading: testimonialsLoading, error: testimonialsError, refetch: refetchTestimonials } = useTestimonials();

  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentTestimonial(prev => 
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-100 via-white to-lime-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Camera className="w-16 h-16 text-black animate-pulse" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-serif font-bold text-black mb-6 leading-tight">
              Capturer
              <span className="block text-5xl md:text-6xl">vos moments précieux</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
              Photographe passionné spécialisé dans les mariages, la nature et la gastronomie. 
              Chaque cliché raconte une histoire unique.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/portfolio" 
                className="btn-primary hover-lift group"
              >
                Découvrir mon travail
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/contact" 
                className="btn-secondary hover-lift"
              >
                Me contacter
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Heart className="w-8 h-8 text-pink-400 animate-bounce" style={{animationDelay: '0.5s'}} />
        </div>
        <div className="absolute bottom-40 right-16 opacity-20">
          <Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" style={{animationDelay: '1s'}} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
              Mes Spécialités
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez mes différents univers photographiques, chacun avec sa propre identité
            </p>
          </div>
          
          {categoriesLoading ? (
            <LoadingSpinner message="Chargement des spécialités..." />
          ) : categoriesError ? (
            <ErrorMessage 
              message="Impossible de charger les spécialités" 
              onRetry={refetchCategories}
            />
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className="aspect-square bg-gradient-to-br from-lime-100 to-lime-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-20 h-20 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-lime-300 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-90 mb-4">{category.description}</p>
                    <Link
                      to={`/portfolio/${category.id}`}
                      className="inline-flex items-center text-lime-300 hover:text-white transition-colors font-medium"
                    >
                      Voir la galerie
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">Aucune spécialité disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-lime-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
              Témoignages
            </h2>
            <p className="text-xl text-gray-600">
              Ce que disent mes clients
            </p>
          </div>
          
          {testimonialsLoading ? (
            <LoadingSpinner message="Chargement des témoignages..." />
          ) : testimonialsError ? (
            <ErrorMessage 
              message="Impossible de charger les témoignages" 
              onRetry={refetchTestimonials}
            />
          ) : testimonials && testimonials.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12">
                <div className="text-center">
                  <blockquote className="text-2xl md:text-3xl font-serif text-gray-800 mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  <cite className="text-lg font-medium text-black">
                    — {testimonials[currentTestimonial].name}
                  </cite>
                </div>
                
                {/* Pagination dots */}
                {testimonials.length > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial 
                            ? 'bg-black scale-125' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
                <p className="text-xl text-gray-500">Aucun témoignage disponible pour le moment.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Prêt à capturer votre histoire ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contactez-moi pour discuter de votre projet photographique. 
            Ensemble, créons des souvenirs inoubliables.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center bg-lime-300 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-lime-400 transition-all duration-200 hover-lift group"
          >
            Démarrer un projet
            <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;