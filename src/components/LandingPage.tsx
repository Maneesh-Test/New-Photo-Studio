import React from 'react';
import { Sparkles, Wand2, Image, Zap, Download, Share2 } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-surface to-background text-white overflow-auto">
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center px-6">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    {/* Logo/Icon */}
                    <div className="mb-8 inline-block">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-accent-600 to-purple-600 p-6 rounded-3xl shadow-2xl">
                                <Image size={64} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-accent-500 to-purple-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        Photo Studio
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                        Professional photo editing powered by AI
                    </p>
                    <p className="text-base md:text-lg text-gray-400 mb-12 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        Transform your images with powerful adjustments, stunning filters, and cutting-edge AI features
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={onGetStarted}
                        className="group relative inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <div className="relative bg-gradient-to-r from-accent-600 to-purple-600 px-10 py-5 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all transform group-hover:scale-105 flex items-center gap-3">
                            <Sparkles size={24} />
                            <span>Start Creating</span>
                        </div>
                    </button>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-accent-500 mb-2">13+</div>
                            <div className="text-sm text-gray-400">Adjustments</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-accent-500 mb-2">6</div>
                            <div className="text-sm text-gray-400">Pro Filters</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-accent-500 mb-2">AI</div>
                            <div className="text-sm text-gray-400">Powered</div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-gray-400 text-center mb-16 text-lg">
                        Professional-grade tools at your fingertips
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-surfaceHighlight hover:bg-surface border border-border rounded-2xl p-8 transition-all hover:border-accent-500/50 hover:shadow-glow">
                            <div className="w-14 h-14 bg-gradient-to-br from-accent-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Wand2 size={28} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">AI Magic</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Remove backgrounds, enhance photos, and generate edits with natural language using cutting-edge AI
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-surfaceHighlight hover:bg-surface border border-border rounded-2xl p-8 transition-all hover:border-accent-500/50 hover:shadow-glow">
                            <div className="w-14 h-14 bg-gradient-to-br from-accent-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={28} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">Real-Time Editing</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Adjust brightness, contrast, saturation, and more with instant preview powered by your GPU
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-surfaceHighlight hover:bg-surface border border-border rounded-2xl p-8 transition-all hover:border-accent-500/50 hover:shadow-glow">
                            <div className="w-14 h-14 bg-gradient-to-br from-accent-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Download size={28} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">Multi-Format Export</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Download your masterpieces in JPG and PNG formats with customizable quality settings
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="relative py-20 px-6 bg-surfaceHighlight/30">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        Simple. Powerful. Fast.
                    </h2>

                    <div className="space-y-12">
                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center text-xl font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">Upload Your Photo</h3>
                                <p className="text-gray-400 text-lg">Choose any image from your device to start editing</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center text-xl font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">Apply Your Magic</h3>
                                <p className="text-gray-400 text-lg">Use adjustments, filters, or AI tools to perfect your image</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center text-xl font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">Download & Share</h3>
                                <p className="text-gray-400 text-lg">Export your creation and share it with the world</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        Ready to Create?
                    </h2>
                    <p className="text-xl text-gray-400 mb-12">
                        Join thousands of creators making stunning photos every day
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="group relative inline-flex items-center gap-3"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <div className="relative bg-gradient-to-r from-accent-600 to-purple-600 px-12 py-6 rounded-2xl shadow-2xl group-hover:shadow-accent-500/50 transition-all transform group-hover:scale-105 flex items-center gap-3 text-lg font-semibold">
                            <Sparkles size={24} />
                            <span>Start Editing Now</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-400 text-sm">
                        © 2024 Photo Studio. Professional photo editing in your browser.
                    </div>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <span>Built with React + Vite</span>
                        <span>•</span>
                        <span>Powered by AI</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
