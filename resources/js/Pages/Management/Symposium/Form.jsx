import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ symposium = null }) {
    const { data, setData, post, processing, errors } = useForm({
        symposium_title: symposium?.symposium_title || '',
        university_name: symposium?.university_name || '',
        symposium_details: symposium?.symposium_details || '',
        aim_scope: symposium?.aim_scope || '',
        mission: symposium?.mission || '',
        cover_image: null,
        university_logo: null,
        _method: symposium ? 'PUT' : 'POST'
    });

    const submit = (e) => {
        e.preventDefault();
        if (symposium) {
            post(`/editor/symposium/${symposium.id}`);
        } else {
            post('/editor/symposium');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Head title={symposium ? 'Edit Symposium' : 'Create Symposium'} />
            <h1 className="text-2xl font-bold mb-6">{symposium ? 'Edit' : 'Create'} Symposium</h1>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block mb-1">Symposium Title</label>
                    <input className="w-full border p-2 rounded" value={data.symposium_title} onChange={e => setData('symposium_title', e.target.value)} />
                    {errors.symposium_title && <div className="text-red-500 text-sm">{errors.symposium_title}</div>}
                </div>
                <div>
                    <label className="block mb-1">University Name</label>
                    <input className="w-full border p-2 rounded" value={data.university_name} onChange={e => setData('university_name', e.target.value)} />
                </div>
                <div>
                    <label className="block mb-1">Details</label>
                    <textarea className="w-full border p-2 rounded" rows="4" value={data.symposium_details} onChange={e => setData('symposium_details', e.target.value)} />
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
                <button className="bg-blue-600 text-white px-6 py-2 rounded" disabled={processing}>Save Symposium</button>
            </form>
        </div>
    );
}
