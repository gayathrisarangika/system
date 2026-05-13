import React from 'react';
import { Head, Link } from '@inertiajs/react';
import BackendLayout from '@/Layouts/BackendLayout';

export default function Editor({ type, user }) {
    const dashboardTitle = type.charAt(0).toUpperCase() + type.slice(1) + " Editor Dashboard";

    return (
        <BackendLayout title={dashboardTitle}>
            <Head title={dashboardTitle} />
            
            <div className="bg-white rounded-2xl shadow-sm p-10 border border-slate-200/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Welcome back, {user.username}!</h2>
                    <p className="text-lg text-slate-500 mb-10 max-w-2xl">You are logged in as a {type} editor. Use the dashboard to manage your publications, issues, and editorial board.</p>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <Link 
                            href={`/editor/${type}`}
                            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Manage {type}s</h3>
                            <p className="text-slate-500 leading-relaxed">Update publication details, mission, and scope for your assigned {type}s.</p>
                        </Link>
                    </div>
                </div>
            </div>
        </BackendLayout>
    );
}
