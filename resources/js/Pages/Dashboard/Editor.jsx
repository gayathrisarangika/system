import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Editor({ type, user }) {
    const dashboardTitle = type.charAt(0).toUpperCase() + type.slice(1) + " Editor Dashboard";

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Head title={dashboardTitle} />
            
            {/* Sidebar */}
            <aside className="w-64 bg-blue-900 text-white">
                <div className="p-6 border-b border-blue-800">
                    <h2 className="text-xl font-bold">PMS Editor</h2>
                </div>
                <nav className="p-4 space-y-2">
                    <Link 
                        href={`/editor/${type}`}
                        className="block py-2.5 px-4 rounded transition hover:bg-blue-800"
                    >
                        Manage {type}s
                    </Link>
                    <Link 
                        href="/logout" 
                        method="post" 
                        as="button" 
                        className="w-full text-left py-2.5 px-4 rounded transition hover:bg-red-800 text-red-300"
                    >
                        Logout
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">{dashboardTitle}</h1>
                    <div className="text-right">
                        <p className="font-medium text-gray-900">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.department?.name}</p>
                    </div>
                </header>

                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Welcome back!</h2>
                    <p className="text-gray-600 mb-8">Select an option from the sidebar to manage your publications.</p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                            <h3 className="font-bold text-blue-900 mb-2">Manage {type}s</h3>
                            <p className="text-sm text-blue-700 mb-4">Update details, mission, and scope.</p>
                            <Link href={`/editor/${type}`} className="text-blue-600 font-bold hover:underline">Go &rarr;</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
