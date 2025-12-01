import React from 'react';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BlogPage: React.FC = () => {
    const navigate = useNavigate();

    const posts = [
        {
            title: "The Future of AI in Photography",
            excerpt: "How generative AI is changing the way we capture and edit moments forever.",
            date: "Dec 1, 2024",
            author: "Sarah Jenkins",
            category: "Technology"
        },
        {
            title: "5 Tips for Better Portraits",
            excerpt: "Master the art of portrait photography with these simple lighting and composition tricks.",
            date: "Nov 28, 2024",
            author: "Mike Ross",
            category: "Tutorials"
        },
        {
            title: "Understanding Color Theory",
            excerpt: "Why do some photos just look 'right'? It's all about color harmony.",
            date: "Nov 25, 2024",
            author: "Emily Chen",
            category: "Design"
        },
        {
            title: "New Feature: Magic Erase",
            excerpt: "Introducing our latest tool that lets you remove unwanted objects in seconds.",
            date: "Nov 20, 2024",
            author: "Photo Studio Team",
            category: "Product Updates"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-accent-500/30">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </button>
                    <span className="text-xl font-bold">Blog</span>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">Stories & Insights</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Tips, tutorials, and updates from the Photo Studio team.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {posts.map((post, i) => (
                            <article key={i} className="group bg-surfaceHighlight border border-white/10 rounded-3xl overflow-hidden hover:border-accent-500/50 transition-all hover:-translate-y-1">
                                <div className="aspect-video bg-white/5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent-900/50 to-purple-900/50 group-hover:scale-105 transition-transform duration-500"></div>
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                                        <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-accent-400 transition-colors">{post.title}</h2>
                                    <p className="text-gray-400 mb-6">{post.excerpt}</p>
                                    <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-accent-400 transition-colors">
                                        Read Article <ArrowRight size={16} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
