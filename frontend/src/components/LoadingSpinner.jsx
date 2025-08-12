import React from 'react';
import { Camera } from 'lucide-react';

const LoadingSpinner = ({ message = "Chargement...", size = "default" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8", 
    large: "w-12 h-12"
  };

  const textSizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <Camera className={`${sizeClasses[size]} text-lime-600 animate-pulse`} />
        <div className={`${sizeClasses[size]} absolute inset-0 border-2 border-lime-600 border-t-transparent rounded-full animate-spin`}></div>
      </div>
      <p className={`mt-4 text-gray-600 ${textSizeClasses[size]}`}>{message}</p>
    </div>
  );
};

export const InlineSpinner = ({ size = "small" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6"
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-lime-600 rounded-full animate-spin`}></div>
  );
};

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-100 via-white to-lime-50">
      <LoadingSpinner size="large" message="Chargement de votre portfolio..." />
    </div>
  );
};

export default LoadingSpinner;