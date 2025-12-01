import React from 'react';
import { ArrowLeft, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ShowcasePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-accent-500/30">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </button>
                    <span className="text-xl font-bold">Showcase</span>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">Made with Photo Studio</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Explore what's possible when creativity meets AI.
                        </p>
                    </div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="break-inside-avoid group relative rounded-3xl overflow-hidden bg-surfaceHighlight border border-white/10">
                                <div className="aspect-[3/4] bg-white/5 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent-900/20 to-purple-900/20"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                                        <ImageIcon size={48} />
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <h3 className="text-xl font-bold mb-2">Project Title {i}</h3>
                                            <p className="text-sm text-gray-300 mb-4">Edited with Magic Enhance & Filters</p>
                                            <button className="text-accent-400 font-bold text-sm flex items-center gap-2">
                                                View Details <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <div className="p-12 rounded-3xl bg-gradient-to-r from-accent-900/50 to-purple-900/50 border border-accent-500/30">
                            <h2 className="text-3xl font-bold mb-4">Submit your work</h2>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                                Want to be featured in our showcase? Share your edits on social media with #PhotoStudioApp.
                            </p>
                            <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-colors">
                                Submit Project
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
