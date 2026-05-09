import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Home({ journals, conferences, symposiums }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Home" />
            
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">P</div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-gray-900 leading-none">Publication Management System</h1>
                            <p className="text-sm text-gray-500 font-medium tracking-tight">Faculty of Social Sciences and Languages</p>
                        </div>
                    </div>
                    <Link 
                        href="/backend-login"
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
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
                                        {journal.cover_image_url ? (
                                            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                                <img 
                                                    src={journal.cover_image_url} 
                                                    alt={journal.journal_title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-[3/4] bg-blue-900 flex items-center justify-center p-6 text-center">
                                                <span className="text-white font-serif font-bold text-lg leading-tight">{journal.journal_title}</span>
                                            </div>
                                        )}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
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
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
                                        {conf.cover_image_url ? (
                                            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                                <img
                                                    src={conf.cover_image_url}
                                                    alt={conf.conference_title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-[3/4] bg-blue-900 flex items-center justify-center p-6 text-center">
                                                <span className="text-white font-serif font-bold text-lg leading-tight">{conf.conference_title}</span>
                                            </div>
                                        )}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
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
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
                                        {symp.cover_image_url ? (
                                            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                                <img
                                                    src={symp.cover_image_url}
                                                    alt={symp.symposium_title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-[3/4] bg-blue-900 flex items-center justify-center p-6 text-center">
                                                <span className="text-white font-serif font-bold text-lg leading-tight">{symp.symposium_title}</span>
                                            </div>
                                        )}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
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

            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-gray-700 pb-8 mb-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold">Publication Management System</h2>
                            <p className="text-gray-400 mt-1">Faculty of Social Sciences and Languages</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-gray-400">Sabaragamuwa University of Sri Lanka</p>
                            <p className="text-gray-400 text-sm mt-1">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
