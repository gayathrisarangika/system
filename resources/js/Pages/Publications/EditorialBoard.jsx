import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function EditorialBoard({ journal, conference, symposium }) {
    const publication = journal || conference || symposium;
    const type = journal ? 'journal' : (conference ? 'conference' : 'symposium');
    const title = publication.journal_title || publication.conference_title || publication.symposium_title;
    const board = publication.editorial_board || publication.committee;
    const boardTitle = journal ? 'Editorial Board' : 'Organizing Committee';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={`${boardTitle} - ${title}`} />
            
            {/* Header */}
            <header className="bg-white border-b py-8 shadow-sm">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-blue-900 leading-tight">{title}</h1>
                        <p className="text-lg text-gray-600 mt-2 uppercase tracking-widest font-medium">{publication.university_name}</p>
                    </div>
                    {publication.university_logo_url && (
                        <div className="flex-shrink-0">
                            <img src={publication.university_logo_url} alt="University Logo" className="h-20 object-contain" />
                        </div>
                    )}
                </div>
            </header>

            {/* Navigation Bar */}
            <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center md:justify-start">
                        <Link href={`/${type}/${publication.id}`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Home</Link>
                        <Link href={`/${type}/${publication.id}/committee`} className="px-6 py-4 bg-blue-800 transition font-medium border-r border-blue-800">Committee</Link>
                        <Link href={`/${type}/${publication.id}/current`} className="px-6 py-4 hover:bg-blue-800 transition font-medium border-r border-blue-800">Current</Link>
                        <Link href={`/${type}/${publication.id}/archive`} className="px-6 py-4 hover:bg-blue-800 transition font-medium">Archive</Link>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12 flex-1">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-blue-900 inline-block">{boardTitle}</h2>
                    
                    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="p-6 text-gray-600 font-bold uppercase tracking-wider text-sm">Name</th>
                                    <th className="p-6 text-gray-600 font-bold uppercase tracking-wider text-sm">Affiliation</th>
                                    <th className="p-6 text-gray-600 font-bold uppercase tracking-wider text-sm">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {board && board.length > 0 ? (
                                    board.map(member => (
                                        <tr key={member.id} className="hover:bg-blue-50 transition">
                                            <td className="p-6 font-medium text-gray-900">{member.name}</td>
                                            <td className="p-6 text-gray-700">{member.affiliation}</td>
                                            <td className="p-6 text-gray-700">{member.role}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-12 text-center text-gray-400 italic">No members found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-10">
                <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} {publication.university_name}. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}
