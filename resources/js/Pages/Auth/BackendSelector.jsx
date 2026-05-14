import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Users,
    Award,
    ChevronRight,
    LayoutDashboard,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BackendSelector() {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                duration: 0.6
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative overflow-hidden">
            <Head title="Backend Access | Publication Management System" />
            
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]"></div>
            </div>

            <main className="flex-grow flex items-center justify-center p-6 relative z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="w-full max-w-xl"
                >
                    <div className="text-center mb-10">
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-6"
                        >
                            <Zap size={12} className="animate-pulse" />
                            <span>Authorized Access Only</span>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-500/20">
                                P
                            </div>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                            Publication Management
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-slate-500 font-medium">
                            Select your publication type to continue to the portal
                        </motion.p>
                    </div>

                    <div className="grid gap-4">
                        {[
                            { type: 'journal', title: 'Journal Editor', icon: BookOpen, color: 'blue' },
                            { type: 'conference', title: 'Conference Editor', icon: Users, color: 'indigo' },
                            { type: 'symposium', title: 'Symposium Editor', icon: Award, color: 'amber' }
                        ].map((item) => (
                            <motion.div key={item.type} variants={itemVariants}>
                                <Link
                                    href={`/backend-selection?type=${item.type}`}
                                    className="group relative flex items-center justify-between p-5 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                            item.color === 'blue' && "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
                                            item.color === 'indigo' && "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
                                            item.color === 'amber' && "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
                                        )}>
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                                            <p className="text-xs text-slate-500 font-medium">Manage publications and submissions</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-slate-200/60">
                        <Link 
                            href="/login"
                            className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 group"
                        >
                            <LayoutDashboard size={20} />
                            Admin Dashboard
                            <ChevronRight size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                    </motion.div>

                    <motion.p variants={itemVariants} className="mt-8 text-center text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} Sabaragamuwa University of Sri Lanka
                    </motion.p>
                </motion.div>
            </main>
        </div>
    );
}
