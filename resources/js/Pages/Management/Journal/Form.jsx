import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ journal = null }) {
    const { data, setData, post, processing, errors } = useForm({
        journal_title: journal?.journal_title || '',
        university_name: journal?.university_name || '',
        journal_details: journal?.journal_details || '',
        aim_scope: journal?.aim_scope || '',
        mission: journal?.mission || '',
        cover_image: null,
        university_logo: null,
        _method: journal ? 'PUT' : 'POST'
    });

    const submit = (e) => {
        e.preventDefault();
        if (journal) {
            post(`/editor/journal/${journal.id}`);
        } else {
            post('/editor/journal');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Head title={journal ? 'Edit Journal' : 'Create Journal'} />
            <h1 className="text-2xl font-bold mb-6">{journal ? 'Edit' : 'Create'} Journal</h1>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block mb-1">Journal Title</label>
                    <input className="w-full border p-2 rounded" value={data.journal_title} onChange={e => setData('journal_title', e.target.value)} />
                    {errors.journal_title && <div className="text-red-500 text-sm">{errors.journal_title}</div>}
                </div>
                <div>
                    <label className="block mb-1">University Name</label>
                    <input className="w-full border p-2 rounded" value={data.university_name} onChange={e => setData('university_name', e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1">Details</label>
                    <textarea className="w-full border p-2 rounded" rows="4" value={data.journal_details} onChange={e => setData('journal_details', e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1">Aim & Scope</label>
                    <textarea className="w-full border p-2 rounded" value={data.aim_scope} onChange={e => setData('aim_scope', e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1">Mission</label>
                    <textarea className="w-full border p-2 rounded" value={data.mission} onChange={e => setData('mission', e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1">Cover Image</label>
                    <input type="file" onChange={e => setData('cover_image', e.target.files[0])} />
                </div>
                <div>
                    <label className="block mb-1">University Logo</label>
                    <input type="file" onChange={e => setData('university_logo', e.target.files[0])} />
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded" disabled={processing}>Save Journal</button>
            </form>
        </div>
    );
}
