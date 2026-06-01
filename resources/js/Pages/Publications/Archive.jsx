import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, 
    FileText, 
    Users, 
    Mail, 
    ChevronRight, 
    Download,
    Layers,
    Calendar,
    Hash,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { splitAuthors } from '@/lib/utils';

export default function Archive({ journal, conference, symposium, is_current = false }) {
    const publication = journal || conference || symposium;
    const type = journal ? 'journal' : (conference ? 'conference' : 'symposium');
    const title = publication.journal_title || publication.conference_title || publication.symposium_title;
    const items = publication.issues || publication.proceedings;
    const itemLabel = journal ? 'Issue' : 'Abstract Book';

    const [expandedItemId, setExpandedItemId] = useState(null);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.split('-')[1];
            if (id) {
                setExpandedItemId(parseInt(id));
                setTimeout(() => {
                    const element = document.getElementById(hash.substring(1));
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        } else if (is_current && items && items.length > 0) {
            setExpandedItemId(items[0].id);
        }
    }, [items, is_current]);

    const toggleExpand = (id) => {
        setExpandedItemId(expandedItemId === id ? null : id);
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
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <PublicLayout publication={publication} type={type} active_page={is_current ? 'current' : 'archive'}>
            <Head title={`${is_current ? 'Current' : 'Archive'} - ${title}`} />
            
            <div className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-5xl mx-auto"
                    >
                        <motion.div variants={itemVariants} className="mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
                                <Layers size={14} />
                                <span>{is_current ? 'Latest Release' : 'Complete Archive'}</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                                {is_current ? `Current ${itemLabel}` : `${itemLabel} Archive`}
                            </h2>
                        </motion.div>

                        <div className="space-y-12">
                            {items && items.length > 0 ? (
                                items.map((item, idx) => (
                                    <motion.div 
                                        key={item.id} 
                                        variants={itemVariants}
                                        id={journal ? `issue-${item.id}` : `proceeding-${item.id}`} 
                                        className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-xl shadow-slate-200/50 overflow-hidden"
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* Cover Image Section */}
                                            <div 
                                                className="w-full md:w-64 bg-slate-100 relative group cursor-pointer overflow-hidden"
                                                onClick={() => toggleExpand(item.id)}
                                            >
                                                {item.cover_image_url ? (
                                                    <img 
                                                        src={item.cover_image_url} 
                                                        alt={`${itemLabel} Cover`} 
                                                        className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full aspect-[3/4] bg-blue-900 flex items-center justify-center p-6 text-center">
                                                        <span className="text-white text-xs font-bold leading-tight uppercase tracking-widest">
                                                            {title}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/30">
                                                        {expandedItemId === item.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details Section */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="bg-slate-900/5 px-8 py-6 border-b border-white/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div className="cursor-pointer" onClick={() => toggleExpand(item.id)}>
                                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                                            {journal ? `Vol. ${item.volume} No. ${item.issue} (${item.year})` : `${item.version} (${item.year})`}
                                                        </h3>
                                                        <div className="flex items-center gap-4 mt-2">
                                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                                <Calendar size={12} /> {item.year}
                                                            </span>
                                                            {journal && (
                                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                                    <Hash size={12} /> Vol {item.volume} Issue {item.issue}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        {item.pdf_link_url && (
                                                            <a 
                                                                href={item.pdf_link_url} 
                                                                target="_blank" 
                                                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                                            >
                                                                <Download size={14} />
                                                                Full {itemLabel}
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => toggleExpand(item.id)}
                                                            className="inline-flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                                                        >
                                                            {expandedItemId === item.id ? 'Hide Articles' : 'Show Articles'}
                                                            {expandedItemId === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <AnimatePresence>
                                                    {expandedItemId === item.id && (
                                                        <motion.div 
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-8 lg:p-10 bg-white/50">
                                                                <div className="space-y-10">
                                                                    {item.articles && item.articles.length > 0 ? (
                                                                        item.articles.map((article) => (
                                                                            <div key={article.id} className="group">
                                                                                <Link href={`/article/${article.id}`} className="block mb-3">
                                                                                    <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                                                                                        {article.title}
                                                                                    </h4>
                                                                                </Link>
                                                                                <p className="text-slate-500 font-bold text-sm mb-4 flex items-center gap-2">
                                                                                    <Users size={14} className="text-slate-400" />
                                                                                    {splitAuthors(article.author, true).join(', ')}
                                                                                </p>
                                                                                <div className="flex flex-wrap gap-6 items-center">
                                                                                    <Link 
                                                                                        href={`/article/${article.id}`} 
                                                                                        className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                                                                                    >
                                                                                        View Abstract <ChevronRight size={14} />
                                                                                    </Link>
                                                                                    {article.pdf_url && (
                                                                                        <a 
                                                                                            href={article.pdf_url} 
                                                                                            target="_blank" 
                                                                                            className="text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2 transition-all"
                                                                                        >
                                                                                            <FileText size={14} />
                                                                                            PDF
                                                                                        </a>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                                                                            <FileText size={40} className="opacity-20" />
                                                                            <p className="font-bold uppercase tracking-widest text-xs">No articles published in this {itemLabel.toLowerCase()}.</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div 
                                    variants={itemVariants}
                                    className="text-center py-24 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border-2 border-dashed border-slate-200"
                                >
                                    <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No {itemLabel.toLowerCase()}s found in our records.</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
