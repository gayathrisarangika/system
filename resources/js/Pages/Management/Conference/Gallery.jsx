import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Image as ImageIcon,
    Trash2,
    ChevronLeft,
    LayoutGrid,
    Upload,
    X,
    Maximize2
} from 'lucide-react';
import BackendLayout from '@/Layouts/BackendLayout';
import { cn } from '@/lib/utils';

export default function Gallery({ conference = null, symposium = null, images }) {
    const publication = conference || symposium;
    const type = conference ? 'conference' : 'symposium';
    const [selectedImage, setSelectedImage] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        image: null,
        caption: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/${type}/${publication.id}/gallery`, {
            onSuccess: () => reset(),
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

    return (
        <BackendLayout title="Manage Gallery">
            <Head title={`Manage Gallery - ${publication.conference_title || publication.symposium_title}`} />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-8"
            >
                <div className="flex items-center justify-between">
                    <Link href={`/editor/${type}`} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to {type === 'conference' ? 'Conferences' : 'Symposiums'}
                    </Link>
                </div>

                {/* Header Section */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-slate-200/60 gap-6"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <ImageIcon size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Program & Workshop Gallery</h1>
                            <p className="text-slate-500 font-medium">Upload photos to showcase your events on the public website.</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 sticky top-8">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Upload size={20} className="text-emerald-600" />
                                Add New Photo
                            </h3>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Select Image</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={e => setData('image', e.target.files[0])}
                                            accept="image/*"
                                        />
                                        <div className={cn(
                                            "bg-slate-50 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2 transition-all",
                                            data.image ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 group-hover:border-emerald-400 group-hover:bg-emerald-50/50"
                                        )}>
                                            <ImageIcon size={32} className={cn(
                                                "transition-colors",
                                                data.image ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-500"
                                            )} />
                                            <span className="text-xs font-bold text-slate-500 text-center">
                                                {data.image ? data.image.name : "Click to select or drag photo"}
                                            </span>
                                        </div>
                                    </div>
                                    {errors.image && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.image}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Caption (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                        placeholder="e.g. Inauguration Ceremony"
                                        value={data.caption}
                                        onChange={e => setData('caption', e.target.value)}
                                    />
                                    {errors.caption && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.caption}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !data.image}
                                    className="w-full bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-emerald-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-slate-900"
                                >
                                    <span>Upload Photo</span>
                                    <Plus size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Gallery Grid */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 min-h-[500px]">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                                <LayoutGrid size={20} className="text-emerald-600" />
                                Current Photos ({images.length})
                            </h3>

                            {images.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {images.map((img) => (
                                        <motion.div
                                            key={img.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200"
                                        >
                                            <img
                                                src={img.image_url}
                                                alt={img.caption}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1">
                                                    {img.caption && <p className="text-[10px] font-black text-white uppercase tracking-wider line-clamp-1">{img.caption}</p>}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setSelectedImage(img)}
                                                            className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-slate-900 transition-all"
                                                        >
                                                            <Maximize2 size={14} />
                                                        </button>
                                                        <Link
                                                            href={`/editor/${type}/gallery/${img.id}`}
                                                            method="delete"
                                                            as="button"
                                                            className="p-1.5 bg-rose-500/20 backdrop-blur-md rounded-lg text-rose-200 hover:bg-rose-500 hover:text-white transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <ImageIcon size={48} className="mb-4 opacity-20" />
                                    <p className="font-bold">No photos uploaded yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                            <X size={32} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.image_url}
                                alt={selectedImage.caption}
                                className="w-full rounded-3xl shadow-2xl"
                            />
                            {selectedImage.caption && (
                                <div className="mt-4 text-center">
                                    <p className="text-white font-bold text-lg">{selectedImage.caption}</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </BackendLayout>
    );
}
