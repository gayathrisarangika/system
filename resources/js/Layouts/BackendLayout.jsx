import React, { useState } from 'react';
import { u } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Settings,
    LogOut,
    Menu,
    Globe,
    Send,
    UserCheck
} from 'lucide-react';

export default function BackendLayout({ children, title }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const user = auth?.user || {};
    const role = user?.role || 'guest';
    const type = user?.type || 'journal';
    const pubId = user?.publication_id || user?.department_id;

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
                                href={u("/admin/dashboard")} 
                                className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${usePage().url === u('/admin/dashboard') ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                <LayoutDashboard className="h-6 w-6 flex-shrink-0" />
                                {isSidebarOpen && <span className="ml-4 font-semibold">Dashboard</span>}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link 
                                href={u(`/editor/${type}`)} 
                                className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${usePage().url === u(`/editor/${type}`) ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                <BookOpen className="h-6 w-6 flex-shrink-0" />
                                {isSidebarOpen && <span className="ml-4 font-semibold capitalize">Manage {type}s</span>}
                            </Link>

                            {type === 'journal' && pubId && (
                                <>
                                    <Link
                                        href={u(`/editor/journal/${pubId}/submissions`)}
                                        className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${usePage().url.includes('/submissions') ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800 hover:text-white'}`}
                                    >
                                        <Send className="h-6 w-6 flex-shrink-0" />
                                        {isSidebarOpen && <span className="ml-4 font-semibold">Paper Submissions</span>}
                                    </Link>

                                    <Link
                                        href={u(`/editor/journal/${pubId}/submission-settings`)}
                                        className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${usePage().url.includes('/submission-settings') ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800 hover:text-white'}`}
                                    >
                                        <Settings className="h-6 w-6 flex-shrink-0" />
                                        {isSidebarOpen && <span className="ml-4 font-semibold">Submission Settings</span>}
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                    
                    <div className="pt-4 mt-4 border-t border-slate-700/50">
                        <Link 
                            href={u("/logout")} 
                            method="post" 
                            as="button" 
                            className="w-full flex items-center p-3 rounded-xl transition-all duration-200 text-slate-400 hover:bg-red-500/10 hover:text-red-500 group"
                        >
                            <LogOut className="h-6 w-6 flex-shrink-0" />
                            {isSidebarOpen && <span className="ml-4 font-semibold">Logout</span>}
                        </Link>
                    </div>
                </nav>

                {isSidebarOpen && (
                    <div className="p-6 bg-[#1e293b] border-t border-slate-700/50">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="ml-3 truncate">
                                <p className="text-sm font-bold text-white truncate">{user?.username || 'User'}</p>
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
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="ml-4 text-xl font-bold text-slate-800 truncate">{title}</h2>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link href={u("/")} className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                            <Globe size={16} />
                            View Website
                        </Link>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">{user?.username || 'User'}</p>
                                <p className="text-xs text-slate-500 truncate max-w-[150px]">{user?.department?.name || 'Faculty Administration'}</p>
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
