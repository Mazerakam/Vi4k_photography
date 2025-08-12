import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Camera, Heart, CheckCircle } from 'lucide-react';
import { usePhotographer, useServices, useContact, useCategories } from '../hooks/useApi';
import LoadingSpinner, { InlineSpinner } from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    date: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  // API hooks
  const { data: photographer, loading: photographerLoading, error: photographerError, refetch: refetchPhotographer } = usePhotographer();
  const { data: services, loading: servicesLoading } = useServices();
  const { data: categories } = useCategories();
  const { submitContact, loading: submitting, error: submitError } = useContact();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContact(formData);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the hook
      console.error('Contact form submission error:', error);
    }
  };

  // Loading state for photographer data
  if (photographerLoading) {
    return <LoadingSpinner message="Chargement des informations de contact..." />;
  }

  // Error state for photographer data
  if (photographerError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-100 via-white to-lime-50 flex items-center justify-center">
        <ErrorMessage 
          message="Impossible de charger les informations de contact" 
          onRetry={refetchPhotographer}
        />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-100 via-white to-lime-50 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-black mb-6">
                Message envoyé avec succès !
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Merci {formData.name} pour votre message. Je vous répondrai dans les plus brefs délais, 
                généralement sous 24h.
              </p>
              <div className="space-y-4 text-left bg-lime-50 p-6 rounded-xl mb-8">
                <h3 className="font-semibold text-black">Récapitulatif de votre demande :</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Sujet :</strong> {formData.subject}</p>
                  <p><strong>Catégorie :</strong> {formData.category}</p>
                  {formData.date && <p><strong>Date souhaitée :</strong> {new Date(formData.date).toLocaleDateString('fr-FR')}</p>}
                </div>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="btn-primary mr-4"
              >
                Envoyer un autre message
              </button>
              <a href="/" className="btn-secondary">
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-lime-100 via-white to-lime-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Mail className="w-12 h-12 text-black" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-black mb-6">
              Contactez-moi
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Vous avez un projet photographique en tête ? N'hésitez pas à me contacter pour 
              discuter de vos besoins. Je serais ravi de donner vie à vos idées.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Informations de contact */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-black mb-6">
                Restons en contact
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Que ce soit pour un mariage, une séance photo en nature ou pour sublimer 
                vos créations culinaires, je suis là pour capturer vos moments précieux.
              </p>
            </div>

            {/* Informations de contact */}
            {photographer && (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-lime-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Email</h3>
                    <a 
                      href={`mailto:${photographer.email}`}
                      className="text-gray-700 hover:text-lime-600 transition-colors"
                    >
                      {photographer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-lime-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Téléphone</h3>
                    <a 
                      href={`tel:${photographer.phone}`}
                      className="text-gray-700 hover:text-lime-600 transition-colors"
                    >
                      {photographer.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-lime-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Zone d'intervention</h3>
                    <p className="text-gray-700">{photographer.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-lime-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Disponibilité</h3>
                    <p className="text-gray-700">Du lundi au samedi, 9h-19h</p>
                    <p className="text-sm text-gray-600">Réponse sous 24h</p>
                  </div>
                </div>
              </div>
            )}

            {/* Services */}
            {servicesLoading ? (
              <div className="bg-lime-50 p-8 rounded-2xl">
                <LoadingSpinner size="small" message="Chargement des services..." />
              </div>
            ) : services && services.length > 0 && (
              <div className="bg-lime-50 p-8 rounded-2xl">
                <h3 className="text-xl font-serif font-semibold text-black mb-6">Mes Services</h3>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-start space-x-3">
                      <Camera className="w-5 h-5 text-lime-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-black">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.price} • {service.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="flex items-center mb-8">
              <Heart className="w-8 h-8 text-lime-600 mr-3" />
              <h2 className="text-2xl font-serif font-bold text-black">
                Parlez-moi de votre projet
              </h2>
            </div>

            {submitError && (
              <div className="mb-6">
                <ErrorMessage 
                  message={submitError} 
                  type="default" 
                  showRetry={false}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-200"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-200"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-200"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Type de projet *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Choisir une catégorie</option>
                    {categories && categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ex: Séance photo mariage"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Décrivez-moi votre projet, vos attentes, le style souhaité..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full btn-primary flex items-center justify-center ${
                  submitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <>
                    <InlineSpinner />
                    <span className="ml-2">Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer le message
                  </>
                )}
              </button>

              <p className="text-sm text-gray-600 text-center">
                En envoyant ce formulaire, vous acceptez d'être recontacté par email ou téléphone 
                concernant votre demande.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;