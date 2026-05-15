import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    Layers,
    CheckCircle2,
    XCircle,
    Eye,
    UserPlus,
    Mail,
    Shield,
    Type,
    PlusCircle,
    Search,
    ChevronRight,
    LayoutDashboard
} from 'lucide-react';
import BackendLayout from '@/Layouts/BackendLayout';
import { cn } from '@/lib/utils';

export default function Admin({ pendingJournals, pendingConferences, pendingSymposiums, journals, conferences, symposiums, departments, conferenceNames, symposiumNames, users }) {
    const { data, setData, post, reset, errors, processing } = useForm({
        name: '',
        email: '',
        username: '',
        password: '',
        department_id: '',
        role: 'editor',
        type: 'journal',
        publication_id: '',
        journal_title: '',
        conference_title: '',
        symposium_title: '',
    });

    const submitUser = (e) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => reset('name', 'email', 'username', 'password'),
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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

    const TableSection = ({ title, icon: Icon, colorClass, data, type }) => (
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-xl text-white shadow-lg", colorClass)}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">{title}</h2>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Pending Approval</p>
                    </div>
                </div>
                <span className={cn("px-3 py-1 rounded-full text-xs font-black shadow-sm border",
                    type === 'journal' ? "bg-blue-50 text-blue-700 border-blue-100" :
                    type === 'conference' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    "bg-purple-50 text-purple-700 border-purple-100"
                )}>
                    {data.length}
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-[0.15em]">Publication Details</th>
                            {type === 'journal' && <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-[0.15em]">Department</th>}
                            <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-[0.15em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length > 0 ? data.map(item => (
                            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                        {item.journal_title || item.conference_title || item.symposium_title}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">ID: #{item.id}</span>
                                    </div>
                                </td>
                                {type === 'journal' && (
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                            {item.department?.name}
                                        </div>
                                    </td>
                                )}
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/${type}/${item.id}`}
                                            className="p-2 bg-white text-slate-600 rounded-lg hover:text-blue-600 hover:shadow-md transition-all border border-slate-100"
                                            title="Preview"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            href={`/admin/approve/${type}/${item.id}`}
                                            method="post" as="button"
                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20 transition-all border border-emerald-100"
                                            title="Approve"
                                        >
                                            <CheckCircle2 size={16} />
                                        </Link>
                                        <Link
                                            href={`/admin/reject/${type}/${item.id}`}
                                            method="post" as="button"
                                            className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-500/20 transition-all border border-rose-100"
                                            title="Reject"
                                        >
                                            <XCircle size={16} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={type === 'journal' ? 3 : 2} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                            <Search size={24} />
                                        </div>
                                        <p className="text-sm font-medium text-slate-400 italic">No pending {type}s at the moment.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );

    return (
        <BackendLayout title="Admin Dashboard">
            <Head title="Admin Dashboard" />
            
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid lg:grid-cols-3 gap-8 mb-12"
            >
                <section className="lg:col-span-2 space-y-8">
                    {/* Header Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Journals', count: journals.length, icon: BookOpen, color: 'from-blue-600 to-blue-700' },
                            { label: 'Conferences', count: conferences.length, icon: Users, color: 'from-emerald-600 to-emerald-700' },
                            { label: 'Symposiums', count: symposiums.length, icon: Layers, color: 'from-purple-600 to-purple-700' }
                        ].map((stat, i) => (
                            <motion.div key={i} variants={itemVariants} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <p className="text-2xl font-black text-slate-900">{stat.count}</p>
                                    </div>
                                    <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg", stat.color)}>
                                        <stat.icon size={24} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <TableSection
                        title="Journals"
                        icon={BookOpen}
                        colorClass="bg-blue-600 from-blue-600 to-indigo-700"
                        data={pendingJournals}
                        type="journal"
                    />

                    <TableSection
                        title="Conferences"
                        icon={Users}
                        colorClass="bg-emerald-600 from-emerald-600 to-teal-700"
                        data={pendingConferences}
                        type="conference"
                    />

                    <TableSection
                        title="Symposiums"
                        icon={Layers}
                        colorClass="bg-purple-600 from-purple-600 to-indigo-700"
                        data={pendingSymposiums}
                        type="symposium"
                    />
                </section>

                <aside className="space-y-8">
                    {/* User Creation Form */}
                    <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
                                    <UserPlus size={20} />
                                </div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">Create Editor</h2>
                            </div>

                            <form onSubmit={submitUser} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        <Type size={12} className="text-blue-500" /> Full Name
                                    </label>
                                    <input
                                        className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="Enter full name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <div className="text-rose-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.name}</div>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        <Mail size={12} className="text-blue-500" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="editor@university.com"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    {errors.email && <div className="text-rose-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.email}</div>}
                                </div>

                                {data.role === 'editor' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Type</label>
                                            <select
                                                className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                                value={data.type}
                                                onChange={e => {
                                                    setData(prev => ({
                                                        ...prev,
                                                        type: e.target.value,
                                                        publication_id: '',
                                                        journal_title: '',
                                                        conference_title: '',
                                                        symposium_title: ''
                                                    }));
                                                }}
                                            >
                                                <option value="journal">Journal</option>
                                                <option value="conference">Conference</option>
                                                <option value="symposium">Symposium</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target</label>
                                            <select
                                                className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                                value={data.publication_id}
                                                onChange={e => {
                                                    const id = e.target.value;
                                                    let title = '';
                                                    if (data.type === 'journal') {
                                                        title = departments.find(d => d.id == id)?.name || '';
                                                        setData(prev => ({ ...prev, publication_id: id, journal_title: title }));
                                                    } else if (data.type === 'conference') {
                                                        title = conferenceNames.find(c => c.id == id)?.name || '';
                                                        setData(prev => ({ ...prev, publication_id: id, conference_title: title }));
                                                    } else if (data.type === 'symposium') {
                                                        title = symposiumNames.find(s => s.id == id)?.name || '';
                                                        setData(prev => ({ ...prev, publication_id: id, symposium_title: title }));
                                                    }
                                                }}
                                                required
                                            >
                                                <option value="">Select</option>
                                                {data.type === 'journal' && departments.map(d => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                                {data.type === 'conference' && conferenceNames.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                                {data.type === 'symposium' && symposiumNames.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                                        <input
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="username"
                                            value={data.username}
                                            onChange={e => setData('username', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                                        <input
                                            type="password"
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="••••••••"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        <Shield size={12} className="text-blue-500" /> Account Role
                                    </label>
                                    <select
                                        className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                        required
                                    >
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {data.role === 'editor' && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Publication Title (Override)</label>
                                        <textarea
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            rows="2"
                                            value={
                                                data.type === 'journal' ? data.journal_title :
                                                data.type === 'conference' ? data.conference_title :
                                                data.type === 'symposium' ? data.symposium_title : ''
                                            }
                                            onChange={e => {
                                                const val = e.target.value;
                                                if (data.type === 'journal') setData('journal_title', val);
                                                else if (data.type === 'conference') setData('conference_title', val);
                                                else if (data.type === 'symposium') setData('symposium_title', val);
                                            }}
                                        ></textarea>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group mt-4"
                                    disabled={processing}
                                >
                                    <span>Create Account</span>
                                    <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Users List */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-black text-slate-800 flex items-center gap-2">
                                <LayoutDashboard size={18} className="text-blue-600" />
                                Active Accounts
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{users.length} Total</span>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            <ul className="divide-y divide-slate-50">
                                {users.map(user => (
                                    <li key={user.id} className="p-5 hover:bg-slate-50/50 transition-colors flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm group-hover:scale-110 transition-transform">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-slate-900 truncate">{user.username}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mt-0.5">
                                                {user.role} • {user.journal_title || user.conference_title || user.symposium_title || user.department?.name || 'All Access'}
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </aside>
            </motion.div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}} />
        </BackendLayout>
    );
}
