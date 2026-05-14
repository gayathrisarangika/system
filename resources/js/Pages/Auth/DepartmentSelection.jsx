import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Search,
    BookOpen,
    Users,
    Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DepartmentSelection({ departments, conferenceNames, symposiumNames, type }) {
    const getList = () => {
        if (type === 'journal') return departments.map(d => ({ id: d.id, name: d.name }));
        if (type === 'conference') return conferenceNames.map(c => ({ id: c.id, name: c.name }));
        if (type === 'symposium') return symposiumNames.map(s => ({ id: s.id, name: s.name }));
        return [];
    };

    const list = getList();
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

    const Icon = {
        journal: BookOpen,
        conference: Users,
        symposium: Award
    }[type] || BookOpen;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative overflow-hidden">
            <Head title={`Select ${typeLabel} | PMS`} />
            
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/30 blur-[120px]"></div>
            </div>

            <main className="flex-grow flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <Link
                            href="/backend-login"
                            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
                        >
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Selection
                        </Link>
                    </motion.div>

                    <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <div className="p-8 lg:p-12 border-b border-slate-200/60 bg-gradient-to-br from-slate-50/50 to-white/50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <Icon size={32} />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Select {typeLabel}</h1>
                                        <p className="text-slate-500 font-medium italic">Please choose the specific {type} portal you wish to access</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Search size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={`Search ${type}s...`}
                                        className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 lg:p-12">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {list.map(item => (
                                    <motion.div key={item.id} variants={itemVariants}>
                                        <Link
                                            href={`/login?pub_id=${item.id}&type=${type}`}
                                            className="group block p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300 h-full relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors relative z-10">
                                                {item.name}
                                            </h3>
                                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600/0 group-hover:text-blue-600 transition-all translate-y-2 group-hover:translate-y-0 relative z-10">
                                                Access Portal
                                                <ChevronLeft size={14} className="rotate-180" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {list.length === 0 && (
                                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <Search size={28} />
                                    </div>
                                    <p className="text-slate-500 font-bold">No {type}s currently available.</p>
                                    <p className="text-slate-400 text-sm mt-1">Please contact the administrator for assistance.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="mt-12 text-center text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} Sabaragamuwa University of Sri Lanka
                    </p>
                </div>
            </main>
        </div>
    );
}
