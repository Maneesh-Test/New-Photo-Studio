import React from 'react';
import { AdjustmentSettings } from '../../hooks/useImageEditor';
import { Sun, Contrast, Droplets, Thermometer, Zap, Aperture } from 'lucide-react';

type Props = {
    adjustments: AdjustmentSettings;
    onUpdate: (key: keyof AdjustmentSettings, value: number) => void;
};

export const AdjustmentsPanel: React.FC<Props> = ({ adjustments, onUpdate }) => {
    return (
        <div className="space-y-6">
            <Slider
                icon={<Sun size={16} />}
                label="Brightness"
                value={adjustments.brightness}
                onChange={(v) => onUpdate('brightness', v)}
            />
            <Slider
                icon={<Contrast size={16} />}
                label="Contrast"
                value={adjustments.contrast}
                onChange={(v) => onUpdate('contrast', v)}
            />
            <Slider
                icon={<Droplets size={16} />}
                label="Saturation"
                value={adjustments.saturation}
                onChange={(v) => onUpdate('saturation', v)}
            />
            <Slider
                icon={<Aperture size={16} />}
                label="Exposure"
                value={adjustments.exposure}
                onChange={(v) => onUpdate('exposure', v)}
            />
            <Slider
                icon={<Thermometer size={16} />}
                label="Warmth"
                value={adjustments.warmth}
                onChange={(v) => onUpdate('warmth', v)}
            />
            <Slider
                icon={<Zap size={16} />}
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
    <div className="group">
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                {icon}
                <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
            </div>
            <input
                type="number"
                value={value}
                min={min}
                max={max}
                onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
                className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-right text-xs text-white focus:border-accent-500 focus:outline-none transition-colors"
            />
        </div>
        <div className="relative h-6 flex items-center">
            <div className="absolute w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-white transition-all duration-75"
                    style={{
                        width: `${((value - min) / (max - min)) * 100}%`
                    }}
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <div
                className="absolute w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none transition-all duration-75 transform -translate-x-1/2"
                style={{
                    left: `${((value - min) / (max - min)) * 100}%`
                }}
            />
        </div>
    </div>
);
