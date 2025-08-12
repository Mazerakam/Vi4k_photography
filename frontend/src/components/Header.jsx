import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Camera } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/about', label: 'À propos' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-lift">
            <Camera className="w-8 h-8 text-black" />
            <span className="text-2xl font-serif font-bold text-black">Alex Dubois</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  isActive(item.path)
                    ? 'text-black font-semibold border-b-2 border-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden btn-primary p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link block px-4 py-2 rounded-md ${
                    isActive(item.path)
                      ? 'text-black font-semibold bg-lime-50'
                      : 'text-gray-600 hover:text-black hover:bg-lime-50'
                  }`}
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;