import React from 'react';
import { Camera, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { usePhotographer } from '../hooks/useApi';

const Footer = () => {
  const { data: photographer } = usePhotographer();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6 text-lime-300" />
              <span className="text-xl font-serif font-bold">{photographer?.name || 'Alex Dubois'}</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {photographer?.bio || 'Photographe passionné capturant vos moments les plus précieux avec une approche artistique et authentique.'}
            </p>
          </div>

          {/* Informations de contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-lime-300">Contact</h3>
            <div className="space-y-3">
              {photographer?.email && (
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${photographer.email}`} className="hover:text-lime-300 transition-colors">
                    {photographer.email}
                  </a>
                </div>
              )}
              {photographer?.phone && (
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${photographer.phone}`} className="hover:text-lime-300 transition-colors">
                    {photographer.phone}
                  </a>
                </div>
              )}
              {photographer?.location && (
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>{photographer.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Réseaux sociaux et liens */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-lime-300">Suivez-moi</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-lime-300 transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-lime-300 transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-400">
                Disponible pour vos projets photographiques partout en France.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 {photographer?.name || 'Alex Dubois'} Photographie. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;