import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ journal = null, pre_filled_title = '' }) {
    const { data, setData, post, processing, errors } = useForm({
        journal_title: journal?.journal_title || pre_filled_title || '',
        university_name: journal?.university_name || 'Sabaragamuwa University of Sri Lanka',
        journal_details: journal?.journal_details || '',
        aim_scope: journal?.aim_scope || '',
        mission: journal?.mission || '',
        issn: journal?.issn || '',
        online_issn: journal?.online_issn || '',
        for_authors: journal?.for_authors || '',
        for_reviewers: journal?.for_reviewers || '',
        editorial_policies: journal?.editorial_policies || '',
        contact_us: journal?.contact_us || '',
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
                    <label className="block mb-1">For Authors (PDF)</label>
                    <input type="file" className="w-full border p-2 rounded" onChange={e => setData('for_authors', e.target.files[0])} />
                    {journal?.for_authors && <p className="text-sm text-gray-500 mt-1">Current: <a href={journal.for_authors} target="_blank" className="text-blue-600 hover:underline">View PDF</a></p>}
                    {errors.for_authors && <div className="text-red-500 text-sm">{errors.for_authors}</div>}
                </div>
                <div>
                    <label className="block mb-1">For Reviewers (PDF)</label>
                    <input type="file" className="w-full border p-2 rounded" onChange={e => setData('for_reviewers', e.target.files[0])} />
                    {journal?.for_reviewers && <p className="text-sm text-gray-500 mt-1">Current: <a href={journal.for_reviewers} target="_blank" className="text-blue-600 hover:underline">View PDF</a></p>}
                    {errors.for_reviewers && <div className="text-red-500 text-sm">{errors.for_reviewers}</div>}
                </div>
                <div>
                    <label className="block mb-1">Editorial Policies (PDF)</label>
                    <input type="file" className="w-full border p-2 rounded" onChange={e => setData('editorial_policies', e.target.files[0])} />
                    {journal?.editorial_policies && <p className="text-sm text-gray-500 mt-1">Current: <a href={journal.editorial_policies} target="_blank" className="text-blue-600 hover:underline">View PDF</a></p>}
                    {errors.editorial_policies && <div className="text-red-500 text-sm">{errors.editorial_policies}</div>}
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
