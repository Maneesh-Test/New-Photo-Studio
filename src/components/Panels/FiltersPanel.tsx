import React from 'react';
import { FilterType, FILTERS } from '../../hooks/useImageEditor';

type Props = {
    activeFilter: FilterType;
    onSelect: (filter: FilterType) => void;
};

export const FiltersPanel: React.FC<Props> = ({ activeFilter, onSelect }) => {
    return (
        <div className="grid grid-cols-3 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(FILTERS) as FilterType[]).map((filter) => (
                <button
                    key={filter}
                    onClick={() => onSelect(filter)}
                    className={`group relative aspect-square rounded-xl overflow-hidden transition-all duration-200 ${activeFilter === filter
                            ? 'ring-2 ring-white scale-95 shadow-xl'
                            : 'hover:scale-95 hover:ring-2 hover:ring-white/50'
                        }`}
                >
                    {/* Gradient Preview */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getFilterGradient(filter)} opacity-80 group-hover:opacity-100 transition-opacity`} />

                    {/* Label Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <span className={`text-xs font-medium block text-center ${activeFilter === filter ? 'text-white' : 'text-gray-300 group-hover:text-white'
                            }`}>
                            {filter}
                        </span>
                    </div>

                    {/* Active Indicator */}
                    {activeFilter === filter && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full shadow-sm" />
                    )}
                </button>
            ))}
        </div>
    );
};

function getFilterGradient(filter: FilterType): string {
    switch (filter) {
        case 'Vivid': return 'from-blue-500 to-purple-600';
        case 'B&W': return 'from-gray-900 to-gray-400';
        case 'Warm': return 'from-orange-400 to-red-500';
        case 'Cool': return 'from-cyan-400 to-blue-500';
        case 'Dramatic': return 'from-slate-800 to-purple-900';
        default: return 'from-gray-600 to-gray-400';
    }
}
