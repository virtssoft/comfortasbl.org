
import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="relative flex items-center justify-center">
        {/* Animated Rings */}
        <div className="w-48 h-48 border border-gray-100 rounded-full"></div>
        <div className="absolute w-40 h-40 border border-gray-200 rounded-full animate-pulse"></div>
        <div className="absolute w-32 h-32 border-t-2 border-comfort-gold rounded-full animate-spin"></div>
        
        {/* Logo in Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-4 rounded-full shadow-2xl">
            <img 
              src="https://api.comfortasbl.org/assets/images/logo1.png" 
              alt="COMFORT Asbl" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-comfort-blue font-serif font-bold text-2xl tracking-[0.2em] mb-2">COMFORT ASBL</h2>
        <div className="flex items-center justify-center space-x-4">
           <span className="h-[1px] w-8 bg-comfort-gold/30"></span>
           <span className="text-gray-400 text-[10px] uppercase tracking-[0.5em] animate-pulse">
             Authenticité & Action
           </span>
           <span className="h-[1px] w-8 bg-comfort-gold/30"></span>
        </div>
      </div>
      
      {/* Background hint of page structure */}
      <div className="absolute bottom-20 left-0 right-0 px-20 flex justify-between opacity-10 pointer-events-none">
         <div className="h-40 w-64 bg-gray-200 rounded"></div>
         <div className="h-40 w-64 bg-gray-200 rounded"></div>
         <div className="h-40 w-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
