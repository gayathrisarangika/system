import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function List({ journals }) {
    return (
        <div className="p-8">
            <Head title="Manage Journals" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Journals</h1>
                <Link href="/editor/journal/create" className="bg-blue-600 text-white px-4 py-2 rounded">Add Journal</Link>
            </div>
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left">Title</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {journals.map(journal => (
                            <tr key={journal.id}>
                                <td className="px-6 py-4">{journal.journal_title}</td>
                                <td className="px-6 py-4 capitalize">{journal.status}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link href={`/editor/journal/${journal.id}/edit`} className="text-blue-600">Edit</Link>
                                    <Link href={`/editor/journal/${journal.id}/issues`} className="text-green-600">Issues</Link>
                                    <Link href={`/editor/journal/${journal.id}/board`} className="text-purple-600">Board</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
