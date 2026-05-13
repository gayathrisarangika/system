import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function BackendLayout({ children, title }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const user = auth.user;
    const role = user.role;
    const type = user.type;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#0f172a] text-slate-300 transition-all duration-300 ease-in-out flex flex-col shadow-2xl z-50`}>
                <div className="h-20 flex items-center px-6 bg-[#1e293b] border-b border-slate-700/50">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 flex-shrink-0">
                        P
                    </div>
                    {isSidebarOpen && (
                        <span className="ml-4 font-bold text-lg text-white tracking-tight truncate">PMS Admin</span>
                    )}
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {role === 'admin' ? (
                        <>
                            <Link 
                                href="/admin/dashboard" 
                                className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${usePage().url === '/admin/dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                {isSidebarOpen && <span className="ml-4 font-semibold">Dashboard</span>}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link 
                                href={`/editor/${type}`} 
                                className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${usePage().url.startsWith(`/editor/${type}`) ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                {isSidebarOpen && <span className="ml-4 font-semibold capitalize">Manage {type}s</span>}
                            </Link>
                        </>
                    )}
                    
                    <div className="pt-4 mt-4 border-t border-slate-700/50">
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button" 
                            className="w-full flex items-center p-3 rounded-xl transition-all duration-200 text-slate-400 hover:bg-red-500/10 hover:text-red-500 group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            {isSidebarOpen && <span className="ml-4 font-semibold">Logout</span>}
                        </Link>
                    </div>
                </nav>

                {isSidebarOpen && (
                    <div className="p-6 bg-[#1e293b] border-t border-slate-700/50">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3 truncate">
                                <p className="text-sm font-bold text-white truncate">{user.username}</p>
                                <p className="text-xs text-slate-400 truncate capitalize">{role}</p>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="ml-4 text-xl font-bold text-slate-800 truncate">{title}</h2>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">View Website</Link>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">{user.username}</p>
                                <p className="text-xs text-slate-500 truncate max-w-[150px]">{user.department?.name || 'Faculty Administration'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}} />
        </div>
    );
}
