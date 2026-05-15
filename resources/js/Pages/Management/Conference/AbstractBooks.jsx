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
    Search,
    Type,
    LayoutGrid
} from 'lucide-react';
import BackendLayout from '@/Layouts/BackendLayout';
import { cn } from '@/lib/utils';

export default function AbstractBooks({ conference, abstractBooks }) {
    const [editingBook, setEditingBook] = React.useState(null);
    const [isFormVisible, setIsFormVisible] = React.useState(false);

    const { data, setData, post, reset, processing, errors } = useForm({
        year: new Date().getFullYear(),
        version: '',
        pdf_link: null,
        cover_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingBook) {
            post(`/editor/conference/abstract-book/${editingBook.id}`, {
                onSuccess: () => {
                    reset();
                    setEditingBook(null);
                    setIsFormVisible(false);
                },
                forceFormData: true,
            });
        } else {
            post(`/editor/conference/${conference.id}/abstract-books`, {
                onSuccess: () => {
                    reset();
                    setIsFormVisible(false);
                },
                forceFormData: true,
            });
        }
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setIsFormVisible(true);
        setData({
            year: book.year,
            version: book.version,
            pdf_link: null,
            cover_image: null,
        });
    };

    const handleCancel = () => {
        setEditingBook(null);
        setIsFormVisible(false);
        reset();
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

    return (
        <BackendLayout title={`Abstract Books - ${conference.conference_title}`}>
            <Head title="Manage Abstract Books" />
            
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl mx-auto space-y-8 pb-20"
            >
                <div className="flex items-center justify-between">
                    <Link href="/editor/conference" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Conferences
                    </Link>
                </div>

                {/* Header Section */}
                <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <Layers size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Abstract Books</h1>
                            <p className="text-slate-500 font-medium">{conference.conference_title}</p>
                        </div>
                    </div>
                    {!isFormVisible && (
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>Add Abstract Book</span>
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    )}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-5 font-black text-slate-500 uppercase text-[10px] tracking-[0.2em]">Publication Version</th>
                                            <th className="px-8 py-5 font-black text-slate-500 uppercase text-[10px] tracking-[0.2em] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {abstractBooks.map(book => (
                                            <tr key={book.id} className="hover:bg-emerald-50/30 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                            {book.year.toString().slice(-2)}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{book.version}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{book.year} EDITION</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/editor/conference/abstract-book/${book.id}/articles`}
                                                            className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-emerald-600 hover:bg-white hover:shadow-lg transition-all"
                                                            title="Manage Articles"
                                                        >
                                                            <LayoutGrid size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleEdit(book)}
                                                            className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 hover:bg-white hover:shadow-lg transition-all"
                                                            title="Edit Configuration"
                                                        >
                                                            <Edit3 size={18} />
                                                        </button>
                                                        <Link
                                                            href={`/editor/conference/abstract-book/${book.id}`}
                                                            method="delete" as="button"
                                                            className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-600 hover:bg-white hover:shadow-lg transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>

                    <aside className="space-y-6">
                        <AnimatePresence mode="wait">
                            {isFormVisible && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-emerald-100 shadow-emerald-500/5 h-fit relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                                    {editingBook ? <Edit3 size={20} /> : <Plus size={20} />}
                                                </div>
                                                {editingBook ? 'Edit Book' : 'New Book'}
                                            </h2>
                                            <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                                        </div>

                                        <form onSubmit={submit} className="space-y-5">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <Calendar size={12} className="text-emerald-500" /> Publication Year
                                                </label>
                                                <input type="number" className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20" value={data.year} onChange={e => setData('year', e.target.value)} required />
                                                {errors.year && <div className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.year}</div>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <Type size={12} className="text-emerald-500" /> Version / Title
                                                </label>
                                                <input className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20" value={data.version} onChange={e => setData('version', e.target.value)} required placeholder="e.g. Volume 1" />
                                                {errors.version && <div className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.version}</div>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <FileText size={12} className="text-emerald-500" /> Abstract Book (PDF)
                                                </label>
                                                <div className="relative group">
                                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={e => setData('pdf_link', e.target.files[0])} required={!editingBook} />
                                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-1 group-hover:border-emerald-400 group-hover:bg-emerald-50 transition-all">
                                                        <FileText size={20} className="text-slate-400 group-hover:text-emerald-500" />
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Choose PDF</span>
                                                    </div>
                                                </div>
                                                {editingBook && <p className="text-[9px] text-slate-400 italic text-center mt-1">Leave blank to keep current file</p>}
                                                {errors.pdf_link && <div className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.pdf_link}</div>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <ImageIcon size={12} className="text-emerald-500" /> Cover Graphic
                                                </label>
                                                <div className="relative group">
                                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={e => setData('cover_image', e.target.files[0])} />
                                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-1 group-hover:border-emerald-400 group-hover:bg-emerald-50 transition-all">
                                                        <ImageIcon size={20} className="text-slate-400 group-hover:text-emerald-500" />
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Upload Cover</span>
                                                    </div>
                                                </div>
                                                {errors.cover_image && <div className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.cover_image}</div>}
                                            </div>

                                            <div className="flex flex-col gap-3 pt-4">
                                                <button type="submit" disabled={processing} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                                                    <Save size={16} />
                                                    {editingBook ? 'Update Book' : 'Register Book'}
                                                </button>
                                                <button type="button" onClick={handleCancel} className="w-full py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-all text-[10px] uppercase tracking-[0.2em]">
                                                    Cancel Entry
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!isFormVisible && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-emerald-50/50 border-2 border-dashed border-emerald-200 rounded-[2rem] p-10 text-center"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-300 shadow-sm mx-auto mb-4">
                                    <BookOpen size={32} />
                                </div>
                                <p className="text-emerald-800 font-black text-sm uppercase tracking-widest mb-1">Archive Management</p>
                                <p className="text-emerald-600/70 text-xs font-medium leading-relaxed">
                                    Click the button above to register a new abstract book version.
                                </p>
                            </motion.div>
                        )}
                    </aside>
                </div>
            </motion.div>
        </BackendLayout>
    );
}
