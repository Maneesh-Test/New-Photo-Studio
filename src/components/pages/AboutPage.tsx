import React from 'react';
import { ArrowLeft, Users, Heart, Globe, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-accent-500/30">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </button>
                    <span className="text-xl font-bold">About Us</span>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-accent-400 to-purple-400 bg-clip-text text-transparent">
                        We're democratizing creativity.
                    </h1>
                    <p className="text-xl text-gray-400 mb-16 leading-relaxed">
                        Photo Studio was born from a simple idea: professional photo editing shouldn't require expensive software or a steep learning curve. We believe everyone deserves to create stunning visuals.
                    </p>

                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10">
                            <Users size={40} className="text-accent-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">For Everyone</h3>
                            <p className="text-gray-400">Whether you're a pro photographer or just editing a selfie, our tools adapt to your needs.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10">
                            <Heart size={40} className="text-purple-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Built with Love</h3>
                            <p className="text-gray-400">Our team of designers and engineers are passionate about pixels, colors, and user experience.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10">
                            <Globe size={40} className="text-blue-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Global Community</h3>
                            <p className="text-gray-400">Join millions of creators from over 150 countries who trust Photo Studio.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10">
                            <Award size={40} className="text-yellow-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Award Winning</h3>
                            <p className="text-gray-400">Recognized for excellence in design and innovation in web technology.</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-8">Meet the Team</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="group">
                                    <div className="w-full aspect-square rounded-2xl bg-white/5 mb-4 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-purple-500/20 group-hover:opacity-100 transition-opacity"></div>
                                        {/* Placeholder for team member image */}
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <Users size={32} />
                                        </div>
                                    </div>
                                    <h4 className="font-bold">Team Member {i}</h4>
                                    <p className="text-sm text-gray-500">Co-Founder</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
