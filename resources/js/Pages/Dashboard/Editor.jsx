import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    BookOpen,
    Settings,
    ChevronRight,
    Sparkles,
    ShieldCheck
} from 'lucide-react';
import BackendLayout from '@/Layouts/BackendLayout';
import { cn } from '@/lib/utils';

export default function Editor({ type, user }) {
    const dashboardTitle = type.charAt(0).toUpperCase() + type.slice(1) + " Editor Dashboard";

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
        <BackendLayout title={dashboardTitle}>
            <Head title={dashboardTitle} />
            
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-8"
            >
                {/* Welcome Card */}
                <motion.div
                    variants={itemVariants}
                    className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden p-8 lg:p-12"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <ShieldCheck size={12} />
                                <span>Authorized Access</span>
                            </div>

                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                                Welcome back,<br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                                    {user.username}!
                                </span>
                            </h2>

                            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                                You are currently managing the <span className="text-slate-900 font-bold uppercase">{type}</span> section.
                                Everything you need to oversee publications and peer reviews is right at your fingertips.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">System Online</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{type} Portal</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="w-48 h-48 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 relative group">
                                <LayoutDashboard size={80} className="group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl">
                                    <Sparkles size={24} className="animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    <motion.div variants={itemVariants}>
                        <Link 
                            href={`/editor/${type}`}
                            className="group block h-full bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <ChevronRight size={120} strokeWidth={3} />
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-blue-500/20">
                                    <BookOpen size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    Manage {type}s
                                </h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Update publication details, mission statements, and scope for your assigned {type}s.
                                </p>

                                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                    Launch Manager <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Placeholder for future features */}
                    {[
                        { title: 'System Settings', icon: Settings, desc: 'Configure notifications and preferences for your editor portal.' },
                        { title: 'Global Directory', icon: Sparkles, desc: 'Access a faculty-wide database of reviewers and contributors.' }
                    ].map((feature, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <div className="h-full bg-slate-50/50 p-8 rounded-3xl border border-dashed border-slate-200 flex flex-col justify-center items-center text-center group cursor-not-allowed">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-400 mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px]">
                                    {feature.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </BackendLayout>
    );
}
