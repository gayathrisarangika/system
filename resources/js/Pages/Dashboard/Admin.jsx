import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Admin({ pendingJournals, pendingConferences, pendingSymposiums }) {
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <Head title="Admin Dashboard" />
            <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <Link href="/logout" method="post" as="button" className="text-red-600 font-semibold">Logout</Link>
            </header>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-4">Pending Journals</h2>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {pendingJournals.map(j => (
                                    <tr key={j.id}>
                                        <td className="p-4">{j.journal_title}</td>
                                        <td className="p-4">{j.department.name}</td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/approve/journal/${j.id}`} method="post" as="button" className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4">Pending Conferences</h2>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {pendingConferences.map(c => (
                                    <tr key={c.id}>
                                        <td className="p-4">{c.conference_title}</td>
                                        <td className="p-4">{c.department.name}</td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/approve/conference/${c.id}`} method="post" as="button" className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}
