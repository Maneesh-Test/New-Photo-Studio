
import React from 'react';

interface LoadingOverlayProps {
  message: string;
  isError?: boolean;
  onDismiss?: () => void;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message, isError = false, onDismiss }) => {
  return (
    <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex flex-col items-center max-w-lg w-full">
        <div className="w-16 h-16 relative mb-6 shrink-0">
           {!isError ? (
             <>
               <div className="absolute inset-0 border-t-2 border-accent-500 rounded-full animate-spin"></div>
               <div className="absolute inset-2 border-r-2 border-white rounded-full animate-spin animation-delay-150"></div>
               <div className="absolute inset-4 border-b-2 border-gray-500 rounded-full animate-spin animation-delay-300"></div>
               <div className="absolute inset-0 shadow-[0_0_30px_rgba(99,102,241,0.3)] rounded-full"></div>
             </>
           ) : (
             <div className="w-full h-full flex items-center justify-center rounded-full bg-red-500/10 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
             </div>
           )}
        </div>
        
        <h3 className={`text-lg font-semibold tracking-wide mb-2 ${isError ? 'text-red-500' : 'text-white'}`}>
          {isError ? 'Error' : 'Processing'}
        </h3>
        
        <p className={`text-sm font-light tracking-wide mb-6 select-text break-words w-full px-4 leading-relaxed ${isError ? 'text-gray-300' : 'text-gray-400 animate-pulse'}`}>
          {message}
        </p>

        {isError && onDismiss && (
          <button 
            onClick={onDismiss}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-medium text-white transition-colors shadow-lg"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};
