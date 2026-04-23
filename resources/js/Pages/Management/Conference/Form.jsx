import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ conference = null }) {
    const { data, setData, post, processing, errors } = useForm({
        conference_title: conference?.conference_title || '',
        university_name: conference?.university_name || '',
        conference_details: conference?.conference_details || '',
        aim_scope: conference?.aim_scope || '',
        mission: conference?.mission || '',
        cover_image: null,
        university_logo: null,
        _method: conference ? 'PUT' : 'POST'
    });

    const submit = (e) => {
        e.preventDefault();
        if (conference) {
            post(`/editor/conference/${conference.id}`);
        } else {
            post('/editor/conference');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Head title={conference ? 'Edit Conference' : 'Create Conference'} />
            <h1 className="text-2xl font-bold mb-6">{conference ? 'Edit' : 'Create'} Conference</h1>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block mb-1">Conference Title</label>
                    <input className="w-full border p-2 rounded" value={data.conference_title} onChange={e => setData('conference_title', e.target.value)} />
                    {errors.conference_title && <div className="text-red-500 text-sm">{errors.conference_title}</div>}
                </div>
                <div>
                    <label className="block mb-1">University Name</label>
                    <input className="w-full border p-2 rounded" value={data.university_name} onChange={e => setData('university_name', e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1">Details</label>
                    <textarea className="w-full border p-2 rounded" rows="4" value={data.conference_details} onChange={e => setData('conference_details', e.target.value)} />
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
                <button className="bg-blue-600 text-white px-6 py-2 rounded" disabled={processing}>Save Conference</button>
            </form>
        </div>
    );
}
