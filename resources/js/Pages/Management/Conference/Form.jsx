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

export default function Form({ conference = null, pre_filled_title = '' }) {
    const { data, setData, post, processing, errors } = useForm({
        conference_title: conference?.conference_title || pre_filled_title || '',
        university_name: conference?.university_name || 'Sabaragamuwa University of Sri Lanka',
        conference_details: conference?.conference_details || '',
        aim_scope: conference?.aim_scope || '',
        mission: conference?.mission || '',
        issn: conference?.issn || '',
        online_issn: conference?.online_issn || '',
        contact_us: conference?.contact_us || '',
        cover_image: null,
        university_logo: null,
        for_authors: null,
        for_reviewers: null,
        editorial_policies: null,
        _method: conference ? 'PUT' : 'POST'
    });

    const submit = (e) => {
        e.preventDefault();
        if (conference) {
            post(`/editor/conference/${conference.id}`, {
                forceFormData: true,
            });
        } else {
            post('/editor/conference', {
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
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
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
                {Icon && <Icon size={12} className="text-emerald-500" />} {label}
            </label>
            {children}
            {error && <div className="text-rose-500 text-[10px] font-bold mt-1 ml-1 uppercase">{error}</div>}
        </div>
    );

    return (
        <BackendLayout title={conference ? 'Edit Conference' : 'Create Conference'}>
            <Head title={conference ? 'Edit Conference' : 'Create Conference'} />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-5xl mx-auto space-y-8 pb-20"
            >
                <div className="flex items-center justify-between">
                    <Link href="/editor/conference" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Conferences
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* General Info */}
                    <Section title="Conference Details" icon={Info} description="Essential identification for the conference.">
                        <InputGroup label="Conference Title" icon={FileText} error={errors.conference_title}>
                            <textarea
                                className={cn(
                                    "w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[80px]",
                                    pre_filled_title && !conference ? 'bg-slate-100 opacity-70 cursor-not-allowed' : ''
                                )}
                                placeholder="Enter the official title of the conference"
                                value={data.conference_title}
                                onChange={e => setData('conference_title', e.target.value)}
                                readOnly={!!(pre_filled_title && !conference)}
                            />
                            {pre_filled_title && !conference && <p className="text-[10px] font-bold text-emerald-600 mt-2 ml-1 uppercase tracking-wider italic">Title pre-assigned by administration</p>}
                        </InputGroup>

                        <InputGroup label="Institution" icon={Building2} error={errors.university_name}>
                            <input
                                className="w-full bg-slate-100 border-slate-200 rounded-xl p-3 text-sm font-bold opacity-70 cursor-not-allowed"
                                value={data.university_name}
                                readOnly
                            />
                        </InputGroup>

                        <div className="grid md:grid-cols-2 gap-6">
                            <InputGroup label="ISSN" icon={Hash} error={errors.issn}>
                                <input
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    placeholder="XXXX-XXXX"
                                    value={data.issn}
                                    onChange={e => setData('issn', e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup label="Online ISSN" icon={Globe} error={errors.online_issn}>
                                <input
                                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    placeholder="XXXX-XXXX"
                                    value={data.online_issn}
                                    onChange={e => setData('online_issn', e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </Section>

                    {/* Description Section */}
                    <Section title="Academic Scope" icon={Target} description="Contextual and scientific background of the conference.">
                        <InputGroup label="About the Conference" error={errors.conference_details}>
                            <textarea
                                className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[120px]"
                                placeholder="Describe the conference background and objectives..."
                                value={data.conference_details}
                                onChange={e => setData('conference_details', e.target.value)}
                            />
                        </InputGroup>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputGroup label="Aim & Scope" icon={Rocket} error={errors.aim_scope}>
                                <textarea
                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[150px]"
                                    placeholder="What is the scientific scope?"
                                    value={data.aim_scope}
                                    onChange={e => setData('aim_scope', e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup label="Conference Mission" icon={Target} error={errors.mission}>
                                <textarea
                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[150px]"
                                    placeholder="The mission behind this event..."
                                    value={data.mission}
                                    onChange={e => setData('mission', e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </Section>

                    {/* Imagery */}
                    <Section title="Branding Assets" icon={ImageIcon} description="Visual components for the conference landing page.">
                        <div className="grid md:grid-cols-2 gap-8">
                            <InputGroup label="Promotional / Cover Image" error={errors.cover_image}>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={e => setData('cover_image', e.target.files[0])}
                                    />
                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 group-hover:border-emerald-400 group-hover:bg-emerald-50/50 transition-all">
                                        <ImageIcon size={32} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                        <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-600">Upload cover image</span>
                                    </div>
                                </div>
                                {conference?.cover_image_url && (
                                    <img src={conference.cover_image_url} alt="Cover" className="mt-4 h-32 rounded-xl border border-slate-100 shadow-sm object-cover" />
                                )}
                            </InputGroup>
                            <InputGroup label="University Logo" error={errors.university_logo}>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={e => setData('university_logo', e.target.files[0])}
                                    />
                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 group-hover:border-emerald-400 group-hover:bg-emerald-50/50 transition-all">
                                        <ImageIcon size={32} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                        <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-600">Upload university logo</span>
                                    </div>
                                </div>
                                {conference?.university_logo_url && (
                                    <img src={conference.university_logo_url} alt="Logo" className="mt-4 h-20 rounded-lg object-contain" />
                                )}
                            </InputGroup>
                        </div>
                    </Section>

                    {/* Resources */}
                    <Section title="Submission Resources" icon={FileText} description="Downloadable PDF guidelines for participants.">
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { key: 'for_authors', label: 'Author Guidelines' },
                                { key: 'for_reviewers', label: 'Reviewer Guidelines' },
                                { key: 'editorial_policies', label: 'Ethics & Policies' }
                            ].map((doc) => (
                                <InputGroup key={doc.key} label={doc.label} error={errors[doc.key]}>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={e => setData(doc.key, e.target.files[0])}
                                        />
                                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-emerald-400 group-hover:bg-emerald-50/50 transition-all">
                                            <FileText size={24} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Update PDF</span>
                                        </div>
                                    </div>
                                    {conference?.[doc.key] && (
                                        <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                            Active
                                        </div>
                                    )}
                                </InputGroup>
                            ))}
                        </div>
                    </Section>

                    <Section title="Contact Information" icon={Mail} description="Official contact details for conference inquiries.">
                        <InputGroup label="Address & Communications" error={errors.contact_us}>
                            <textarea
                                className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[120px]"
                                placeholder="Enter conference office details..."
                                value={data.contact_us}
                                onChange={e => setData('contact_us', e.target.value)}
                            />
                        </InputGroup>
                    </Section>

                    <div className="fixed bottom-8 right-8 z-50">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-slate-900/40 hover:bg-emerald-600 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                        >
                            <Save size={20} />
                            <span>{conference ? 'Update Conference' : 'Initialize Conference'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </BackendLayout>
    );
}
