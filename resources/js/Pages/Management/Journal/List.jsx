import React from 'react';
import { Head, Link } from '@inertiajs/react';
import BackendLayout from '@/Layouts/BackendLayout';

export default function List({ journals }) {
    return (
        <BackendLayout title="Manage Journals">
            <Head title="Manage Journals" />
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Your Journals</h1>
                    <p className="text-slate-500">Manage your journal publications and issues</p>
                </div>
                <Link href="/editor/journal/create" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">Add Journal</Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Journal Title</th>
                            <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Status</th>
                            <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {journals.length > 0 ? journals.map(journal => (
                            <tr key={journal.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{journal.journal_title}</div>
                                    <div className="text-xs text-gray-400">ID: #{journal.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                        journal.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                        journal.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {journal.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-3 font-bold text-sm">
                                        <Link href={`/journal/${journal.id}`} className="text-blue-900 hover:underline">View Website</Link>
                                        <Link href={`/editor/journal/${journal.id}/edit`} className="text-gray-600 hover:underline">Edit</Link>
                                        <Link href={`/editor/journal/${journal.id}/issues`} className="text-green-600 hover:underline">Issues</Link>
                                        <Link href={`/editor/journal/${journal.id}/board`} className="text-purple-600 hover:underline">Board</Link>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="3" className="p-10 text-center text-gray-400 italic">No journals found for your department.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </BackendLayout>
    );
}
