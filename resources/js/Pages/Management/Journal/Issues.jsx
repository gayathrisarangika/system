import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Issues({ journal, issues }) {
    const { data, setData, post, reset, errors } = useForm({
        volume: '',
        issue: '',
        year: '',
        published_date: '',
        is_current_issue: false,
        cover_image: null,
        pdf_link: null
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/editor/journal/${journal.id}/issues`, {
            onSuccess: () => reset()
        });
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <Head title="Manage Issues" />
            <h1 className="text-2xl font-bold mb-6">Issues - {journal.journal_title}</h1>

            <form onSubmit={submit} className="bg-gray-50 p-6 rounded mb-8 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm mb-1">Volume</label>
                        <input type="number" className="w-full border p-2 rounded" value={data.volume} onChange={e => setData('volume', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Issue</label>
                        <input type="number" className="w-full border p-2 rounded" value={data.issue} onChange={e => setData('issue', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Year</label>
                        <input type="number" className="w-full border p-2 rounded" value={data.year} onChange={e => setData('year', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Published Date</label>
                        <input type="date" className="w-full border p-2 rounded" value={data.published_date} onChange={e => setData('published_date', e.target.value)} />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div>
                        <label className="block text-sm mb-1">Cover Image</label>
                        <input type="file" onChange={e => setData('cover_image', e.target.files[0])} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Full PDF</label>
                        <input type="file" onChange={e => setData('pdf_link', e.target.files[0])} />
                    </div>
                    <div className="flex items-center mt-6">
                        <input type="checkbox" id="current" checked={data.is_current_issue} onChange={e => setData('is_current_issue', e.target.checked)} />
                        <label htmlFor="current" className="ml-2">Current Issue</label>
                    </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Issue</button>
            </form>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map(issue => (
                    <div key={issue.id} className="bg-white rounded shadow p-4 flex gap-4">
                        <img src={issue.cover_image} className="w-24 h-32 object-cover rounded" />
                        <div>
                            <h3 className="font-bold">Vol. {issue.volume} No. {issue.issue}</h3>
                            <p className="text-sm text-gray-500">{issue.year}</p>
                            <div className="mt-4 flex flex-col gap-2">
                                <Link href={`/editor/journal/issue/${issue.id}/articles`} className="text-blue-600 text-sm">Manage Articles</Link>
                                <button className="text-red-500 text-sm text-left">Delete Issue</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
