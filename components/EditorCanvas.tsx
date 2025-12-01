
import React, { useRef, useEffect, useState } from 'react';
import { AdjustmentSettings, ToolType, CropState, GridConfig } from '../types';

interface EditorCanvasProps {
  imageSrc: string;
  adjustments: AdjustmentSettings;
  activeTool: ToolType;
  onImageUpdate: (newBase64: string) => void;
  crop: CropState;
  setCrop: (crop: CropState) => void;
  aspectRatio: number | undefined;
  onImageLoad: (width: number, height: number) => void;
  gridConfig: GridConfig;
}

type DragHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | 'move' | null;

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ 
  imageSrc, 
  adjustments, 
  activeTool, 
  onImageUpdate,
  crop,
  setCrop,
  aspectRatio,
  onImageLoad,
  gridConfig
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for the loaded image object
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  
  // State for the displayed size of the canvas on screen
  const [displayDimensions, setDisplayDimensions] = useState({ width: 0, height: 0 });
  
  // Zoom & Pan State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  
  // Crop Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<DragHandle>(null);
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [cropStart, setCropStart] = useState<CropState | null>(null);
  
  // Pan Interaction State
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number, y: number } | null>(null);
  const [panStartOffset, setPanStartOffset] = useState<{ x: number, y: number } | null>(null);

  // 1. Load Image Resource
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      setImgElement(img);
      onImageLoad(img.naturalWidth, img.naturalHeight);
      // Reset crop to center 80% when new image loads
      setCrop({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
  }, [imageSrc]);

  // 2. Calculate Display Dimensions (Fit to Container)
  useEffect(() => {
    if (!imgElement || !containerRef.current) return;

    const updateDimensions = () => {
      if (!containerRef.current || !imgElement) return;
      
      const containerW = containerRef.current.clientWidth;
      const containerH = containerRef.current.clientHeight;
      const padding = 40;

      // Calculate scale to fit container with padding
      const scale = Math.min(
        (containerW - padding) / imgElement.naturalWidth, 
        (containerH - padding) / imgElement.naturalHeight
      );
      
      setDisplayDimensions({
        width: Math.floor(imgElement.naturalWidth * scale),
        height: Math.floor(imgElement.naturalHeight * scale)
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [imgElement]);

  // 3. Render Image to Canvas (Apply Filters & Transforms)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgElement || displayDimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set internal resolution to natural image resolution for quality
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;

    // Apply filters
    const filterString = `
      brightness(${adjustments.brightness}%) 
      contrast(${adjustments.contrast}%) 
      saturate(${adjustments.saturation}%) 
      blur(${adjustments.blur}px)
    `;
    ctx.filter = filterString;

    // Apply Geometry (Rotate & Flip)
    // Save context state before transforming
    ctx.save();
    
    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Rotate
    ctx.rotate((adjustments.rotation * Math.PI) / 180);
    
    // Flip (Scale)
    ctx.scale(adjustments.flipX ? -1 : 1, adjustments.flipY ? -1 : 1);
    
    // Move back
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    
    // Restore context for next render frame
    ctx.restore();

  }, [imgElement, adjustments, displayDimensions]); 

  // --- Zoom and Pan Logic ---
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpacePressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpacePressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Wheel Zoom Listener
  useEffect(() => {
      const container = containerRef.current;
      if(!container) return;
      const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          const scaleAmount = -e.deltaY * 0.001;
          setZoom(z => Math.max(0.1, Math.min(5, z * (1 + scaleAmount))));
      };
      container.addEventListener('wheel', onWheel, { passive: false });
      return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // --- Crop Interaction Logic ---

  const getNormalizedMousePos = (e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current || !canvasRef.current) return { x: 0, y: 0 };
    // This rect includes the scale transform, so logic remains consistent
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };
  };

  const handleMouseDown = (e: React.MouseEvent, handle: DragHandle) => {
    // Check for Pan trigger (Spacebar held or Middle click)
    if (isSpacePressed || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setPanStartOffset({ ...pan });
      return;
    }

    if (activeTool !== ToolType.CROP) return;
    if (e.button !== 0) return; // Only left click for crop

    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragHandle(handle);
    setDragStart(getNormalizedMousePos(e));
    setCropStart({ ...crop });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning && panStart && panStartOffset) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setPan({
           x: panStartOffset.x + dx,
           y: panStartOffset.y + dy
        });
        return;
      }

      if (!isDragging || !dragHandle || !dragStart || !cropStart) return;
      e.preventDefault(); 
      
      const currentPos = getNormalizedMousePos(e);
      const deltaX = currentPos.x - dragStart.x;
      const deltaY = currentPos.y - dragStart.y;

      let newCrop = { ...cropStart };

      if (dragHandle === 'move') {
        newCrop.x = Math.max(0, Math.min(1 - newCrop.w, cropStart.x + deltaX));
        newCrop.y = Math.max(0, Math.min(1 - newCrop.h, cropStart.y + deltaY));
        setCrop(newCrop);
        return;
      }

      const minSize = 0.01;

      if (aspectRatio) {
        // Aspect Ratio Locked Logic
        let anchorX = 0;
        let anchorY = 0;

        // Determine Anchor
        if (dragHandle === 'se') { anchorX = cropStart.x; anchorY = cropStart.y; }
        else if (dragHandle === 'sw') { anchorX = cropStart.x + cropStart.w; anchorY = cropStart.y; }
        else if (dragHandle === 'ne') { anchorX = cropStart.x; anchorY = cropStart.y + cropStart.h; }
        else if (dragHandle === 'nw') { anchorX = cropStart.x + cropStart.w; anchorY = cropStart.y + cropStart.h; }
        
        if (!['se', 'sw', 'ne', 'nw'].includes(dragHandle)) return;

        let rawW = 0;
        if (dragHandle === 'se' || dragHandle === 'ne') {
          rawW = (cropStart.x + cropStart.w + deltaX) - anchorX;
        } else {
          rawW = anchorX - (cropStart.x + deltaX);
        }
        
        rawW = Math.max(minSize, rawW);
        let constrainedH = rawW / aspectRatio;

        let maxH = 0;
        if (dragHandle === 'se' || dragHandle === 'sw') maxH = 1 - anchorY;
        else maxH = anchorY;

        if (constrainedH > maxH) {
           constrainedH = maxH;
           rawW = constrainedH * aspectRatio;
        }

        let maxW = 0;
        if (dragHandle === 'se' || dragHandle === 'ne') maxW = 1 - anchorX;
        else maxW = anchorX;
        
        if (rawW > maxW) {
           rawW = maxW;
           constrainedH = rawW / aspectRatio;
        }

        newCrop.w = rawW;
        newCrop.h = constrainedH;

        if (dragHandle === 'se') {
           newCrop.x = anchorX;
           newCrop.y = anchorY;
        } else if (dragHandle === 'sw') {
           newCrop.x = anchorX - rawW;
           newCrop.y = anchorY;
        } else if (dragHandle === 'ne') {
           newCrop.x = anchorX;
           newCrop.y = anchorY - constrainedH;
        } else if (dragHandle === 'nw') {
           newCrop.x = anchorX - rawW;
           newCrop.y = anchorY - constrainedH;
        }

      } else {
        // Free Aspect Ratio Logic
        if (dragHandle.includes('w')) {
          const maxLeft = cropStart.x + cropStart.w - minSize;
          const rawNewX = cropStart.x + deltaX;
          newCrop.x = Math.max(0, Math.min(maxLeft, rawNewX));
          newCrop.w = cropStart.w + (cropStart.x - newCrop.x);
        } else if (dragHandle.includes('e')) {
          const maxW = 1 - cropStart.x;
          const rawNewW = cropStart.w + deltaX;
          newCrop.w = Math.max(minSize, Math.min(maxW, rawNewW));
        }

        if (dragHandle.includes('n')) {
          const maxTop = cropStart.y + cropStart.h - minSize;
          const rawNewY = cropStart.y + deltaY;
          newCrop.y = Math.max(0, Math.min(maxTop, rawNewY));
          newCrop.h = cropStart.h + (cropStart.y - newCrop.y);
        } else if (dragHandle.includes('s')) {
          const maxH = 1 - cropStart.y;
          const rawNewH = cropStart.h + deltaY;
          newCrop.h = Math.max(minSize, Math.min(maxH, rawNewH));
        }
      }
      
      setCrop(newCrop);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsPanning(false);
      setDragHandle(null);
      setPanStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragHandle, dragStart, cropStart, aspectRatio, isPanning, panStart, panStartOffset]);

  const applyCrop = () => {
    if (!imgElement) return;
    
    // 1. Create a temporary canvas to render the transformed image
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    
    if (!ctx) return;

    // Set size to natural size
    tempCanvas.width = imgElement.naturalWidth;
    tempCanvas.height = imgElement.naturalHeight;

    // 2. Bake the current transformations (filters, rotation, flip) into this canvas
    const filterString = `
      brightness(${adjustments.brightness}%) 
      contrast(${adjustments.contrast}%) 
      saturate(${adjustments.saturation}%) 
      blur(${adjustments.blur}px)
    `;
    ctx.filter = filterString;
    
    ctx.save();
    ctx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    ctx.rotate((adjustments.rotation * Math.PI) / 180);
    ctx.scale(adjustments.flipX ? -1 : 1, adjustments.flipY ? -1 : 1);
    ctx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
    ctx.drawImage(imgElement, 0, 0, tempCanvas.width, tempCanvas.height);
    ctx.restore();

    // 3. Now slice from this transformed canvas
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');

    const px = Math.floor(crop.x * tempCanvas.width);
    const py = Math.floor(crop.y * tempCanvas.height);
    const pw = Math.floor(crop.w * tempCanvas.width);
    const ph = Math.floor(crop.h * tempCanvas.height);
    
    if (pw <= 0 || ph <= 0) return;

    finalCanvas.width = pw;
    finalCanvas.height = ph;
    
    if (finalCtx) {
      finalCtx.drawImage(tempCanvas, px, py, pw, ph, 0, 0, pw, ph);
      const croppedBase64 = finalCanvas.toDataURL('image/jpeg', 1.0);
      onImageUpdate(croppedBase64);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  const resetView = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full flex items-center justify-center relative overflow-hidden checkerboard select-none touch-none ${isSpacePressed ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onMouseDown={(e) => { if (activeTool !== ToolType.CROP) handleMouseDown(e, null); }}
    >
      <div 
        style={{ 
          width: displayDimensions.width, 
          height: displayDimensions.height,
          position: 'relative',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center',
          transition: isDragging || isPanning ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <canvas 
          ref={canvasRef}
          className="w-full h-full object-contain shadow-2xl pointer-events-none ring-1 ring-white/10"
        />

        {activeTool === ToolType.CROP && (
          <>
            {/* Darken outside area */}
            <div className="absolute inset-0 bg-black/60 z-10"
               style={{
                 clipPath: `polygon(0% 0%, 0% 100%, ${crop.x * 100}% 100%, ${crop.x * 100}% ${crop.y * 100}%, ${(crop.x + crop.w) * 100}% ${crop.y * 100}%, ${(crop.x + crop.w) * 100}% ${(crop.y + crop.h) * 100}%, ${crop.x * 100}% ${(crop.y + crop.h) * 100}%, ${crop.x * 100}% 100%, 100% 100%, 100% 0%)`
               }}
            />

            {/* Interactive Crop Box */}
            <div
              className="absolute z-20 cursor-move ring-1 ring-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]"
              style={{
                left: `${crop.x * 100}%`,
                top: `${crop.y * 100}%`,
                width: `${crop.w * 100}%`,
                height: `${crop.h * 100}%`,
              }}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            >
              {/* Customizable Grid */}
              {gridConfig.show && (
                 <div className="absolute inset-0 w-full h-full pointer-events-none opacity-70">
                    {/* Vertical Lines */}
                    <div 
                      style={{ 
                        position: 'absolute', left: '33.33%', top: 0, bottom: 0, 
                        width: `${gridConfig.thickness / zoom}px`, backgroundColor: gridConfig.color,
                        transform: 'translateX(-50%)'
                      }} 
                    />
                    <div 
                      style={{ 
                        position: 'absolute', left: '66.66%', top: 0, bottom: 0, 
                        width: `${gridConfig.thickness / zoom}px`, backgroundColor: gridConfig.color,
                        transform: 'translateX(-50%)'
                      }} 
                    />
                    {/* Horizontal Lines */}
                    <div 
                      style={{ 
                        position: 'absolute', top: '33.33%', left: 0, right: 0, 
                        height: `${gridConfig.thickness / zoom}px`, backgroundColor: gridConfig.color,
                        transform: 'translateY(-50%)'
                      }} 
                    />
                     <div 
                      style={{ 
                        position: 'absolute', top: '66.66%', left: 0, right: 0, 
                        height: `${gridConfig.thickness / zoom}px`, backgroundColor: gridConfig.color,
                        transform: 'translateY(-50%)'
                      }} 
                    />
                 </div>
              )}

              {/* Handles - Corner */}
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-white border-2 border-accent-500 rounded-full cursor-nw-resize hover:scale-125 transition-transform z-30 shadow-sm" onMouseDown={(e) => handleMouseDown(e, 'nw')} 
                style={{ transform: `scale(${1/zoom})` }}
              />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-accent-500 rounded-full cursor-ne-resize hover:scale-125 transition-transform z-30 shadow-sm" onMouseDown={(e) => handleMouseDown(e, 'ne')} 
                style={{ transform: `scale(${1/zoom})` }}
              />
              <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-white border-2 border-accent-500 rounded-full cursor-sw-resize hover:scale-125 transition-transform z-30 shadow-sm" onMouseDown={(e) => handleMouseDown(e, 'sw')} 
                style={{ transform: `scale(${1/zoom})` }}
              />
              <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-accent-500 rounded-full cursor-se-resize hover:scale-125 transition-transform z-30 shadow-sm" onMouseDown={(e) => handleMouseDown(e, 'se')} 
                style={{ transform: `scale(${1/zoom})` }}
              />
              
              {/* Handles - Side (Hide if aspect ratio locked to avoid confusion) */}
              {!aspectRatio && (
                <>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-white/80 rounded-full cursor-n-resize z-20" onMouseDown={(e) => handleMouseDown(e, 'n')} style={{ transform: `translateX(-50%) scale(${1/zoom})` }} />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-white/80 rounded-full cursor-s-resize z-20" onMouseDown={(e) => handleMouseDown(e, 's')} style={{ transform: `translateX(-50%) scale(${1/zoom})` }} />
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-4 bg-white/80 rounded-full cursor-w-resize z-20" onMouseDown={(e) => handleMouseDown(e, 'w')} style={{ transform: `translateY(-50%) scale(${1/zoom})` }} />
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-4 bg-white/80 rounded-full cursor-e-resize z-20" onMouseDown={(e) => handleMouseDown(e, 'e')} style={{ transform: `translateY(-50%) scale(${1/zoom})` }} />
                </>
              )}
            
              {/* Apply Button (Anchored to bottom of crop box) */}
              <div 
                className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap z-40"
                style={{ transform: `translateX(-50%) scale(${1/zoom})` }}
              >
                 <button 
                  onClick={applyCrop}
                  className="bg-white text-black hover:bg-gray-100 px-5 py-2 rounded-full shadow-lg shadow-black/20 font-semibold text-sm flex items-center gap-2 transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Apply Crop
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md border border-border rounded-full p-1.5 flex items-center gap-1 shadow-2xl z-50 ring-1 ring-white/5">
        <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="p-2 hover:bg-white/10 rounded-full text-gray-300 transition-colors" title="Zoom Out">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
           </svg>
        </button>
        <span className="text-xs font-medium text-gray-200 w-12 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(5, z + 0.1))} className="p-2 hover:bg-white/10 rounded-full text-gray-300 transition-colors" title="Zoom In">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
           </svg>
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={(e) => resetView(e)} className="px-3 py-1 hover:bg-white/10 rounded-full text-xs text-gray-300 font-medium transition-colors" title="Fit to Screen">
           Reset
        </button>
      </div>
    </div>
  );
};