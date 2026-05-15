import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    FileText,
    Users,
    Calendar,
    Type,
    Save,
    X,
    Edit3,
    Search,
    ChevronLeft,
    FileUp,
    LayoutList,
    Layers,
    Hash,
    BookOpen
} from 'lucide-react';
import BackendLayout from '@/Layouts/BackendLayout';
import { cn } from '@/lib/utils';

export default function Articles({ abstractBook, articles }) {
    const [editingArticle, setEditingArticle] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const { data, setData, post, reset, errors, processing } = useForm({
        title: '',
        author: '',
        abstract: '',
        keywords: '',
        doi: '',
        published_date: '',
        pages: '',
        year: abstractBook.year,
        pdf: null,
    });

    const { data: editData, setData: setEditData, post: postEdit, errors: editErrors, reset: resetEdit, processing: editProcessing } = useForm({
        title: '',
        author: '',
        abstract: '',
        keywords: '',
        doi: '',
        published_date: '',
        pages: '',
        year: abstractBook.year,
        pdf: null,
        _method: 'POST'
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/conference/abstract-book/${abstractBook.id}/articles`, {
            onSuccess: () => {
                reset();
                setIsFormVisible(false);
            },
            forceFormData: true,
        });
    };

    const startEdit = (article) => {
        setEditingArticle(article.id);
        setEditData({
            title: article.title || '',
            author: article.author || '',
            abstract: article.abstract || '',
            keywords: article.keywords || '',
            doi: article.doi || '',
            published_date: article.published_date || '',
            pages: article.pages || '',
            year: article.year || abstractBook.year,
            pdf: null,
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        postEdit(`/editor/conference/article/${editingArticle}`, {
            onSuccess: () => {
                setEditingArticle(null);
                resetEdit();
            },
            forceFormData: true,
        });
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

    const InputGroup = ({ label, icon: Icon, children, error, className }) => (
        <div className={cn("space-y-1.5", className)}>
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">
                {Icon && <Icon size={12} className="text-emerald-500" />} {label}
            </label>
            {children}
            {error && <div className="text-rose-500 text-[10px] font-bold mt-1 ml-1 uppercase">{error}</div>}
        </div>
    );

    return (
        <BackendLayout title={`Articles - ${abstractBook.title}`}>
            <Head title="Manage Articles" />
            
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl mx-auto space-y-8 pb-20"
            >
                <div className="flex items-center justify-between">
                    <Link href={`/editor/conference/${abstractBook.conference_id}/abstract-books`} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Abstract Books
                    </Link>
                </div>

                {/* Header Section */}
                <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <Layers size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Conference Articles</h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                <BookOpen size={16} className="text-emerald-500" />
                                {abstractBook.title} ({abstractBook.year})
                            </p>
                        </div>
                    </div>
                    {!isFormVisible && !editingArticle && (
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>Add Research Paper</span>
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    )}
                </motion.div>

                {/* Add/Edit Form */}
                <AnimatePresence mode="wait">
                    {(isFormVisible || editingArticle) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2.5rem] p-8 lg:p-12 border-2 border-emerald-100 shadow-2xl shadow-emerald-500/5"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                        {editingArticle ? <Edit3 size={24} /> : <Plus size={24} />}
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                        {editingArticle ? 'Update Paper Details' : 'Register New Paper'}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsFormVisible(false);
                                        setEditingArticle(null);
                                        reset();
                                        resetEdit();
                                    }}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={editingArticle ? submitEdit : submit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <InputGroup label="Paper Title" icon={Type} error={editingArticle ? editErrors.title : errors.title}>
                                        <textarea
                                            className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[100px]"
                                            placeholder="Enter paper title..."
                                            value={editingArticle ? editData.title : data.title}
                                            onChange={e => (editingArticle ? setEditData('title', e.target.value) : setData('title', e.target.value))}
                                        />
                                    </InputGroup>
                                    <InputGroup label="Contributing Authors" icon={Users} error={editingArticle ? editErrors.author : errors.author}>
                                        <textarea
                                            className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[100px]"
                                            placeholder="Split authors with ; or and..."
                                            value={editingArticle ? editData.author : data.author}
                                            onChange={e => (editingArticle ? setEditData('author', e.target.value) : setData('author', e.target.value))}
                                        />
                                    </InputGroup>
                                </div>

                                <InputGroup label="Paper Abstract" icon={LayoutList} error={editingArticle ? editErrors.abstract : errors.abstract}>
                                    <textarea
                                        className="w-full bg-slate-50 border-slate-200 rounded-2xl p-5 text-sm font-medium leading-relaxed focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[200px]"
                                        placeholder="Enter research summary..."
                                        value={editingArticle ? editData.abstract : data.abstract}
                                        onChange={e => (editingArticle ? setEditData('abstract', e.target.value) : setData('abstract', e.target.value))}
                                    />
                                </InputGroup>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <InputGroup label="DOI" icon={Hash}>
                                        <input
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold"
                                            value={editingArticle ? editData.doi : data.doi}
                                            onChange={e => (editingArticle ? setEditData('doi', e.target.value) : setData('doi', e.target.value))}
                                        />
                                    </InputGroup>
                                    <InputGroup label="Page Range" icon={Search}>
                                        <input
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold"
                                            placeholder="e.g. 5-12"
                                            value={editingArticle ? editData.pages : data.pages}
                                            onChange={e => (editingArticle ? setEditData('pages', e.target.value) : setData('pages', e.target.value))}
                                        />
                                    </InputGroup>
                                    <InputGroup label="Keywords" icon={Layers}>
                                        <input
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold"
                                            placeholder="comma separated"
                                            value={editingArticle ? editData.keywords : data.keywords}
                                            onChange={e => (editingArticle ? setEditData('keywords', e.target.value) : setData('keywords', e.target.value))}
                                        />
                                    </InputGroup>
                                    <InputGroup label="Presentation Date" icon={Calendar}>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold"
                                            value={editingArticle ? editData.published_date : data.published_date}
                                            onChange={e => (editingArticle ? setEditData('published_date', e.target.value) : setData('published_date', e.target.value))}
                                        />
                                    </InputGroup>
                                </div>

                                <div className="p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                                            <FileUp size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">Research Paper (PDF)</p>
                                            <p className="text-xs font-medium text-slate-500">Upload the full paper for archive.</p>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={e => (editingArticle ? setEditData('pdf', e.target.files[0]) : setData('pdf', e.target.files[0]))}
                                        />
                                        <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 font-bold text-xs group-hover:border-emerald-400 group-hover:text-emerald-600 transition-all flex items-center gap-2">
                                            <FileUp size={16} /> Choose Paper
                                        </div>
                                    </div>
                                    {(editingArticle ? editErrors.pdf : errors.pdf) && <div className="text-rose-500 text-[10px] font-black uppercase">{editingArticle ? editErrors.pdf : errors.pdf}</div>}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsFormVisible(false);
                                            setEditingArticle(null);
                                        }}
                                        className="px-8 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing || editProcessing}
                                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-emerald-600 transition-all flex items-center gap-2 group disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        <span>{editingArticle ? 'Update Paper' : 'Register Paper'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Articles List */}
                <motion.div variants={itemVariants} className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <LayoutList size={20} className="text-emerald-600" />
                            Research Inventory
                        </h2>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{articles.length} Papers Registered</span>
                    </div>

                    <div className="grid gap-4">
                        {articles.length > 0 ? articles.map(article => (
                            <motion.div
                                key={article.id}
                                whileHover={{ y: -2 }}
                                className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
                            >
                                <div className="flex items-start gap-5 flex-1">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight mb-1">{article.title}</h4>
                                        <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                            <Users size={12} className="text-emerald-400" /> {article.author}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase tracking-widest">PP. {article.pages || 'N/A'}</span>
                                            {article.doi && <span className="text-[10px] font-black text-emerald-400 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest">DOI: {article.doi}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto self-end md:self-center">
                                    <button
                                        onClick={() => startEdit(article)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-200 font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all duration-300"
                                    >
                                        <Edit3 size={14} /> Edit
                                    </button>
                                    <a
                                        href={article.pdf_link_url}
                                        target="_blank"
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-200 font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300"
                                    >
                                        <Search size={14} /> View PDF
                                    </a>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <FileText size={32} />
                                </div>
                                <p className="text-lg font-black text-slate-900">Empty Abstract Book</p>
                                <p className="text-slate-500 font-medium">Add papers to begin building your conference archive.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </BackendLayout>
    );
}
