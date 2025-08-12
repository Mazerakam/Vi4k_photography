import React from 'react';
import { Camera, Heart, Award, MapPin, Mail, Phone, Clock } from 'lucide-react';
import { usePhotographer, useServices } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const About = () => {
  // API hooks
  const { data: photographer, loading: photographerLoading, error: photographerError, refetch: refetchPhotographer } = usePhotographer();
  const { data: services, loading: servicesLoading, error: servicesError } = useServices();

  const stats = [
    { number: '200+', label: 'Mariages photographiés' },
    { number: '5+', label: 'Années d\'expérience' },
    { number: '1000+', label: 'Clients satisfaits' },
    { number: '15+', label: 'Restaurants partenaires' }
  ];

  const skills = [
    { name: 'Photographie de Mariage', level: 95 },
    { name: 'Photographie Culinaire', level: 90 },
    { name: 'Photographie Nature', level: 85 },
    { name: 'Post-production', level: 92 },
    { name: 'Direction artistique', level: 88 }
  ];

  if (photographerLoading) {
    return <LoadingSpinner message="Chargement des informations..." />;
  }

  if (photographerError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-100 via-white to-lime-50 flex items-center justify-center">
        <ErrorMessage 
          message="Impossible de charger les informations du photographe" 
          onRetry={refetchPhotographer}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-lime-100 via-white to-lime-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Photo du photographe */}
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-lime-200 to-lime-300 hover-lift">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-32 h-32 text-white/80" />
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 text-center text-white">
                    <p className="text-lg font-medium">{photographer?.name || 'Alex Dubois'}</p>
                    <p className="text-sm text-lime-200">Photographe Passionné</p>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-5xl md:text-6xl font-serif font-bold text-black mb-6">
                    À propos
                  </h1>
                  <div className="w-20 h-1 bg-lime-400 mb-6"></div>
                </div>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  {photographer?.bio || "Photographe passionné spécialisé dans la capture d'émotions authentiques. Mon approche artistique mélange spontanéité et composition soignée pour créer des images qui racontent votre histoire unique."}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-lime-600" />
                    <span className="text-gray-700">{photographer?.location || 'Paris & région parisienne'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-lime-600" />
                    <span className="text-gray-700">{photographer?.experience || '5+ années d\'expérience'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-4xl md:text-5xl font-serif font-bold text-lime-300 mb-2 group-hover:scale-110 transition-transform duration-200">
                  {stat.number}
                </div>
                <p className="text-gray-300 text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6">
                Mon Histoire
              </h2>
              <div className="w-20 h-1 bg-lime-400 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-lime-50 p-8 rounded-2xl">
                  <Heart className="w-12 h-12 text-lime-600 mb-4" />
                  <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                    La passion avant tout
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Depuis mon enfance, j'ai toujours été fasciné par la capacité de la photographie 
                    à figer les émotions et les moments précieux. Cette passion s'est transformée en 
                    vocation il y a plus de 5 ans.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <Award className="w-12 h-12 text-black mb-4" />
                  <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                    Une approche unique
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Mon style photographique allie spontanéité et composition soignée. Je privilégie 
                    l'authenticité des moments capturés, que ce soit lors d'un mariage, en pleine 
                    nature ou autour d'une table gastronomique.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-serif font-semibold text-black">Mes compétences</h3>
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{skill.name}</span>
                      <span className="text-sm text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-lime-400 to-lime-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${skill.level}%`,
                          animationDelay: `${index * 0.2}s`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-gradient-to-br from-lime-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-8">
              Ma Philosophie
            </h2>
            <div className="w-20 h-1 bg-lime-400 mx-auto mb-12"></div>
            
            <blockquote className="text-2xl md:text-3xl font-serif text-gray-800 italic leading-relaxed mb-8">
              "Une photo réussie, c'est celle qui révèle l'émotion authentique d'un instant unique, 
              celle qui raconte une histoire sans avoir besoin de mots."
            </blockquote>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-12">
              Chaque séance photo est une collaboration créative. J'aime prendre le temps de comprendre 
              vos attentes, votre personnalité et l'atmosphère que vous souhaitez créer. Mon objectif 
              est de vous offrir bien plus que de simples images : des souvenirs intemporels.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-black mb-4">Authenticité</h3>
                <p className="text-gray-700">
                  Je capture les vrais moments, les émotions sincères qui font la beauté de chaque instant.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-black mb-4">Créativité</h3>
                <p className="text-gray-700">
                  Chaque projet est unique et mérite une approche artistique personnalisée et innovante.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-black mb-4">Excellence</h3>
                <p className="text-gray-700">
                  Une attention méticuleuse aux détails pour des résultats qui dépassent vos attentes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {services && services.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-black mb-4">Mes Services</h2>
              <p className="text-gray-600">Découvrez mes différentes prestations photographiques</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className="bg-lime-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <Camera className="w-8 h-8 text-lime-600 mb-4" />
                  <h3 className="text-xl font-serif font-semibold text-black mb-3">{service.name}</h3>
                  <p className="text-gray-700 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-black">{service.price}</span>
                    <span className="text-gray-600">{service.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Prêt à créer ensemble ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discutons de votre projet photographique autour d'un café. 
            Chaque collaboration commence par une conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {photographer && (
              <>
                <a
                  href={`mailto:${photographer.email}`}
                  className="inline-flex items-center bg-lime-300 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-lime-400 transition-all duration-200 hover-lift group"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  M'écrire un email
                </a>
                <a
                  href={`tel:${photographer.phone}`}
                  className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-all duration-200 hover-lift group"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  M'appeler
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;