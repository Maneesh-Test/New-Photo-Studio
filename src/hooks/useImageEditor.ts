import { useState, useRef, useEffect, useCallback } from 'react';

export type AdjustmentSettings = {
    brightness: number; // -100 to 100
    contrast: number;   // -100 to 100
    saturation: number; // -100 to 100
    exposure: number;   // -100 to 100
    warmth: number;     // -100 to 100
    sharpness: number;  // 0 to 100
};

export const DEFAULT_ADJUSTMENTS: AdjustmentSettings = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
    warmth: 0,
    sharpness: 0,
};

export type FilterType = 'Original' | 'Vivid' | 'B&W' | 'Warm' | 'Cool' | 'Dramatic';

export const FILTERS: Record<FilterType, Partial<AdjustmentSettings>> = {
    'Original': {},
    'Vivid': { contrast: 20, saturation: 30, exposure: 5 },
    'B&W': { saturation: -100, contrast: 20 },
    'Warm': { warmth: 30, saturation: 10 },
    'Cool': { warmth: -30, saturation: -10, exposure: 5 },
    'Dramatic': { contrast: 40, saturation: -20, exposure: -10 },
};

export function useImageEditor() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [adjustments, setAdjustments] = useState<AdjustmentSettings>(DEFAULT_ADJUSTMENTS);
    const [activeFilter, setActiveFilter] = useState<FilterType>('Original');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [history, setHistory] = useState<AdjustmentSettings[]>([DEFAULT_ADJUSTMENTS]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Load image from file
    const loadImage = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                setAdjustments(DEFAULT_ADJUSTMENTS);
                setActiveFilter('Original');
                setHistory([DEFAULT_ADJUSTMENTS]);
                setHistoryIndex(0);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, []);

    // Apply adjustments to canvas
    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match image
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw original image
        ctx.filter = 'none';
        ctx.drawImage(image, 0, 0);

        // Apply filters using CSS filter syntax for performance
        // Note: For production export, we might need pixel manipulation or a library like fabric.js
        // But for this demo, context filter is great.
        const brightness = 100 + adjustments.brightness;
        const contrast = 100 + adjustments.contrast;
        const saturation = 100 + adjustments.saturation;
        // Exposure is simulated via brightness/contrast combo or separate logic
        // Warmth is simulated via sepia/hue-rotate

        // Construct filter string
        let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

        if (adjustments.warmth !== 0) {
            // Simple warmth simulation
            if (adjustments.warmth > 0) {
                filterString += ` sepia(${adjustments.warmth * 0.5}%)`;
            } else {
                filterString += ` hue-rotate(${adjustments.warmth * 0.5}deg)`;
            }
        }

        ctx.filter = filterString;
        ctx.drawImage(image, 0, 0);

    }, [image, adjustments]);

    const updateAdjustment = useCallback((key: keyof AdjustmentSettings, value: number) => {
        setAdjustments(prev => {
            const newAdjustments = { ...prev, [key]: value };
            // Add to history (debounced in a real app, but simple here)
            return newAdjustments;
        });
    }, []);

    const applyFilter = useCallback((filter: FilterType) => {
        setActiveFilter(filter);
        const filterSettings = FILTERS[filter];
        setAdjustments({ ...DEFAULT_ADJUSTMENTS, ...filterSettings });
    }, []);

    const downloadImage = useCallback(() => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = 'edited-photo.jpg';
        link.href = canvasRef.current.toDataURL('image/jpeg', 0.95); // 95% quality JPG
        link.click();
    }, []);

    return {
        image,
        loadImage,
        canvasRef,
        adjustments,
        updateAdjustment,
        activeFilter,
        applyFilter,
        downloadImage,
    };
}
