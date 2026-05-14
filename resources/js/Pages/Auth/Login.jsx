import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Lock,
    User,
    ArrowRight,
    ShieldCheck,
    AlertCircle,
    ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Login({ pub_id, type }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        pub_id: pub_id || '',
        type: type || 'journal',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative overflow-hidden">
            <Head title="Secure Portal Login | PMS" />

            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[120px]"></div>
            </div>

            <main className="flex-grow flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden"
                    >
                        <div className="p-10 border-b border-slate-100 bg-gradient-to-br from-slate-50/50 to-white/50 text-center">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-slate-900/10"
                            >
                                <ShieldCheck size={32} />
                            </motion.div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Portal Login</h1>
                            <p className="text-slate-500 text-sm font-medium mt-1">Authorized personnel only</p>
                        </div>

                        <div className="p-10">
                            {errors.username && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
                                >
                                    <AlertCircle size={18} />
                                    {errors.username}
                                </motion.div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold"
                                            placeholder="Enter your username"
                                            value={data.username}
                                            onChange={e => setData('username', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2 ml-1">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                                        <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">Forgot?</Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold"
                                            placeholder="••••••••"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={processing}
                                >
                                    Login to Portal
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    <div className="mt-8 flex flex-col items-center gap-6">
                        <Link
                            href={pub_id ? "/backend-selection?type=" + type : "/backend-login"}
                            className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                        >
                            <ChevronLeft size={16} />
                            Change Portal Type
                        </Link>

                        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} Sabaragamuwa University of Sri Lanka
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
