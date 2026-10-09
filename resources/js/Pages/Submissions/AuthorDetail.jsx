import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Download, 
    FileText, 
    User, 
    Clock, 
    Building2, 
    Mail, 
    CheckCircle2, 
    Hash, 
    Calendar 
} from 'lucide-react';
import { u, cn } from '@/lib/utils';

export default function AuthorDetail({ submission, auth }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title={`Submission ${submission.paper_id} | Author Portal`} />

            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 py-4 px-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href={u('/author/submissions')} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors">
                        <ArrowLeft size={18} />
                        Back to My Submissions
                    </Link>
                    <span className="font-mono font-black text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                        {submission.paper_id}
                    </span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
                
                {/* Header Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                                {submission.journal ? submission.journal.journal_title : 'Journal'}
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                {submission.title}
                            </h1>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="inline-block px-4 py-2 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200/80 uppercase tracking-wider">
                                {submission.status}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                            Abstract
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                            {submission.abstract}
                        </p>
                    </div>

                    {submission.keywords && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                Keywords
                            </h3>
                            <p className="text-xs font-semibold text-blue-700 bg-blue-50 inline-block px-3 py-1.5 rounded-lg border border-blue-100">
                                {submission.keywords}
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Authors List */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <User size={18} className="text-blue-600" />
                            Authors ({submission.authors ? submission.authors.length : 0})
                        </h2>

                        <div className="space-y-3">
                            {submission.authors && submission.authors.map((author) => (
                                <div key={author.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-900">{author.full_name}</span>
                                        {author.is_corresponding && (
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                                Corresponding Author
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                        <Mail size={12} /> {author.email}
                                    </p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                        <Building2 size={12} /> {author.affiliation} {author.designation ? `(${author.designation})` : ''}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submitted Files */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <FileText size={18} className="text-blue-600" />
                            Submitted Documents
                        </h2>

                        <div className="space-y-3">
                            {submission.files && submission.files.map((file) => (
                                <div key={file.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-bold uppercase text-slate-900 block mb-0.5">
                                            {file.document_type.replace('_', ' ')}
                                        </span>
                                        <span className="text-slate-500 font-medium truncate max-w-[180px] block">
                                            {file.original_filename}
                                        </span>
                                    </div>

                                    <a
                                        href={u(`/author/submission/${submission.id}/file/${file.id}`)}
                                        className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                                    >
                                        <Download size={13} />
                                        Download
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Audit & Status History */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Clock size={18} className="text-blue-600" />
                        Status & History Log
                    </h2>

                    <div className="space-y-4 border-l-2 border-slate-200 ml-3 pl-6 py-2">
                        {submission.status_histories && submission.status_histories.map((history) => (
                            <div key={history.id} className="relative space-y-1">
                                <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white"></div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-slate-900">{history.status}</span>
                                    <span className="text-xs font-semibold text-slate-400">
                                        {new Date(history.created_at).toLocaleString()}
                                    </span>
                                </div>
                                {history.note && (
                                    <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        {history.note}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}
