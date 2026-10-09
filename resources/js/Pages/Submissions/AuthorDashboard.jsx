import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    FileText,
    ChevronRight,
    ArrowLeft,
    Calendar,
    Hash,
    Plus,
    ExternalLink
} from 'lucide-react';
import { u, cn } from '@/lib/utils';

export default function AuthorDashboard({ submissions = [], auth = {} }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title="My Submissions | Author Dashboard" />

            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href={u('/')} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            P
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-extrabold text-slate-900 leading-none">PMS</span>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Author Portal</span>
                        </div>
                    </Link>

                    <Link
                        href={u('/submit-paper')}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                        <Plus size={15} />
                        New Submission
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                            Author Dashboard
                        </span>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            My Paper Submissions
                        </h1>
                    </div>
                </div>

                {submissions.length > 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                                        <th className="py-4 px-6">Paper ID</th>
                                        <th className="py-4 px-6">Journal</th>
                                        <th className="py-4 px-6">Paper Title</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6">Submitted Date</th>
                                        <th className="py-4 px-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                                    {submissions.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-4 px-6 font-mono font-bold text-blue-700">
                                                {item.paper_id}
                                            </td>
                                            <td className="py-4 px-6 font-bold text-slate-900 max-w-[200px] truncate">
                                                {item.journal ? item.journal.journal_title : 'Journal'}
                                            </td>
                                            <td className="py-4 px-6 max-w-xs truncate">
                                                {item.title}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-xs text-slate-500">
                                                {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Link
                                                    href={u(`/author/submission/${item.id}`)}
                                                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition-all"
                                                >
                                                    View Details
                                                    <ChevronRight size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No Submissions Found</h3>
                        <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto">
                            You have not submitted any academic papers yet.
                        </p>
                        <Link
                            href={u('/submit-paper')}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20"
                        >
                            Submit Your First Paper
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
