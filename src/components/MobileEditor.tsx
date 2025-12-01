import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageEditor, AdjustmentSettings, FilterType, FILTERS } from '../hooks/useImageEditor';
import { Sliders, Wand2, Image as ImageIcon, Download, Share2, Undo, Redo, X, Settings, ArrowLeft } from 'lucide-react';
import { AdjustmentsPanel } from './Panels/AdjustmentsPanel';
import { FiltersPanel } from './Panels/FiltersPanel';
import { AIPanel } from './Panels/AIPanel';

type ActiveTab = 'adjust' | 'filters' | 'ai' | null;

export const MobileEditor: React.FC = () => {
    const {
        image,
        loadImage,
        canvasRef,
        adjustments,
        updateAdjustment,
        activeFilter,
        applyFilter,
        downloadImage
    } = useImageEditor();

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ActiveTab>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');

    const saveApiKey = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setShowSettings(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            loadImage(e.target.files[0]);
        }
    };

    if (!image) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-b from-background via-surface to-background text-white overflow-auto">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
                    {/* Icon with glow */}
                    <div className="mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-accent-600 to-purple-600 p-6 rounded-3xl shadow-2xl">
                                <ImageIcon size={64} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-accent-500 to-purple-500 bg-clip-text text-transparent text-center">
                        Photo Studio
                    </h1>

                    <p className="text-xl text-gray-300 mb-3 text-center max-w-md">
                        Professional photo editing directly in your browser
                    </p>

                    <p className="text-sm text-gray-400 mb-12 text-center max-w-sm">
                        Upload your photo to start editing with powerful adjustments, stunning filters, and AI features
                    </p>

                    {/* Upload Button */}
                    <label className="group relative cursor-pointer mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <div className="relative flex items-center gap-3 bg-gradient-to-r from-accent-600 to-purple-600 px-10 py-5 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all transform group-hover:scale-105">
                            <ImageIcon size={24} />
                            <span className="font-semibold text-lg">Open Photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </label>

                    {/* Quick Features */}
                    <div className="grid grid-cols-3 gap-4 max-w-2xl w-full">
                        <div className="text-center p-4 bg-surfaceHighlight/50 border border-border rounded-xl backdrop-blur-sm">
                            <Sliders size={24} className="text-accent-500 mx-auto mb-2" />
                            <div className="text-xs font-medium text-gray-300">13+ Adjustments</div>
                        </div>
                        <div className="text-center p-4 bg-surfaceHighlight/50 border border-border rounded-xl backdrop-blur-sm">
                            <ImageIcon size={24} className="text-accent-500 mx-auto mb-2" />
                            <div className="text-xs font-medium text-gray-300">6 Pro Filters</div>
                        </div>
                        <div className="text-center p-4 bg-surfaceHighlight/50 border border-border rounded-xl backdrop-blur-sm">
                            <Wand2 size={24} className="text-accent-500 mx-auto mb-2" />
                            <div className="text-xs font-medium text-gray-300">AI Powered</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col bg-background text-white overflow-hidden">
            {/* Header */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-border bg-surface/50 backdrop-blur-md z-10">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2"
                >
                    <ArrowLeft size={24} />
                    <span className="text-sm font-medium">Back</span>
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 hover:bg-white/10 rounded-full text-gray-400"
                    >
                        <Settings size={20} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                        <Undo size={20} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                        <Redo size={20} />
                    </button>
                    <button
                        onClick={downloadImage}
                        className="p-2 bg-accent-600 hover:bg-accent-500 rounded-full text-white shadow-lg shadow-accent-500/20 transition-all"
                    >
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 relative flex items-center justify-center p-4 checkerboard overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-full object-contain shadow-2xl"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                />
            </div>

            {/* Bottom Toolbar Area */}
            <div className="bg-surface border-t border-border z-20">
                {/* Active Tool Panel */}
                {activeTab && (
                    <div className="p-4 border-b border-border bg-surfaceHighlight/50 backdrop-blur-sm animate-in slide-in-from-bottom-10 fade-in duration-200">
                        {activeTab === 'adjust' && (
                            <AdjustmentsPanel adjustments={adjustments} onUpdate={updateAdjustment} />
                        )}
                        {activeTab === 'filters' && (
                            <FiltersPanel activeFilter={activeFilter} onSelect={applyFilter} />
                        )}
                        {activeTab === 'ai' && (
                            <AIPanel image={image} userApiKey={apiKey} />
                        )}
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex items-center justify-around p-2 pb-safe">
                    <TabButton
                        icon={<Sliders size={24} />}
                        label="Adjust"
                        isActive={activeTab === 'adjust'}
                        onClick={() => setActiveTab(activeTab === 'adjust' ? null : 'adjust')}
                    />
                    <TabButton
                        icon={<ImageIcon size={24} />}
                        label="Filters"
                        isActive={activeTab === 'filters'}
                        onClick={() => setActiveTab(activeTab === 'filters' ? null : 'filters')}
                    />
                    <TabButton
                        icon={<Wand2 size={24} />}
                        label="AI Tools"
                        isActive={activeTab === 'ai'}
                        onClick={() => setActiveTab(activeTab === 'ai' ? null : 'ai')}
                    />
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Settings</h3>

                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 mb-2">Gemini API Key</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIza..."
                                className="w-full bg-surfaceHighlight border border-border rounded-lg p-3 text-white text-sm focus:border-accent-500 outline-none transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Required for AI features. Get one at <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline">Google AI Studio</a>.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="flex-1 px-4 py-2 bg-surfaceHighlight border border-border rounded-lg hover:bg-surface transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveApiKey}
                                className="flex-1 px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg transition-colors font-medium"
                            >
                                Save Key
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all w-20 ${isActive
            ? 'text-accent-500 bg-accent-500/10'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);
