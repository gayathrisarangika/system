import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Globe,
    GraduationCap,
    Award
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function EditorialBoard({ journal, conference, symposium }) {
    const publication = journal || conference || symposium;
    const type = journal ? 'journal' : (conference ? 'conference' : 'symposium');
    const title = publication.journal_title || publication.conference_title || publication.symposium_title;
    const board = publication.editorial_board || publication.committee;
    const boardTitle = journal ? 'Editorial Board' : 'Organizing Committee';

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
        <PublicLayout publication={publication} type={type} active_page="editorial">
            <Head title={`${boardTitle} - ${title}`} />
            
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
                                <GraduationCap size={14} />
                                <span>Distinguished Experts</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                                {boardTitle}
                            </h2>
                        </motion.div>
                        
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-slate-200/50 overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900/5 border-b border-white/40">
                                            <th className="p-8 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Expert Profile</th>
                                            <th className="p-8 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Affiliation</th>
                                            <th className="p-8 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Designation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/50">
                                        {board && board.length > 0 ? (
                                            board.map((member) => (
                                                <tr key={member.id} className="hover:bg-blue-50/50 transition-colors group">
                                                    <td className="p-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                                                                {member.name.charAt(0)}
                                                            </div>
                                                            <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-8">
                                                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                            <Globe size={14} className="text-slate-300" />
                                                            {member.affiliation}
                                                        </div>
                                                    </td>
                                                    <td className="p-8">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg text-blue-600 text-xs font-black uppercase tracking-widest">
                                                            <Award size={12} />
                                                            {member.role}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="p-24 text-center">
                                                    <Users size={48} className="mx-auto text-slate-200 mb-4" />
                                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No members are currently listed.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}
