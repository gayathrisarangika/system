import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Plus,
    Globe,
    Edit3,
    BookOpen,
    Users,
    ChevronRight,
    Search,
    LayoutGrid,
    CheckCircle2,
    Clock,
    XCircle
} from 'lucide-react';
import BackendLayout from '@/Layouts/BackendLayout';
import { cn } from '@/lib/utils';

export default function List({ symposiums }) {
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
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <BackendLayout title="Manage Symposiums">
            <Head title="Manage Symposiums" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-8"
            >
                {/* Header Section */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-slate-200/60 gap-6"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                            <LayoutGrid size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Symposiums</h1>
                            <p className="text-slate-500 font-medium">Coordinate and present your symposium research collections.</p>
                        </div>
                    </div>
                    <Link
                        href="/editor/symposium/create"
                        className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                    >
                        <span>Add Symposium</span>
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    </Link>
                </motion.div>

                {/* Table Section */}
                <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-5 font-black text-slate-500 uppercase text-[10px] tracking-[0.2em]">Symposium Details</th>
                                    <th className="px-8 py-5 font-black text-slate-500 uppercase text-[10px] tracking-[0.2em]">Approval Status</th>
                                    <th className="px-8 py-5 font-black text-slate-500 uppercase text-[10px] tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {symposiums.length > 0 ? symposiums.map(symp => (
                                    <tr key={symp.id} className="hover:bg-purple-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                                    {symp.symposium_title.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 group-hover:text-purple-700 transition-colors">{symp.symposium_title}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded w-fit group-hover:bg-purple-50 transition-colors">
                                                        Ref ID: #{symp.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {symp.status === 'approved' ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-wider">
                                                        <CheckCircle2 size={12} /> Approved
                                                    </div>
                                                ) : symp.status === 'rejected' ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-100 text-[10px] font-black uppercase tracking-wider">
                                                        <XCircle size={12} /> Rejected
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-wider">
                                                        <Clock size={12} className="animate-pulse" /> Pending
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-2">
                                                {[
                                                    { href: `/symposium/${symp.id}`, icon: Globe, label: 'Public Site', color: 'hover:text-blue-600' },
                                                    { href: `/editor/symposium/${symp.id}/edit`, icon: Edit3, label: 'Edit Info', color: 'hover:text-indigo-600' },
                                                    { href: `/editor/symposium/${symp.id}/abstract-books`, icon: BookOpen, label: 'Abstract Books', color: 'hover:text-emerald-600' },
                                                    { href: `/editor/symposium/${symp.id}/committee`, icon: Users, label: 'Committee', color: 'hover:text-purple-600' }
                                                ].map((action, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={action.href}
                                                        className={cn(
                                                            "p-2.5 bg-slate-50 text-slate-400 rounded-xl transition-all duration-300 border border-slate-100 flex items-center gap-2 font-bold text-xs hover:bg-white hover:shadow-lg hover:shadow-slate-200/50",
                                                            action.color
                                                        )}
                                                        title={action.label}
                                                    >
                                                        <action.icon size={16} />
                                                        <span className="hidden xl:inline">{action.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                                    <Search size={32} />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-slate-900">No symposiums found</p>
                                                    <p className="text-slate-500 font-medium">Start by adding your first symposium publication.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </BackendLayout>
    );
}
