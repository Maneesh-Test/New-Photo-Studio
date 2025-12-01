import React from 'react';
import { FilterType, FILTERS } from '../../hooks/useImageEditor';

type Props = {
    activeFilter: FilterType;
    onSelect: (filter: FilterType) => void;
};

export const FiltersPanel: React.FC<Props> = ({ activeFilter, onSelect }) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {(Object.keys(FILTERS) as FilterType[]).map((filter) => (
                <button
                    key={filter}
                    onClick={() => onSelect(filter)}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 transition-all ${activeFilter === filter ? 'scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                >
                    <div className={`w-20 h-20 rounded-lg bg-gray-700 overflow-hidden border-2 ${activeFilter === filter ? 'border-accent-500 shadow-glow' : 'border-transparent'
                        }`}>
                        {/* In a real app, we'd render a thumbnail preview here */}
                        <div className={`w-full h-full bg-gradient-to-br ${getFilterGradient(filter)}`} />
                    </div>
                    <span className={`text-xs font-medium ${activeFilter === filter ? 'text-accent-500' : 'text-gray-400'
                        }`}>
                        {filter}
                    </span>
                </button>
            ))}
        </div>
    );
};

function getFilterGradient(filter: FilterType): string {
    switch (filter) {
        case 'Vivid': return 'from-blue-400 to-purple-500';
        case 'B&W': return 'from-gray-900 to-gray-100';
        case 'Warm': return 'from-orange-300 to-red-400';
        case 'Cool': return 'from-blue-300 to-cyan-400';
        case 'Dramatic': return 'from-gray-800 to-purple-900';
        default: return 'from-gray-700 to-gray-500';
    }
}
