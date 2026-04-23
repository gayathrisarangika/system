import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function List({ conferences }) {
    return (
        <div className="p-8">
            <Head title="Manage Conferences" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Conferences</h1>
                <Link href="/editor/conference/create" className="bg-blue-600 text-white px-4 py-2 rounded">Add Conference</Link>
            </div>
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left">Title</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {conferences.map(conf => (
                            <tr key={conf.id}>
                                <td className="px-6 py-4">{conf.conference_title}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link href={`/editor/conference/${conf.id}/edit`} className="text-blue-600">Edit</Link>
                                    <Link href={`/editor/conference/${conf.id}/proceedings`} className="text-green-600">Proceedings</Link>
                                    <Link href={`/editor/conference/${conf.id}/committee`} className="text-purple-600">Committee</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
