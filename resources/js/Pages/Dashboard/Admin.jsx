import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Admin({ pendingJournals, pendingConferences, pendingSymposiums, departments, users }) {
    const { data, setData, post, reset, errors, processing } = useForm({
        name: '',
        email: '',
        username: '',
        password: '',
        department_id: '',
        role: 'editor',
        journal_title: '',
    });

    const submitUser = (e) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => reset('name', 'email', 'username', 'password'),
        });
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <Head title="Admin Dashboard" />

            <header className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-200 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-serif">Admin Dashboard</h1>
                    <p className="text-gray-500">Review and manage pending publications & users</p>
                </div>
                <Link href="/logout" method="post" as="button" className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-red-50 hover:text-red-600 transition">Logout</Link>
            </header>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <section className="lg:col-span-2 space-y-12">
                    {/* Pending Publications */}
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
                </section>

                <aside className="space-y-8">
                    {/* User Creation Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Create New Editor</h2>
                        <form onSubmit={submitUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    className="w-full border rounded-lg p-2"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full border rounded-lg p-2"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    className="w-full border rounded-lg p-2"
                                    value={data.username}
                                    onChange={e => setData('username', e.target.value)}
                                    required
                                />
                                {errors.username && <div className="text-red-500 text-xs mt-1">{errors.username}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    className="w-full border rounded-lg p-2"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    className="w-full border rounded-lg p-2"
                                    value={data.department_id}
                                    onChange={e => setData('department_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                                {errors.department_id && <div className="text-red-500 text-xs mt-1">{errors.department_id}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full border rounded-lg p-2"
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            {data.role === 'editor' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Journal Title</label>
                                    <input
                                        className="w-full border rounded-lg p-2"
                                        value={data.journal_title}
                                        onChange={e => setData('journal_title', e.target.value)}
                                        placeholder="Enter the journal name for this editor"
                                    />
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-[#1f3a5f] text-white py-2 rounded-lg font-bold hover:bg-blue-800 transition disabled:opacity-50"
                                disabled={processing}
                            >
                                Create User
                            </button>
                        </form>
                    </div>

                    {/* Users List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <h3 className="p-4 font-bold bg-gray-50 border-b">Existing Users</h3>
                        <div className="max-h-96 overflow-y-auto">
                            <ul className="divide-y divide-gray-100">
                                {users.map(user => (
                                    <li key={user.id} className="p-4">
                                        <div className="font-bold text-sm">{user.username}</div>
                                        <div className="text-xs text-gray-500">{user.role} - {user.department?.name || 'All'}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
