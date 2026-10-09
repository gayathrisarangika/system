import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Send,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    BookOpen,
    Sparkles,
    Lock,
    GraduationCap,
    Globe
} from 'lucide-react';
import { u, cn } from '@/lib/utils';

export default function SubmissionsIndex({ journals = [], auth = {} }) {
    const user = auth.user;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title="Paper Submissions | Academic Publications" />

            {/* Background Decorative Element */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]"></div>
            </div>

            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href={u('/')} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            P
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-extrabold text-slate-900 leading-none">PMS</span>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Academic Hub</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link
                                href={u('/author/submissions')}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md hover:bg-slate-800 transition-all flex items-center gap-2"
                            >
                                <BookOpen size={16} />
                                My Submissions
                            </Link>
                        ) : (
                            <Link
                                href={u('/login')}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all"
                            >
                                Author Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
                        <Sparkles size={14} />
                        <span>Central Paper Submission System</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6">
                        Submit Your Research Paper
                    </h1>

                    <p className="text-lg text-slate-600 leading-relaxed">
                        Select an open journal below to initiate your online manuscript submission. Submissions are peer-reviewed according to standard academic guidelines.
                    </p>
                </div>

                {/* Journal Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {journals.map((journal) => {
                        const isOpen = journal.is_open;

                        return (
                            <motion.div
                                key={journal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className={cn(
                                    "relative flex flex-col justify-between rounded-3xl border transition-all duration-300 overflow-hidden",
                                    isOpen
                                        ? "bg-white border-slate-200/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1"
                                        : "bg-slate-100/80 border-slate-200/60 grayscale-[0.5] opacity-80"
                                )}
                            >
                                {/* Top Badge */}
                                <div className="p-6 pb-0 flex items-center justify-between">
                                    <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                                        [{journal.code}]
                                    </span>

                                    {isOpen ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold">
                                            <CheckCircle2 size={13} className="text-emerald-600" />
                                            Submission Open
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold">
                                            <XCircle size={13} className="text-slate-500" />
                                            Submission Closed
                                        </span>
                                    )}
                                </div>

                                {/* Journal Information */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        {/* Optional Logo / Cover image preview */}
                                        {journal.cover_image_url && (
                                            <div className="w-16 h-20 rounded-lg overflow-hidden mb-4 shadow-sm border border-slate-200">
                                                <img src={journal.cover_image_url} alt={journal.journal_title} className="w-full h-full object-cover" />
                                            </div>
                                        )}

                                        <h3 className={cn("text-xl font-black leading-snug mb-2", isOpen ? "text-slate-900" : "text-slate-700")}>
                                            {journal.journal_title}
                                        </h3>

                                        <p className="text-xs font-semibold text-slate-500 mb-6">
                                            {journal.university_name}
                                        </p>
                                    </div>

                                    {/* Dates Info */}
                                    <div className="space-y-2 py-4 border-t border-slate-100 text-xs">
                                        <div className="flex items-center justify-between text-slate-600 font-medium">
                                            <span className="flex items-center gap-1.5 text-slate-500">
                                                <Calendar size={13} />
                                                Opening Date:
                                            </span>
                                            <span className="font-semibold">{journal.opening_datetime || 'N/A'}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-slate-600 font-medium">
                                            <span className="flex items-center gap-1.5 text-slate-500">
                                                <Clock size={13} />
                                                Closing Date:
                                            </span>
                                            <span className="font-semibold">{journal.closing_datetime || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Action */}
                                <div className="p-6 pt-0">
                                    {isOpen ? (
                                        <Link
                                            href={u(`/submit-paper/journal/${journal.id}`)}
                                            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:gap-3"
                                        >
                                            <Send size={16} />
                                            Submit Paper
                                            <ArrowRight size={16} />
                                        </Link>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full py-3.5 px-6 rounded-2xl bg-slate-300 text-slate-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Lock size={15} />
                                            Submission Closed
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {journals.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <p className="text-slate-500 font-bold">No approved journals available for submission.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
