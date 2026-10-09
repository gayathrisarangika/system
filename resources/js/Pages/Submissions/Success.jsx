import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    CheckCircle, 
    BookOpen, 
    ArrowRight, 
    Calendar, 
    FileText, 
    Hash, 
    Building2 
} from 'lucide-react';
import { u } from '@/lib/utils';

export default function SubmissionsSuccess({ submission, auth }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-center py-16 px-6">
            <Head title="Submission Successful | Academic Publications" />

            <div className="max-w-2xl mx-auto w-full bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 p-8 sm:p-12 text-center space-y-8">
                
                {/* Checkmark Icon */}
                <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 shadow-lg shadow-emerald-500/10 animate-bounce">
                    <CheckCircle size={44} />
                </div>

                <div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        Submission Successful
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-4">
                        Thank You For Your Submission!
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">
                        Your manuscript has been safely received and queued for initial editorial review.
                    </p>
                </div>

                {/* Submission Details Card */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Hash size={14} className="text-blue-600" />
                            Paper ID
                        </span>
                        <span className="font-mono font-black text-lg text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                            {submission.paper_id}
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Building2 size={14} className="text-blue-600" />
                            Journal
                        </span>
                        <span className="text-xs font-bold text-slate-800 text-right">
                            {submission.journal_title}
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <FileText size={14} className="text-blue-600" />
                            Title
                        </span>
                        <span className="text-xs font-semibold text-slate-700 text-right max-w-xs truncate">
                            {submission.title}
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Calendar size={14} className="text-blue-600" />
                            Submission Date
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                            {submission.submitted_at}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Current Status
                        </span>
                        <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md">
                            {submission.status}
                        </span>
                    </div>
                </div>

                {/* Notification Banner */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 font-medium leading-relaxed">
                    A confirmation email with these details has been sent to the corresponding author's email address.
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={u('/author/submissions')}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
                    >
                        <BookOpen size={16} />
                        View My Submissions
                    </Link>

                    <Link
                        href={u('/')}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-2 transition-all"
                    >
                        Return to Main Hub
                        <ArrowRight size={16} />
                    </Link>
                </div>

            </div>
        </div>
    );
}
