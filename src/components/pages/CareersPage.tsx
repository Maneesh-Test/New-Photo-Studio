import React from 'react';
import { ArrowLeft, Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CareersPage: React.FC = () => {
    const navigate = useNavigate();

    const jobs = [
        {
            title: "Senior Frontend Engineer",
            department: "Engineering",
            location: "Remote (Global)",
            type: "Full-time"
        },
        {
            title: "AI Research Scientist",
            department: "AI / ML",
            location: "San Francisco / Remote",
            type: "Full-time"
        },
        {
            title: "Product Designer",
            department: "Design",
            location: "London / Remote",
            type: "Full-time"
        },
        {
            title: "Growth Marketing Manager",
            department: "Marketing",
            location: "New York / Remote",
            type: "Full-time"
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
                    <span className="text-xl font-bold">Careers</span>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8">
                        Build the future of <br />
                        <span className="text-accent-500">digital creativity.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        We're a team of dreamers, builders, and creators. We're looking for people who want to make a dent in the universe.
                    </p>
                    <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-colors">
                        View Open Roles
                    </button>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10 text-center">
                            <div className="text-4xl font-bold text-accent-500 mb-2">100%</div>
                            <div className="text-gray-400">Remote First</div>
                        </div>
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10 text-center">
                            <div className="text-4xl font-bold text-purple-500 mb-2">Unlimited</div>
                            <div className="text-gray-400">PTO Policy</div>
                        </div>
                        <div className="p-8 rounded-3xl bg-surfaceHighlight border border-white/10 text-center">
                            <div className="text-4xl font-bold text-blue-500 mb-2">Top 1%</div>
                            <div className="text-gray-400">Compensation</div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
                    <div className="space-y-4">
                        {jobs.map((job, i) => (
                            <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer">
                                <div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-400 transition-colors">{job.title}</h3>
                                    <div className="flex gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><Briefcase size={14} /> {job.department}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                                    </div>
                                </div>
                                <ArrowRight className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
