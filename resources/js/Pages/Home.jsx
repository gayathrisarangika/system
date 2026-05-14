import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    BookOpen, 
    Users, 
    Award, 
    ChevronRight, 
    ArrowRight,
    Globe,
    Zap,
    Search,
    Menu,
    X,
    ExternalLink,
    GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PublicationCard from '@/Components/PublicationCard';

export default function Home({ journals, conferences, symposiums }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title="Academic Publications | Publication Management System" />
            
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute top-[20%] right-[15%] w-24 h-24 rounded-full bg-blue-200/30 blur-2xl"></div>
            </div>

            {/* Header */}
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
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                    P
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-extrabold text-slate-900 leading-none tracking-tight">PMS</span>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Academic Hub</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="#journals" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Journals</Link>
                            <Link href="#conferences" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Conferences</Link>
                            <Link href="#symposiums" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Symposiums</Link>
                            
                            <div className="h-6 w-px bg-slate-200 mx-2"></div>
                            
                            <Link 
                                href="/backend-login"
                                className="relative group px-6 py-2.5 rounded-xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 group-hover:scale-105 transition-transform duration-300"></div>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                <span className="relative flex items-center gap-2 text-sm font-bold text-white tracking-wide">
                                    Backend Login
                                    <LayoutDashboard size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
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
                        className="fixed inset-0 z-40 md:hidden pt-24 px-6 bg-white/95 backdrop-blur-2xl"
                    >
                        <div className="flex flex-col gap-6 items-center">
                            <Link href="#journals" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-slate-800">Journals</Link>
                            <Link href="#conferences" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-slate-800">Conferences</Link>
                            <Link href="#symposiums" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-slate-800">Symposiums</Link>
                            <div className="w-full h-px bg-slate-100 my-2"></div>
                            <Link 
                                href="/backend-login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20"
                            >
                                Backend Login
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
                            >
                                <Zap size={14} className="animate-pulse" />
                                <span>Premier Academic Repository</span>
                            </motion.div>

                            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                                    Academic
                                </span>
                                <br />
                                Publications
                            </h2>

                            <p className="text-lg lg:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                                Explore a diverse collection of peer-reviewed journals, cutting-edge conference proceedings, and collaborative symposia from the Faculty of Social Sciences and Languages.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link 
                                    href="#journals"
                                    className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                                >
                                    Explore Library
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button 
                                    onClick={() => window.open('https://www.sab.ac.lk/fssl/', '_blank')}
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    Faculty Website
                                    <Globe size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Floating elements */}
                    <motion.div 
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-[10%] hidden xl:block p-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Journals</p>
                                <p className="text-lg font-black text-slate-800">{journals.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/4 right-[10%] hidden xl:block p-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Events</p>
                                <p className="text-lg font-black text-slate-800">{conferences.length + symposiums.length}</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Main Content Containers */}
                <div className="container mx-auto px-6 pb-32">
                    
                    {/* Journals Section */}
                    {journals.length > 0 && (
                        <motion.section 
                            id="journals"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="mb-24"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                                <div>
                                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                                        <div className="w-6 h-0.5 bg-blue-600"></div>
                                        <span>Publication Series</span>
                                    </div>
                                    <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Academic Journals</h3>
                                </div>
                                <p className="text-slate-500 max-w-md font-medium text-sm md:text-right leading-relaxed">
                                    Peer-reviewed scholarly articles contributing to global knowledge in social sciences and languages.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                                {journals.map((journal, index) => (
                                    <motion.div key={journal.id} variants={itemVariants}>
                                        <PublicationCard 
                                            href={`/journal/${journal.id}`}
                                            image={journal.cover_image_url}
                                            title={journal.journal_title}
                                            subtitle={journal.university_name}
                                            type="Journal"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Conferences Section */}
                    {conferences.length > 0 && (
                        <motion.section 
                            id="conferences"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="mb-24 relative"
                        >
                            <div className="absolute inset-y-0 -left-6 -right-6 bg-slate-900/5 -z-10 rounded-[3rem]"></div>
                            
                            <div className="py-16 px-6 lg:px-12">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                                    <div>
                                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                                            <div className="w-6 h-0.5 bg-indigo-600"></div>
                                            <span>Event Proceedings</span>
                                        </div>
                                        <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Conferences</h3>
                                    </div>
                                    <p className="text-slate-500 max-w-md font-medium text-sm md:text-right leading-relaxed">
                                        Discover research presentations and academic dialogues from our international and national conferences.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                                    {conferences.map((conf, index) => (
                                        <motion.div key={conf.id} variants={itemVariants}>
                                            <PublicationCard 
                                                href={`/conference/${conf.id}`}
                                                image={conf.cover_image_url}
                                                title={conf.conference_title}
                                                subtitle={conf.university_name}
                                                type="Conference"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* Symposiums Section */}
                    {symposiums.length > 0 && (
                        <motion.section 
                            id="symposiums"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="mb-16"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                                <div>
                                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                                        <div className="w-6 h-0.5 bg-amber-600"></div>
                                        <span>Collaborative Research</span>
                                    </div>
                                    <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Symposiums</h3>
                                </div>
                                <p className="text-slate-500 max-w-md font-medium text-sm md:text-right leading-relaxed">
                                    Focused academic gatherings showcasing specialized research and faculty-wide collaborations.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                                {symposiums.map((symp, index) => (
                                    <motion.div key={symp.id} variants={itemVariants}>
                                        <PublicationCard 
                                            href={`/symposium/${symp.id}`}
                                            image={symp.cover_image_url}
                                            title={symp.symposium_title}
                                            subtitle={symp.university_name}
                                            type="Symposium"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {journals.length === 0 && conferences.length === 0 && symposiums.length === 0 && (
                        <div className="py-32 text-center bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Publications Found</h3>
                            <p className="text-slate-500 font-medium">We're currently updating our repository. Please check back later.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-white pt-24 pb-12 relative overflow-hidden">
                {/* Footer Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[size:40px_40px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-950 font-black text-2xl">
                                    P
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black tracking-tight text-white leading-none">PMS</span>
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Sabaragamuwa University</span>
                                </div>
                            </div>
                            <p className="text-slate-400 text-lg max-w-md leading-relaxed font-medium mb-8">
                                Empowering academic excellence through a unified platform for journals, conferences, and symposiums. Part of the Faculty of Social Sciences and Languages.
                            </p>
                            <div className="flex gap-4">
                                {['Facebook', 'Twitter', 'LinkedIn', 'YouTube'].map(social => (
                                    <button key={social} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all duration-300">
                                        <span className="sr-only">{social}</span>
                                        <ChevronRight size={18} className="opacity-50" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-lg mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                                Quick Links
                            </h4>
                            <ul className="space-y-4">
                                {['Home', 'Journals', 'Conferences', 'Symposiums'].map(link => (
                                    <li key={link}>
                                        <Link href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                                            <ChevronRight size={14} className="text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-lg mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                                Contact Info
                            </h4>
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 flex-shrink-0">
                                        <GraduationCap size={20} />
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Faculty of Social Sciences and Languages,<br />
                                        Sabaragamuwa University of Sri Lanka,<br />
                                        Belihuloya, 70140, Sri Lanka.
                                    </p>
                                </div>
                                <div 
                                    onClick={() => window.open('https://www.sab.ac.lk/fssl/', '_blank')}
                                    className="flex gap-4 items-center cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 flex-shrink-0">
                                        <Globe size={20} />
                                    </div>

                                    <p className="text-slate-400 text-sm">
                                        https://www.sab.ac.lk/fssl/
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-500 text-sm font-medium">
                            &copy; {new Date().getFullYear()} Sabaragamuwa University of Sri Lanka. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
