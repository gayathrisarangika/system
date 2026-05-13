import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import BackendLayout from '@/Layouts/BackendLayout';

export default function Form({ journal = null, pre_filled_title = '' }) {
    const { data, setData, post, processing, errors } = useForm({
        journal_title: journal?.journal_title || pre_filled_title || '',
        university_name: journal?.university_name || 'Sabaragamuwa University of Sri Lanka',
        journal_details: journal?.journal_details || '',
        aim_scope: journal?.aim_scope || '',
        mission: journal?.mission || '',
        issn: journal?.issn || '',
        online_issn: journal?.online_issn || '',
        contact_us: journal?.contact_us || '',
        cover_image: null,
        university_logo: null,
        for_authors: null,
        for_reviewers: null,
        editorial_policies: null,
        _method: journal ? 'PUT' : 'POST'
    });

    const submit = (e) => {
        e.preventDefault();
        if (journal) {
            post(`/editor/journal/${journal.id}`, {
                forceFormData: true,
            });
        } else {
            post('/editor/journal', {
                forceFormData: true,
            });
        }
    };

    return (
        <BackendLayout title={journal ? 'Edit Journal' : 'Create Journal'}>
            <Head title={journal ? 'Edit Journal' : 'Create Journal'} />
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold mb-8 text-slate-900 border-b pb-4">{journal ? 'Edit' : 'Create'} Journal</h1>
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block mb-1">Journal Title</label>
                    <textarea 
                        className={`w-full border p-2 rounded ${pre_filled_title && !journal ? 'bg-gray-100' : ''}`} 
                        rows="2" 
                        value={data.journal_title} 
                        onChange={e => setData('journal_title', e.target.value)} 
                        readOnly={!!(pre_filled_title && !journal)}
                    />
                    {errors.journal_title && <div className="text-red-500 text-sm">{errors.journal_title}</div>}
                    {pre_filled_title && !journal && <p className="text-xs text-gray-500 mt-1">This title has been assigned to your account by the administrator.</p>}
                </div>
                <div>
                    <label className="block mb-1">University Name</label>
                    <input className="w-full border p-2 rounded bg-gray-100" value={data.university_name} readOnly onChange={e => setData('university_name', e.target.value)} />
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
                    <label className="block mb-1">Contact Us</label>
                    <textarea className="w-full border p-2 rounded" rows="4" value={data.contact_us} onChange={e => setData('contact_us', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">ISSN</label>
                        <input className="w-full border p-2 rounded" value={data.issn} onChange={e => setData('issn', e.target.value)} />
                    </div>
                    <div>
                        <label className="block mb-1">Online ISSN</label>
                        <input className="w-full border p-2 rounded" value={data.online_issn} onChange={e => setData('online_issn', e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Cover Image</label>
                        <input type="file" className="w-full border p-2 rounded" onChange={e => setData('cover_image', e.target.files[0])} />
                        {errors.cover_image && <div className="text-red-500 text-sm">{errors.cover_image}</div>}
                        {journal?.cover_image_url && <img src={journal.cover_image_url} alt="Current Cover" className="mt-2 h-20" />}
                    </div>
                    <div>
                        <label className="block mb-1">University Logo</label>
                        <input type="file" className="w-full border p-2 rounded" onChange={e => setData('university_logo', e.target.files[0])} />
                        {errors.university_logo && <div className="text-red-500 text-sm">{errors.university_logo}</div>}
                        {journal?.university_logo_url && <img src={journal.university_logo_url} alt="Current Logo" className="mt-2 h-20" />}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-bold">Guidelines & Policies (PDF)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1 text-sm">Author Guidelines</label>
                            <input type="file" className="w-full border p-2 rounded text-sm" onChange={e => setData('for_authors', e.target.files[0])} />
                            {errors.for_authors && <div className="text-red-500 text-sm">{errors.for_authors}</div>}
                            {journal?.for_authors && <p className="text-xs text-green-600 mt-1">Existing file uploaded</p>}
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">Reviewer Guidelines</label>
                            <input type="file" className="w-full border p-2 rounded text-sm" onChange={e => setData('for_reviewers', e.target.files[0])} />
                            {errors.for_reviewers && <div className="text-red-500 text-sm">{errors.for_reviewers}</div>}
                            {journal?.for_reviewers && <p className="text-xs text-green-600 mt-1">Existing file uploaded</p>}
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">Editorial Policies</label>
                            <input type="file" className="w-full border p-2 rounded text-sm" onChange={e => setData('editorial_policies', e.target.files[0])} />
                            {errors.editorial_policies && <div className="text-red-500 text-sm">{errors.editorial_policies}</div>}
                            {journal?.editorial_policies && <p className="text-xs text-green-600 mt-1">Existing file uploaded</p>}
                        </div>
                    </div>
                </div>

                <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 mt-8" disabled={processing}>Save Journal</button>
            </form>
            </div>
        </BackendLayout>
    );
}
