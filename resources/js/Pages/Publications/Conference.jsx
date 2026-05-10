import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Conference({ conference }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={conference.conference_title} />
            
            {/* Header */}
            <header className="bg-white border-b py-8 shadow-sm">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 leading-tight">{conference.conference_title}</h1>
                        <p className="text-lg text-gray-600 mt-2 uppercase tracking-widest font-medium">{conference.university_name}</p>
                    </div>
                    {conference.university_logo_url && (
                        <div className="flex-shrink-0">
                            <img src={conference.university_logo_url} alt="University Logo" className="h-28 object-contain" />
                        </div>
                    )}
                </div>
            </header>

            {/* Navigation Bar */}
            <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center md:justify-start">
                        <Link href={`/conference/${conference.id}`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Home</Link>
                        <Link href={`/conference/${conference.id}`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">About</Link>
                        <Link href={`/conference/${conference.id}/committee`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Committee</Link>
                        <Link href={`/conference/${conference.id}/current`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Current</Link>
                        <Link href={`/conference/${conference.id}/archive`} className="px-6 py-4 hover:bg-blue-800 transition font-medium">Archive</Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-10 flex-1">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Main Content */}
                    <div className="flex-1 flex flex-col gap-10">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-900 inline-block">About the Conference</h2>
                                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                                    {conference.conference_details || "No description available."}
                                </div>
                            </section>

                            {conference.proceedings && conference.proceedings.length > 0 && (
                                <section>
                                    <h3 className="text-2xl font-bold text-blue-900 mb-6">Recent Proceedings</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                        {conference.proceedings.map(p => (
                                            <Link key={p.id} href={`/conference/${conference.id}/archive`} className="group flex flex-col">
                                                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-100 mb-3 group-hover:shadow-md transition-shadow">
                                                    {p.cover_image_url ? (
                                                        <img src={p.cover_image_url} alt={p.version} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center p-4 text-center bg-blue-50">
                                                            <span className="text-blue-900 font-serif font-bold text-sm">{p.version}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="font-bold text-gray-800 group-hover:text-blue-900 transition-colors text-center">
                                                    {p.version} ({p.year})
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 flex flex-col gap-8">
                        {conference.cover_image_url && (
                            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                                <img src={conference.cover_image_url} alt={conference.conference_title} className="w-full h-auto" />
                            </div>
                        )}

                        <div className="bg-blue-900 text-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4 border-b border-blue-700 pb-2">Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-blue-300 uppercase tracking-wider mb-1 font-bold">ISSN</p>
                                    <p className="text-lg font-mono tracking-tight">{conference.issn || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-300 uppercase tracking-wider mb-1 font-bold">Online ISSN</p>
                                    <p className="text-lg font-mono tracking-tight">{conference.online_issn || "N/A"}</p>
                                </div>
                                <ul className="space-y-3 text-blue-100 pt-2 border-t border-blue-800">
                                    {conference.for_authors_url ? (
                                        <li><a href={conference.for_authors_url} target="_blank" className="hover:text-white transition flex items-center gap-2 font-bold">Author Guidelines (PDF)</a></li>
                                    ) : (
                                        <li className="opacity-50 flex items-center gap-2">Author Guidelines (Pending)</li>
                                    )}
                                    {conference.for_reviewers_url ? (
                                        <li><a href={conference.for_reviewers_url} target="_blank" className="hover:text-white transition flex items-center gap-2 font-bold">Reviewer Guidelines (PDF)</a></li>
                                    ) : (
                                        <li className="opacity-50 flex items-center gap-2">Reviewer Guidelines (Pending)</li>
                                    )}
                                    {conference.editorial_policies_url ? (
                                        <li><a href={conference.editorial_policies_url} target="_blank" className="hover:text-white transition flex items-center gap-2 font-bold">Editorial Policies (PDF)</a></li>
                                    ) : (
                                        <li className="opacity-50 flex items-center gap-2">Editorial Policies (Pending)</li>
                                    )}
                                    <li><Link href={`/conference/${conference.id}/contact`} className="hover:text-white transition flex items-center gap-2 font-bold">Contact Us</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Aim & Scope</h3>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {conference.aim_scope || "Information pending."}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Mission</h3>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {conference.mission || "Information pending."}
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-gray-700 pb-8 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold">{conference.conference_title}</h2>
                            <p className="text-gray-400 mt-1">{conference.university_name}</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-gray-400">Powered by Publication Management System</p>
                            <p className="text-gray-400 text-sm mt-1">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
