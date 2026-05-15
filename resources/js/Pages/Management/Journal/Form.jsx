import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Save,
    Image as ImageIcon,
    FileText,
    Info,
    Target,
    Rocket,
    Mail,
    Hash,
    Building2,
    ChevronLeft,
    Globe
} from 'lucide-react';
import BackendLayout from '@/Layouts/BackendLayout';
import { cn } from '@/lib/utils';

export default function Form({ journal = null, pre_filled_title = '' }) {
    const { data, setData, post, processing, errors } = useForm({
        journal_title: journal?.journal_title || pre_filled_title || '',
        university_name: journal?.university_name || 'Sabaragamuwa University of Sri Lanka',
        journal_details: journal?.journal_details || '',
        aim_scope: journal?.aim_scope || '',
        mission: journal?.mission || '',
        issn: journal?.issn || '',
        online_issn: journal?.online_issn || '',
        contact_us: journal?.contact_us || '',
        cover_image: null,
        university_logo: null,
        for_authors: null,
        for_reviewers: null,
        editorial_policies: null,
        _method: journal ? 'PUT' : 'POST'
    });

    const submit = (e) => {
        e.preventDefault();
        if (journal) {
            post(`/editor/journal/${journal.id}`, {
                forceFormData: true,
            });
        } else {
            post('/editor/journal', {
                forceFormData: true,
            });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const Section = ({ title, icon: Icon, children, description }) => (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                    {description && <p className="text-sm font-medium text-slate-500">{description}</p>}
                </div>
            </div>
            <div className="space-y-5">
                {children}
            </div>
        </div>
    );

    const InputGroup = ({ label, icon: Icon, children, error }) => (
        <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                {Icon && <Icon size={12} className="text-blue-500" />} {label}
            </label>
            {children}
            {error && <div className="text-rose-500 text-[10px] font-bold mt-1 ml-1 uppercase">{error}</div>}
        </div>
    );

    return (
        <BackendLayout title={journal ? 'Edit Journal' : 'Create Journal'}>
            <Head title={journal ? 'Edit Journal' : 'Create Journal'} />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-5xl mx-auto space-y-8 pb-20"
            >
                <div className="flex items-center justify-between">
                    <Link href="/editor/journal" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Journals
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Primary Info */}
                    <Section title="General Information" icon={Info} description="Basic details about the journal and affiliated institution.">
                        <InputGroup label="Journal Title" icon={FileText} error={errors.journal_title}>
                            <textarea
                                className={cn(
                                    "w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[80px]",
                                    pre_filled_title && !journal ? 'bg-slate-100 opacity-70 cursor-not-allowed' : ''
                                )}
                                placeholder="Enter the official title of the journal"
                                value={data.journal_title}
                                onChange={e => setData('journal_title', e.target.value)}
                                readOnly={!!(pre_filled_title && !journal)}
                            />
                            {pre_filled_title && !journal && <p className="text-[10px] font-bold text-blue-600 mt-2 ml-1 uppercase tracking-wider italic">Title pre-assigned by administration</p>}
                        </InputGroup>

                        <InputGroup label="Affiliated University" icon={Building2} error={errors.university_name}>
                            <input
                                className="w-full bg-slate-100 border-slate-200 rounded-xl p-3 text-sm font-bold opacity-70 cursor-not-allowed"
                                value={data.university_name}
                                readOnly
                            />
                        </InputGroup>

                        <div className="grid md:grid-cols-2 gap-6">
                            <InputGroup label="ISSN (Print)" icon={Hash} error={errors.issn}>
                                <input
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="XXXX-XXXX"
                                    value={data.issn}
                                    onChange={e => setData('issn', e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup label="Online ISSN" icon={Globe} error={errors.online_issn}>
                                <input
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="XXXX-XXXX"
                                    value={data.online_issn}
                                    onChange={e => setData('online_issn', e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </Section>

                    {/* Content Details */}
                    <Section title="Aims, Mission & Scope" icon={Target} description="Define the purpose and academic boundaries of the publication.">
                        <InputGroup label="Journal Overview / Details" error={errors.journal_details}>
                            <textarea
                                className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[120px]"
                                placeholder="Write a comprehensive overview of the journal..."
                                value={data.journal_details}
                                onChange={e => setData('journal_details', e.target.value)}
                            />
                        </InputGroup>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputGroup label="Aim & Scope" icon={Rocket} error={errors.aim_scope}>
                                <textarea
                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[150px]"
                                    placeholder="What are the primary goals?"
                                    value={data.aim_scope}
                                    onChange={e => setData('aim_scope', e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup label="Mission Statement" icon={Target} error={errors.mission}>
                                <textarea
                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[150px]"
                                    placeholder="Define the journal's mission..."
                                    value={data.mission}
                                    onChange={e => setData('mission', e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </Section>

                    {/* Branding Assets */}
                    <Section title="Branding & Assets" icon={ImageIcon} description="Upload visual elements that represent the journal.">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <InputGroup label="Cover Image" error={errors.cover_image}>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={e => setData('cover_image', e.target.files[0])}
                                        />
                                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all">
                                            <ImageIcon size={32} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                            <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600">Click to upload cover image</span>
                                            <span className="text-[10px] text-slate-400 font-medium">PNG, JPG or WEBP (Max 2MB)</span>
                                        </div>
                                    </div>
                                    {journal?.cover_image_url && (
                                        <div className="mt-4 p-2 bg-white rounded-xl border border-slate-100 shadow-sm w-fit">
                                            <img src={journal.cover_image_url} alt="Current Cover" className="h-32 rounded-lg object-cover" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 text-center">Active Cover</p>
                                        </div>
                                    )}
                                </InputGroup>
                            </div>
                            <div className="space-y-4">
                                <InputGroup label="University Logo" error={errors.university_logo}>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={e => setData('university_logo', e.target.files[0])}
                                        />
                                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all">
                                            <ImageIcon size={32} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                            <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600">Click to upload logo</span>
                                            <span className="text-[10px] text-slate-400 font-medium">Transparent PNG preferred</span>
                                        </div>
                                    </div>
                                    {journal?.university_logo_url && (
                                        <div className="mt-4 p-2 bg-white rounded-xl border border-slate-100 shadow-sm w-fit">
                                            <img src={journal.university_logo_url} alt="Current Logo" className="h-20 rounded-lg object-contain" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 text-center">Active Logo</p>
                                        </div>
                                    )}
                                </InputGroup>
                            </div>
                        </div>
                    </Section>

                    {/* Guidelines & Policies */}
                    <Section title="Guidelines & Policies" icon={FileText} description="Upload relevant PDF documents for authors and reviewers.">
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { key: 'for_authors', label: 'Author Guidelines' },
                                { key: 'for_reviewers', label: 'Reviewer Guidelines' },
                                { key: 'editorial_policies', label: 'Editorial Policies' }
                            ].map((doc) => (
                                <InputGroup key={doc.key} label={doc.label} error={errors[doc.key]}>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={e => setData(doc.key, e.target.files[0])}
                                        />
                                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all">
                                            <FileText size={24} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                            <span className="text-[10px] font-black text-slate-500 group-hover:text-blue-600 uppercase tracking-wider text-center">Select PDF</span>
                                        </div>
                                    </div>
                                    {journal?.[doc.key] && (
                                        <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 w-fit">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Document Linked</span>
                                        </div>
                                    )}
                                </InputGroup>
                            ))}
                        </div>
                    </Section>

                    {/* Contact Info */}
                    <Section title="Contact Information" icon={Mail} description="Let prospective authors and readers know how to reach the editorial office.">
                        <InputGroup label="Full Contact Address & Details" error={errors.contact_us}>
                            <textarea
                                className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[120px]"
                                placeholder="Enter physical address, phone numbers, and primary emails..."
                                value={data.contact_us}
                                onChange={e => setData('contact_us', e.target.value)}
                            />
                        </InputGroup>
                    </Section>

                    {/* Submit Button */}
                    <div className="fixed bottom-8 right-8 z-50">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-slate-900/40 hover:bg-blue-600 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                        >
                            <Save size={20} />
                            <span>{journal ? 'Update Journal' : 'Launch Journal'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </BackendLayout>
    );
}
