import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Users,
    UserPlus,
    Trash2,
    ChevronLeft,
    Building2,
    Briefcase,
    User,
    Plus,
    Search
} from 'lucide-react';
import BackendLayout from '@/Layouts/BackendLayout';
import { cn } from '@/lib/utils';

export default function Committee({ symposium, members }) {
    const { data, setData, post, reset, errors, processing } = useForm({
        name: '',
        affiliation: '',
        role: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/symposium/${symposium.id}/committee`, {
            onSuccess: () => reset()
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

    const InputGroup = ({ label, icon: Icon, children, error }) => (
        <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                {Icon && <Icon size={12} className="text-purple-500" />} {label}
            </label>
            {children}
            {error && <div className="text-rose-500 text-[10px] font-bold mt-1 ml-1 uppercase">{error}</div>}
        </div>
    );

    return (
        <BackendLayout title={`Committee - ${symposium.symposium_title}`}>
            <Head title="Manage Committee" />
            
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl mx-auto space-y-8 pb-20"
            >
                <div className="flex items-center justify-between">
                    <Link href="/editor/symposium" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Symposiums
                    </Link>
                </div>

                {/* Header Section */}
                <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                            <Users size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Symposium Committee</h1>
                            <p className="text-slate-500 font-medium">{symposium.symposium_title}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl border border-purple-100">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest">{members.length} Registered Members</span>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Member List */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-5 font-black text-slate-500 uppercase text-[10px] tracking-[0.2em]">Member Identification</th>
                                            <th className="px-8 py-5 font-black text-slate-500 uppercase text-[10px] tracking-[0.2em]">Role</th>
                                            <th className="px-8 py-5 font-black text-slate-500 uppercase text-[10px] tracking-[0.2em] text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {members.length > 0 ? members.map(member => (
                                            <tr key={member.id} className="hover:bg-purple-50/30 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                            {member.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 group-hover:text-purple-700 transition-colors">{member.name}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest truncate max-w-[200px]">{member.affiliation}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg border border-slate-100 text-[10px] font-black uppercase tracking-widest">
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <Link
                                                        href={`/editor/symposium/committee/${member.id}`}
                                                        method="delete" as="button"
                                                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-600 hover:bg-white hover:shadow-lg transition-all"
                                                        title="Remove Member"
                                                    >
                                                        <Trash2 size={18} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                                            <Search size={32} />
                                                        </div>
                                                        <p className="text-slate-500 font-medium italic">No committee members assigned yet.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>

                    {/* Add Member Form */}
                    <aside>
                        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-purple-100 shadow-purple-500/5 sticky top-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                    <UserPlus size={20} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Add Member</h2>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <InputGroup label="Full Name" icon={User} error={errors.name}>
                                    <input
                                        className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="Enter person's name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                </InputGroup>

                                <InputGroup label="Affiliation" icon={Building2} error={errors.affiliation}>
                                    <input
                                        className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="Institutional affiliation"
                                        value={data.affiliation}
                                        onChange={e => setData('affiliation', e.target.value)}
                                    />
                                </InputGroup>

                                <InputGroup label="Role in Symposium" icon={Briefcase} error={errors.role}>
                                    <input
                                        className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="e.g. Steering Committee"
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                    />
                                </InputGroup>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-purple-600 transition-all flex items-center justify-center gap-2 group mt-4"
                                >
                                    <span>Assign Member</span>
                                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </form>
                        </motion.div>
                    </aside>
                </div>
            </motion.div>
        </BackendLayout>
    );
}
