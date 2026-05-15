import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Menu, 
    X, 
    Globe, 
    Users, 
    Zap, 
    BookOpen, 
    Mail, 
    ExternalLink,
    LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicLayout({ children, publication = {}, type = 'journal', active_page = '' }) {
    const pub = publication || {};
    const title = pub.journal_title || pub.conference_title || pub.symposium_title || 'Academic Hub';
    const universityName = pub.university_name || 'Sabaragamuwa University of Sri Lanka';
    const pubId = pub.id || '';
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: `/${type}/${pubId}`, id: 'home' },
        { name: type === 'journal' ? 'Editorial Board' : 'Committee', href: `/${type}/${pubId}/${type === 'journal' ? 'editorial-board' : 'committee'}`, id: 'editorial' },
        { name: 'Current', href: `/${type}/${pubId}/current`, id: 'current' },
        { name: 'Archive', href: `/${type}/${pubId}/archive`, id: 'archive' },
        { name: 'Contact', href: `/${type}/${pubId}/contact`, id: 'contact' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/30 blur-[120px]"></div>
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
                                {title ? title.charAt(0) : 'A'}
                            </div>
                            <div className="flex flex-col max-w-[200px] md:max-w-none">
                                <span className="text-sm font-extrabold text-slate-900 leading-none tracking-tight truncate">{title}</span>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">{universityName}</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.id}
                                    href={link.href}
                                    className={cn(
                                        "text-xs font-bold transition-colors uppercase tracking-widest",
                                        active_page === link.id
                                            ? "text-blue-600"
                                            : "text-slate-600 hover:text-blue-600"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side: University Logo */}
                        <div className="flex items-center gap-4">
                            {pub.university_logo_url && (
                                <img src={pub.university_logo_url} alt="University Logo" className="h-10 hidden md:block opacity-80" />
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
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden pt-24 px-6 bg-white/95 backdrop-blur-2xl">
                    <div className="flex flex-col gap-6 items-center">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.id}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "text-xl font-bold",
                                    active_page === link.id ? "text-blue-600" : "text-slate-800"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <main className="relative z-10 min-h-[80vh]">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-white pt-24 pb-12 relative overflow-hidden mt-20">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[size:40px_40px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">{title}</h2>
                            <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mt-2">{universityName}</p>
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
