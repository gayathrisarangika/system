import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Proceedings({ conference, proceedings }) {
    const { data, setData, post, reset, errors } = useForm({
        year: '',
        version: '',
        pdf_link: null,
        cover_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/conference/${conference.id}/proceedings`, {
            onSuccess: () => reset()
        });
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <Head title="Manage Proceedings" />
            <h1 className="text-2xl font-bold mb-6">Proceedings - {conference.conference_title}</h1>

            <form onSubmit={submit} className="bg-gray-50 p-6 rounded mb-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1">Year</label>
                        <input type="number" className="w-full border p-2 rounded" value={data.year} onChange={e => setData('year', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Version/Title</label>
                        <input className="w-full border p-2 rounded" value={data.version} onChange={e => setData('version', e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1">PDF File</label>
                        <input type="file" onChange={e => setData('pdf_link', e.target.files[0])} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Cover Image</label>
                        <input type="file" onChange={e => setData('cover_image', e.target.files[0])} />
                    </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Proceeding</button>
            </form>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proceedings.map(p => (
                    <div key={p.id} className="bg-white rounded shadow p-4 flex gap-4">
                        <img src={p.cover_image} className="w-24 h-32 object-cover rounded" />
                        <div>
                            <h3 className="font-bold">{p.version}</h3>
                            <p className="text-sm text-gray-500">{p.year}</p>
                            <div className="mt-4">
                                <a href={p.pdf_link} target="_blank" className="text-blue-600 text-sm">View PDF</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
