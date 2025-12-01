
import React, { useState } from 'react';
import { ToolType, AdjustmentSettings, CropState, GridConfig } from '../types';
import { getApiKey } from '../services/geminiService';

interface SidebarProps {
  activeTool: ToolType;
  setActiveTool: (t: ToolType) => void;
  adjustments: AdjustmentSettings;
  setAdjustments: React.Dispatch<React.SetStateAction<AdjustmentSettings>>;
  onAiAction: (promptType: 'WHITE_BG' | 'ENHANCE' | 'CUSTOM' | 'REMOVE_BG', customPrompt?: string) => void;
  isProcessing: boolean;
  crop: CropState;
  setCrop: (c: CropState) => void;
  imgDimensions: { width: number; height: number };
  aspectRatio: number | undefined;
  setAspectRatio: (r: number | undefined) => void;
  gridConfig: GridConfig;
  setGridConfig: React.Dispatch<React.SetStateAction<GridConfig>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTool,
  setActiveTool,
  adjustments,
  setAdjustments,
  onAiAction,
  isProcessing,
  crop,
  setCrop,
  imgDimensions,
  aspectRatio,
  setAspectRatio,
  gridConfig,
  setGridConfig
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  
  const apiKey = getApiKey();
  // Valid if starts with AIza OR is reasonably long (30+ chars) to support unusual key formats
  const isValidFormat = apiKey && (apiKey.startsWith('AIza') || apiKey.length > 30);
  
  const keyFragment = apiKey && apiKey.length > 4 
    ? `...${apiKey.slice(-4)}` 
    : (apiKey ? 'Invalid' : 'Missing');

  const handleAdjustmentChange = (key: keyof AdjustmentSettings, value: number | boolean) => {
    setAdjustments(prev => ({ ...prev, [key]: value }));
  };

  const handleDimensionChange = (dim: 'w' | 'h', pixelValue: number) => {
    if (imgDimensions.width === 0 || imgDimensions.height === 0) return;
    
    let newCrop = { ...crop };
    
    if (dim === 'w') {
      const newW = Math.min(1 - crop.x, pixelValue / imgDimensions.width);
      newCrop.w = Math.max(0.01, newW);
      if (aspectRatio) {
        newCrop.h = Math.min(1 - crop.y, newCrop.w / aspectRatio);
        if (newCrop.h * imgDimensions.height > imgDimensions.height * (1 - crop.y)) {
           newCrop.h = 1 - crop.y;
           newCrop.w = newCrop.h * aspectRatio;
        }
      }
    } else {
      const newH = Math.min(1 - crop.y, pixelValue / imgDimensions.height);
      newCrop.h = Math.max(0.01, newH);
      if (aspectRatio) {
         newCrop.w = Math.min(1 - crop.x, newCrop.h * aspectRatio);
         if (newCrop.w * imgDimensions.width > imgDimensions.width * (1 - crop.x)) {
           newCrop.w = 1 - crop.x;
           newCrop.h = newCrop.w / aspectRatio;
         }
      }
    }
    setCrop(newCrop);
  };

  const handlePositionChange = (axis: 'x' | 'y', pixelValue: number) => {
    if (imgDimensions.width === 0 || imgDimensions.height === 0) return;
    
    const newCrop = { ...crop };
    
    if (axis === 'x') {
       const newX = pixelValue / imgDimensions.width;
       newCrop.x = Math.max(0, Math.min(1 - crop.w, newX));
    } else {
       const newY = pixelValue / imgDimensions.height;
       newCrop.y = Math.max(0, Math.min(1 - crop.h, newY));
    }
    setCrop(newCrop);
  };

  const setRatio = (ratio: number | undefined) => {
    setAspectRatio(ratio);
    if (ratio && imgDimensions.width > 0) {
       const currentW = crop.w;
       const imgRatio = imgDimensions.width / imgDimensions.height;
       let newH = (currentW * imgRatio) / ratio;
       
       if (crop.y + newH > 1) {
         newH = 1 - crop.y;
         const newW = (newH * ratio) / imgRatio;
         setCrop({ ...crop, w: Math.min(1-crop.x, newW), h: newH });
       } else {
         setCrop({ ...crop, h: newH });
       }
    }
  };

  const pxW = Math.round(crop.w * imgDimensions.width);
  const pxH = Math.round(crop.h * imgDimensions.height);
  const pxX = Math.round(crop.x * imgDimensions.width);
  const pxY = Math.round(crop.y * imgDimensions.height);

