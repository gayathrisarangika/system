import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Conference({ conference }) {
    return (
        <div className="min-h-screen bg-white">
            <Head title={conference.conference_title} />
            
            <header className="bg-gray-100 py-10 px-6 flex justify-between items-center border-b">
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-gray-900">{conference.conference_title}</h1>
                    <h3 className="text-xl text-blue-900 mt-2">{conference.university_name}</h3>
                </div>
                {conference.university_logo && (
                    <div className="hidden md:block">
                        <img src={conference.university_logo} alt="Logo" className="max-h-32" />
                    </div>
                )}
            </header>

            <nav className="bg-blue-900 text-white flex justify-center gap-8 py-3 sticky top-0 z-10 shadow-md">
                <Link href={`/conference/${conference.id}`} className="hover:text-blue-200 font-medium">Home</Link>
                <a href="#committee" className="hover:text-blue-200 font-medium">Organizing Committee</a>
                <a href="#proceedings" className="hover:text-blue-200 font-medium">Proceedings</a>
            </nav>

            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-900 pb-2 inline-block">About the Conference</h2>
                        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {conference.conference_details}
                        </div>
                    </div>

                    <div className="lg:w-1/3 flex flex-col gap-8">
                        {conference.cover_image && (
                            <img src={conference.cover_image} alt="Conference Cover" className="w-full rounded-lg shadow-2xl" />
                        )}

                        <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-900 shadow-sm">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Aim & Scope</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{conference.aim_scope}</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-900 shadow-sm">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Mission</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{conference.mission}</p>
                        </div>
                    </div>
                </div>

                {conference.proceedings && conference.proceedings.length > 0 && (
                    <div className="mt-20" id="proceedings">
                        <h3 className="text-2xl font-bold text-blue-900 mb-8">Recent Proceedings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {conference.proceedings.map(p => (
                                <div key={p.id} className="flex bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                                    <div className="w-1/3">
                                        <img 
                                            src={p.cover_image} 
                                            alt={p.version} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="w-2/3 p-4 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900">{p.version}</h4>
                                            <p className="text-gray-600">{p.year}</p>
                                        </div>
                                        <div className="mt-4">
                                            <a 
                                                href={p.pdf_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Download PDF
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-gray-100 py-12 mt-20 border-t">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{conference.conference_title}</h2>
                    <p className="mt-4 text-gray-500">&copy; {new Date().getFullYear()} {conference.university_name}</p>
                </div>
            </footer>
        </div>
    );
}
