import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Send, 
    ArrowLeft, 
    Plus, 
    Trash2, 
    Upload, 
    FileText, 
    User, 
    Building2, 
    Mail, 
    CheckCircle2, 
    Sparkles, 
    Info 
} from 'lucide-react';
import { u, cn } from '@/lib/utils';

export default function SubmissionsCreate({ journal = {}, draft = null, auth = {} }) {
    const defaultAuthor = {
        full_name: '',
        email: '',
        affiliation: '',
        designation: '',
        is_corresponding: true,
        order: 1,
    };

    const initialAuthors = draft?.authors && Array.isArray(draft.authors) && draft.authors.length > 0
        ? draft.authors
        : [defaultAuthor];

    const { data, setData, post, processing, errors } = useForm({
        title: draft?.title || '',
        abstract: draft?.abstract || '',
        keywords: draft?.keywords || '',
        authors: initialAuthors,
        files: {},
    });

    const handleAuthorChange = (index, field, value) => {
        const updated = [...data.authors];
        updated[index] = { ...updated[index], [field]: value };
        setData('authors', updated);
    };

    const handleCorrespondingChange = (index) => {
        const updated = data.authors.map((author, i) => ({
            ...author,
            is_corresponding: i === index,
        }));
        setData('authors', updated);
    };

    const handleAddAuthor = () => {
        const newAuthor = {
            full_name: '',
            email: '',
            affiliation: '',
            designation: '',
            is_corresponding: false,
            order: data.authors.length + 1,
        };
        setData('authors', [...data.authors, newAuthor]);
    };

    const handleRemoveAuthor = (index) => {
        if (data.authors.length <= 1) return;
        const filtered = data.authors.filter((_, i) => i !== index);
        const hasCorresponding = filtered.some((a) => a.is_corresponding);
        const updated = filtered.map((author, i) => ({
            ...author,
            is_corresponding: hasCorresponding ? author.is_corresponding : i === 0,
            order: i + 1,
        }));
        setData('authors', updated);
    };

    const handleFileChange = (docType, file) => {
        setData('files', {
            ...data.files,
            [docType]: file,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(u(`/submit-paper/journal/${journal.id}/confirm`), {
            forceFormData: true,
        });
    };

    const getFieldError = (key) => {
        return errors[key] || null;
    };

    const existingFiles = draft?.file_details || {};

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title={`Submit Paper - ${journal.journal_title || 'Journal'}`} />

            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 py-4 px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link 
                        href={u('/submit-paper')} 
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Journals
                    </Link>
                    <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                        Step 1: Paper Details
                    </span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <form onSubmit={handleSubmit} className="space-y-10">
                    
                    {/* Header Banner */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                            <Sparkles size={14} />
                            Manuscript Submission
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                            Add Paper Details
                        </h1>
                        <p className="text-sm font-semibold text-slate-500">
                            Submitting to: <strong className="text-slate-800">{journal.journal_title}</strong> {journal.issn && `(ISSN: ${journal.issn})`}
                        </p>
                    </div>

                    {/* Section 1: Paper Information */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-12 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">1. Article Information</h2>
                                <p className="text-xs text-slate-500 font-medium">Provide title, abstract, and keywords for your research paper</p>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">
                                Paper Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Enter full title of the paper"
                                className={cn(
                                    "w-full px-4 py-3 rounded-2xl border text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-blue-500/20",
                                    getFieldError('title') ? "border-red-300 bg-red-50/30" : "border-slate-200 focus:border-blue-500"
                                )}
                            />
                            {getFieldError('title') && (
                                <p className="text-red-500 text-xs font-semibold mt-1.5">{getFieldError('title')}</p>
                            )}
                        </div>

                        {/* Abstract */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">
                                Abstract <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={6}
                                value={data.abstract}
                                onChange={(e) => setData('abstract', e.target.value)}
                                placeholder="Enter abstract (max 5000 characters)"
                                className={cn(
                                    "w-full px-4 py-3 rounded-2xl border text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed",
                                    getFieldError('abstract') ? "border-red-300 bg-red-50/30" : "border-slate-200 focus:border-blue-500"
                                )}
                            />
                            {getFieldError('abstract') && (
                                <p className="text-red-500 text-xs font-semibold mt-1.5">{getFieldError('abstract')}</p>
                            )}
                        </div>

                        {/* Keywords */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">
                                Keywords
                            </label>
                            <input
                                type="text"
                                value={data.keywords}
                                onChange={(e) => setData('keywords', e.target.value)}
                                placeholder="e.g. Machine Learning, Data Mining, Neural Networks (comma separated)"
                                className={cn(
                                    "w-full px-4 py-3 rounded-2xl border text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-blue-500/20",
                                    getFieldError('keywords') ? "border-red-300 bg-red-50/30" : "border-slate-200 focus:border-blue-500"
                                )}
                            />
                            {getFieldError('keywords') && (
                                <p className="text-red-500 text-xs font-semibold mt-1.5">{getFieldError('keywords')}</p>
                            )}
                        </div>
                    </div>

                    {/* Section 2: Authors List */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-12 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">2. Author Details</h2>
                                    <p className="text-xs text-slate-500 font-medium">Add all contributing authors and designate one as corresponding author</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddAuthor}
                                className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                                <Plus size={15} />
                                Add Author
                            </button>
                        </div>

                        {getFieldError('authors') && (
                            <p className="text-red-500 text-xs font-semibold">{getFieldError('authors')}</p>
                        )}

                        <div className="space-y-6">
                            {data.authors.map((author, index) => (
                                <div 
                                    key={index}
                                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 relative"
                                >
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                                        <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                                            Author #{index + 1}
                                        </span>

                                        <div className="flex items-center gap-3">
                                            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                                                <input
                                                    type="radio"
                                                    name="corresponding_author"
                                                    checked={author.is_corresponding}
                                                    onChange={() => handleCorrespondingChange(index)}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                Corresponding Author
                                            </label>

                                            {data.authors.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAuthor(index)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove Author"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={author.full_name}
                                                onChange={(e) => handleAuthorChange(index, 'full_name', e.target.value)}
                                                placeholder="e.g. Dr. John Doe"
                                                className={cn(
                                                    "w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all",
                                                    getFieldError(`authors.${index}.full_name`) ? "border-red-300 bg-red-50/30" : "border-slate-200 focus:border-blue-500"
                                                )}
                                            />
                                            {getFieldError(`authors.${index}.full_name`) && (
                                                <p className="text-red-500 text-[11px] font-semibold mt-1">
                                                    {getFieldError(`authors.${index}.full_name`)}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={author.email}
                                                onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                                                placeholder="john.doe@university.edu"
                                                className={cn(
                                                    "w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all",
                                                    getFieldError(`authors.${index}.email`) ? "border-red-300 bg-red-50/30" : "border-slate-200 focus:border-blue-500"
                                                )}
                                            />
                                            {getFieldError(`authors.${index}.email`) && (
                                                <p className="text-red-500 text-[11px] font-semibold mt-1">
                                                    {getFieldError(`authors.${index}.email`)}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1">
                                                Affiliation / University <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={author.affiliation}
                                                onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
                                                placeholder="Sabaragamuwa University of Sri Lanka"
                                                className={cn(
                                                    "w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all",
                                                    getFieldError(`authors.${index}.affiliation`) ? "border-red-300 bg-red-50/30" : "border-slate-200 focus:border-blue-500"
                                                )}
                                            />
                                            {getFieldError(`authors.${index}.affiliation`) && (
                                                <p className="text-red-500 text-[11px] font-semibold mt-1">
                                                    {getFieldError(`authors.${index}.affiliation`)}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1">
                                                Designation
                                            </label>
                                            <input
                                                type="text"
                                                value={author.designation || ''}
                                                onChange={(e) => handleAuthorChange(index, 'designation', e.target.value)}
                                                placeholder="Senior Lecturer / Research Scholar"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Document Requirements */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-12 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                <Upload size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">3. Document Uploads</h2>
                                <p className="text-xs text-slate-500 font-medium">Upload required paper files according to journal guidelines</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {(journal.document_requirements || []).map((req) => {
                                const fieldKey = `files.${req.document_type}`;
                                const fileErr = getFieldError(fieldKey) || getFieldError(`files`);
                                const existing = existingFiles[req.document_type];

                                return (
                                    <div 
                                        key={req.id || req.document_type}
                                        className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-sm text-slate-900">
                                                        {req.display_name}
                                                    </span>
                                                    {req.is_required ? (
                                                        <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase">
                                                            Required
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full uppercase">
                                                            Optional
                                                        </span>
                                                    )}
                                                </div>

                                                {req.description && (
                                                    <p className="text-xs text-slate-500 font-medium mt-1">
                                                        {req.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                                                Formats: {req.allowed_mimes || 'pdf, doc, docx'} (Max {req.max_size_mb || 10} MB)
                                            </div>
                                        </div>

                                        {existing && (
                                            <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs font-semibold text-blue-900">
                                                <CheckCircle2 size={15} className="text-blue-600 flex-shrink-0" />
                                                <span>Uploaded: <strong>{existing.original_filename}</strong> ({existing.size_mb} MB)</span>
                                                <span className="text-slate-500 text-[11px] ml-auto">(Uploading a new file will replace it)</span>
                                            </div>
                                        )}

                                        <div>
                                            <input
                                                type="file"
                                                accept={req.allowed_mimes ? req.allowed_mimes.split(',').map(m => `.${m.trim()}`).join(',') : '.pdf,.doc,.docx'}
                                                onChange={(e) => handleFileChange(req.document_type, e.target.files[0] || null)}
                                                className={cn(
                                                    "w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer border rounded-2xl bg-white p-2 transition-all",
                                                    fileErr ? "border-red-300" : "border-slate-200"
                                                )}
                                            />
                                            {fileErr && (
                                                <p className="text-red-500 text-xs font-semibold mt-1.5">{fileErr}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className={cn(
                                "px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:gap-3",
                                processing && "opacity-70 cursor-not-allowed"
                            )}
                        >
                            <Send size={16} />
                            Proceed to Review & Confirm
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