  return (
    <div className="w-80 bg-surface/50 backdrop-blur-xl border-l border-border flex flex-col h-full z-20">
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* AI Section */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Generation</h2>
             <div className="px-2 py-0.5 rounded text-[10px] bg-accent-500/10 text-accent-500 font-medium">Gemini 2.5</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                disabled={isProcessing}
                onClick={() => onAiAction('REMOVE_BG')}
                className="group relative overflow-hidden p-3 rounded-xl bg-surfaceHighlight hover:bg-white/5 border border-border transition-all text-left"
              >
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                </div>
                <div className="mb-2 text-gray-400 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </div>
                <div className="text-xs font-medium text-gray-200">Remove BG</div>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => onAiAction('WHITE_BG')}
                className="group relative overflow-hidden p-3 rounded-xl bg-surfaceHighlight hover:bg-white/5 border border-border transition-all text-left"
              >
                 <div className="mb-2 text-gray-400 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="text-xs font-medium text-gray-200">White BG</div>
              </button>
              
              <button
                disabled={isProcessing}
                onClick={() => onAiAction('ENHANCE')}
                className="col-span-2 group flex items-center gap-3 p-3 rounded-xl bg-surfaceHighlight hover:bg-white/5 border border-border transition-all"
              >
                 <div className="text-accent-500 group-hover:text-accent-400 transition-colors">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <div className="text-xs font-medium text-gray-200">Auto Enhance Quality</div>
              </button>
          </div>

          <div className="relative">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe magic edit..."
                className="w-full bg-surfaceHighlight border border-border rounded-lg py-2.5 pl-3 pr-10 text-xs text-white placeholder-gray-600 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-all"
              />
              <button
                disabled={isProcessing || !customPrompt.trim()}
                onClick={() => onAiAction('CUSTOM', customPrompt)}
                className="absolute right-1.5 top-1.5 p-1 rounded-md bg-accent-600 text-white hover:bg-accent-500 disabled:opacity-0 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
          </div>
        </div>

        {/* Tools Navigation */}
        <div className="p-5 pb-2">
           <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Editor Tools</h2>
           <div className="flex p-1 bg-surfaceHighlight rounded-xl border border-border mb-6">
             <button
               onClick={() => setActiveTool(activeTool === ToolType.CROP ? ToolType.NONE : ToolType.CROP)}
               className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTool === ToolType.CROP ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
             >
               Crop & Resize
             </button>
             <button
               onClick={() => setActiveTool(activeTool === ToolType.ADJUST ? ToolType.NONE : ToolType.ADJUST)}
               className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTool === ToolType.ADJUST ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
             >
               Adjustments
             </button>
           </div>

