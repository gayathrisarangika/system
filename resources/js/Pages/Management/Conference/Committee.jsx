import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import BackendLayout from '@/Layouts/BackendLayout';

export default function Committee({ conference, members }) {
    const { data, setData, post, reset, errors } = useForm({
        name: '',
        affiliation: '',
        role: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/conference/${conference.id}/committee`, {
            onSuccess: () => reset()
        });
    };

    return (
        <BackendLayout title={`Committee - ${conference.conference_title}`}>
            <Head title="Manage Committee" />
            <h1 className="text-2xl font-bold mb-8 text-slate-900">Committee - {conference.conference_title}</h1>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-12">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Add Member</h2>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input className="w-full border p-2 rounded" value={data.name} onChange={e => setData('name', e.target.value)} />
                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                </div>
                <div>
                    <label className="block text-sm mb-1">Affiliation</label>
                    <input className="w-full border p-2 rounded" value={data.affiliation} onChange={e => setData('affiliation', e.target.value)} />
                    {errors.affiliation && <div className="text-red-500 text-xs mt-1">{errors.affiliation}</div>}
                </div>
                <div>
                    <label className="block text-sm mb-1">Role</label>
                    <input className="w-full border p-2 rounded" value={data.role} onChange={e => setData('role', e.target.value)} />
                    {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role}</div>}
                </div>
                <div className="md:col-span-3">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">Add Member</button>
                </div>
            </form>
            </div>

            <div className="bg-white rounded shadow">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-4">Name</th>
                            <th className="p-4">Affiliation</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr key={member.id} className="border-b">
                                <td className="p-4">{member.name}</td>
                                <td className="p-4">{member.affiliation}</td>
                                <td className="p-4">{member.role}</td>
                                <td className="p-4 text-right">
                                    <Link href={`/editor/conference/committee/${member.id}`} method="delete" as="button" className="text-red-500">Delete</Link>
                                </td>
                            </tr>
                        ))}
                        {members.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500 italic">No committee members added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </BackendLayout>
    );
}
