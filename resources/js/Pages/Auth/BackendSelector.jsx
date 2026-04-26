import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function BackendSelector({ departments }) {
    const [selectedType, setSelectedType] = useState(null);

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
                        <button
                            onClick={() => setSelectedType('journal')}
                            className="w-full py-3 bg-[#1f3a5f] text-white rounded-md hover:bg-[#2c5282] transition"
                        >
                            Journal
                        </button>
                        <button
                            onClick={() => setSelectedType('conference')}
                            className="w-full py-3 bg-[#1f3a5f] text-white rounded-md hover:bg-[#2c5282] transition"
                        >
                            Conference
                        </button>
                        <button
                            onClick={() => setSelectedType('symposium')}
                            className="w-full py-3 bg-[#1f3a5f] text-white rounded-md hover:bg-[#2c5282] transition"
                        >
                            Symposium
                        </button>
                    </div>

                    <div className="mt-8">
                        <Link
                            href="/login"
                            className="inline-block w-full py-3 border-2 border-[#1f3a5f] text-[#1f3a5f] font-bold rounded-md hover:bg-gray-50 transition"
                        >
                            Admin Login
                        </Link>
                    </div>

                    {selectedType && (
                        <div className="mt-8 pt-6 border-t border-gray-200 text-left">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Select Department</h3>
                            <div className="space-y-2">
                                {departments.map(dept => (
                                    <Link
                                        key={dept.id}
                                        href={`/department?id=${dept.id}&type=${selectedType}`}
                                        className="block py-2 text-[#1f3a5f] hover:underline text-sm"
                                    >
                                        {dept.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-[#1f3a5f] text-white text-center py-4 text-sm mt-auto">
                <p>&copy; {new Date().getFullYear()} Faculty of Social Sciences and Languages</p>
            </footer>
        </div>
    );
}
