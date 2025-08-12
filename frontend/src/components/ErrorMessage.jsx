import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ 
  message = "Une erreur est survenue", 
  onRetry, 
  showRetry = true,
  type = "default" 
}) => {
  const typeClasses = {
    default: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };

  return (
    <div className={`p-6 rounded-lg border ${typeClasses[type]} text-center`}>
      <div className="flex flex-col items-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-current opacity-60" />
        <div>
          <h3 className="font-semibold text-lg mb-2">Oups !</h3>
          <p className="text-sm opacity-80">{message}</p>
        </div>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-white border border-current rounded-lg hover:bg-current hover:text-white transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
};

export const InlineError = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center p-4 text-red-600 bg-red-50 rounded-lg">
      <AlertTriangle className="w-5 h-5 mr-2" />
      <span className="text-sm">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-3 text-xs underline hover:no-underline"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};

export const PageError = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-100 via-white to-lime-50">
      <div className="max-w-md mx-auto px-4">
        <ErrorMessage message={message} onRetry={onRetry} />
      </div>
    </div>
  );
};

export default ErrorMessage;