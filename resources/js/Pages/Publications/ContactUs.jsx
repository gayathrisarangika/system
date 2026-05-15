import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Mail, 
    Globe,
    MapPin,
    MessageCircle,
    Info,
    ExternalLink
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function ContactUs({ journal, conference, symposium }) {
    const publication = journal || conference || symposium;
    const type = journal ? 'journal' : (conference ? 'conference' : 'symposium');
    const title = publication.journal_title || publication.conference_title || publication.symposium_title;

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
        <PublicLayout publication={publication} type={type} active_page="contact">
            <Head title={`Contact Us - ${title}`} />
            
            <div className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={itemVariants} className="mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
                                <MessageCircle size={14} />
                                <span>Get in Touch</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                                Contact Information
                            </h2>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <motion.div 
                                variants={itemVariants}
                                className="md:col-span-2 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-slate-200/50 p-10 lg:p-12"
                            >
                                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                    Editorial Correspondence
                                </h3>
                                
                                <div className="prose max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap font-medium text-lg mb-10">
                                    {publication.contact_us || "No contact information available at this time."}
                                </div>

                                <div className="pt-8 border-t border-slate-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                                            <Info size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Note to Authors</h4>
                                            <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                                For specific inquiries regarding manuscript submission, peer review status, or ethical guidelines, please mention your manuscript ID if applicable.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="space-y-6">
                                <motion.div 
                                    variants={itemVariants}
                                    className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl shadow-slate-900/20 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                                    <MapPin className="text-blue-400 mb-6" size={32} />
                                    <h4 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-2">Location</h4>
                                    <p className="font-bold text-sm leading-relaxed">
                                        Sabaragamuwa University of Sri Lanka,<br />
                                        Belihuloya, 70140,<br />
                                        Sri Lanka.
                                    </p>
                                </motion.div>

                                <motion.div 
                                    variants={itemVariants}
                                    className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg shadow-slate-200/40"
                                >
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                                        <Globe size={24} />
                                    </div>
                                    <h4 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-2">Website</h4>
                                    <a href="https://www.sab.ac.lk/fssl/" target="_blank" className="font-black text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2">
                                        https://www.sab.ac.lk/fssl/ <ExternalLink size={14} />
                                    </a>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
