import React from 'react';
import { ArrowLeft, Code, Terminal, Zap, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const APIPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-accent-500/30">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </button>
                    <div className="flex gap-4">
                        <button className="text-gray-400 hover:text-white transition-colors">Documentation</button>
                        <button className="bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">Get API Key</button>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-bold mb-6">
                                <Terminal size={14} /> Developer Preview
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6">
                                Integrate AI editing into your app.
                            </h1>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                The same powerful engine that drives Photo Studio is available as a REST API. Process images at scale with simple HTTP requests.
                            </p>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-accent-600 hover:bg-accent-500 rounded-xl font-bold transition-colors">
                                    Read the Docs
                                </button>
                                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-colors">
                                    View Pricing
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
                            <div className="relative bg-[#1e1e1e] rounded-2xl border border-white/10 p-6 shadow-2xl font-mono text-sm overflow-hidden">
                                <div className="flex gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="space-y-2 text-gray-300">
                                    <p><span className="text-purple-400">curl</span> -X POST https://api.photostudio.dev/v1/remove-bg \</p>
                                    <p className="pl-4">-H <span className="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span> \</p>
                                    <p className="pl-4">-F <span className="text-green-400">"image=@photo.jpg"</span></p>
                                    <p className="text-gray-500 mt-4"># Response</p>
                                    <p className="text-blue-400">{`{`}</p>
                                    <p className="pl-4"><span className="text-blue-300">"status"</span>: <span className="text-green-400">"success"</span>,</p>
                                    <p className="pl-4"><span className="text-blue-300">"url"</span>: <span className="text-green-400">"https://cdn.photostudio.dev/..."</span></p>
                                    <p className="text-blue-400">{`}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10">
                            <Zap size={32} className="text-yellow-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                            <p className="text-gray-400">Optimized for speed. Process thousands of images per minute with our global edge network.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10">
                            <Lock size={32} className="text-green-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Secure by Default</h3>
                            <p className="text-gray-400">Enterprise-grade security. Your data is encrypted at rest and in transit.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10">
                            <Code size={32} className="text-blue-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Simple SDKs</h3>
                            <p className="text-gray-400">Official libraries for Node.js, Python, PHP, and Ruby to get you started in minutes.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
