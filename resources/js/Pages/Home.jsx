import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Home({ journals, conferences, symposiums }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Home" />
            
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
                        <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Publication Management System</h1>
                    </div>
                    <Link 
                        href="/login"
                        className="bg-blue-900 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-800 transition"
                    >
                        Backend Login
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                <section className="mb-16 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Academic Publications</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Access our latest journals, conference proceedings, and symposia from the Faculty of Social Sciences and Languages.</p>
                </section>

                {journals.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">Journals</h3>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {journals.map(journal => (
                                <Link key={journal.id} href={`/journal/${journal.id}`} className="group">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                                        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                            {journal.cover_image ? (
                                                <img src={journal.cover_image} alt={journal.journal_title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 p-6 text-center italic font-serif">
                                                    {journal.journal_title}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">{journal.journal_title}</h4>
                                            <p className="text-sm text-gray-500">{journal.university_name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {conferences.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">Conferences</h3>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {conferences.map(conf => (
                                <Link key={conf.id} href={`/conference/${conf.id}`} className="group">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                                        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                            {conf.cover_image ? (
                                                <img src={conf.cover_image} alt={conf.conference_title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 p-6 text-center italic font-serif">
                                                    {conf.conference_title}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">{conf.conference_title}</h4>
                                            <p className="text-sm text-gray-500">{conf.university_name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {symposiums.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">Symposiums</h3>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {symposiums.map(symp => (
                                <Link key={symp.id} href={`/symposium/${symp.id}`} className="group">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                                        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                            {symp.cover_image ? (
                                                <img src={symp.cover_image} alt={symp.symposium_title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 p-6 text-center italic font-serif">
                                                    {symp.symposium_title}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">{symp.symposium_title}</h4>
                                            <p className="text-sm text-gray-500">{symp.university_name}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {journals.length === 0 && conferences.length === 0 && symposiums.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 italic">No approved publications available at this time.</p>
                    </div>
                )}
            </main>

            <footer className="bg-blue-900 text-white py-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="font-bold text-lg mb-2">Faculty of Social Sciences and Languages</p>
                    <p className="text-blue-200 text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
