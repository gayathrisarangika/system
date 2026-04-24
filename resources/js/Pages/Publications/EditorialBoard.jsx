import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function EditorialBoard({ journal }) {
    return (
        <div className="min-h-screen bg-white">
            <Head title={`Editorial Board - ${journal.journal_title}`} />
            
            <header className="bg-gray-100 py-10 px-6 text-center border-b">
                <h1 className="text-4xl font-bold text-gray-900">{journal.journal_title}</h1>
                <h2 className="text-2xl text-blue-900 mt-2 font-semibold">Editorial Board</h2>
            </header>

            <nav className="bg-blue-900 text-white flex justify-center gap-8 py-3 sticky top-0 z-10 shadow-md">
                <Link href={`/journal/${journal.id}`} className="hover:text-blue-200 font-medium">Home</Link>
                <Link href={`/journal/${journal.id}/editorial-board`} className="hover:text-blue-200 font-medium">Editorial Board</Link>
                <Link href={`/journal/${journal.id}/archive`} className="hover:text-blue-200 font-medium">Issue Archive</Link>
            </nav>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-6 text-gray-600 font-bold uppercase tracking-wider text-sm">Name</th>
                                <th className="p-6 text-gray-600 font-bold uppercase tracking-wider text-sm">Affiliation</th>
                                <th className="p-6 text-gray-600 font-bold uppercase tracking-wider text-sm">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {journal.editorial_board && journal.editorial_board.length > 0 ? (
                                journal.editorial_board.map(member => (
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
            </main>
        </div>
    );
}
