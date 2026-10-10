import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Send, 
    Plus, 
    Trash2, 
    Upload, 
    FileText, 
    CheckCircle, 
    ArrowLeft, 
    AlertCircle, 
    User, 
    Mail, 
    Building2, 
    Star 
} from 'lucide-react';
import { u, cn } from '@/lib/utils';

export default function SubmissionsCreate({ journal, auth, draft }) {
    const user = auth.user;

    const { data, setData, post, processing, errors } = useForm({
        title: draft?.title || '',
        abstract: draft?.abstract || '',
        keywords: draft?.keywords || '',
        authors: draft?.authors || [
            {
                full_name: user ? user.name || '' : '',
                email: user ? user.email || '' : '',
                affiliation: '',
                designation: '',
                is_corresponding: true,
                order: 1,
            }
        ],
        files: {},
    });

    const handleAddAuthor = () => {
        setData('authors', [
            ...data.authors,
            {
                full_name: '',
                email: '',
                affiliation: '',
                designation: '',
                is_corresponding: false,
                order: data.authors.length + 1,
            }
        ]);
    };

    const handleRemoveAuthor = (index) => {
        if (data.authors.length === 1) return;
        const updated = data.authors.filter((_, i) => i !== index).map((author, i) => ({
            ...author,
            order: i + 1,
            is_corresponding: index === 0 && author.is_corresponding ? false : author.is_corresponding
        }));

        // Ensure at least one corresponding
        if (!updated.some(a => a.is_corresponding)) {
            updated[0].is_corresponding = true;
        }

        setData('authors', updated);
    };

    const handleAuthorChange = (index, field, value) => {
        const updated = [...data.authors];
        if (field === 'is_corresponding') {
            updated.forEach((a, i) => {
                a.is_corresponding = i === index;
            });
        } else {
            updated[index][field] = value;
        }
        setData('authors', updated);
    };

    const handleFileChange = (documentType, file) => {
        setData('files', {
            ...data.files,
            [documentType]: file,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(u(`/submit-paper/journal/${journal.id}/confirm`));
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Head title={`Paper Submission - ${journal.journal_title}`} />

            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 py-4 px-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href={u('/submit-paper')} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors">
                        <ArrowLeft size={18} />
                        Back to Journal Selection
                    </Link>
                    <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                        Journal: {journal.code}
                    </span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-12">
                    
                    {/* Header */}
                    <div className="border-b border-slate-100 pb-8 mb-8">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 block">
                            Manuscript Submission Form
                        </span>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                            {journal.journal_title}
                        </h1>
                        <p className="text-sm font-semibold text-slate-500">
                            {journal.university_name}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        
                        {/* Section 1: Paper Details */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="text-blue-600" size={20} />
                                1. Paper Details
                            </h2>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    Paper Title <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter full paper title..."
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900 text-sm font-medium transition-all"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    Abstract <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={5}
                                    value={data.abstract}
                                    onChange={(e) => setData('abstract', e.target.value)}
                                    placeholder="Provide structured abstract (maximum 500 words)..."
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900 text-sm transition-all"
                                    required
                                />
                                {errors.abstract && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.abstract}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    Keywords
                                </label>
                                <input
                                    type="text"
                                    value={data.keywords}
                                    onChange={(e) => setData('keywords', e.target.value)}
                                    placeholder="e.g. Artificial Intelligence, Machine Learning, Social Analytics"
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900 text-sm font-medium transition-all"
                                />
                                {errors.keywords && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.keywords}</p>}
                            </div>
                        </div>

                        {/* Section 2: Authors */}
                        <div className="space-y-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <User className="text-blue-600" size={20} />
                                    2. Author Details
                                </h2>
                                <button
                                    type="button"
                                    onClick={handleAddAuthor}
                                    className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                                >
                                    <Plus size={15} />
                                    Add Another Author
                                </button>
                            </div>

                            <div className="space-y-4">
                                {data.authors.map((author, index) => (
                                    <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase text-slate-500">
                                                Author #{index + 1}
                                            </span>
                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="corresponding_author"
                                                        checked={author.is_corresponding}
                                                        onChange={() => handleAuthorChange(index, 'is_corresponding', true)}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    Corresponding Author
                                                </label>

                                                {data.authors.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAuthor(index)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Full Name *"
                                                    value={author.full_name}
                                                    onChange={(e) => handleAuthorChange(index, 'full_name', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="email"
                                                    placeholder="Email Address *"
                                                    value={author.email}
                                                    onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Affiliation / University *"
                                                    value={author.affiliation}
                                                    onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Designation (Optional)"
                                                    value={author.designation}
                                                    onChange={(e) => handleAuthorChange(index, 'designation', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: File Uploads */}
                        <div className="space-y-6 pt-6 border-t border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Upload className="text-blue-600" size={20} />
                                3. Document Uploads
                            </h2>

                            <div className="space-y-4">
                                {journal.document_requirements.map((req) => {
                                    const file = data.files[req.document_type];
                                    const existingFile = draft?.file_details?.[req.document_type];

                                    return (
                                        <div key={req.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-900">{req.label}</span>
                                                    {req.is_required ? (
                                                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">Required</span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">Optional</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Allowed formats: {req.allowed_mimes} (Max: {req.max_size_mb}MB)
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <label className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-blue-500 font-bold text-xs text-slate-700 cursor-pointer shadow-sm transition-all flex items-center gap-2">
                                                    <Upload size={14} />
                                                    {file || existingFile ? 'Change File' : 'Choose File'}
                                                    <input
                                                        type="file"
                                                        accept={req.allowed_mimes.split(',').map(m => `.${m.trim()}`).join(',')}
                                                        onChange={(e) => handleFileChange(req.document_type, e.target.files[0])}
                                                        className="hidden"
                                                        required={req.is_required && !file && !existingFile}
                                                    />
                                                </label>

                                                {file ? (
                                                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                                        <CheckCircle size={14} />
                                                        {file.name}
                                                    </span>
                                                ) : existingFile ? (
                                                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                                                        <CheckCircle size={14} />
                                                        {existingFile.original_filename} (Uploaded)
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
                            >
                                Continue to Confirmation
                                <Send size={16} />
                            </button>
                        </div>
                    </form>

                </div>
            </main>
        </div>
    );
}
