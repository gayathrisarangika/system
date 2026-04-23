import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Home({ departments }) {
    const [selectedType, setSelectedType] = useState(null);

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Home" />

            <header className="bg-blue-900 text-white py-12 text-center shadow-xl">
                <h1 className="text-4xl font-extrabold tracking-tight">Publication Management System</h1>
                <p className="mt-4 text-xl text-blue-200">Faculty of Social Sciences and Languages</p>
            </header>

            <main className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden p-10">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Select Publication Type</h2>

                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        {['journal', 'conference', 'symposium'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg capitalize transition-all duration-300 transform hover:scale-105 shadow-md ${
                                    selectedType === type
                                    ? 'bg-blue-600 text-white ring-4 ring-blue-300'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 text-center border-t border-gray-100 pt-8">
                        <Link
                            href="/login"
                            className="inline-block bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-900 transition shadow-lg"
                        >
                            Admin Login
                        </Link>
                    </div>

                    {selectedType && (
                        <div className="mt-12 animate-fade-in">
                            <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-2">Select Department</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {departments.map((dept) => (
                                    <Link
                                        key={dept.id}
                                        href={`/department?id=${dept.id}&type=${selectedType}`}
                                        className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition flex justify-between items-center group shadow-sm"
                                    >
                                        <span className="font-medium text-gray-800 group-hover:text-blue-700">{dept.name}</span>
                                        <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-white border-t py-8 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Faculty of Social Sciences and Languages</p>
            </footer>
        </div>
    );
}