          {activeTool === ToolType.CROP && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Aspect Ratio */}
                <div className="space-y-3">
                   <label className="text-xs text-gray-300 font-medium">Aspect Ratio</label>
                   <div className="grid grid-cols-4 gap-2">
                      {[
                        { l: 'Free', v: undefined },
                        { l: '1:1', v: 1 },
                        { l: '16:9', v: 16/9 },
                        { l: '4:3', v: 4/3 }
                      ].map((r) => (
                        <button 
                          key={r.l}
                          onClick={() => setRatio(r.v)}
                          className={`px-2 py-2 rounded-lg text-[10px] font-medium border transition-all ${
                             (r.v === undefined && aspectRatio === undefined) || (r.v && Math.abs((aspectRatio || 0) - r.v) < 0.01)
                             ? 'bg-white text-black border-white' 
                             : 'bg-surfaceHighlight border-border text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          {r.l}
                        </button>
                      ))}
                   </div>
                </div>
                
                {/* Grid Toggle */}
                <div className="flex items-center justify-between py-2 border-t border-white/5">
                   <span className="text-xs text-gray-300 font-medium">Grid Overlay</span>
                   <button 
                      onClick={() => setGridConfig(p => ({ ...p, show: !p.show }))}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${gridConfig.show ? 'bg-accent-600' : 'bg-gray-700'}`}
                   >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ${gridConfig.show ? 'translate-x-4' : 'translate-x-0'}`} />
                   </button>
                </div>
                
                {gridConfig.show && (
                   <div className="space-y-4 p-3 bg-surfaceHighlight/50 rounded-lg border border-border">
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] text-gray-400">
                             <span>Line Thickness</span>
                             <span>{gridConfig.thickness}px</span>
                          </div>
                          <input 
                             type="range" min="1" max="10" step="1"
                             value={gridConfig.thickness}
                             onChange={(e) => setGridConfig(p => ({ ...p, thickness: parseInt(e.target.value) }))}
                             className="w-full"
                          />
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-400">Grid Color</span>
                          <div className="flex items-center gap-2">
                             <input 
                               type="color" 
                               value={gridConfig.color}
                               onChange={(e) => setGridConfig(p => ({ ...p, color: e.target.value }))}
                               className="w-6 h-6 rounded-full border-none p-0 bg-transparent cursor-pointer overflow-hidden"
                             />
                          </div>
                       </div>
                   </div>
                )}

                {/* Dimensions & Position */}
                 <div className="space-y-3 pt-2 border-t border-white/5">
                    <label className="text-xs text-gray-300 font-medium">Geometry</label>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="space-y-1">
                          <label className="text-[10px] text-gray-500 uppercase">Width</label>
                          <input 
                            type="number" value={pxW}
                            onChange={(e) => handleDimensionChange('w', parseInt(e.target.value) || 0)}
                            className="w-full bg-surfaceHighlight border border-border rounded-md py-1.5 px-2 text-xs text-white focus:border-accent-500 outline-none"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] text-gray-500 uppercase">Height</label>
                          <input 
                            type="number" value={pxH}
                            onChange={(e) => handleDimensionChange('h', parseInt(e.target.value) || 0)}
                            className="w-full bg-surfaceHighlight border border-border rounded-md py-1.5 px-2 text-xs text-white focus:border-accent-500 outline-none"
                          />
                       </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-500 uppercase">X Pos</label>
                          <input 
                            type="number" value={pxX}
                            onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                            className="w-full bg-surfaceHighlight border border-border rounded-md py-1.5 px-2 text-xs text-white focus:border-accent-500 outline-none"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] text-gray-500 uppercase">Y Pos</label>
                          <input 
                            type="number" value={pxY}
                            onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                            className="w-full bg-surfaceHighlight border border-border rounded-md py-1.5 px-2 text-xs text-white focus:border-accent-500 outline-none"
                          />
                       </div>
                    </div>
                 </div>
             </div>
          )}

          {activeTool === ToolType.ADJUST && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               {/* Transforms */}
               <div className="space-y-3">
                  <label className="text-xs text-gray-300 font-medium">Transforms</label>
                  <div className="flex gap-2">
                      <button 
                         onClick={() => handleAdjustmentChange('flipX', !adjustments.flipX)}
                         className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium border transition-all ${adjustments.flipX ? 'bg-white text-black border-white' : 'bg-surfaceHighlight border-border text-gray-400 hover:border-gray-600'}`}
                      >
                         Flip H
                      </button>
                      <button 
                         onClick={() => handleAdjustmentChange('flipY', !adjustments.flipY)}
                         className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium border transition-all ${adjustments.flipY ? 'bg-white text-black border-white' : 'bg-surfaceHighlight border-border text-gray-400 hover:border-gray-600'}`}
                      >
                         Flip V
                      </button>
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-gray-400">
                     <span>Rotation</span>
                     <span>{adjustments.rotation}°</span>
                  </div>
                  <input 
                    type="range" min="-180" max="180" value={adjustments.rotation} 
                    onChange={(e) => handleAdjustmentChange('rotation', Number(e.target.value))}
                    className="w-full"
                  />
               </div>

               {/* Sliders */}
               <div className="space-y-4 pt-4 border-t border-white/5">
                  {[
                    { l: 'Brightness', k: 'brightness', min: 0, max: 200, unit: '%' },
                    { l: 'Contrast', k: 'contrast', min: 0, max: 200, unit: '%' },
                    { l: 'Saturation', k: 'saturation', min: 0, max: 200, unit: '%' },
                    { l: 'Blur', k: 'blur', min: 0, max: 10, step: 0.1, unit: 'px' },
                  ].map((ctrl) => (
                     <div key={ctrl.k} className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-gray-300">
                           <span>{ctrl.l}</span>
                           <span className="text-gray-500">{adjustments[ctrl.k as keyof AdjustmentSettings]}{ctrl.unit}</span>
                        </div>
                        <input 
                          type="range" 
                          min={ctrl.min} max={ctrl.max} step={ctrl.step || 1}
                          value={adjustments[ctrl.k as keyof AdjustmentSettings] as number}
                          onChange={(e) => handleAdjustmentChange(ctrl.k as keyof AdjustmentSettings, Number(e.target.value))}
                          className="w-full"
                        />
                     </div>
                  ))}
               </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Debug Info */}
      <div className="p-3 border-t border-border bg-surface/50 text-[10px] text-gray-600 flex justify-between items-center select-text">
         <span>v1.0.2</span>
         <div className="flex items-center gap-2">
           <span className={isValidFormat ? 'text-green-600/80' : 'text-red-500'}>
             {isValidFormat ? '●' : '○'}
           </span>
           <span title="Verify this matches your .env file">
             {keyFragment}
             {!isValidFormat && apiKey && ' (Invalid Format)'}
           </span>
         </div>
      </div>
    </div>
  );
};
