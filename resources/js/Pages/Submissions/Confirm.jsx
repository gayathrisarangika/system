import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Send,
    ArrowLeft,
    CheckSquare,
    Square,
    FileText,
    User,
    CheckCircle2,
    ShieldCheck,
    Building2,
    Mail
} from 'lucide-react';
import { u, cn } from '@/lib/utils';

export default function SubmissionsConfirm({ journal, paper, auth }) {
    const [agreed, setAgreed] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: paper.title,
        abstract: paper.abstract,
        keywords: paper.keywords,
        authors: paper.authors,
        agreement: false,
    });

    const handleToggleAgreement = () => {
        const nextVal = !agreed;
        setAgreed(nextVal);
        setData('agreement', nextVal);
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        if (!agreed) return;

        post(u(`/submit-paper/journal/${journal.id}`));
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Head title={`Confirm Submission - ${journal.journal_title}`} />

            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 py-4 px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href={u(`/submit-paper/journal/${journal.id}`)} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors">
                        <ArrowLeft size={18} />
                        Back to Edit Details
                    </Link>
                    <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                        Step 2: Confirmation
                    </span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-12 space-y-10">

                    {/* Header */}
                    <div className="border-b border-slate-100 pb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                            <ShieldCheck size={14} />
                            Submission Review
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                            Review Paper Details
                        </h1>
                        <p className="text-sm font-semibold text-slate-500">
                            Target Journal: <strong className="text-slate-800">{journal.journal_title}</strong>
                        </p>
                    </div>

                    {/* Paper Summary Card */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
                                    Paper Title
                                </span>
                                <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                                    {paper.title}
                                </h2>
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
                                    Abstract
                                </span>
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                    {paper.abstract}
                                </p>
                            </div>

                            {paper.keywords && (
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
                                        Keywords
                                    </span>
                                    <p className="text-xs font-semibold text-blue-700 bg-blue-50 inline-block px-3 py-1 rounded-lg">
                                        {paper.keywords}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Authors List */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Author(s) List
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {paper.authors.map((author, index) => (
                                    <div key={index} className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900">{author.full_name}</span>
                                            {author.is_corresponding && (
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                                                    Corresponding Author
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <Mail size={12} /> {author.email}
                                        </p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <Building2 size={12} /> {author.affiliation} {author.designation ? `(${author.designation})` : ''}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Uploaded Files */}
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Uploaded Documents
                            </h3>
                            <div className="space-y-2">
                                {Object.entries(paper.file_details).map(([docType, file]) => (
                                    <div key={docType} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold">
                                        <span className="capitalize text-slate-800 font-bold">{docType.replace('_', ' ')}</span>
                                        <span className="text-slate-500">{file.original_filename} ({file.size_mb} MB)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Checkbox Agreement & Submit */}
                    <form onSubmit={handleFinalSubmit} className="pt-6 border-t border-slate-100 space-y-6">
                        <div
                            onClick={handleToggleAgreement}
                            className={cn(
                                "p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3",
                                agreed ? "bg-blue-50/50 border-blue-300" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                            )}
                        >
                            <div className="mt-0.5 text-blue-600">
                                {agreed ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-400" />}
                            </div>
                            <p className="text-xs font-semibold text-slate-700 leading-relaxed select-none">
                                I confirm that the information provided is accurate and that I agree to the journal's submission requirements, publication ethics, and editorial policies.
                            </p>
                        </div>
                        {errors.agreement && <p className="text-red-500 text-xs font-semibold">{errors.agreement}</p>}

                        <div className="flex items-center justify-between pt-4">
                            <Link
                                href={u(`/submit-paper/journal/${journal.id}`)}
                                className="px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                            >
                                Edit Paper Information
                            </Link>

                            <button
                                type="submit"
                                disabled={!agreed || processing}
                                className={cn(
                                    "px-8 py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 transition-all",
                                    agreed && !processing
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
                                        : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                                )}
                            >
                                <Send size={16} />
                                Submit Paper
                            </button>
                        </div>
                    </form>

                </div>
            </main>
        </div>
    );
}
