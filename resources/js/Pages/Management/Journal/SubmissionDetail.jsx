import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import BackendLayout from '@/Layouts/BackendLayout';
import { 
    ArrowLeft, 
    Download, 
    FileText, 
    User, 
    Clock, 
    Building2, 
    Mail, 
    Send, 
    Save, 
    Hash, 
    CheckCircle2 
} from 'lucide-react';
import { u, cn } from '@/lib/utils';

export default function SubmissionDetail({ submission, statusOptions }) {
    const { data, setData, post, processing, errors } = useForm({
        status: submission.status,
        note: '',
    });

    const handleStatusSubmit = (e) => {
        e.preventDefault();
        post(u(`/editor/submission/${submission.id}/status`));
    };

    return (
        <BackendLayout title={`Submission ${submission.paper_id}`}>
            <Head title={`Paper ${submission.paper_id} Details`} />

            <div className="space-y-8">
                
                {/* Back link */}
                <div>
                    <Link
                        href={u(`/editor/journal/${submission.journal_id}/submissions`)}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Journal Submissions
                    </Link>
                </div>

                {/* Paper Summary Card */}
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

                        <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-sm text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-100">
                                {submission.paper_id}
                            </span>
                            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 uppercase tracking-wider">
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

                {/* Status Update Control */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                        <Send size={18} className="text-blue-600" />
                        Update Submission Status
                    </h2>

                    <form onSubmit={handleStatusSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    New Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 focus:border-blue-500"
                                >
                                    {statusOptions.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    Audit / Decision Note (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Add reason or note for status change..."
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm"
                                />
                                {errors.note && <p className="text-red-500 text-xs mt-1">{errors.note}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
                            >
                                <Save size={15} />
                                Save Status Change
                            </button>
                        </div>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Author Information */}
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

                    {/* Submitted Documents */}
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
                                        href={u(`/editor/submission/${submission.id}/file/${file.id}`)}
                                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
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
                        Audit Trail & History Log
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
                                {history.user && (
                                    <p className="text-xs text-slate-500">
                                        By: <strong>{history.user.name || history.user.username}</strong>
                                    </p>
                                )}
                                {history.note && (
                                    <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        {history.note}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </BackendLayout>
    );
}
