import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogIn, ChevronRight, GraduationCap, ShieldCheck } from 'lucide-react';

export default function DepartmentPortal({ department, type }) {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title={`${department.name} | Editorial Portal`} />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg shadow-slate-200/50">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                P
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-extrabold text-slate-900 leading-none tracking-tight">PMS</span>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Portal</span>
                            </div>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
                            <div className="h-4 w-px bg-slate-200"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type} PORTAL</span>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-12 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-gradient-to-tr from-blue-100/40 to-indigo-100/40 rounded-full blur-[120px] pointer-events-none"></div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-xl w-full"
                >
                    <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden relative group">
                        {/* Top Accented Border */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

                        <div className="p-10 lg:p-14 text-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                <GraduationCap size={40} />
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                                {department.name}
                            </h1>
                            <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed">
                                Welcome to the official editorial portal. Access your management dashboard to coordinate publications, reviews, and archival submissions.
                            </p>

                            <div className="space-y-4">
                                <Link
                                    href={`/login?id=${department.id}&type=${type}`}
                                    className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all duration-300 group"
                                >
                                    <span>Sign in to Dashboard</span>
                                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <div className="flex items-center justify-center gap-2 text-slate-400">
                                    <ShieldCheck size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authorized Personnel Only</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Decoration */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between px-10">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connected Academic Network</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                            <ChevronRight size={16} className="rotate-180" />
                            Return to Public Repository
                        </Link>
                    </div>
                </motion.div>
            </main>

            <footer className="py-8 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} Sabaragamuwa University of Sri Lanka
                </p>
            </footer>
        </div>
    );
}
