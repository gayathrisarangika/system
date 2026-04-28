import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function BackendSelector() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title="Publication Management System" />
            
            <header className="bg-[#1f3a5f] text-white text-center py-8 px-4">
                <h1 className="text-3xl font-bold">Publication Management System</h1>
                <p className="mt-2 opacity-90 text-sm">Faculty of Social Sciences and Languages</p>
            </header>

            <main className="flex-grow flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md text-center">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Select Publication Type</h2>

                    <div className="space-y-3">
                        <Link
                            href="/backend-selection?type=journal"
                            className="block w-full py-3 bg-[#1f3a5f] text-white rounded-md hover:bg-[#2c5282] transition"
                        >
                            Journal
                        </Link>
                        <Link
                            href="/backend-selection?type=conference"
                            className="block w-full py-3 bg-[#1f3a5f] text-white rounded-md hover:bg-[#2c5282] transition"
                        >
                            Conference
                        </Link>
                        <Link
                            href="/backend-selection?type=symposium"
                            className="block w-full py-3 bg-[#1f3a5f] text-white rounded-md hover:bg-[#2c5282] transition"
                        >
                            Symposium
                        </Link>
                    </div>

                    <div className="mt-8">
                        <Link 
                            href="/login"
                            className="inline-block w-full py-3 border-2 border-[#1f3a5f] text-[#1f3a5f] font-bold rounded-md hover:bg-gray-50 transition"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="bg-[#1f3a5f] text-white text-center py-4 text-sm mt-auto">
                <p>&copy; {new Date().getFullYear()} Faculty of Social Sciences and Languages</p>
            </footer>
        </div>
    );
}
