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
        <div className="h-screen w-full flex flex-col bg-zinc-950 text-white overflow-hidden font-sans selection:bg-accent-500/30">
            {/* Header */}
            <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                        title="Back to Home"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>
                    <span className="font-medium hidden md:block text-gray-300">Untitled Project</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-zinc-800/50 rounded-full p-1 border border-white/5 mr-4">
                        <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors" title="Undo">
                            <Undo size={18} />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors" title="Redo">
                            <Redo size={18} />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                        title="Settings"
                    >
                        <Settings size={20} />
                    </button>

                    <button
                        onClick={downloadImage}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <Download size={18} />
                        <span className="hidden md:inline">Export</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Canvas Area */}
                <div className="flex-1 relative flex items-center justify-center p-8 bg-zinc-950/50 checkerboard overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="max-w-full max-h-full object-contain shadow-2xl ring-1 ring-white/10 rounded-sm"
                        style={{ maxHeight: 'calc(100vh - 140px)' }}
                    />

                    {/* Floating Zoom Controls (Visual Only for now) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-full shadow-xl text-sm font-medium text-gray-300">
                        <button className="hover:text-white">-</button>
                        <span>100%</span>
                        <button className="hover:text-white">+</button>
                    </div>
                </div>

                {/* Desktop Sidebar */}
                <aside className="hidden md:flex w-80 flex-col border-l border-white/5 bg-zinc-900">
                    {/* Sidebar Tabs */}
                    <div className="flex border-b border-white/5">
                        <SidebarTab
                            icon={<Sliders size={18} />}
                            label="Adjust"
                            isActive={activeTab === 'adjust' || activeTab === null}
                            onClick={() => setActiveTab('adjust')}
                        />
                        <SidebarTab
                            icon={<Wand2 size={18} />}
                            label="AI Tools"
                            isActive={activeTab === 'ai'}
                            onClick={() => setActiveTab('ai')}
                        />
                        <SidebarTab
                            icon={<ImageIcon size={18} />}
                            label="Filters"
                            isActive={activeTab === 'filters'}
                            onClick={() => setActiveTab('filters')}
                        />
                    </div>

                    {/* Sidebar Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        {(activeTab === 'adjust' || activeTab === null) && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Light & Color</h3>
                                <AdjustmentsPanel adjustments={adjustments} onUpdate={updateAdjustment} />
                            </div>
                        )}
                        {activeTab === 'ai' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Generative AI</h3>
                                <AIPanel image={image} userApiKey={apiKey} />
                            </div>
                        )}
                        {activeTab === 'filters' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Presets</h3>
                                <FiltersPanel activeFilter={activeFilter} onSelect={applyFilter} />
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="md:hidden bg-zinc-900 border-t border-white/5 pb-safe">
                {/* Active Tool Panel (Mobile) */}
                {activeTab && (
                    <div className="p-4 border-b border-white/5 bg-zinc-900/95 backdrop-blur-xl animate-in slide-in-from-bottom-full duration-300 absolute bottom-full left-0 right-0 max-h-[50vh] overflow-y-auto rounded-t-2xl shadow-2xl ring-1 ring-white/10">
                        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>
                        {activeTab === 'adjust' && <AdjustmentsPanel adjustments={adjustments} onUpdate={updateAdjustment} />}
                        {activeTab === 'filters' && <FiltersPanel activeFilter={activeFilter} onSelect={applyFilter} />}
                        {activeTab === 'ai' && <AIPanel image={image} userApiKey={apiKey} />}
                    </div>
                )}

                {/* Mobile Navigation Tabs */}
                <div className="flex items-center justify-around p-2">
                    <TabButton
                        icon={<Sliders size={24} />}
                        label="Adjust"
                        isActive={activeTab === 'adjust'}
                        onClick={() => setActiveTab(activeTab === 'adjust' ? null : 'adjust')}
                    />
                    <TabButton
                        icon={<Wand2 size={24} />}
                        label="AI Tools"
                        isActive={activeTab === 'ai'}
                        onClick={() => setActiveTab(activeTab === 'ai' ? null : 'ai')}
                    />
                    <TabButton
                        icon={<ImageIcon size={24} />}
                        label="Filters"
                        isActive={activeTab === 'filters'}
                        onClick={() => setActiveTab(activeTab === 'filters' ? null : 'filters')}
                    />
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl ring-1 ring-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Settings</h3>
                            <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Gemini API Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="AIza..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 pl-4 text-white text-sm focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-all"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                                Required for AI features like Magic Enhance and Generative Fill.
                                <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:text-accent-300 hover:underline ml-1">
                                    Get a free key from Google
                                </a>.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveApiKey}
                                className="flex-1 px-4 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors font-bold"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarTab: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all border-b-2 ${isActive
                ? 'text-white border-white bg-white/5'
                : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/5'
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-20 ${isActive
            ? 'text-white'
            : 'text-gray-500'
            }`}
    >
        <div className={`p-2 rounded-full transition-all ${isActive ? 'bg-white text-black' : 'bg-transparent'}`}>
            {icon}
        </div>
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);
