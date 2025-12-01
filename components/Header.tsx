import React from 'react';

interface HeaderProps {
  onDownload: () => void;
  hasImage: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onDownload, 
  hasImage,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  return (
    <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center shadow-glow">
           <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">MCR <span className="text-gray-500 font-light">Studio</span></h1>
      </div>
      
      <div className="flex items-center gap-4">
        {hasImage && (
          <>
            <div className="flex items-center bg-surface border border-border rounded-lg p-1">
              <button 
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-2 rounded-md transition-all ${canUndo ? 'text-gray-400 hover:text-white hover:bg-surfaceHighlight' : 'text-gray-800 cursor-not-allowed'}`}
                title="Undo (Ctrl+Z)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <div className="w-px h-3 bg-border mx-1"></div>
              <button 
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-2 rounded-md transition-all ${canRedo ? 'text-gray-400 hover:text-white hover:bg-surfaceHighlight' : 'text-gray-800 cursor-not-allowed'}`}
                title="Redo (Ctrl+Y)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
              </button>
            </div>

            <button 
              onClick={onDownload}
              className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all shadow-lg shadow-white/5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </>
        )}
      </div>
    </header>
  );
};