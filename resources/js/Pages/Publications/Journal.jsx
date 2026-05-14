import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, 
    FileText, 
    Users, 
    Info, 
    Mail, 
    ChevronRight, 
    Download,
    ExternalLink,
    Search,
    Menu,
    X,
    Globe,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RecentPublicationsCarousel from '@/Components/RecentPublicationsCarousel';

export default function Journal({ journal }) {
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
        { name: 'Home', href: `/journal/${journal.id}`, icon: Globe },
        { name: 'Editorial Board', href: `/journal/${journal.id}/editorial-board`, icon: Users },
        { name: 'Current Issue', href: `/journal/${journal.id}/current`, icon: Zap },
        { name: 'Archive', href: `/journal/${journal.id}/archive`, icon: BookOpen },
        { name: 'Contact', href: `/journal/${journal.id}/contact`, icon: Mail },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title={`${journal.journal_title} | Academic Journal`} />
            
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]"></div>
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
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                J
                            </div>
                            <div className="flex flex-col max-w-[200px] md:max-w-none">
                                <span className="text-sm font-extrabold text-slate-900 leading-none tracking-tight truncate">{journal.journal_title}</span>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">{journal.university_name}</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name}
                                    href={link.href}
                                    className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side: University Logo */}
                        <div className="flex items-center gap-4">
                            {journal.university_logo_url && (
                                <img src={journal.university_logo_url} alt="University Logo" className="h-10 hidden md:block opacity-80" />
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
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8">
                                    <BookOpen size={14} />
                                    <span>Peer-Reviewed Journal</span>
                                </div>
                                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                                    {journal.journal_title}
                                </h2>
                                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-slate-200/50 p-8 lg:p-12 min-h-[500px]">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                        About the Journal
                                    </h3>
                                    <div className="prose max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                                        {journal.journal_details || "No description available."}
                                    </div>
                                </div>
                            </motion.section>

                            {/* Aim & Scope + Mission Grid */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 p-8 shadow-xl shadow-slate-200/40">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                        Aim & Scope
                                    </h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        {journal.aim_scope || "Information pending."}
                                    </p>
                                </motion.div>
                                <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 p-8 shadow-xl shadow-slate-200/40">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-amber-600 rounded-full"></div>
                                        Mission
                                    </h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        {journal.mission || "Information pending."}
                                    </p>
                                </motion.div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:w-96 space-y-8">
                            {/* Journal Cover */}
                            {journal.cover_image_url && (
                                <motion.div 
                                    variants={itemVariants}
                                    className="rounded-[2.5rem] overflow-hidden border border-white shadow-2xl shadow-slate-200/50 relative group"
                                >
                                    <img src={journal.cover_image_url} alt={journal.journal_title} className="w-full h-auto transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </motion.div>
                            )}

                            {/* Information Card */}
                            <motion.div 
                                variants={itemVariants}
                                className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-900/20 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-600/30 transition-colors"></div>
                                
                                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                                    <Info className="text-blue-400" />
                                    Publication Info
                                </h3>
                                
                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ISSN (Print)</span>
                                        <span className="font-mono text-sm text-blue-400">{journal.issn || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Online ISSN</span>
                                        <span className="font-mono text-sm text-blue-400">{journal.online_issn || "N/A"}</span>
                                    </div>

                                    <div className="pt-4 space-y-4">
                                        {[
                                            { label: 'Author Guidelines', url: journal.for_authors_url },
                                            { label: 'Reviewer Guidelines', url: journal.for_reviewers_url },
                                            { label: 'Editorial Policies', url: journal.editorial_policies_url }
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
                                                <Download size={16} className={guideline.url ? "text-blue-400" : ""} />
                                            </a>
                                        ))}
                                    </div>

                                    <Link 
                                        href={`/journal/${journal.id}/contact`}
                                        className="w-full mt-4 flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 group"
                                    >
                                        <Mail size={18} />
                                        Contact Editorial
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Secondary Information */}
                            <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-8 shadow-xl shadow-slate-200/40">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Indexing & Metrics</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Indexing Status</p>
                                            <p className="text-sm font-bold text-slate-700">Google Scholar, Crossref</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </aside>
                    </motion.div>

                    {/* Recent Publications Section */}
                    {journal.issues && journal.issues.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-24 pt-24 border-t border-slate-200/60"
                        >
                            <RecentPublicationsCarousel 
                                title="Recent Issues"
                                items={journal.issues.map(i => ({ ...i, type: 'issue' }))} 
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
                            <h2 className="text-3xl font-black tracking-tight">{journal.journal_title}</h2>
                            <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mt-2">{journal.university_name}</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/" className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-sm font-bold flex items-center gap-2">
                                <ExternalLink size={16} />
                                Main Hub
                            </Link>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-500 text-sm font-medium">
                            &copy; {new Date().getFullYear()} Sabaragamuwa University of Sri Lanka. All Rights Reserved.
                        </p>
                        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
                            Academic Publication Management System
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
