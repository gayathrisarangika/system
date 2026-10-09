import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import BackendLayout from '@/Layouts/BackendLayout';
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    Settings,
    Calendar,
    Clock,
    FileText,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { u, cn } from '@/lib/utils';

export default function SubmissionSettings({ journal, setting, documentRequirements = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        code: setting.code || 'JRN',
        is_open: setting.is_open,
        opening_datetime: setting.opening_datetime || '',
        closing_datetime: setting.closing_datetime || '',
        requirements: documentRequirements.map(req => ({
            id: req.id,
            document_type: req.document_type,
            label: req.label,
            is_required: Boolean(req.is_required),
            allowed_mimes: req.allowed_mimes,
            max_size_mb: req.max_size_mb,
        })),
    });

    const handleAddRequirement = () => {
        setData('requirements', [
            ...data.requirements,
            {
                id: null,
                document_type: 'supplementary_' + Date.now(),
                label: 'New Document',
                is_required: false,
                allowed_mimes: 'pdf,doc,docx',
                max_size_mb: 10,
            }
        ]);
    };

    const handleRemoveRequirement = (index) => {
        const updated = data.requirements.filter((_, i) => i !== index);
        setData('requirements', updated);
    };

    const handleRequirementChange = (index, field, value) => {
        const updated = [...data.requirements];
        updated[index][field] = value;
        setData('requirements', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(u(`/editor/journal/${journal.id}/submission-settings`));
    };

    return (
        <BackendLayout title={`Submission Settings - ${journal.journal_title}`}>
            <Head title={`Submission Settings | ${journal.journal_title}`} />

            <div className="space-y-8 max-w-4xl">

                {/* Back Link */}
                <div>
                    <Link
                        href={u(`/editor/journal/${journal.id}/submissions`)}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Journal Submissions
                    </Link>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10 space-y-8">

                    {/* Header */}
                    <div className="border-b border-slate-100 pb-6">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
                            <Settings size={16} />
                            <span>Journal Configuration</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Submission Period & Requirements
                        </h1>
                        <p className="text-sm font-semibold text-slate-500 mt-1">
                            {journal.journal_title}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* Section 1: Submission Control & Period */}
                        <div className="space-y-6">
                            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                                1. Manual Toggle & Journal Code
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Paper ID Journal Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={10}
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder="e.g. ECO, SOC, LAN"
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-mono font-bold uppercase focus:border-blue-500"
                                        required
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        Used as Paper ID prefix: <strong>{data.code || 'CODE'}-2026-0001</strong>
                                    </p>
                                    {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Manual Submission Status
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_open', !data.is_open)}
                                        className={cn(
                                            "w-full py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-between border transition-all",
                                            data.is_open
                                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                                : "bg-slate-100 text-slate-600 border-slate-300"
                                        )}
                                    >
                                        <span>{data.is_open ? 'Submissions Allowed (Open)' : 'Submissions Disabled (Closed)'}</span>
                                        {data.is_open ? <ToggleRight size={28} className="text-emerald-600" /> : <ToggleLeft size={28} className="text-slate-400" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Opening Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.opening_datetime}
                                        onChange={(e) => setData('opening_datetime', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-medium"
                                    />
                                    {errors.opening_datetime && <p className="text-red-500 text-xs mt-1">{errors.opening_datetime}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Closing Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.closing_datetime}
                                        onChange={(e) => setData('closing_datetime', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-medium"
                                    />
                                    {errors.closing_datetime && <p className="text-red-500 text-xs mt-1">{errors.closing_datetime}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Required Documents Configuration */}
                        <div className="space-y-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                                    2. Document Submission Requirements
                                </h2>

                                <button
                                    type="button"
                                    onClick={handleAddRequirement}
                                    className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                                >
                                    <Plus size={15} />
                                    Add Document Requirement
                                </button>
                            </div>

                            <div className="space-y-4">
                                {data.requirements.map((req, index) => (
                                    <div key={index} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase text-slate-500">
                                                Document #{index + 1}
                                            </span>

                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={req.is_required}
                                                        onChange={(e) => handleRequirementChange(index, 'is_required', e.target.checked)}
                                                        className="rounded text-blue-600 focus:ring-blue-500"
                                                    />
                                                    Is Required
                                                </label>

                                                {data.requirements.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveRequirement(index)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                                                    Document Label
                                                </label>
                                                <input
                                                    type="text"
                                                    value={req.label}
                                                    onChange={(e) => handleRequirementChange(index, 'label', e.target.value)}
                                                    placeholder="e.g. Main Manuscript"
                                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                                                    Allowed Extensions
                                                </label>
                                                <input
                                                    type="text"
                                                    value={req.allowed_mimes}
                                                    onChange={(e) => handleRequirementChange(index, 'allowed_mimes', e.target.value)}
                                                    placeholder="e.g. pdf,doc,docx"
                                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                                                    Max File Size (MB)
                                                </label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={100}
                                                    value={req.max_size_mb}
                                                    onChange={(e) => handleRequirementChange(index, 'max_size_mb', parseInt(e.target.value) || 10)}
                                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
                            >
                                <Save size={16} />
                                Save Submission Settings
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </BackendLayout>
    );
}
