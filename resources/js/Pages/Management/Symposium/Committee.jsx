import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Committee({ symposium, members }) {
    const { data, setData, post, reset, errors } = useForm({
        name: '',
        affiliation: '',
        role: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/symposium/${symposium.id}/committee`, {
            onSuccess: () => reset()
        });
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Head title="Manage Committee" />
            <h1 className="text-2xl font-bold mb-6">Committee - {symposium.symposium_title}</h1>

            <form onSubmit={submit} className="bg-gray-50 p-6 rounded mb-8 grid grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input className="w-full border p-2 rounded" value={data.name} onChange={e => setData('name', e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm mb-1">Affiliation</label>
                    <input className="w-full border p-2 rounded" value={data.affiliation} onChange={e => setData('affiliation', e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm mb-1">Role</label>
                    <input className="w-full border p-2 rounded" value={data.role} onChange={e => setData('role', e.target.value)} />
                </div>
                <div className="col-span-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Member</button>
                </div>
            </form>

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
                                    <button className="text-red-500">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
