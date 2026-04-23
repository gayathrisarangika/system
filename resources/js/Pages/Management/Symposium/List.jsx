import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function List({ symposiums }) {
    return (
        <div className="p-8">
            <Head title="Manage Symposiums" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Symposiums</h1>
                <Link href="/editor/symposium/create" className="bg-blue-600 text-white px-4 py-2 rounded">Add Symposium</Link>
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
                        {symposiums.map(symp => (
                            <tr key={symp.id}>
                                <td className="px-6 py-4">{symp.symposium_title}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link href={`/editor/symposium/${symp.id}/edit`} className="text-blue-600">Edit</Link>
                                    <Link href={`/editor/symposium/${symp.id}/proceedings`} className="text-green-600">Proceedings</Link>
                                    <Link href={`/editor/symposium/${symp.id}/committee`} className="text-purple-600">Committee</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
