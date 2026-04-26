import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Admin({ pendingJournals, pendingConferences, pendingSymposiums }) {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <Head title="Admin Dashboard" />
            <header className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-200 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-serif">Admin Dashboard</h1>
                    <p className="text-gray-500">Review and manage pending publications</p>
                </div>
                <Link href="/logout" method="post" as="button" className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-red-50 hover:text-red-600 transition">Logout</Link>
            </header>

            <div className="space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-8 bg-blue-900 rounded-full"></span>
                            Pending Journals
                        </h2>
                        <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">{pendingJournals.length}</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Title</th>
                                    <th className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Department</th>
                                    <th className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {pendingJournals.length > 0 ? pendingJournals.map(j => (
                                    <tr key={j.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{j.journal_title}</div>
                                            <div className="text-xs text-gray-400">ID: #{j.id}</div>
                                        </td>
                                        <td className="p-4 text-gray-600">{j.department.name}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/journal/${j.id}`} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded text-sm font-bold hover:bg-gray-200 transition">Preview</Link>
                                                <Link href={`/admin/approve/journal/${j.id}`} method="post" as="button" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-green-700 transition">Approve</Link>
                                                <Link href={`/admin/reject/journal/${j.id}`} method="post" as="button" className="bg-red-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-red-700 transition">Reject</Link>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="p-10 text-center text-gray-400 italic">No pending journals.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-8 bg-green-700 rounded-full"></span>
                            Pending Conferences
                        </h2>
                        <span className="bg-green-100 text-green-900 px-3 py-1 rounded-full text-sm font-bold">{pendingConferences.length}</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Title</th>
                                    <th className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Department</th>
                                    <th className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {pendingConferences.length > 0 ? pendingConferences.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-bold text-gray-900">{c.conference_title}</td>
                                        <td className="p-4 text-gray-600">{c.department.name}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/conference/${c.id}`} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded text-sm font-bold hover:bg-gray-200 transition">Preview</Link>
                                                <Link href={`/admin/approve/conference/${c.id}`} method="post" as="button" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-green-700 transition">Approve</Link>
                                                <Link href={`/admin/reject/conference/${c.id}`} method="post" as="button" className="bg-red-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-red-700 transition">Reject</Link>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="p-10 text-center text-gray-400 italic">No pending conferences.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-8 bg-purple-700 rounded-full"></span>
                            Pending Symposiums
                        </h2>
                        <span className="bg-purple-100 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">{pendingSymposiums.length}</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Title</th>
                                    <th className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Department</th>
                                    <th className="p-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {pendingSymposiums.length > 0 ? pendingSymposiums.map(s => (
                                    <tr key={s.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-bold text-gray-900">{s.symposium_title}</td>
                                        <td className="p-4 text-gray-600">{s.department.name}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/symposium/${s.id}`} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded text-sm font-bold hover:bg-gray-200 transition">Preview</Link>
                                                <Link href={`/admin/approve/symposium/${s.id}`} method="post" as="button" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-green-700 transition">Approve</Link>
                                                <Link href={`/admin/reject/symposium/${s.id}`} method="post" as="button" className="bg-red-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-red-700 transition">Reject</Link>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="p-10 text-center text-gray-400 italic">No pending symposiums.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}
