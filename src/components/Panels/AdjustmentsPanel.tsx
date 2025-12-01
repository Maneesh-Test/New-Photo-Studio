import React from 'react';
import { AdjustmentSettings } from '../../hooks/useImageEditor';
import { Sun, Contrast, Droplets, Thermometer, Zap, Aperture } from 'lucide-react';

type Props = {
    adjustments: AdjustmentSettings;
    onUpdate: (key: keyof AdjustmentSettings, value: number) => void;
};

export const AdjustmentsPanel: React.FC<Props> = ({ adjustments, onUpdate }) => {
    return (
        <div className="space-y-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            <Slider
                icon={<Sun size={18} />}
                label="Brightness"
                value={adjustments.brightness}
                onChange={(v) => onUpdate('brightness', v)}
            />
            <Slider
                icon={<Contrast size={18} />}
                label="Contrast"
                value={adjustments.contrast}
                onChange={(v) => onUpdate('contrast', v)}
            />
            <Slider
                icon={<Droplets size={18} />}
                label="Saturation"
                value={adjustments.saturation}
                onChange={(v) => onUpdate('saturation', v)}
            />
            <Slider
                icon={<Aperture size={18} />}
                label="Exposure"
                value={adjustments.exposure}
                onChange={(v) => onUpdate('exposure', v)}
            />
            <Slider
                icon={<Thermometer size={18} />}
                label="Warmth"
                value={adjustments.warmth}
                onChange={(v) => onUpdate('warmth', v)}
            />
            <Slider
                icon={<Zap size={18} />}
                label="Sharpness"
                value={adjustments.sharpness}
                min={0}
                onChange={(v) => onUpdate('sharpness', v)}
            />
        </div>
    );
};

const Slider: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: number;
    min?: number;
    max?: number;
    onChange: (val: number) => void;
}> = ({ icon, label, value, min = -100, max = 100, onChange }) => (
    <div className="flex items-center gap-4">
        <div className="w-8 text-gray-400">{icon}</div>
        <div className="flex-1">
            <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-300">{label}</span>
                <span className="text-xs text-gray-500">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
            />
        </div>
    </div>
);
