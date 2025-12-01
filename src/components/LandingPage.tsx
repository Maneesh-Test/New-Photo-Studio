import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, Image as ImageIcon, Zap, Download, Share2, Check, Star, Menu, X, ArrowRight, Github, Twitter, Instagram } from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleGetStarted = () => {
        navigate('/editor');
    };

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-accent-500/30">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/20">
                            <ImageIcon size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Photo Studio</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">How it Works</a>
                        <a href="#testimonials" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Testimonials</a>
                        <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Pricing</a>
                        <button
                            onClick={handleGetStarted}
                            className="px-5 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95"
                        >
                            Launch App
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top-5 bg-black/95 backdrop-blur-xl">
                        <a href="#features" className="text-lg font-medium text-gray-300" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#how-it-works" className="text-lg font-medium text-gray-300" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
                        <a href="#testimonials" className="text-lg font-medium text-gray-300" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
                        <a href="#pricing" className="text-lg font-medium text-gray-300" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                        <button
                            onClick={() => {
                                handleGetStarted();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full py-3 bg-accent-600 text-white font-semibold rounded-xl mt-2"
                        >
                            Launch App
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="flex h-2 w-2 rounded-full bg-accent-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-accent-300">New: AI Generative Fill</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                        Professional Editing <br />
                        <span className="bg-gradient-to-r from-accent-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Made Simple
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                        The most powerful browser-based photo editor. Remove backgrounds, enhance quality, and generate content with AI—no login required.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        <button
                            onClick={handleGetStarted}
                            className="group relative px-8 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            Start Editing Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a href="#features" className="px-8 py-4 bg-white/5 text-white text-lg font-semibold rounded-full hover:bg-white/10 border border-white/10 transition-all backdrop-blur-sm">
                            View Features
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                        {[
                            { label: 'Active Users', value: '10k+' },
                            { label: 'Photos Edited', value: '1M+' },
                            { label: 'AI Models', value: 'State-of-the-art' },
                            { label: 'Rating', value: '4.9/5' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 bg-surface/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything you need</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Powerful tools that usually cost hundreds of dollars, now free in your browser.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Wand2 size={32} />,
                                title: "AI Magic Enhance",
                                desc: "Automatically fix lighting, color balance, and sharpness with one click using Gemini Vision."
                            },
                            {
                                icon: <ImageIcon size={32} />,
                                title: "Background Removal",
                                desc: "Instantly remove backgrounds and replace them with transparency or solid colors."
                            },
                            {
                                icon: <Sparkles size={32} />,
                                title: "Generative Fill",
                                desc: "Add or remove objects from your photos simply by describing what you want."
                            },
                            {
                                icon: <Zap size={32} />,
                                title: "Instant Adjustments",
                                desc: "Real-time GPU accelerated adjustments for brightness, contrast, and more."
                            },
                            {
                                icon: <Download size={32} />,
                                title: "Pro Export",
                                desc: "Export in high-quality JPG or PNG formats. Perfect for social media or print."
                            },
                            {
                                icon: <Share2 size={32} />,
                                title: "Privacy First",
                                desc: "Your photos are processed locally or securely. We don't store your images."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-accent-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-accent-500/20">
                                    <div className="text-white">{feature.icon}</div>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8">Edit like a pro in seconds</h2>
                            <div className="space-y-12">
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-12 h-12 bg-accent-600/20 text-accent-500 rounded-full flex items-center justify-center text-xl font-bold border border-accent-500/30">1</div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Upload Photo</h3>
                                        <p className="text-gray-400 text-lg">Drag and drop any image. We support JPG, PNG, and WebP.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-12 h-12 bg-accent-600/20 text-accent-500 rounded-full flex items-center justify-center text-xl font-bold border border-accent-500/30">2</div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Apply AI Magic</h3>
                                        <p className="text-gray-400 text-lg">Use our AI tools to remove backgrounds or enhance quality instantly.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-12 h-12 bg-accent-600/20 text-accent-500 rounded-full flex items-center justify-center text-xl font-bold border border-accent-500/30">3</div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Export & Share</h3>
                                        <p className="text-gray-400 text-lg">Download your masterpiece in high resolution, ready for the world.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
                            <div className="relative bg-surfaceHighlight border border-white/10 rounded-3xl p-8 aspect-square flex items-center justify-center">
                                <ImageIcon size={120} className="text-white/20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-20 h-2 bg-white/20 rounded-full"></div>
                                            <div className="w-10 h-2 bg-white/20 rounded-full"></div>
                                        </div>
                                        <div className="w-64 h-40 bg-gradient-to-br from-accent-500/20 to-purple-500/20 rounded-xl border border-white/10 flex items-center justify-center">
                                            <Sparkles size={32} className="text-accent-500 animate-pulse" />
                                        </div>
                                        <div className="flex justify-between mt-4">
                                            <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-xs font-bold">AI</div>
                                            <div className="w-24 h-8 bg-white text-black rounded-lg flex items-center justify-center text-xs font-bold">Download</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 px-6 bg-surface/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Loved by Creators</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah J.",
                                role: "Photographer",
                                text: "The AI background removal is better than Photoshop. I use it for all my product shots now."
                            },
                            {
                                name: "Mike T.",
                                role: "Social Media Manager",
                                text: "Generative fill saved me hours of work. Being able to just type what I want is magic."
                            },
                            {
                                name: "Emily R.",
                                role: "Content Creator",
                                text: "Finally a web editor that doesn't feel like a toy. The adjustments are pro-level."
                            }
                        ].map((t, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-surfaceHighlight border border-white/5 hover:border-accent-500/30 transition-colors">
                                <div className="flex gap-1 mb-4 text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-lg text-gray-300 mb-6">"{t.text}"</p>
                                <div>
                                    <div className="font-bold">{t.name}</div>
                                    <div className="text-sm text-gray-500">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple Pricing</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Start for free, upgrade for power.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10 flex flex-col">
                            <h3 className="text-2xl font-bold mb-2">Free</h3>
                            <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                            <p className="text-gray-400 mb-8">Perfect for quick edits and trying out AI features.</p>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> Basic Adjustments</li>
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> Standard Filters</li>
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> 5 AI Edits / day</li>
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> 720p Export</li>
                            </ul>
                            <button onClick={handleGetStarted} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors">
                                Get Started
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-accent-900/50 to-purple-900/50 border border-accent-500/50 flex flex-col relative transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</div>
                            <h3 className="text-2xl font-bold mb-2">Pro</h3>
                            <div className="text-4xl font-bold mb-6">$12<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                            <p className="text-gray-400 mb-8">For creators who need professional tools daily.</p>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> Advanced Adjustments</li>
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> Premium Filters</li>
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> Unlimited AI Edits</li>
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> 4K Export</li>
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> Priority Support</li>
                            </ul>
                            <button onClick={handleGetStarted} className="w-full py-3 bg-accent-600 hover:bg-accent-500 rounded-xl font-semibold transition-colors shadow-lg shadow-accent-500/25">
                                Start Free Trial
                            </button>
                        </div>

                        {/* Team Plan */}
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10 flex flex-col">
                            <h3 className="text-2xl font-bold mb-2">Team</h3>
                            <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                            <p className="text-gray-400 mb-8">Collaborative features for agencies and teams.</p>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> Everything in Pro</li>
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> Shared Workspace</li>
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> Brand Assets</li>
                                <li className="flex items-center gap-3"><Check size={20} className="text-accent-500" /> API Access</li>
                            </ul>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-purple-600 rounded-3xl blur-2xl opacity-30"></div>
                    <div className="relative bg-gradient-to-r from-accent-900 to-purple-900 rounded-3xl p-12 md:p-20 text-center border border-white/10 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                        <h2 className="text-4xl md:text-6xl font-bold mb-6 relative z-10">Start Creating Today</h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto relative z-10">
                            No credit card required. No account needed. Just pure creativity.
                        </p>

                        <button
                            onClick={handleGetStarted}
                            className="relative z-10 px-10 py-5 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl shadow-black/20"
                        >
                            Launch Photo Studio
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black py-16 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-accent-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <ImageIcon size={18} className="text-white" />
                            </div>
                            <span className="text-xl font-bold">Photo Studio</span>
                        </div>
                        <p className="text-gray-400 max-w-sm mb-8">
                            The next generation of photo editing. Built for the web, powered by AI, designed for creators.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Github size={20} /></a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Instagram size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Showcase</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <div>© 2024 Photo Studio Inc. All rights reserved.</div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
