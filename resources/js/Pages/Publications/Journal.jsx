import React from 'react';
import { Head, Link } from '@inertiajs/react';
import RecentPublicationsCarousel from '@/Components/RecentPublicationsCarousel';

export default function Journal({ journal }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={journal.journal_title} />
            
            {/* Header */}
            <header className="bg-white border-b py-8 shadow-sm">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 leading-tight">{journal.journal_title}</h1>
                        <p className="text-lg text-gray-600 mt-2 uppercase tracking-widest font-medium">{journal.university_name}</p>
                    </div>
                    {journal.university_logo_url && (
                        <div className="flex-shrink-0">
                            <img src={journal.university_logo_url} alt="University Logo" className="h-28 object-contain" />
                        </div>
                    )}
                </div>
            </header>

            {/* Navigation Bar */}
            <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center md:justify-start">
                        <Link href={`/journal/${journal.id}`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Home</Link>
                        <Link href={`/journal/${journal.id}`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">About</Link>
                        <Link href={`/journal/${journal.id}/editorial-board`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Editorial</Link>
                        <Link href={`/journal/${journal.id}/current`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Current</Link>
                        <Link href={`/journal/${journal.id}/archive`} className="px-6 py-4 hover:bg-blue-800 transition font-medium">Archive</Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-10 flex-1">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Main Content */}
                    <div className="flex-1 flex flex-col gap-10">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                            <section>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-900 inline-block">About the Journal</h2>
                                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                                    {journal.journal_details || "No description available."}
                                </div>
                            </section>
                        </div>

                        {journal.issues && journal.issues.length > 0 && (
                            <RecentPublicationsCarousel
                                title="Recent Publications"
                                items={journal.issues.map(i => ({ ...i, type: 'issue' }))}
                            />
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 flex flex-col gap-8">
                        {journal.cover_image_url && (
                            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                                <img src={journal.cover_image_url} alt={journal.journal_title} className="w-full h-auto" />
                            </div>
                        )}

                        <div className="bg-blue-900 text-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4 border-b border-blue-700 pb-2">Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-blue-300 uppercase tracking-wider mb-1 font-bold">ISSN</p>
                                    <p className="text-lg font-mono tracking-tight">{journal.issn || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-300 uppercase tracking-wider mb-1 font-bold">Online ISSN</p>
                                    <p className="text-lg font-mono tracking-tight">{journal.online_issn || "N/A"}</p>
                                </div>
                                <ul className="space-y-3 text-blue-100 pt-2 border-t border-blue-800">
                                    {journal.for_authors_url ? (
                                        <li><a href={journal.for_authors_url} target="_blank" className="hover:text-white transition flex items-center gap-2 font-bold">Author Guidelines (PDF)</a></li>
                                    ) : (
                                        <li className="opacity-50 flex items-center gap-2">Author Guidelines (Pending)</li>
                                    )}
                                    {journal.for_reviewers_url ? (
                                        <li><a href={journal.for_reviewers_url} target="_blank" className="hover:text-white transition flex items-center gap-2 font-bold">Reviewer Guidelines (PDF)</a></li>
                                    ) : (
                                        <li className="opacity-50 flex items-center gap-2">Reviewer Guidelines (Pending)</li>
                                    )}
                                    {journal.editorial_policies_url ? (
                                        <li><a href={journal.editorial_policies_url} target="_blank" className="hover:text-white transition flex items-center gap-2 font-bold">Editorial Policies (PDF)</a></li>
                                    ) : (
                                        <li className="opacity-50 flex items-center gap-2">Editorial Policies (Pending)</li>
                                    )}
                                    <li><Link href={`/journal/${journal.id}/contact`} className="hover:text-white transition flex items-center gap-2 font-bold">Contact Us</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Aim & Scope</h3>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {journal.aim_scope || "Information pending."}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Mission</h3>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {journal.mission || "Information pending."}
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
                            <h2 className="text-2xl font-bold">{journal.journal_title}</h2>
                            <p className="text-gray-400 mt-1">{journal.university_name}</p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-gray-400">Powered by Publication Management System</p>
                            <p className="text-gray-400 text-sm mt-1">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                        <Link href="#" className="hover:text-gray-300">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gray-300">Terms & Conditions</Link>
                        <Link href="#" className="hover:text-gray-300">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
