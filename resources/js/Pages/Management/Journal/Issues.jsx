import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    BookOpen,
    Calendar,
    Layers,
    FileText,
    Image as ImageIcon,
    Save,
    X,
    Edit3,
    Trash2,
    ChevronLeft,
    CheckCircle2,
    Clock,
    LayoutDashboard
} from 'lucide-react';
import BackendLayout from '@/Layouts/BackendLayout';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';

export default function Issues({ journal, issues }) {
    const [editingIssue, setEditingIssue] = React.useState(null);
    const [isFormVisible, setIsFormVisible] = React.useState(false);

    const { data, setData, post, reset, errors, processing } = useForm({
        volume: '',
        issue: '',
        year: '',
        published_date: '',
        is_current_issue: false,
        cover_image: null,
        pdf_link: null,
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingIssue) {
            post(`/editor/journal/issue/${editingIssue.id}`, {
                onSuccess: () => {
                    reset();
                    setEditingIssue(null);
                    setIsFormVisible(false);
                },
                forceFormData: true,
            });
        } else {
            post(`/editor/journal/${journal.id}/issues`, {
                onSuccess: () => {
                    reset();
                    setIsFormVisible(false);
                },
                forceFormData: true,
            });
        }
    };

    const handleEdit = (issue) => {
        setEditingIssue(issue);
        setIsFormVisible(true);
        setData({
            volume: issue.volume,
            issue: issue.issue,
            year: issue.year,
            published_date: issue.published_date || '',
            is_current_issue: issue.is_current_issue === 1 || issue.is_current_issue === true,
            cover_image: null,
            pdf_link: null,
        });
    };

    const handleCancel = () => {
        setEditingIssue(null);
        setIsFormVisible(false);
        reset();
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this issue? All associated articles will be affected.')) {
            router.delete(`/editor/journal/issue/${id}`);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    const InputGroup = ({ label, children, error, icon: Icon }) => (
        <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                {Icon && <Icon size={12} className="text-blue-500" />} {label}
            </label>
            {children}
            {error && <div className="text-rose-500 text-[10px] font-bold mt-1 ml-1 uppercase">{error}</div>}
        </div>
    );

    return (
        <BackendLayout title={`Issues - ${journal.journal_title}`}>
            <Head title="Manage Issues" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl mx-auto space-y-8 pb-20"
            >
                <div className="flex items-center justify-between">
                    <Link href="/editor/journal" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Journals
                    </Link>
                </div>

                {/* Header Card */}
                <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <BookOpen size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Journal Issues</h1>
                            <p className="text-slate-500 font-medium">{journal.journal_title}</p>
                        </div>
                    </div>
                    {!isFormVisible && (
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>Create New Issue</span>
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    )}
                </motion.div>

                {/* Add/Edit Section */}
                <AnimatePresence>
                    {isFormVisible && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-blue-100 shadow-2xl shadow-blue-500/5 mb-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                            {editingIssue ? <Edit3 size={20} /> : <Plus size={20} />}
                                        </div>
                                        {editingIssue ? 'Edit Issue Configuration' : 'Configure New Issue'}
                                    </h2>
                                    <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600 p-2"><X size={24} /></button>
                                </div>

                                <form onSubmit={submit} className="space-y-8">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                        <InputGroup label="Volume Number" icon={Layers} error={errors.volume}>
                                            <input type="number" className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20" value={data.volume} onChange={e => setData('volume', e.target.value)} />
                                        </InputGroup>
                                        <InputGroup label="Issue Number" icon={Hash} error={errors.issue}>
                                            <input type="number" className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20" value={data.issue} onChange={e => setData('issue', e.target.value)} />
                                        </InputGroup>
                                        <InputGroup label="Publication Year" icon={Calendar} error={errors.year}>
                                            <input type="number" className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20" value={data.year} onChange={e => setData('year', e.target.value)} />
                                        </InputGroup>
                                        <InputGroup label="Official Date" icon={Clock} error={errors.published_date}>
                                            <input type="date" className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20" value={data.published_date} onChange={e => setData('published_date', e.target.value)} />
                                        </InputGroup>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <InputGroup label="Issue Cover Graphic" icon={ImageIcon} error={errors.cover_image}>
                                            <div className="relative group">
                                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={e => setData('cover_image', e.target.files[0])} />
                                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all">
                                                    <ImageIcon size={24} className="text-slate-400 group-hover:text-blue-500" />
                                                    <span className="text-xs font-bold text-slate-500">Upload Cover PNG/JPG</span>
                                                </div>
                                            </div>
                                        </InputGroup>
                                        <InputGroup label="Complete Issue (PDF)" icon={FileText} error={errors.pdf_link}>
                                            <div className="relative group">
                                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={e => setData('pdf_link', e.target.files[0])} />
                                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all">
                                                    <FileText size={24} className="text-slate-400 group-hover:text-blue-500" />
                                                    <span className="text-xs font-bold text-slate-500">Upload Full PDF</span>
                                                </div>
                                            </div>
                                        </InputGroup>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="current"
                                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                                                checked={data.is_current_issue}
                                                onChange={e => setData('is_current_issue', e.target.checked)}
                                            />
                                            <label htmlFor="current" className="text-sm font-bold text-slate-700 cursor-pointer">Set as the Current Active Issue</label>
                                        </div>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={handleCancel} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all text-xs uppercase tracking-widest">Cancel</button>
                                            <button type="submit" disabled={processing} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 text-xs uppercase tracking-widest">
                                                <Save size={16} />
                                                {editingIssue ? 'Update' : 'Publish'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Issues List Grid */}
                <motion.div variants={itemVariants} className="space-y-6">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 px-2">
                        <LayoutDashboard size={20} className="text-blue-600" />
                        Archive Volumes
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {issues.map(issue => (
                            <motion.div
                                key={issue.id}
                                whileHover={{ y: -5 }}
                                className={cn(
                                    "relative bg-white rounded-[2rem] p-6 border transition-all duration-300 group",
                                    issue.is_current_issue ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-4 ring-blue-50" : "border-slate-200/60 shadow-sm hover:shadow-xl hover:border-blue-200"
                                )}
                            >
                                {issue.is_current_issue && (
                                    <div className="absolute -top-3 right-6 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                        Current Issue
                                    </div>
                                )}

                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">Vol. {issue.volume} No. {issue.issue}</h3>
                                            <p className="text-sm font-bold text-slate-400 mt-1 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Calendar size={14} className="text-slate-300" /> {issue.year}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-300">
                                            <BookOpen size={24} />
                                        </div>
                                    </div>

                                    <div className="space-y-3 mt-auto">
                                        <Link
                                            href={`/editor/journal/issue/${issue.id}/articles`}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 shadow-md transition-all"
                                        >
                                            <Layers size={14} /> Manage Articles
                                        </Link>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(issue)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                                            >
                                                <Edit3 size={12} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(issue.id)}
                                                className="flex items-center justify-center px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </BackendLayout>
    );
}
