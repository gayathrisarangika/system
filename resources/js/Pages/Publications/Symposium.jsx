import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Zap, 
    BookOpen, 
    Users, 
    ChevronRight, 
    ArrowRight,
    Calendar,
    Globe
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import RecentPublicationsCarousel from '@/Components/RecentPublicationsCarousel';

export default function Symposium({ symposium, latestProceeding, recentProceedings }) {
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
        <PublicLayout publication={symposium} type="symposium" active_page="home">
            <Head title={symposium.symposium_title} />
            
            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 text-center lg:text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest mb-8">
                                <Zap size={14} />
                                <span>Academic Symposium</span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                                {symposium.symposium_title}
                            </h1>
                            <p className="text-lg text-slate-600 mb-12 max-w-2xl font-medium leading-relaxed">
                                {symposium.symposium_details}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <Link 
                                    href={`/symposium/${symposium.id}/current`}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2 group"
                                >
                                    Current Abstract Book
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link 
                                    href={`/symposium/${symposium.id}/archive`}
                                    className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    Browse Archive
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/3 w-full max-w-sm"
                        >
                            {symposium.cover_image_url ? (
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-amber-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                    <img 
                                        src={symposium.cover_image_url} 
                                        alt={symposium.symposium_title} 
                                        className="relative w-full aspect-[3/4] object-cover rounded-[2.5rem] shadow-2xl border-4 border-white"
                                    />
                                </div>
                            ) : (
                                <div className="w-full aspect-[3/4] bg-slate-200 rounded-[2.5rem] flex items-center justify-center text-slate-400">
                                    <Zap size={64} />
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="pb-32">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Main Content */}
                        <div className="flex-1">
                            <motion.div 
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={containerVariants}
                                className="space-y-16"
                            >
                                <motion.div variants={itemVariants}>
                                    <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-amber-600 rounded-full"></div>
                                        Aims and Scope
                                    </h3>
                                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                        {symposium.aim_scope}
                                    </p>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                        Mission
                                    </h3>
                                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                        {symposium.mission}
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:w-80">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8 sticky top-32"
                            >
                                {/* Resource Links */}
                                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-8 shadow-xl shadow-slate-200/50">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Guidelines</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'For Authors', icon: BookOpen, url: symposium.for_authors_url },
                                            { label: 'For Reviewers', icon: Users, url: symposium.for_reviewers_url },
                                            { label: 'Editorial Policies', icon: Globe, url: symposium.editorial_policies_url },
                                        ].map((item, i) => (
                                            <a 
                                                key={i}
                                                href={item.url || '#'} 
                                                target="_blank"
                                                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50 rounded-2xl group transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={18} className="text-slate-400 group-hover:text-amber-600" />
                                                    <span className="text-sm font-black text-slate-700 group-hover:text-amber-700">{item.label}</span>
                                                </div>
                                                <ChevronRight size={14} className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </aside>
                    </div>

                    {/* Recent Publications Carousel */}
                    {recentProceedings?.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-32"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Previous Abstract Books</h3>
                                <Link 
                                    href={`/symposium/${symposium.id}/archive`}
                                    className="text-xs font-black text-amber-600 uppercase tracking-[0.2em] hover:text-amber-700 transition-colors"
                                >
                                    View Archive
                                </Link>
                            </div>
                            <RecentPublicationsCarousel publications={recentProceedings} type="symposium" journalId={symposium.id} />
                        </motion.div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
