import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Calendar, 
    Info, 
    Mail, 
    ChevronRight, 
    Download,
    ExternalLink,
    Search,
    Menu,
    X,
    Globe,
    Zap,
    MapPin,
    Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RecentPublicationsCarousel from '@/Components/RecentPublicationsCarousel';

export default function Conference({ conference }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const navLinks = [
        { name: 'Home', href: `/conference/${conference.id}`, icon: Globe },
        { name: 'Committee', href: `/conference/${conference.id}/committee`, icon: Users },
        { name: 'Current Proceedings', href: `/conference/${conference.id}/current`, icon: Zap },
        { name: 'Archive', href: `/conference/${conference.id}/archive`, icon: Calendar },
        { name: 'Contact', href: `/conference/${conference.id}/contact`, icon: Mail },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Head title={`${conference.conference_title} | Academic Conference`} />
            
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]"></div>
            </div>

            {/* Header / Navigation */}
            <header 
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
                    isScrolled ? "py-3" : "py-6"
                )}
            >
                <div className="max-w-7xl mx-auto">
                    <nav 
                        className={cn(
                            "flex items-center justify-between px-6 py-2 rounded-2xl transition-all duration-500 border border-transparent",
                            isScrolled 
                                ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-white/40 py-3" 
                                : "bg-transparent py-2"
                        )}
                    >
                        {/* Logo/Title */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                C
                            </div>
                            <div className="flex flex-col max-w-[200px] md:max-w-none">
                                <span className="text-sm font-extrabold text-slate-900 leading-none tracking-tight truncate">{conference.conference_title}</span>
                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest truncate">{conference.university_name}</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name}
                                    href={link.href}
                                    className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side: University Logo */}
                        <div className="flex items-center gap-4">
                            {conference.university_logo_url && (
                                <img src={conference.university_logo_url} alt="University Logo" className="h-10 hidden md:block opacity-80" />
                            )}
                            <button 
                                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 lg:hidden pt-24 px-6 bg-white/95 backdrop-blur-2xl"
                    >
                        <div className="flex flex-col gap-6 items-center">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-xl font-bold text-slate-800"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="relative z-10 pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="flex flex-col lg:flex-row gap-12"
                    >
                        {/* Main Content Area */}
                        <div className="flex-1 space-y-12">
                            {/* Hero Section */}
                            <motion.section variants={itemVariants}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8">
                                    <Award size={14} />
                                    <span>Academic Conference</span>
                                </div>
                                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                                    {conference.conference_title}
                                </h2>
                                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-slate-200/50 p-8 lg:p-12 min-h-[500px]">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                        About the Conference
                                    </h3>
                                    <div className="prose max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                                        {conference.conference_details || "No description available."}
                                    </div>
                                </div>
                            </motion.section>

                            {/* Aim & Scope + Mission Grid */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 p-8 shadow-xl shadow-slate-200/40">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                        Aim & Scope
                                    </h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        {conference.aim_scope || "Information pending."}
                                    </p>
                                </motion.div>
                                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 p-8 shadow-xl shadow-slate-200/40">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
                                        Mission
                                    </h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        {conference.mission || "Information pending."}
                                    </p>
                                </motion.div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:w-96 space-y-8">
                            {/* Conference Cover */}
                            {conference.cover_image_url && (
                                <motion.div 
                                    variants={itemVariants}
                                    className="rounded-[2.5rem] overflow-hidden border border-white shadow-2xl shadow-slate-200/50 relative group"
                                >
                                    <img src={conference.cover_image_url} alt={conference.conference_title} className="w-full h-auto transition-transform duration-700 group-hover:scale-110" />
                                </motion.div>
                            )}

                            {/* Information Card */}
                            <motion.div 
                                variants={itemVariants}
                                className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-900/20 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-600/30 transition-colors"></div>
                                
                                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                                    <Info className="text-indigo-400" />
                                    Event Info
                                </h3>
                                
                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ISSN</span>
                                        <span className="font-mono text-sm text-indigo-400">{conference.issn || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</span>
                                        <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                                            <MapPin size={12} />
                                            Main Hall
                                        </span>
                                    </div>

                                    <div className="pt-4 space-y-4">
                                        {[
                                            { label: 'Author Guidelines', url: conference.for_authors_url },
                                            { label: 'Reviewer Guidelines', url: conference.for_reviewers_url },
                                            { label: 'Editorial Policies', url: conference.editorial_policies_url }
                                        ].map((guideline) => (
                                            <a 
                                                key={guideline.label}
                                                href={guideline.url || '#'}
                                                target="_blank"
                                                className={cn(
                                                    "flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm",
                                                    guideline.url 
                                                        ? "bg-white/5 hover:bg-white/10 text-white" 
                                                        : "bg-white/5 opacity-40 cursor-not-allowed text-slate-400"
                                                )}
                                            >
                                                {guideline.label}
                                                <Download size={16} className={guideline.url ? "text-indigo-400" : ""} />
                                            </a>
                                        ))}
                                    </div>

                                    <Link 
                                        href={`/conference/${conference.id}/contact`}
                                        className="w-full mt-4 flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 group"
                                    >
                                        <Mail size={18} />
                                        Contact Committee
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        </aside>
                    </motion.div>

                    {/* Recent Proceedings Section */}
                    {conference.proceedings && conference.proceedings.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-24 pt-24 border-t border-slate-200/60"
                        >
                            <RecentPublicationsCarousel 
                                title="Recent Proceedings"
                                items={conference.proceedings.map(p => ({ ...p, type: 'conference' }))} 
                            />
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-white pt-24 pb-12 relative overflow-hidden mt-20">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[size:40px_40px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">{conference.conference_title}</h2>
                            <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mt-2">{conference.university_name}</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/" className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-sm font-bold flex items-center gap-2">
                                <ExternalLink size={16} />
                                Main Hub
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
